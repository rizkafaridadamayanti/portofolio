import React from 'react';
import { Briefcase, Layers, Award, Building2, ArrowRight, Sparkles, LayoutGrid, PlugZap, BarChart3, Cpu } from 'lucide-react';
import { PERSONAL_INFO, SERVICES } from '../data/profile';
import { Station, DioObject, StationTitle } from '../world/Diorama';
import { CountUp } from '../world/CountUp';

const statIcons: Record<string, React.FC<{ className?: string }>> = { Briefcase, Layers, Award, Building2 };
const svcIcons: Record<string, React.FC<{ className?: string }>> = { LayoutGrid, PlugZap, BarChart3, Cpu };

export const StoryStation: React.FC<{ onNavigate: (id: string) => void }> = ({ onNavigate }) => {
  return (
    <Station index={5}>
      <DioObject x={-560} y={-230} depth={0.42} bob={3} hoverTilt={0} className="w-[26rem]">
        <StationTitle
          kicker="Papan Prestasi"
          accent="var(--green-strong)"
          title={<>Rekam jejak &amp;<br />yang bisa kubantu</>}
          sub="Ditempel di papan gabus — angka nyata + jenis pekerjaan yang kukuasai."
        />
      </DioObject>

      {/* 4 stat cards */}
      {PERSONAL_INFO.statsRow.map((s, i) => {
        const Icon = statIcons[s.icon] || Award;
        return (
          <DioObject
            key={s.label}
            span={1}
            x={-330 + (i % 2) * 210}
            y={-15 + Math.floor(i / 2) * 195}
            depth={0.9}
            bob={((i % 3) + 1) as 1 | 2 | 3}
            hoverTilt={12}
            shadow={130}
          >
            <div className="paper-card p-4 w-[11.5rem] relative">
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[var(--green-strong)] shadow" />
              <div className="w-9 h-9 rounded-xl bg-[var(--green-tint)] text-[var(--green-strong)] flex items-center justify-center mb-2">
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-3xl font-black font-heading text-[var(--ink)] tracking-tight">
                <CountUp value={s.value} />
              </div>
              <div className="text-xs font-bold text-[var(--ink)] font-heading">{s.label}</div>
              <div className="text-[10px] text-[var(--ink-mute)] leading-tight">{s.desc}</div>
            </div>
          </DioObject>
        );
      })}

      {/* Layanan / bisa bantu apa */}
      <DioObject x={230} y={-20} depth={0.72} bob={1} hoverTilt={6} shadow={260} className="w-[21rem]">
        <div className="paper-card p-5">
          <div className="text-[10px] uppercase tracking-wider text-[var(--ink-mute)] font-bold mb-3">Bisa saya bantu</div>
          <div className="space-y-3">
            {SERVICES.map((sv) => {
              const Icon = svcIcons[sv.icon] || LayoutGrid;
              return (
                <div key={sv.title} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--accent-tint)] text-[var(--accent-strong)] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-heading font-bold text-[var(--ink)] text-[13px] leading-tight">{sv.title}</div>
                    <div className="text-[11px] text-[var(--ink-soft)] leading-snug">{sv.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DioObject>

      {/* Catatan ajakan besar */}
      <DioObject x={485} y={205} depth={0.9} bob={2} hoverTilt={8} shadow={200} className="w-[17rem]">
        <div className="p-5" style={{ background: 'linear-gradient(150deg,#fff,var(--green-tint) 60%,#e2eccd)', borderRadius: '2px 2px 6px 6px', boxShadow: '0 24px 44px -20px rgba(46,58,79,0.34)' }}>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[var(--green-strong)] mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Yuk ngobrol
          </div>
          <h3 className="font-heading font-extrabold text-[var(--ink)] text-lg leading-tight mb-2">Punya ide proyek? Mari wujudkan bersama.</h3>
          <p className="text-xs text-[var(--ink-soft)] mb-4">Terbuka untuk magang, part-time, &amp; freelance.</p>
          <button
            onClick={() => onNavigate('contact')}
            className="px-5 py-3 rounded-xl bg-[var(--green-strong)] text-[#f7fbf1] text-sm font-bold shadow-warm-sm hover:-translate-y-0.5 transition-transform flex items-center gap-2 font-heading"
          >
            Hubungi saya <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </DioObject>
    </Station>
  );
};
