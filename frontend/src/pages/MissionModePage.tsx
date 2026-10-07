import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, 
  ChevronRight, 
  Camera, 
  Search, 
  Eye, 
  Volume2, 
  VolumeX, 
  Clock, 
  SkipForward, 
  Sparkles,
  WifiOff
} from 'lucide-react';
import { Mission, Observation, EducationalInsights, UserPreferences } from '../types';
import { TimerWidget } from '../components/TimerWidget';
import { ScreenDownOverlay } from '../components/ScreenDownOverlay';
import { ObservationModal } from '../components/ObservationModal';
import { NatureDetectiveModal } from '../components/NatureDetectiveModal';
import { speakText, stopSpeaking, playChime } from '../services/speech';
import { 
  saveActiveMissionState, 
  saveObservationLocal, 
  clearActiveMissionState
} from '../services/db';

interface MissionModePageProps {
  mission: Mission;
  resumeState?: {
    startedAt: number;
    currentCheckpointIndex: number;
    screenLightSeconds: number;
    observations: Observation[];
    preferences?: UserPreferences;
  };
  preferences: UserPreferences;
  onFinishAdventure: (adventureSummary: {
    durationMinutes: number;
    screenLightMinutes: number;
    missionsCompleted: number;
    totalMissions: number;
    observations: Observation[];
  }) => void;
  isOnline: boolean;
}

