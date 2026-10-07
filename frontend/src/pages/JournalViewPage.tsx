import React, { useState } from 'react';
import { 
  Sparkles, 
  Share2, 
  Download, 
  BookmarkCheck, 
  Clock, 
  Compass, 
  Heart, 
  Eye, 
  ArrowLeft,
  Volume2
} from 'lucide-react';
import { Journal, Observation } from '../types';
import { ShareCardModal } from '../components/ShareCardModal';
import { speakText } from '../services/speech';

interface JournalViewPageProps {
  journal: Journal;
  observations: Observation[];
  onBackToHistory: () => void;
  onNewAdventure: () => void;
}

export const JournalViewPage: React.FC<JournalViewPageProps> = ({
  journal,
  observations,
  onBackToHistory,
  onNewAdventure,
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(true);

  const handlePrint = () => {
    window.print();
  };

  const handleListenJournal = () => {
    speakText(`${journal.title}. ${journal.narrativeStory}`);
  };

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 px-4 space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHistory}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-earth-moss hover:text-forest-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Adventure Journals</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleListenJournal}
            className="p-2 rounded-xl bg-cream-200 text-forest-800 hover:bg-forest-100 transition-colors"
            title="Listen to story"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-forest-600 hover:bg-forest-700 text-cream-50 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Card</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-2 rounded-xl border border-earth-stone hover:bg-cream-200 text-xs font-medium text-earth-bark flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-earth-moss" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>

      {/* Editorial Journal Paper Container */}
      <article className="bg-cream-50 border border-earth-stone rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
        {/* Masthead */}
        <header className="border-b border-earth-stone/70 pb-6 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-forest-700">
            <Compass className="w-3.5 h-3.5" />
            <span>TrailMind Adventure Journal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-forest-950 leading-tight">
            {journal.title}
          </h1>

          <p className="text-xs font-mono text-earth-moss">
            {journal.date} • {journal.durationMinutes} Minutes Outside • {journal.missionsCompleted} Missions Completed
          </p>
        </header>

        {/* Mindful Outside Score Card */}
        <section aria-label="Outside Score" className="bg-white border border-forest-200/80 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-forest-600 block mb-0.5">
              Mindful Engagement Metric
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-serif font-bold text-forest-900">
                {journal.outsideScore}
              </span>
              <span className="text-xs font-mono text-earth-moss">/ 100 Outside Score</span>
            </div>
            <p className="text-xs text-earth-bark/80 mt-1 max-w-md">
              Based on {journal.durationMinutes}m outside, {journal.observationsCount} sensory discoveries, and {journal.screenLightMinutes}m minimal screen-light time.
            </p>
          </div>

          <div className="bg-cream-100 rounded-xl p-3 text-[11px] text-earth-moss font-mono max-w-xs border border-earth-stone/60">
            "This is not a fitness score. It simply represents your engagement with the adventure."
          </div>
        </section>

        {/* Narrative Story */}
        <section aria-label="Adventure Narrative" className="space-y-4">
          <h2 className="text-xs font-mono uppercase font-bold tracking-wider text-earth-moss">
            The Journey
          </h2>
          <div className="text-base sm:text-lg font-serif text-forest-950 leading-relaxed space-y-4 whitespace-pre-line">
            {journal.narrativeStory}
          </div>
        </section>

        {/* Discoveries List */}
        {journal.discoveries && journal.discoveries.length > 0 && (
          <section aria-label="Discoveries" className="bg-forest-50 border border-forest-200/70 rounded-2xl p-6 space-y-3">
            <h2 className="text-xs font-mono uppercase font-bold tracking-wider text-forest-800">
              Notable Discoveries
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {journal.discoveries.map((disc, idx) => (
                <div key={idx} className="bg-white p-3.5 rounded-xl border border-forest-100 text-xs text-forest-900 font-medium">
                  {disc}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reflective Highlights Grid */}
        <section aria-label="Reflection Highlights" className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="bg-white border border-earth-stone/80 rounded-2xl p-5 shadow-2xs">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-forest-700 block mb-1">
              Favorite Moment
            </span>
            <p className="text-sm font-serif text-earth-bark leading-relaxed italic">
              "{journal.favoriteMoment}"
            </p>
          </div>

          <div className="bg-white border border-earth-stone/80 rounded-2xl p-5 shadow-2xs">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-forest-700 block mb-1">
              What I Noticed
            </span>
            <p className="text-sm font-serif text-earth-bark leading-relaxed">
              {journal.whatINoticed}
            </p>
          </div>
        </section>

        {/* Next Time */}
        <section aria-label="Next Adventure Intention" className="bg-cream-100 border border-earth-stone rounded-2xl p-5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-earth-moss block mb-1">
            Intention For Next Time
          </span>
          <p className="text-sm text-forest-900 font-medium font-serif">
            {journal.nextTime}
          </p>
        </section>

        {/* Photo Gallery if photos were captured */}
        {observations.some((o) => o.photoBase64) && (
          <section aria-label="Captured Photographs" className="space-y-3 pt-2">
            <h2 className="text-xs font-mono uppercase font-bold tracking-wider text-earth-moss">
              Captured Moments ({observations.filter((o) => o.photoBase64).length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {observations
                .filter((o) => o.photoBase64)
                .map((obs) => (
                  <div key={obs.id} className="rounded-2xl overflow-hidden border border-earth-stone bg-white shadow-2xs group">
                    <img
                      src={obs.photoBase64}
                      alt={obs.title}
                      className="w-full h-36 object-cover group-hover:scale-102 transition-transform"
                    />
                    <div className="p-2.5 text-[11px]">
                      <p className="font-semibold text-forest-900 truncate">{obs.title}</p>
                      {obs.note && <p className="text-earth-moss truncate">{obs.note}</p>}
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Footer Meta */}
        <footer className="pt-6 border-t border-earth-stone/70 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-earth-moss">
          <span>Engine: {journal.providerUsed || 'Gemma Open AI'}</span>
          <span>IndexedDB Stored • Offline Safe</span>
        </footer>
      </article>

      {/* Bottom CTA */}
      <div className="text-center pt-2">
        <button
          onClick={onNewAdventure}
          className="px-8 py-4 rounded-2xl bg-forest-600 hover:bg-forest-700 text-cream-50 font-bold text-sm shadow-sm transition-all"
        >
          Plan Another Outside Adventure
        </button>
      </div>

      {/* Share Card Modal */}
      <ShareCardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        journal={journal}
      />
    </div>
  );
};
