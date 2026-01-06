import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Camera, Plus, X, ImageIcon, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import type { CardBuilderState } from '@/pages/CardBuilder';

interface Props {
  state: CardBuilderState;
  updateState: (updates: Partial<CardBuilderState>) => void;
}

const INCLUDED_PHOTOS = {
  good: 2,
  better: 4,
  best: 6,
};

const EXTRA_PHOTO_PRICE = 19;
const SIZE_UPGRADE_PRICE = 5;

const BuilderStepPhotos = ({ state, updateState }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const includedCount = INCLUDED_PHOTOS[state.selectedPackage];
  const uploadedCount = state.celebrationPhotos.length;
  const extraCount = Math.max(0, uploadedCount - includedCount);
  const extraCost = extraCount * EXTRA_PHOTO_PRICE;
  const sizeCost = state.photoSize === '18x24' ? SIZE_UPGRADE_PRICE * Math.max(includedCount, uploadedCount) : 0;

  const handleUpload = (files: FileList | null) => {
    if (!files) return;
    const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
    updateState({ 
      celebrationPhotos: [...state.celebrationPhotos, ...newPhotos] 
    });
    toast.success(`${newPhotos.length} photo${newPhotos.length > 1 ? 's' : ''} added!`);
  };

  const removePhoto = (index: number) => {
    updateState({
      celebrationPhotos: state.celebrationPhotos.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-600/20 flex items-center justify-center">
          <Camera className="w-8 h-8 text-amber-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Celebration Photos
        </h2>
        <p className="text-slate-400">
          Beautiful easel photos for the memorial service.
        </p>
        <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
          <Sparkles className="w-4 h-4" />
          {includedCount} photos included in your package!
        </div>
      </div>

      {/* Size selection */}
      <div className="space-y-2">
        <Label className="text-slate-400 text-sm">Photo Size</Label>
        <RadioGroup
          value={state.photoSize}
          onValueChange={(v) => updateState({ photoSize: v as '16x20' | '18x24' })}
          className="flex gap-4"
        >
          <label 
            className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all ${
              state.photoSize === '16x20' 
                ? 'border-amber-500 bg-amber-500/10' 
                : 'border-slate-600 hover:border-slate-500'
            }`}
          >
            <RadioGroupItem value="16x20" className="sr-only" />
            <div className="text-center">
              <p className="font-bold text-white">16" × 20"</p>
              <p className="text-sm text-green-400">Included</p>
            </div>
          </label>
          <label 
            className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all ${
              state.photoSize === '18x24' 
                ? 'border-amber-500 bg-amber-500/10' 
                : 'border-slate-600 hover:border-slate-500'
            }`}
          >
            <RadioGroupItem value="18x24" className="sr-only" />
            <div className="text-center">
              <p className="font-bold text-white">18" × 24"</p>
              <p className="text-sm text-amber-400">+${SIZE_UPGRADE_PRICE}/photo</p>
            </div>
          </label>
        </RadioGroup>
      </div>

      {/* Photo grid */}
      <div className="space-y-2">
        <Label className="text-slate-400 text-sm">
          Your Photos ({uploadedCount}/{includedCount} included)
        </Label>
        <div className="grid grid-cols-3 gap-3">
          {state.celebrationPhotos.map((photo, index) => (
            <div 
              key={index} 
              className={`relative aspect-[4/5] rounded-lg overflow-hidden border-2 ${
                index < includedCount ? 'border-green-500/50' : 'border-amber-500/50'
              }`}
            >
              <img 
                src={photo} 
                alt={`Photo ${index + 1}`} 
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-1 right-1 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center hover:bg-black/90"
              >
                <X className="w-4 h-4 text-white" />
              </button>
              {index >= includedCount && (
                <div className="absolute bottom-0 left-0 right-0 bg-amber-500/90 text-center text-xs text-white py-1">
                  +${EXTRA_PHOTO_PRICE}
                </div>
              )}
            </div>
          ))}
          
          {/* Add more button */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-[4/5] rounded-lg border-2 border-dashed border-slate-600 hover:border-amber-500/50 flex flex-col items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-8 h-8 text-slate-500" />
            <span className="text-xs text-slate-500">Add Photo</span>
          </button>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleUpload(e.target.files)}
      />

      {/* Skip option */}
      {uploadedCount === 0 && (
        <div className="text-center p-4 bg-slate-700/30 rounded-lg">
          <ImageIcon className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm text-slate-400">
            No photos uploaded yet. You can upload now or add them later.
          </p>
          <p className="text-xs text-slate-500 mt-1">
            (We'll use your card photo if no other photos are provided)
          </p>
        </div>
      )}

      {/* Cost summary */}
      {(extraCount > 0 || sizeCost > 0) && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <p className="font-medium text-white mb-2">Photo Add-ons</p>
          <div className="space-y-1 text-sm">
            {extraCount > 0 && (
              <div className="flex justify-between text-slate-300">
                <span>{extraCount} extra photo{extraCount > 1 ? 's' : ''}</span>
                <span>+${extraCost}</span>
              </div>
            )}
            {sizeCost > 0 && (
              <div className="flex justify-between text-slate-300">
                <span>Size upgrade (18×24)</span>
                <span>+${sizeCost}</span>
              </div>
            )}
            <div className="flex justify-between text-amber-400 font-bold pt-1 border-t border-amber-500/30">
              <span>Additional</span>
              <span>+${extraCost + sizeCost}</span>
            </div>
          </div>
        </div>
      )}

      <div className="text-center pt-4 border-t border-slate-700">
        <p className="text-sm text-slate-500">
          Photos are printed on premium photo paper with easel backing, ready for display.
        </p>
      </div>
    </div>
  );
};

export default BuilderStepPhotos;
