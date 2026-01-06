import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ImageIcon, Upload, RotateCcw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { CardBuilderState } from '@/pages/CardBuilder';

interface Props {
  state: CardBuilderState;
  updateState: (updates: Partial<CardBuilderState>) => void;
}

const BuilderStepPhoto = ({ state, updateState }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (file: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    updateState({ 
      photo: url,
      photoZoom: 1,
      photoPanX: 0,
      photoPanY: 0,
    });
    toast.success('Photo uploaded!');
  };

  const handleReset = () => {
    updateState({ 
      photoZoom: 1,
      photoPanX: 0,
      photoPanY: 0,
    });
  };

  const handleRemove = () => {
    updateState({ 
      photo: null,
      photoZoom: 1,
      photoPanX: 0,
      photoPanY: 0,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Add Their Photo
        </h2>
        <p className="text-slate-400">
          Choose a beautiful photo that captures their spirit.
        </p>
      </div>

      {/* Preview */}
      <div className="flex justify-center">
        <div className="aspect-[2/3.5] w-56 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 via-white to-gray-200 p-1">
          <div className="w-full h-full rounded-xl bg-slate-700 flex items-center justify-center overflow-hidden relative">
            {state.photo ? (
              <img
                src={state.photo}
                alt="Memorial"
                className="w-full h-full object-cover pointer-events-none"
                style={{
                  transform: `scale(${state.photoZoom}) translate(${state.photoPanX}px, ${state.photoPanY}px)`,
                  transformOrigin: 'center',
                }}
              />
            ) : (
              <div 
                className="text-center p-4 cursor-pointer hover:bg-slate-600/50 w-full h-full flex flex-col items-center justify-center transition-colors"
                onClick={() => inputRef.current?.click()}
              >
                <ImageIcon className="h-12 w-12 text-slate-500 mb-2" />
                <p className="text-slate-400 text-sm">Click to upload</p>
              </div>
            )}

            {/* Name overlay preview */}
            {state.photo && state.deceasedName && (
              <div className="absolute bottom-6 left-0 right-0 text-center">
                <p 
                  className="text-white font-bold text-lg drop-shadow-lg"
                  style={{ 
                    fontFamily: 'Great Vibes, cursive',
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  }}
                >
                  {state.deceasedName}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload controls */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
      />

      <div className="flex justify-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          className="border-amber-600/50 text-amber-400 hover:bg-amber-600/20"
        >
          <Upload className="h-4 w-4 mr-2" />
          {state.photo ? 'Change Photo' : 'Upload Photo'}
        </Button>
        {state.photo && (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleRemove}
              className="border-rose-600/50 text-rose-400 hover:bg-rose-600/20"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Zoom control */}
      {state.photo && (
        <div className="max-w-xs mx-auto space-y-2">
          <Label className="text-slate-400 text-sm">Zoom</Label>
          <Slider
            value={[state.photoZoom]}
            onValueChange={([v]) => updateState({ photoZoom: v })}
            min={1}
            max={3}
            step={0.1}
            className="w-full"
          />
        </div>
      )}

      <div className="text-center pt-4 border-t border-slate-700">
        <p className="text-sm text-slate-500">
          Tip: Portrait photos work best. You can zoom and adjust after uploading.
        </p>
      </div>
    </div>
  );
};

export default BuilderStepPhoto;
