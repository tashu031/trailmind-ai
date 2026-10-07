import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Camera, 
  Sun, 
  ArrowRight, 
  Loader2, 
  HelpCircle,
  Footprints
} from 'lucide-react';
import { Mission, Observation, AdventureReflections, Journal } from '../types';
import { generateJournalAPI } from '../services/api';
import { playChime } from '../services/speech';

interface AdventureCompletionPageProps {
  mission: Mission;
  stats: {
    durationMinutes: number;
    screenLightMinutes: number;
    missionsCompleted: number;
    totalMissions: number;
    observations: Observation[];
  };
  onJournalGenerated: (journal: Journal, reflections: AdventureReflections) => void;
}

export const AdventureCompletionPage: React.FC<AdventureCompletionPageProps> = ({
  mission,
  stats,
  onJournalGenerated,
}) => {
  const [surprised, setSurprised] = useState('');
  const [missed, setMissed] = useState('');
  const [felt, setFelt] = useState('');
  const [nextTime, setNextTime] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#2D5A27', '#E1EFE2', '#C86D51', '#D9CBBA'],
      });
      playChime('success');
    } catch (e) {
      // Confetti fallback
    }
  }, []);

  const handleGenerateJournal = async () => {
    setIsGenerating(true);
    const reflections: AdventureReflections = {
      surprised: surprised.trim() || 'How quiet the morning air felt.',
      missed: missed.trim() || 'The rich patterns in leaf veins and tree bark.',
      felt: felt.trim() || 'Grounded, peaceful, and refreshed away from screens.',
      nextTime: nextTime.trim() || 'Explore another unpaved pathway.',
    };

    try {
      const journal = await generateJournalAPI({
        adventureTitle: mission.title,
        durationMinutes: stats.durationMinutes,
        missionsCompleted: stats.missionsCompleted,
        totalMissions: stats.totalMissions,
        screenLightMinutes: stats.screenLightMinutes,
        activity: 'Nature Walk',
        location: mission.summary,
        observations: stats.observations,
        reflections,
        useDemo: mission.id.includes('demo') || mission.title.includes('Jaipur'),
      });

      onJournalGenerated(journal, reflections);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const photosCount = stats.observations.filter((o) => o.photoBase64).length;

  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-10 px-4 space-y-6">
      {/* Celebration Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-forest-100 text-forest-700 flex items-center justify-center mx-auto shadow-xs">
          <Sun className="w-8 h-8 text-forest-600 animate-spin-slow" />
        </div>
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-forest-600">
          Adventure Complete 🎉
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-forest-950">
          Welcome back from outside.
        </h2>
        <p className="text-sm text-earth-moss">
          Take a moment to reflect before returning to regular screen routines.
        </p>
      </div>

      {/* Stats Summary Matrix */}
      <div className="bg-cream-50 border border-earth-stone rounded-3xl p-6 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-white p-3.5 rounded-2xl border border-cream-200">
            <span className="text-[10px] font-mono uppercase text-earth-moss block">Time Outside</span>
            <span className="text-2xl font-bold font-serif text-forest-900">{stats.durationMinutes}</span>
            <span className="text-[10px] text-earth-moss block">minutes</span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-cream-200">
            <span className="text-[10px] font-mono uppercase text-earth-moss block">Missions</span>
            <span className="text-2xl font-bold font-serif text-forest-900">
              {stats.missionsCompleted}/{stats.totalMissions}
            </span>
            <span className="text-[10px] text-emerald-700 block">completed</span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-cream-200">
            <span className="text-[10px] font-mono uppercase text-earth-moss block">Observations</span>
            <span className="text-2xl font-bold font-serif text-forest-900">{stats.observations.length}</span>
            <span className="text-[10px] text-earth-moss block">{photosCount} photos</span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-cream-200">
            <span className="text-[10px] font-mono uppercase text-earth-moss block">Screen-Light</span>
            <span className="text-2xl font-bold font-serif text-emerald-700">{stats.screenLightMinutes}</span>
            <span className="text-[10px] text-emerald-800 font-semibold block">minutes on screen</span>
          </div>
        </div>
      </div>

      {/* Reflection Prompts (Keep short and mindful) */}
      <div className="bg-white border border-earth-stone rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="border-b border-cream-200 pb-3 mb-2">
          <h3 className="font-serif font-bold text-lg text-forest-900">
            Mindful Reflection
          </h3>
          <p className="text-xs text-earth-moss">
            Your answers will be woven into your personalized Adventure Journal by Gemma.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-earth-moss mb-1">
            What surprised you outside?
          </label>
          <input
            type="text"
            value={surprised}
            onChange={(e) => setSurprised(e.target.value)}
            placeholder="e.g. How active the bird calls were, or the deep smell of the soil..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-earth-stone bg-cream-50 text-earth-bark text-sm focus:ring-2 focus:ring-forest-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-earth-moss mb-1">
            What did you notice that you normally miss?
          </label>
          <input
            type="text"
            value={missed}
            onChange={(e) => setMissed(e.target.value)}
            placeholder="e.g. The asymmetry of Neem leaves, lichen patterns on rocks..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-earth-stone bg-cream-50 text-earth-bark text-sm focus:ring-2 focus:ring-forest-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-earth-moss mb-1">
            How did the experience feel?
          </label>
          <input
            type="text"
            value={felt}
            onChange={(e) => setFelt(e.target.value)}
            placeholder="e.g. Grounded, calm, unhurried, peaceful..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-earth-stone bg-cream-50 text-earth-bark text-sm focus:ring-2 focus:ring-forest-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-earth-moss mb-1">
            What would you explore next time?
          </label>
          <input
            type="text"
            value={nextTime}
            onChange={(e) => setNextTime(e.target.value)}
            placeholder="e.g. Walk during golden hour sunset, find wild birds near water..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-earth-stone bg-cream-50 text-earth-bark text-sm focus:ring-2 focus:ring-forest-500"
          />
        </div>

        <div className="pt-3">
          <button
            onClick={handleGenerateJournal}
            disabled={isGenerating}
            className="w-full py-4 rounded-2xl bg-forest-600 hover:bg-forest-700 active:scale-98 disabled:opacity-50 text-cream-50 font-bold text-base flex items-center justify-center gap-2.5 shadow-md transition-all"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Weaving Adventure Journal with Gemma...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Create AI Adventure Journal</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
