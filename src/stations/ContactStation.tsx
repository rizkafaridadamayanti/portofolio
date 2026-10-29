import React, { useState } from 'react';
import { Mail, Github, Linkedin, Instagram, Send, CheckCircle2, Copy, Check, MapPin, Heart, Loader2, AlertCircle } from 'lucide-react';
import { PERSONAL_INFO, CONTACT_ENDPOINT, WEB3FORMS_KEY } from '../data/profile';
import { Station, DioObject, StationTitle } from '../world/Diorama';
import { Plant } from '../world/props';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export const ContactStation: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [copied, setCopied] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message || status === 'sending') return;

    // Belum diisi access key → langsung tawarkan fallback aplikasi email
    if (!WEB3FORMS_KEY || WEB3FORMS_KEY.startsWith('GANTI')) {
      setStatus('error');
      return;
    }

    setStatus('sending');
    try {
      const fd = new FormData();
      fd.append('access_key', WEB3FORMS_KEY);
      fd.append('name', form.name);
      fd.append('email', form.email);
      fd.append('message', form.message);
      fd.append('subject', `Pesan portofolio dari ${form.name}`);
      fd.append('from_name', 'Portofolio Rizka');
      fd.append('replyto', form.email);
      const res = await fetch(CONTACT_ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body: fd });
      const data = await res.json().catch(() => null);
      setStatus(res.ok && data?.success ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const mailtoFallback = `mailto:${PERSONAL_INFO.email}?subject=${encodeURIComponent(
    `Pesan portofolio dari ${form.name || ''}`
  )}&body=${encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)}`;

  const copy = () => {
    navigator.clipboard?.writeText(PERSONAL_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const input =
    'w-full px-3.5 py-2.5 rounded-lg bg-[#fbfcff] border border-[var(--line)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-tint)] text-sm text-[var(--ink)] placeholder-[var(--ink-mute)] outline-none transition disabled:opacity-60';

  const socials = [
    { href: PERSONAL_INFO.github, icon: Github, label: 'GitHub' },
    { href: PERSONAL_INFO.linkedin, icon: Linkedin, label: 'LinkedIn' },
    { href: PERSONAL_INFO.instagram, icon: Instagram, label: 'Instagram' },
    { href: `mailto:${PERSONAL_INFO.email}`, icon: Mail, label: 'Email' },
  ];

  return (
    <Station index={6}>
      <DioObject x={-460} y={-190} depth={0.42} bob={3} hoverTilt={0} className="w-[25rem]">
        <StationTitle kicker="Pojok Surat" title={<>Kirim surat<br />ke meja ku</>} sub="Pesan langsung masuk ke email Rizka. Dibalas biasanya < 24 jam." />
      </DioObject>

      {/* Notepad = form */}
      <DioObject x={-40} y={30} depth={0.64} bob={1} hoverTilt={0} shadow={300} className="w-[23rem]">
        <div className="paper-card p-6" style={{ backgroundImage: 'repeating-linear-gradient(#ffffff 0 27px, #eef2f9 27px 28px)' }}>
          {status === 'sent' ? (
            <div className="py-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[var(--sage-tint)] text-[var(--sage)] flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-bold text-[var(--ink)] mb-1">Terkirim ke inbox Rizka!</h3>
              <p className="text-xs text-[var(--ink-soft)]">Terima kasih, {form.name}. Balasan akan dikirim ke {form.email}.</p>
              <button
                onClick={() => { setForm({ name: '', email: '', message: '' }); setStatus('idle'); }}
                className="mt-4 text-[11px] font-semibold text-[var(--accent-strong)] uppercase tracking-wide"
              >
                Kirim pesan lain
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              <div className="font-heading font-bold text-[var(--ink)] text-sm mb-1">Halo Rizka,</div>
              <input className={input} placeholder="Nama kamu" required disabled={status === 'sending'} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className={input} type="email" placeholder="Email kamu" required disabled={status === 'sending'} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <textarea className={`${input} resize-none`} rows={3} placeholder="Pesan / tawaran kamu..." required disabled={status === 'sending'} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />

              {status === 'error' && (
                <div className="flex items-start gap-2 text-[11px] text-[var(--accent-strong)] bg-[var(--accent-tint)] rounded-lg p-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Kirim langsung lewat{' '}
                    <a href={mailtoFallback} className="font-bold underline">aplikasi email kamu</a>{' '}
                    — pesan sudah terisi otomatis.
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-3 rounded-xl bg-[var(--accent-strong)] text-[#f7fafd] text-sm font-bold shadow-warm-sm hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2 font-heading disabled:opacity-70 disabled:translate-y-0"
              >
                {status === 'sending' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Mengirim…</>
                ) : (
                  <><Send className="w-4 h-4" /> Kirim pesan</>
                )}
              </button>
            </form>
          )}
        </div>
      </DioObject>

      {/* Kartu email + prangko sosial */}
      <DioObject span={1} x={330} y={-30} depth={0.92} bob={2} hoverTilt={9} shadow={180} className="w-[15rem]">
        <div className="paper-card p-4">
          <div className="text-[10px] uppercase tracking-wider text-[var(--ink-mute)] font-bold">Email</div>
          <div className="text-xs font-semibold text-[var(--ink)] break-all mb-2">{PERSONAL_INFO.email}</div>
          <div className="flex gap-1.5">
            <a href={`mailto:${PERSONAL_INFO.email}`} className="flex-1 py-1.5 rounded-lg bg-[var(--accent-strong)] text-[#f7fafd] text-[11px] font-semibold text-center">Buka</a>
            <button onClick={copy} className="p-1.5 rounded-lg bg-[var(--cream)] text-[var(--ink-soft)]">{copied ? <Check className="w-3.5 h-3.5 text-[var(--sage)]" /> : <Copy className="w-3.5 h-3.5" />}</button>
          </div>
          <div className="grid grid-cols-4 gap-1.5 mt-3">
            {socials.map(({ href, icon: Icon, label }) => (
              <a key={label} href={href} target={label === 'Email' ? undefined : '_blank'} rel="noreferrer" title={label}
                className="aspect-square rounded-md bg-white border border-[var(--line)] flex items-center justify-center text-[var(--ink-soft)] hover:text-[var(--accent-strong)] hover:border-[var(--accent-soft)] transition"
                style={{ boxShadow: 'inset 0 0 0 2px #fff, 0 0 0 1px var(--line)' }}>
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
          <div className="mt-2.5 pt-2 border-t border-[var(--line-soft)] space-y-0.5 text-[10px] text-[var(--ink-mute)]">
            <div>in · {PERSONAL_INFO.linkedinName}</div>
            <div>ig · {PERSONAL_INFO.instagramHandle}</div>
          </div>
        </div>
      </DioObject>

      {/* Kartu ketersediaan */}
      <DioObject span={1} x={330} y={185} depth={0.86} bob={3} hoverTilt={8} shadow={150} className="w-[15rem]">
        <div className="paper-card p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--sage)] animate-pulse" />
            <span className="text-[11px] font-bold text-[var(--sage)]">Terbuka untuk peluang baru</span>
          </div>
          {[
            ['Balasan', PERSONAL_INFO.responseTime],
            ['Zona waktu', 'WIB (GMT+7)'],
            ['Prioritas', 'Magang · part-time · freelance'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-2 text-[11px]">
              <span className="text-[var(--ink-mute)]">{k}</span>
              <span className="text-[var(--ink)] font-semibold text-right">{v}</span>
            </div>
          ))}
        </div>
      </DioObject>

      <DioObject deco x={585} y={165} depth={1.05} bob={3} hoverTilt={0}>
        <Plant size={104} />
      </DioObject>

      <DioObject deco decoLabel x={-330} y={255} depth={0.6} bob={2} hoverTilt={6}>
        <div className="flex items-center gap-2 text-[11px] text-[var(--ink-mute)] font-mono bg-white/80 px-3 py-1.5 rounded-full border border-[var(--line)]">
          <MapPin className="w-3.5 h-3.5 text-[var(--accent)]" /> Kediri, Indonesia
          <span className="text-[var(--line)]">·</span>
          © {new Date().getFullYear()} · dibuat <Heart className="w-3 h-3 fill-[var(--clay)] text-[var(--clay)]" />
        </div>
      </DioObject>
    </Station>
  );
};
