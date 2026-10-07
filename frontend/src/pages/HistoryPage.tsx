import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Camera, 
  ChevronRight, 
  Loader2, 
  Compass,
  ArrowRight
} from 'lucide-react';
import { Adventure } from '../types';
import { getAllAdventuresLocal } from '../services/db';
import { queryAIMemory } from '../services/api';

interface HistoryPageProps {
  onSelectAdventure: (adv: Adventure) => void;
  onNewAdventure: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  onSelectAdventure,
  onNewAdventure,
}) => {
  const [adventures, setAdventures] = useState<Adventure[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [memoryQuestion, setMemoryQuestion] = useState('');
  const [memoryAnswer, setMemoryAnswer] = useState<{ summary: string; insights: string[] } | null>(null);
  const [isMemoryQuerying, setIsMemoryQuerying] = useState(false);

  useEffect(() => {
    loadAdventures();
  }, []);

  const loadAdventures = async () => {
    const local = await getAllAdventuresLocal();
    if (local && local.length > 0) {
      setAdventures(local);
    } else {
      // Seed initial sample adventure if empty so user can test history & AI memory immediately!
      const sampleAdventure: Adventure = {
        id: 'adv-sample-1',
        title: 'Jaipur Urban Nature Detective: The Ancient Canopy',
        activity: 'Nature Walk',
        difficulty: 'Easy',
        location: 'Jaipur City Forest & Smriti Van',
        durationMinutes: 30,
        screenLightMinutes: 2,
        outsideScore: 92,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        isDemo: true,
        mission: {
          id: 'miss-demo-1',
          title: 'Jaipur Urban Nature Detective: The Ancient Canopy',
          durationMinutes: 30,
          difficulty: 'Easy',
          summary: 'Sensory urban nature walk through Jaipur greenery focusing on indigenous Neem leaves and bird sounds.',
          preparation: ['Water bottle', 'Walking shoes'],
          safetyNotes: ['Stay on garden paths', 'Mind afternoon sun'],
          checkpoints: [
            {
              id: 'c1',
              title: 'The Leaf Architecture Hunt',
              instruction: 'Find two contrasting leaves: one serrated (like Neem) and one broad.',
              durationMinutes: 6,
              requiresPhoto: true,
              requiresNote: true,
              completed: true,
            },
            {
              id: 'c2',
              title: 'Stop for 60 Seconds: Sound Mapping',
              instruction: 'Close your eyes. Distinguish between city hum and natural sound.',
              durationMinutes: 5,
              requiresPhoto: false,
              requiresNote: true,
              completed: true,
            },
          ],
          createdAt: new Date().toISOString(),
        },
        observations: [
          {
            id: 'obs-1',
            title: 'Neem Leaf Vein Symmetry',
            note: 'Asymmetric base with distinct saw-tooth serrated margin',
            mood: '✨',
            timestamp: new Date().toISOString(),
          },
          {
            id: 'obs-2',
            title: 'Double-tone Bird Call',
            soundDescription: 'Rapid rising trill repeated every 4 seconds in the canopy',
            mood: '😌',
            timestamp: new Date().toISOString(),
          },
        ],
        journal: {
          id: 'journ-1',
          title: 'Jaipur Urban Nature Detective: The Ancient Canopy',
          date: 'October 5, 2026',
          durationMinutes: 30,
          missionsCompleted: 5,
          totalMissions: 5,
          observationsCount: 2,
          photosCount: 1,
          screenLightMinutes: 2,
          outsideScore: 92,
          narrativeStory: 'Stepping into the morning shade of the Jaipur city canopy, digital noise faded into rustling Neem foliage. Stopping to listen revealed layers of birdcalls that ordinary walking ignores.',
          discoveries: ['🌿 Asymmetrical Neem leaf margin', '🐦 Morning canopy trill', '☀️ Sandstone light shadow pattern'],
          favoriteMoment: 'The 60 second stillness pause under the old tree.',
          whatINoticed: 'How loud bird songs become when you close your eyes.',
          nextTime: 'Explore the dry riverbed at dusk.',
          shareCardText: 'Spent 30 mindful minutes outside in Jaipur, leaving the screen behind.',
          createdAt: new Date().toISOString(),
        },
      };
      setAdventures([sampleAdventure]);
    }
  };

  const handleAskMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memoryQuestion.trim()) return;

    setIsMemoryQuerying(true);
    try {
      const res = await queryAIMemory(memoryQuestion, adventures);
      setMemoryAnswer(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsMemoryQuerying(false);
    }
  };

  const filtered = adventures.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.activity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-forest-600">
            Adventure Chronicles
          </span>
          <h2 className="text-3xl font-serif font-bold text-forest-950 mt-1">
            Your Outdoor Journey
          </h2>
          <p className="text-xs text-earth-moss">
            {adventures.length} recorded mindful adventures • Local-first IndexedDB
          </p>
        </div>

        <button
          onClick={onNewAdventure}
          className="px-5 py-3 rounded-2xl bg-forest-600 hover:bg-forest-700 text-cream-50 font-semibold text-xs flex items-center gap-2 shadow-2xs transition-all self-start sm:self-auto"
        >
          <Compass className="w-4 h-4" />
          <span>New Adventure</span>
        </button>
      </div>

      {/* AI Memory Search Box */}
      <div className="bg-cream-50 border border-earth-stone rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-forest-600" />
          <h3 className="font-serif font-bold text-base text-forest-900">
            Ask AI Memory Across Your Adventures
          </h3>
        </div>
        <p className="text-xs text-earth-moss mb-3">
          Query your past journals with natural language (e.g., "What did I notice about birds or trees last month?")
        </p>

        <form onSubmit={handleAskMemory} className="flex gap-2">
          <input
            type="text"
            value={memoryQuestion}
            onChange={(e) => setMemoryQuestion(e.target.value)}
            placeholder="e.g. What bird sounds did I hear in previous walks?"
            className="flex-1 px-4 py-2.5 rounded-xl border border-earth-stone bg-white text-earth-bark text-xs focus:ring-2 focus:ring-forest-500"
          />
          <button
            type="submit"
            disabled={isMemoryQuerying || !memoryQuestion.trim()}
            className="px-5 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 disabled:opacity-50 text-cream-50 font-semibold text-xs flex items-center gap-1.5 transition-all shrink-0"
          >
            {isMemoryQuerying ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>Ask Memory</span>
          </button>
        </form>

        {memoryAnswer && (
          <div className="mt-4 p-4 bg-white border border-forest-200 rounded-2xl text-xs space-y-2 animate-fadeIn">
            <p className="font-bold text-forest-900 font-serif text-sm">
              Gemma Memory Synthesis:
            </p>
            <p className="text-earth-bark leading-relaxed">
              {memoryAnswer.summary}
            </p>
            {memoryAnswer.insights && memoryAnswer.insights.length > 0 && (
              <ul className="list-disc pl-4 text-earth-moss space-y-1">
                {memoryAnswer.insights.map((ins, i) => (
                  <li key={i}>{ins}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Search Filter */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter adventures by title or activity..."
          className="w-full px-4 py-3 pl-10 rounded-2xl border border-earth-stone bg-white text-earth-bark text-xs focus:ring-2 focus:ring-forest-500"
        />
        <Search className="w-4 h-4 text-earth-moss absolute left-3.5 top-3.5" />
      </div>

      {/* Adventures Timeline / Cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-earth-stone">
            <BookOpen className="w-10 h-10 text-earth-moss mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-forest-900">No adventures found</p>
            <p className="text-xs text-earth-moss mt-1">Start your first outdoor micro-trail!</p>
          </div>
        ) : (
          filtered.map((adv) => {
            const dateStr = adv.journal?.date || new Date(adv.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            return (
              <div
                key={adv.id}
                onClick={() => onSelectAdventure(adv)}
                className="bg-white border border-earth-stone hover:border-forest-500 rounded-2xl p-5 cursor-pointer shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-forest-700 bg-forest-50 px-2.5 py-0.5 rounded-full border border-forest-100">
                      {dateStr}
                    </span>
                    <span className="text-xs text-earth-moss font-medium">
                      {adv.activity}
                    </span>
                    {adv.isDemo && (
                      <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                        Demo
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-serif font-bold text-forest-950 group-hover:text-forest-700 transition-colors">
                    {adv.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-earth-moss">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-forest-600" />
                      {adv.durationMinutes} mins outside
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-forest-600" />
                      {adv.mission?.checkpoints?.filter((c) => c.completed).length || 5} missions
                    </span>
                    <span className="flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5 text-forest-600" />
                      {adv.observations?.length || 0} observations
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase text-earth-moss block">Outside Score</span>
                    <span className="text-xl font-bold font-serif text-forest-900">{adv.outsideScore}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-cream-100 group-hover:bg-forest-100 transition-colors">
                    <ChevronRight className="w-4 h-4 text-forest-800" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
