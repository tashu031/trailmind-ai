import React, { useState } from 'react';
import { 
  Compass, 
  Clock, 
  MapPin, 
  Sparkles, 
  Check, 
  Heart, 
  ShieldCheck, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import { UserPreferences, Mission, AIStatus } from '../types';
import { generateMissionAPI } from '../services/api';

interface OnboardingPageProps {
  onMissionGenerated: (mission: Mission, prefs: UserPreferences) => void;
  aiStatus: AIStatus | null;
  initialDemo?: boolean;
}

const DURATIONS = [
  { value: 15, label: '15 min', desc: 'Micro pause' },
  { value: 30, label: '30 min', desc: 'Standard walk' },
  { value: 45, label: '45 min', desc: 'Deep explore' },
  { value: 60, label: '60 min', desc: 'Full trail' },
  { value: 90, label: '90+ min', desc: 'Expedition' },
];

const ACTIVITIES = [
  'Walking',
  'Hiking',
  'Mindfulness',
  'Nature Exploration',
  'Photography',
  'Birding',
  'Gardening',
  'Running',
  'Family Adventure',
  'Surprise Me',
];

const DIFFICULTIES = ['Relaxed', 'Easy', 'Moderate', 'Adventurous'];

const INTERESTS_LIST = [
  'Plants',
  'Birds',
  'Animals',
  'Photography',
  'Geology',
  'Weather',
  'Architecture',
  'History',
  'Sounds',
  'Mindfulness',
];

const PREFERENCES_LIST = [
  'Low walking',
  'Avoid stairs',
  'Quiet experience',
  'Family friendly',
  'Pet friendly',
];

export const OnboardingPage: React.FC<OnboardingPageProps> = ({
  onMissionGenerated,
  aiStatus,
  initialDemo = false,
}) => {
  const [userName, setUserName] = useState(initialDemo ? 'Jaipur Explorer' : 'Explorer');
  const [location, setLocation] = useState(initialDemo ? 'Jaipur City Forest & Smriti Van' : 'Local Garden or Park');
  const [duration, setDuration] = useState<number>(initialDemo ? 30 : 45);
  const [activity, setActivity] = useState<string>(initialDemo ? 'Nature Exploration' : 'Nature Walk');
  const [difficulty, setDifficulty] = useState<string>(initialDemo ? 'Easy' : 'Easy');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    initialDemo ? ['Plants', 'Photography', 'Sounds'] : ['Plants', 'Photography']
  );
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>(
    initialDemo ? ['Quiet experience'] : []
  );
  const [useGps, setUseGps] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const togglePref = (pref: string) => {
    setSelectedPrefs((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const requestGps = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUseGps(true);
          setLocation(`Nearby Trails (Lat: ${pos.coords.latitude.toFixed(3)}, Lng: ${pos.coords.longitude.toFixed(3)})`);
        },
        () => {
          setUseGps(false);
        }
      );
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);

    const prefs: UserPreferences = {
      userName: userName.trim() || 'Explorer',
      location: location.trim() || 'Outdoors',
      availableTimeMinutes: duration,
      activity,
      difficulty,
      interests: selectedInterests.length ? selectedInterests : ['Nature'],
      preferences: selectedPrefs,
      useDemo: initialDemo || location.toLowerCase().includes('jaipur'),
    };

    try {
      const mission = await generateMissionAPI(prefs);
      if (mission && mission.checkpoints && mission.checkpoints.length > 0) {
        onMissionGenerated(mission, prefs);
      } else {
        throw new Error('Mission generated with empty checkpoints');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Could not complete mission generation. Please try again or use Demo mode.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 px-4">
      {/* Title */}
      <div className="text-center mb-8">
        <span className="text-xs uppercase font-mono font-bold tracking-widest text-forest-600">
          Personalized Outdoor Engine
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-forest-950 mt-1">
          Create Your Outside Mission
        </h2>
        <p className="text-sm text-earth-moss mt-1.5 max-w-lg mx-auto">
          Tell open-weight Gemma what kind of sensory experience fits your time and environment today.
        </p>
      </div>

      <div className="bg-cream-50 border border-earth-stone rounded-3xl p-6 sm:p-8 shadow-xs space-y-7">
        {/* Name & Location (Optional, privacy-preserving) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-earth-moss mb-1">
              Explorer Name / Nickname
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. Maya"
              className="w-full px-3.5 py-2.5 rounded-xl border border-earth-stone bg-white text-earth-bark focus:ring-2 focus:ring-forest-500 text-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-earth-moss">
                Location (General Area)
              </label>
              <button
                type="button"
                onClick={requestGps}
                className="text-[11px] text-forest-700 underline font-medium hover:text-forest-900"
              >
                {useGps ? 'GPS Attached' : 'Attach GPS'}
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Central Park, Forest Path, Jaipur"
                className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-earth-stone bg-white text-earth-bark focus:ring-2 focus:ring-forest-500 text-sm"
              />
              <MapPin className="w-4 h-4 text-earth-moss absolute left-3 top-3" />
            </div>
            <p className="text-[10px] text-earth-moss/80 mt-1 font-mono">
              Never shared with cloud servers by default.
            </p>
          </div>
        </div>

        {/* Available Time */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-earth-moss mb-2.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-forest-600" />
            Available Time Outside
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {DURATIONS.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => setDuration(d.value)}
                className={`py-3 px-3 rounded-2xl border text-center transition-all ${
                  duration === d.value
                    ? 'border-forest-600 bg-forest-600 text-cream-50 font-bold shadow-xs'
                    : 'border-earth-stone bg-white text-earth-bark hover:bg-cream-200'
                }`}
              >
                <div className="text-sm">{d.label}</div>
                <div className={`text-[10px] mt-0.5 ${duration === d.value ? 'text-cream-200' : 'text-earth-moss'}`}>
                  {d.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Activity Choice */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-earth-moss mb-2.5">
            Activity Type
          </label>
          <div className="flex flex-wrap gap-2">
            {ACTIVITIES.map((act) => (
              <button
                key={act}
                type="button"
                onClick={() => setActivity(act)}
                className={`text-xs px-3.5 py-2 rounded-xl border transition-all ${
                  activity === act
                    ? 'border-forest-600 bg-forest-100 text-forest-900 font-bold'
                    : 'border-earth-stone bg-white text-earth-bark hover:bg-cream-100'
                }`}
              >
                {act}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-earth-moss mb-2.5">
            Difficulty / Pace
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => setDifficulty(diff)}
                className={`text-xs py-2.5 px-3 rounded-xl border text-center font-medium transition-all ${
                  difficulty === diff
                    ? 'border-forest-600 bg-forest-600 text-cream-50 font-bold shadow-2xs'
                    : 'border-earth-stone bg-white text-earth-bark hover:bg-cream-100'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-earth-moss mb-2">
            What are you curious about today? (Select all that inspire you)
          </label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS_LIST.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'border-forest-600 bg-forest-100 text-forest-900 font-semibold shadow-2xs'
                      : 'border-earth-stone bg-white text-earth-bark hover:bg-cream-100'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-forest-600" />}
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferences / Accessibility */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-earth-moss mb-2">
            Accessibility & Style Constraints
          </label>
          <div className="flex flex-wrap gap-2">
            {PREFERENCES_LIST.map((pref) => {
              const isSelected = selectedPrefs.includes(pref);
              return (
                <button
                  key={pref}
                  type="button"
                  onClick={() => togglePref(pref)}
                  className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'border-forest-600 bg-forest-100 text-forest-900 font-semibold'
                      : 'border-earth-stone bg-white text-earth-bark hover:bg-cream-100'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-forest-600" />}
                  {pref}
                </button>
              );
            })}
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-earth-terracotta/10 border border-earth-terracotta/30 text-earth-terracotta text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-4 rounded-2xl bg-forest-600 hover:bg-forest-700 active:scale-98 disabled:opacity-50 text-cream-50 font-bold text-base flex items-center justify-center gap-3 shadow-md transition-all"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Crafting Mission with Gemma...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Mission with Gemma</span>
              </>
            )}
          </button>

          <div className="text-center mt-2.5">
            <span className="text-[11px] text-earth-moss font-mono">
              Engine: {aiStatus?.runtime || 'Local Gemma (Ollama)'} • Zero cloud tracking
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
