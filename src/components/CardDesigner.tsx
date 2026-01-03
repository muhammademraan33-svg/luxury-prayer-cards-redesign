import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BusinessCardData, 
  CardSideData, 
  EditorStep, 
  categoryInfo,
  BackgroundStyle,
  FrameStyleType,
  TextElement
} from '@/types/businessCard';
import { CardElement } from '@/types/cardElements';
import { BackgroundSelector } from './BackgroundSelector';
import { FrameStyleSelector } from './FrameStyleSelector';
import { FontSetSelector, FontSet } from './FontSetSelector';
import { CardPreview } from './CardPreview';
import { InteractiveCardPreview } from './InteractiveCardPreview';
import { TextEditor } from './TextEditor';
import { ElementsPanel } from './elements/ElementsPanel';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check, Download, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface CardDesignerProps {
  cardData: BusinessCardData;
  onUpdate: (data: BusinessCardData) => void;
  onBack: () => void;
}

const stepLabels: Record<EditorStep, string> = {
  'celebration': 'Celebration',
  'front-background': 'Front Background',
  'front-fonts': 'Choose Fonts',
  'front-frame': 'Front Frame',
  'front-elements': 'Add Elements',
  'front-text': 'Front Text',
  'back-background': 'Back Background',
  'back-fonts': 'Back Fonts',
  'back-frame': 'Back Frame',
  'back-elements': 'Back Elements',
  'back-text': 'Back Text',
  'review': 'Review & Download',
};

const steps: EditorStep[] = [
  'front-background',
  'front-fonts',
  'front-frame',
  'front-elements',
  'front-text',
  'back-background',
  'back-fonts',
  'back-frame',
  'back-elements',
  'back-text',
  'review',
];

