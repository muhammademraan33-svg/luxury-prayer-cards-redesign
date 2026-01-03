import { useState, useCallback } from 'react';
import { BusinessCardData, defaultCardData, categoryDefaults, CardCategory, createDefaultStyles, TextElementStyle } from '@/types/businessCard';
import { InteractiveCardCanvas } from './InteractiveCardCanvas';
import { ColorPicker } from './ColorPicker';
import { FrameSelector } from './FrameSelector';
import { ImageUploader } from './ImageUploader';
import { OrientationToggle } from './OrientationToggle';
import { CategorySelector } from './CategorySelector';
import { TemplateGallery, Template } from './TemplateGallery';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Download, RotateCcw, Package } from 'lucide-react';
import { toast } from 'sonner';

export const BusinessCardEditor = () => {
  const [cardData, setCardData] = useState<BusinessCardData>(defaultCardData);

  const updateField = useCallback(
    <K extends keyof BusinessCardData>(field: K, value: BusinessCardData[K]) => {
      setCardData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const updateMultiple = useCallback((updates: Partial<BusinessCardData>) => {
    setCardData((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleCategoryChange = (category: CardCategory) => {
    const defaults = categoryDefaults[category];
    const textColor = defaults.textColor || '#2c2c2c';
    const accentColor = defaults.accentColor || '#b8860b';
    
    setCardData((prev) => ({
      ...prev,
      ...defaults,
      ...createDefaultStyles(textColor, accentColor),
      category,
      logo: prev.logo,
      logoScale: prev.logoScale,
      logoX: prev.logoX,
      logoY: prev.logoY,
      frameStyle: prev.frameStyle,
      orientation: prev.orientation,
    }));
    toast.success(`Switched to ${category} template`);
  };

  const handleTemplateSelect = (template: Template) => {
    const defaults = categoryDefaults[template.category];
    setCardData((prev) => ({
      ...prev,
      ...defaults,
      ...createDefaultStyles(template.textColor, template.accentColor),
      category: template.category,
      backgroundColor: template.backgroundColor,
      textColor: template.textColor,
      accentColor: template.accentColor,
      fontFamily: template.fontFamily,
      frameStyle: template.frameStyle,
      frameColor: template.frameColor,
      logo: prev.logo,
      logoScale: prev.logoScale,
      logoX: prev.logoX,
      logoY: prev.logoY,
      orientation: prev.orientation,
    }));
    toast.success(`Applied "${template.name}" template`);
  };

  const handleReset = () => {
    const defaults = categoryDefaults[cardData.category];
    const textColor = defaults.textColor || '#2c2c2c';
    const accentColor = defaults.accentColor || '#b8860b';
    
    setCardData({
      ...defaultCardData,
      ...defaults,
      ...createDefaultStyles(textColor, accentColor),
      category: cardData.category,
      orientation: cardData.orientation,
    } as BusinessCardData);
    toast.success('Card reset to defaults');
  };

  const handleExport = (canvas: HTMLCanvasElement) => {
    const link = document.createElement('a');
    link.download = `${cardData.category}-card-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast.success('Card downloaded!');
  };

  const handleDownload = () => {
    const exportFn = (window as any).__exportCardCanvas;
    if (exportFn) {
      exportFn();
    } else {
      toast.error('Unable to export');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar - Controls */}
      <aside className="w-full lg:w-[320px] lg:min-h-screen border-r border-border bg-card">
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
        </div>

        <ScrollArea className="h-[calc(100vh-120px)] lg:h-[calc(100vh-120px)]">
          <div className="p-5 space-y-4">
            <TemplateGallery
              currentCategory={cardData.category}
              onSelectTemplate={handleTemplateSelect}
            />

            <Separator />

            <CategorySelector
              value={cardData.category}
              onChange={handleCategoryChange}
            />

            <Separator />

            <ImageUploader
              value={cardData.logo}
              onChange={(logo) => updateField('logo', logo)}
            />

            <Separator />

            <OrientationToggle
              value={cardData.orientation}
              onChange={(o) => updateField('orientation', o)}
            />

            <Separator />

            <ColorPicker
              label="Background Color"
              value={cardData.backgroundColor}
              onChange={(color) => updateField('backgroundColor', color)}
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
        <div className="animate-scale-in">
          <InteractiveCardCanvas
            data={cardData}
            onUpdate={updateMultiple}
            onExport={handleExport}
          />
        </div>
        <p className="mt-6 text-sm text-muted-foreground text-center max-w-md">
          Click text to select • Double-click to edit inline • Use toolbar to style
        </p>
      </main>
    </div>
  );
};