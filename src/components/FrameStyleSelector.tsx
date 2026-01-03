import { frameStyles, FrameStyleType, colorPresets } from '@/types/businessCard';
import { cn } from '@/lib/utils';

interface FrameStyleSelectorProps {
  frameStyle: FrameStyleType;
  frameColor: string;
  onFrameStyleChange: (style: FrameStyleType) => void;
  onFrameColorChange: (color: string) => void;
  suggestedColors?: string[];
}

export const FrameStyleSelector = ({ 
  frameStyle, 
  frameColor, 
  onFrameStyleChange, 
  onFrameColorChange,
  suggestedColors = []
}: FrameStyleSelectorProps) => {
  
  const getFramePreviewStyle = (type: FrameStyleType): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: '100%',
      height: '100%',
      borderRadius: '3px',
      backgroundColor: '#fefefe',
      position: 'relative',
    };

    switch (type) {
      case 'solid':
        return { ...base, border: `2px solid ${frameColor}` };
      case 'double':
        return { ...base, border: `3px double ${frameColor}` };
      case 'gradient':
        return {
          ...base,
          border: '2px solid transparent',
          backgroundImage: `linear-gradient(#fefefe, #fefefe), linear-gradient(135deg, ${frameColor}, #f5d77a)`,
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        };
      case 'ornate':
        return { 
          ...base, 
          border: `2px solid ${frameColor}`,
          boxShadow: `inset 0 0 0 2px #fefefe, inset 0 0 0 4px ${frameColor}`,
        };
      case 'dashed':
        return { ...base, border: `2px dashed ${frameColor}` };
      case 'dotted':
        return { ...base, border: `2px dotted ${frameColor}` };
      case 'inset':
        return { 
          ...base, 
          border: `1px solid ${frameColor}`,
          boxShadow: `inset 0 0 0 3px #fefefe, inset 0 0 0 5px ${frameColor}`,
        };
      case 'shadow':
        return { 
          ...base, 
          border: `2px solid ${frameColor}`,
          boxShadow: `3px 3px 0 rgba(0,0,0,0.2)`,
        };
      case 'corner':
        return base;
      default:
        return base;
    }
  };

  const renderCornerPreview = () => (
    <div className="w-full h-full relative bg-[#fefefe] rounded">
      <div className="absolute top-0 left-0 w-2 h-0.5" style={{ backgroundColor: frameColor }} />
      <div className="absolute top-0 left-0 w-0.5 h-2" style={{ backgroundColor: frameColor }} />
      <div className="absolute top-0 right-0 w-2 h-0.5" style={{ backgroundColor: frameColor }} />
      <div className="absolute top-0 right-0 w-0.5 h-2" style={{ backgroundColor: frameColor }} />
      <div className="absolute bottom-0 left-0 w-2 h-0.5" style={{ backgroundColor: frameColor }} />
      <div className="absolute bottom-0 left-0 w-0.5 h-2" style={{ backgroundColor: frameColor }} />
      <div className="absolute bottom-0 right-0 w-2 h-0.5" style={{ backgroundColor: frameColor }} />
      <div className="absolute bottom-0 right-0 w-0.5 h-2" style={{ backgroundColor: frameColor }} />
    </div>
  );

  // Combine suggested colors first, then other presets
  const allColors = [...new Set([...suggestedColors, ...colorPresets])];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-foreground mb-1">Select Frame Style</h3>
        <p className="text-sm text-muted-foreground">Add an elegant border to your card</p>
      </div>

      {/* Frame Styles */}
      <div className="grid grid-cols-5 gap-2">
        {frameStyles.map((frame) => (
          <button
            key={frame.value}
            onClick={() => onFrameStyleChange(frame.value)}
            className={cn(
              'aspect-[3/2] rounded-lg border-2 transition-all p-2',
              frameStyle === frame.value
                ? 'border-primary bg-accent scale-105'
                : 'border-border hover:border-primary/40'
            )}
            title={frame.name}
          >
            {frame.value === 'corner' 
              ? renderCornerPreview()
              : <div style={getFramePreviewStyle(frame.value)} />
            }
          </button>
        ))}
      </div>
      
      <div className="flex flex-wrap justify-center gap-1 text-[10px] text-muted-foreground">
        {frameStyles.map((frame) => (
          <span key={frame.value} className="w-[18%] text-center">{frame.name}</span>
        ))}
      </div>

      {/* Frame Color */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground text-center">Frame Color</h4>
        
        {suggestedColors.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground mb-2 text-center">Suggested for this celebration</p>
            <div className="flex justify-center gap-2">
              {suggestedColors.map((color) => (
                <button
                  key={color}
                  onClick={() => onFrameColorChange(color)}
                  className={cn(
                    'w-10 h-10 rounded-lg border-2 transition-all shadow-sm',
                    frameColor === color
                      ? 'border-primary ring-2 ring-primary/20 scale-110'
                      : 'border-border hover:scale-105'
                  )}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-1.5">
          {allColors.slice(0, 20).map((color) => (
            <button
              key={color}
              onClick={() => onFrameColorChange(color)}
              className={cn(
                'w-7 h-7 rounded-md border transition-all',
                frameColor === color
                  ? 'border-primary ring-2 ring-primary/20 scale-110'
                  : 'border-border/50 hover:scale-105'
              )}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
