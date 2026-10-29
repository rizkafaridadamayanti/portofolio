import React from 'react';
import { GraduationCap, CheckCircle2, ArrowRight, Building2, BookOpen, Search, PenTool, Hammer, Rocket, Dot } from 'lucide-react';
import { PERSONAL_INFO, EXPERIENCE, LEARNING, JOURNEY_STEPS } from '../data/profile';
import { Station, DioObject, StationTitle } from '../world/Diorama';
import { StickyNote } from '../world/props';

const stepIcon: Record<string, React.FC<{ className?: string }>> = { Search, PenTool, Hammer, Rocket };

export const AboutStation: React.FC<{ onNavigate: (id: string) => void }> = ({ onNavigate }) => {
  return (
    <Station index={1}>
      <DioObject x={-560} y={-245} depth={0.42} bob={3} hoverTilt={0} className="w-[26rem]">
        <StationTitle
          kicker="Rak Cerita"
          accent="var(--green-strong)"
          title={<>Tentang saya &amp;<br />eksplorasi digital</>}
          sub="Vokasi intensif, magang aktif, dan banyak eksperimen mandiri."
        />
      </DioObject>

      {/* Kartu narasi + kekuatan */}
      <DioObject x={-275} y={30} depth={0.66} bob={1} hoverTilt={5} shadow={300} className="w-[23rem]">
        <div className="paper-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--green-tint)] text-[var(--green-strong)] flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="font-heading font-bold text-[var(--ink)] text-sm">{PERSONAL_INFO.education}</div>
              <div className="text-[11px] text-[var(--ink-mute)]">{PERSONAL_INFO.campus}</div>
            </div>
          </div>
          <p className="text-[13px] text-[var(--ink-soft)] leading-relaxed mb-3">
            Aku terbiasa menerjemahkan kebutuhan fungsional jadi kode yang bersih, mudah dikembangkan,
            dan terdokumentasi rapi — dengan <b className="text-[var(--green-strong)]">Laravel &amp; Vue.js</b>,
            logika <b className="text-[var(--green-strong)]">Python</b>, serta mikrokontroler <b className="text-[var(--green-strong)]">ESP32</b>.
          </p>
          <div className="grid grid-cols-1 gap-1.5">
            {['Arsitektur MVC & database relasional', 'Frontend reaktif & mobile-first', 'Integrasi API / IoT MQTT', 'Belajar cepat teknologi baru'].map((t) => (
              <div key={t} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--sage)] mt-0.5 shrink-0" />
                <span className="text-[12px] text-[var(--ink-soft)] font-medium">{t}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => onNavigate('contact')}
            className="mt-4 w-full py-2.5 rounded-xl bg-[var(--green-strong)] text-[#f7fbf1] text-xs font-semibold shadow-warm-sm hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2 font-heading"
          >
            Ajak kolaborasi <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </DioObject>

      {/* Kartu pengalaman (magang + kuliah) */}
      <DioObject x={225} y={-35} depth={0.74} bob={2} hoverTilt={6} shadow={260} className="w-[22rem]">
        <div className="paper-card p-5">
          <div className="text-[10px] uppercase tracking-wider text-[var(--ink-mute)] font-bold mb-3">Pengalaman</div>
          <div className="space-y-3.5">
            {EXPERIENCE.map((e) => (
              <div key={e.role} className="flex gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${e.now ? 'bg-[var(--accent-strong)] text-white' : 'bg-[var(--cream)] text-[var(--ink-soft)] border border-[var(--line)]'}`}>
                  {e.now ? <Building2 className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-heading font-bold text-[var(--ink)] text-[13px]">{e.role}</span>
                    {e.now && <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-[var(--sage-tint)] text-[var(--sage)]">aktif</span>}
                  </div>
                  <div className="text-[11px] text-[var(--accent-strong)] font-semibold">{e.org}</div>
                  <div className="text-[10px] text-[var(--ink-mute)] mb-1">{e.period}</div>
                  <ul className="space-y-0.5">
                    {e.points.slice(0, e.now ? 3 : 2).map((p) => (
                      <li key={p} className="flex gap-1 text-[11px] text-[var(--ink-soft)] leading-snug">
                        <Dot className="w-3 h-3 shrink-0 mt-0.5 text-[var(--accent)]" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DioObject>

      {/* Kartu sedang dipelajari */}
      <DioObject span={1} x={545} y={185} depth={0.9} bob={3} hoverTilt={10} shadow={170} className="w-[15rem]">
        <div className="paper-card p-4">
          <div className="text-[10px] uppercase tracking-wider text-[var(--green-strong)] font-bold mb-2">Sedang saya dalami</div>
          <ul className="space-y-1.5">
            {LEARNING.map((l) => (
              <li key={l} className="flex gap-1.5 text-[11px] text-[var(--ink-soft)] leading-snug">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] mt-1 shrink-0" />
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </div>
      </DioObject>

      {/* Strip "perjalanan proyek" */}
      {JOURNEY_STEPS.map((s, i) => {
        const Icon = stepIcon[s.icon] || Search;
        return (
          <DioObject span={1} key={s.n} x={-430 + i * 214} y={292} depth={1.0} bob={((i % 3) + 1) as 1 | 2 | 3} hoverTilt={12} shadow={120} className="w-[11.5rem]">
            <div className="paper-card p-3.5">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-lg bg-[var(--accent-tint)] text-[var(--accent-strong)] flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-[var(--ink-mute)]">{s.n}</span>
              </div>
              <div className="font-heading font-bold text-[var(--ink)] text-xs">{s.title}</div>
              <p className="text-[10px] text-[var(--ink-soft)] leading-snug mt-0.5">{s.desc}</p>
            </div>
          </DioObject>
        );
      })}

      <DioObject deco decoLabel x={-470} y={-90} depth={1.08} bob={2} hoverTilt={8}>
        <StickyNote color="#dfe9f6" rotate={-7}>
          <b>5</b> proyek publik
          <br />
          <span className="text-[var(--ink-mute)] text-xs">di GitHub — web, AI, otomasi</span>
        </StickyNote>
      </DioObject>
    </Station>
  );
};
