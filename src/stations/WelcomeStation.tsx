import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, Sparkles, MousePointerClick, Building2, MapPin, GraduationCap, Clock } from 'lucide-react';
import { PERSONAL_INFO } from '../data/profile';
import { ProfileImage } from '../components/ProfileImage';
import { Station, DioObject } from '../world/Diorama';
import { Mug, Plant, Keycaps, Pennant } from '../world/props';

export const WelcomeStation: React.FC = () => {
  const [ti, setTi] = useState(0);
  const [flip, setFlip] = useState(false);
  useEffect(() => {
    const id = setInterval(() => {
      setFlip(true);
      setTimeout(() => {
        setTi((p) => (p + 1) % PERSONAL_INFO.kineticTitles.length);
        setFlip(false);
      }, 320);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const facts = [
    { icon: MapPin, label: 'Lokasi', value: 'Kediri, Indonesia (WIB)' },
    { icon: GraduationCap, label: 'Kuliah', value: 'D3 MI · Politeknik Negeri Malang · IPK 3.88' },
    { icon: Clock, label: 'Balasan', value: PERSONAL_INFO.responseTime },
  ];

  return (
    <Station index={0}>
      {/* Kartu sapaan */}
      <DioObject x={-455} y={-55} depth={0.66} bob={3} hoverTilt={6} shadow={300} className="w-[22rem]">
        <div className="paper-card p-7">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-tint)] text-[var(--accent-strong)] text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            {PERSONAL_INFO.greeting}
          </div>
          <h1 className="font-heading font-extrabold text-[var(--ink)] leading-[1.06] text-4xl xl:text-5xl">
            Rizka Farida
            <br />
            <span className="text-[var(--accent-strong)]">Damayanti</span>
          </h1>
          <div className="mt-4 h-8 overflow-hidden">
            <span
              className={`inline-block text-lg font-bold text-[var(--green-strong)] transition-all duration-300 ${
                flip ? 'opacity-0 -translate-y-3' : 'opacity-100'
              }`}
            >
              {PERSONAL_INFO.kineticTitles[ti]}
            </span>
          </div>
          <p className="mt-3 text-sm text-[var(--ink-soft)] leading-relaxed">
            Mahasiswa D3 Manajemen Informatika Politeknik Negeri Malang. Aku membangun web yang rapi,
            interaktif, dan sedikit iseng bereksperimen dengan AI &amp; IoT.
          </p>
          <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-[var(--ink-mute)]">
            <MousePointerClick className="w-4 h-4 text-[var(--accent)]" />
            <span className="hidden lg:inline">Gulir untuk menjelajah ruang kerjaku</span>
            <span className="lg:hidden">Geser ke kanan untuk menjelajah ruang kerjaku</span>
            <ArrowDown className="hidden lg:block w-4 h-4 animate-bounce" />
            <ArrowRight className="lg:hidden w-4 h-4" />
          </div>
        </div>
      </DioObject>

      {/* Kartu magang aktif */}
      <DioObject x={-430} y={230} depth={0.82} bob={2} hoverTilt={9} shadow={220} className="w-[20rem]">
        <div className="paper-card p-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[var(--accent-strong)] text-white flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--sage)]">● Magang aktif</span>
              <span className="text-[10px] text-[var(--ink-mute)]">sejak {PERSONAL_INFO.currentSince}</span>
            </div>
            <div className="font-heading font-bold text-[var(--ink)] text-sm leading-tight">{PERSONAL_INFO.currentJob}</div>
            <div className="text-xs text-[var(--accent-strong)] font-semibold">{PERSONAL_INFO.currentCompany}</div>
          </div>
        </div>
      </DioObject>

      {/* Foto polaroid */}
      <DioObject x={230} y={-30} depth={0.86} bob={2} hoverTilt={10} shadow={230} className="w-[17rem]">
        <div className="polaroid" style={{ transform: 'rotate(4deg)' }}>
          <div className="washi" style={{ width: 120, top: -14, left: 60, transform: 'rotate(-8deg)' }} />
          <ProfileImage rounded="rounded-[3px]" className="w-full aspect-[4/5] bg-gradient-to-b from-[#eef3fb] to-[#e2ebf7]" />
          <div className="absolute left-0 right-0 bottom-2 text-center font-heading font-bold text-[var(--ink-soft)] text-sm">
            Rizka · Kediri
          </div>
        </div>
      </DioObject>

      {/* Kartu fakta cepat */}
      <DioObject x={420} y={165} depth={0.94} bob={3} hoverTilt={11} shadow={170} className="w-[15.5rem]">
        <div className="paper-card p-4 space-y-2.5">
          <div className="text-[10px] uppercase tracking-wider text-[var(--ink-mute)] font-bold">Sekilas</div>
          {facts.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-2.5">
              <Icon className="w-4 h-4 text-[var(--accent)] mt-0.5 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-[var(--ink-mute)] uppercase tracking-wide">{label}</div>
                <div className="text-xs font-semibold text-[var(--ink)] leading-tight">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </DioObject>

      {/* Perabot kecil */}
      <DioObject deco x={-40} y={340} depth={1.12} bob={1} hoverTilt={14}>
        <Mug size={78} />
      </DioObject>
      <DioObject deco x={605} y={205} depth={0.72} bob={2} hoverTilt={10}>
        <Plant size={96} />
      </DioObject>
      <DioObject deco x={185} y={345} depth={1.16} bob={3} hoverTilt={8}>
        <Keycaps w={190} />
      </DioObject>
      <DioObject deco x={430} y={-260} depth={0.78} bob={1} hoverTilt={6}>
        <Pennant label="Open to Work" color="var(--green-strong)" />
      </DioObject>
      <DioObject deco x={-380} y={-270} depth={0.5} bob={2} hoverTilt={5}>
        <Pennant label="Politeknik Negeri Malang · D3 MI" color="var(--accent-strong)" />
      </DioObject>
    </Station>
  );
};
