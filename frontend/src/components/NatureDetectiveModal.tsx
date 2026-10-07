import React, { useState, useRef } from 'react';
import { Search, Camera, AlertTriangle, ShieldCheck, CheckCircle2, X, Sparkles, Loader2 } from 'lucide-react';
import { analyzeObservationAPI } from '../services/api';
import { EducationalInsights } from '../types';

interface NatureDetectiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAttachToAdventure?: (insights: EducationalInsights) => void;
}

export const NatureDetectiveModal: React.FC<NatureDetectiveModalProps> = ({
  isOpen,
  onClose,
  onAttachToAdventure,
}) => {
  const [photoBase64, setPhotoBase64] = useState<string | undefined>(undefined);
  const [note, setNote] = useState('');
  const [subjectHint, setSubjectHint] = useState('Plants & Foliage');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EducationalInsights | null>(null);
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

  const handleAnalyze = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const data = await analyzeObservationAPI({
        imageBase64: photoBase64,
        note: note || `Exploring ${subjectHint}`,
        subjectHint,
        location: "Outdoor Trail"
      });
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetAll = () => {
    setPhotoBase64(undefined);
    setNote('');
    setResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-earth-bark/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-cream-50 border border-earth-stone w-full max-w-xl rounded-3xl p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-earth-stone pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-xl bg-forest-600 text-cream-50 shadow-xs">
              <Search className="w-5 h-5 text-cream-100" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-forest-900 leading-tight">
                  Nature Detective
                </h3>
                <span className="text-[10px] font-mono font-semibold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Gemma Ecological Engine
                </span>
              </div>
              <p className="text-xs text-earth-moss">
                Observe structural botany, birds, and geological patterns
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

        {/* Safety Warning Banner */}
        <div className="mb-4 bg-amber-50 border border-amber-200/80 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Educational Identification Only: </span>
            Never touch, ingest, or approach unknown wild plants, mushrooms, berries, insects, or wildlife.
          </div>
        </div>

        {/* Photo Upload Area */}
        <div className="mb-4">
          {photoBase64 ? (
            <div className="relative rounded-2xl overflow-hidden border border-earth-stone bg-cream-200 max-h-52 flex items-center justify-center">
              <img src={photoBase64} alt="Nature subject" className="w-full h-52 object-cover" />
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
              <p className="text-sm font-semibold text-forest-900">
                Capture or Upload Specimen Photo
              </p>
              <p className="text-xs text-earth-moss mt-1">
                Foliage, flowers, bark, lichens, birds, tracks, stone textures
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

        {/* Subject Category Selector */}
        <div className="mb-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-earth-moss mb-1">
            Subject Category
          </label>
          <div className="flex flex-wrap gap-1.5">
            {['Plants & Foliage', 'Trees & Bark', 'Birds & Wildlife', 'Rocks & Geology', 'Insects & Micro'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSubjectHint(cat)}
                className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                  subjectHint === cat
                    ? 'border-forest-600 bg-forest-100 text-forest-900 font-semibold'
                    : 'border-earth-stone bg-cream-100 text-earth-bark hover:bg-cream-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Notes / Clues */}
        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-earth-moss mb-1">
            What did you observe? (Leaf shape, smell, surrounding habitat)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Asymmetrical serrated leaf, growing near old stone wall..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-earth-stone bg-cream-100 text-earth-bark placeholder:text-earth-moss/60 focus:outline-hidden focus:ring-2 focus:ring-forest-500 text-sm"
          />
        </div>

        {/* Analyze Button */}
        {!result && (
          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-forest-600 hover:bg-forest-700 disabled:opacity-50 text-cream-50 font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing with Gemma Ecological Model...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Identify Specimen & Clues
              </>
            )}
          </button>
        )}

        {/* Analysis Result View */}
        {result && (
          <div className="mt-4 bg-white border border-forest-200 rounded-2xl p-5 shadow-xs animate-fadeIn">
            <div className="flex items-start justify-between mb-3 border-b border-cream-200 pb-3">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-wider text-earth-moss">
                  Tentative Ecological Match
                </p>
                <h4 className="text-lg font-bold text-forest-900 font-serif">
                  {result.identification}
                </h4>
              </div>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                result.confidence === 'High' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {result.confidence} Confidence
              </span>
            </div>

            {/* What I Noticed */}
            <div className="mb-3">
              <p className="text-xs font-bold text-forest-800 mb-1.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest-600" />
                Diagnostic Traits Observed:
              </p>
              <ul className="text-xs text-earth-bark space-y-1 pl-4 list-disc marker:text-forest-500">
                {result.whatNoticed.map((trait, i) => (
                  <li key={i}>{trait}</li>
                ))}
              </ul>
            </div>

            {/* How to Verify Safely */}
            <div className="mb-3">
              <p className="text-xs font-bold text-earth-moss mb-1.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
                How to Safely Verify in the Field:
              </p>
              <ul className="text-xs text-earth-moss space-y-1 pl-4 list-disc marker:text-earth-moss">
                {result.howToVerify.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>

            {/* Ecological Context */}
            {result.educationalContext && (
              <div className="bg-forest-50 rounded-xl p-3 text-xs text-forest-900 border border-forest-100 mb-4">
                <span className="font-semibold">Ecological Context: </span>
                {result.educationalContext}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              {onAttachToAdventure && (
                <button
                  onClick={() => {
                    onAttachToAdventure(result);
                    onClose();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-cream-50 font-medium text-xs flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Attach to Current Adventure
                </button>
              )}
              <button
                onClick={resetAll}
                className="px-4 py-2.5 rounded-xl border border-earth-stone hover:bg-cream-100 text-xs font-medium text-earth-bark"
              >
                Inspect Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
