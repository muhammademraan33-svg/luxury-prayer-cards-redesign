import { backgroundTextures, BackgroundStyle, BackgroundTexture } from '@/types/businessCard';
import { cn } from '@/lib/utils';
import { Upload, Image as ImageIcon, RectangleHorizontal, RectangleVertical } from 'lucide-react';
import { useRef } from 'react';

interface BackgroundSelectorProps {
  value: BackgroundStyle;
  onChange: (background: BackgroundStyle) => void;
  orientation: 'landscape' | 'portrait';
  onOrientationChange: (orientation: 'landscape' | 'portrait') => void;
}

export const BackgroundSelector = ({ value, onChange, orientation, onOrientationChange }: BackgroundSelectorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextureSelect = (texture: BackgroundTexture) => {
    onChange({ texture, customImage: texture === 'custom-photo' ? value.customImage : undefined });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange({ texture: 'custom-photo', customImage: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Orientation Toggle */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-foreground">Card Orientation</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onOrientationChange('landscape')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all',
              orientation === 'landscape'
                ? 'border-primary bg-accent'
                : 'border-border hover:border-primary/40'
            )}
          >
            <RectangleHorizontal className="w-5 h-5" />
            <span className="text-sm font-medium">Landscape</span>
          </button>
          <button
            onClick={() => onOrientationChange('portrait')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all',
              orientation === 'portrait'
                ? 'border-primary bg-accent'
                : 'border-border hover:border-primary/40'
            )}
          >
            <RectangleVertical className="w-5 h-5" />
            <span className="text-sm font-medium">Portrait</span>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-foreground">Background Finish</h3>
        <p className="text-xs text-muted-foreground">Select a premium metal finish or upload your own photo</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {backgroundTextures.map((texture) => (
          <button
            key={texture.value}
            onClick={() => handleTextureSelect(texture.value)}
            className={cn(
              'aspect-[4/3] rounded-xl border-2 transition-all overflow-hidden relative group',
              value.texture === texture.value
                ? 'border-primary ring-2 ring-primary/20 scale-105'
                : 'border-border hover:border-primary/40'
            )}
            title={texture.name}
          >
            <div 
              className="absolute inset-0"
              style={{ background: texture.preview }}
            />
            {/* Brushed metal lines effect */}
            {texture.value.startsWith('brushed') && (
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.1) 1px, rgba(255,255,255,0.1) 2px)',
                }}
              />
            )}
            {/* Marble veins effect */}
            {texture.value.startsWith('marble') && (
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M10,30 Q50,20 90,50 T180,80\' fill=\'none\' stroke=\'%23888\' stroke-width=\'0.5\'/%3E%3C/svg%3E")',
                }}
              />
            )}
            <span className="absolute bottom-1 left-1 right-1 text-[9px] font-medium text-center bg-black/50 text-white rounded px-1 py-0.5 backdrop-blur-sm">
              {texture.name}
            </span>
          </button>
        ))}

        {/* Custom Photo Upload */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'aspect-[4/3] rounded-xl border-2 border-dashed transition-all overflow-hidden relative flex flex-col items-center justify-center gap-2',
            value.texture === 'custom-photo'
              ? 'border-primary ring-2 ring-primary/20'
              : 'border-border hover:border-primary/40'
          )}
        >
          {value.texture === 'custom-photo' && value.customImage ? (
            <>
              <img 
                src={value.customImage} 
                alt="Custom background" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
            </>
          ) : (
            <>
              <Upload className="w-6 h-6 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground text-center px-2">
                Upload Photo
              </span>
            </>
          )}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
};
