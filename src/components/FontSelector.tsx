import { fontOptions } from '@/types/businessCard';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FontSelectorProps {
  value: string;
  onChange: (font: string) => void;
}

export const FontSelector = ({ value, onChange }: FontSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Font Family</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11">
          <SelectValue placeholder="Select a font" />
        </SelectTrigger>
        <SelectContent>
          {fontOptions.map((font) => (
            <SelectItem
              key={font.value}
              value={font.value}
              style={{ fontFamily: font.value }}
              className="py-2"
            >
              {font.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
