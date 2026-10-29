import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { STATIONS, STATION_COUNT, clamp, lerp } from './journey';

/* ============================================================
   Mode tata letak — dipisah dari state kamera supaya komponen
   yang hanya perlu tahu "mode" tidak ikut render ulang tiap frame.
   ============================================================ */
export interface LayoutState {
  /** layar lebar (>= 1024px): dock penuh + parallax kursor */
  wide: boolean;
  /** pengguna tidak meminta reduced-motion */
  motionOk: boolean;
  /** panggung tetap + kamera menjelajah (sama dengan `wide`) */
  isDesktop: boolean;
  /** HP: rel horizontal — satu ruangan satu layar, panah menggeser ke kanan */
  isMobileDiorama: boolean;
}

const LayoutCtx = createContext<LayoutState>({
  wide: false,
  motionOk: true,
  isDesktop: false,
  isMobileDiorama: false,
});
export const useLayout = () => useContext(LayoutCtx);

interface JourneyState {
  progress: number;
  stationF: number;
  active: number;
  camX: number;
  camY: number;
  parX: number; // tilt kursor → geser halus (px)
  parY: number;
  transition: number; // 0 di stasiun, 1 di tengah pindah
  zoomed: boolean;
  setZoomed: (v: boolean) => void;
  goTo: (i: number) => void;
}

const Ctx = createContext<JourneyState | null>(null);
export const useJourney = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useJourney di luar JourneyProvider');
  return v;
};

const StationXCtx = createContext(0);
export const StationXProvider = StationXCtx.Provider;
export const useStationX = () => useContext(StationXCtx);

// indeks stasiun (untuk offset)
const StationIdxCtx = createContext(0);
export const StationIndexProvider = StationIdxCtx.Provider;
export const useStationIndex = () => useContext(StationIdxCtx);

