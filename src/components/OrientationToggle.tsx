import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { RectangleHorizontal, RectangleVertical } from 'lucide-react';

interface OrientationToggleProps {
  value: 'landscape' | 'portrait';
  onChange: (orientation: 'landscape' | 'portrait') => void;
}

export const OrientationToggle = ({ value, onChange }: OrientationToggleProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Orientation</Label>
      <div className="flex gap-2">
        <button
          onClick={() => onChange('landscape')}
          className={cn(
            'flex-1 h-12 rounded-lg border-2 transition-all flex items-center justify-center gap-2',
            value === 'landscape'
              ? 'border-primary bg-accent'
              : 'border-border hover:border-muted-foreground/30'
          )}
        >
          <RectangleHorizontal className="w-5 h-5" />
          <span className="text-sm">Landscape</span>
        </button>
        <button
          onClick={() => onChange('portrait')}
          className={cn(
            'flex-1 h-12 rounded-lg border-2 transition-all flex items-center justify-center gap-2',
            value === 'portrait'
              ? 'border-primary bg-accent'
              : 'border-border hover:border-muted-foreground/30'
          )}
        >
          <RectangleVertical className="w-5 h-5" />
          <span className="text-sm">Portrait</span>
        </button>
      </div>
    </div>
  );
};