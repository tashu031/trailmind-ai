import React from 'react';
import { 
  Compass, 
  ArrowRight, 
  Leaf, 
  Eye, 
  BookOpen, 
  Cpu, 
  ShieldCheck, 
  WifiOff, 
  Sparkles, 
  Footprints,
  Clock,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface LandingPageProps {
  onStartAdventure: () => void;
  onStartDemo: () => void;
  onExploreHistory: () => void;
  onOpenDetective: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAdventure,
  onStartDemo,
  onExploreHistory,
  onOpenDetective,
}) => {
  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-14 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        {/* Hacktoberfest Theme Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100 text-forest-800 text-xs font-mono font-medium border border-forest-200 shadow-2xs">
          <Footprints className="w-3.5 h-3.5 text-forest-600" />
          <span>Hacktoberfest 2026 • DEV Challenge: TOUCH GRASS</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-forest-950 tracking-tight leading-[1.08]">
          Your AI should help you <br className="hidden sm:inline" />
          <span className="text-forest-600 underline decoration-forest-200 decoration-wavy decoration-2">
            leave the screen.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-xl text-earth-bark/85 leading-relaxed font-sans max-w-2xl mx-auto">
          TrailMind turns walks, hikes, gardens, and everyday outdoor time into small mindful adventures powered by open-weight Gemma AI.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <button
            onClick={onStartAdventure}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-forest-600 hover:bg-forest-700 active:scale-98 text-cream-50 font-semibold text-base flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all"
          >
            <Compass className="w-5 h-5" />
            <span>Start an Adventure</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={onStartDemo}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-cream-50 hover:bg-cream-200 text-forest-900 border border-earth-stone font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-all"
          >
            <Sparkles className="w-4 h-4 text-earth-terracotta" />
            <span>Launch Jaipur Demo</span>
          </button>
        </div>

        <p className="text-xs text-earth-moss font-mono">
          Zero sign-up required • 100% offline-ready • Powered by local Gemma
        </p>
      </section>

      {/* Philosophy: The Core Loop */}
      <section className="bg-white border border-earth-stone rounded-3xl p-6 sm:p-10 shadow-xs">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-forest-600">
            The Touch Grass Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-forest-950 mt-1">
            Plan. Go Outside. Observe. Reflect.
          </h2>
          <p className="text-sm text-earth-moss mt-2">
            Most AI apps demand constant interaction. TrailMind uses AI at the edges so you can be present in the middle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Card 1: PLAN */}
          <div className="bg-cream-50 border border-cream-200 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-forest-100 text-forest-700 flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold uppercase text-forest-600">Phase 01</span>
              <h3 className="text-lg font-serif font-bold text-forest-900 mt-1 mb-2">
                PLAN With Gemma
              </h3>
              <p className="text-xs text-earth-bark/80 leading-relaxed">
                Choose your duration (15 to 90 min), activity, and curiosity. Gemma generates a tailored sensory micro-mission in seconds.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-cream-200 text-[11px] font-mono text-emerald-800">
              ⚡ 30 seconds on screen
            </div>
          </div>

          {/* Card 2: EXPLORE */}
          <div className="bg-forest-900 text-cream-50 rounded-2xl p-6 flex flex-col justify-between shadow-md relative overflow-hidden">
            <div className="absolute top-2 right-2 text-[10px] font-mono bg-forest-700 text-emerald-300 px-2 py-0.5 rounded-full">
              Screen Down Mode
            </div>
            <div>
              <div className="w-10 h-10 rounded-xl bg-forest-800 text-emerald-300 flex items-center justify-center mb-4">
                <Eye className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold uppercase text-emerald-300">Phase 02</span>
              <h3 className="text-lg font-serif font-bold text-white mt-1 mb-2">
                EXPLORE Outdoors
              </h3>
              <p className="text-xs text-cream-200/80 leading-relaxed">
                Phone in pocket. Listen for two distinct birds, feel tree bark, find natural geometry. Screen remains off until audio alerts.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-forest-800 text-[11px] font-mono text-emerald-400 font-semibold">
              🌲 95%+ of time screen-free
            </div>
          </div>

          {/* Card 3: REFLECT */}
          <div className="bg-cream-50 border border-cream-200 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-forest-100 text-forest-700 flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold uppercase text-forest-600">Phase 03</span>
              <h3 className="text-lg font-serif font-bold text-forest-900 mt-1 mb-2">
                REFLECT & Journal
              </h3>
              <p className="text-xs text-earth-bark/80 leading-relaxed">
                Answer 3 quick sensory reflection questions. Gemma crafts an editorial Adventure Journal celebrating what you noticed.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-cream-200 text-[11px] font-mono text-emerald-800">
              📖 Beautiful shareable memories
            </div>
          </div>
        </div>
      </section>

      {/* Section: AI That Gets Out of Your Way */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-earth-terracotta">
            Product Philosophy
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-forest-950 leading-tight">
            AI that gets out of your way.
          </h2>
          <p className="text-sm text-earth-bark/85 leading-relaxed">
            Every tech product in 2026 is designed for retention, notifications, and screen time maximization. We built TrailMind to celebrate the inverse: 
            <span className="font-semibold text-forest-900"> screen-light minutes.</span>
          </p>
          <div className="space-y-3 pt-2 text-xs text-earth-bark">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
              <span>
                <strong className="text-forest-900">No Chatbot Distraction: </strong>
                No conversational loops keeping you thumbing glass on the trail.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
              <span>
                <strong className="text-forest-900">High-Contrast Outdoor Mode: </strong>
                Legible in blinding sun, minimalist buttons, fast photo notes.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
              <span>
                <strong className="text-forest-900">Mindful Outside Score: </strong>
                Non-competitive measurement honoring real-world sensory curiosity.
              </span>
            </div>
          </div>
        </div>

        {/* Feature showcase card */}
        <div className="bg-cream-50 border border-earth-stone rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="border-b border-cream-200 pb-4 mb-4">
            <span className="text-[10px] font-mono font-bold uppercase text-forest-600 tracking-wider">
              Example Outdoor Mission Generated
            </span>
            <h3 className="font-serif font-bold text-xl text-forest-900 mt-1">
              "The Hidden Details Walk"
            </h3>
            <p className="text-xs text-earth-moss mt-0.5">
              45 Minutes • Easy Difficulty • Plants & Photography
            </p>
          </div>

          <div className="space-y-2.5 text-xs text-earth-bark font-sans">
            <div className="p-2.5 rounded-xl bg-white border border-cream-200 flex items-center justify-between">
              <span>🌿 Checkpoint 1: Find two contrasting leaf edge geometries</span>
              <span className="font-mono text-earth-moss text-[11px]">5m</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-cream-200 flex items-center justify-between">
              <span>👂 Checkpoint 2: Stop for 60s and map closest vs furthest sound</span>
              <span className="font-mono text-earth-moss text-[11px]">5m</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-cream-200 flex items-center justify-between">
              <span>🍂 Checkpoint 3: Locate physical evidence of seasonal transition</span>
              <span className="font-mono text-earth-moss text-[11px]">6m</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-cream-200 flex items-center justify-between">
              <span>📸 Checkpoint 4: Macro photograph natural weathering on stone/bark</span>
              <span className="font-mono text-earth-moss text-[11px]">7m</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-cream-200 flex items-center justify-between">
              <span>🪑 Checkpoint 5: Sit motionless for 2 min. Notice what moves around you</span>
              <span className="font-mono text-earth-moss text-[11px]">6m</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Why Open AI? */}
      <section className="bg-forest-900 text-cream-50 rounded-3xl p-6 sm:p-12 shadow-lg">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-emerald-400">
            Open-Weight Principles
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-1">
            Why Open AI Matters for the Outdoors
          </h2>
          <p className="text-sm text-cream-200/80 mt-2">
            Nature walks shouldn't require sending your location and private photos to commercial cloud servers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-forest-800/80 border border-forest-700/80 rounded-2xl p-5">
            <Cpu className="w-6 h-6 text-emerald-400 mb-3" />
            <h3 className="font-serif font-bold text-base text-white mb-1">
              Local Gemma Inference
            </h3>
            <p className="text-xs text-cream-200/80 leading-relaxed">
              Runs directly on your laptop or mobile edge via Ollama. No expensive API tokens, zero rate limits.
            </p>
          </div>

          <div className="bg-forest-800/80 border border-forest-700/80 rounded-2xl p-5">
            <Lock className="w-6 h-6 text-emerald-400 mb-3" />
            <h3 className="font-serif font-bold text-base text-white mb-1">
              Absolute User Privacy
            </h3>
            <p className="text-xs text-cream-200/80 leading-relaxed">
              Your outdoor photos, observations, and coordinates remain on your device in IndexedDB.
            </p>
          </div>

          <div className="bg-forest-800/80 border border-forest-700/80 rounded-2xl p-5">
            <WifiOff className="w-6 h-6 text-emerald-400 mb-3" />
            <h3 className="font-serif font-bold text-base text-white mb-1">
              100% Offline Resilience
            </h3>
            <p className="text-xs text-cream-200/80 leading-relaxed">
              Forest trails frequently lack cellular signal. TrailMind’s PWA and client engine work without internet.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action bar */}
      <section className="text-center py-6 border-t border-earth-stone">
        <h3 className="text-xl font-serif font-bold text-forest-900 mb-2">
          Ready to put your phone in your pocket?
        </h3>
        <p className="text-xs text-earth-moss mb-4">
          Set up a 15-minute micro-walk or a 45-minute nature exploration.
        </p>
        <button
          onClick={onStartAdventure}
          className="px-8 py-3.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-cream-50 font-semibold text-sm shadow-sm transition-all"
        >
          Create Your Outside Mission
        </button>
      </section>
    </div>
  );
};
