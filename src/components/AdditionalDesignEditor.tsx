import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ImageIcon, RotateCcw, Trash2, Book, Check } from 'lucide-react';
import { prayerTemplates } from '@/data/prayerTemplates';

// Imports for backgrounds
import cloudsLightBg from '@/assets/backgrounds/clouds-light.jpg';
import marbleGreyBg from '@/assets/backgrounds/marble-grey.jpg';
import sunsetCloudsBg from '@/assets/backgrounds/sunset-clouds.jpg';
import liliesCreamBg from '@/assets/backgrounds/lilies-cream.jpg';
import heavenlyRaysBg from '@/assets/backgrounds/heavenly-rays.jpg';
import oceanSunsetBg from '@/assets/backgrounds/ocean-sunset.jpg';
import doveLightBg from '@/assets/backgrounds/dove-light.jpg';
import mountainSunriseBg from '@/assets/backgrounds/mountain-sunrise.jpg';
import rosesGardenBg from '@/assets/backgrounds/roses-garden.jpg';
import forestPathBg from '@/assets/backgrounds/forest-path.jpg';
import stainedGlassBg from '@/assets/backgrounds/stained-glass.jpg';
import lavenderFieldBg from '@/assets/backgrounds/lavender-field.jpg';
import cherryBlossomsBg from '@/assets/backgrounds/cherry-blossoms.jpg';
import starryNightBg from '@/assets/backgrounds/starry-night.jpg';
import goldMarbleBg from '@/assets/backgrounds/gold-marble.jpg';
import mistyLakeBg from '@/assets/backgrounds/misty-lake.jpg';
import whiteFeathersBg from '@/assets/backgrounds/white-feathers.jpg';
import vintageRosesBg from '@/assets/backgrounds/vintage-roses.jpg';
import wheatSunsetBg from '@/assets/backgrounds/wheat-sunset.jpg';
import gardenPeaceBg from '@/assets/backgrounds/garden-peace.jpg';

const PRESET_BACKGROUNDS = [
  { id: 'clouds', name: 'Soft Clouds', src: cloudsLightBg, isDark: false },
  { id: 'marble', name: 'Grey Marble', src: marbleGreyBg, isDark: false },
  { id: 'sunset', name: 'Sunset Clouds', src: sunsetCloudsBg, isDark: true },
  { id: 'lilies', name: 'White Lilies', src: liliesCreamBg, isDark: false },
  { id: 'rays', name: 'Heavenly Rays', src: heavenlyRaysBg, isDark: false },
  { id: 'ocean', name: 'Ocean Sunset', src: oceanSunsetBg, isDark: true },
  { id: 'dove', name: 'Dove Light', src: doveLightBg, isDark: false },
  { id: 'mountain', name: 'Mountain Sunrise', src: mountainSunriseBg, isDark: true },
  { id: 'roses', name: 'Rose Garden', src: rosesGardenBg, isDark: true },
  { id: 'forest', name: 'Forest Path', src: forestPathBg, isDark: true },
  { id: 'stained-glass', name: 'Stained Glass', src: stainedGlassBg, isDark: true },
  { id: 'lavender', name: 'Lavender Field', src: lavenderFieldBg, isDark: true },
  { id: 'cherry', name: 'Cherry Blossoms', src: cherryBlossomsBg, isDark: false },
  { id: 'starry', name: 'Starry Night', src: starryNightBg, isDark: true },
  { id: 'gold-marble', name: 'Gold Marble', src: goldMarbleBg, isDark: false },
  { id: 'misty-lake', name: 'Misty Lake', src: mistyLakeBg, isDark: false },
  { id: 'feathers', name: 'White Feathers', src: whiteFeathersBg, isDark: false },
  { id: 'vintage-roses', name: 'Vintage Roses', src: vintageRosesBg, isDark: false },
  { id: 'wheat', name: 'Wheat Sunset', src: wheatSunsetBg, isDark: true },
  { id: 'garden', name: 'Garden Peace', src: gardenPeaceBg, isDark: true },
];

export interface AdditionalDesignData {
  qty: number;
  size: '2.625x4.375' | '3.125x4.875';
  photo: string | null;
  photoZoom: number;
  photoPanX: number;
  photoPanY: number;
  photoRotation: number;
  photoBrightness: number;
  photoFade: boolean;
  backgroundId: string | null;
  customBackground: string | null;
  prayerText: string;
  selectedPrayerId: string;
}

export const createEmptyDesign = (): AdditionalDesignData => ({
  qty: 10,
  size: '2.625x4.375',
  photo: null,
  photoZoom: 1,
  photoPanX: 0,
  photoPanY: 0,
  photoRotation: 0,
  photoBrightness: 100,
  photoFade: false,
  backgroundId: null,
  customBackground: null,
  prayerText: 'The Lord is my shepherd; I shall not want.',
  selectedPrayerId: 'custom',
});

