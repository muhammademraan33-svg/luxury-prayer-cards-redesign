import { frameStyles } from '@/types/businessCard';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FrameSelectorProps {
  value: string;
  frameColor: string;
  onChange: (frame: 'none' | 'solid' | 'double' | 'gradient' | 'ornate') => void;
}

export const FrameSelector = ({ value, frameColor, onChange }: FrameSelectorProps) => {
  const getFramePreviewStyle = (frameType: string) => {
    const base = {
      width: '100%',
      height: '100%',
      borderRadius: '4px',
      backgroundColor: '#fefefe',
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
              'h-12 rounded-lg border-2 transition-all p-1.5',
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
      <div className="flex gap-1 text-[10px] text-muted-foreground">
        {frameStyles.map((frame) => (
          <span key={frame.value} className="flex-1 text-center">{frame.name}</span>
        ))}
      </div>
    </div>
  );
};
