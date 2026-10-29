import React, { useState } from 'react';
import { Eye, ArrowUpRight, Server, Layers, Bot, Hotel, Github } from 'lucide-react';
import { PROJECTS_DATA } from '../data/projects';
import { PERSONAL_INFO } from '../data/profile';
import { Project } from '../types';
import { Station, DioObject, StationTitle } from '../world/Diorama';
import { StickyNote } from '../world/props';

/* Gambar sampul; bila gagal dimuat, diganti gradien dari warna aksen proyek */
const ProjectCover: React.FC<{ project: Project }> = ({ project }) => {
  const [failed, setFailed] = useState(false);
  if (failed || !project.image) {
    return <div className="w-full h-full" style={{ background: `linear-gradient(140deg, ${project.accentColor}, var(--accent-soft))` }} />;
  }
  return (
    <img
      src={project.image}
      alt={project.title}
      loading="lazy"
      onError={() => setFailed(true)}
      className="w-full h-full object-cover [filter:grayscale(0.45)_saturate(0.95)_brightness(1.12)] group-hover:[filter:grayscale(0.1)_brightness(1.05)] transition-all duration-500"
    />
  );
};

const FEATURED = PROJECTS_DATA.slice(0, 3); // WanaCafe, FinStart, ProduktifKu

const meta: Record<string, { icon: React.FC<{ className?: string }>; badge: string; label: string }> = {
  wanacafe: { icon: Server, badge: 'Laravel', label: 'Full-stack · POS' },
  finstart: { icon: Layers, badge: 'Vue 3', label: 'Full-stack · Akuntansi' },
  produktifku: { icon: Bot, badge: 'Next.js', label: 'Full-stack + AI' },
  asa: { icon: Bot, badge: 'Node.js', label: 'Bot AI · Otomasi' },
  nusastay: { icon: Hotel, badge: 'Vue', label: 'Frontend · Booking' },
};

export const ProjectsStation: React.FC<{ onOpen: (p: Project) => void }> = ({ onOpen }) => {
  return (
    <Station index={2}>
      <DioObject x={-560} y={-245} depth={0.42} bob={3} hoverTilt={0} className="w-[24rem]">
        <StationTitle
          kicker="Galeri Karya"
          title={<>Proyek pilihan<br />unggulan</>}
          sub="Dari kasir cafe, akuntansi startup, sampai bot AI. Semua ada di GitHub."
        />
      </DioObject>

      {/* Kartu ringkasan — semua 5 proyek */}
      <DioObject x={-390} y={95} depth={0.66} bob={1} hoverTilt={6} shadow={230} className="w-[20rem]">
        <div className="paper-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-wider text-[var(--ink-mute)] font-bold">Semua proyek</span>
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--accent-strong)] hover:gap-1.5 transition-all"
            >
              <Github className="w-3.5 h-3.5" /> GitHub
            </a>
          </div>
          <div className="space-y-2">
            {PROJECTS_DATA.map((p) => {
              const m = meta[p.id];
              const Icon = m?.icon || Layers;
              return (
                <button key={p.id} onClick={() => onOpen(p)} className="w-full flex items-center gap-3 group text-left">
                  <div className="w-8 h-8 rounded-lg bg-[var(--accent-tint)] text-[var(--accent-strong)] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-heading font-bold text-[var(--ink)] group-hover:text-[var(--accent-strong)] transition-colors">{p.title}</div>
                    <div className="text-[10px] text-[var(--ink-mute)] truncate">{m?.label}</div>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[var(--cream)] text-[var(--ink-soft)] shrink-0">{m?.badge}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-3 pt-2.5 border-t border-[var(--line-soft)] flex flex-wrap gap-1">
            {['Laravel', 'Vue 3', 'Next.js', 'Express', 'Supabase', 'MongoDB', 'Gemini', 'DeepSeek'].map((t) => (
              <span key={t} className="px-2 py-0.5 rounded bg-[var(--cream)] border border-[var(--line-soft)] text-[10px] text-[var(--ink-soft)]">{t}</span>
            ))}
          </div>
        </div>
      </DioObject>

      {/* 3 polaroid unggulan */}
      {FEATURED.map((p, i) => {
        const m = meta[p.id];
        return (
          <DioObject
            key={p.id}
            span={1}
            x={-30 + i * 285}
            y={35 + (i === 1 ? -46 : 24)}
            depth={0.84 - i * 0.05}
            bob={((i % 3) + 1) as 1 | 2 | 3}
            hoverTilt={13}
            shadow={220}
            className="w-[15rem]"
          >
            <button onClick={() => onOpen(p)} className="polaroid block w-full text-left group cursor-pointer" style={{ transform: `rotate(${i === 1 ? -2 : i === 0 ? 2 : -1}deg)` }}>
              <div className="washi" style={{ width: 90, top: -12, left: '50%', transform: 'translateX(-50%) rotate(6deg)' }} />
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-[3px] bg-[var(--sand)]">
                <ProjectCover project={p} />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 text-[10px] font-bold text-[var(--ink)]">{m?.badge}</span>
                <span className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-[var(--accent-strong)] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
              <div className="pt-2 pb-0.5 px-0.5">
                <div className="font-heading font-bold text-[var(--ink)] text-sm leading-tight">{p.title}</div>
                <div className="text-[10px] text-[var(--ink-mute)] leading-tight mt-0.5 line-clamp-2">{p.tagline}</div>
                <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-[var(--accent-strong)]">
                  <Eye className="w-3 h-3" /> Lihat detail
                </span>
              </div>
            </button>
          </DioObject>
        );
      })}

      {PERSONAL_INFO.trustBadges.map((b, i) => (
        <DioObject deco decoLabel key={b.title} x={-640 + (i % 2) * 1290} y={-320 + Math.floor(i / 2) * 640} depth={1.15} bob={((i % 3) + 1) as 1 | 2 | 3} hoverTilt={8}>
          <StickyNote color={i % 2 ? '#e8f0e0' : '#e3ecf7'} rotate={i % 2 ? 5 : -5}>
            <b>{b.title}</b>
            <br />
            <span className="text-[var(--ink-mute)] text-xs">{b.desc}</span>
          </StickyNote>
        </DioObject>
      ))}
    </Station>
  );
};