interface AdditionalDesignEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  design: AdditionalDesignData;
  onSave: (design: AdditionalDesignData) => void;
  designIndex: number;
  deceasedName: string;
  birthDate: string;
  deathDate: string;
}

export const AdditionalDesignEditor = ({
  open,
  onOpenChange,
  design,
  onSave,
  designIndex,
  deceasedName,
  birthDate,
  deathDate,
}: AdditionalDesignEditorProps) => {
  const [localDesign, setLocalDesign] = useState<AdditionalDesignData>(design);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  // Reset local state when dialog opens or design changes
  useEffect(() => {
    if (open) {
      setLocalDesign(design);
    }
  }, [open, design]);

  const handlePhotoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setLocalDesign({ 
        ...localDesign, 
        photo: e.target?.result as string,
        photoZoom: 1,
        photoPanX: 0,
        photoPanY: 0,
        photoRotation: 0,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleBgUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setLocalDesign({ 
        ...localDesign, 
        customBackground: e.target?.result as string,
        backgroundId: null,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPresetBg = (bgId: string) => {
    setLocalDesign({
      ...localDesign,
      backgroundId: bgId,
      customBackground: null,
    });
  };

  const handleSelectPrayer = (prayerId: string) => {
    const prayer = prayerTemplates.find(p => p.id === prayerId);
    if (prayer) {
      setLocalDesign({
        ...localDesign,
        prayerText: prayer.text,
        selectedPrayerId: prayerId,
      });
    } else {
      setLocalDesign({
        ...localDesign,
        selectedPrayerId: 'custom',
      });
    }
  };

  const handleSave = () => {
    onSave(localDesign);
    onOpenChange(false);
  };

  const getBackgroundSrc = () => {
    if (localDesign.customBackground) return localDesign.customBackground;
    if (localDesign.backgroundId) {
      const bg = PRESET_BACKGROUNDS.find(b => b.id === localDesign.backgroundId);
      return bg?.src || null;
    }
    return null;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-slate-800 border-slate-700 p-0">
        <DialogHeader className="p-4 border-b border-slate-700">
          <DialogTitle className="text-white">Edit Design {designIndex + 2}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 max-h-[calc(90vh-140px)]">
          <div className="p-4 space-y-6">
            {/* Quantity */}
            <div className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg">
              <Label className="text-white font-medium">Quantity for this design:</Label>
              <Input
                type="number"
                min="1"
                value={localDesign.qty}
                onChange={(e) => setLocalDesign({ ...localDesign, qty: Math.max(1, parseInt(e.target.value) || 1) })}
                className="w-24 bg-slate-800 border-slate-600 text-white"
              />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Photo Upload & Preview */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-amber-400" />
                  Front Photo
                </h3>
                
                {/* Card Preview */}
                <div className="flex justify-center">
                  <div className="aspect-[2.5/4.25] w-48 rounded shadow-2xl relative overflow-hidden bg-slate-700">
                    {/* Background */}
                    {getBackgroundSrc() && (
                      <img 
                        src={getBackgroundSrc()!}
                        alt="Background"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                    
                    {/* Photo */}
                    {localDesign.photo && (
                      <div className="absolute inset-0 overflow-hidden">
                        <img
                          src={localDesign.photo}
                          alt="Memorial"
                          className="absolute w-full h-full object-cover"
                          style={{
                            transform: `scale(${localDesign.photoZoom}) translate(${localDesign.photoPanX}%, ${localDesign.photoPanY}%) rotate(${localDesign.photoRotation}deg)`,
                            transformOrigin: 'center center',
                            filter: `brightness(${localDesign.photoBrightness}%)`,
                          }}
                        />
                        {localDesign.photoFade && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        )}
                      </div>
                    )}
                    
                    {/* Text Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-3">
                      <p className="text-white text-center font-script text-lg drop-shadow-lg" style={{ fontFamily: 'Great Vibes' }}>
                        {deceasedName || 'Name Here'}
                      </p>
                      {birthDate && deathDate && (
                        <p className="text-white/80 text-center text-xs drop-shadow">
                          {formatDate(birthDate)} — {formatDate(deathDate)}
                        </p>
                      )}
                    </div>

                    {/* No Photo Placeholder */}
                    {!localDesign.photo && !getBackgroundSrc() && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-slate-400 text-sm text-center px-4">
                          Upload a photo
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Photo Upload Controls */}
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])}
                />
                <div className="flex gap-2 justify-center flex-wrap">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => photoInputRef.current?.click()}
                    className="border-amber-600/50 text-amber-400 hover:bg-amber-600/20"
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    {localDesign.photo ? 'Change Photo' : 'Upload Photo'}
                  </Button>
                  {localDesign.photo && (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setLocalDesign({ 
                          ...localDesign, 
                          photoZoom: 1, 
                          photoPanX: 0, 
                          photoPanY: 0, 
                          photoRotation: 0,
                          photoBrightness: 100,
                        })}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setLocalDesign({ ...localDesign, photo: null })}
                        className="border-rose-600/50 text-rose-400 hover:bg-rose-600/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>

                {/* Photo Adjustments */}
                {localDesign.photo && (
                  <div className="space-y-2 p-3 bg-slate-700/30 rounded-lg">
                    <Label className="text-white text-sm font-medium">Adjust Photo</Label>
                    <div className="flex items-center gap-3">
                      <Label className="text-slate-400 text-xs w-16">Zoom</Label>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={localDesign.photoZoom}
                        onChange={(e) => setLocalDesign({ ...localDesign, photoZoom: parseFloat(e.target.value) })}
                        className="flex-1 accent-amber-600"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Label className="text-slate-400 text-xs w-16">Left/Right</Label>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        step="1"
                        value={localDesign.photoPanX}
                        onChange={(e) => setLocalDesign({ ...localDesign, photoPanX: parseFloat(e.target.value) })}
                        className="flex-1 accent-amber-600"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Label className="text-slate-400 text-xs w-16">Up/Down</Label>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        step="1"
                        value={localDesign.photoPanY}
                        onChange={(e) => setLocalDesign({ ...localDesign, photoPanY: parseFloat(e.target.value) })}
                        className="flex-1 accent-amber-600"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Label className="text-slate-400 text-xs w-16">Rotate</Label>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        step="1"
                        value={localDesign.photoRotation}
                        onChange={(e) => setLocalDesign({ ...localDesign, photoRotation: parseFloat(e.target.value) })}
                        className="flex-1 accent-amber-600"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Label className="text-slate-400 text-xs w-16">Brightness</Label>
                      <input
                        type="range"
                        min="50"
                        max="150"
                        step="5"
                        value={localDesign.photoBrightness}
                        onChange={(e) => setLocalDesign({ ...localDesign, photoBrightness: parseFloat(e.target.value) })}
                        className="flex-1 accent-amber-600"
                      />
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-600">
                      <Label className="text-slate-400 text-xs">Photo Fade Effect</Label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={localDesign.photoFade} 
                          onChange={(e) => setLocalDesign({ ...localDesign, photoFade: e.target.checked })}
                          className="accent-amber-600"
                        />
                        <span className="text-slate-300 text-xs">{localDesign.photoFade ? 'On' : 'Off'}</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Background Selection */}
                <div className="space-y-3 p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <Label className="text-white text-sm font-medium">Background</Label>
                    <input
                      ref={bgInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleBgUpload(e.target.files[0])}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => bgInputRef.current?.click()}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700 text-xs"
                    >
                      Upload Custom
                    </Button>
                  </div>
                  <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto">
                    {PRESET_BACKGROUNDS.slice(0, 10).map((bg) => (
                      <button
                        key={bg.id}
                        type="button"
                        onClick={() => handleSelectPresetBg(bg.id)}
                        className={`aspect-square rounded overflow-hidden border-2 transition-all ${
                          localDesign.backgroundId === bg.id
                            ? 'border-amber-500 ring-2 ring-amber-500/50'
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                      >
                        <img src={bg.src} alt={bg.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Prayer Selection */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Book className="h-4 w-4 text-amber-400" />
                  Prayer / Back Text
                </h3>

                {/* Prayer Templates */}
                <div className="space-y-2">
                  <Label className="text-slate-400 text-sm">Choose a Prayer</Label>
                  <Select value={localDesign.selectedPrayerId} onValueChange={handleSelectPrayer}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select a prayer" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      <SelectItem value="custom">Custom Text</SelectItem>
                      {prayerTemplates.map((prayer) => (
                        <SelectItem key={prayer.id} value={prayer.id}>
                          {prayer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom Prayer Text */}
                <div className="space-y-2">
                  <Label className="text-slate-400 text-sm">Prayer Text</Label>
                  <Textarea
                    value={localDesign.prayerText}
                    onChange={(e) => setLocalDesign({ ...localDesign, prayerText: e.target.value, selectedPrayerId: 'custom' })}
                    rows={8}
                    className="bg-slate-700 border-slate-600 text-white resize-none"
                    placeholder="Enter your prayer or message..."
                  />
                </div>

                {/* Quick Prayer Suggestions */}
                <div className="space-y-2">
                  <Label className="text-slate-400 text-sm">Quick Select</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {prayerTemplates.slice(0, 4).map((prayer) => (
                      <button
                        key={prayer.id}
                        type="button"
                        onClick={() => handleSelectPrayer(prayer.id)}
                        className={`p-2 text-left rounded border text-xs transition-all ${
                          localDesign.selectedPrayerId === prayer.id
                            ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                            : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <div className="font-medium truncate">{prayer.name}</div>
                        <div className="text-slate-500 truncate">{prayer.tradition}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Check className="h-4 w-4 mr-2" />
            Save Design
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