export const CardDesigner = ({ cardData, onUpdate, onBack }: CardDesignerProps) => {
  const [currentStep, setCurrentStep] = useState<EditorStep>('front-background');
  const [selectedFontSet, setSelectedFontSet] = useState<FontSet | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const info = categoryInfo[cardData.category];

  const currentStepIndex = steps.indexOf(currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const currentSide: 'front' | 'back' = currentStep.startsWith('front') || currentStep === 'review' ? 'front' : 'back';
  const sideData = cardData[currentSide];

  const updateSide = useCallback((side: 'front' | 'back', updates: Partial<CardSideData>) => {
    onUpdate({
      ...cardData,
      [side]: { ...cardData[side], ...updates },
    });
  }, [cardData, onUpdate]);

  const handleOrientationChange = (orientation: 'landscape' | 'portrait') => {
    onUpdate({ ...cardData, orientation });
  };

  const handleBackgroundChange = (background: BackgroundStyle) => {
    updateSide(currentSide, { background });
  };

  const handleFrameStyleChange = (frameStyle: FrameStyleType) => {
    updateSide(currentSide, { frameStyle });
  };

  const handleFrameColorChange = (frameColor: string) => {
    updateSide(currentSide, { frameColor });
  };

  const handleTextUpdate = (texts: TextElement[]) => {
    updateSide(currentSide, { texts });
  };

  const handleElementsUpdate = (elements: CardElement[]) => {
    updateSide(currentSide, { elements });
  };

  const handleAddElement = (element: CardElement) => {
    const currentElements = sideData.elements || [];
    updateSide(currentSide, { elements: [...currentElements, element] });
  };

  const handleUpdateElement = (id: string, updates: Partial<CardElement>) => {
    const currentElements = sideData.elements || [];
    updateSide(currentSide, {
      elements: currentElements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      ) as CardElement[],
    });
  };

  const handleDeleteElement = (id: string) => {
    const currentElements = sideData.elements || [];
    updateSide(currentSide, {
      elements: currentElements.filter((el) => el.id !== id),
    });
  };

  const handleFontSetSelect = (fontSet: FontSet) => {
    setSelectedFontSet(fontSet);
    // Apply font set to texts
    const updatedTexts = sideData.texts.map((text, index) => {
      // First text (title) gets main font, others get sub font
      const isTitle = index === 1; // index 1 is usually the main title
      return {
        ...text,
        style: {
          ...text.style,
          fontFamily: isTitle ? fontSet.mainFont : fontSet.subFont,
          color: isTitle ? fontSet.textColor : text.style.color,
        },
      };
    });
    updateSide(currentSide, { 
      texts: updatedTexts,
      frameColor: fontSet.accentColor 
    });
  };

  const goNext = () => {
    if (!isLastStep) {
      setCurrentStep(steps[currentStepIndex + 1]);
    }
  };

  const goPrev = () => {
    if (isFirstStep) {
      onBack();
    } else {
      setCurrentStep(steps[currentStepIndex - 1]);
    }
  };

  const handleDownload = () => {
    toast.success('Card download started!');
    // Export functionality will be implemented in CardPreview
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'front-background':
      case 'back-background':
        return (
          <BackgroundSelector
            value={sideData.background}
            onChange={handleBackgroundChange}
            orientation={cardData.orientation}
            onOrientationChange={handleOrientationChange}
          />
        );
      case 'front-fonts':
      case 'back-fonts':
        return (
          <FontSetSelector
            category={cardData.category}
            background={sideData.background}
            selectedFontSet={selectedFontSet}
            onSelect={handleFontSetSelect}
          />
        );
      case 'front-frame':
      case 'back-frame':
        return (
          <FrameStyleSelector
            frameStyle={sideData.frameStyle}
            frameColor={sideData.frameColor}
            background={sideData.background}
            onFrameStyleChange={handleFrameStyleChange}
            onFrameColorChange={handleFrameColorChange}
            suggestedColors={info.suggestedFrameColors}
          />
        );
      case 'front-elements':
      case 'back-elements':
        return (
          <ElementsPanel
            elements={sideData.elements || []}
            selectedElementId={selectedElementId}
            onAddElement={handleAddElement}
            onUpdateElement={handleUpdateElement}
            onDeleteElement={handleDeleteElement}
            onSelectElement={setSelectedElementId}
            category={cardData.category}
            cardWidth={cardData.orientation === 'landscape' ? 400 : 260}
            cardHeight={cardData.orientation === 'landscape' ? 260 : 400}
          />
        );
      case 'front-text':
      case 'back-text':
        return (
          <TextEditor
            texts={sideData.texts}
            onUpdate={handleTextUpdate}
            category={cardData.category}
            suggestedFonts={info.suggestedFonts}
            background={sideData.background}
          />
        );
      case 'review':
        return (
          <div className="text-center space-y-6">
            <h3 className="text-lg font-medium">Your card is ready!</h3>
            <p className="text-sm text-muted-foreground">
              Review your design below. Click the sides to preview front and back.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={handleDownload} size="lg">
                <Download className="w-4 h-4 mr-2" />
                Download Cards
              </Button>
              <Button variant="outline" onClick={() => setCurrentStep('front-background')}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Start Over
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{info.icon}</span>
              <span className="font-medium">{info.name} Card</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="flex gap-1">
            {steps.map((step, i) => (
              <button
                key={step}
                onClick={() => setCurrentStep(step)}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= currentStepIndex ? 'bg-primary' : 'bg-border'
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Editor Panel */}
        <div className="lg:w-[400px] p-6 border-b lg:border-b-0 lg:border-r border-border bg-card/30">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-1">{stepLabels[currentStep]}</h2>
            <p className="text-sm text-muted-foreground">
              {currentStep.includes('front') ? 'Designing the front of your card' : 
               currentStep.includes('back') ? 'Designing the back of your card' :
               'Final review'}
            </p>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Preview Area */}
        <div className="flex-1 canvas-area flex items-center justify-center p-8">
          {currentStep.endsWith('background') ? (
            <div className="max-w-md text-center space-y-2">
              <h3 className="text-base font-medium text-foreground">Preview appears on the next step</h3>
              <p className="text-sm text-muted-foreground">
                Choose your background finish first, then tap Continue to start editing your text.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentStep === 'review' ? (
                <CardPreview
                  sideData={sideData}
                  orientation={cardData.orientation}
                />
              ) : (
                <InteractiveCardPreview
                  sideData={sideData}
                  orientation={cardData.orientation}
                  onTextUpdate={handleTextUpdate}
                  onElementsUpdate={handleElementsUpdate}
                  selectedElementId={selectedElementId}
                  onSelectElement={setSelectedElementId}
                  editable={true}
                />
              )}
              <p className="text-center text-xs text-muted-foreground">
                {currentSide === 'front' ? 'Front' : 'Back'} Preview
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Navigation Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm sticky bottom-0">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between">
          <Button variant="outline" onClick={goPrev}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isFirstStep ? 'Change Celebration' : 'Back'}
          </Button>
          
          {!isLastStep ? (
            <Button onClick={goNext}>
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleDownload}>
              <Check className="w-4 h-4 mr-2" />
              Finish & Download
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
};
