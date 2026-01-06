import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Check, Heart, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

// Step components
import BuilderStepWelcome from '@/components/builder/BuilderStepWelcome';
import BuilderStepPhoto from '@/components/builder/BuilderStepPhoto';
import BuilderStepPrayer from '@/components/builder/BuilderStepPrayer';
import BuilderStepFinish from '@/components/builder/BuilderStepFinish';
import BuilderStepPackage from '@/components/builder/BuilderStepPackage';
import BuilderStepPhotos from '@/components/builder/BuilderStepPhotos';
import BuilderStepCheckout from '@/components/builder/BuilderStepCheckout';
import BuilderStepSuccess from '@/components/builder/BuilderStepSuccess';

import BuilderStepProduct from '@/components/builder/BuilderStepProduct';

// Types
export interface CardBuilderState {
  // Person info
  deceasedName: string;
  birthDate: string;
  deathDate: string;
  
  // Product type selection
  productType: 'metal' | 'paper' | 'photos';
  
  // Photo
  photo: string | null;
  photoZoom: number;
  photoPanX: number;
  photoPanY: number;
  
  // Prayer/back text
  selectedPrayerId: string;
  prayerText: string;
  
  // Metal finish
  metalFinish: 'silver' | 'gold' | 'black' | 'white' | 'marble';
  orientation: 'portrait' | 'landscape';
  
  // Package
  selectedPackage: 'good' | 'better' | 'best';
  extraSets: number;
  upgradeThickness: boolean;
  upgradeToOvernight: boolean;
  
  // Celebration photos (upsell)
  celebrationPhotos: string[];
  photoSize: '16x20' | '18x24';
  
  // Shipping
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  
  // QR
  qrUrl: string;
  showQrCode: boolean;
}

const STEPS = [
  { id: 'welcome', title: 'Start', icon: Heart },
  { id: 'product', title: 'Product', icon: Sparkles },
  { id: 'photo', title: 'Photo', icon: Sparkles },
  { id: 'prayer', title: 'Prayer', icon: Sparkles },
  { id: 'finish', title: 'Finish', icon: Sparkles },
  { id: 'package', title: 'Package', icon: Sparkles },
  { id: 'photos', title: 'Photos', icon: Sparkles },
  { id: 'checkout', title: 'Checkout', icon: Check },
];

const initialState: CardBuilderState = {
  deceasedName: '',
  birthDate: '',
  deathDate: '',
  productType: 'metal',
  photo: null,
  photoZoom: 1,
  photoPanX: 0,
  photoPanY: 0,
  selectedPrayerId: 'psalm23',
  prayerText: 'The Lord is my shepherd; I shall not want.',
  metalFinish: 'white',
  orientation: 'portrait',
  selectedPackage: 'better',
  extraSets: 0,
  upgradeThickness: false,
  upgradeToOvernight: false,
  celebrationPhotos: [],
  photoSize: '16x20',
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  shippingStreet: '',
  shippingCity: '',
  shippingState: '',
  shippingZip: '',
  qrUrl: '',
  showQrCode: true,
};

const CardBuilder = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [state, setState] = useState<CardBuilderState>(initialState);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const updateState = (updates: Partial<CardBuilderState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const canGoNext = () => {
    switch (currentStep) {
      case 0: // Welcome
        return state.deceasedName.trim().length > 0;
      case 1: // Product
        return state.productType !== undefined;
      case 2: // Photo
        return state.photo !== null;
      case 3: // Prayer
        return state.prayerText.trim().length > 0;
      case 4: // Finish
        return true;
      case 5: // Package
        return true;
      case 6: // Photos (optional upsell)
        return true;
      case 7: // Checkout
        return state.customerName && state.customerEmail && state.shippingStreet && state.shippingCity && state.shippingState && state.shippingZip;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!canGoNext()) {
      toast.error('Please complete this step before continuing');
      return;
    }
    
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsComplete(true);
    setCurrentStep(STEPS.length); // Move to success
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BuilderStepWelcome state={state} updateState={updateState} />;
      case 1:
        return <BuilderStepProduct state={state} updateState={updateState} />;
      case 2:
        return <BuilderStepPhoto state={state} updateState={updateState} />;
      case 3:
        return <BuilderStepPrayer state={state} updateState={updateState} />;
      case 4:
        return <BuilderStepFinish state={state} updateState={updateState} />;
      case 5:
        return <BuilderStepPackage state={state} updateState={updateState} />;
      case 6:
        return <BuilderStepPhotos state={state} updateState={updateState} />;
      case 7:
        return <BuilderStepCheckout state={state} updateState={updateState} onComplete={handleComplete} />;
      default:
        return <BuilderStepSuccess state={state} />;
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <header className="border-b border-amber-900/30 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <Link to="/" className="text-lg font-bold text-white">
              Metalprayercards.com
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-12 max-w-2xl">
          <BuilderStepSuccess state={state} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-amber-900/30 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-white">
            Metalprayercards.com
          </Link>
          <div className="text-sm text-slate-400">
            {currentStep < STEPS.length ? `Step ${currentStep + 1} of ${STEPS.length}` : 'Complete!'}
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="container mx-auto px-4 pt-6">
        <div className="max-w-2xl mx-auto">
          <Progress value={progress} className="h-2 bg-slate-700" />
          
          {/* Step indicators */}
          <div className="flex justify-between mt-4 overflow-x-auto pb-2">
            {STEPS.map((step, index) => (
              <button
                key={step.id}
                onClick={() => index < currentStep && setCurrentStep(index)}
                disabled={index > currentStep}
                className={`flex flex-col items-center min-w-[60px] transition-all ${
                  index === currentStep
                    ? 'text-amber-400'
                    : index < currentStep
                      ? 'text-green-400 cursor-pointer hover:text-green-300'
                      : 'text-slate-600'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all ${
                  index === currentStep
                    ? 'border-amber-400 bg-amber-400/20'
                    : index < currentStep
                      ? 'border-green-400 bg-green-400/20'
                      : 'border-slate-600'
                }`}>
                  {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <span className="text-xs mt-1 hidden sm:block">{step.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                {renderStep()}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!canGoNext()}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default CardBuilder;
