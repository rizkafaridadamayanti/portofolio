/*
  Foto pribadi Rizka.
  Letakkan file foto di: public/assets/rizka.png  (atau .jpg — sesuaikan path di bawah)
  Jika file belum ada, komponen otomatis menampilkan avatar inisial "RFD".
*/
export const PROFILE_PHOTO = '/assets/rizka.png';

/*
  Form kontak — pakai Web3Forms (gratis, TANPA aktivasi klik email).
  Cara dapat access key:
    1. Buka  https://web3forms.com
    2. Masukkan email  rizkafaridadamayantii@gmail.com  → "Create Access Key"
    3. Access key (format uuid: xxxxxxxx-xxxx-...) langsung muncul + dikirim ke email
    4. Tempel key-nya di bawah ini, simpan, selesai.
  Selama masih "GANTI_DENGAN_ACCESS_KEY", form otomatis pakai fallback buka aplikasi email.
*/
export const WEB3FORMS_KEY = 'a47a3919-03c9-4ca7-86cc-8428221b4759';
export const CONTACT_ENDPOINT = 'https://api.web3forms.com/submit';

export const PERSONAL_INFO = {
  name: 'Rizka Farida Damayanti',
  shortName: 'Rizka',
  initials: 'RFD',
  role: 'Full Stack Developer',
  education: 'D3 Manajemen Informatika',
  campus: 'Politeknik Negeri Malang (POLINEMA)',
  campusLocation: 'Malang, Jawa Timur, Indonesia',
  status: 'Terbuka untuk Magang / Kerja',
  currentJob: 'Web Developer Intern',
  currentCompany: 'PT Kedata Indonesia Digital',
  currentSince: 'Juni 2026',
  responseTime: '< 24 jam',
  greeting: 'Halo, saya Rizka',
  bio: 'Mahasiswa D3 Manajemen Informatika Politeknik Negeri Malang yang senang membangun perangkat lunak yang rapi dan enak dipakai. Saya memadukan backend yang tertata, antarmuka yang interaktif, serta rasa penasaran pada AI dan IoT untuk membuat solusi digital yang benar-benar berguna.',
  email: 'rizkafaridadamayantii@gmail.com',
  github: 'https://github.com/rizkafaridadamayanti',
  githubHandle: 'rizkafaridadamayanti',
  // TODO: ganti dengan URL LinkedIn asli (buka profilmu → salin dari address bar)
  linkedin: 'https://www.linkedin.com/in/rizka-farida-damayanti',
  linkedinName: 'Rizka Farida',
  instagram: 'https://instagram.com/rizkafrdd',
  instagramHandle: '@rizkafrdd',
  kineticTitles: [
    'Full Stack Developer',
    'UI/UX Enthusiast',
    'AI Enthusiast',
    'IoT & Embedded Explorer'
  ],
  statsRow: [
    { value: '5', label: 'Proyek di GitHub', desc: 'Web, AI, & otomasi — publik', icon: 'Briefcase' },
    { value: '6+', label: 'Teknologi Dikuasai', desc: 'Laravel, Vue, Next.js, dan lainnya', icon: 'Layers' },
    { value: '3.8+', label: 'IPK Terjaga', desc: 'D3 MI Polinema (2024–sekarang)', icon: 'Award' },
    { value: '1', label: 'Magang Aktif', desc: 'PT Kedata Indonesia Digital', icon: 'Building2' }
  ],
  trustBadges: [
    { title: 'Kode Rapi', desc: 'Terstruktur, konsisten, dan mudah dirawat.', icon: 'Code2' },
    { title: 'Cepat Belajar', desc: 'Gesit beradaptasi dengan teknologi & framework baru.', icon: 'Zap' },
    { title: 'Bisa Diandalkan', desc: 'Amanah, tepat waktu, dan berdedikasi.', icon: 'ShieldCheck' },
    { title: 'Selalu Responsif', desc: 'Komunikasi jelas, terbuka, dan tanggap.', icon: 'MessageSquare' }
  ]
};

/* Pengalaman & aktivitas */
export const EXPERIENCE = [
  {
    role: 'Web Developer Intern',
    org: 'PT Kedata Indonesia Digital',
    period: 'Juni 2026 — sekarang',
    now: true,
    points: [
      'Mengembangkan & memelihara fitur aplikasi web bersama tim produk',
      'Menulis kode terstruktur dengan alur review & versi Git',
      'Kolaborasi lintas peran: analis, desainer, dan QA',
    ],
  },
  {
    role: 'D3 Manajemen Informatika',
    org: 'Politeknik Negeri Malang',
    period: '2024 — sekarang',
    now: false,
    points: [
      'Kurikulum vokasi intensif: basis data, pemrograman web, jaringan, IoT',
      'Membangun aplikasi full-stack (WanaCafe, FinStart, ProduktifKu, dll)',
      'IPK terjaga di atas 3.8',
    ],
  },
];

/* Yang sedang saya dalami */
export const LEARNING = [
  'TypeScript & pola arsitektur frontend',
  'Automated testing (Vitest, PHPUnit)',
  'Docker & CI/CD pipeline',
  'Perancangan REST API yang rapi',
];

/* Perjalanan sebuah proyek — dipakai di ruangan "Rak Cerita" */
export const JOURNEY_STEPS = [
  { n: '01', title: 'Pahami masalah', desc: 'Gali kebutuhan nyata sebelum menulis kode.', icon: 'Search' },
  { n: '02', title: 'Rancang', desc: 'Skema database, alur data, dan wireframe UI.', icon: 'PenTool' },
  { n: '03', title: 'Bangun', desc: 'Backend tertata + frontend reaktif, per iterasi kecil.', icon: 'Hammer' },
  { n: '04', title: 'Uji & rilis', desc: 'Coba di kondisi nyata, perbaiki, lalu luncurkan.', icon: 'Rocket' },
];

/* Yang bisa saya bantu */
export const SERVICES = [
  { title: 'Aplikasi web full-stack', desc: 'Laravel / Vue, dari database sampai UI.', icon: 'LayoutGrid' },
  { title: 'REST API & integrasi', desc: 'Autentikasi, pembayaran, layanan pihak ketiga.', icon: 'PlugZap' },
  { title: 'Dashboard & visualisasi data', desc: 'Chart interaktif, laporan, panel admin.', icon: 'BarChart3' },
  { title: 'Prototipe IoT', desc: 'ESP32 + MicroPython + telemetri MQTT.', icon: 'Cpu' },
];
