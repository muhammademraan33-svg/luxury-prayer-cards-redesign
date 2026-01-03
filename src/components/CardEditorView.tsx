import { useState, useCallback } from 'react';
import { BusinessCardData, categoryDefaults, createDefaultStyles } from '@/types/businessCard';
import { InteractiveCardCanvas } from './InteractiveCardCanvas';
import { EditorSidebar } from './EditorSidebar';
import { Template } from './TemplateCard';
import { toast } from 'sonner';

interface CardEditorViewProps {
  template: Template;
  onBack: () => void;
}

export const CardEditorView = ({ template, onBack }: CardEditorViewProps) => {
  const defaults = categoryDefaults[template.category];
  const initialData: BusinessCardData = {
    ...defaults,
    ...createDefaultStyles(template.textColor, template.accentColor),
    category: template.category,
    backgroundColor: template.backgroundColor,
    textColor: template.textColor,
    accentColor: template.accentColor,
    fontFamily: template.fontFamily,
    frameStyle: template.frameStyle,
    frameColor: template.frameColor,
    logo: null,
    logoScale: 1,
    logoX: 200,
    logoY: 130,
    orientation: 'landscape',
  } as BusinessCardData;

  const [cardData, setCardData] = useState<BusinessCardData>(initialData);

  const updateField = useCallback(
    <K extends keyof BusinessCardData>(field: K, value: BusinessCardData[K]) => {
      setCardData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const updateMultiple = useCallback((updates: Partial<BusinessCardData>) => {
    setCardData((prev) => ({ ...prev, ...updates }));
  }, []);

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
      <EditorSidebar
        cardData={cardData}
        onUpdateField={updateField}
        onBack={onBack}
        onDownload={handleDownload}
      />

      {/* Main Canvas Area */}
      <main className="flex-1 canvas-area flex flex-col items-center justify-center p-8 min-h-[500px] lg:min-h-screen">
        <div className="animate-scale-in">
          <InteractiveCardCanvas
            data={cardData}
            onUpdate={updateMultiple}
            onExport={handleExport}
          />
        </div>
        <div className="mt-6 bg-card/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm border border-border">
          <p className="text-sm text-muted-foreground text-center">
            <span className="font-medium text-foreground">Tip:</span> Click text to select • Double-click to edit • Drag to move
          </p>
        </div>
      </main>
    </div>
  );
};
