import { useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BackgroundStyle } from "@/types/businessCard";
import {
  contrastRatio,
  filterReadableColors,
  getBackgroundSampleHex,
  pickBestTextColor,
} from "@/lib/color";

interface TextColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  background: BackgroundStyle;
  presets: string[];
}

export const TextColorPicker = ({
  value,
  onChange,
  background,
  presets,
}: TextColorPickerProps) => {
  const backgroundHex = useMemo(() => getBackgroundSampleHex(background), [background]);

  const recommended = useMemo(() => {
    // Keep it simple: show a small set that passes AA contrast.
    const readable = filterReadableColors(backgroundHex, presets, 4.5);
    return readable.slice(0, 12);
  }, [backgroundHex, presets]);

  const isLowContrast = useMemo(() => {
    const ratio = contrastRatio(value, backgroundHex);
    return ratio < 3;
  }, [value, backgroundHex]);

  const handleAuto = () => {
    const auto = pickBestTextColor(backgroundHex, ["#ffffff", "#000000", "#2c2c2c", "#fefefe"]);
    onChange(auto);
  };

  const Swatch = ({ color }: { color: string }) => {
    const ratio = contrastRatio(color, backgroundHex);
    const readable = ratio >= 4.5;
    return (
      <button
        type="button"
        onClick={() => onChange(color)}
        className={cn(
          "w-7 h-7 rounded-md border transition-transform",
          value === color ? "border-primary ring-2 ring-primary/20 scale-110" : "border-border/50 hover:scale-105",
          !readable && "opacity-60"
        )}
        style={{ backgroundColor: color }}
        aria-label={`Set text color ${color}. Contrast ${ratio.toFixed(1)}.`}
        title={`Contrast: ${ratio.toFixed(1)}${readable ? " (good)" : " (low)"}`}
      />
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Color</Label>
        <Button type="button" variant="outline" size="sm" onClick={handleAuto}>
          Auto
        </Button>
      </div>

      {recommended.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground">Recommended for this background</p>
          <div className="flex flex-wrap gap-1.5">
            {recommended.map((color) => (
              <Swatch key={`rec-${color}`} color={color} />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <p className="text-xs text-muted-foreground">All colors</p>
        <div className="flex flex-wrap gap-1.5">
          {presets.slice(0, 20).map((color) => (
            <Swatch key={color} color={color} />
          ))}
        </div>
      </div>

      {isLowContrast && (
        <p className="text-xs text-muted-foreground">
          This color may be hard to read on your current background—try a recommended color or Auto.
        </p>
      )}
    </div>
  );
};
