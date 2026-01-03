import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BusinessCardData, TextElementStyle, fontOptions, colorPresets } from '@/types/businessCard';
import { Type, Palette, ChevronDown } from 'lucide-react';

interface LineEditorProps {
  label: string;
  value: string;
  style: TextElementStyle;
  onTextChange: (value: string) => void;
  onStyleChange: (style: Partial<TextElementStyle>) => void;
}

export const LineEditor = ({ label, value, style, onTextChange, onStyleChange }: LineEditorProps) => {
  return (
    <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border/50">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground">{label}</label>
        <div className="flex items-center gap-1">
          {/* Font Selector */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                <Type className="w-3 h-3 mr-1" />
                <ChevronDown className="w-3 h-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="end">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Font</Label>
                <Select 
                  value={style.fontFamily} 
                  onValueChange={(font) => onStyleChange({ fontFamily: font })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map((font) => (
                      <SelectItem 
                        key={font.value} 
                        value={font.value}
                        className="text-xs"
                      >
                        <span style={{ fontFamily: font.value }}>{font.name}</span>
                        <span className="ml-2 text-muted-foreground">({font.style})</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="pt-2">
                  <Label className="text-xs text-muted-foreground">Size</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="range"
                      min="8"
                      max="36"
                      value={style.fontSize}
                      onChange={(e) => onStyleChange({ fontSize: parseInt(e.target.value) })}
                      className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs w-8 text-right">{style.fontSize}px</span>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Color Selector */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 px-2">
                <div 
                  className="w-4 h-4 rounded border border-border"
                  style={{ backgroundColor: style.color }}
                />
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" align="end">
              <Label className="text-xs text-muted-foreground mb-2 block">Text Color</Label>
              <div className="grid grid-cols-5 gap-1">
                {colorPresets.map((color) => (
                  <button
                    key={color}
                    onClick={() => onStyleChange({ color })}
                    className={`w-7 h-7 rounded border-2 transition-all hover:scale-110 ${
                      style.color === color ? 'border-primary ring-2 ring-primary/30' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="mt-2 pt-2 border-t">
                <Input
                  type="color"
                  value={style.color}
                  onChange={(e) => onStyleChange({ color: e.target.value })}
                  className="w-full h-8 cursor-pointer"
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <Input
        value={value}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder={label}
        className="h-9 text-sm"
        style={{ fontFamily: style.fontFamily }}
      />
    </div>
  );
};
