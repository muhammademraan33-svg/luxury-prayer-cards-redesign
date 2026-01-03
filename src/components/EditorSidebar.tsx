import { BusinessCardData, CardCategory, categoryDefaults, createDefaultStyles } from '@/types/businessCard';
import { ColorPicker } from './ColorPicker';
import { FrameSelector } from './FrameSelector';
import { ImageUploader } from './ImageUploader';
import { OrientationToggle } from './OrientationToggle';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Download, RotateCcw, ArrowLeft, ChevronDown, Palette, Frame, Image, Layout } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import eternityLogo from '@/assets/eternity-cards-logo.png';

interface EditorSidebarProps {
  cardData: BusinessCardData;
  onUpdateField: <K extends keyof BusinessCardData>(field: K, value: BusinessCardData[K]) => void;
  onBack: () => void;
  onDownload: () => void;
}

export const EditorSidebar = ({ cardData, onUpdateField, onBack, onDownload }: EditorSidebarProps) => {
  const [openSections, setOpenSections] = useState({
    colors: true,
    frame: false,
    image: false,
    layout: false,
  });

  const handleReset = () => {
    const defaults = categoryDefaults[cardData.category];
    const textColor = defaults.textColor || '#2c2c2c';
    const accentColor = defaults.accentColor || '#b8860b';
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
            <p className="text-xs text-muted-foreground capitalize">{cardData.category} Card</p>
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
                  value={cardData.backgroundColor}
                  onChange={(color) => onUpdateField('backgroundColor', color)}
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
                  value={cardData.frameStyle}
                  frameColor={cardData.frameColor}
                  onChange={(frame) => onUpdateField('frameStyle', frame)}
                />
                {cardData.frameStyle !== 'none' && (
                  <ColorPicker
                    label="Frame Color"
                    value={cardData.frameColor}
                    onChange={(color) => onUpdateField('frameColor', color)}
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
                <span className="font-medium">Logo / Image</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openSections.image ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 pb-3">
              <div className="pt-3">
                <ImageUploader
                  value={cardData.logo}
                  onChange={(logo) => onUpdateField('logo', logo)}
                />
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
          Download Card
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
