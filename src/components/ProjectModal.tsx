import React from 'react';
import { X, CheckCircle2, Server, Github, ArrowUpRight } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[var(--ink)]/40 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      />

      <div className="relative w-full max-w-3xl rounded-[1.75rem] bg-[var(--paper)] border border-[var(--line)] shadow-warm z-10 overflow-hidden my-8 animate-in zoom-in-95 duration-200 text-left">

        {/* Header dengan gambar + tint aksen */}
        <div className="relative p-6 sm:p-8 text-[#ffffff] overflow-hidden">
          {project.image && (
            <img src={project.image} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover [filter:grayscale(0.45)_saturate(0.95)_brightness(1.05)]" />
          )}
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${project.accentColor}f2, ${project.accentColor}d9 55%, var(--accent-strong)e6)` }}
          />
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute top-0 right-0 p-2 rounded-full bg-white/25 hover:bg-white/40 text-white transition-colors focus:outline-none"
              aria-label="Tutup Detail Proyek"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-block px-3 py-1 rounded-full bg-white/25 backdrop-blur-md text-xs font-semibold mb-3">
              {project.category}
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-heading mb-2 drop-shadow">{project.title}</h3>
            <p className="text-sm sm:text-base text-white/95 max-w-xl drop-shadow-sm">{project.tagline}</p>
          </div>
        </div>

        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto space-y-6">
          <div>
            <h4 className="text-xs uppercase tracking-wider text-[var(--ink-mute)] font-bold mb-2">Deskripsi &amp; Latar Belakang</h4>
            <p className="text-sm sm:text-base text-[var(--ink-soft)] leading-relaxed">{project.fullStory}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--cream)] border border-[var(--line)]">
            <h4 className="text-xs uppercase tracking-wider text-[var(--accent-strong)] font-bold mb-1 flex items-center gap-1.5">
              <Server className="w-4 h-4" />
              <span>Arsitektur Sistem</span>
            </h4>
            <p className="text-xs sm:text-sm font-mono text-[var(--ink-soft)] font-medium">{project.architecture}</p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider text-[var(--ink-mute)] font-bold mb-3">Fitur Utama &amp; Implementasi</h4>
            <div className="space-y-2.5">
              {project.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--cream)] border border-[var(--line-soft)]">
                  <CheckCircle2 className="w-4 h-4 text-[var(--sage)] mt-0.5 shrink-0" />
                  <span className="text-xs sm:text-sm text-[var(--ink-soft)]">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider text-[var(--ink-mute)] font-bold mb-3">Metrik Kinerja</h4>
            <div className="grid grid-cols-3 gap-3">
              {project.metrics.map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[var(--accent-tint)] border border-[var(--line)] text-center">
                  <div className="text-lg sm:text-xl font-bold text-[var(--accent-strong)] font-heading">{m.value}</div>
                  <div className="text-[11px] text-[var(--ink-soft)] font-medium mt-0.5">{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider text-[var(--ink-mute)] font-bold mb-2.5">Teknologi yang Digunakan</h4>
            <div className="flex flex-wrap gap-2">
              {project.featuredTech.map((tech) => (
                <span key={tech} className="px-3 py-1 rounded-lg bg-[var(--cream)] text-[var(--ink-soft)] text-xs font-medium border border-[var(--line-soft)]">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[var(--line-soft)] bg-[var(--cream)] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[var(--ink)] text-white text-xs font-semibold hover:-translate-y-0.5 transition-transform font-heading inline-flex items-center gap-2"
              >
                <Github className="w-4 h-4" /> Lihat di GitHub <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[var(--accent-tint)] text-[var(--accent-strong)] text-xs font-semibold hover:-translate-y-0.5 transition-transform font-heading inline-flex items-center gap-2"
              >
                Demo <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[var(--accent-strong)] text-[#f7fafd] text-xs font-semibold hover:-translate-y-0.5 transition-transform font-heading"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
