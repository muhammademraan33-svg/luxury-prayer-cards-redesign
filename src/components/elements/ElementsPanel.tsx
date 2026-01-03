import { useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  CardElement,
  ShapeElement,
  shapeLibrary,
  iconLibrary,
  stickerLibrary,
  createShapeElement,
  createIconElement,
  createStickerElement,
  createLineElement,
  createImageElement,
} from '@/types/cardElements';
import { CardCategory } from '@/types/businessCard';
import {
  Shapes,
  Smile,
  ImageIcon,
  Minus,
  Sparkles,
  Trash2,
  RotateCw,
  Lock,
  Unlock,
  Heart,
  Star,
  Crown,
  Flower2,
  Sun,
  Moon,
  Cloud,
  Music,
  Camera,
  Gift,
  Cake,
  Baby,
  Church,
  Cross,
  Bird,
  CircleDot,
  GraduationCap,
  Award,
  Trophy,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Icon component mapper
const iconComponents: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Heart,
  Star,
  Crown,
  Sparkles,
  Flower2,
  Sun,
  Moon,
  Cloud,
  Music,
  Camera,
  Gift,
  Cake,
  Baby,
  Church,
  Cross,
  Bird,
  CircleDot,
  GraduationCap,
  Award,
  Trophy,
};

interface ElementsPanelProps {
  elements: CardElement[];
  selectedElementId: string | null;
  onAddElement: (element: CardElement) => void;
  onUpdateElement: (id: string, updates: Partial<CardElement>) => void;
  onDeleteElement: (id: string) => void;
  onSelectElement: (id: string | null) => void;
  category: CardCategory;
  cardWidth: number;
  cardHeight: number;
}

