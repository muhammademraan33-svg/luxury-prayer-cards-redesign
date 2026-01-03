import { BusinessCardData, CardSideData, CardCategory, categoryDefaults, createDefaultCardData } from '@/types/businessCard';
import { ColorPicker } from './ColorPicker';
import { FrameSelector } from './FrameSelector';
import { ImageUploader } from './ImageUploader';
import { OrientationToggle } from './OrientationToggle';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Download, RotateCcw, ArrowLeft, ChevronDown, Palette, Frame, Image, Layout, ZoomIn, Sun } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import eternityLogo from '@/assets/eternity-cards-logo.png';

interface EditorSidebarProps {
  cardData: BusinessCardData;
  sideData: CardSideData;
  onUpdateField: <K extends keyof BusinessCardData>(field: K, value: BusinessCardData[K]) => void;
  onUpdateSide: (updates: Partial<CardSideData>) => void;
  onBack: () => void;
  onDownload: () => void;
}

export const EditorSidebar = ({ cardData, sideData, onUpdateField, onUpdateSide, onBack, onDownload }: EditorSidebarProps) => {
  const [openSections, setOpenSections] = useState({
    colors: true,
    frame: false,
    image: false,
    layout: false,
  });

  const handleReset = () => {
    const defaults = createDefaultCardData(cardData.category);
    toast.success('Card reset to defaults');
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <aside className="w-full lg:w-[300px] lg:min-h-screen border-r border-border bg-card flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="mb-3 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Templates
        </Button>
        <div className="flex items-center gap-3">
          <img src={eternityLogo} alt="Eternity Cards" className="h-10 w-10 rounded-lg object-contain" />
          <div>
            <h1 className="font-semibold">Card Editor</h1>
            <p className="text-xs text-muted-foreground capitalize">
              {cardData.category} Card • {cardData.activeSide === 'front' ? 'Front' : 'Back'}
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {/* Colors Section */}
          <Collapsible open={openSections.colors} onOpenChange={() => toggleSection('colors')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                  <Palette className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium">Colors</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openSections.colors ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 pb-3">
              <div className="pt-3 space-y-4">
                <ColorPicker
                  label="Background"
                  value={sideData.backgroundColor}
                  onChange={(color) => onUpdateSide({ backgroundColor: color })}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Frame Section */}
          <Collapsible open={openSections.frame} onOpenChange={() => toggleSection('frame')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                  <Frame className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium">Frame & Border</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openSections.frame ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 pb-3">
              <div className="pt-3 space-y-4">
                <FrameSelector
                  value={sideData.frameStyle}
                  frameColor={sideData.frameColor}
                  onChange={(frame) => onUpdateSide({ frameStyle: frame })}
                />
                {sideData.frameStyle !== 'none' && (
                  <ColorPicker
                    label="Frame Color"
                    value={sideData.frameColor}
                    onChange={(color) => onUpdateSide({ frameColor: color })}
                  />
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Image Section */}
          <Collapsible open={openSections.image} onOpenChange={() => toggleSection('image')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                  <Image className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium">Background Photo</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openSections.image ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 pb-3">
              <div className="pt-3 space-y-5">
                <ImageUploader
                  value={sideData.logo}
                  onChange={(logo) => onUpdateSide({ logo })}
                />
                
                {sideData.logo && (
                  <>
                    {/* Scale slider */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <ZoomIn className="w-4 h-4" />
                          Photo Size
                        </label>
                        <span className="text-xs text-muted-foreground">{Math.round(sideData.logoScale * 100)}%</span>
                      </div>
                      <Slider
                        value={[sideData.logoScale]}
                        onValueChange={([value]) => onUpdateSide({ logoScale: value })}
                        min={0.5}
                        max={2}
                        step={0.05}
                        className="w-full"
                      />
                    </div>
                    
                    {/* Opacity/brightness slider */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Sun className="w-4 h-4" />
                          Photo Brightness
                        </label>
                        <span className="text-xs text-muted-foreground">{Math.round(sideData.logoOpacity * 100)}%</span>
                      </div>
                      <Slider
                        value={[sideData.logoOpacity]}
                        onValueChange={([value]) => onUpdateSide({ logoOpacity: value })}
                        min={0.2}
                        max={1}
                        step={0.05}
                        className="w-full"
                      />
                    </div>
                  </>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Layout Section */}
          <Collapsible open={openSections.layout} onOpenChange={() => toggleSection('layout')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                  <Layout className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium">Orientation</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openSections.layout ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 pb-3">
              <div className="pt-3">
                <OrientationToggle
                  value={cardData.orientation}
                  onChange={(o) => onUpdateField('orientation', o)}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <Button
          onClick={onDownload}
          className="w-full bg-gradient-to-r from-primary to-primary/90"
        >
          <Download className="w-4 h-4 mr-2" />
          Download {cardData.activeSide === 'front' ? 'Front' : 'Back'}
        </Button>
        <Button
          variant="outline"
          onClick={handleReset}
          className="w-full"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset to Default
        </Button>
      </div>
    </aside>
  );
};
