import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface BorderRadiusSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export const BorderRadiusSlider = ({ value, onChange }: BorderRadiusSliderProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Corner Radius</Label>
        <span className="text-xs text-muted-foreground font-mono">{value}px</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={0}
        max={40}
        step={1}
        className="py-2"
      />
      <div className="flex justify-between">
        {[0, 8, 16, 24, 32, 40].map((preset) => (
          <button
            key={preset}
            onClick={() => onChange(preset)}
            className={`w-8 h-8 rounded transition-all flex items-center justify-center text-xs font-medium ${
              value === preset
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
            style={{ borderRadius: `${Math.min(preset, 12)}px` }}
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  );
};
