import { frameStyles, FrameStyleType, BackgroundStyle, backgroundTextures } from '@/types/businessCard';
import { cn } from '@/lib/utils';

interface FrameStyleSelectorProps {
  frameStyle: FrameStyleType;
  frameColor: string;
  background: BackgroundStyle;
  onFrameStyleChange: (style: FrameStyleType) => void;
  onFrameColorChange: (color: string) => void;
  suggestedColors: string[];
}

export const FrameStyleSelector = ({ 
  frameStyle, 
  frameColor, 
  background,
  onFrameStyleChange, 
  onFrameColorChange,
  suggestedColors 
}: FrameStyleSelectorProps) => {
  
  const getBackgroundStyle = (): React.CSSProperties => {
    if (background.texture === 'custom-photo' && background.customImage) {
      return {
        backgroundImage: `url(${background.customImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    const texture = backgroundTextures.find(t => t.value === background.texture);
    return texture ? { background: texture.preview } : { backgroundColor: '#fefefe' };
  };

  const getFramePreviewStyle = (style: FrameStyleType, color: string): React.CSSProperties => {
    switch (style) {
      case 'solid':
        return { border: `3px solid ${color}` };
      case 'double':
        return { border: `4px double ${color}` };
      case 'gradient':
        return {
          border: '3px solid transparent',
          backgroundImage: `linear-gradient(#fff, #fff), linear-gradient(135deg, ${color}, #f5d77a)`,
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        };
      case 'ornate':
        return {
          border: `2px solid ${color}`,
          boxShadow: `inset 0 0 0 3px transparent, inset 0 0 0 5px ${color}`,
        };
      case 'dashed':
        return { border: `3px dashed ${color}` };
      case 'dotted':
        return { border: `3px dotted ${color}` };
      case 'inset':
        return {
          border: `2px solid ${color}`,
          boxShadow: `inset 0 0 0 6px transparent, inset 0 0 0 8px ${color}`,
        };
      case 'shadow':
        return {
          border: `2px solid ${color}`,
          boxShadow: `3px 3px 0 rgba(0,0,0,0.3)`,
        };
      case 'corner':
        return {};
      default:
        return {};
    }
  };

  const renderCornerPreview = (color: string) => (
    <>
      <div className="absolute top-1.5 left-1.5 w-3 h-0.5" style={{ backgroundColor: color }} />
      <div className="absolute top-1.5 left-1.5 w-0.5 h-3" style={{ backgroundColor: color }} />
      <div className="absolute top-1.5 right-1.5 w-3 h-0.5" style={{ backgroundColor: color }} />
      <div className="absolute top-1.5 right-1.5 w-0.5 h-3" style={{ backgroundColor: color }} />
      <div className="absolute bottom-1.5 left-1.5 w-3 h-0.5" style={{ backgroundColor: color }} />
      <div className="absolute bottom-1.5 left-1.5 w-0.5 h-3" style={{ backgroundColor: color }} />
      <div className="absolute bottom-1.5 right-1.5 w-3 h-0.5" style={{ backgroundColor: color }} />
      <div className="absolute bottom-1.5 right-1.5 w-0.5 h-3" style={{ backgroundColor: color }} />
    </>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-foreground">Frame Style</h3>
        <p className="text-xs text-muted-foreground">Choose how the frame masks your background</p>
      </div>

      {/* Frame Color Selection */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground">Frame Color</h4>
        <div className="flex flex-wrap gap-2">
          {suggestedColors.map((color) => (
            <button
              key={color}
              onClick={() => onFrameColorChange(color)}
              className={cn(
                'w-8 h-8 rounded-lg border-2 transition-all',
                frameColor === color
                  ? 'border-foreground scale-110 ring-2 ring-primary/20'
                  : 'border-border hover:scale-105'
              )}
              style={{ backgroundColor: color }}
            />
          ))}
          <input
            type="color"
            value={frameColor}
            onChange={(e) => onFrameColorChange(e.target.value)}
            className="w-8 h-8 rounded-lg cursor-pointer border-2 border-border"
          />
        </div>
      </div>

      {/* Frame Style Grid - Mini card previews with background */}
      <div className="grid grid-cols-3 gap-3">
        {frameStyles.map((style) => (
          <button
            key={style.value}
            onClick={() => onFrameStyleChange(style.value)}
            className={cn(
              'p-1 rounded-lg border-2 transition-all',
              frameStyle === style.value
                ? 'border-primary ring-2 ring-primary/20'
                : 'border-border hover:border-primary/40'
            )}
          >
            {/* Mini card preview showing background + frame */}
            <div 
              className="aspect-[4/3] rounded-md relative overflow-hidden"
              style={{
                ...getBackgroundStyle(),
                ...getFramePreviewStyle(style.value, frameColor),
              }}
            >
              {style.value === 'corner' && renderCornerPreview(frameColor)}
              {/* Metallic shine */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)',
                }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground block text-center mt-1">
              {style.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
