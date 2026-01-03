import { frameStyles } from '@/types/businessCard';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FrameSelectorProps {
  value: string;
  frameColor: string;
  onChange: (frame: 'none' | 'solid' | 'double' | 'gradient' | 'ornate' | 'dashed' | 'dotted' | 'inset' | 'shadow' | 'corner') => void;
}

export const FrameSelector = ({ value, frameColor, onChange }: FrameSelectorProps) => {
  const getFramePreviewStyle = (frameType: string): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: '100%',
      height: '100%',
      borderRadius: '2px',
      backgroundColor: '#fefefe',
      position: 'relative',
    };

    switch (frameType) {
      case 'solid':
        return { ...base, border: `2px solid ${frameColor}` };
      case 'double':
        return { ...base, border: `3px double ${frameColor}` };
      case 'gradient':
        return {
          ...base,
          border: '2px solid transparent',
          backgroundImage: `linear-gradient(#fefefe, #fefefe), linear-gradient(135deg, ${frameColor}, #c9a227)`,
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        };
      case 'ornate':
        return { 
          ...base, 
          border: `2px solid ${frameColor}`,
          boxShadow: `inset 0 0 0 2px #fefefe, inset 0 0 0 3px ${frameColor}`,
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
          boxShadow: `3px 3px 0 rgba(0,0,0,0.15)`,
        };
      case 'corner':
        return base;
      default:
        return base;
    }
  };

  const renderCornerPreview = (frameColor: string) => (
    <div className="w-full h-full relative bg-[#fefefe] rounded-sm">
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

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Frame Style</Label>
      <div className="grid grid-cols-5 gap-2">
        {frameStyles.map((frame) => (
          <button
            key={frame.value}
            onClick={() => onChange(frame.value)}
            className={cn(
              'h-10 rounded-lg border-2 transition-all p-1',
              value === frame.value
                ? 'border-primary bg-accent'
                : 'border-border hover:border-muted-foreground/30'
            )}
            title={frame.name}
          >
            {frame.value === 'corner' 
              ? renderCornerPreview(frameColor)
              : <div style={getFramePreviewStyle(frame.value)} />
            }
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-x-2 gap-y-1 text-[10px] text-muted-foreground">
        {frameStyles.map((frame) => (
          <span key={frame.value} className="w-[18%] text-center">{frame.name}</span>
        ))}
      </div>
    </div>
  );
};