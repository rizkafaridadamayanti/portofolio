import React, { useCallback, useState } from 'react';
import { JourneyProvider, useJourney } from './world/JourneyContext';
import { WorldScene } from './world/Diorama';
import { JourneyNav } from './world/JourneyNav';
import { IntroGate } from './world/IntroGate';
import { WelcomeStation } from './stations/WelcomeStation';
import { AboutStation } from './stations/AboutStation';
import { ProjectsStation } from './stations/ProjectsStation';
import { SkillsStation } from './stations/SkillsStation';
import { GameStation } from './stations/GameStation';
import { StoryStation } from './stations/StoryStation';
import { ContactStation } from './stations/ContactStation';
import { ProjectModal } from './components/ProjectModal';
import { Project } from './types';

const INTRO_KEY = 'rf_intro_seen';

const Experience: React.FC = () => {
  const { goTo } = useJourney();
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return sessionStorage.getItem(INTRO_KEY) !== '1';
    } catch {
      return true;
    }
  });
  const [project, setProject] = useState<Project | null>(null);

  const dismissIntro = useCallback(() => {
    try { sessionStorage.setItem(INTRO_KEY, '1'); } catch { /* private mode */ }
    setShowIntro(false);
    window.scrollTo({ top: 0 });
  }, []);

  const navigate = useCallback((id: string) => {
    const idx = ['welcome', 'about', 'projects', 'skills', 'game', 'story', 'contact'].indexOf(id);
    if (idx >= 0) goTo(idx);
  }, [goTo]);

  return (
    <div className="relative min-h-screen font-sans antialiased overflow-x-hidden" style={{ color: 'var(--ink)' }}>
      {showIntro && <IntroGate onEnter={dismissIntro} />}
      <JourneyNav />

      <WorldScene>
        <WelcomeStation />
        <AboutStation onNavigate={navigate} />
        <ProjectsStation onOpen={setProject} />
        <SkillsStation />
        <GameStation />
        <StoryStation onNavigate={navigate} />
        <ContactStation />
      </WorldScene>

      <ProjectModal project={project} onClose={() => setProject(null)} />
    </div>
  );
};

export default function App() {
  return (
    <JourneyProvider>
      <Experience />
    </JourneyProvider>
  );
}
