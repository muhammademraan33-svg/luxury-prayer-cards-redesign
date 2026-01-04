import { useLayoutEffect, useRef, useState } from 'react';
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
const EXPRESS_PACK_PRICE = 127; // 55 cards + 2 easel photos (16x20)
const ADDITIONAL_SET_PRICE = 110; // Additional 55 cards
const ADDITIONAL_PHOTO_PRICE = 27; // Additional easel photo
const EASEL_18X24_UPSELL = 10; // Upgrade from 16x20 to 18x24

type EaselPhotoSize = '16x20' | '18x24';

const Design = () => {
  const [step, setStep] = useState(1);
  
  // Form state
  const [deceasedName, setDeceasedName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [deathDate, setDeathDate] = useState('');
  const [metalFinish, setMetalFinish] = useState<MetalFinish>('silver');
  const [shipping, setShipping] = useState<ShippingType>('express');
  const [additionalSets, setAdditionalSets] = useState(0);
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
  const [prayerTextSize, setPrayerTextSize] = useState<number | 'auto'>(16);
  const [autoPrayerFontSize, setAutoPrayerFontSize] = useState(16);
  
  // Front card text state
  const [showNameOnFront, setShowNameOnFront] = useState(true);
  const [showDatesOnFront, setShowDatesOnFront] = useState(true);
  const [showDatesOnBack, setShowDatesOnBack] = useState(true);
  const [nameFont, setNameFont] = useState('Great Vibes');
  const [datesFont, setDatesFont] = useState('Cormorant Garamond');
  const [namePosition, setNamePosition] = useState({ x: 50, y: 85 });
  const [datesPosition, setDatesPosition] = useState({ x: 50, y: 92 });
  const [nameColor, setNameColor] = useState('#ffffff');
  const [frontDatesColor, setFrontDatesColor] = useState('#ffffffcc');
  const [backDatesColor, setBackDatesColor] = useState('#666666');
  const [nameSize, setNameSize] = useState(24);
  const [frontDatesSize, setFrontDatesSize] = useState<number | 'auto'>(16);
  const [backDatesSize, setBackDatesSize] = useState<number | 'auto'>(14);
  const [frontDateFormat, setFrontDateFormat] = useState<'full' | 'short-month' | 'mmm-dd-yyyy' | 'numeric' | 'year'>('mmm-dd-yyyy');
  const [backDateFormat, setBackDateFormat] = useState<'full' | 'short-month' | 'mmm-dd-yyyy' | 'numeric' | 'year'>('mmm-dd-yyyy');
  const [additionalText, setAdditionalText] = useState('');
  const [additionalTextPosition, setAdditionalTextPosition] = useState({ x: 50, y: 70 });
  const [additionalTextColor, setAdditionalTextColor] = useState('#ffffff');
  const [additionalTextSize, setAdditionalTextSize] = useState(14);
  const [additionalTextFont, setAdditionalTextFont] = useState('Cormorant Garamond');
  const [showAdditionalText, setShowAdditionalText] = useState(false);
  const [selectedPrayerId, setSelectedPrayerId] = useState<string>('custom');
  const [draggingText, setDraggingText] = useState<'name' | 'dates' | 'additional' | 'backDates' | null>(null);
  const [resizingText, setResizingText] = useState<'name' | 'dates' | 'additional' | 'backDates' | null>(null);
  
  // Back card dates position - default to middle horizontal alignment
  const [backDatesPosition, setBackDatesPosition] = useState({ x: 50, y: 18 });
  const [backDatesAlign, setBackDatesAlign] = useState<'left' | 'center' | 'right'>('center');
  
  // Bold options
  const [nameBold, setNameBold] = useState(true);
  const [datesBold, setDatesBold] = useState(false);
  const [additionalTextBold, setAdditionalTextBold] = useState(false);
  const [inLovingMemoryBold, setInLovingMemoryBold] = useState(false);
  const [prayerBold, setPrayerBold] = useState(false);
  
  // "In Loving Memory" customization
  const [inLovingMemoryText, setInLovingMemoryText] = useState('In Loving Memory');
  const [inLovingMemoryColor, setInLovingMemoryColor] = useState('#a1a1aa');
  const [inLovingMemorySize, setInLovingMemorySize] = useState(12);
  const [inLovingMemoryFont, setInLovingMemoryFont] = useState('Cormorant Garamond');
  const [showInLovingMemory, setShowInLovingMemory] = useState(true);
  
  // Funeral home logo
  const [funeralHomeLogo, setFuneralHomeLogo] = useState<string | null>(null);
  const [funeralHomeLogoPosition, setFuneralHomeLogoPosition] = useState<'top' | 'bottom'>('bottom');
  const [funeralHomeLogoSize, setFuneralHomeLogoSize] = useState(40);
  
  // Easel photo state - supports multiple photos (2 included, can add more)
  const [easelPhotos, setEaselPhotos] = useState<string[]>([]);
  const [easelPhotoSize, setEaselPhotoSize] = useState<EaselPhotoSize>('16x20');
  const [easelPhotoText, setEaselPhotoText] = useState('');
  const [easelPhotoTextPosition, setEaselPhotoTextPosition] = useState<'top' | 'bottom'>('bottom');
  const [easelPhotoTextColor, setEaselPhotoTextColor] = useState('#ffffff');
  const [easelPhotoTextSize, setEaselPhotoTextSize] = useState(24);
  const [showEaselPhotoText, setShowEaselPhotoText] = useState(true);
  const easelPhotosInputRef = useRef<HTMLInputElement>(null);
  
  const textDragStartRef = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);
  const textPinchStartRef = useRef<{ distance: number; size: number } | null>(null);
  const textPointerCacheRef = useRef<Map<number, PointerEvent>>(new Map());
  const photoInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  
  const photoContainerRef = useRef<HTMLDivElement>(null);
  const cardPreviewRef = useRef<HTMLDivElement>(null);
  const prayerContainerRef = useRef<HTMLDivElement>(null);
  const prayerTextRef = useRef<HTMLParagraphElement>(null);
  const panStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const pinchStartRef = useRef<{ distance: number; scale: number } | null>(null);
  const pointerCacheRef = useRef<Map<number, PointerEvent>>(new Map());

  // Text drag handlers
  const handleTextPointerDown = (e: React.PointerEvent, textType: 'name' | 'dates' | 'additional' | 'backDates') => {
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
        textType === 'name' ? namePosition : textType === 'dates' ? datesPosition : textType === 'backDates' ? backDatesPosition : additionalTextPosition;
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
            : textType === 'backDates'
              ? typeof backDatesSize === 'number'
                ? backDatesSize
                : 10
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
      } else if (resizingText === 'backDates') {
        setBackDatesSize(newSize);
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
    } else if (draggingText === 'backDates') {
      setBackDatesPosition({ x: newX, y: newY });
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

  const handleTextWheel = (e: React.WheelEvent, textType: 'name' | 'dates' | 'additional' | 'backDates') => {
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
          : textType === 'backDates'
            ? typeof backDatesSize === 'number'
              ? backDatesSize
              : 10
            : additionalTextSize;

    const newSize = Math.max(8, Math.min(48, currentSize + delta));
    if (textType === 'name') {
      setNameSize(newSize);
    } else if (textType === 'dates') {
      setFrontDatesSize(newSize);
    } else if (textType === 'backDates') {
      setBackDatesSize(newSize);
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

  // Prevent orphan words by replacing the last space in each line with a non-breaking space
  const preventOrphans = (text: string): string => {
    // Split by newlines to handle each line separately
    return text.split('\n').map(line => {
      const words = line.trim().split(' ');
      if (words.length <= 2) return line; // Don't modify lines with 2 or fewer words
      // Join the last two words with a non-breaking space
      const lastTwo = words.slice(-2).join('\u00A0');
      return [...words.slice(0, -2), lastTwo].join(' ');
    }).join('\n');
  };

  // Auto-fit prayer text so it never gets cut off in the preview
  useLayoutEffect(() => {
    if (prayerTextSize !== 'auto') return;
    if (cardSide !== 'back') return;

    const container = prayerContainerRef.current;
    const textEl = prayerTextRef.current;
    if (!container || !textEl) return;

    // Wait until layout is stable for this paint.
    const raf = requestAnimationFrame(() => {
      const minPx = 7;
      const maxPx = 18;

      const fits = (px: number) => {
        textEl.style.fontSize = `${px}px`;
        textEl.style.lineHeight = '1.15';
        // Trigger layout
        const heightOk = textEl.scrollHeight <= container.clientHeight;
        const widthOk = textEl.scrollWidth <= container.clientWidth;
        return heightOk && widthOk;
      };

      let best = minPx;
      if (fits(maxPx)) {
        best = maxPx;
      } else {
        let lo = minPx;
        let hi = maxPx;
        while (lo <= hi) {
          const mid = Math.floor((lo + hi) / 2);
          if (fits(mid)) {
            best = mid;
            lo = mid + 1;
          } else {
            hi = mid - 1;
          }
        }
      }

      setAutoPrayerFontSize(prev => (prev === best ? prev : best));
    });

    return () => cancelAnimationFrame(raf);
  }, [
    prayerTextSize,
    backText,
    prayerBold,
    cardSide,
    orientation,
    showQrCode,
    qrUrl,
    showDatesOnBack,
    showInLovingMemory,
    inLovingMemoryText,
    inLovingMemorySize,
    funeralHomeLogo,
    funeralHomeLogoPosition,
    funeralHomeLogoSize,
  ]);

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

  const handleImageUpload = (file: File, type: 'photo' | 'back' | 'logo') => {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    if (type === 'photo') {
      setDeceasedPhoto(previewUrl);
      setPhotoZoom(1);
      setPhotoPanX(0);
      setPhotoPanY(0);
    } else if (type === 'back') {
      setBackBgImage(previewUrl);
    } else if (type === 'logo') {
      setFuneralHomeLogo(previewUrl);
    }
    toast.success('Image uploaded!');
  };

  const handleEaselPhotosUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newPhotos: string[] = [];
    Array.from(files).forEach(file => {
      const previewUrl = URL.createObjectURL(file);
      newPhotos.push(previewUrl);
    });
    
    setEaselPhotos(prev => [...prev, ...newPhotos]);
    toast.success(`${newPhotos.length} photo${newPhotos.length > 1 ? 's' : ''} added!`);
  };

  const removeEaselPhoto = (index: number) => {
    setEaselPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const calculatePrice = () => {
    let total = EXPRESS_PACK_PRICE;
    total += additionalSets * ADDITIONAL_SET_PRICE;
    // Additional photos beyond the 2 included
    const extraPhotos = Math.max(0, easelPhotos.length - 2);
    total += extraPhotos * ADDITIONAL_PHOTO_PRICE;
    // Add 18x24 upsell if selected - applies to all easel photos
    const totalEaselPhotos = Math.max(2, easelPhotos.length);
    if (easelPhotoSize === '18x24') {
      total += EASEL_18X24_UPSELL * totalEaselPhotos;
    }
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
    <div className="design-page min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
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
                                  <span style={{ fontSize: `${nameSize}px`, color: nameColor, fontWeight: nameBold ? 'bold' : 'normal', whiteSpace: 'pre', textAlign: 'center' }}>
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
                                  <span style={{ fontSize: frontDatesSize === 'auto' ? '12px' : `${frontDatesSize}px`, color: frontDatesColor, fontWeight: datesBold ? 'bold' : 'normal' }}>
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
                                  <span style={{ fontSize: `${additionalTextSize}px`, color: additionalTextColor, whiteSpace: 'pre-wrap', textAlign: 'center', display: 'block', fontWeight: additionalTextBold ? 'bold' : 'normal' }}>
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
                              <Textarea
                                placeholder="John David&#10;Smith"
                                value={deceasedName}
                                onChange={(e) => setDeceasedName(e.target.value)}
                                className="bg-slate-700 border-slate-600 text-white resize-none min-h-[60px]"
                                rows={2}
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
                              <Button
                                type="button"
                                variant={nameBold ? 'default' : 'outline'}
                                size="sm"
                                className={`h-7 px-3 text-xs font-bold ${nameBold ? 'bg-amber-600 text-white' : 'border-slate-600 text-slate-300'}`}
                                onClick={() => setNameBold(!nameBold)}
                              >
                                B
                              </Button>
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
                            
                            {/* Front Dates Row */}
                            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-600/50">
                              <label className="flex items-center gap-2 cursor-pointer min-w-[60px]">
                                <input 
                                  type="checkbox" 
                                  checked={showDatesOnFront} 
                                  onChange={(e) => setShowDatesOnFront(e.target.checked)}
                                  className="accent-amber-600"
                                />
                                <span className="text-slate-400 text-xs font-medium">Front</span>
                              </label>
                              <Select 
                                value={frontDateFormat} 
                                onValueChange={(v) => setFrontDateFormat(v as 'full' | 'short-month' | 'mmm-dd-yyyy' | 'numeric' | 'year')}
                                disabled={!showDatesOnFront}
                              >
                                <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-7 text-xs w-[130px]">
                                  <SelectValue placeholder="Format" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="full">January 1, 2025</SelectItem>
                                  <SelectItem value="short-month">Jan 1, 2025</SelectItem>
                                  <SelectItem value="mmm-dd-yyyy">Jan 01, 2025</SelectItem>
                                  <SelectItem value="numeric">01/01/2025</SelectItem>
                                  <SelectItem value="year">Years Only</SelectItem>
                                </SelectContent>
                              </Select>
                              <input
                                type="color"
                                value={frontDatesColor.replace('cc', '')}
                                onChange={(e) => setFrontDatesColor(e.target.value)}
                                className="w-7 h-7 rounded border border-slate-600 cursor-pointer"
                                disabled={!showDatesOnFront}
                              />
                              <div className="flex items-center gap-1">
                                <Button
                                  type="button"
                                  variant={frontDatesSize === 'auto' ? 'default' : 'outline'}
                                  size="sm"
                                  className={`h-7 px-2 text-xs ${frontDatesSize === 'auto' ? 'bg-amber-600' : 'border-slate-600'}`}
                                  onClick={() => setFrontDatesSize('auto')}
                                  disabled={!showDatesOnFront}
                                >
                                  Auto
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6 border-slate-600"
                                  onClick={() => setFrontDatesSize(typeof frontDatesSize === 'number' ? Math.max(8, frontDatesSize - 2) : 10)}
                                  disabled={!showDatesOnFront}
                                >
                                  <span className="text-xs">−</span>
                                </Button>
                                <span className="text-xs text-white bg-slate-700 px-1 py-0.5 rounded min-w-[35px] text-center">
                                  {frontDatesSize === 'auto' ? 'auto' : `${frontDatesSize}px`}
                                </span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6 border-slate-600"
                                  onClick={() => setFrontDatesSize(typeof frontDatesSize === 'number' ? Math.min(48, frontDatesSize + 2) : 14)}
                                  disabled={!showDatesOnFront}
                                >
                                  <span className="text-xs">+</span>
                                </Button>
                                <Button
                                  type="button"
                                  variant={datesBold ? 'default' : 'outline'}
                                  size="sm"
                                  className={`h-7 px-3 text-xs font-bold ${datesBold ? 'bg-amber-600 text-white' : 'border-slate-600 text-slate-300'}`}
                                  onClick={() => setDatesBold(!datesBold)}
                                >
                                  B
                                </Button>
                              </div>
                            </div>

                            {/* Back Dates Row - only show when viewing back side */}
                            {cardSide === 'back' && (
                              <div className="flex flex-wrap items-center gap-2">
                                <label className="flex items-center gap-2 cursor-pointer min-w-[60px]">
                                  <input 
                                    type="checkbox" 
                                    checked={showDatesOnBack} 
                                    onChange={(e) => setShowDatesOnBack(e.target.checked)}
                                    className="accent-amber-600"
                                  />
                                  <span className="text-slate-400 text-xs font-medium">Back</span>
                                </label>
                                <Select 
                                  value={backDateFormat} 
                                  onValueChange={(v) => setBackDateFormat(v as 'full' | 'short-month' | 'mmm-dd-yyyy' | 'numeric' | 'year')}
                                  disabled={!showDatesOnBack}
                                >
                                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-7 text-xs w-[130px]">
                                    <SelectValue placeholder="Format" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="full">January 1, 2025</SelectItem>
                                    <SelectItem value="short-month">Jan 1, 2025</SelectItem>
                                    <SelectItem value="mmm-dd-yyyy">Jan 01, 2025</SelectItem>
                                    <SelectItem value="numeric">01/01/2025</SelectItem>
                                    <SelectItem value="year">Years Only</SelectItem>
                                  </SelectContent>
                                </Select>
                                <input
                                  type="color"
                                  value={backDatesColor.replace('cc', '')}
                                  onChange={(e) => setBackDatesColor(e.target.value)}
                                  className="w-7 h-7 rounded border border-slate-600 cursor-pointer"
                                  disabled={!showDatesOnBack}
                                />
                                <div className="flex items-center gap-1">
                                  <Button
                                    type="button"
                                    variant={backDatesSize === 'auto' ? 'default' : 'outline'}
                                    size="sm"
                                    className={`h-7 px-2 text-xs ${backDatesSize === 'auto' ? 'bg-amber-600' : 'border-slate-600'}`}
                                    onClick={() => setBackDatesSize('auto')}
                                    disabled={!showDatesOnBack}
                                  >
                                    Auto
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6 border-slate-600"
                                    onClick={() => setBackDatesSize(typeof backDatesSize === 'number' ? Math.max(8, backDatesSize - 2) : 10)}
                                    disabled={!showDatesOnBack}
                                  >
                                    <span className="text-xs">−</span>
                                  </Button>
                                  <span className="text-xs text-white bg-slate-700 px-1 py-0.5 rounded min-w-[35px] text-center">
                                    {backDatesSize === 'auto' ? 'auto' : `${backDatesSize}px`}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6 border-slate-600"
                                    onClick={() => setBackDatesSize(typeof backDatesSize === 'number' ? Math.min(48, backDatesSize + 2) : 14)}
                                    disabled={!showDatesOnBack}
                                  >
                                    <span className="text-xs">+</span>
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Additional Text Controls */}
                          <div className="space-y-2 p-3 bg-slate-700/30 rounded-lg">
                            <div className="flex items-center justify-between">
                              <Label className="text-white text-sm font-medium">Additional Text</Label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={showAdditionalText} 
                                  onChange={(e) => setShowAdditionalText(e.target.checked)}
                                  className="accent-amber-600"
                                />
                                <span className="text-slate-400 text-xs">Show</span>
                              </label>
                            </div>
                            {showAdditionalText && (
                              <>
                                <Textarea
                                  placeholder="Additional text..."
                                  value={additionalText}
                                  onChange={(e) => setAdditionalText(e.target.value)}
                                  className="bg-slate-700 border-slate-600 text-white min-h-[60px]"
                                  rows={2}
                                />
                                <div className="grid grid-cols-2 gap-3">
                                  <Select value={additionalTextFont} onValueChange={setAdditionalTextFont}>
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
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Label className="text-slate-400 text-xs">Color</Label>
                                    <input
                                      type="color"
                                      value={additionalTextColor}
                                      onChange={(e) => setAdditionalTextColor(e.target.value)}
                                      className="w-8 h-8 rounded border border-slate-600 cursor-pointer"
                                    />
                                    <div className="flex items-center gap-1">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-6 w-6 border-slate-600"
                                        onClick={() => setAdditionalTextSize(Math.max(8, additionalTextSize - 2))}
                                      >
                                        <span className="text-xs">−</span>
                                      </Button>
                                      <span className="text-xs text-white bg-slate-700 px-2 py-1 rounded min-w-[40px] text-center">{Math.round(additionalTextSize)}px</span>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-6 w-6 border-slate-600"
                                        onClick={() => setAdditionalTextSize(Math.min(48, additionalTextSize + 2))}
                                      >
                                        <span className="text-xs">+</span>
                                      </Button>
                                      <Button
                                        type="button"
                                        variant={additionalTextBold ? 'default' : 'outline'}
                                        size="sm"
                                        className={`h-7 px-3 text-xs font-bold ${additionalTextBold ? 'bg-amber-600 text-white' : 'border-slate-600 text-slate-300'}`}
                                        onClick={() => setAdditionalTextBold(!additionalTextBold)}
                                      >
                                        B
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
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
                          ref={cardPreviewRef}
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
                            <div 
                              className="relative z-10 w-full h-full p-3"
                            >
                              <div className="h-full flex flex-col text-center">
                                {/* Header Section - Logo, In Loving Memory, Name, Dates */}
                                <div className="flex flex-col items-center shrink-0">
                                  {/* Funeral Home Logo - Top (above In Loving Memory) */}
                                  {funeralHomeLogo && funeralHomeLogoPosition === 'top' && (
                                    <div className="flex justify-center mb-1">
                                      <img 
                                        src={funeralHomeLogo} 
                                        alt="Funeral Home Logo" 
                                        className="object-contain"
                                        style={{ height: `${funeralHomeLogoSize}px`, maxWidth: '70%' }}
                                      />
                                    </div>
                                  )}
                                  
                                  {showInLovingMemory && (
                                    <p 
                                      className="uppercase tracking-[0.12em] mb-0.5"
                                      style={{ 
                                        fontSize: `${inLovingMemorySize}px`,
                                        color: inLovingMemoryColor,
                                        fontWeight: inLovingMemoryBold ? 'bold' : 'normal',
                                        fontFamily: inLovingMemoryFont,
                                      }}
                                    >
                                      {inLovingMemoryText}
                                    </p>
                                  )}
                                  <p 
                                    className={`${orientation === 'portrait' ? 'text-base' : 'text-sm'} font-serif mb-0.5 whitespace-pre text-center`}
                                    style={{ 
                                      color: backBgImage || metalFinish === 'black' ? '#ffffff' : '#18181b',
                                      fontWeight: nameBold ? 'bold' : 'normal'
                                    }}
                                  >
                                    {deceasedName || 'Name Here'}
                                  </p>
                                  
                                  {/* Dates - now in flow, not absolute */}
                                  {showDatesOnBack && (
                                    <div
                                      className="touch-none select-none px-1 rounded mb-1"
                                      style={{
                                        cursor: draggingText === 'backDates' || resizingText === 'backDates' ? 'grabbing' : 'grab',
                                        boxShadow: (draggingText === 'backDates' || resizingText === 'backDates') ? '0 0 0 2px #d97706' : 'none',
                                        textAlign: backDatesAlign,
                                      }}
                                      onPointerDown={(e) => handleTextPointerDown(e, 'backDates')}
                                      onPointerMove={handleTextPointerMove}
                                      onPointerUp={handleTextPointerUp}
                                      onPointerCancel={handleTextPointerUp}
                                      onWheel={(e) => handleTextWheel(e, 'backDates')}
                                    >
                                      <span style={{ 
                                        fontSize: backDatesSize === 'auto' ? '9px' : `${backDatesSize}px`,
                                        color: backDatesColor,
                                        fontWeight: datesBold ? 'bold' : 'normal'
                                      }}>
                                        {formatDates(birthDate, deathDate, backDateFormat)}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Prayer - takes remaining space with proper overflow handling */}
                                <div ref={prayerContainerRef} className="flex-1 flex items-center justify-center py-1 px-1 overflow-hidden min-h-0">
                                  <p 
                                    ref={prayerTextRef}
                                    className={`leading-snug font-serif italic ${backBgImage || metalFinish === 'black' ? 'text-zinc-200' : 'text-zinc-700'} whitespace-pre-line text-center`}
                                    style={{
                                      fontSize: prayerTextSize === 'auto' 
                                        ? `${autoPrayerFontSize}px`
                                        : `${prayerTextSize}px`,
                                      lineHeight: prayerTextSize === 'auto' ? 1.15 : undefined,
                                      textWrap: 'pretty',
                                      wordBreak: 'keep-all',
                                      fontWeight: prayerBold ? 'bold' : 'normal',
                                      maxHeight: '100%',
                                      overflow: 'hidden',
                                    }}
                                  >
                                    {preventOrphans(backText)}
                                  </p>
                                </div>

                                {/* Footer Section - Logo and/or QR Code */}
                                <div className="shrink-0 flex flex-col items-center">
                                  {/* Funeral Home Logo - Bottom (when no QR) */}
                                  {funeralHomeLogo && funeralHomeLogoPosition === 'bottom' && !showQrCode && (
                                    <div className="flex justify-center mt-1">
                                      <img 
                                        src={funeralHomeLogo} 
                                        alt="Funeral Home Logo" 
                                        className="object-contain"
                                        style={{ height: `${funeralHomeLogoSize}px`, maxWidth: '70%' }}
                                      />
                                    </div>
                                  )}

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
                                      {/* Logo below QR if position is bottom */}
                                      {funeralHomeLogo && funeralHomeLogoPosition === 'bottom' && (
                                        <img 
                                          src={funeralHomeLogo} 
                                          alt="Funeral Home Logo" 
                                          className="object-contain mt-1"
                                          style={{ height: `${funeralHomeLogoSize}px`, maxWidth: '70%' }}
                                        />
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Dates on Back Controls */}
                        <div className="w-full max-w-md space-y-3 p-3 bg-slate-700/30 rounded-lg">
                          <div className="flex items-center justify-between">
                            <Label className="text-white text-sm font-medium">Dates on Back</Label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={showDatesOnBack} 
                                onChange={(e) => setShowDatesOnBack(e.target.checked)}
                                className="accent-amber-600"
                              />
                              <span className="text-slate-400 text-xs">Show</span>
                            </label>
                          </div>
                          {showDatesOnBack && (
                            <>
                              <p className="text-slate-400 text-xs">
                                📱 Drag dates to reposition • Scroll/pinch to resize
                              </p>
                              <div className="flex items-center gap-3 flex-wrap">
                                <div className="flex items-center gap-2">
                                  <Label className="text-slate-400 text-xs">Color</Label>
                                  <input
                                    type="color"
                                    value={backDatesColor}
                                    onChange={(e) => setBackDatesColor(e.target.value)}
                                    className="w-7 h-7 rounded border border-slate-600 cursor-pointer"
                                  />
                                </div>
                                <div className="flex items-center gap-1">
                                  <Label className="text-slate-400 text-xs">Size</Label>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6 border-slate-600"
                                    onClick={() => setBackDatesSize(typeof backDatesSize === 'number' ? Math.max(6, backDatesSize - 1) : 9)}
                                  >
                                    <span className="text-xs">−</span>
                                  </Button>
                                  <span className="text-xs text-white bg-slate-700 px-2 py-1 rounded min-w-[40px] text-center">
                                    {backDatesSize === 'auto' ? 'Auto' : `${backDatesSize}px`}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6 border-slate-600"
                                    onClick={() => setBackDatesSize(typeof backDatesSize === 'number' ? Math.min(18, backDatesSize + 1) : 11)}
                                  >
                                    <span className="text-xs">+</span>
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setBackDatesSize('auto')}
                                    className={`h-6 px-2 text-xs ${backDatesSize === 'auto' ? 'bg-amber-600 text-white border-amber-600' : 'border-slate-600 text-slate-300'}`}
                                  >
                                    Auto
                                  </Button>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 flex-wrap">
                                <Label className="text-slate-400 text-xs">Align</Label>
                                <div className="flex gap-1">
                                  <Button
                                    type="button"
                                    variant={backDatesAlign === 'left' ? 'default' : 'outline'}
                                    size="sm"
                                    className={`h-7 px-3 text-xs ${backDatesAlign === 'left' ? 'bg-amber-600 text-white' : 'border-slate-600 text-slate-300'}`}
                                    onClick={() => { setBackDatesAlign('left'); setBackDatesPosition(prev => ({ ...prev, x: 15 })); }}
                                  >
                                    Left
                                  </Button>
                                  <Button
                                    type="button"
                                    variant={backDatesAlign === 'center' ? 'default' : 'outline'}
                                    size="sm"
                                    className={`h-7 px-3 text-xs ${backDatesAlign === 'center' ? 'bg-amber-600 text-white' : 'border-slate-600 text-slate-300'}`}
                                    onClick={() => { setBackDatesAlign('center'); setBackDatesPosition(prev => ({ ...prev, x: 50 })); }}
                                  >
                                    Center
                                  </Button>
                                  <Button
                                    type="button"
                                    variant={backDatesAlign === 'right' ? 'default' : 'outline'}
                                    size="sm"
                                    className={`h-7 px-3 text-xs ${backDatesAlign === 'right' ? 'bg-amber-600 text-white' : 'border-slate-600 text-slate-300'}`}
                                    onClick={() => { setBackDatesAlign('right'); setBackDatesPosition(prev => ({ ...prev, x: 85 })); }}
                                  >
                                    Right
                                  </Button>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 flex-wrap">
                                <Label className="text-slate-400 text-xs">Format</Label>
                                <Select value={backDateFormat} onValueChange={(v) => setBackDateFormat(v as any)}>
                                  <SelectTrigger className="h-7 w-[140px] bg-slate-700 border-slate-600 text-white text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-slate-800 border-slate-600">
                                    <SelectItem value="full" className="text-white text-xs">Full (January 1)</SelectItem>
                                    <SelectItem value="short-month" className="text-white text-xs">Short (Jan 1)</SelectItem>
                                    <SelectItem value="mmm-dd-yyyy" className="text-white text-xs">MMM DD, YYYY</SelectItem>
                                    <SelectItem value="numeric" className="text-white text-xs">Numeric</SelectItem>
                                    <SelectItem value="year" className="text-white text-xs">Year Only</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </>
                          )}
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

                        {/* In Loving Memory Controls */}
                        <div className="w-full max-w-md space-y-3 p-3 bg-slate-700/30 rounded-lg">
                          <div className="flex items-center justify-between">
                            <Label className="text-white text-sm font-medium">"In Loving Memory" Text</Label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={showInLovingMemory} 
                                onChange={(e) => setShowInLovingMemory(e.target.checked)}
                                className="accent-amber-600"
                              />
                              <span className="text-slate-400 text-xs">Show</span>
                            </label>
                          </div>
                          {showInLovingMemory && (
                            <>
                              <Input
                                placeholder="In Loving Memory"
                                value={inLovingMemoryText}
                                onChange={(e) => setInLovingMemoryText(e.target.value)}
                                className="bg-slate-700 border-slate-600 text-white"
                              />
                              <div className="flex items-center gap-2">
                                <Label className="text-slate-400 text-xs">Font</Label>
                                <Select value={inLovingMemoryFont} onValueChange={setInLovingMemoryFont}>
                                  <SelectTrigger className="h-8 flex-1 bg-slate-700 border-slate-600 text-white text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-slate-800 border-slate-600">
                                    {FONT_OPTIONS.map((font) => (
                                      <SelectItem key={font.value} value={font.value} className="text-white text-xs">
                                        <span style={{ fontFamily: font.value }}>{font.name}</span>
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
                                    value={inLovingMemoryColor}
                                    onChange={(e) => setInLovingMemoryColor(e.target.value)}
                                    className="w-7 h-7 rounded border border-slate-600 cursor-pointer"
                                  />
                                </div>
                                <div className="flex items-center gap-1">
                                  <Label className="text-slate-400 text-xs">Size</Label>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6 border-slate-600"
                                    onClick={() => setInLovingMemorySize(Math.max(6, inLovingMemorySize - 1))}
                                  >
                                    <span className="text-xs">−</span>
                                  </Button>
                                  <span className="text-xs text-white bg-slate-700 px-2 py-1 rounded min-w-[40px] text-center">{inLovingMemorySize}px</span>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6 border-slate-600"
                                    onClick={() => setInLovingMemorySize(Math.min(20, inLovingMemorySize + 1))}
                                  >
                                    <span className="text-xs">+</span>
                                  </Button>
                                </div>
                                <Button
                                  type="button"
                                  variant={inLovingMemoryBold ? 'default' : 'outline'}
                                  size="sm"
                                  className={`h-7 px-3 text-xs font-bold ${inLovingMemoryBold ? 'bg-amber-600 text-white' : 'border-slate-600 text-slate-300'}`}
                                  onClick={() => setInLovingMemoryBold(!inLovingMemoryBold)}
                                >
                                  B
                                </Button>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Funeral Home Logo Upload */}
                        <div className="w-full max-w-md space-y-3 p-3 bg-slate-700/30 rounded-lg">
                          <Label className="text-white text-sm font-medium">Funeral Home Logo/Image</Label>
                          <input
                            ref={logoInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'logo')}
                          />
                          <div className="flex gap-2 flex-wrap">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => logoInputRef.current?.click()}
                              className="border-amber-600/50 text-amber-400 hover:bg-amber-600/20"
                            >
                              <ImageIcon className="h-4 w-4 mr-2" />
                              {funeralHomeLogo ? 'Change Logo' : 'Upload Logo'}
                            </Button>
                            {funeralHomeLogo && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setFuneralHomeLogo(null)}
                                className="border-rose-600/50 text-rose-400 hover:bg-rose-600/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          {funeralHomeLogo && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <Label className="text-slate-400 text-xs">Position</Label>
                                <div className="flex gap-1">
                                  <Button
                                    type="button"
                                    variant={funeralHomeLogoPosition === 'top' ? 'default' : 'outline'}
                                    size="sm"
                                    className={`h-7 px-3 text-xs ${funeralHomeLogoPosition === 'top' ? 'bg-amber-600 text-white' : 'border-slate-600 text-slate-300'}`}
                                    onClick={() => setFuneralHomeLogoPosition('top')}
                                  >
                                    Top
                                  </Button>
                                  <Button
                                    type="button"
                                    variant={funeralHomeLogoPosition === 'bottom' ? 'default' : 'outline'}
                                    size="sm"
                                    className={`h-7 px-3 text-xs ${funeralHomeLogoPosition === 'bottom' ? 'bg-amber-600 text-white' : 'border-slate-600 text-slate-300'}`}
                                    onClick={() => setFuneralHomeLogoPosition('bottom')}
                                  >
                                    Bottom
                                  </Button>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Label className="text-slate-400 text-xs">Size</Label>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6 border-slate-600"
                                  onClick={() => setFuneralHomeLogoSize(Math.max(20, funeralHomeLogoSize - 5))}
                                >
                                  <span className="text-xs">−</span>
                                </Button>
                                <span className="text-xs text-white bg-slate-700 px-2 py-1 rounded min-w-[40px] text-center">{funeralHomeLogoSize}px</span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6 border-slate-600"
                                  onClick={() => setFuneralHomeLogoSize(Math.min(80, funeralHomeLogoSize + 5))}
                                >
                                  <span className="text-xs">+</span>
                                </Button>
                              </div>
                            </div>
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
                          
                          {/* Prayer Text Size Control */}
                          <div className="flex items-center gap-3 flex-wrap">
                            <Label className="text-slate-400 text-xs">Text Size:</Label>
                            <div className="flex gap-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setPrayerTextSize('auto')}
                                className={`text-xs px-2 py-1 h-7 ${prayerTextSize === 'auto' ? 'bg-amber-600 text-white border-amber-600' : 'border-slate-600 text-slate-300'}`}
                              >
                                Auto
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setPrayerTextSize(10)}
                                className={`text-xs px-2 py-1 h-7 ${prayerTextSize === 10 ? 'bg-amber-600 text-white border-amber-600' : 'border-slate-600 text-slate-300'}`}
                              >
                                Small
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setPrayerTextSize(12)}
                                className={`text-xs px-2 py-1 h-7 ${prayerTextSize === 12 ? 'bg-amber-600 text-white border-amber-600' : 'border-slate-600 text-slate-300'}`}
                              >
                                Medium
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setPrayerTextSize(14)}
                                className={`text-xs px-2 py-1 h-7 ${prayerTextSize === 14 ? 'bg-amber-600 text-white border-amber-600' : 'border-slate-600 text-slate-300'}`}
                              >
                                Large
                              </Button>
                              <Button
                                type="button"
                                variant={prayerBold ? 'default' : 'outline'}
                                size="sm"
                                className={`h-7 px-3 text-xs font-bold ${prayerBold ? 'bg-amber-600 text-white' : 'border-slate-600 text-slate-300'}`}
                                onClick={() => setPrayerBold(!prayerBold)}
                              >
                                B
                              </Button>
                            </div>
                          </div>
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
                            placeholder="https://example.com"
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

                  {/* Easel Photo Upload Section */}
                  <div className="border-t border-slate-700 pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <ImageIcon className="h-5 w-5 text-amber-400" />
                      <Label className="text-white font-semibold text-lg">Easel Photos (2 Included)</Label>
                    </div>
                    
                    <p className="text-slate-400 text-sm mb-4">
                      Upload 2 different photos for your included easel displays. You can add more to create a collage or display multiple memories.
                    </p>

                    {/* Easel Photos Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                      {/* Uploaded Photos */}
                      {easelPhotos.map((photo, index) => (
                        <div 
                          key={index}
                          className="relative rounded-lg overflow-hidden shadow-lg bg-slate-800 border border-slate-600 group"
                          style={{ 
                            aspectRatio: easelPhotoSize === '16x20' ? '16/20' : '18/24',
                          }}
                        >
                          <img 
                            src={photo} 
                            alt={`Easel photo ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Text Overlay */}
                          {showEaselPhotoText && easelPhotoText && (
                            <div 
                              className={`absolute left-0 right-0 px-2 py-1 bg-black/50 text-center ${
                                easelPhotoTextPosition === 'top' ? 'top-0' : 'bottom-0'
                              }`}
                            >
                              <p 
                                style={{ 
                                  color: easelPhotoTextColor,
                                  fontSize: `${Math.max(6, easelPhotoTextSize / 4)}px`,
                                }}
                                className="font-serif truncate"
                              >
                                {easelPhotoText}
                              </p>
                            </div>
                          )}
                          
                          {/* Photo Number Badge */}
                          <div className="absolute top-1 left-1 bg-slate-900/80 text-white text-[10px] px-1.5 py-0.5 rounded">
                            #{index + 1} {index < 2 ? '✓' : '+$27'}
                          </div>
                          
                          {/* Size Label */}
                          <div className="absolute top-1 right-1 bg-amber-600/90 text-white text-[8px] px-1 py-0.5 rounded">
                            {easelPhotoSize}
                          </div>
                          
                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => removeEaselPhoto(index)}
                            className="absolute bottom-1 right-1 bg-rose-600/90 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      
                      {/* Add Photo Placeholder(s) */}
                      {easelPhotos.length < 2 && Array.from({ length: 2 - easelPhotos.length }).map((_, i) => (
                        <button
                          key={`placeholder-${i}`}
                          type="button"
                          onClick={() => easelPhotosInputRef.current?.click()}
                          className="rounded-lg border-2 border-dashed border-slate-600 hover:border-amber-500 transition-colors flex flex-col items-center justify-center p-4 bg-slate-800/50"
                          style={{ 
                            aspectRatio: easelPhotoSize === '16x20' ? '16/20' : '18/24',
                          }}
                        >
                          <ImageIcon className="h-6 w-6 text-slate-500 mb-1" />
                          <p className="text-slate-500 text-xs">Photo {easelPhotos.length + i + 1}</p>
                          <p className="text-amber-400 text-[10px]">Included</p>
                        </button>
                      ))}
                      
                      {/* Add More Button */}
                      {easelPhotos.length >= 2 && (
                        <button
                          type="button"
                          onClick={() => easelPhotosInputRef.current?.click()}
                          className="rounded-lg border-2 border-dashed border-slate-600 hover:border-amber-500 transition-colors flex flex-col items-center justify-center p-4 bg-slate-800/50"
                          style={{ 
                            aspectRatio: easelPhotoSize === '16x20' ? '16/20' : '18/24',
                          }}
                        >
                          <ImageIcon className="h-6 w-6 text-slate-500 mb-1" />
                          <p className="text-slate-500 text-xs">Add More</p>
                          <p className="text-amber-400 text-[10px]">+$27 each</p>
                        </button>
                      )}
                    </div>

                    {/* Upload Button */}
                    <input
                      ref={easelPhotosInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleEaselPhotosUpload(e.target.files)}
                    />
                    <div className="flex gap-2 justify-center mb-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => easelPhotosInputRef.current?.click()}
                        className="border-amber-600/50 text-amber-400 hover:bg-amber-600/20"
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        {easelPhotos.length === 0 ? 'Upload Photos' : 'Add More Photos'}
                      </Button>
                      {easelPhotos.length > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setEaselPhotos([])}
                          className="border-rose-600/50 text-rose-400 hover:bg-rose-600/20"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Clear All
                        </Button>
                      )}
                    </div>
                    
                    <p className="text-slate-500 text-xs text-center mb-4">
                      💡 First 2 photos are included • Additional photos are $27 each
                    </p>

                    {/* Size Selection */}
                    <div className="space-y-3 p-4 bg-slate-700/30 rounded-lg mb-4">
                      <Label className="text-white text-sm font-medium">Easel Photo Size</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setEaselPhotoSize('16x20')}
                          className={`p-3 rounded-lg border-2 transition-all text-center ${
                            easelPhotoSize === '16x20' 
                              ? 'border-amber-500 bg-amber-600/20' 
                              : 'border-slate-600 hover:border-slate-500'
                          }`}
                        >
                          <p className="text-white font-medium">16" × 20"</p>
                          <p className="text-amber-400 text-sm">Included</p>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEaselPhotoSize('18x24')}
                          className={`p-3 rounded-lg border-2 transition-all text-center ${
                            easelPhotoSize === '18x24' 
                              ? 'border-amber-500 bg-amber-600/20' 
                              : 'border-slate-600 hover:border-slate-500'
                          }`}
                        >
                          <p className="text-white font-medium">18" × 24"</p>
                          <p className="text-amber-400 text-sm">+$10 each</p>
                        </button>
                      </div>
                    </div>

                    {/* Text Overlay Controls */}
                    <div className="space-y-3 p-4 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <Label className="text-white text-sm font-medium">Text Overlay</Label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={showEaselPhotoText} 
                            onChange={(e) => setShowEaselPhotoText(e.target.checked)}
                            className="accent-amber-600"
                          />
                          <span className="text-slate-400 text-xs">Show</span>
                        </label>
                      </div>
                      {showEaselPhotoText && (
                        <>
                          <Input
                            placeholder="Name or memorial text..."
                            value={easelPhotoText}
                            onChange={(e) => setEaselPhotoText(e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Label className="text-slate-400 text-xs">Position</Label>
                              <div className="flex gap-1">
                                <Button
                                  type="button"
                                  variant={easelPhotoTextPosition === 'top' ? 'default' : 'outline'}
                                  size="sm"
                                  className={`h-7 px-2 text-xs ${easelPhotoTextPosition === 'top' ? 'bg-amber-600' : 'border-slate-600'}`}
                                  onClick={() => setEaselPhotoTextPosition('top')}
                                >
                                  Top
                                </Button>
                                <Button
                                  type="button"
                                  variant={easelPhotoTextPosition === 'bottom' ? 'default' : 'outline'}
                                  size="sm"
                                  className={`h-7 px-2 text-xs ${easelPhotoTextPosition === 'bottom' ? 'bg-amber-600' : 'border-slate-600'}`}
                                  onClick={() => setEaselPhotoTextPosition('bottom')}
                                >
                                  Bottom
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Label className="text-slate-400 text-xs">Color</Label>
                              <input
                                type="color"
                                value={easelPhotoTextColor}
                                onChange={(e) => setEaselPhotoTextColor(e.target.value)}
                                className="w-7 h-7 rounded border border-slate-600 cursor-pointer"
                              />
                            </div>
                            <div className="flex items-center gap-1">
                              <Label className="text-slate-400 text-xs">Size</Label>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 border-slate-600"
                                onClick={() => setEaselPhotoTextSize(Math.max(12, easelPhotoTextSize - 2))}
                              >
                                <span className="text-xs">−</span>
                              </Button>
                              <span className="text-xs text-white bg-slate-700 px-2 py-1 rounded min-w-[40px] text-center">{easelPhotoTextSize}px</span>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 border-slate-600"
                                onClick={() => setEaselPhotoTextSize(Math.min(48, easelPhotoTextSize + 2))}
                              >
                                <span className="text-xs">+</span>
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
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
                        2 Easel Photos ({easelPhotoSize}) - Can upload different images
                        {easelPhotoSize === '18x24' && <span className="text-amber-400 text-xs ml-1">+${EASEL_18X24_UPSELL * 2}</span>}
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

                    {/* Additional Photos Info */}
                    <div className="p-4 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Additional Easel Photos</p>
                          <p className="text-slate-400 text-sm">Add more photos in Step 1 (${ADDITIONAL_PHOTO_PRICE} each beyond 2 included)</p>
                        </div>
                        <div className="text-right">
                          <span className="text-white font-medium">{Math.max(0, easelPhotos.length - 2)} extra</span>
                          {easelPhotos.length > 2 && (
                            <p className="text-amber-400 text-sm">+${(easelPhotos.length - 2) * ADDITIONAL_PHOTO_PRICE}</p>
                          )}
                        </div>
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
                      
                      {easelPhotoSize === '18x24' && (
                        <div className="flex justify-between">
                          <span className="text-slate-300">18×24 Easel Photo Upgrade × {Math.max(2, easelPhotos.length)}</span>
                          <span className="text-white">${EASEL_18X24_UPSELL * Math.max(2, easelPhotos.length)}</span>
                        </div>
                      )}
                      
                      {easelPhotos.length > 2 && (
                        <div className="flex justify-between">
                          <span className="text-slate-300">Additional Easel Photos × {easelPhotos.length - 2}</span>
                          <span className="text-white">${(easelPhotos.length - 2) * ADDITIONAL_PHOTO_PRICE}</span>
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
                      <h5 className="text-white font-medium mb-2">Card Details</h5>
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
                        <span className="text-slate-400">Easel Photos:</span> {Math.max(2, easelPhotos.length)} ({easelPhotoSize})
                      </p>
                      {easelPhotoText && (
                        <p className="text-slate-300">
                          <span className="text-slate-400">Easel Text:</span> {easelPhotoText}
                        </p>
                      )}
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
