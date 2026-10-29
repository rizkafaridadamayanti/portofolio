import React, { useState } from 'react';
import { Trophy, Target, Award, Lightbulb } from 'lucide-react';
import { Station, DioObject, StationTitle, useRoomFocus } from '../world/Diorama';
import { StackGame, StackStats } from '../game/StackGame';
import { Rank } from '../game/Rank';
import { StickyNote } from '../world/props';

export const GameStation: React.FC = () => {
  const focus = useRoomFocus();
  const [stats, setStats] = useState<StackStats>({ height: 0, score: 0, combo: 0, perfects: 0, best: 0, bestPerfects: 0, status: 'idle' });

  return (
    <Station index={4}>
      <DioObject x={-455} y={-205} depth={0.42} bob={3} hoverTilt={0} className="w-[27rem]">
        <StationTitle
          kicker="Sudut Arkade"
          accent="var(--accent-strong)"
          title={<>Stack the Stack —<br />susun menaranya!</>}
          sub="Setiap balok satu teknologi yang kupakai. Kejar perfect stack untuk combo."
        />
      </DioObject>

      {/* Kabinet arkade */}
      <DioObject x={175} y={20} depth={0.62} bob={1} hoverTilt={4} shadow={360} className="w-[30rem] dio-game">
        <div className="paper-card p-5 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[var(--accent-strong)] text-white text-[11px] font-bold font-heading tracking-widest">ARCADE</div>
          <StackGame active={focus > 0.35} onStats={setStats} />
        </div>
      </DioObject>

      {/* Papan skor */}
      <DioObject span={1} x={-370} y={70} depth={1.0} bob={2} hoverTilt={10} shadow={150}>
        <div className="paper-card p-4 w-[13rem]">
          <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-[var(--line-soft)]">
            <Trophy className="w-4 h-4 text-[var(--honey)]" />
            <span className="text-xs font-bold font-heading text-[var(--ink)]">Papan Skor</span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <Row icon={<Award className="w-3.5 h-3.5 text-[var(--honey)]" />} label="Tertinggi" value={`${stats.best} lantai`} />
            <Row icon={<Target className="w-3.5 h-3.5 text-[var(--sage)]" />} label="Rekor perfect" value={`${stats.bestPerfects}×`} />
          </div>
          <div className="mt-2 pt-2 border-t border-[var(--line-soft)] text-[11px] font-semibold text-[var(--accent-strong)]"><Rank h={stats.height} /></div>
        </div>
      </DioObject>

      {/* Catatan: kenapa ada game */}
      <DioObject span={1} x={-395} y={280} depth={0.9} bob={3} hoverTilt={9} shadow={140} className="w-[17rem]">
        <StickyNote color="#e6ecf7" rotate={-4}>
          <span className="inline-flex items-center gap-1.5 font-bold text-[var(--accent-strong)]">
            <Lightbulb className="w-3.5 h-3.5" /> Kenapa ada game?
          </span>
          <p className="mt-1 text-[11px] text-[var(--ink-soft)] leading-snug">
            Aku suka detail yang menyenangkan. Game ini kubuat sendiri pakai Canvas API, requestAnimationFrame, &amp; Web Audio — tanpa library game.
          </p>
        </StickyNote>
      </DioObject>

      {/* Chip teknologi pembangun game */}
      <DioObject deco decoLabel x={175} y={355} depth={1.06} bob={2} hoverTilt={6} className="w-[28rem]">
        <div className="flex flex-wrap gap-1.5 justify-center">
          {['Canvas 2D', 'requestAnimationFrame', 'Web Audio API', 'localStorage', 'canvas-confetti'].map((t) => (
            <span key={t} className="px-2.5 py-1 rounded-full bg-white/90 border border-[var(--line)] text-[10px] font-semibold text-[var(--ink-soft)] shadow-warm-sm">
              {t}
            </span>
          ))}
        </div>
      </DioObject>
    </Station>
  );
};

const Row: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center justify-between p-1.5 rounded-lg bg-[var(--cream)]">
    <span className="flex items-center gap-1.5 text-[var(--ink-soft)]">{icon}{label}</span>
    <span className="font-bold text-[var(--ink)]">{value}</span>
  </div>
);
