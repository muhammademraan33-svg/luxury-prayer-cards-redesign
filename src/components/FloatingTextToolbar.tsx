import { forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { fontOptions, colorPresets, TextElementStyle } from '@/types/businessCard';
import { Bold, Italic, Underline, Type, Palette, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingTextToolbarProps {
  style: TextElementStyle;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  position: { x: number; y: number };
  onStyleChange: (updates: Partial<TextElementStyle>) => void;
  onBoldChange: (bold: boolean) => void;
  onItalicChange: (italic: boolean) => void;
  onUnderlineChange: (underline: boolean) => void;
  visible: boolean;
}

export const FloatingTextToolbar = forwardRef<HTMLDivElement, FloatingTextToolbarProps>(({
  style,
  isBold,
  isItalic,
  isUnderline,
  position,
  onStyleChange,
  onBoldChange,
  onItalicChange,
  onUnderlineChange,
  visible,
}, ref) => {
  if (!visible) return null;

  return (
    <div
      ref={ref}
      className="absolute z-50 bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-2xl p-1.5 flex items-center gap-1 animate-in fade-in-0 zoom-in-95"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translateX(-50%)',
        pointerEvents: 'auto',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Font Selector */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs gap-1">
            <Type className="w-4 h-4" />
            <span className="max-w-[60px] truncate hidden sm:inline" style={{ fontFamily: style.fontFamily }}>
              {fontOptions.find(f => f.value === style.fontFamily)?.name.split(' ')[0] || 'Font'}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2" align="start">
          <Select 
            value={style.fontFamily} 
            onValueChange={(font) => onStyleChange({ fontFamily: font })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontOptions.map((font) => (
                <SelectItem key={font.value} value={font.value} className="text-xs">
                  <span style={{ fontFamily: font.value }}>{font.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </PopoverContent>
      </Popover>

      <div className="w-px h-6 bg-border" />

      {/* Size Controls */}
      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onStyleChange({ fontSize: Math.max(8, style.fontSize - 2) })}
        >
          <Minus className="w-3 h-3" />
        </Button>
        <span className="w-8 text-center text-xs font-medium">{style.fontSize}</span>
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

      <div className="w-px h-6 bg-border" />

      {/* Color Selector */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <div 
              className="w-5 h-5 rounded border-2 border-border"
              style={{ backgroundColor: style.color }}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" align="end">
          <div className="grid grid-cols-5 gap-1">
            {colorPresets.map((color) => (
              <button
                key={color}
                onClick={() => onStyleChange({ color })}
                className={cn(
                  "w-7 h-7 rounded border-2 transition-all hover:scale-110",
                  style.color === color ? 'border-primary ring-2 ring-primary/30' : 'border-transparent'
                )}
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
  );
});

FloatingTextToolbar.displayName = 'FloatingTextToolbar';