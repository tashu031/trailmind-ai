import React, { useState, useRef } from 'react';
import { Camera, X, Volume2, Sparkles, MapPin, Check } from 'lucide-react';
import { Observation } from '../types';

interface ObservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (obs: Observation) => void;
  checkpointIndex?: number;
  adventureId?: string;
}

const MOODS = [
  { emoji: '✨', label: 'Inspired' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '🤔', label: 'Curious' },
  { emoji: '🙂', label: 'Joyful' },
];

export const ObservationModal: React.FC<ObservationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  checkpointIndex,
  adventureId,
}) => {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [mood, setMood] = useState('✨');
  const [soundDescription, setSoundDescription] = useState('');
  const [photoBase64, setPhotoBase64] = useState<string | undefined>(undefined);
  const [includeLocation, setIncludeLocation] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const requestGeolocation = () => {
    if (!includeLocation && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setIncludeLocation(true);
        },
        () => {
          setIncludeLocation(false);
        }
      );
    } else {
      setIncludeLocation(!includeLocation);
    }
  };

  const handleSave = () => {
    const newObs: Observation = {
      id: 'obs-' + Date.now(),
      adventureId,
      checkpointIndex,
      title: title.trim() || 'Outdoor Observation',
      note: note.trim(),
      photoBase64,
      mood,
      soundDescription: soundDescription.trim() || undefined,
      timestamp: new Date().toISOString(),
      coordinates: includeLocation ? coords : undefined,
    };

    onSave(newObs);
    // Reset form
    setTitle('');
    setNote('');
    setPhotoBase64(undefined);
    setSoundDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-earth-bark/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-cream-50 border border-earth-stone w-full max-w-lg rounded-3xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-earth-stone pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-forest-100 text-forest-800">
              <Camera className="w-5 h-5 text-forest-600" />
            </span>
            <div>
              <h3 className="font-serif font-bold text-lg text-forest-900 leading-tight">
                Capture Observation
              </h3>
              <p className="text-xs text-earth-moss">
                Record what caught your senses
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-earth-moss hover:bg-cream-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Photo Section */}
        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-earth-moss mb-2">
            Photo (Optional)
          </label>
          {photoBase64 ? (
            <div className="relative rounded-2xl overflow-hidden border border-earth-stone bg-cream-200 max-h-48 flex items-center justify-center">
              <img src={photoBase64} alt="Captured observation" className="w-full h-48 object-cover" />
              <button
                onClick={() => setPhotoBase64(undefined)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-earth-bark/70 text-cream-50 hover:bg-earth-bark"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-earth-stone hover:border-forest-500 rounded-2xl p-6 text-center cursor-pointer bg-cream-100/50 hover:bg-cream-100 transition-colors"
            >
              <Camera className="w-8 h-8 text-forest-600 mx-auto mb-2 opacity-80" />
              <p className="text-xs font-medium text-forest-900">
                Tap to take a photo or select an image
              </p>
              <p className="text-[11px] text-earth-moss mt-0.5">
                Leaves, flowers, birds, stones, textures
              </p>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            accept="image/*"
            capture="environment"
            className="hidden"
          />
        </div>

        {/* Title */}
        <div className="mb-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-earth-moss mb-1">
            What did you notice?
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Asymmetrical Neem leaf, Sunlit moss, Birdcall"
            className="w-full px-3.5 py-2.5 rounded-xl border border-earth-stone bg-cream-100 text-earth-bark placeholder:text-earth-moss/60 focus:outline-hidden focus:ring-2 focus:ring-forest-500 text-sm"
          />
        </div>

        {/* Note */}
        <div className="mb-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-earth-moss mb-1">
            Sensory Details & Notes
          </label>
          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Textures, colors, movement, unexpected patterns..."
            className="w-full px-3.5 py-2 rounded-xl border border-earth-stone bg-cream-100 text-earth-bark placeholder:text-earth-moss/60 focus:outline-hidden focus:ring-2 focus:ring-forest-500 text-sm"
          />
        </div>

        {/* Sound Description */}
        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-earth-moss mb-1 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-forest-600" />
            Sound / Acoustic Layer (Optional)
          </label>
          <input
            type="text"
            value={soundDescription}
            onChange={(e) => setSoundDescription(e.target.value)}
            placeholder="e.g. Distant wind in dry branches, Two rhythmic chirps"
            className="w-full px-3.5 py-2 rounded-xl border border-earth-stone bg-cream-100 text-earth-bark placeholder:text-earth-moss/60 focus:outline-hidden focus:ring-2 focus:ring-forest-500 text-sm"
          />
        </div>

        {/* Mood Selector */}
        <div className="mb-5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-earth-moss mb-2">
            Outdoor Mood
          </label>
          <div className="flex gap-2">
            {MOODS.map((m) => (
              <button
                key={m.emoji}
                type="button"
                onClick={() => setMood(m.emoji)}
                className={`flex-1 py-2 px-3 rounded-xl border text-sm flex items-center justify-center gap-1.5 transition-all ${
                  mood === m.emoji
                    ? 'border-forest-600 bg-forest-100 text-forest-900 font-bold shadow-xs'
                    : 'border-earth-stone bg-cream-100 text-earth-bark hover:bg-cream-200'
                }`}
              >
                <span className="text-base">{m.emoji}</span>
                <span className="text-xs">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Geolocation toggle */}
        <div className="flex items-center justify-between mb-5 px-1">
          <label className="flex items-center gap-2 text-xs text-earth-moss cursor-pointer">
            <input
              type="checkbox"
              checked={includeLocation}
              onChange={requestGeolocation}
              className="rounded text-forest-600 focus:ring-forest-500"
            />
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-forest-600" />
              Attach outdoor location tag (optional)
            </span>
          </label>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSave}
          className="w-full py-3.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-cream-50 font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Check className="w-4 h-4" />
          SAVE OBSERVATION
        </button>
      </div>
    </div>
  );
};
