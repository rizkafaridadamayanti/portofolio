# Portofolio — Rizka Farida Damayanti

Portofolio interaktif bergaya diorama 3D ("Dunia Meja Kerja"): scroll melewati 7 ruangan, lengkap dengan mini game *Stack the Stack*.

**Stack:** React 19 · Vite · Tailwind CSS v4 · Three.js · Motion

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # output ke dist/
npm run lint     # type-check
```

## Struktur

| Folder | Isi |
| --- | --- |
| `src/data/` | Konten: `profile.ts`, `projects.ts`, `skills.ts` — edit di sini |
| `src/world/` | Diorama 3D, navigasi, dan konteks scroll |
| `src/stations/` | Satu komponen per ruangan |
| `src/game/` | Mini game Stack |
| `src/components/` | Komponen bersama (modal proyek, foto profil) |

Foto profil: `public/assets/rizka.png`. Form kontak memakai [Web3Forms](https://web3forms.com); key diatur di `portfolioData.ts`.
