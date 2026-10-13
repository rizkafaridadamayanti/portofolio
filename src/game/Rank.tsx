import React from 'react';
import { Blocks, Zap, Sprout, Landmark } from 'lucide-react';

const RANKS = [
  { min: 40, label: 'Arsitek Menara Legendaris', Icon: Landmark },
  { min: 25, label: 'Master Stacker', Icon: Zap },
  { min: 12, label: 'Tukang Susun Handal', Icon: Blocks },
  { min: 0, label: 'Pemula Penuh Semangat', Icon: Sprout },
];
const rankOf = (h: number) => RANKS.find((r) => h >= r.min) || RANKS[RANKS.length - 1];

export const Rank: React.FC<{ h: number; className?: string }> = ({ h, className = '' }) => {
  const r = rankOf(h);
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <r.Icon className="w-3.5 h-3.5 shrink-0" />
      {r.label}
    </span>
  );
};
