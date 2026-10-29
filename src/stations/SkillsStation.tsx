import React, { useState } from 'react';
import { Terminal, Code2, Palette, Server, Layers, Boxes } from 'lucide-react';
import { SKILLS_DATA } from '../data/skills';
import { LEARNING } from '../data/profile';
import { SkillItem } from '../types';
import { Station, DioObject, StationTitle } from '../world/Diorama';
import { StickyNote } from '../world/props';

const SNIPPETS: Record<string, { file: string; code: string }> = {
  Python: { file: 'sensor.py', code: `import machine, dht\n\nsensor = dht.DHT22(machine.Pin(4))\n\ndef read():\n    sensor.measure()\n    return sensor.temperature()` },
  HTML: { file: 'card.html', code: `<article class="project" aria-labelledby="t">\n  <h3 id="t">Wanacafe POS</h3>\n  <time datetime="2024-05">Mei 2024</time>\n</article>` },
  CSS: { file: 'glass.css', code: `.glass {\n  backdrop-filter: blur(14px);\n  background: rgba(255,255,255,.72);\n  border: 1px solid rgba(255,255,255,.8);\n}` },
  PHP: { file: 'Order.php', code: `public function store(Request $r)\n{\n    $data = $r->validate(['total' => 'required|numeric']);\n    return response()->json(Order::create($data), 201);\n}` },
  'Vue.js': { file: 'Budget.vue', code: `const total = computed(() =>\n  new Intl.NumberFormat('id-ID', {\n    style: 'currency', currency: 'IDR',\n  }).format(store.balance)\n)` },
  Laravel: { file: 'routes/api.php', code: `Route::apiResource('orders', OrderController::class)\n    ->middleware('auth:sanctum');\n\n// OrderController\npublic function index()\n{\n    return OrderResource::collection(\n        Order::latest()->paginate(20)\n    );\n}` },
};

const icon = (n: string) =>
  n === 'Python' ? Terminal : n === 'HTML' ? Code2 : n === 'CSS' ? Palette : n === 'PHP' ? Server : n === 'Laravel' ? Boxes : Layers;

export const SkillsStation: React.FC = () => {
  const [active, setActive] = useState<SkillItem>(SKILLS_DATA[0]);

  return (
    <Station index={3}>
      <DioObject x={-470} y={-210} depth={0.42} bob={3} hoverTilt={0} className="w-[26rem]">
        <StationTitle
          kicker="Papan Perkakas"
          accent="var(--accent-strong)"
          title={<>Kotak perkakas<br />&amp; bahasa</>}
          sub="Ambil satu perkakas — blueprint kodenya terbuka."
        />
      </DioObject>

      {/* Pegboard: 6 perkakas (3 x 2) */}
      {SKILLS_DATA.map((s, i) => {
        const Icon = icon(s.name);
        const isOn = active.name === s.name;
        return (
          <DioObject span={1} key={s.name} x={-210 + (i % 3) * 118} y={-70 + Math.floor(i / 3) * 138} depth={0.96} bob={((i % 3) + 1) as 1 | 2 | 3} hoverTilt={16}>
            <button onClick={() => setActive(s)} className="flex flex-col items-center group focus:outline-none">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-warm-sm transition-all ${isOn ? 'scale-110 text-white' : 'bg-white text-[var(--ink-soft)] border border-[var(--line)]'}`}
                style={{ background: isOn ? s.color : undefined }}
              >
                <Icon className="w-7 h-7" />
              </div>
              <span className={`mt-2 text-[11px] font-bold font-heading ${isOn ? 'text-[var(--accent-strong)]' : 'text-[var(--ink-soft)]'}`}>{s.name}</span>
              <span className="text-[9px] text-[var(--ink-mute)]">{s.level}% mahir</span>
            </button>
          </DioObject>
        );
      })}

      {/* Blueprint */}
      <DioObject x={335} y={30} depth={0.64} bob={1} hoverTilt={5} shadow={280} className="w-[23rem]">
        <div className="paper-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--line-soft)] text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--clay)]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--honey)]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--sage)]" />
              <span className="ml-2 font-mono text-[var(--ink-mute)]">{SNIPPETS[active.name]?.file}</span>
            </div>
            <span className="text-[10px] font-bold" style={{ color: active.color }}>{active.name}</span>
          </div>
          <pre className="font-mono text-[11px] leading-relaxed text-[var(--ink)] p-4 bg-[#fbfcff] overflow-x-auto"><code>{SNIPPETS[active.name]?.code}</code></pre>
          <div className="px-4 py-3 border-t border-[var(--line-soft)]">
            <div className="flex justify-between text-[11px] font-semibold mb-1">
              <span className="text-[var(--ink-mute)]">{active.experience}</span>
              <span className="text-[var(--accent-strong)]">{active.level}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[var(--sand)] overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${active.level}%`, background: active.color }} />
            </div>
            <p className="text-[11px] text-[var(--ink-soft)] leading-snug mt-2.5">{active.description}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {active.tags.map((t) => (
                <span key={t} className="px-2 py-0.5 rounded bg-[var(--cream)] border border-[var(--line-soft)] text-[10px] text-[var(--ink-soft)]">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </DioObject>

      {/* Catatan: sedang dipelajari */}
      <DioObject x={-360} y={245} depth={1.02} bob={2} hoverTilt={10} shadow={140} className="w-[16rem]">
        <StickyNote color="#e6ecf7" rotate={-4}>
          <b>Sedang naik level:</b>
          <ul className="mt-1 space-y-0.5">
            {LEARNING.map((l) => (
              <li key={l} className="text-[11px] text-[var(--ink-soft)] leading-snug">• {l}</li>
            ))}
          </ul>
        </StickyNote>
      </DioObject>
    </Station>
  );
};
