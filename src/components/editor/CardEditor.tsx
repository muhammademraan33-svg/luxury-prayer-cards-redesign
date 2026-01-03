import { useState, useCallback } from 'react';
import {
  BusinessCardData,
  CardSideData,
  TextElement,
  categoryInfo,
  BackgroundStyle,
  createDefaultTextElement,
} from '@/types/businessCard';
import { CardElement, createImageElement } from '@/types/cardElements';
import { EditorHeader } from './EditorHeader';
import { EditorSidebar } from './EditorSidebar';
import { EditorCanvas } from './EditorCanvas';
import { PropertiesPanel } from './PropertiesPanel';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Shapes, Type, Sliders } from 'lucide-react';

interface CardEditorProps {
  cardData: BusinessCardData;
  onUpdate: (data: BusinessCardData) => void;
  onBack: () => void;
}

export const CardEditor = ({ cardData, onUpdate, onBack }: CardEditorProps) => {
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
  const [zoom, setZoom] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'text' | 'element' | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [propertiesOpen, setPropertiesOpen] = useState(false);

  const info = categoryInfo[cardData.category];
  const sideData = cardData[activeSide];
  const cardWidth = cardData.orientation === 'landscape' ? 400 : 260;
  const cardHeight = cardData.orientation === 'landscape' ? 260 : 400;

  const updateSide = useCallback(
    (side: 'front' | 'back', updates: Partial<CardSideData>) => {
      onUpdate({
        ...cardData,
        [side]: { ...cardData[side], ...updates },
      });
    },
    [cardData, onUpdate]
  );

  // Text handlers
  const handleTextUpdate = (texts: TextElement[]) => {
    updateSide(activeSide, { texts });
  };

  const handleSingleTextUpdate = (id: string, updates: Partial<TextElement>) => {
    const newTexts = sideData.texts.map((t) => (t.id === id ? { ...t, ...updates } : t));
    updateSide(activeSide, { texts: newTexts });
  };

  const handleTextStyleUpdate = (id: string, styleUpdates: Partial<TextElement['style']>) => {
    const newTexts = sideData.texts.map((t) =>
      t.id === id ? { ...t, style: { ...t.style, ...styleUpdates } } : t
    );
    updateSide(activeSide, { texts: newTexts });
  };

  const handleAddText = () => {
    const newText = createDefaultTextElement(
      `text-${Date.now()}`,
      'New Text',
      18,
      cardHeight / 2,
      info.defaultTextColor,
      info.suggestedFonts[0]
    );
    newText.style.x = cardWidth / 2;
    updateSide(activeSide, { texts: [...sideData.texts, newText] });
    setSelectedId(newText.id);
    setSelectedType('text');
    setSidebarOpen(false);
  };

  const handleTextDelete = (id: string) => {
    if (sideData.texts.length <= 1) {
      toast.error('Card must have at least one text element');
      return;
    }
    updateSide(activeSide, { texts: sideData.texts.filter((t) => t.id !== id) });
    setSelectedId(null);
    setSelectedType(null);
  };

  // Element handlers
  const handleElementsUpdate = (elements: CardElement[]) => {
    updateSide(activeSide, { elements });
  };

  const handleAddElement = (element: CardElement) => {
    const currentElements = sideData.elements || [];
    updateSide(activeSide, { elements: [...currentElements, element] });
    setSelectedId(element.id);
    setSelectedType('element');
    setSidebarOpen(false);
  };

  const handleElementUpdate = (id: string, updates: Partial<CardElement>) => {
    const currentElements = sideData.elements || [];
    updateSide(activeSide, {
      elements: currentElements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      ) as CardElement[],
    });
  };

  const handleElementDelete = (id: string) => {
    const currentElements = sideData.elements || [];
    updateSide(activeSide, { elements: currentElements.filter((el) => el.id !== id) });
    setSelectedId(null);
    setSelectedType(null);
  };

  const handleImageUpload = (src: string) => {
    const element = createImageElement(src, cardWidth / 2, cardHeight / 2);
    handleAddElement(element);
  };

  const handleBackgroundChange = (background: BackgroundStyle) => {
    updateSide(activeSide, { background });
  };

  const handleSelect = (id: string | null, type: 'text' | 'element' | null) => {
    setSelectedId(id);
    setSelectedType(type);
    if (id) {
      setPropertiesOpen(true);
    }
  };

  const handleDuplicate = () => {
    if (selectedType === 'text' && selectedId) {
      const text = sideData.texts.find((t) => t.id === selectedId);
      if (text) {
        const newText: TextElement = {
          ...text,
          id: `text-${Date.now()}`,
          style: { ...text.style, x: text.style.x + 20, y: text.style.y + 20 },
        };
        updateSide(activeSide, { texts: [...sideData.texts, newText] });
        setSelectedId(newText.id);
      }
    } else if (selectedType === 'element' && selectedId) {
      const element = (sideData.elements || []).find((e) => e.id === selectedId);
      if (element) {
        const newElement: CardElement = {
          ...element,
          id: `${element.type}-${Date.now()}`,
          x: element.x + 20,
          y: element.y + 20,
        };
        handleAddElement(newElement);
      }
    }
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.1, 2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.5));

  const handleDownload = () => {
    toast.success('Download started!');
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <EditorHeader
        cardData={cardData}
        activeSide={activeSide}
        onSideChange={setActiveSide}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onDownload={handleDownload}
        onBack={onBack}
      />

      {/* Desktop Layout */}
      <div className="flex-1 hidden md:flex overflow-hidden">
        <EditorSidebar
          category={cardData.category}
          background={sideData.background}
          texts={sideData.texts}
          onAddElement={handleAddElement}
          onAddText={handleAddText}
          onBackgroundChange={handleBackgroundChange}
          onImageUpload={handleImageUpload}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
        />

        <EditorCanvas
          sideData={sideData}
          orientation={cardData.orientation}
          zoom={zoom}
          onTextUpdate={handleTextUpdate}
          onElementsUpdate={handleElementsUpdate}
          selectedId={selectedId}
          onSelect={handleSelect}
        />

        <PropertiesPanel
          selectedId={selectedId}
          selectedType={selectedType}
          texts={sideData.texts}
          elements={sideData.elements || []}
          onTextUpdate={handleSingleTextUpdate}
          onTextStyleUpdate={handleTextStyleUpdate}
          onTextDelete={handleTextDelete}
          onElementUpdate={handleElementUpdate}
          onElementDelete={handleElementDelete}
          onDuplicate={handleDuplicate}
        />
      </div>

      {/* Mobile Layout */}
      <div className="flex-1 flex flex-col md:hidden overflow-hidden">
        <EditorCanvas
          sideData={sideData}
          orientation={cardData.orientation}
          zoom={zoom}
          onTextUpdate={handleTextUpdate}
          onElementsUpdate={handleElementsUpdate}
          selectedId={selectedId}
          onSelect={handleSelect}
        />

        {/* Mobile Bottom Toolbar */}
        <div className="border-t border-border bg-card p-3 flex justify-center gap-4">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button size="lg" variant="outline" className="flex-1 max-w-32 gap-2">
                <Shapes className="w-5 h-5" />
                Add
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[70vh] p-0">
              <EditorSidebar
                category={cardData.category}
                background={sideData.background}
                texts={sideData.texts}
                onAddElement={handleAddElement}
                onAddText={handleAddText}
                onBackgroundChange={handleBackgroundChange}
                onImageUpload={handleImageUpload}
                cardWidth={cardWidth}
                cardHeight={cardHeight}
                isMobile
              />
            </SheetContent>
          </Sheet>

          <Sheet open={propertiesOpen} onOpenChange={setPropertiesOpen}>
            <SheetTrigger asChild>
              <Button 
                size="lg" 
                variant={selectedId ? "default" : "outline"} 
                className="flex-1 max-w-32 gap-2"
                disabled={!selectedId}
              >
                <Sliders className="w-5 h-5" />
                Edit
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[60vh] p-0">
              <PropertiesPanel
                selectedId={selectedId}
                selectedType={selectedType}
                texts={sideData.texts}
                elements={sideData.elements || []}
                onTextUpdate={handleSingleTextUpdate}
                onTextStyleUpdate={handleTextStyleUpdate}
                onTextDelete={handleTextDelete}
                onElementUpdate={handleElementUpdate}
                onElementDelete={handleElementDelete}
                onDuplicate={handleDuplicate}
                isMobile
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};
