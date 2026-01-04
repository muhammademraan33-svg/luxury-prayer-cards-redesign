import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, QrCode, Loader2, Truck, Zap, ArrowLeft, ArrowRight, ImageIcon, RotateCcw, RectangleHorizontal, RectangleVertical, Type, Book, Trash2, Package, Clock } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Textarea } from '@/components/ui/textarea';
import { prayerTemplates } from '@/data/prayerTemplates';
import { toast } from 'sonner';
import eternityLogo from '@/assets/eternity-cards-logo.png';

const FONT_OPTIONS = [
  { value: 'Playfair Display', name: 'Playfair Display' },
  { value: 'Cormorant Garamond', name: 'Cormorant Garamond' },
  { value: 'Great Vibes', name: 'Great Vibes' },
  { value: 'Dancing Script', name: 'Dancing Script' },
  { value: 'Allura', name: 'Allura' },
  { value: 'Sacramento', name: 'Sacramento' },
  { value: 'Montserrat', name: 'Montserrat' },
];

type MetalFinish = 'silver' | 'gold' | 'black' | 'white' | 'marble';
type Orientation = 'landscape' | 'portrait';
type CardSide = 'front' | 'back';
type ShippingType = 'express' | 'overnight';

const METAL_FINISHES: { id: MetalFinish; name: string; gradient: string }[] = [
  { id: 'silver', name: 'Brushed Silver', gradient: 'from-zinc-400 via-zinc-300 to-zinc-500' },
  { id: 'gold', name: 'Polished Gold', gradient: 'from-yellow-600 via-yellow-500 to-yellow-700' },
  { id: 'black', name: 'Matte Black', gradient: 'from-zinc-800 via-zinc-700 to-zinc-900' },
  { id: 'white', name: 'Pearl White', gradient: 'from-gray-100 via-white to-gray-200' },
  { id: 'marble', name: 'Silver Marble', gradient: 'from-gray-300 via-slate-100 to-gray-400' },
];

// Pricing constants
const EXPRESS_PACK_PRICE = 127; // 55 cards + 2 easel photos
const ADDITIONAL_SET_PRICE = 110; // Additional 55 cards
const ADDITIONAL_PHOTO_PRICE = 27; // Additional easel photo

