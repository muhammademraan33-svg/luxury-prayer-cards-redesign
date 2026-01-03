import { useState, useCallback } from 'react';
import { BusinessCardData, defaultCardData, categoryDefaults, CardCategory, createDefaultStyles, TextElementStyle } from '@/types/businessCard';
import { InteractiveCardCanvas } from './InteractiveCardCanvas';
import { LineEditor } from './LineEditor';
import { ColorPicker } from './ColorPicker';
import { FrameSelector } from './FrameSelector';
import { ImageUploader } from './ImageUploader';
import { OrientationToggle } from './OrientationToggle';
import { CategorySelector } from './CategorySelector';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Download, RotateCcw, Package, Move, Hand } from 'lucide-react';
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

  const updateTextStyle = useCallback((
    field: 'nameStyle' | 'titleStyle' | 'subtitleStyle' | 'line1Style' | 'line2Style' | 'line3Style',
    updates: Partial<TextElementStyle>
  ) => {
    setCardData((prev) => ({
      ...prev,
      [field]: { ...prev[field], ...updates },
    }));
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

  const handleReset = () => {
    const defaults = categoryDefaults[cardData.category];
    const textColor = defaults.textColor || '#2c2c2c';
    const accentColor = defaults.accentColor || '#b8860b';
    
    setCardData({
      ...defaultCardData,
      ...defaults,
      ...createDefaultStyles(textColor, accentColor),
      category: cardData.category,
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

  const getFieldLabel = (field: string) => {
    const labels: Record<CardCategory, Record<string, string>> = {
      wedding: { name: 'Header', title: 'Names', subtitle: 'Subtitle', line1: 'Date', line2: 'Venue', line3: 'Extra' },
      baby: { name: 'Header', title: 'Baby Name', subtitle: 'Birth Date', line1: 'Details', line2: 'Parents', line3: 'Symbol' },
      prayer: { name: 'Header', title: 'Name', subtitle: 'Years', line1: 'Quote', line2: 'Line 2', line3: 'Line 3' },
      memorial: { name: 'Header', title: 'Name', subtitle: 'Years', line1: 'Message', line2: 'Service', line3: 'Location' },
      graduation: { name: 'Class', title: 'Name', subtitle: 'Degree', line1: 'School', line2: 'Date', line3: 'Quote' },
      anniversary: { name: 'Years', title: 'Names', subtitle: 'Subtitle', line1: 'Text', line2: 'Date', line3: 'Venue' },
    };
    return labels[cardData.category]?.[field] || field;
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
          <div className="p-6 space-y-4">
            <CategorySelector
              value={cardData.category}
              onChange={handleCategoryChange}
            />

            <Separator />

            {/* Per-line editors with font/color controls */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Hand className="w-4 h-4" />
                Edit Text (drag on preview to move)
              </h3>
              
              <LineEditor
                label={getFieldLabel('name')}
                value={cardData.name}
                style={cardData.nameStyle}
                onTextChange={(v) => updateField('name', v)}
                onStyleChange={(s) => updateTextStyle('nameStyle', s)}
              />
              <LineEditor
                label={getFieldLabel('title')}
                value={cardData.title}
                style={cardData.titleStyle}
                onTextChange={(v) => updateField('title', v)}
                onStyleChange={(s) => updateTextStyle('titleStyle', s)}
              />
              <LineEditor
                label={getFieldLabel('subtitle')}
                value={cardData.subtitle}
                style={cardData.subtitleStyle}
                onTextChange={(v) => updateField('subtitle', v)}
                onStyleChange={(s) => updateTextStyle('subtitleStyle', s)}
              />
              <LineEditor
                label={getFieldLabel('line1')}
                value={cardData.line1}
                style={cardData.line1Style}
                onTextChange={(v) => updateField('line1', v)}
                onStyleChange={(s) => updateTextStyle('line1Style', s)}
              />
              <LineEditor
                label={getFieldLabel('line2')}
                value={cardData.line2}
                style={cardData.line2Style}
                onTextChange={(v) => updateField('line2', v)}
                onStyleChange={(s) => updateTextStyle('line2Style', s)}
              />
              <LineEditor
                label={getFieldLabel('line3')}
                value={cardData.line3}
                style={cardData.line3Style}
                onTextChange={(v) => updateField('line3', v)}
                onStyleChange={(s) => updateTextStyle('line3Style', s)}
              />
            </div>

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
        <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Move className="w-4 h-4" />
            <span>Drag to move</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 border border-current rounded flex items-center justify-center text-xs">⤡</span>
            <span>Corner handles to resize</span>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground text-center max-w-md">
          Premium metal cards with elegant finishes. Perfect for weddings, announcements, and cherished memories.
        </p>
      </main>
    </div>
  );
};
