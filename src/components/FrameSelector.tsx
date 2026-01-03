import { frameStyles } from '@/types/businessCard';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FrameSelectorProps {
  value: string;
  frameColor: string;
  onChange: (frame: 'none' | 'solid' | 'double' | 'gradient' | 'shadow') => void;
}

export const FrameSelector = ({ value, frameColor, onChange }: FrameSelectorProps) => {
  const getFramePreviewStyle = (frameType: string) => {
    const base = {
      width: '100%',
      height: '100%',
      borderRadius: '6px',
      backgroundColor: '#f8f9fa',
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
          backgroundImage: `linear-gradient(#f8f9fa, #f8f9fa), linear-gradient(135deg, ${frameColor}, #4ecdc4)`,
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        };
      case 'shadow':
        return { ...base, boxShadow: `0 0 0 2px ${frameColor}` };
      default:
        return base;
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Frame Style</Label>
      <div className="grid grid-cols-5 gap-2">
        {frameStyles.map((frame) => (
          <button
            key={frame.value}
            onClick={() => onChange(frame.value)}
            className={cn(
              'h-12 rounded-lg border-2 transition-all p-1',
              value === frame.value
                ? 'border-primary bg-accent'
                : 'border-border hover:border-muted-foreground/30'
            )}
            title={frame.name}
          >
            <div style={getFramePreviewStyle(frame.value)} />
          </button>
        ))}
      </div>
    </div>
  );
};