export const ElementsPanel = ({
  elements,
  selectedElementId,
  onAddElement,
  onUpdateElement,
  onDeleteElement,
  onSelectElement,
  category,
  cardWidth,
  cardHeight,
}: ElementsPanelProps) => {
  const [activeTab, setActiveTab] = useState('shapes');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedElement = elements.find((e) => e.id === selectedElementId);

  // Get relevant stickers for category
  const relevantStickers = stickerLibrary.filter(
    (s) => s.category === category || s.category === 'decorative'
  );

  const handleAddShape = (shape: ShapeElement['shape']) => {
    const element = createShapeElement(shape, cardWidth / 2, cardHeight / 2);
    onAddElement(element);
    onSelectElement(element.id);
  };

  const handleAddIcon = (icon: string) => {
    const element = createIconElement(icon, cardWidth / 2, cardHeight / 2);
    onAddElement(element);
    onSelectElement(element.id);
  };

  const handleAddSticker = (emoji: string) => {
    const element = createStickerElement(emoji, cardWidth / 2, cardHeight / 2);
    onAddElement(element);
    onSelectElement(element.id);
  };

  const handleAddLine = () => {
    const element = createLineElement(cardWidth / 2, cardHeight / 2);
    onAddElement(element);
    onSelectElement(element.id);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const element = createImageElement(src, cardWidth / 2, cardHeight / 2);
      onAddElement(element);
      onSelectElement(element.id);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const colorPresets = [
    '#d4af37', '#c9a227', '#c0c0c0', '#b76e79',
    '#000000', '#ffffff', '#1a1a2e', '#8b0000',
    '#000080', '#006400', '#4b0082', '#ff69b4',
  ];

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="shapes" className="text-xs px-1">
            <Shapes className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="icons" className="text-xs px-1">
            <Sparkles className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="stickers" className="text-xs px-1">
            <Smile className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="lines" className="text-xs px-1">
            <Minus className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="images" className="text-xs px-1">
            <ImageIcon className="w-4 h-4" />
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[200px] mt-3">
          <TabsContent value="shapes" className="mt-0">
            <div className="grid grid-cols-4 gap-2">
              {shapeLibrary.map((shape) => (
                <button
                  key={shape.shape}
                  onClick={() => handleAddShape(shape.shape)}
                  className="aspect-square rounded-lg border border-border hover:border-primary hover:bg-accent transition-colors flex items-center justify-center text-2xl"
                  title={shape.name}
                >
                  {shape.preview}
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="icons" className="mt-0">
            <div className="grid grid-cols-5 gap-2">
              {iconLibrary.map((item) => {
                const IconComponent = iconComponents[item.icon];
                return (
                  <button
                    key={item.icon}
                    onClick={() => handleAddIcon(item.icon)}
                    className="aspect-square rounded-lg border border-border hover:border-primary hover:bg-accent transition-colors flex items-center justify-center"
                    title={item.name}
                  >
                    {IconComponent && <IconComponent className="w-5 h-5" />}
                  </button>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="stickers" className="mt-0">
            <div className="grid grid-cols-5 gap-2">
              {relevantStickers.map((sticker, i) => (
                <button
                  key={`${sticker.emoji}-${i}`}
                  onClick={() => handleAddSticker(sticker.emoji)}
                  className="aspect-square rounded-lg border border-border hover:border-primary hover:bg-accent transition-colors flex items-center justify-center text-2xl"
                  title={sticker.name}
                >
                  {sticker.emoji}
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="lines" className="mt-0">
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleAddLine}
              >
                <Minus className="w-4 h-4 mr-2" />
                Add Divider Line
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Add decorative lines & dividers
              </p>
            </div>
          </TabsContent>

          <TabsContent value="images" className="mt-0">
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Add photos, logos, or graphics
              </p>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>

      {/* Selected Element Editor */}
      {selectedElement && (
        <div className="border-t border-border pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Edit Element</Label>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() =>
                  onUpdateElement(selectedElement.id, { locked: !selectedElement.locked })
                }
              >
                {selectedElement.locked ? (
                  <Lock className="w-3.5 h-3.5" />
                ) : (
                  <Unlock className="w-3.5 h-3.5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={() => {
                  onDeleteElement(selectedElement.id);
                  onSelectElement(null);
                }}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Size */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Size</span>
              <span className="text-muted-foreground">{Math.round(selectedElement.width)}px</span>
            </div>
            <Slider
              value={[selectedElement.width]}
              onValueChange={([value]) =>
                onUpdateElement(selectedElement.id, { width: value, height: value })
              }
              min={20}
              max={150}
              step={1}
            />
          </div>

          {/* Rotation */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Rotation</span>
              <span className="text-muted-foreground">{selectedElement.rotation}°</span>
            </div>
            <Slider
              value={[selectedElement.rotation]}
              onValueChange={([value]) =>
                onUpdateElement(selectedElement.id, { rotation: value })
              }
              min={0}
              max={360}
              step={5}
            />
          </div>

          {/* Opacity */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Opacity</span>
              <span className="text-muted-foreground">{Math.round(selectedElement.opacity * 100)}%</span>
            </div>
            <Slider
              value={[selectedElement.opacity * 100]}
              onValueChange={([value]) =>
                onUpdateElement(selectedElement.id, { opacity: value / 100 })
              }
              min={10}
              max={100}
              step={5}
            />
          </div>

          {/* Color picker for shapes/icons/lines */}
          {(selectedElement.type === 'shape' ||
            selectedElement.type === 'icon' ||
            selectedElement.type === 'line') && (
            <div className="space-y-2">
              <Label className="text-xs">Color</Label>
              <div className="flex flex-wrap gap-1.5">
                {colorPresets.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      if (selectedElement.type === 'shape') {
                        onUpdateElement(selectedElement.id, { fill: color } as Partial<CardElement>);
                      } else {
                        onUpdateElement(selectedElement.id, { color } as Partial<CardElement>);
                      }
                    }}
                    className={cn(
                      'w-6 h-6 rounded-full border-2 transition-all',
                      ((selectedElement.type === 'shape' && (selectedElement as any).fill === color) ||
                        (selectedElement.type !== 'shape' && (selectedElement as any).color === color))
                        ? 'border-primary scale-110'
                        : 'border-transparent hover:scale-105'
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Elements List */}
      {elements.length > 0 && (
        <div className="border-t border-border pt-4">
          <Label className="text-xs text-muted-foreground mb-2 block">
            Layers ({elements.length})
          </Label>
          <ScrollArea className="h-[100px]">
            <div className="space-y-1">
              {[...elements].reverse().map((el) => (
                <button
                  key={el.id}
                  onClick={() => onSelectElement(el.id)}
                  className={cn(
                    'w-full text-left px-2 py-1.5 rounded text-xs flex items-center gap-2 transition-colors',
                    selectedElementId === el.id
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-accent'
                  )}
                >
                  {el.type === 'shape' && <Shapes className="w-3 h-3" />}
                  {el.type === 'icon' && <Sparkles className="w-3 h-3" />}
                  {el.type === 'sticker' && <span className="text-sm">{(el as any).emoji}</span>}
                  {el.type === 'line' && <Minus className="w-3 h-3" />}
                  {el.type === 'image' && <ImageIcon className="w-3 h-3" />}
                  <span className="truncate flex-1 capitalize">{el.type}</span>
                  {el.locked && <Lock className="w-3 h-3 text-muted-foreground" />}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export { iconComponents };
