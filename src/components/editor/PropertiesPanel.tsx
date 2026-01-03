import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Trash2,
  Lock,
  Unlock,
  Copy,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
} from 'lucide-react';
import { TextElement, fontOptions, colorPresets } from '@/types/businessCard';
import { CardElement } from '@/types/cardElements';
import { cn } from '@/lib/utils';

interface PropertiesPanelProps {
  selectedId: string | null;
  selectedType: 'text' | 'element' | null;
  texts: TextElement[];
  elements: CardElement[];
  onTextUpdate: (id: string, updates: Partial<TextElement>) => void;
  onTextStyleUpdate: (id: string, styleUpdates: Partial<TextElement['style']>) => void;
  onTextDelete: (id: string) => void;
  onElementUpdate: (id: string, updates: Partial<CardElement>) => void;
  onElementDelete: (id: string) => void;
  onDuplicate: () => void;
}

export const PropertiesPanel = ({
  selectedId,
  selectedType,
  texts,
  elements,
  onTextUpdate,
  onTextStyleUpdate,
  onTextDelete,
  onElementUpdate,
  onElementDelete,
  onDuplicate,
}: PropertiesPanelProps) => {
  const selectedText = selectedType === 'text' ? texts.find((t) => t.id === selectedId) : null;
  const selectedElement = selectedType === 'element' ? elements.find((e) => e.id === selectedId) : null;

  if (!selectedId) {
    return (
      <div className="w-72 border-l border-border bg-card p-6 flex flex-col items-center justify-center text-center shrink-0">
        <div className="text-muted-foreground">
          <p className="font-medium mb-1">No selection</p>
          <p className="text-sm">Click on an element or text to edit its properties</p>
        </div>
      </div>
    );
  }

  const elementColorPresets = [
    '#d4af37', '#c9a227', '#c0c0c0', '#b76e79',
    '#000000', '#ffffff', '#1a1a2e', '#8b0000',
    '#000080', '#006400', '#4b0082', '#ff69b4',
  ];

  return (
    <div className="w-72 border-l border-border bg-card flex flex-col shrink-0">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold">Properties</h2>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDuplicate}>
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => {
              if (selectedType === 'text' && selectedId) {
                onTextDelete(selectedId);
              } else if (selectedType === 'element' && selectedId) {
                onElementDelete(selectedId);
              }
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        {selectedText && (
          <div className="space-y-6">
            {/* Text Content */}
            <div className="space-y-2">
              <Label>Text</Label>
              <Input
                value={selectedText.content}
                onChange={(e) => onTextUpdate(selectedText.id, { content: e.target.value })}
                placeholder="Enter text..."
              />
            </div>

            {/* Font */}
            <div className="space-y-2">
              <Label>Font</Label>
              <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto">
                {fontOptions.map((font) => (
                  <button
                    key={font.value}
                    onClick={() => onTextStyleUpdate(selectedText.id, { fontFamily: font.value })}
                    className={cn(
                      'px-3 py-2 rounded-md border text-left transition-all text-sm',
                      selectedText.style.fontFamily === font.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    )}
                    style={{ fontFamily: font.value }}
                  >
                    {font.name}
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
                onValueChange={([value]) => onTextStyleUpdate(selectedText.id, { fontSize: value })}
                min={8}
                max={72}
                step={1}
              />
            </div>

            {/* Text Color */}
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-1.5">
                {colorPresets.map((color) => (
                  <button
                    key={color}
                    onClick={() => onTextStyleUpdate(selectedText.id, { color })}
                    className={cn(
                      'w-7 h-7 rounded-full border-2 transition-all',
                      selectedText.style.color === color
                        ? 'border-primary scale-110'
                        : 'border-transparent hover:scale-105'
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedElement && (
          <div className="space-y-6">
            {/* Lock toggle */}
            <div className="flex items-center justify-between">
              <Label>Lock element</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onElementUpdate(selectedElement.id, { locked: !selectedElement.locked })}
              >
                {selectedElement.locked ? (
                  <>
                    <Lock className="w-4 h-4 mr-1" /> Locked
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4 mr-1" /> Unlocked
                  </>
                )}
              </Button>
            </div>

            {/* Size */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Size</Label>
                <span className="text-xs text-muted-foreground">{Math.round(selectedElement.width)}px</span>
              </div>
              <Slider
                value={[selectedElement.width]}
                onValueChange={([value]) =>
                  onElementUpdate(selectedElement.id, { width: value, height: value })
                }
                min={20}
                max={200}
                step={1}
              />
            </div>

            {/* Rotation */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Rotation</Label>
                <span className="text-xs text-muted-foreground">{selectedElement.rotation}°</span>
              </div>
              <Slider
                value={[selectedElement.rotation]}
                onValueChange={([value]) => onElementUpdate(selectedElement.id, { rotation: value })}
                min={0}
                max={360}
                step={5}
              />
            </div>

            {/* Opacity */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Opacity</Label>
                <span className="text-xs text-muted-foreground">
                  {Math.round(selectedElement.opacity * 100)}%
                </span>
              </div>
              <Slider
                value={[selectedElement.opacity * 100]}
                onValueChange={([value]) => onElementUpdate(selectedElement.id, { opacity: value / 100 })}
                min={10}
                max={100}
                step={5}
              />
            </div>

            {/* Color for shapes/icons/lines */}
            {(selectedElement.type === 'shape' ||
              selectedElement.type === 'icon' ||
              selectedElement.type === 'line') && (
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-1.5">
                  {elementColorPresets.map((color) => {
                    const currentColor =
                      selectedElement.type === 'shape'
                        ? (selectedElement as any).fill
                        : (selectedElement as any).color;
                    return (
                      <button
                        key={color}
                        onClick={() => {
                          if (selectedElement.type === 'shape') {
                            onElementUpdate(selectedElement.id, { fill: color } as any);
                          } else {
                            onElementUpdate(selectedElement.id, { color } as any);
                          }
                        }}
                        className={cn(
                          'w-7 h-7 rounded-full border-2 transition-all',
                          currentColor === color
                            ? 'border-primary scale-110'
                            : 'border-transparent hover:scale-105'
                        )}
                        style={{ backgroundColor: color }}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
