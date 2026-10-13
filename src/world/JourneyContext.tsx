import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { STATIONS, STATION_COUNT, clamp, lerp } from './journey';

interface JourneyState {
  progress: number;
  stationF: number;
  active: number;
  camX: number;
  camY: number;
  parX: number; // tilt kursor → geser halus (px)
  parY: number;
  transition: number; // 0 di stasiun, 1 di tengah pindah
  isDesktop: boolean;
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
  const [isDesktop, setIsDesktop] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [state, setState] = useState({
    progress: 0, stationF: 0, active: 0,
    camX: 0, camY: 0, parX: 0, parY: 0, transition: 0,
  });

  const target = useRef({ stationF: 0, progress: 0 });
  const smooth = useRef({ stationF: 0, parX: 0, parY: 0 });
  const mouse = useRef({ x: 0, y: 0 });
  const raf = useRef(0);

  useEffect(() => {
    const mqW = window.matchMedia('(min-width: 1024px)');
    // pointer kasar (HP) → mode fallback; reduced-motion → fallback juga
    const mqCoarse = window.matchMedia('(pointer: coarse)');
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setIsDesktop(mqW.matches && !mqCoarse.matches && !mqMotion.matches);
    update();
    mqW.addEventListener('change', update);
    mqCoarse.addEventListener('change', update);
    mqMotion.addEventListener('change', update);
    return () => {
      mqW.removeEventListener('change', update);
      mqCoarse.removeEventListener('change', update);
      mqMotion.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
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
    if (!isDesktop) return;
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX / window.innerWidth - 0.5;
      mouse.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [isDesktop]);

  useEffect(() => {
    const tick = () => {
      raf.current = requestAnimationFrame(tick);
      const s = smooth.current;
      const t = target.current;

      s.stationF = lerp(s.stationF, t.stationF, 0.14);
      if (Math.abs(t.stationF - s.stationF) < 0.0015) s.stationF = t.stationF;
      s.parX = lerp(s.parX, isDesktop ? mouse.current.x : 0, 0.05);
      s.parY = lerp(s.parY, isDesktop ? mouse.current.y : 0, 0.05);

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
  }, [isDesktop]);

  const goTo = useCallback((i: number) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const y = (clamp(i, 0, STATION_COUNT - 1) / (STATION_COUNT - 1)) * max;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }, []);

  const value = useMemo<JourneyState>(
    () => ({ ...state, isDesktop, zoomed, setZoomed, goTo }),
    [state, isDesktop, zoomed, goTo]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};
