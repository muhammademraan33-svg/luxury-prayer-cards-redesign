import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Shapes,
  Type,
  Image as ImageIcon,
  Palette,
  Smile,
  LayoutTemplate,
  Minus,
  Square,
  Circle,
  Triangle,
  Star,
  Heart,
  Hexagon,
  Plus,
  Sparkles,
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
import {
  BackgroundTexture,
  BackgroundStyle,
  backgroundTextures,
  CardCategory,
  TextElement,
  categoryInfo,
  fontOptions,
} from '@/types/businessCard';

// Icon component mapper
const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart, Star, Crown, Sparkles, Flower2, Sun, Moon, Cloud,
  Music, Camera, Gift, Cake, Baby, Church, Cross, Bird,
  CircleDot, GraduationCap, Award, Trophy,
};

type SidebarTab = 'elements' | 'text' | 'uploads' | 'background' | 'stickers';

interface EditorSidebarProps {
  category: CardCategory;
  background: BackgroundStyle;
  texts: TextElement[];
  onAddElement: (element: CardElement) => void;
  onAddText: () => void;
  onBackgroundChange: (bg: BackgroundStyle) => void;
  onImageUpload: (src: string) => void;
  cardWidth: number;
  cardHeight: number;
  isMobile?: boolean;
}

export const EditorSidebar = ({
  category,
  background,
  texts,
  onAddElement,
  onAddText,
  onBackgroundChange,
  onImageUpload,
  cardWidth,
  cardHeight,
  isMobile = false,
}: EditorSidebarProps) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('elements');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs: { id: SidebarTab; icon: React.ReactNode; label: string }[] = [
    { id: 'elements', icon: <Shapes className="w-5 h-5" />, label: 'Elements' },
    { id: 'text', icon: <Type className="w-5 h-5" />, label: 'Text' },
    { id: 'stickers', icon: <Smile className="w-5 h-5" />, label: 'Stickers' },
    { id: 'uploads', icon: <ImageIcon className="w-5 h-5" />, label: 'Uploads' },
    { id: 'background', icon: <Palette className="w-5 h-5" />, label: 'Background' },
  ];

  const handleAddShape = (shape: ShapeElement['shape']) => {
    const element = createShapeElement(shape, cardWidth / 2, cardHeight / 2);
    onAddElement(element);
  };

  const handleAddIcon = (icon: string) => {
    const element = createIconElement(icon, cardWidth / 2, cardHeight / 2);
    onAddElement(element);
  };

  const handleAddSticker = (emoji: string) => {
    const element = createStickerElement(emoji, cardWidth / 2, cardHeight / 2);
    onAddElement(element);
  };

  const handleAddLine = () => {
    const element = createLineElement(cardWidth / 2, cardHeight / 2);
    onAddElement(element);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      onImageUpload(src);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const relevantStickers = stickerLibrary.filter(
    (s) => s.category === category || s.category === 'decorative'
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'elements':
        return (
          <div className="space-y-6">
            {/* Shapes */}
            <div>
              <h3 className="text-sm font-medium mb-3">Shapes</h3>
              <div className="grid grid-cols-4 gap-2">
                {shapeLibrary.map((shape) => (
                  <button
                    key={shape.shape}
                    onClick={() => handleAddShape(shape.shape)}
                    className="aspect-square rounded-lg border border-border hover:border-primary hover:bg-accent/50 transition-all flex items-center justify-center text-2xl"
                    title={shape.name}
                  >
                    {shape.preview}
                  </button>
                ))}
              </div>
            </div>

            {/* Lines */}
            <div>
              <h3 className="text-sm font-medium mb-3">Lines & Dividers</h3>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleAddLine}
              >
                <Minus className="w-4 h-4 mr-2" />
                Add Line
              </Button>
            </div>

            {/* Icons */}
            <div>
              <h3 className="text-sm font-medium mb-3">Icons</h3>
              <div className="grid grid-cols-5 gap-2">
                {iconLibrary.map((item) => {
                  const IconComponent = iconComponents[item.icon];
                  return (
                    <button
                      key={item.icon}
                      onClick={() => handleAddIcon(item.icon)}
                      className="aspect-square rounded-lg border border-border hover:border-primary hover:bg-accent/50 transition-all flex items-center justify-center"
                      title={item.name}
                    >
                      {IconComponent && <IconComponent className="w-5 h-5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <Button className="w-full" size="lg" onClick={onAddText}>
              <Plus className="w-4 h-4 mr-2" />
              Add Text
            </Button>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Quick Add</h3>
              <Button variant="outline" className="w-full justify-start text-2xl font-bold" onClick={onAddText}>
                Add a heading
              </Button>
              <Button variant="outline" className="w-full justify-start text-lg" onClick={onAddText}>
                Add a subheading
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm" onClick={onAddText}>
                Add body text
              </Button>
            </div>

            {texts.length > 0 && (
              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-medium mb-3">Text on card ({texts.length})</h3>
                <div className="space-y-2">
                  {texts.map((text) => (
                    <div
                      key={text.id}
                      className="p-2 rounded-lg border border-border text-sm truncate"
                      style={{ fontFamily: text.style.fontFamily }}
                    >
                      {text.content || 'Empty text'}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'stickers':
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Stickers for {categoryInfo[category].name}</h3>
            <div className="grid grid-cols-5 gap-2">
              {relevantStickers.map((sticker, i) => (
                <button
                  key={`${sticker.emoji}-${i}`}
                  onClick={() => handleAddSticker(sticker.emoji)}
                  className="aspect-square rounded-lg border border-border hover:border-primary hover:bg-accent/50 transition-all flex items-center justify-center text-2xl"
                  title={sticker.name}
                >
                  {sticker.emoji}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-border">
              <h3 className="text-sm font-medium mb-3">All Stickers</h3>
              <div className="grid grid-cols-5 gap-2">
                {stickerLibrary.map((sticker, i) => (
                  <button
                    key={`all-${sticker.emoji}-${i}`}
                    onClick={() => handleAddSticker(sticker.emoji)}
                    className="aspect-square rounded-lg border border-border hover:border-primary hover:bg-accent/50 transition-all flex items-center justify-center text-2xl"
                    title={sticker.name}
                  >
                    {sticker.emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'uploads':
        return (
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              className="w-full"
              size="lg"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Upload Image
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Upload photos, logos, or graphics to add to your card
            </p>
          </div>
        );

      case 'background':
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Card Background</h3>
            <div className="grid grid-cols-2 gap-3">
              {backgroundTextures.map((texture) => (
                <button
                  key={texture.value}
                  onClick={() => onBackgroundChange({ texture: texture.value })}
                  className={cn(
                    'aspect-[3/2] rounded-lg border-2 transition-all overflow-hidden',
                    background.texture === texture.value
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <div
                    className="w-full h-full"
                    style={{ background: texture.preview }}
                  />
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-border">
              <h3 className="text-sm font-medium mb-3">Custom Image</h3>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        onBackgroundChange({
                          texture: 'custom-photo',
                          customImage: ev.target?.result as string,
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  };
                  input.click();
                }}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Upload Background
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isMobile) {
    return (
      <div className="flex flex-col h-full bg-card">
        {/* Mobile horizontal tabs */}
        <div className="flex border-b border-border overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 min-w-[70px] py-4 px-2 flex flex-col items-center justify-center gap-1 transition-all',
                activeTab === tab.id
                  ? 'bg-primary/10 text-primary border-b-2 border-primary'
                  : 'text-muted-foreground'
              )}
            >
              {tab.icon}
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
        {/* Tab content */}
        <ScrollArea className="flex-1 p-4">
          {renderTabContent()}
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="w-80 border-r border-border bg-card flex shrink-0">
      {/* Tab icons */}
      <div className="w-16 border-r border-border bg-muted/30 flex flex-col items-center py-2 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'w-12 h-12 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all',
              activeTab === tab.id
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            {tab.icon}
            <span className="text-[9px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h2>
        </div>
        <ScrollArea className="flex-1 p-4">
          {renderTabContent()}
        </ScrollArea>
      </div>
    </div>
  );
};

export { iconComponents };
