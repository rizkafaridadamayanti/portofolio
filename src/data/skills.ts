import { SkillItem } from '../types';

export const SKILLS_DATA: SkillItem[] = [
  {
    name: 'Python',
    category: 'Bahasa Pemrograman',
    level: 90,
    experience: 'Analisis Data & MicroPython',
    description: 'Dipakai untuk komputasi algoritma, integrasi kecerdasan buatan (AI prompt pipeline), otomatisasi data, serta pemrograman embedded MicroPython pada ESP32.',
    tags: ['Scripting', 'Data', 'MicroPython', 'AI Integration'],
    icon: 'Terminal',
    color: '#3f79ad'
  },
  {
    name: 'HTML',
    category: 'Frontend',
    level: 95,
    experience: 'Semantic & Accessibility',
    description: 'Pondasi struktur web modern dengan standar HTML5 semantik, ramah SEO, aksesibilitas screen reader (a11y), dan integrasi DOM interaktif.',
    tags: ['HTML5', 'Semantic Web', 'A11y', 'SEO Structure'],
    icon: 'Code2',
    color: '#4f6fa0'
  },
  {
    name: 'CSS',
    category: 'Frontend',
    level: 92,
    experience: 'Responsive & Modern Styling',
    description: 'Penguasaan styling responsif modern dengan Tailwind CSS, CSS Grid, Flexbox, transisi keyframe, dan efek kaca yang estetis.',
    tags: ['Tailwind CSS', 'CSS3', 'Flexbox & Grid', 'Keyframe Animation'],
    icon: 'Palette',
    color: '#5c86bd'
  },
  {
    name: 'PHP',
    category: 'Bahasa Pemrograman',
    level: 88,
    experience: 'Backend Web & MVC',
    description: 'Pengembangan backend yang tertata memakai OOP dan framework Laravel. Terbiasa membangun RESTful API, autentikasi multi-user, dan integrasi database.',
    tags: ['PHP 8+', 'Laravel', 'MVC Architecture', 'REST API', 'MySQL'],
    icon: 'Server',
    color: '#4a5c93'
  },
  {
    name: 'Vue.js',
    category: 'Frontend',
    level: 87,
    experience: 'Single Page Applications (SPA)',
    description: 'Membangun antarmuka reaktif dengan Vue 3 Composition API, Pinia state management, arsitektur komponen modular, dan integrasi chart dinamis.',
    tags: ['Vue 3', 'Composition API', 'Pinia', 'Vue Router', 'Vite'],
    icon: 'Layers',
    color: '#5f883f'
  },
  {
    name: 'Laravel',
    category: 'Backend & Tools',
    level: 88,
    experience: 'Framework Backend Utama',
    description: 'Framework pilihan untuk backend: Eloquent ORM, migration, middleware, queue, autentikasi, hingga struktur service/repository yang mudah diuji. Dipadukan dengan MySQL & alur kerja Git dalam tim.',
    tags: ['Eloquent ORM', 'Migration', 'REST API', 'MySQL', 'Git Flow'],
    icon: 'Server',
    color: '#5b6fa6'
  }
];
