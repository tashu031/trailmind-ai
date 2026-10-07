import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SafetyBanner } from './components/SafetyBanner';
import { DevPanelModal } from './components/DevPanelModal';
import { NatureDetectiveModal } from './components/NatureDetectiveModal';
import { LandingPage } from './pages/LandingPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { MissionPreviewPage } from './pages/MissionPreviewPage';
import { MissionModePage } from './pages/MissionModePage';
import { AdventureCompletionPage } from './pages/AdventureCompletionPage';
import { JournalViewPage } from './pages/JournalViewPage';
import { HistoryPage } from './pages/HistoryPage';

import { 
  Mission, 
  Observation, 
  Journal, 
  Adventure, 
  AIStatus, 
  UserPreferences,
  AdventureReflections 
} from './types';
import { 
  fetchAIStatus,
  generateMissionAPI,
  saveAdventureToCloud,
  syncPendingCloudData
} from './services/api';
import { 
  saveAdventureLocal, 
  getActiveMissionState, 
  clearActiveMissionState
} from './services/db';

export function App() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [aiStatus, setAIStatus] = useState<AIStatus | null>(null);
  const [isDevPanelOpen, setIsDevPanelOpen] = useState<boolean>(false);
  const [isDetectiveOpen, setIsDetectiveOpen] = useState<boolean>(false);

  // Active Flow State
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [resumeMissionState, setResumeMissionState] = useState<{
    startedAt: number;
    currentCheckpointIndex: number;
    screenLightSeconds: number;
    observations: Observation[];
    preferences?: UserPreferences;
  } | undefined>(undefined);
  const [activePrefs, setActivePrefs] = useState<UserPreferences>({
    userName: 'Explorer',
    location: 'Nearby Park or Trail',
    availableTimeMinutes: 45,
    activity: 'Nature Walk',
    difficulty: 'Easy',
    interests: ['Plants', 'Photography'],
    preferences: [],
  });
  const [adventureStats, setAdventureStats] = useState<{
    durationMinutes: number;
    screenLightMinutes: number;
    missionsCompleted: number;
    totalMissions: number;
    observations: Observation[];
  } | null>(null);
  const [currentJournal, setCurrentJournal] = useState<Journal | null>(null);
  const [currentAdventure, setCurrentAdventure] = useState<Adventure | null>(null);

  // Network status listener
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingCloudData().catch(console.error);
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial AI status fetch
    loadAIStatus();

    // Check if there is an ongoing mission saved in IndexedDB to resume
    getActiveMissionState().then((saved) => {
      if (saved?.mission) {
        setActiveMission(saved.mission);
        setResumeMissionState(saved);
        if (saved.preferences) setActivePrefs(saved.preferences);
        setCurrentPage('mission_mode');
      }
    });
    syncPendingCloudData().catch(console.error);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadAIStatus = async () => {
    const status = await fetchAIStatus();
    setAIStatus(status);
  };

  // Launch Jaipur Canonical Demo
  const handleStartDemo = async () => {
    const demoPrefs: UserPreferences = {
      userName: 'Jaipur Explorer',
      location: 'Jaipur City Forest & Smriti Van',
      availableTimeMinutes: 30,
      activity: 'Nature Exploration',
      difficulty: 'Easy',
      interests: ['Plants', 'Photography', 'Sounds'],
      preferences: ['Quiet experience'],
      useDemo: true,
    };
    setActivePrefs(demoPrefs);
    const mission = await generateMissionAPI(demoPrefs);
    setActiveMission(mission);
    setCurrentPage('preview');
  };

  const handleMissionGenerated = (mission: Mission, prefs: UserPreferences) => {
    setActiveMission(mission);
    setActivePrefs(prefs);
    setCurrentPage('preview');
  };

  const handleStartAdventure = (mission: Mission) => {
    setResumeMissionState(undefined);
    setActiveMission(mission);
    setCurrentPage('mission_mode');
  };

  const handleFinishAdventure = (stats: {
    durationMinutes: number;
    screenLightMinutes: number;
    missionsCompleted: number;
    totalMissions: number;
    observations: Observation[];
  }) => {
    setResumeMissionState(undefined);
    setAdventureStats(stats);
    setCurrentPage('completion');
  };

  const handleJournalGenerated = async (journal: Journal, reflections: AdventureReflections) => {
    setCurrentJournal(journal);

    if (activeMission && adventureStats) {
      const fullAdventure: Adventure = {
        id: 'adv-' + Date.now(),
        title: activeMission.title,
        activity: activePrefs.activity,
        difficulty: activePrefs.difficulty,
        location: activePrefs.location,
        durationMinutes: adventureStats.durationMinutes,
        screenLightMinutes: adventureStats.screenLightMinutes,
        outsideScore: journal.outsideScore,
        mission: activeMission,
        observations: adventureStats.observations,
        reflections,
        journal,
        completedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        isDemo: Boolean(activePrefs.useDemo),
      };

      setCurrentAdventure(fullAdventure);
      // Persist to local-first IndexedDB
      await saveAdventureLocal(fullAdventure);
      // Optionally sync to MongoDB Atlas if backend is online
      saveAdventureToCloud(fullAdventure).catch(console.error);
    }

    clearActiveMissionState().catch(console.error);
    setCurrentPage('journal_view');
  };

  const handleSelectAdventureFromHistory = (adv: Adventure) => {
    if (adv.journal) {
      setCurrentJournal(adv.journal);
      setCurrentAdventure(adv);
      setCurrentPage('journal_view');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 text-earth-bark font-sans selection:bg-forest-200">
      {/* Global Header */}
      <Header
        currentPage={currentPage}
        onNavigate={(page) => {
          if (page === 'detective') {
            setIsDetectiveOpen(true);
          } else {
            setCurrentPage(page);
          }
        }}
        isOnline={isOnline}
        aiStatus={aiStatus}
        onOpenDevPanel={() => setIsDevPanelOpen(true)}
        onStartDemo={handleStartDemo}
      />

      {/* Safety Reminder Banner */}
      <SafetyBanner />

      {/* Main Page Router */}
      <main className="flex-1">
        {currentPage === 'landing' && (
          <LandingPage
            onStartAdventure={() => setCurrentPage('onboarding')}
            onStartDemo={handleStartDemo}
            onExploreHistory={() => setCurrentPage('history')}
            onOpenDetective={() => setIsDetectiveOpen(true)}
          />
        )}

        {currentPage === 'onboarding' && (
          <OnboardingPage
            onMissionGenerated={handleMissionGenerated}
            aiStatus={aiStatus}
          />
        )}

        {currentPage === 'preview' && activeMission && (
          <MissionPreviewPage
            mission={activeMission}
            prefs={activePrefs}
            onStartAdventure={handleStartAdventure}
            onSaveMissionOffline={() => {
              // Starting Mission Mode persists the full mission state locally.
              setCurrentPage('mission_mode');
            }}
          />
        )}

        {currentPage === 'mission_mode' && activeMission && (
          <MissionModePage
            mission={activeMission}
            resumeState={resumeMissionState}
            preferences={activePrefs}
            onFinishAdventure={handleFinishAdventure}
            isOnline={isOnline}
          />
        )}

        {currentPage === 'completion' && activeMission && adventureStats && (
          <AdventureCompletionPage
            mission={activeMission}
            stats={adventureStats}
            onJournalGenerated={handleJournalGenerated}
          />
        )}

        {currentPage === 'journal_view' && currentJournal && (
          <JournalViewPage
            journal={currentJournal}
            observations={adventureStats?.observations || currentAdventure?.observations || []}
            onBackToHistory={() => setCurrentPage('history')}
            onNewAdventure={() => setCurrentPage('onboarding')}
          />
        )}

        {currentPage === 'history' && (
          <HistoryPage
            onSelectAdventure={handleSelectAdventureFromHistory}
            onNewAdventure={() => setCurrentPage('onboarding')}
          />
        )}
      </main>

      {/* Developer Transparency Panel Modal */}
      <DevPanelModal
        isOpen={isDevPanelOpen}
        onClose={() => setIsDevPanelOpen(false)}
        aiStatus={aiStatus}
        onRefresh={loadAIStatus}
        isOnline={isOnline}
      />

      {/* Nature Detective Standalone Modal */}
      <NatureDetectiveModal
        isOpen={isDetectiveOpen}
        onClose={() => setIsDetectiveOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-earth-stone/70 py-8 px-4 text-center bg-cream-50/60 mt-auto">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="font-serif italic text-forest-900 text-sm">
            "Your AI should help you leave the screen."
          </p>
          <p className="text-[11px] font-mono text-earth-moss">
            TrailMind AI • Hacktoberfest 2026 DEV Challenge: TOUCH GRASS • Open-weight Gemma AI
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
