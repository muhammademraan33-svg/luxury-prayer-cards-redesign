import { useState, useRef, useCallback } from 'react';
import { BusinessCardData, defaultCardData, categoryDefaults, CardCategory } from '@/types/businessCard';
import { BusinessCardPreview } from './BusinessCardPreview';
import { TextFieldEditor } from './TextFieldEditor';
import { ColorPicker } from './ColorPicker';
import { FontSelector } from './FontSelector';
import { FrameSelector } from './FrameSelector';
import { ImageUploader } from './ImageUploader';
import { BorderRadiusSlider } from './BorderRadiusSlider';
import { CategorySelector } from './CategorySelector';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Download, RotateCcw, Package } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';

export const BusinessCardEditor = () => {
  const [cardData, setCardData] = useState<BusinessCardData>(defaultCardData);
  const cardRef = useRef<HTMLDivElement>(null);

  const updateField = useCallback(
    <K extends keyof BusinessCardData>(field: K, value: BusinessCardData[K]) => {
      setCardData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleCategoryChange = (category: CardCategory) => {
    const defaults = categoryDefaults[category];
    setCardData((prev) => ({
      ...prev,
      ...defaults,
      category,
      logo: prev.logo, // Keep uploaded image
      borderRadius: prev.borderRadius, // Keep border radius
      frameStyle: prev.frameStyle, // Keep frame style
    }));
    toast.success(`Switched to ${category} template`);
  };

  const handleReset = () => {
    const defaults = categoryDefaults[cardData.category];
    setCardData({
      ...defaultCardData,
      ...defaults,
      category: cardData.category,
    } as BusinessCardData);
    toast.success('Card reset to defaults');
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = `${cardData.category}-card-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      toast.success('Card downloaded!');
    } catch (error) {
      toast.error('Failed to download card');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar - Controls */}
      <aside className="w-full lg:w-[420px] lg:min-h-screen border-r border-border bg-card">
        <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <Package className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-display font-semibold">Metal Card Designer</h1>
              <p className="text-sm text-muted-foreground">Premium cards for life's moments</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="px-2 py-1 bg-primary/10 rounded-full font-medium">55 cards per pack</span>
            <span className="px-2 py-1 bg-muted rounded-full">Metal finish</span>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-140px)] lg:h-[calc(100vh-140px)]">
          <div className="p-6 space-y-6">
            <CategorySelector
              value={cardData.category}
              onChange={handleCategoryChange}
            />

            <Separator />

            <TextFieldEditor data={cardData} onChange={updateField} />

            <Separator />

            <ImageUploader
              value={cardData.logo}
              onChange={(logo) => updateField('logo', logo)}
            />

            <Separator />

            <FontSelector
              value={cardData.fontFamily}
              onChange={(font) => updateField('fontFamily', font)}
            />

            <Separator />

            <ColorPicker
              label="Background Color"
              value={cardData.backgroundColor}
              onChange={(color) => updateField('backgroundColor', color)}
            />

            <ColorPicker
              label="Text Color"
              value={cardData.textColor}
              onChange={(color) => updateField('textColor', color)}
            />

            <ColorPicker
              label="Accent Color"
              value={cardData.accentColor}
              onChange={(color) => updateField('accentColor', color)}
            />

            <Separator />

            <BorderRadiusSlider
              value={cardData.borderRadius}
              onChange={(radius) => updateField('borderRadius', radius)}
            />

            <Separator />

            <FrameSelector
              value={cardData.frameStyle}
              frameColor={cardData.frameColor}
              onChange={(frame) => updateField('frameStyle', frame)}
            />

            {cardData.frameStyle !== 'none' && (
              <ColorPicker
                label="Frame Color"
                value={cardData.frameColor}
                onChange={(color) => updateField('frameColor', color)}
              />
            )}

            <Separator />

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex-1"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button
                onClick={handleDownload}
                className="flex-1 bg-gradient-to-r from-primary to-primary/90"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </ScrollArea>
      </aside>

      {/* Main Canvas Area */}
      <main className="flex-1 canvas-area flex flex-col items-center justify-center p-8 min-h-[500px] lg:min-h-screen">
        <div className="animate-scale-in perspective-1000">
          <BusinessCardPreview ref={cardRef} data={cardData} />
        </div>
        <p className="mt-6 text-sm text-muted-foreground text-center max-w-md">
          Premium metal cards with elegant finishes. Perfect for weddings, announcements, and cherished memories.
        </p>
      </main>
    </div>
  );
};
