import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { STATIONS, STATION_COUNT, clamp, lerp } from './journey';

/** Lebar komposisi satu ruangan di desktop (px) — dasar skala untuk layar sempit. */
const DESIGN_WIDTH = 1750;

/* ============================================================
   Mode tata letak — dipisah dari state kamera supaya komponen
   yang hanya perlu tahu "mode" tidak ikut render ulang tiap frame.
   ============================================================ */
export interface LayoutState {
  /** layar lebar (>= 1024px): dock penuh + parallax kursor */
  wide: boolean;
  /** pengguna tidak meminta reduced-motion */
  motionOk: boolean;
  /** panggung tetap + kamera menjelajah (semua lebar layar) */
  diorama: boolean;
  /** skala panggung agar komposisi ruangan muat di layar sempit */
  stageScale: number;
}

const LayoutCtx = createContext<LayoutState>({
  wide: false,
  motionOk: true,
  diorama: true,
  stageScale: 1,
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
    diorama: true,
    stageScale: 1,
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

  useEffect(() => {
    layoutRef.current = layout;
  }, [layout]);

  useEffect(() => {
    const mqWide = window.matchMedia('(min-width: 1024px)');
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const update = () => {
      const wide = mqWide.matches;
      const motionOk = !mqMotion.matches;
      setLayout({
        wide,
        motionOk,
        diorama: motionOk,
        stageScale: wide ? 1 : clamp(window.innerWidth / DESIGN_WIDTH, 0.16, 1),
      });
    };

    update();
    mqWide.addEventListener('change', update);
    mqMotion.addEventListener('change', update);
    window.addEventListener('resize', update);
    return () => {
      mqWide.removeEventListener('change', update);
      mqMotion.removeEventListener('change', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
      target.current.progress = p;
      target.current.stationF = p * (STATION_COUNT - 1);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    if (!layout.wide) return;
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX / window.innerWidth - 0.5;
      mouse.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [layout.wide]);

  useEffect(() => {
    const tick = () => {
      raf.current = requestAnimationFrame(tick);
      const s = smooth.current;
      const t = target.current;
      const wide = layoutRef.current.wide;

      s.stationF = lerp(s.stationF, t.stationF, 0.14);
      if (Math.abs(t.stationF - s.stationF) < 0.0015) s.stationF = t.stationF;
      s.parX = lerp(s.parX, wide ? mouse.current.x : 0, 0.05);
      s.parY = lerp(s.parY, wide ? mouse.current.y : 0, 0.05);

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
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const y = (clamp(i, 0, STATION_COUNT - 1) / (STATION_COUNT - 1)) * max;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }, []);

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
