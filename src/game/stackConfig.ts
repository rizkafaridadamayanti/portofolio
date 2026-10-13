export const CW = 680;
export const CH = 440;
export const BLOCK_H = 34;
export const DEPTH = 9;
export const START_W = 190;
export const FLOOR_Y = 4000;
const GROUND_Y = 384;
const BASE_CAM = FLOOR_Y - BLOCK_H - (GROUND_Y - BLOCK_H);
const FOLLOW_Y = 96;
export const PERFECT_TOL = 5;
export const HS_KEY = 'rf_stack_highscore';
export const PF_KEY = 'rf_stack_perfects';

export const camTargetFor = (stackLen: number) => {
  const movingWorldY = FLOOR_Y - (stackLen + 1) * BLOCK_H;
  return Math.min(BASE_CAM, movingWorldY - FOLLOW_Y);
};

export type Block = { x: number; w: number; color: string; label: string };
export type Debris = { x: number; y: number; w: number; h: number; vx: number; vy: number; rot: number; vrot: number; color: string; life: number };

export const shade = (hex: string, amt: number) => {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255;
  let g = (n >> 8) & 255;
  let b = n & 255;
  const target = amt < 0 ? 0 : 255;
  const p = Math.abs(amt);
  r = Math.round(r + (target - r) * p);
  g = Math.round(g + (target - g) * p);
  b = Math.round(b + (target - b) * p);
  return `rgb(${r},${g},${b})`;
};
