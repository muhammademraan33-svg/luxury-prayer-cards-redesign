import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { fontOptions, colorPresets, TextElementStyle } from '@/types/businessCard';
import { Bold, Italic, Underline, Minus, Plus, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TextToolbarProps {
  style: TextElementStyle;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  onStyleChange: (updates: Partial<TextElementStyle>) => void;
  onBoldChange: (bold: boolean) => void;
  onItalicChange: (italic: boolean) => void;
  onUnderlineChange: (underline: boolean) => void;
  visible: boolean;
  selectedElementName: string | null;
}

export function TextToolbar({
  style,
  isBold,
  isItalic,
  isUnderline,
  onStyleChange,
  onBoldChange,
  onItalicChange,
  onUnderlineChange,
  visible,
  selectedElementName,
}: TextToolbarProps) {
  const currentFont = fontOptions.find(f => f.value === style.fontFamily);

  return (
    <div className={cn(
      "bg-card border border-border rounded-lg shadow-lg p-2 flex items-center gap-2 flex-wrap transition-opacity",
      visible ? "opacity-100" : "opacity-50 pointer-events-none"
    )}>
      {/* Selected Element Label */}
      <div className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded capitalize min-w-[60px] text-center">
        {selectedElementName || 'Select text'}
      </div>

      <div className="w-px h-6 bg-border" />

      {/* Font Selector */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 px-3 text-xs gap-2 min-w-[140px] justify-between">
            <span className="truncate" style={{ fontFamily: style.fontFamily }}>
              {currentFont?.name || 'Select Font'}
            </span>
            <ChevronDown className="w-3 h-3 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2 max-h-[300px] overflow-y-auto" align="start">
          <div className="space-y-1">
            {fontOptions.map((font) => (
              <button
                key={font.value}
                onClick={() => onStyleChange({ fontFamily: font.value })}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent",
                  style.fontFamily === font.value && "bg-accent"
                )}
              >
                <span style={{ fontFamily: font.value }} className="text-base">
                  {font.name}
                </span>
                <span className="block text-xs text-muted-foreground mt-0.5">
                  {font.style}
                </span>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <div className="w-px h-6 bg-border" />

      {/* Size Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onStyleChange({ fontSize: Math.max(8, style.fontSize - 2) })}
        >
          <Minus className="w-3 h-3" />
        </Button>
        <span className="w-8 text-center text-xs font-medium tabular-nums">{style.fontSize}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onStyleChange({ fontSize: Math.min(72, style.fontSize + 2) })}
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>

      <div className="w-px h-6 bg-border" />

      {/* Style Buttons */}
      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-8 w-8 p-0", isBold && "bg-accent")}
          onClick={() => onBoldChange(!isBold)}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-8 w-8 p-0", isItalic && "bg-accent")}
          onClick={() => onItalicChange(!isItalic)}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-8 w-8 p-0", isUnderline && "bg-accent")}
          onClick={() => onUnderlineChange(!isUnderline)}
        >
          <Underline className="w-4 h-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-border" />

      {/* Color Selector */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 px-2 gap-2">
            <div 
              className="w-5 h-5 rounded border border-border"
              style={{ backgroundColor: style.color }}
            />
            <ChevronDown className="w-3 h-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-3" align="end">
          <div className="space-y-3">
            <div className="grid grid-cols-8 gap-1.5">
              {colorPresets.map((color) => (
                <button
                  key={color}
                  onClick={() => onStyleChange({ color })}
                  className={cn(
                    "w-7 h-7 rounded border transition-all hover:scale-110",
                    style.color === color 
                      ? 'ring-2 ring-primary ring-offset-2' 
                      : 'border-border hover:border-foreground/50'
                  )}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <div className="pt-2 border-t">
              <label className="text-xs text-muted-foreground mb-1.5 block">Custom Color</label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={style.color}
                  onChange={(e) => onStyleChange({ color: e.target.value })}
                  className="w-12 h-8 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={style.color}
                  onChange={(e) => onStyleChange({ color: e.target.value })}
                  className="flex-1 h-8 text-xs font-mono"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