export const MissionModePage: React.FC<MissionModePageProps> = ({
  mission,
  resumeState,
  preferences,
  onFinishAdventure,
  isOnline,
}) => {
  const [currentIdx, setCurrentIdx] = useState(resumeState?.currentCheckpointIndex ?? 0);
  const [screenDownActive, setScreenDownActive] = useState(false);
  const [isObsModalOpen, setIsObsModalOpen] = useState(false);
  const [isDetectiveOpen, setIsDetectiveOpen] = useState(false);
  const [observations, setObservations] = useState<Observation[]>(resumeState?.observations ?? []);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [completedCheckpointIds, setCompletedCheckpointIds] = useState<string[]>(
    (mission.checkpoints || []).filter((checkpoint) => checkpoint.completed).map((checkpoint) => checkpoint.id)
  );

  // Time tracking. If the app was closed mid-adventure, continue from the
  // persisted start time rather than silently resetting the user's progress.
  const startTimeRef = useRef<number>(resumeState?.startedAt ?? Date.now());
  const [screenLightSeconds, setScreenLightSeconds] = useState(resumeState?.screenLightSeconds ?? 0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Checkpoints
  const checkpoints = mission.checkpoints || [];
  const currentChk = checkpoints[currentIdx] || checkpoints[0];
  const totalCheckpoints = checkpoints.length;

  // Track overall elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Track active screen-light seconds (only when document is visible and Screen Down mode is not active)
  useEffect(() => {
    let screenTimer: ReturnType<typeof setInterval> | null = null;

    const startScreenTimer = () => {
      if (screenTimer || screenDownActive || document.visibilityState !== 'visible') return;
      screenTimer = setInterval(() => {
        setScreenLightSeconds((prev) => prev + 1);
      }, 1000);
    };

    const stopScreenTimer = () => {
      if (screenTimer) {
        clearInterval(screenTimer);
        screenTimer = null;
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') startScreenTimer();
      else stopScreenTimer();
    };

    startScreenTimer();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stopScreenTimer();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [screenDownActive]);

  // Save progress to IndexedDB on checkpoint or observation change
  useEffect(() => {
    saveActiveMissionState({
      mission,
      startedAt: startTimeRef.current,
      currentCheckpointIndex: currentIdx,
      screenLightSeconds,
      observations,
      preferences,
    }).catch(console.error);
  }, [currentIdx, screenLightSeconds, observations, mission]);

  const handleSpeakInstruction = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const text = `Mission ${currentIdx + 1} of ${totalCheckpoints}. ${currentChk.title}. ${currentChk.instruction}`;
      speakText(text).finally(() => setIsSpeaking(false));
    }
  };

  const handleCompleteCheckpoint = () => {
    playChime('success');
    setCompletedCheckpointIds((prev) =>
      prev.includes(currentChk.id) ? prev : [...prev, currentChk.id]
    );

    if (currentIdx + 1 < totalCheckpoints) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // All checkpoints done!
      finishAdventure(completedCheckpointIds.includes(currentChk.id)
        ? completedCheckpointIds.length
        : completedCheckpointIds.length + 1);
    }
  };

  const handleSkipCheckpoint = () => {
    playChime('tap');
    if (currentIdx + 1 < totalCheckpoints) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      finishAdventure();
    }
  };

  const finishAdventure = (completedCountOverride?: number) => {
    clearActiveMissionState().catch(console.error);
    const durationMinutes = Math.max(1, Math.round(elapsedSeconds / 60));
    const screenLightMinutes = Math.max(1, Math.round(screenLightSeconds / 60));
    const completedCount = completedCountOverride ?? completedCheckpointIds.length;

    onFinishAdventure({
      durationMinutes,
      screenLightMinutes,
      missionsCompleted: completedCount,
      totalMissions: totalCheckpoints,
      observations,
    });
  };

  const handleSaveObservation = (obs: Observation) => {
    playChime('tap');
    const updated = [...observations, obs];
    setObservations(updated);
    saveObservationLocal(obs).catch(console.error);
  };

  const handleAttachDetectiveInsights = (insights: EducationalInsights) => {
    const obs: Observation = {
      id: 'obs-detective-' + Date.now(),
      adventureId: mission.id,
      checkpointIndex: currentIdx,
      title: insights.identification,
      note: `Detective verified: ${insights.whatNoticed.join(', ')}`,
      mood: '🤔',
      timestamp: new Date().toISOString(),
      educationalInsights: insights,
    };
    handleSaveObservation(obs);
  };

  const formatMinsSecs = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="max-w-2xl mx-auto py-4 sm:py-8 px-4 flex flex-col min-h-[82vh] justify-between">
      {/* Offline Alert if offline */}
      {!isOnline && (
        <div className="mb-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
          <WifiOff className="w-4 h-4 shrink-0 text-amber-600" />
          <span>You are offline. Your adventure is running locally from IndexedDB.</span>
        </div>
      )}

      {/* Screen Down Mode Overlay if active */}
      {screenDownActive && (
        <ScreenDownOverlay
          checkpoint={currentChk}
          currentNumber={currentIdx + 1}
          totalCheckpoints={totalCheckpoints}
          onComplete={handleCompleteCheckpoint}
          onExit={() => setScreenDownActive(false)}
          onSpeak={handleSpeakInstruction}
        />
      )}

      {/* Top Ambient Status & Controls */}
      <div>
        <div className="flex items-center justify-between border-b border-earth-stone/70 pb-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-forest-600 animate-pulse" />
            <span className="font-mono text-xs uppercase font-bold tracking-wider text-forest-800">
              MISSION {currentIdx + 1} / {totalCheckpoints}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Screen Down Mode Trigger */}
            <button
              onClick={() => setScreenDownActive(true)}
              className="px-3 py-1.5 rounded-xl bg-forest-900 text-cream-100 text-xs font-semibold flex items-center gap-1.5 hover:bg-forest-950 transition-colors shadow-2xs"
              title="Activate ultra-minimal high-contrast outdoor screen"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>Screen Down</span>
            </button>

            {/* Audio narrator button */}
            <button
              onClick={handleSpeakInstruction}
              className={`p-1.5 rounded-xl text-forest-800 hover:bg-cream-200 transition-colors ${
                isSpeaking ? 'bg-forest-100 text-forest-900' : ''
              }`}
              title="Listen to instruction"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Minimal Progress Line */}
        <div className="w-full bg-cream-200 h-1.5 rounded-full mb-8 overflow-hidden">
          <div
            className="bg-forest-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / totalCheckpoints) * 100}%` }}
          />
        </div>

        {/* Main Checkpoint Screen (Intentionally Minimalist) */}
        <div className="bg-cream-50 border border-earth-stone rounded-3xl p-6 sm:p-8 shadow-xs text-center space-y-4 my-auto">
          <span className="text-xs font-mono font-semibold text-earth-moss uppercase tracking-widest">
            Outdoor Action Checkpoint
          </span>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-forest-950 leading-tight">
            {currentChk.title}
          </h2>

          <div className="bg-white border border-earth-stone/70 rounded-2xl p-5 sm:p-6 my-4 shadow-2xs">
            <p className="text-base sm:text-lg text-earth-bark font-medium leading-relaxed">
              "{currentChk.instruction}"
            </p>
            {currentChk.tips && (
              <p className="text-xs text-earth-moss mt-3 font-mono">
                Hint: {currentChk.tips}
              </p>
            )}
          </div>

          {/* Integrated Timer for pauses */}
          <div className="pt-2">
            <TimerWidget
              initialSeconds={currentChk.durationMinutes ? currentChk.durationMinutes * 60 : 60}
              label="Pause & Observe"
            />
          </div>
        </div>
      </div>

      {/* Observation and Capture Shortcut Bar */}
      <div className="mt-6 space-y-3">
        <div className="flex gap-2">
          <button
            onClick={() => setIsObsModalOpen(true)}
            className="flex-1 py-3 px-3 rounded-2xl bg-white border border-earth-stone hover:bg-cream-200 text-xs font-semibold text-earth-bark flex items-center justify-center gap-2 shadow-2xs transition-all"
          >
            <Camera className="w-4 h-4 text-forest-600" />
            <span>Capture Observation ({observations.length})</span>
          </button>

          <button
            onClick={() => setIsDetectiveOpen(true)}
            className="py-3 px-3.5 rounded-2xl bg-white border border-earth-stone hover:bg-cream-200 text-xs font-semibold text-earth-bark flex items-center justify-center gap-1.5 shadow-2xs transition-all"
            title="Open Nature Detective"
          >
            <Search className="w-4 h-4 text-earth-moss" />
            <span className="hidden sm:inline">Nature Detective</span>
          </button>
        </div>

        {/* Primary Completion & Skip Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCompleteCheckpoint}
            className="flex-1 py-4 rounded-2xl bg-forest-600 hover:bg-forest-700 active:scale-98 text-cream-50 font-bold text-base flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Complete Checkpoint</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleSkipCheckpoint}
            className="px-4 py-4 rounded-2xl bg-cream-100 hover:bg-cream-200 text-earth-moss text-xs font-semibold flex items-center gap-1.5 transition-colors border border-earth-stone"
            title="Skip this checkpoint"
          >
            <SkipForward className="w-4 h-4" />
            <span>Skip</span>
          </button>
        </div>

        {/* Live Outdoor vs Screen Light Time Tracker */}
        <div className="flex items-center justify-between pt-2 px-1 text-[11px] font-mono text-earth-moss">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-forest-600" />
            Outside: {formatMinsSecs(elapsedSeconds)}
          </span>
          <span className="text-emerald-700 font-semibold">
            Screen-light: {formatMinsSecs(screenLightSeconds)}
          </span>
        </div>
      </div>

      {/* Observation Modal */}
      <ObservationModal
        isOpen={isObsModalOpen}
        onClose={() => setIsObsModalOpen(false)}
        onSave={handleSaveObservation}
        checkpointIndex={currentIdx}
        adventureId={mission.id}
      />

      {/* Nature Detective Modal */}
      <NatureDetectiveModal
        isOpen={isDetectiveOpen}
        onClose={() => setIsDetectiveOpen(false)}
        onAttachToAdventure={handleAttachDetectiveInsights}
      />
    </div>
  );
};
