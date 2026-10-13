import React from 'react';

/* Perabot diorama sederhana dari bentuk CSS/SVG — gaya "kertas 3D" lembut */

export const Mug: React.FC<{ size?: number; color?: string }> = ({ size = 64, color = 'var(--accent-soft)' }) => (
  <div className="relative preserve-3d" style={{ width: size, height: size * 0.9 }}>
    <div
      className="absolute rounded-[30%_30%_40%_40%/25%_25%_60%_60%]"
      style={{ inset: 0, background: `linear-gradient(160deg,#fff,${color})`, boxShadow: 'inset 0 -6px 10px rgba(46,58,79,0.12)', border: '1px solid var(--line)' }}
    />
    <div
      className="absolute rounded-full"
      style={{ width: size * 0.42, height: size * 0.42, right: -size * 0.28, top: size * 0.22, border: `${size * 0.1}px solid ${color}` }}
    />
    <div className="absolute rounded-full bg-white/70" style={{ inset: `18% 16% auto 16%`, height: size * 0.16 }} />
  </div>
);

export const Plant: React.FC<{ size?: number }> = ({ size = 76 }) => (
  <div className="relative preserve-3d" style={{ width: size, height: size * 1.3 }}>
    {/* daun */}
    {[-28, -10, 10, 28].map((rot, i) => (
      <div
        key={i}
        className="absolute left-1/2 origin-bottom"
        style={{
          width: size * 0.34,
          height: size * (0.7 - Math.abs(rot) * 0.006),
          bottom: size * 0.42,
          transform: `translateX(-50%) rotate(${rot}deg)`,
          background: `linear-gradient(180deg, var(--green-soft), var(--green))`,
          borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%',
        }}
      />
    ))}
    {/* pot */}
    <div
      className="absolute left-1/2 bottom-0"
      style={{
        width: size * 0.62,
        height: size * 0.5,
        transform: 'translateX(-50%)',
        background: 'linear-gradient(160deg,#fff,var(--accent-soft))',
        borderRadius: '10% 10% 22% 22%',
        border: '1px solid var(--line)',
        clipPath: 'polygon(6% 0, 94% 0, 82% 100%, 18% 100%)',
      }}
    />
  </div>
);

export const Keycaps: React.FC<{ w?: number }> = ({ w = 150 }) => (
  <div
    className="grid gap-1 p-2 rounded-xl"
    style={{ width: w, gridTemplateColumns: 'repeat(7,1fr)', background: 'linear-gradient(160deg,#fff,#e9eef7)', border: '1px solid var(--line)', boxShadow: '0 14px 26px -16px rgba(46,58,79,0.3)' }}
  >
    {Array.from({ length: 21 }).map((_, i) => (
      <div key={i} className="rounded-[4px] aspect-square" style={{ background: i % 5 === 0 ? 'var(--accent-soft)' : '#f4f7fc', boxShadow: 'inset 0 -2px 3px rgba(46,58,79,0.12)' }} />
    ))}
  </div>
);

export const StickyNote: React.FC<{ children: React.ReactNode; color?: string; rotate?: number; className?: string }> = ({
  children,
  color = '#eaf1e0',
  rotate = -3,
  className = '',
}) => (
  <div
    className={`p-4 text-[var(--ink)] text-sm font-medium leading-snug ${className}`}
    style={{
      background: color,
      transform: `rotate(${rotate}deg)`,
      boxShadow: '0 16px 30px -16px rgba(46,58,79,0.32)',
      borderRadius: '2px 2px 4px 4px',
      minWidth: 150,
    }}
  >
    {children}
  </div>
);

export const Pennant: React.FC<{ label: string; color?: string }> = ({ label, color = 'var(--accent-strong)' }) => (
  <div className="relative" style={{ filter: 'drop-shadow(0 10px 14px rgba(46,58,79,0.28))' }}>
    <div
      className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white"
      style={{ background: color, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 74%, 0 100%)', paddingBottom: 12 }}
    >
      {label}
    </div>
  </div>
);

export const Cable: React.FC<{ w?: number; h?: number; color?: string }> = ({ w = 200, h = 90, color = 'var(--accent-soft)' }) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" aria-hidden>
    <path d={`M2 8 C ${w * 0.3} ${h}, ${w * 0.7} 0, ${w - 2} ${h - 10}`} stroke={color} strokeWidth={6} strokeLinecap="round" />
  </svg>
);
