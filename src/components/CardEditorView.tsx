import { useState, useCallback } from 'react';
import { BusinessCardData, CardSideData, categoryDefaults, createDefaultCardData } from '@/types/businessCard';
import { InteractiveCardCanvas } from './InteractiveCardCanvas';
import { EditorSidebar } from './EditorSidebar';
import { Template } from './TemplateCard';
import { Button } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';
import { toast } from 'sonner';

interface CardEditorViewProps {
  template: Template;
  onBack: () => void;
}

export const CardEditorView = ({ template, onBack }: CardEditorViewProps) => {
  const baseData = createDefaultCardData(template.category);
  
  // Apply template styling to front side
  const initialData: BusinessCardData = {
    ...baseData,
    front: {
      ...baseData.front,
      backgroundColor: template.backgroundColor,
      frameStyle: template.frameStyle,
      frameColor: template.frameColor,
      logo: template.backgroundImage,
    },
    back: {
      ...baseData.back,
      backgroundColor: template.backgroundColor,
      frameStyle: template.frameStyle,
      frameColor: template.frameColor,
    },
    textColor: template.textColor,
    accentColor: template.accentColor,
    fontFamily: template.fontFamily,
  };

  const [cardData, setCardData] = useState<BusinessCardData>(initialData);

  const activeSide = cardData.activeSide;
  const currentSideData = cardData[activeSide];

  const updateField = useCallback(
    <K extends keyof BusinessCardData>(field: K, value: BusinessCardData[K]) => {
      setCardData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const updateSideData = useCallback((updates: Partial<CardSideData>) => {
    setCardData((prev) => ({
      ...prev,
      [prev.activeSide]: {
        ...prev[prev.activeSide],
        ...updates,
      },
    }));
  }, []);

  const toggleSide = () => {
    setCardData((prev) => ({
      ...prev,
      activeSide: prev.activeSide === 'front' ? 'back' : 'front',
    }));
  };

  const handleExport = (canvas: HTMLCanvasElement) => {
    const link = document.createElement('a');
    link.download = `${cardData.category}-card-${activeSide}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast.success(`${activeSide === 'front' ? 'Front' : 'Back'} of card downloaded!`);
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
      <EditorSidebar
        cardData={cardData}
        sideData={currentSideData}
        onUpdateField={updateField}
        onUpdateSide={updateSideData}
        onBack={onBack}
        onDownload={handleDownload}
      />

      {/* Main Canvas Area */}
      <main className="flex-1 canvas-area flex flex-col items-center justify-center p-8 min-h-[500px] lg:min-h-screen">
        {/* Side Toggle */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex bg-card border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => updateField('activeSide', 'front')}
              className={`px-6 py-2 text-sm font-medium transition-colors ${
                activeSide === 'front'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              }`}
            >
              Front
            </button>
            <button
              onClick={() => updateField('activeSide', 'back')}
              className={`px-6 py-2 text-sm font-medium transition-colors ${
                activeSide === 'back'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              }`}
            >
              Back
            </button>
          </div>
          <Button variant="outline" size="icon" onClick={toggleSide} title="Flip Card">
            <RotateCw className="w-4 h-4" />
          </Button>
        </div>

        <div className="animate-scale-in">
          <InteractiveCardCanvas
            sideData={currentSideData}
            orientation={cardData.orientation}
            onUpdate={updateSideData}
            onExport={handleExport}
          />
        </div>
        
        <div className="mt-6 bg-card/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm border border-border">
          <p className="text-sm text-muted-foreground text-center">
            <span className="font-medium text-foreground">Editing:</span> {activeSide === 'front' ? 'Front' : 'Back'} of card • Click text to select • Double-click to edit
          </p>
        </div>
      </main>
    </div>
  );
};
