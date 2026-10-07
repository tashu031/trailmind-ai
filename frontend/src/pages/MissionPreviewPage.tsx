import React, { useState } from 'react';
import { 
  Compass, 
  Clock, 
  Sparkles, 
  RotateCw, 
  Bookmark, 
  Play, 
  ShieldAlert, 
  CheckCircle2, 
  Camera, 
  FileText,
  Volume2
} from 'lucide-react';
import { Mission, UserPreferences } from '../types';
import { regenerateMissionAPI } from '../services/api';
import { speakText } from '../services/speech';

interface MissionPreviewPageProps {
  mission: Mission;
  prefs: UserPreferences;
  onStartAdventure: (mission: Mission) => void;
  onSaveMissionOffline: (mission: Mission) => void;
}

export const MissionPreviewPage: React.FC<MissionPreviewPageProps> = ({
  mission: initialMission,
  prefs,
  onStartAdventure,
  onSaveMissionOffline,
}) => {
  const [currentMission, setCurrentMission] = useState<Mission>(initialMission);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const refreshed = await regenerateMissionAPI(prefs);
      setCurrentMission(refreshed);
      setIsSaved(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSave = () => {
    onSaveMissionOffline(currentMission);
    setIsSaved(true);
  };

  const handleListenOverview = () => {
    const text = `${currentMission.title}. Duration ${currentMission.durationMinutes} minutes. ${currentMission.summary}`;
    speakText(text);
  };

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 px-4 space-y-6">
      {/* Top Header Card */}
      <div className="bg-cream-50 border border-earth-stone rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-earth-stone/70 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-forest-600 text-cream-50">
              <Compass className="w-5 h-5 text-cream-100" />
            </span>
            <span className="font-mono text-xs uppercase font-bold tracking-wider text-forest-700">
              Mission Preview
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-forest-100 text-forest-900 text-xs font-semibold">
              {currentMission.durationMinutes} Minutes
            </span>
            <span className="px-3 py-1 rounded-full bg-cream-200 text-earth-bark text-xs font-semibold capitalize">
              {currentMission.difficulty}
            </span>
            <button
              onClick={handleListenOverview}
              title="Listen to summary"
              className="p-1.5 rounded-lg text-forest-700 hover:bg-forest-100 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title & Summary */}
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-forest-950 mb-3">
          {currentMission.title}
        </h2>
        <p className="text-sm text-earth-bark/85 leading-relaxed font-sans">
          {currentMission.summary}
        </p>

        {/* Preparation Checklist */}
        {currentMission.preparation && currentMission.preparation.length > 0 && (
          <div className="mt-5 pt-4 border-t border-earth-stone/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-earth-moss mb-2.5">
              Before You Step Outside
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-earth-bark">
              {currentMission.preparation.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Safety Notes */}
        {currentMission.safetyNotes && currentMission.safetyNotes.length > 0 && (
          <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-900 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Safety: </span>
              {currentMission.safetyNotes.join(' • ')}
            </div>
          </div>
        )}
      </div>

      {/* Checkpoints Overview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-serif font-bold text-lg text-forest-900">
            Checkpoints ({currentMission.checkpoints.length})
          </h3>
          <span className="text-xs text-earth-moss font-mono">
            Near-zero screen interaction
          </span>
        </div>

        <div className="space-y-2.5">
          {currentMission.checkpoints.map((chk, index) => (
            <div
              key={chk.id || index}
              className="bg-white border border-earth-stone rounded-2xl p-4 flex items-start justify-between gap-3 shadow-2xs"
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-forest-100 text-forest-800 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-forest-900">
                    {chk.title}
                  </h4>
                  <p className="text-xs text-earth-bark/80 mt-1 leading-relaxed">
                    {chk.instruction}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 text-earth-moss text-xs font-mono">
                {chk.requiresPhoto && <span title="Photo checkpoint"><Camera className="w-3.5 h-3.5 text-forest-600" /></span>}
                {chk.requiresNote && <span title="Note checkpoint"><FileText className="w-3.5 h-3.5 text-earth-moss" /></span>}
                <span>{chk.durationMinutes}m</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bonus Challenge */}
      {currentMission.bonusChallenge && (
        <div className="bg-forest-50 border border-forest-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-forest-900">
          <Sparkles className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Bonus Mindful Challenge: </span>
            {currentMission.bonusChallenge}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          onClick={() => onStartAdventure(currentMission)}
          className="w-full sm:flex-1 py-4 rounded-2xl bg-forest-600 hover:bg-forest-700 active:scale-98 text-cream-50 font-bold text-base flex items-center justify-center gap-2.5 shadow-md transition-all"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>START ADVENTURE</span>
        </button>

        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-cream-50 hover:bg-cream-200 text-forest-900 border border-earth-stone text-xs font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <RotateCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
          <span>Regenerate</span>
        </button>

        <button
          onClick={handleSave}
          className={`w-full sm:w-auto px-5 py-4 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            isSaved
              ? 'bg-forest-100 border-forest-300 text-forest-900'
              : 'bg-cream-50 border-earth-stone hover:bg-cream-200 text-forest-900'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>{isSaved ? 'Saved to Device' : 'Save Mission'}</span>
        </button>
      </div>
    </div>
  );
};