export const JourneyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [layout, setLayout] = useState<LayoutState>({
    wide: false,
    motionOk: true,
    isDesktop: false,
    isMobileDiorama: true,
  });
  const [zoomed, setZoomed] = useState(false);
  const [state, setState] = useState({
    progress: 0, stationF: 0, active: 0,
    camX: 0, camY: 0, parX: 0, parY: 0, transition: 0,
  });

  const target = useRef({ stationF: 0, progress: 0 });
  const smooth = useRef({ stationF: 0, parX: 0, parY: 0 });
  const mouse = useRef({ x: 0, y: 0 });
  const raf = useRef(0);
  const layoutRef = useRef(layout);
  const trackRef = useRef<HTMLElement | null>(null);
  const roomStart = useRef<number[]>([]);
  const roomCenter = useRef<number[]>([]);
  const docHeight = useRef(0);

  useEffect(() => {
    layoutRef.current = layout;
  }, [layout]);

  useEffect(() => {
    const mqWide = window.matchMedia('(min-width: 1024px)');
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      const wide = mqWide.matches;
      const motionOk = !mqMotion.matches;
      setLayout({ wide, motionOk, isDesktop: wide, isMobileDiorama: !wide && motionOk });
    };
    update();
    mqWide.addEventListener('change', update);
    mqMotion.addEventListener('change', update);
    return () => {
      mqWide.removeEventListener('change', update);
      mqMotion.removeEventListener('change', update);
    };
  }, []);

  /* Ukur posisi tiap ruangan: di HP jaraknya di dalam rel horizontal,
     sedangkan pada mode daftar (reduced-motion) pakai posisi vertikal. */
  const measureRooms = useCallback(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-station]'));
    if (!els.length) return;
    const track = els[0].closest<HTMLElement>('[data-track]');
    trackRef.current = track;

    if (track) {
      const base = track.getBoundingClientRect().left - track.scrollLeft;
      roomStart.current = els.map((el) => el.getBoundingClientRect().left - base);
      roomCenter.current = els.map((el, i) => roomStart.current[i] + el.getBoundingClientRect().width / 2);
    } else {
      roomStart.current = els.map((el) => el.getBoundingClientRect().top + window.scrollY);
      roomCenter.current = els.map((el) => el.getBoundingClientRect().top + window.scrollY + el.offsetHeight / 2);
    }
    docHeight.current = document.documentElement.scrollHeight;
  }, []);

  /** 0..N-1 kontinu — ruangan mana yang ada di titik tengah layar. */
  const stationAtPoint = useCallback((probe: number) => {
    const pos = roomCenter.current;
    if (pos.length < 2) return 0;
    if (probe <= pos[0]) return 0;
    for (let i = 0; i < pos.length - 1; i += 1) {
      if (probe < pos[i + 1]) {
        const span = Math.max(1, pos[i + 1] - pos[i]);
        return i + clamp((probe - pos[i]) / span, 0, 1);
      }
    }
    return pos.length - 1;
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      target.current.progress = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;

      if (layoutRef.current.wide) {
        target.current.stationF = target.current.progress * (STATION_COUNT - 1);
        return;
      }

      const track = trackRef.current;
      if (track) {
        target.current.stationF = stationAtPoint(track.scrollLeft + track.clientWidth / 2);
        return;
      }

      if (doc.scrollHeight !== docHeight.current) measureRooms();
      target.current.stationF = stationAtPoint(window.scrollY + window.innerHeight / 2);
    };
    const onResize = () => {
      measureRooms();
      onScroll();
    };

    measureRooms();
    onScroll();
    const track = trackRef.current;
    track?.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      track?.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [measureRooms, stationAtPoint, layout.isMobileDiorama, layout.motionOk]);

  useEffect(() => {
    if (!layout.isDesktop) return;
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX / window.innerWidth - 0.5;
      mouse.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [layout.isDesktop]);

  useEffect(() => {
    const tick = () => {
      raf.current = requestAnimationFrame(tick);
      const s = smooth.current;
      const t = target.current;
      const desktop = layoutRef.current.isDesktop;

      s.stationF = lerp(s.stationF, t.stationF, 0.14);
      if (Math.abs(t.stationF - s.stationF) < 0.0015) s.stationF = t.stationF;
      s.parX = lerp(s.parX, desktop ? mouse.current.x : 0, 0.05);
      s.parY = lerp(s.parY, desktop ? mouse.current.y : 0, 0.05);

      const sf = s.stationF;
      const lo = clamp(Math.floor(sf), 0, STATION_COUNT - 1);
      const hi = clamp(lo + 1, 0, STATION_COUNT - 1);
      const k = sf - lo;
      const frac = sf - Math.floor(sf);
      const transition = Math.sin(clamp(frac, 0, 1) * Math.PI);

      const camX = lerp(STATIONS[lo].x, STATIONS[hi].x, k);
      const camY = lerp(STATIONS[lo].y, STATIONS[hi].y, k);

      setState((prev) => {
        const next = {
          progress: t.progress,
          stationF: sf,
          active: Math.round(sf),
          camX,
          camY,
          parX: s.parX * 26,
          parY: s.parY * 18,
          transition,
        };
        if (
          Math.abs(prev.stationF - next.stationF) < 0.0003 &&
          Math.abs(prev.parX - next.parX) < 0.03 &&
          Math.abs(prev.parY - next.parY) < 0.03
        ) {
          return prev;
        }
        return next;
      });
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const goTo = useCallback((i: number) => {
    const idx = clamp(i, 0, STATION_COUNT - 1);

    // layar lebar: kamera dijalankan lewat gulir dokumen
    if (layoutRef.current.wide) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: (idx / (STATION_COUNT - 1)) * max, behavior: 'smooth' });
      return;
    }

    if (roomStart.current.length !== STATION_COUNT) measureRooms();
    const pos = roomStart.current[idx];
    if (typeof pos !== 'number') return;

    const track = trackRef.current;
    if (track) {
      // HP: geser rel horizontal ke ruangan tujuan
      track.scrollTo({ left: pos, behavior: 'smooth' });
      return;
    }

    // reduced-motion: daftar vertikal
    window.scrollTo({ top: Math.max(0, pos - 12), behavior: 'smooth' });
  }, [measureRooms]);

  const value = useMemo<JourneyState>(
    () => ({ ...state, zoomed, setZoomed, goTo }),
    [state, zoomed, goTo]
  );

  return (
    <LayoutCtx.Provider value={layout}>
      <Ctx.Provider value={value}>{children}</Ctx.Provider>
    </LayoutCtx.Provider>
  );
};
