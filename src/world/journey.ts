// "Dunia Meja Kerja" — stasiun/ruangan yang dilewati kamera.
// Pendekatan: parallax 2D manual (bukan CSS 3D preserve-3d) supaya
// render-nya stabil di semua browser.

export interface StationDef {
  id: string;
  name: string;
  hint: string;
  /** posisi kamera (koordinat dunia, px) saat ruangan ini di tengah */
  x: number;
  y: number;
  /** warna wash ambient ruangan */
  ambient: string;
}

const A = (grad: string) => grad;

export const STATIONS: StationDef[] = [
  { id: 'welcome', name: 'Meja Kerja', hint: 'Kenalan', x: 0, y: 0,
    ambient: A('radial-gradient(1200px 820px at 62% 32%, #eef3fd, var(--tint-blue) 60%, #c6d6f0)') },
  { id: 'about', name: 'Rak Cerita', hint: 'Tentang saya', x: 1850, y: -30,
    ambient: A('radial-gradient(1200px 820px at 40% 40%, #f2f6ea, var(--tint-green) 60%, #d5e0c0)') },
  { id: 'projects', name: 'Galeri Karya', hint: '3 proyek unggulan', x: 3700, y: 20,
    ambient: A('radial-gradient(1200px 820px at 55% 34%, #ffffff, #eef2f9 68%, #e0e7f3)') },
  { id: 'skills', name: 'Papan Perkakas', hint: 'Teknologi & bahasa', x: 5550, y: -20,
    ambient: A('radial-gradient(1200px 820px at 45% 40%, #f4f1fb, var(--tint-lav) 60%, #dbd4ee)') },
  { id: 'game', name: 'Sudut Arkade', hint: 'Mini game', x: 7400, y: 20,
    ambient: A('radial-gradient(1200px 820px at 55% 34%, #eef5fd, var(--tint-sky) 60%, #cde0f2)') },
  { id: 'story', name: 'Papan Prestasi', hint: 'Angka & ajakan', x: 9250, y: -25,
    ambient: A('radial-gradient(1200px 820px at 45% 40%, #f2f6ea, var(--tint-green) 60%, #d5e0c0)') },
  { id: 'contact', name: 'Pojok Surat', hint: 'Hubungi saya', x: 11100, y: 15,
    ambient: A('radial-gradient(1200px 820px at 55% 34%, #ffffff, var(--cloud) 68%, #e2e7f0)') },
];

export const STATION_COUNT = STATIONS.length;
export const JOURNEY_VH = STATION_COUNT * 130;

export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
