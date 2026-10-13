export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  fullStory: string;
  category: 'Full Stack' | 'Frontend' | 'IoT & Hardware' | 'AI & Otomasi';
  image?: string;
  featuredTech: string[];
  features: string[];
  metrics: { label: string; value: string }[];
  accentColor: string;
  demoUrl?: string;
  githubUrl?: string;
  architecture: string;
}

export interface SkillItem {
  name: string;
  category: 'Bahasa Pemrograman' | 'Frontend' | 'Backend & Tools';
  level: number; // 0 - 100
  experience: string;
  description: string;
  tags: string[];
  icon: string;
  color: string;
}