const Design = () => {
  const [step, setStep] = useState(1);
  
  // Form state
  const [deceasedName, setDeceasedName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [deathDate, setDeathDate] = useState('');
  const [metalFinish, setMetalFinish] = useState<MetalFinish>('silver');
  const [shipping, setShipping] = useState<ShippingType>('express');
  const [additionalSets, setAdditionalSets] = useState(0);
  const [additionalPhotos, setAdditionalPhotos] = useState(0);
  const [qrUrl, setQrUrl] = useState('');
  const [showQrCode, setShowQrCode] = useState(true);
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [cardSide, setCardSide] = useState<CardSide>('front');
  const [deceasedPhoto, setDeceasedPhoto] = useState<string | null>(null);
  const [photoZoom, setPhotoZoom] = useState(1);
  const [photoPanX, setPhotoPanX] = useState(0);
  const [photoPanY, setPhotoPanY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [backBgImage, setBackBgImage] = useState<string | null>(null);
  const [backText, setBackText] = useState('The Lord is my shepherd; I shall not want.');
  const [prayerTextSize, setPrayerTextSize] = useState<number | 'auto'>('auto');
  
  // Front card text state
  const [showNameOnFront, setShowNameOnFront] = useState(true);
  const [showDatesOnFront, setShowDatesOnFront] = useState(true);
  const [showDatesOnBack, setShowDatesOnBack] = useState(true);
  const [nameFont, setNameFont] = useState('Playfair Display');
  const [datesFont, setDatesFont] = useState('Cormorant Garamond');
  const [namePosition, setNamePosition] = useState({ x: 50, y: 85 });
  const [datesPosition, setDatesPosition] = useState({ x: 50, y: 92 });
  const [nameColor, setNameColor] = useState('#ffffff');
  const [frontDatesColor, setFrontDatesColor] = useState('#ffffffcc');
  const [backDatesColor, setBackDatesColor] = useState('#666666');
  const [nameSize, setNameSize] = useState(18);
  const [frontDatesSize, setFrontDatesSize] = useState<number | 'auto'>('auto');
  const [backDatesSize, setBackDatesSize] = useState<number | 'auto'>('auto');
  const [frontDateFormat, setFrontDateFormat] = useState<'full' | 'short-month' | 'mmm-dd-yyyy' | 'numeric' | 'year'>('full');
  const [backDateFormat, setBackDateFormat] = useState<'full' | 'short-month' | 'mmm-dd-yyyy' | 'numeric' | 'year'>('full');
  const [additionalText, setAdditionalText] = useState('');
  const [additionalTextPosition, setAdditionalTextPosition] = useState({ x: 50, y: 70 });
  const [additionalTextColor, setAdditionalTextColor] = useState('#ffffff');
  const [additionalTextSize, setAdditionalTextSize] = useState(10);
  const [additionalTextFont, setAdditionalTextFont] = useState('Cormorant Garamond');
  const [showAdditionalText, setShowAdditionalText] = useState(false);
  const [selectedPrayerId, setSelectedPrayerId] = useState<string>('custom');
  const [draggingText, setDraggingText] = useState<'name' | 'dates' | 'additional' | null>(null);
  const [resizingText, setResizingText] = useState<'name' | 'dates' | 'additional' | null>(null);
  
  const textDragStartRef = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);
  const textPinchStartRef = useRef<{ distance: number; size: number } | null>(null);
  const textPointerCacheRef = useRef<Map<number, PointerEvent>>(new Map());
  const photoInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const photoContainerRef = useRef<HTMLDivElement>(null);
  const cardPreviewRef = useRef<HTMLDivElement>(null);
  const panStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const pinchStartRef = useRef<{ distance: number; scale: number } | null>(null);
  const pointerCacheRef = useRef<Map<number, PointerEvent>>(new Map());

  // Text drag handlers
  const handleTextPointerDown = (e: React.PointerEvent, textType: 'name' | 'dates' | 'additional') => {
    e.stopPropagation();
    e.preventDefault();

    textPointerCacheRef.current.set(e.pointerId, e.nativeEvent);
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Pointer capture may not be supported
    }

    if (textPointerCacheRef.current.size === 1) {
      setDraggingText(textType);
      const currentPos =
        textType === 'name' ? namePosition : textType === 'dates' ? datesPosition : additionalTextPosition;
      textDragStartRef.current = { x: e.clientX, y: e.clientY, posX: currentPos.x, posY: currentPos.y };
    } else if (textPointerCacheRef.current.size === 2) {
      setResizingText(textType);
      const pointers = Array.from(textPointerCacheRef.current.values());
      const currentSize =
        textType === 'name'
          ? nameSize
          : textType === 'dates'
            ? typeof frontDatesSize === 'number'
              ? frontDatesSize
              : 12
            : additionalTextSize;

      textPinchStartRef.current = {
        distance: getDistance(pointers[0], pointers[1]),
        size: currentSize,
      };
    }
  };

  const handleTextPointerMove = (e: React.PointerEvent) => {
    textPointerCacheRef.current.set(e.pointerId, e.nativeEvent);

    if (textPointerCacheRef.current.size === 2 && textPinchStartRef.current && resizingText) {
      const pointers = Array.from(textPointerCacheRef.current.values());
      const currentDistance = getDistance(pointers[0], pointers[1]);
      const scaleChange = currentDistance / textPinchStartRef.current.distance;
      const newSize = Math.max(8, Math.min(48, textPinchStartRef.current.size * scaleChange));
      if (resizingText === 'name') {
        setNameSize(newSize);
      } else if (resizingText === 'dates') {
        setFrontDatesSize(newSize);
      } else {
        setAdditionalTextSize(newSize);
      }
      return;
    }

    if (!draggingText || !textDragStartRef.current || !cardPreviewRef.current) return;

    const rect = cardPreviewRef.current.getBoundingClientRect();
    const dx = ((e.clientX - textDragStartRef.current.x) / rect.width) * 100;
    const dy = ((e.clientY - textDragStartRef.current.y) / rect.height) * 100;

    const newX = Math.max(10, Math.min(90, textDragStartRef.current.posX + dx));
    const newY = Math.max(5, Math.min(95, textDragStartRef.current.posY + dy));

    if (draggingText === 'name') {
      setNamePosition({ x: newX, y: newY });
    } else if (draggingText === 'dates') {
      setDatesPosition({ x: newX, y: newY });
    } else {
      setAdditionalTextPosition({ x: newX, y: newY });
    }
  };

  const handleTextPointerUp = (e: React.PointerEvent) => {
    textPointerCacheRef.current.delete(e.pointerId);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Pointer capture may already be released
    }

    if (textPointerCacheRef.current.size < 2) {
      textPinchStartRef.current = null;
      setResizingText(null);
    }
    if (textPointerCacheRef.current.size === 0) {
      setDraggingText(null);
      textDragStartRef.current = null;
    }
  };

  const handleTextWheel = (e: React.WheelEvent, textType: 'name' | 'dates' | 'additional') => {
    e.preventDefault();
    e.stopPropagation();
    const delta = -e.deltaY * 0.05;
    const currentSize =
      textType === 'name'
        ? nameSize
        : textType === 'dates'
          ? typeof frontDatesSize === 'number'
            ? frontDatesSize
            : 12
          : additionalTextSize;

    const newSize = Math.max(8, Math.min(48, currentSize + delta));
    if (textType === 'name') {
      setNameSize(newSize);
    } else if (textType === 'dates') {
      setFrontDatesSize(newSize);
    } else {
      setAdditionalTextSize(newSize);
    }
  };

  const formatDates = (birth: string, death: string, format: 'full' | 'short-month' | 'mmm-dd-yyyy' | 'numeric' | 'year'): string => {
    const formatSingleDate = (d: Date, fmt: typeof format) => {
      switch (fmt) {
        case 'year':
          return d.getFullYear().toString();
        case 'numeric':
          return d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
        case 'mmm-dd-yyyy': {
          const month = d.toLocaleDateString('en-US', { month: 'short' });
          const day = d.getDate().toString().padStart(2, '0');
          const year = d.getFullYear();
          return `${month} ${day}, ${year}`;
        }
        case 'short-month':
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        default:
          return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      }
    };

    if (!birth || !death) {
      switch (format) {
        case 'year': return '1945 – 2025';
        case 'numeric': return '01/01/1945 – 12/31/2025';
        case 'mmm-dd-yyyy': return 'Jan 01, 1945 – Dec 31, 2025';
        case 'short-month': return 'Jan 1, 1945 – Dec 31, 2025';
        default: return 'January 1, 1945 – December 31, 2025';
      }
    }
    const birthD = new Date(birth);
    const deathD = new Date(death);
    
    return `${formatSingleDate(birthD, format)} – ${formatSingleDate(deathD, format)}`;
  };

  const handlePrayerSelect = (prayerId: string) => {
    setSelectedPrayerId(prayerId);
    if (prayerId === 'custom') {
      // Keep current backText
    } else {
      const prayer = prayerTemplates.find(p => p.id === prayerId);
      if (prayer) {
        setBackText(prayer.text);
      }
    }
  };

  const getDistance = (p1: PointerEvent, p2: PointerEvent) => {
    return Math.hypot(p1.clientX - p2.clientX, p1.clientY - p2.clientY);
  };

  const clampPhotoPan = (panX: number, panY: number, scale: number) => {
    const el = photoContainerRef.current;
    if (!el) return { panX, panY };
    const rect = el.getBoundingClientRect();
    const maxX = Math.max(0, (scale - 1) * rect.width * 0.5);
    const maxY = Math.max(0, (scale - 1) * rect.height * 0.5);

    return {
      panX: Math.max(-maxX, Math.min(maxX, panX)),
      panY: Math.max(-maxY, Math.min(maxY, panY)),
    };
  };

  const handlePhotoPointerDown = (e: React.PointerEvent) => {
    if (!deceasedPhoto) return;
    e.preventDefault();
    e.stopPropagation();

    pointerCacheRef.current.set(e.pointerId, e.nativeEvent);
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Pointer capture may not be supported
    }

    if (pointerCacheRef.current.size === 1) {
      setIsPanning(true);
      panStartRef.current = { x: e.clientX, y: e.clientY, panX: photoPanX, panY: photoPanY };
    } else if (pointerCacheRef.current.size === 2) {
      const pointers = Array.from(pointerCacheRef.current.values());
      pinchStartRef.current = {
        distance: getDistance(pointers[0], pointers[1]),
        scale: photoZoom,
      };
    }
  };

  const handlePhotoPointerMove = (e: React.PointerEvent) => {
    if (!deceasedPhoto) return;
    pointerCacheRef.current.set(e.pointerId, e.nativeEvent);

    if (pointerCacheRef.current.size === 2 && pinchStartRef.current) {
      const pointers = Array.from(pointerCacheRef.current.values());
      const currentDistance = getDistance(pointers[0], pointers[1]);
      const scaleChange = currentDistance / pinchStartRef.current.distance;
      const newScale = Math.max(1, Math.min(3, pinchStartRef.current.scale * scaleChange));
      setPhotoZoom(newScale);

      const clamped = clampPhotoPan(photoPanX, photoPanY, newScale);
      setPhotoPanX(clamped.panX);
      setPhotoPanY(clamped.panY);
    } else if (pointerCacheRef.current.size === 1 && panStartRef.current && isPanning) {
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;

      const nextPanX = panStartRef.current.panX + dx;
      const nextPanY = panStartRef.current.panY + dy;
      const clamped = clampPhotoPan(nextPanX, nextPanY, photoZoom);
      setPhotoPanX(clamped.panX);
      setPhotoPanY(clamped.panY);
    }
  };

  const handlePhotoPointerUp = (e: React.PointerEvent) => {
    pointerCacheRef.current.delete(e.pointerId);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Pointer capture may already be released
    }

    if (pointerCacheRef.current.size < 2) {
      pinchStartRef.current = null;
    }
    if (pointerCacheRef.current.size === 0) {
      setIsPanning(false);
      panStartRef.current = null;
    }
  };

  const handlePhotoWheel = (e: React.WheelEvent) => {
    if (!deceasedPhoto) return;
    e.preventDefault();
    const delta = -e.deltaY * 0.002;
    const newScale = Math.max(1, Math.min(3, photoZoom + delta));
    setPhotoZoom(newScale);
    const clamped = clampPhotoPan(photoPanX, photoPanY, newScale);
    setPhotoPanX(clamped.panX);
    setPhotoPanY(clamped.panY);
  };

  const handleImageUpload = (file: File, type: 'photo' | 'back') => {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    if (type === 'photo') {
      setDeceasedPhoto(previewUrl);
      setPhotoZoom(1);
      setPhotoPanX(0);
      setPhotoPanY(0);
    } else {
      setBackBgImage(previewUrl);
    }
    toast.success('Image uploaded!');
  };

  const calculatePrice = () => {
    let total = EXPRESS_PACK_PRICE;
    total += additionalSets * ADDITIONAL_SET_PRICE;
    total += additionalPhotos * ADDITIONAL_PHOTO_PRICE;
    if (shipping === 'overnight') {
      total *= 2; // 100% upcharge
    }
    return total;
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deceasedName.trim()) {
      toast.error('Please enter the name of the deceased');
      return;
    }
    toast.success('Order submitted! We will contact you shortly to complete your order.');
    // In a real app, this would submit to a backend
  };

  const currentFinish = METAL_FINISHES.find(f => f.id === metalFinish) || METAL_FINISHES[0];

  const cardClass = orientation === 'landscape' 
    ? 'aspect-[3.5/2] w-80' 
    : 'aspect-[2/3.5] w-56';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-amber-900/30 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={eternityLogo} alt="Metal Prayer Cards" className="h-10 w-auto" />
          </Link>
          <div className="text-sm text-slate-400">
            Step {step} of 3
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {step === 1 && 'Design Your Metal Prayer Card'}
            {step === 2 && 'Choose Your Package'}
            {step === 3 && 'Review & Order'}
          </h1>
          <p className="text-slate-400">
            {step === 1 && 'Customize the front and back of your prayer card'}
            {step === 2 && 'Select quantity and shipping options'}
            {step === 3 && 'Confirm your order details'}
          </p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <form onSubmit={handleSubmitOrder}>
              {/* Step 1: Card Design */}
              {step === 1 && (
                <div className="space-y-6">
                  {/* Orientation Toggle */}
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      type="button"
                      variant={orientation === 'landscape' ? 'default' : 'outline'}
                      onClick={() => setOrientation('landscape')}
                      className={orientation === 'landscape' 
                        ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                        : 'border-slate-600 text-slate-300 hover:bg-slate-700'}
                    >
                      <RectangleHorizontal className="h-4 w-4 mr-2" />
                      Landscape
                    </Button>
                    <Button
                      type="button"
                      variant={orientation === 'portrait' ? 'default' : 'outline'}
                      onClick={() => setOrientation('portrait')}
                      className={orientation === 'portrait' 
                        ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                        : 'border-slate-600 text-slate-300 hover:bg-slate-700'}
                    >
                      <RectangleVertical className="h-4 w-4 mr-2" />
                      Portrait
                    </Button>
                  </div>

                  {/* Front/Back Tabs */}
                  <Tabs value={cardSide} onValueChange={(v) => setCardSide(v as CardSide)} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                      <TabsTrigger value="front" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
                        Front (Photo)
                      </TabsTrigger>
                      <TabsTrigger value="back" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
                        Back (Info + QR)
                      </TabsTrigger>
                    </TabsList>

                    {/* Front Card */}
                    <TabsContent value="front" className="mt-4">
                      <div className="flex flex-col items-center gap-4">
                        {/* Card Preview */}
                        <div 
                          ref={cardPreviewRef}
                          className={`${cardClass} rounded-2xl overflow-hidden shadow-2xl relative`}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br ${currentFinish.gradient} p-1`}>
                            <div 
                              ref={photoContainerRef}
                              className="w-full h-full rounded-xl overflow-hidden bg-slate-700 flex items-center justify-center touch-none relative"
                              style={{ cursor: deceasedPhoto && !draggingText ? (isPanning ? 'grabbing' : 'grab') : 'default' }}
                              onPointerDown={handlePhotoPointerDown}
                              onPointerMove={handlePhotoPointerMove}
                              onPointerUp={handlePhotoPointerUp}
                              onPointerCancel={handlePhotoPointerUp}
                              onWheel={handlePhotoWheel}
                            >
                              {deceasedPhoto ? (
                                <img
                                  src={deceasedPhoto}
                                  alt="Deceased"
                                  draggable={false}
                                  className="w-full h-full object-cover pointer-events-none select-none"
                                  style={{
                                    transform: `translate(${photoPanX}px, ${photoPanY}px) scale(${photoZoom})`,
                                    transformOrigin: 'center',
                                    willChange: 'transform',
                                  }}
                                />
                              ) : (
                                <div className="text-center p-4">
                                  <ImageIcon className="h-12 w-12 text-slate-500 mx-auto mb-2" />
                                  <p className="text-slate-500 text-sm">Upload photo</p>
                                </div>
                              )}
                              
                              {/* Text Overlay - Name */}
                              {showNameOnFront && (
                                <div
                                  className="absolute touch-none select-none px-2 py-1 rounded"
                                  style={{
                                    left: `${namePosition.x}%`,
                                    top: `${namePosition.y}%`,
                                    transform: 'translate(-50%, -50%)',
                                    fontFamily: nameFont,
                                    cursor: draggingText === 'name' || resizingText === 'name' ? 'grabbing' : 'grab',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                    boxShadow: (draggingText === 'name' || resizingText === 'name') ? '0 0 0 2px #d97706' : 'none',
                                    whiteSpace: 'nowrap',
                                  }}
                                  onPointerDown={(e) => handleTextPointerDown(e, 'name')}
                                  onPointerMove={handleTextPointerMove}
                                  onPointerUp={handleTextPointerUp}
                                  onPointerCancel={handleTextPointerUp}
                                  onWheel={(e) => handleTextWheel(e, 'name')}
                                >
                                  <span className="font-medium" style={{ fontSize: `${nameSize}px`, color: nameColor }}>
                                    {deceasedName || 'Name Here'}
                                  </span>
                                </div>
                              )}
                              
                              {/* Text Overlay - Dates */}
                              {showDatesOnFront && (
                                <div
                                  className="absolute touch-none select-none px-2 py-1 rounded"
                                  style={{
                                    left: `${datesPosition.x}%`,
                                    top: `${datesPosition.y}%`,
                                    transform: 'translate(-50%, -50%)',
                                    fontFamily: datesFont,
                                    cursor: draggingText === 'dates' || resizingText === 'dates' ? 'grabbing' : 'grab',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                    boxShadow: (draggingText === 'dates' || resizingText === 'dates') ? '0 0 0 2px #d97706' : 'none',
                                    whiteSpace: 'nowrap',
                                  }}
                                  onPointerDown={(e) => handleTextPointerDown(e, 'dates')}
                                  onPointerMove={handleTextPointerMove}
                                  onPointerUp={handleTextPointerUp}
                                  onPointerCancel={handleTextPointerUp}
                                  onWheel={(e) => handleTextWheel(e, 'dates')}
                                >
                                  <span style={{ fontSize: frontDatesSize === 'auto' ? '12px' : `${frontDatesSize}px`, color: frontDatesColor }}>
                                    {formatDates(birthDate, deathDate, frontDateFormat)}
                                  </span>
                                </div>
                              )}
                              
                              {/* Text Overlay - Additional */}
                              {showAdditionalText && (
                                <div
                                  className="absolute touch-none select-none px-2 py-1 rounded"
                                  style={{
                                    left: `${additionalTextPosition.x}%`,
                                    top: `${additionalTextPosition.y}%`,
                                    transform: 'translate(-50%, -50%)',
                                    fontFamily: additionalTextFont,
                                    cursor: draggingText === 'additional' || resizingText === 'additional' ? 'grabbing' : 'grab',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                    boxShadow: (draggingText === 'additional' || resizingText === 'additional') ? '0 0 0 2px #d97706' : 'none',
                                    maxWidth: '80%',
                                  }}
                                  onPointerDown={(e) => handleTextPointerDown(e, 'additional')}
                                  onPointerMove={handleTextPointerMove}
                                  onPointerUp={handleTextPointerUp}
                                  onPointerCancel={handleTextPointerUp}
                                  onWheel={(e) => handleTextWheel(e, 'additional')}
                                >
                                  <span style={{ fontSize: `${additionalTextSize}px`, color: additionalTextColor, whiteSpace: 'pre-wrap', textAlign: 'center', display: 'block' }}>
                                    {additionalText || 'Your text here'}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Photo Upload */}
                        <input
                          ref={photoInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'photo')}
                        />
                        <div className="flex gap-2 flex-wrap justify-center">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => photoInputRef.current?.click()}
                            className="border-amber-600/50 text-amber-400 hover:bg-amber-600/20"
                          >
                            <ImageIcon className="h-4 w-4 mr-2" />
                            {deceasedPhoto ? 'Change Photo' : 'Upload Photo'}
                          </Button>
                          {deceasedPhoto && (
                            <>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setPhotoZoom(1);
                                  setPhotoPanX(0);
                                  setPhotoPanY(0);
                                }}
                                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                              >
                                <RotateCcw className="h-4 w-4 mr-1" />
                                Reset
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setDeceasedPhoto(null);
                                  setPhotoZoom(1);
                                  setPhotoPanX(0);
                                  setPhotoPanY(0);
                                }}
                                className="border-rose-600/50 text-rose-400 hover:bg-rose-600/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>

                        {deceasedPhoto && (
                          <p className="text-slate-400 text-xs text-center bg-slate-700/50 px-3 py-2 rounded-lg">
                            📱 Drag to move • Pinch/scroll on text to resize
                          </p>
                        )}

                        {/* Text Controls */}
                        <div className="w-full space-y-4 border-t border-slate-700 pt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Type className="h-4 w-4 text-slate-400" />
                            <Label className="text-slate-400 font-medium">Front Card Text</Label>
                          </div>
                          
                          {/* Name Controls */}
                          <div className="space-y-2 p-3 bg-slate-700/30 rounded-lg">
                            <Label className="text-white text-sm font-medium">Name</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <Input
                                placeholder="John David Smith"
                                value={deceasedName}
                                onChange={(e) => setDeceasedName(e.target.value)}
                                className="bg-slate-700 border-slate-600 text-white"
                              />
                              <Select value={nameFont} onValueChange={setNameFont}>
                                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                  <SelectValue placeholder="Font" />
                                </SelectTrigger>
                                <SelectContent>
                                  {FONT_OPTIONS.map((font) => (
                                    <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                                      {font.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-center gap-3 flex-wrap">
                              <div className="flex items-center gap-2">
                                <Label className="text-slate-400 text-xs">Color</Label>
                                <input
                                  type="color"
                                  value={nameColor}
                                  onChange={(e) => setNameColor(e.target.value)}
                                  className="w-8 h-8 rounded border border-slate-600 cursor-pointer"
                                />
                              </div>
                              <div className="flex items-center gap-1">
                                <Label className="text-slate-400 text-xs">Size</Label>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6 border-slate-600"
                                  onClick={() => setNameSize(Math.max(8, nameSize - 2))}
                                >
                                  <span className="text-xs">−</span>
                                </Button>
                                <span className="text-xs text-white bg-slate-700 px-2 py-1 rounded min-w-[40px] text-center">{Math.round(nameSize)}px</span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6 border-slate-600"
                                  onClick={() => setNameSize(Math.min(48, nameSize + 2))}
                                >
                                  <span className="text-xs">+</span>
                                </Button>
                              </div>
                              <label className="flex items-center gap-2 cursor-pointer ml-auto">
                                <input 
                                  type="checkbox" 
                                  checked={showNameOnFront} 
                                  onChange={(e) => setShowNameOnFront(e.target.checked)}
                                  className="accent-amber-600"
                                />
                                <span className="text-slate-400 text-xs">Show</span>
                              </label>
                            </div>
                          </div>

                          {/* Dates Controls */}
                          <div className="space-y-2 p-3 bg-slate-700/30 rounded-lg">
                            <Label className="text-white text-sm font-medium">Dates</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <Input
                                type="date"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                className="bg-slate-700 border-slate-600 text-white"
                              />
                              <Input
                                type="date"
                                value={deathDate}
                                onChange={(e) => setDeathDate(e.target.value)}
                                className="bg-slate-700 border-slate-600 text-white"
                              />
                              <Select value={datesFont} onValueChange={setDatesFont}>
                                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                  <SelectValue placeholder="Font" />
                                </SelectTrigger>
                                <SelectContent>
                                  {FONT_OPTIONS.map((font) => (
                                    <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                                      {font.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={showDatesOnFront} 
                                  onChange={(e) => setShowDatesOnFront(e.target.checked)}
                                  className="accent-amber-600"
                                />
                                <span className="text-slate-400 text-xs">Show on front</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        <p className="text-slate-400 text-xs text-center">The photo fills the entire front of the card with a metal border frame</p>
                      </div>
                    </TabsContent>

                    {/* Back Card */}
                    <TabsContent value="back" className="mt-4">
                      <div className="flex flex-col items-center gap-4">
                        {/* Card Preview */}
                        <div 
                          className={`${cardClass} rounded-2xl shadow-2xl relative overflow-hidden`}
                        >
                          <div 
                            className={`absolute inset-0 rounded-2xl ${!backBgImage ? `bg-gradient-to-br ${currentFinish.gradient}` : ''}`}
                            style={backBgImage ? { 
                              backgroundImage: `url(${backBgImage})`, 
                              backgroundSize: 'cover', 
                              backgroundPosition: 'center' 
                            } : undefined}
                          >
                            {backBgImage && (
                              <div className="absolute inset-0 bg-black/40 rounded-2xl"></div>
                            )}
                            {!backBgImage && (
                              <div 
                                className="absolute inset-0 opacity-20 rounded-2xl"
                                style={{
                                  backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.1) 1px, rgba(255,255,255,0.1) 2px)',
                                }}
                              />
                            )}
                            <div className="relative z-10 w-full h-full p-3">
                              <div className="h-full flex flex-col justify-between text-center">
                                {/* Name & Dates */}
                                <div>
                                  <p className={`text-[8px] uppercase tracking-[0.12em] mb-0.5 ${backBgImage || metalFinish === 'black' ? 'text-zinc-300' : 'text-zinc-700'}`}>
                                    In Loving Memory
                                  </p>
                                  <p className={`${orientation === 'portrait' ? 'text-base' : 'text-sm'} font-serif ${backBgImage || metalFinish === 'black' ? 'text-white' : 'text-zinc-900'}`}>
                                    {deceasedName || 'Name Here'}
                                  </p>
                                  {showDatesOnBack && (
                                    <p style={{ 
                                      fontSize: backDatesSize === 'auto' ? '10px' : `${backDatesSize}px`,
                                      color: backDatesColor 
                                    }}>
                                      {formatDates(birthDate, deathDate, backDateFormat)}
                                    </p>
                                  )}
                                </div>

                                {/* Prayer */}
                                <div className="flex-1 flex items-center justify-center py-1 px-1 overflow-hidden">
                                  <p 
                                    className={`leading-relaxed font-serif italic ${backBgImage || metalFinish === 'black' ? 'text-zinc-200' : 'text-zinc-700'} whitespace-pre-line text-center`}
                                    style={prayerTextSize === 'auto' ? {
                                      fontSize: `clamp(7px, ${Math.max(7, 14 - backText.length / 30)}px, 14px)`,
                                    } : { fontSize: `${prayerTextSize}px` }}
                                  >
                                    {backText}
                                  </p>
                                </div>

                                {/* QR Code */}
                                {showQrCode && qrUrl && (
                                  <div className="flex flex-col items-center">
                                    <div className={`${orientation === 'portrait' ? 'w-12 h-12' : 'w-8 h-8'} bg-white rounded-lg flex items-center justify-center shadow-md p-1`}>
                                      <QRCodeSVG 
                                        value={qrUrl} 
                                        size={orientation === 'portrait' ? 40 : 28}
                                        level="M"
                                        includeMargin={false}
                                      />
                                    </div>
                                    <p className={`text-[6px] mt-0.5 ${backBgImage || metalFinish === 'black' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                      Scan to visit
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Upload Back Background */}
                        <input
                          ref={backInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'back')}
                        />
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => backInputRef.current?.click()}
                            className="border-amber-600/50 text-amber-400 hover:bg-amber-600/20"
                          >
                            <ImageIcon className="h-4 w-4 mr-2" />
                            {backBgImage ? 'Change Background' : 'Upload Background'}
                          </Button>
                          {backBgImage && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setBackBgImage(null)}
                              className="border-slate-600 text-slate-300 hover:bg-slate-700"
                            >
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Use Metal
                            </Button>
                          )}
                        </div>

                        {/* Prayer Selection */}
                        <div className="w-full max-w-md space-y-3">
                          <div className="flex items-center gap-2">
                            <Book className="h-4 w-4 text-slate-400" />
                            <Label className="text-slate-400">Quick Select Prayer</Label>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {[
                              { id: 'psalm-23', label: 'Psalm 23' },
                              { id: 'serenity-prayer', label: 'Serenity Prayer' },
                              { id: 'lords-prayer', label: "Lord's Prayer" },
                              { id: 'irish-blessing', label: 'Irish Blessing' },
                              { id: 'remember-me', label: 'Remember Me' },
                            ].map((prayer) => (
                              <Button
                                key={prayer.id}
                                type="button"
                                variant={selectedPrayerId === prayer.id ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handlePrayerSelect(prayer.id)}
                                className={selectedPrayerId === prayer.id 
                                  ? 'bg-amber-600 text-white' 
                                  : 'border-slate-600 text-slate-300 hover:bg-slate-700'}
                              >
                                {prayer.label}
                              </Button>
                            ))}
                            <Button
                              type="button"
                              variant={selectedPrayerId === 'custom' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setSelectedPrayerId('custom')}
                              className={selectedPrayerId === 'custom' 
                                ? 'bg-amber-600 text-white' 
                                : 'border-slate-600 text-slate-300 hover:bg-slate-700'}
                            >
                              ✏️ Custom
                            </Button>
                          </div>
                          
                          <Textarea
                            placeholder="The Lord is my shepherd..."
                            value={backText}
                            onChange={(e) => {
                              setBackText(e.target.value);
                              setSelectedPrayerId('custom');
                            }}
                            className="bg-slate-700 border-slate-600 text-white min-h-[80px]"
                            rows={3}
                          />
                        </div>
                        
                        {/* QR Code URL */}
                        <div className="w-full max-w-md space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-slate-400">QR Code Link (optional)</Label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={showQrCode} 
                                onChange={(e) => setShowQrCode(e.target.checked)}
                                className="accent-amber-600"
                              />
                              <span className="text-slate-400 text-xs">Show QR</span>
                            </label>
                          </div>
                          <Input
                            placeholder="https://memorial-page.com"
                            value={qrUrl}
                            onChange={(e) => setQrUrl(e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                            disabled={!showQrCode}
                          />
                          <p className="text-xs text-slate-500">Enter URL to generate QR code on card</p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Metal Finish Selection */}
                  <div>
                    <Label className="text-slate-400 mb-3 block">Metal Finish</Label>
                    <div className="grid grid-cols-4 gap-3">
                      {METAL_FINISHES.map((finish) => (
                        <button
                          key={finish.id}
                          type="button"
                          onClick={() => setMetalFinish(finish.id)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            metalFinish === finish.id 
                              ? 'border-amber-500 ring-2 ring-amber-500/30' 
                              : 'border-slate-600 hover:border-slate-500'
                          }`}
                        >
                          <div className={`h-8 rounded bg-gradient-to-br ${finish.gradient} mb-2`}></div>
                          <p className="text-xs text-slate-400">{finish.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button 
                    type="button" 
                    onClick={() => setStep(2)} 
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                  >
                    Continue <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}

              {/* Step 2: Package Selection */}
              {step === 2 && (
                <div className="space-y-6">
                  {/* Express Pack - Base Package */}
                  <div className="bg-gradient-to-br from-amber-900/40 to-amber-800/20 border border-amber-600/50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Package className="h-8 w-8 text-amber-400" />
                      <div>
                        <h3 className="text-xl font-bold text-white">2-Day Express Pack</h3>
                        <p className="text-slate-400 text-sm">Included in every order</p>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-4xl font-bold text-white">${EXPRESS_PACK_PRICE}</span>
                      <span className="text-slate-400 line-through">$250</span>
                      <span className="text-amber-400 font-medium ml-2">Save $123!</span>
                    </div>
                    <ul className="space-y-2 text-slate-300">
                      <li className="flex items-center gap-2">
                        <span className="text-amber-400">✓</span>
                        55 Premium Metal Prayer Cards
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-amber-400">✓</span>
                        2 Easel Size Photos Included
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-amber-400">✓</span>
                        2-Day Express Delivery
                      </li>
                    </ul>
                  </div>

                  {/* Add-ons */}
                  <div className="space-y-4">
                    <Label className="text-slate-400 block">Add-Ons (Optional)</Label>
                    
                    {/* Additional Card Sets */}
                    <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Additional Set of 55 Cards</p>
                        <p className="text-slate-400 text-sm">${ADDITIONAL_SET_PRICE} per set</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setAdditionalSets(Math.max(0, additionalSets - 1))}
                          className="h-8 w-8 border-slate-600"
                        >
                          −
                        </Button>
                        <span className="text-white w-8 text-center">{additionalSets}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setAdditionalSets(additionalSets + 1)}
                          className="h-8 w-8 border-slate-600"
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    {/* Additional Photos */}
                    <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Additional Easel Photos</p>
                        <p className="text-slate-400 text-sm">${ADDITIONAL_PHOTO_PRICE} per photo</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setAdditionalPhotos(Math.max(0, additionalPhotos - 1))}
                          className="h-8 w-8 border-slate-600"
                        >
                          −
                        </Button>
                        <span className="text-white w-8 text-center">{additionalPhotos}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setAdditionalPhotos(additionalPhotos + 1)}
                          className="h-8 w-8 border-slate-600"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Options */}
                  <div>
                    <Label className="text-slate-400 mb-3 block">Shipping Speed</Label>
                    <RadioGroup value={shipping} onValueChange={(v) => setShipping(v as ShippingType)}>
                      <div 
                        className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          shipping === 'express' ? 'border-amber-500 bg-amber-600/10' : 'border-slate-600 hover:border-slate-500'
                        }`} 
                        onClick={() => setShipping('express')}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="express" id="express" className="border-slate-500" />
                          <div>
                            <Label htmlFor="express" className="text-white font-medium cursor-pointer flex items-center gap-2">
                              <Truck className="h-4 w-4" /> 2-Day Express
                            </Label>
                            <p className="text-sm text-slate-400">Included in package</p>
                          </div>
                        </div>
                        <p className="text-amber-400 font-semibold">Included</p>
                      </div>
                      <div 
                        className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all mt-3 ${
                          shipping === 'overnight' ? 'border-amber-500 bg-amber-600/10' : 'border-slate-600 hover:border-slate-500'
                        }`} 
                        onClick={() => setShipping('overnight')}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="overnight" id="overnight" className="border-slate-500" />
                          <div>
                            <Label htmlFor="overnight" className="text-white font-medium cursor-pointer flex items-center gap-2">
                              <Clock className="h-4 w-4 text-rose-400" /> Overnight Rush
                            </Label>
                            <p className="text-sm text-slate-400">Order before 12pm for next day</p>
                          </div>
                        </div>
                        <p className="text-rose-400 font-semibold">+100%</p>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep(1)} 
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => {
                        if (!deceasedName.trim()) {
                          toast.error('Please enter the name in the card design');
                          setStep(1);
                          return;
                        }
                        setStep(3);
                      }} 
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                    >
                      Continue <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Review & Order */}
              {step === 3 && (
                <div className="space-y-6">
                  {/* Order Summary */}
                  <div className="bg-slate-700/30 rounded-lg p-6 space-y-4">
                    <h4 className="text-white font-semibold text-lg mb-4">Order Summary</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-300">2-Day Express Pack (55 cards + 2 photos)</span>
                        <span className="text-white">${EXPRESS_PACK_PRICE}</span>
                      </div>
                      
                      {additionalSets > 0 && (
                        <div className="flex justify-between">
                          <span className="text-slate-300">Additional Card Sets × {additionalSets}</span>
                          <span className="text-white">${additionalSets * ADDITIONAL_SET_PRICE}</span>
                        </div>
                      )}
                      
                      {additionalPhotos > 0 && (
                        <div className="flex justify-between">
                          <span className="text-slate-300">Additional Easel Photos × {additionalPhotos}</span>
                          <span className="text-white">${additionalPhotos * ADDITIONAL_PHOTO_PRICE}</span>
                        </div>
                      )}
                      
                      {shipping === 'overnight' && (
                        <div className="flex justify-between text-rose-400">
                          <span>Overnight Rush (+100%)</span>
                          <span>+${calculatePrice() / 2}</span>
                        </div>
                      )}
                      
                      <div className="border-t border-slate-600 pt-3 mt-3">
                        <div className="flex justify-between text-lg font-semibold">
                          <span className="text-white">Total</span>
                          <span className="text-amber-400">${calculatePrice()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4 mt-4">
                      <h5 className="text-white font-medium mb-2">Memorial Details</h5>
                      <p className="text-slate-300">
                        <span className="text-slate-400">Name:</span> {deceasedName}
                      </p>
                      {birthDate && deathDate && (
                        <p className="text-slate-300">
                          <span className="text-slate-400">Dates:</span> {formatDates(birthDate, deathDate, frontDateFormat)}
                        </p>
                      )}
                      <p className="text-slate-300">
                        <span className="text-slate-400">Finish:</span> {currentFinish.name}
                      </p>
                      <p className="text-slate-300">
                        <span className="text-slate-400">Orientation:</span> {orientation}
                      </p>
                      <p className="text-slate-300">
                        <span className="text-slate-400">Total Cards:</span> {55 + (additionalSets * 55)}
                      </p>
                      <p className="text-slate-300">
                        <span className="text-slate-400">Easel Photos:</span> {2 + additionalPhotos}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep(2)} 
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                    >
                      Place Order - ${calculatePrice()}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-slate-500">
          <p>© 2025 Metal Prayer Cards. metalprayercards.com</p>
        </div>
      </footer>
    </div>
  );
};

export default Design;
