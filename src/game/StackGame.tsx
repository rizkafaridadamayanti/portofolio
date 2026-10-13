import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RotateCcw, Volume2, VolumeX, Blocks } from 'lucide-react';
import confetti from 'canvas-confetti';
import { STACK_BLOCKS } from './stackBlocks';
import { Rank } from './Rank';
import { CW, CH, BLOCK_H, DEPTH, START_W, FLOOR_Y, PERFECT_TOL, HS_KEY, PF_KEY, camTargetFor, shade, Block, Debris } from './stackConfig';

export interface StackStats {
  height: number;
  score: number;
  combo: number;
  perfects: number;
  best: number;
  bestPerfects: number;
  status: 'idle' | 'playing' | 'over';
}

export const StackGame: React.FC<{ active?: boolean; onStats?: (s: StackStats) => void }> = ({ active = true, onStats }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [height, setHeight] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [perfects, setPerfects] = useState(0);
  const [bestHeight, setBestHeight] = useState(0);
  const [bestPerfects, setBestPerfects] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const soundRef = useRef(true);
  useEffect(() => { soundRef.current = soundEnabled; }, [soundEnabled]);
  const activeRef = useRef(active);
  useEffect(() => { activeRef.current = active; }, [active]);

  useEffect(() => {
    onStats?.({
      height, score, combo, perfects, best: bestHeight, bestPerfects,
      status: isPlaying ? 'playing' : isGameOver ? 'over' : 'idle',
    });
  }, [height, score, combo, perfects, bestHeight, bestPerfects, isPlaying, isGameOver, onStats]);

  const beep = useCallback((freq: number, type: OscillatorType = 'sine', dur = 0.09) => {
    if (!soundRef.current) return;
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ac = new Ctx();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ac.currentTime);
      gain.gain.setValueAtTime(0.11, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start();
      osc.stop(ac.currentTime + dur);
    } catch { /* diblokir sebelum interaksi */ }
  }, []);

  useEffect(() => {
    const h = parseInt(localStorage.getItem(HS_KEY) || '0', 10);
    const p = parseInt(localStorage.getItem(PF_KEY) || '0', 10);
    if (h) setBestHeight(h);
    if (p) setBestPerfects(p);
  }, []);

  const game = useRef({
    stack: [] as Block[],
    moving: { x: 0, w: START_W, color: '#6b8cae', label: 'HTML', dir: 1, speed: 2.2, y: 0 },
    debris: [] as Debris[],
    cameraY: 0, targetCameraY: 0,
    running: false, over: false, shake: 0,
    height: 0, score: 0, combo: 0, perfects: 0, flash: 0,
  });

  const pickBlock = (i: number) => STACK_BLOCKS[i % STACK_BLOCKS.length];

  const spawnMoving = (fromLeft: boolean, w: number, idx: number) => {
    const g = game.current;
    const b = pickBlock(idx);
    g.moving = {
      x: fromLeft ? -18 : CW - w + 18,
      w, color: b.color, label: b.label,
      dir: fromLeft ? 1 : -1,
      speed: 4.2 + Math.min(idx * 0.14, 3.4),
      y: FLOOR_Y - (idx + 1) * BLOCK_H,
    };
  };

  const startGame = useCallback(() => {
    const g = game.current;
    const base = pickBlock(0);
    g.stack = [{ x: CW / 2 - START_W / 2, w: START_W, color: base.color, label: base.label }];
    g.debris = [];
    g.cameraY = camTargetFor(1);
    g.targetCameraY = camTargetFor(1);
    g.running = true; g.over = false; g.shake = 0;
    g.height = 0; g.score = 0; g.combo = 0; g.perfects = 0; g.flash = 0;
    spawnMoving(true, START_W, 1);
    setHeight(0); setScore(0); setCombo(0); setPerfects(0);
    setIsGameOver(false); setIsPlaying(true);
    beep(440, 'triangle', 0.14);
  }, [beep]);

  const drop = useCallback(() => {
    const g = game.current;
    if (!g.running || g.over) return;
    const prev = g.stack[g.stack.length - 1];
    const cur = { x: g.moving.x, w: g.moving.w };
    const overlapL = Math.max(prev.x, cur.x);
    const overlapR = Math.min(prev.x + prev.w, cur.x + cur.w);
    const overlap = overlapR - overlapL;
    const worldY = g.moving.y;

    if (overlap <= 0) {
      g.debris.push({ x: cur.x, y: worldY, w: cur.w, h: BLOCK_H, vx: g.moving.dir * 2, vy: -2, rot: 0, vrot: (Math.random() - 0.5) * 0.3, color: g.moving.color, life: 200 });
      g.running = false; g.over = true; g.shake = 14;
      beep(140, 'sawtooth', 0.5);
      setIsGameOver(true); setIsPlaying(false);
      setBestHeight((b) => {
        if (g.height > b) {
          localStorage.setItem(HS_KEY, String(g.height));
          confetti({ particleCount: 90, spread: 75, origin: { y: 0.55 }, colors: ['#6b8cae', '#7ba7c9', '#82a94a', '#3a63ab'] });
          return g.height;
        }
        return b;
      });
      setBestPerfects((b) => (g.perfects > b ? (localStorage.setItem(PF_KEY, String(g.perfects)), g.perfects) : b));
      return;
    }

    const diff = Math.abs(cur.x - prev.x);
    const idx = g.stack.length;
    let newX = overlapL;
    let newW = overlap;

    if (diff <= PERFECT_TOL) {
      newX = prev.x;
      newW = Math.min(prev.w + 7, START_W);
      g.combo += 1; g.perfects += 1; g.flash = 1;
      beep(660 + Math.min(g.combo * 40, 480), 'sine', 0.1);
      for (let k = 0; k < 14; k++) {
        g.debris.push({ x: prev.x + prev.w / 2, y: worldY + BLOCK_H / 2, w: 5, h: 5, vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8 - 2, rot: 0, vrot: (Math.random() - 0.5) * 0.4, color: k % 2 ? '#82a94a' : '#7ba7c9', life: 26 });
      }
    } else {
      g.combo = 0;
      beep(320, 'square', 0.08);
      if (cur.x < overlapL) g.debris.push({ x: cur.x, y: worldY, w: overlapL - cur.x, h: BLOCK_H, vx: -1.6 - Math.random(), vy: -1, rot: 0, vrot: -0.12, color: g.moving.color, life: 160 });
      if (cur.x + cur.w > overlapR) g.debris.push({ x: overlapR, y: worldY, w: cur.x + cur.w - overlapR, h: BLOCK_H, vx: 1.6 + Math.random(), vy: -1, rot: 0, vrot: 0.12, color: g.moving.color, life: 160 });
    }

    g.stack.push({ x: newX, w: newW, color: g.moving.color, label: g.moving.label });
    g.height = g.stack.length - 1;
    g.score = g.height * 10 + g.perfects * 15 + g.combo * 5;
    setHeight(g.height); setScore(g.score); setCombo(g.combo); setPerfects(g.perfects);
    g.targetCameraY = camTargetFor(g.stack.length);
    spawnMoving(idx % 2 === 0, newW, idx + 1);
  }, [beep]);

  // satu aksi untuk keyboard & klik: jatuhkan balok saat bermain, selain itu mulai ulang
  const handleAction = useCallback(() => {
    if (isPlaying) drop();
    else startGame();
  }, [isPlaying, drop, startGame]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'Enter') {
        e.preventDefault();
        handleAction();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, handleAction]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;

    const drawBlock = (sx: number, sy: number, w: number, color: string, label: string) => {
      ctx.beginPath();
      ctx.moveTo(sx, sy); ctx.lineTo(sx + DEPTH, sy - DEPTH); ctx.lineTo(sx + w + DEPTH, sy - DEPTH); ctx.lineTo(sx + w, sy); ctx.closePath();
      ctx.fillStyle = shade(color, 0.22); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(sx + w, sy); ctx.lineTo(sx + w + DEPTH, sy - DEPTH); ctx.lineTo(sx + w + DEPTH, sy - DEPTH + BLOCK_H); ctx.lineTo(sx + w, sy + BLOCK_H); ctx.closePath();
      ctx.fillStyle = shade(color, -0.18); ctx.fill();
      ctx.fillStyle = color; ctx.fillRect(sx, sy, w, BLOCK_H);
      ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1;
      ctx.strokeRect(sx + 0.5, sy + 0.5, w - 1, BLOCK_H - 1);
      if (w > 42) {
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px "Space Grotesk", system-ui, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(28,38,58,0.5)'; ctx.shadowBlur = 3;
        ctx.fillText(label, sx + w / 2, sy + BLOCK_H / 2 + 1);
        ctx.restore();
      }
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      // hemat CPU: berhenti menggambar saat ruangan arkade jauh dari kamera
      if (!activeRef.current && !game.current.running) return;
      const g = game.current;
      g.cameraY += (g.targetCameraY - g.cameraY) * 0.08;
      if (g.shake > 0) g.shake *= 0.88;
      if (g.flash > 0) g.flash *= 0.9;

      if (g.running && !g.over) {
        const m = g.moving;
        m.x += m.dir * m.speed;
        const margin = 46;
        if (m.x < -margin) { m.x = -margin; m.dir = 1; }
        if (m.x + m.w > CW + margin) { m.x = CW + margin - m.w; m.dir = -1; }
      }
      for (let i = g.debris.length - 1; i >= 0; i--) {
        const d = g.debris[i];
        d.vy += 0.4; d.x += d.vx; d.y += d.vy; d.rot += d.vrot; d.life -= 1;
        if (d.life <= 0 || d.y - g.cameraY > CH + 200) g.debris.splice(i, 1);
      }

      const sx = (Math.random() - 0.5) * g.shake;
      const sy = (Math.random() - 0.5) * g.shake;
      ctx.setTransform(canvas.width / CW, 0, 0, canvas.height / CH, sx, sy);
      ctx.clearRect(-20, -20, CW + 40, CH + 40);

      const sky = ctx.createLinearGradient(0, 0, 0, CH);
      sky.addColorStop(0, '#fbfcfe'); sky.addColorStop(1, '#e3ebf4');
      ctx.fillStyle = sky; ctx.fillRect(-20, -20, CW + 40, CH + 40);

      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      for (let i = 0; i < 3; i++) {
        const cx = ((i * 260 + g.cameraY * 0.15) % (CW + 240)) - 120;
        const cy = 60 + i * 34;
        ctx.beginPath();
        ctx.arc(cx, cy, 26, 0, Math.PI * 2); ctx.arc(cx + 30, cy + 6, 20, 0, Math.PI * 2); ctx.arc(cx - 26, cy + 8, 18, 0, Math.PI * 2);
        ctx.fill();
      }

      const groundScreenY = FLOOR_Y - g.cameraY;
      if (groundScreenY < CH + 40) {
        const gg = ctx.createLinearGradient(0, groundScreenY, 0, CH + 40);
        gg.addColorStop(0, '#d6dfea'); gg.addColorStop(1, '#c3d0e0');
        ctx.fillStyle = gg; ctx.fillRect(-20, groundScreenY, CW + 40, CH + 60 - groundScreenY);
        ctx.strokeStyle = 'rgba(72,107,146,0.30)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(-20, groundScreenY + 1); ctx.lineTo(CW + 20, groundScreenY + 1); ctx.stroke();
      }

      for (let i = 0; i < g.stack.length; i++) {
        const b = g.stack[i];
        const screenY = FLOOR_Y - (i + 1) * BLOCK_H - g.cameraY;
        if (screenY > CH + 60 || screenY < -60) continue;
        drawBlock(b.x, screenY, b.w, b.color, b.label);
      }

      if (g.running && !g.over) {
        const m = g.moving;
        const screenY = m.y - g.cameraY;
        const topY = FLOOR_Y - g.stack.length * BLOCK_H - g.cameraY;
        const prev = g.stack[g.stack.length - 1];
        ctx.strokeStyle = 'rgba(72,107,146,0.32)'; ctx.setLineDash([4, 6]); ctx.lineWidth = 1.5;
        [prev.x, prev.x + prev.w].forEach((ex) => {
          ctx.beginPath(); ctx.moveTo(ex, screenY + BLOCK_H + 4); ctx.lineTo(ex, topY); ctx.stroke();
        });
        ctx.setLineDash([]);
        drawBlock(m.x, screenY, m.w, m.color, m.label);
      }

      for (const d of g.debris) {
        ctx.save();
        ctx.translate(d.x + d.w / 2, d.y + d.h / 2 - g.cameraY);
        ctx.rotate(d.rot);
        ctx.fillStyle = d.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, d.life / 30));
        ctx.fillRect(-d.w / 2, -d.h / 2, d.w, d.h);
        ctx.restore();
      }
      ctx.globalAlpha = 1;

      if (g.flash > 0.02) {
        ctx.fillStyle = `rgba(126,166,207,${g.flash * 0.3})`;
        ctx.fillRect(-20, -20, CW + 40, CH + 40);
      }

      ctx.setTransform(canvas.width / CW, 0, 0, canvas.height / CH, 0, 0);
      ctx.fillStyle = '#39424f';
      ctx.font = 'bold 15px "Space Grotesk", system-ui, sans-serif';
      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      ctx.fillText(`Tinggi: ${g.height}`, 16, 28);
      if (g.combo > 1) { ctx.fillStyle = '#3a63ab'; ctx.fillText(`Combo ×${g.combo}`, 16, 48); }

      if (!g.running && !g.over) {
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.fillRect(CW / 2 - 150, CH / 2 - 40, 300, 80);
        ctx.strokeStyle = '#6b8cae'; ctx.lineWidth = 2;
        ctx.strokeRect(CW / 2 - 150, CH / 2 - 40, 300, 80);
        ctx.fillStyle = '#39424f';
        ctx.font = 'bold 15px "Space Grotesk", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('TEKAN SPASI / KLIK UNTUK MULAI', CW / 2, CH / 2 - 6);
        ctx.font = '12px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillStyle = '#3a63ab';
        ctx.fillText('Susun menara teknologi setinggi mungkin!', CW / 2, CH / 2 + 16);
      }
    };

    loop();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between pb-2.5 border-b border-[var(--line-soft)] text-xs font-medium">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-[var(--sage)] animate-pulse' : 'bg-[var(--ink-mute)]'}`} />
          <span className="text-[var(--ink-mute)]">STATUS</span>
          <span className="text-[var(--accent-strong)] font-bold">{isPlaying ? 'MENYUSUN' : isGameOver ? 'RUNTUH' : 'SIAP'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-[var(--cream)] border border-[var(--line-soft)] text-[var(--accent-strong)] font-bold">Skor {score}</span>
          <button onClick={() => setSoundEnabled((s) => !s)} className="p-1.5 rounded-lg bg-[var(--cream)] hover:bg-[var(--accent-tint)] text-[var(--ink-soft)]" title={soundEnabled ? 'Matikan suara' : 'Nyalakan suara'}>
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[var(--sage)]" /> : <VolumeX className="w-4 h-4 text-[var(--clay)]" />}
          </button>
        </div>
      </div>

      <div className="relative w-full aspect-[680/440] my-2.5 rounded-xl overflow-hidden bg-[var(--cream)] cursor-pointer shadow-warm-sm border border-[var(--line-soft)]">
        <canvas
          ref={canvasRef}
          width={CW * 2}
          height={CH * 2}
          onClick={handleAction}
          className="w-full h-full block"
        />
        {isGameOver && (
          <div className="absolute inset-0 bg-[var(--paper)]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold font-heading text-[var(--ink)] mb-1 inline-flex items-center gap-2">
              <Blocks className="w-5 h-5 text-[var(--accent)]" /> Menara Runtuh!
            </h3>
            <p className="text-xs text-[var(--ink-soft)] mb-1">
              Tinggi <strong className="text-[var(--accent-strong)] text-base">{height}</strong> · Perfect <strong className="text-[var(--sage)]">{perfects}×</strong>
            </p>
            <p className="text-[11px] text-[var(--ink-mute)] mb-3 font-semibold"><Rank h={height} /></p>
            <button onClick={startGame} className="px-5 py-2.5 rounded-xl bg-[var(--accent-strong)] text-[#f7fafd] text-xs font-semibold shadow-warm-sm hover:-translate-y-0.5 transition-transform flex items-center gap-2 font-heading">
              <RotateCcw className="w-3.5 h-3.5" /> Coba Lagi (Spasi)
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-[var(--ink-mute)]">
        <span>Tekan <strong className="text-[var(--ink-soft)]">SPASI</strong> / <strong className="text-[var(--ink-soft)]">KLIK</strong> untuk menjatuhkan</span>
        <button onClick={drop} disabled={!isPlaying} className="lg:hidden px-4 py-1.5 rounded-lg bg-[var(--accent-strong)] text-[#f7fafd] font-semibold text-xs active:scale-95 disabled:opacity-40">
          Jatuhkan
        </button>
      </div>
    </div>
  );
};
