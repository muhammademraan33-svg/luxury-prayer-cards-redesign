import { useState, useRef, useCallback } from 'react';
import { BusinessCardData, defaultCardData } from '@/types/businessCard';
import { BusinessCardPreview } from './BusinessCardPreview';
import { TextFieldEditor } from './TextFieldEditor';
import { ColorPicker } from './ColorPicker';
import { FontSelector } from './FontSelector';
import { FrameSelector } from './FrameSelector';
import { ImageUploader } from './ImageUploader';
import { BorderRadiusSlider } from './BorderRadiusSlider';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Download, RotateCcw, Sparkles } from 'lucide-react';
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

  const handleReset = () => {
    setCardData(defaultCardData);
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
      link.download = `business-card-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      toast.success('Business card downloaded!');
    } catch (error) {
      toast.error('Failed to download card');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar - Controls */}
      <aside className="w-full lg:w-[400px] lg:min-h-screen border-r border-border bg-card">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Card Designer</h1>
              <p className="text-sm text-muted-foreground">Create your perfect card</p>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-88px)] lg:h-[calc(100vh-88px)]">
          <div className="p-6 space-y-6">
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
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </ScrollArea>
      </aside>

      {/* Main Canvas Area */}
      <main className="flex-1 canvas-area flex items-center justify-center p-8 min-h-[500px] lg:min-h-screen">
        <div className="animate-scale-in">
          <BusinessCardPreview ref={cardRef} data={cardData} />
        </div>
      </main>
    </div>
  );
};
