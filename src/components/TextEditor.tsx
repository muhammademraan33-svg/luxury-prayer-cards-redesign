import { useEffect, useRef, useState } from 'react';
import {
  BackgroundStyle,
  TextElement,
  fontOptions,
  colorPresets,
  CardCategory,
  categoryInfo,
} from '@/types/businessCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { TextColorPicker } from '@/components/text/TextColorPicker';
import { cn } from '@/lib/utils';
import { Plus, Trash2, Type } from 'lucide-react';

interface TextEditorProps {
  texts: TextElement[];
  onUpdate: (texts: TextElement[]) => void;
  category: CardCategory;
  suggestedFonts: string[];
  background: BackgroundStyle;
}

export const TextEditor = ({
  texts,
  onUpdate,
  category,
  suggestedFonts,
  background,
}: TextEditorProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(texts[0]?.id || null);
  const contentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!texts.length) {
      setSelectedId(null);
      return;
    }

    const stillExists = selectedId ? texts.some((t) => t.id === selectedId) : false;
    if (!stillExists) setSelectedId(texts[0].id);
  }, [texts, selectedId]);

  useEffect(() => {
    // Focus the content input when switching layers (less clunky).
    if (!selectedId) return;
    requestAnimationFrame(() => contentInputRef.current?.focus());
  }, [selectedId]);

  const selectedText = texts.find((t) => t.id === selectedId);

  const updateText = (id: string, updates: Partial<TextElement>) => {
    onUpdate(texts.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const updateStyle = (id: string, styleUpdates: Partial<TextElement['style']>) => {
    onUpdate(
      texts.map((t) =>
        t.id === id ? { ...t, style: { ...t.style, ...styleUpdates } } : t
      )
    );
  };

  const addText = () => {
    const newText: TextElement = {
      id: `text-${Date.now()}`,
      content: 'New Text',
      style: {
        fontFamily: suggestedFonts[0] || 'Playfair Display',
        fontSize: 14,
        color: categoryInfo[category].defaultTextColor,
        x: 200,
        y: 130,
        scaleX: 1,
        scaleY: 1,
      },
    };
    onUpdate([...texts, newText]);
    setSelectedId(newText.id);
  };

  const deleteText = (id: string) => {
    if (texts.length <= 1) return;
    const newTexts = texts.filter((t) => t.id !== id);
    onUpdate(newTexts);
    if (selectedId === id) {
      setSelectedId(newTexts[0]?.id || null);
    }
  };

  // Sort fonts with suggested first
  const sortedFonts = [...fontOptions].sort((a, b) => {
    const aIndex = suggestedFonts.indexOf(a.value);
    const bIndex = suggestedFonts.indexOf(b.value);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium text-foreground mb-1">Edit Your Text</h3>
        <p className="text-sm text-muted-foreground">Select a text layer, then edit it below</p>
      </div>

      {/* Text Layers */}
      <div className="space-y-2">
        {texts.map((text) => {
          const isSelected = selectedId === text.id;
          return (
            <div
              key={text.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedId(text.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setSelectedId(text.id);
              }}
              className={cn(
                'w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between group cursor-pointer',
                isSelected ? 'border-primary bg-accent' : 'border-border hover:border-primary/40'
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Type className="w-4 h-4 text-muted-foreground" />
                <span
                  className="font-medium truncate max-w-[180px]"
                  style={{ fontFamily: text.style.fontFamily }}
                >
                  {text.content || 'Empty'}
                </span>
              </div>

              {texts.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteText(text.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-opacity"
                  aria-label="Delete text layer"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              )}
            </div>
          );
        })}

        <Button variant="outline" className="w-full" onClick={addText}>
          <Plus className="w-4 h-4 mr-2" />
          Add Text Layer
        </Button>
      </div>

      {/* Selected Text Editor */}
      {selectedText && (
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="space-y-2">
            <Label>Text Content</Label>
            <Input
              ref={contentInputRef}
              value={selectedText.content}
              onChange={(e) => updateText(selectedText.id, { content: e.target.value })}
              placeholder="Enter your text..."
            />
          </div>

          {/* Font Selection */}
          <div className="space-y-2">
            <Label>Font Style</Label>
            {suggestedFonts.length > 0 && (
              <p className="text-xs text-muted-foreground mb-2">
                ✨ Suggested for {categoryInfo[category].name}
              </p>
            )}
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {sortedFonts.map((font) => (
                <button
                  key={font.value}
                  type="button"
                  onClick={() => updateStyle(selectedText.id, { fontFamily: font.value })}
                  className={cn(
                    'p-2 rounded-lg border text-left transition-all',
                    selectedText.style.fontFamily === font.value
                      ? 'border-primary bg-accent'
                      : 'border-border hover:border-primary/40',
                    suggestedFonts.includes(font.value) && 'ring-1 ring-primary/20'
                  )}
                >
                  <span className="text-sm block truncate" style={{ fontFamily: font.value }}>
                    {font.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{font.style}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Size</Label>
              <span className="text-xs text-muted-foreground">{selectedText.style.fontSize}px</span>
            </div>
            <Slider
              value={[selectedText.style.fontSize]}
              onValueChange={([value]) => updateStyle(selectedText.id, { fontSize: value })}
              min={8}
              max={48}
              step={1}
            />
          </div>

          {/* Text Color */}
          <TextColorPicker
            value={selectedText.style.color}
            onChange={(color) => updateStyle(selectedText.id, { color })}
            background={background}
            presets={colorPresets}
          />
        </div>
      )}
    </div>
  );
};


