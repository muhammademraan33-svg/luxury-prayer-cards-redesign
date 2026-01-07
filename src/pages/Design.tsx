import { useLayoutEffect, useRef, useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sparkles, QrCode, Loader2, Truck, Zap, ArrowLeft, ArrowRight, ImageIcon, RotateCcw, RectangleHorizontal, RectangleVertical, Type, Book, Trash2, Package, Clock, MapPin, Layers, CheckCircle2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Textarea } from '@/components/ui/textarea';
import { prayerTemplates } from '@/data/prayerTemplates';
import { toast } from 'sonner';
import metalCardProduct from '@/assets/metal-card-product.jpg';
import paperCardsProduct from '@/assets/paper-cards-product.jpg';

import cloudsLightBg from '@/assets/backgrounds/clouds-light.jpg';
import marbleGreyBg from '@/assets/backgrounds/marble-grey.jpg';
import sunsetCloudsBg from '@/assets/backgrounds/sunset-clouds.jpg';
import liliesCreamBg from '@/assets/backgrounds/lilies-cream.jpg';
import heavenlyRaysBg from '@/assets/backgrounds/heavenly-rays.jpg';
import oceanSunsetBg from '@/assets/backgrounds/ocean-sunset.jpg';
import doveLightBg from '@/assets/backgrounds/dove-light.jpg';
import mountainSunriseBg from '@/assets/backgrounds/mountain-sunrise.jpg';
import rosesGardenBg from '@/assets/backgrounds/roses-garden.jpg';
import forestPathBg from '@/assets/backgrounds/forest-path.jpg';
import stainedGlassBg from '@/assets/backgrounds/stained-glass.jpg';
import lavenderFieldBg from '@/assets/backgrounds/lavender-field.jpg';
import cherryBlossomsBg from '@/assets/backgrounds/cherry-blossoms.jpg';
import starryNightBg from '@/assets/backgrounds/starry-night.jpg';
import goldMarbleBg from '@/assets/backgrounds/gold-marble.jpg';
import mistyLakeBg from '@/assets/backgrounds/misty-lake.jpg';
import whiteFeathersBg from '@/assets/backgrounds/white-feathers.jpg';
import vintageRosesBg from '@/assets/backgrounds/vintage-roses.jpg';
import wheatSunsetBg from '@/assets/backgrounds/wheat-sunset.jpg';
import gardenPeaceBg from '@/assets/backgrounds/garden-peace.jpg';
import html2canvas from 'html2canvas';
import { hexToRgb, pickBestTextColor, relativeLuminance, rgbToHex } from '@/lib/color';
import { supabase } from '@/integrations/supabase/client';
import { AdditionalDesignData, createEmptyDesign } from '@/components/AdditionalDesignEditor';

const PRESET_BACKGROUNDS = [
  { id: 'clouds', name: 'Soft Clouds', src: cloudsLightBg, isDark: false },
  { id: 'marble', name: 'Grey Marble', src: marbleGreyBg, isDark: false },
  { id: 'sunset', name: 'Sunset Clouds', src: sunsetCloudsBg, isDark: true },
  { id: 'lilies', name: 'White Lilies', src: liliesCreamBg, isDark: false },
  { id: 'rays', name: 'Heavenly Rays', src: heavenlyRaysBg, isDark: false },
  { id: 'ocean', name: 'Ocean Sunset', src: oceanSunsetBg, isDark: true },
  { id: 'dove', name: 'Dove Light', src: doveLightBg, isDark: false },
  { id: 'mountain', name: 'Mountain Sunrise', src: mountainSunriseBg, isDark: true },
  { id: 'roses', name: 'Rose Garden', src: rosesGardenBg, isDark: true },
  { id: 'forest', name: 'Forest Path', src: forestPathBg, isDark: true },
  { id: 'stained-glass', name: 'Stained Glass', src: stainedGlassBg, isDark: true },
  { id: 'lavender', name: 'Lavender Field', src: lavenderFieldBg, isDark: true },
  { id: 'cherry', name: 'Cherry Blossoms', src: cherryBlossomsBg, isDark: false },
  { id: 'starry', name: 'Starry Night', src: starryNightBg, isDark: true },
  { id: 'gold-marble', name: 'Gold Marble', src: goldMarbleBg, isDark: false },
  { id: 'misty-lake', name: 'Misty Lake', src: mistyLakeBg, isDark: false },
  { id: 'feathers', name: 'White Feathers', src: whiteFeathersBg, isDark: false },
  { id: 'vintage-roses', name: 'Vintage Roses', src: vintageRosesBg, isDark: false },
  { id: 'wheat', name: 'Wheat Sunset', src: wheatSunsetBg, isDark: true },
  { id: 'garden', name: 'Garden Peace', src: gardenPeaceBg, isDark: true },
];

// Metal background options for back of card
type BackBgType = 'image' | 'metal';
const METAL_BG_OPTIONS: { id: MetalFinish; name: string; gradient: string; isDark: boolean }[] = [
  { id: 'silver', name: 'Brushed Silver', gradient: 'from-zinc-400 via-zinc-300 to-zinc-500', isDark: false },
  { id: 'gold', name: 'Polished Gold', gradient: 'from-yellow-600 via-yellow-500 to-yellow-700', isDark: false },
  { id: 'black', name: 'Matte Black', gradient: 'from-zinc-800 via-zinc-700 to-zinc-900', isDark: true },
  { id: 'white', name: 'Pearl White', gradient: 'from-gray-100 via-white to-gray-200', isDark: false },
  { id: 'marble', name: 'Silver Marble', gradient: 'from-gray-300 via-slate-100 to-gray-400', isDark: false },
];
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
type CardType = 'metal' | 'paper';

const METAL_FINISHES: { id: MetalFinish; name: string; gradient: string }[] = [
  { id: 'silver', name: 'Brushed Silver', gradient: 'from-zinc-400 via-zinc-300 to-zinc-500' },
  { id: 'gold', name: 'Polished Gold', gradient: 'from-yellow-600 via-yellow-500 to-yellow-700' },
  { id: 'black', name: 'Matte Black', gradient: 'from-zinc-800 via-zinc-700 to-zinc-900' },
  { id: 'white', name: 'Pearl White', gradient: 'from-gray-100 via-white to-gray-200' },
  { id: 'marble', name: 'Silver Marble', gradient: 'from-gray-300 via-slate-100 to-gray-400' },
];

// Package pricing

// Metal packages use starter only; paper packages use starter
type PackageId = 'starter';

// Package configuration
interface PackageConfig {
  name: string;
  price: number;
  comparePrice: number;
  cards: number;
  photos: number;
  shipping: string;
  thickness: CardThickness;
  description: string;
  popular?: boolean;
  badge?: 'MOST POPULAR' | 'BEST VALUE';
}

const METAL_PACKAGES: Record<'starter', PackageConfig> = {
  starter: {
    name: 'Starter Set',
    price: 97,
    comparePrice: 150,
    cards: 55,
    photos: 0,
    shipping: 'Delivered in 48-72 hours',
    thickness: 'standard' as CardThickness,
    description: '55 premium metal cards',
  },
};

const PAPER_PACKAGES: Record<'starter', PackageConfig> = {
  starter: {
    name: 'Starter Set',
    price: 67,
    comparePrice: 125,
    cards: 72,
    photos: 0,
    shipping: 'Delivered in 48-72 hours',
    thickness: 'standard' as CardThickness,
    description: '72 prayer cards + $0.77/additional card',
  },
};

// Add-on pricing
const METAL_ADDITIONAL_SET_PRICE = 87; // Additional 55 metal cards
const ADDITIONAL_PHOTO_PRICE = 17; // Additional easel photo 16x20
const EASEL_18X24_UPSELL = 7; // Upgrade from 16x20 to 18x24
const PREMIUM_THICKNESS_PRICE = 15; // Upgrade to .080" thick cards per set

const PAPER_SIZE_UPSELL = 7; // Upgrade from 2.5x4.25 to 3x4.75
const ADDITIONAL_DESIGN_PRICE = 7; // Per additional design
const PAPER_PER_CARD_PRICE = 0.77; // Per card price for paper cards (beyond 72)

// Shipping options
type ShippingSpeed = '72hour' | '48hour';
const SHIPPING_PRICES: Record<ShippingSpeed, { price: number; label: string }> = {
  '72hour': { price: 10, label: '72-Hour Delivery' },
  '48hour': { price: 17, label: '48-Hour Rush Delivery' },
};

// Border designs for paper cards
type BorderDesign = 'none' | 'classic' | 'floral' | 'ornate' | 'simple' | 'elegant';
const BORDER_DESIGNS: { id: BorderDesign; name: string; preview: string }[] = [
  { id: 'none', name: 'No Border', preview: '' },
  { id: 'classic', name: 'Classic Gold', preview: 'border-4 border-amber-600' },
  { id: 'floral', name: 'Floral Vine', preview: 'border-4 border-double border-amber-700' },
  { id: 'ornate', name: 'Ornate Frame', preview: 'border-8 border-amber-800/50' },
  { id: 'simple', name: 'Simple Line', preview: 'border-2 border-slate-400' },
  { id: 'elegant', name: 'Elegant Double', preview: 'border-4 border-double border-slate-600' },
];

type CardThickness = 'standard' | 'premium';

type EaselPhotoSize = '16x20' | '18x24';
type PaperCardSize = '2.5x4.25' | '3x4.75';

const Design = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Show type selection modal if no type specified
  const urlType = searchParams.get('type');
  const [showTypeModal, setShowTypeModal] = useState(!urlType);

  const handleSelectCardType = (type: CardType) => {
    setSearchParams({ type, quantity: type === 'paper' ? '55' : '55' });
    setShowTypeModal(false);
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [step, setStep] = useState(1);
  
  // Form state
  const [deceasedName, setDeceasedName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [deathDate, setDeathDate] = useState('');
  const [metalFinish, setMetalFinish] = useState<MetalFinish>('white');

  // Card type from URL param (metal or paper)
  const cardType: CardType = searchParams.get('type') === 'paper' ? 'paper' : 'metal';

  const packages = cardType === 'paper' ? PAPER_PACKAGES : METAL_PACKAGES;

  const [selectedPackage, setSelectedPackage] = useState<PackageId>('starter');

  // If user came from pricing on the landing page, honor package/quantity params
  useEffect(() => {
    // Both metal and paper only have starter set now
    setSelectedPackage('starter');

    if (cardType === 'paper') {
      // Paper flow shouldn't carry over metal-only add-ons
      setExtraSets(0);
      setUpgradeThickness(false);
    }
  }, [searchParams, cardType]);

  const [extraSets, setExtraSets] = useState(0); // Additional 55-card sets beyond package
  const [extraPhotos, setExtraPhotos] = useState(0); // Extra photos beyond package (handled by easelPhotos length)
  
  const [upgradeThickness, setUpgradeThickness] = useState(false);
  const [shippingSpeed, setShippingSpeed] = useState<ShippingSpeed>('72hour');
  const [borderDesign, setBorderDesign] = useState<BorderDesign>('none');
  const [mainDesignSize, setMainDesignSize] = useState<PaperCardSize>('2.5x4.25'); // Size for main design
  const [additionalDesigns, setAdditionalDesigns] = useState<AdditionalDesignData[]>([]); // Additional designs with full data
  const [mainDesignQty, setMainDesignQty] = useState(72); // Quantity for main design
  const [activeDesignIndex, setActiveDesignIndex] = useState<number>(-1); // -1 = main design, 0+ = additional designs
  const [qrUrl, setQrUrl] = useState('');
  const [showQrCode, setShowQrCode] = useState(true);
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [cardSide, setCardSide] = useState<CardSide>('front');
  const [deceasedPhoto, setDeceasedPhoto] = useState<string | null>(null);
  const [photoZoom, setPhotoZoom] = useState(1);
  const [photoPanX, setPhotoPanX] = useState(0);
  const [photoPanY, setPhotoPanY] = useState(0);
  const [photoRotation, setPhotoRotation] = useState(0);
  const [photoFade, setPhotoFade] = useState(false);
  const [photoBrightness, setPhotoBrightness] = useState(100);
  const [isPanning, setIsPanning] = useState(false);
  const [backBgImage, setBackBgImage] = useState<string | null>(null);
  const [backBgType, setBackBgType] = useState<BackBgType>('metal');
  const [backMetalFinish, setBackMetalFinish] = useState<MetalFinish>('white');
  const [backBgZoom, setBackBgZoom] = useState(1);
  const [backBgPanX, setBackBgPanX] = useState(0);
  const [backBgPanY, setBackBgPanY] = useState(0);
  const [backBgRotation, setBackBgRotation] = useState(0);
  const [backText, setBackText] = useState('The Lord is my shepherd; I shall not want.');
  const [prayerTextSize, setPrayerTextSize] = useState<number | 'auto'>('auto');
  const [autoPrayerFontSize, setAutoPrayerFontSize] = useState(16);
  const [prayerLayoutNonce, setPrayerLayoutNonce] = useState(0);
  const [prayerColor, setPrayerColor] = useState('#ffffff');
  const [backBgSampleHex, setBackBgSampleHex] = useState<string>('#ffffff');
  
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
  
  // Back name styling
  const [backNameSize, setBackNameSize] = useState(16);
  const [backNameColor, setBackNameColor] = useState('#18181b');
  const [backNameBold, setBackNameBold] = useState(true);
  const [backNameFont, setBackNameFont] = useState('Great Vibes');
  const [showNameOnBack, setShowNameOnBack] = useState(true);
  
  // Bold options
  const [nameBold, setNameBold] = useState(true);
  const [datesBold, setDatesBold] = useState(true);
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

  // Helper to update front text colors based on background darkness
  const updateFrontTextColors = (isDark: boolean) => {
    if (isDark) {
      // Light text for dark backgrounds (photos, dark images)
      setNameColor('#ffffff');
      setFrontDatesColor('#ffffffcc');
      setAdditionalTextColor('#ffffff');
    } else {
      // Dark text for light backgrounds
      setNameColor('#18181b');
      setFrontDatesColor('#3f3f46cc');
      setAdditionalTextColor('#3f3f46');
    }
  };

  const BACK_IMAGE_OVERLAY_ALPHA = 0.2;

  const METAL_SAMPLE_HEX: Record<MetalFinish, string> = {
    silver: '#b9bcc1',
    gold: '#c9a227',
    black: '#0b0b0f',
    white: '#f5f5f5',
    marble: '#d3d7de',
  };

  const applyBlackOverlay = useCallback((hex: string, alpha: number) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    return rgbToHex({
      r: rgb.r * (1 - alpha),
      g: rgb.g * (1 - alpha),
      b: rgb.b * (1 - alpha),
    });
  }, []);

  const getAverageImageHex = useCallback((src: string) => {
    return new Promise<string | null>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          const size = 32;
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(null);

          ctx.drawImage(img, 0, 0, size, size);
          const { data } = ctx.getImageData(0, 0, size, size);

          // Sample roughly the center area where the prayer text sits.
          let r = 0;
          let g = 0;
          let b = 0;
          let count = 0;
          for (let y = 10; y < 22; y++) {
            for (let x = 10; x < 22; x++) {
              const i = (y * size + x) * 4;
              const a = data[i + 3];
              if (a === 0) continue;
              r += data[i];
              g += data[i + 1];
              b += data[i + 2];
              count++;
            }
          }

          if (!count) return resolve(null);
          resolve(rgbToHex({ r: r / count, g: g / count, b: b / count }));
        } catch {
          resolve(null);
        }
      };

      img.onerror = () => resolve(null);
      img.src = src;
    });
  }, []);

  const applyBackTextPalette = useCallback(
    (backgroundHex: string | null, fallbackIsDark: boolean) => {
      const normalizedBg = backgroundHex ? backgroundHex.toLowerCase() : null;

      const best = normalizedBg
        ? pickBestTextColor(normalizedBg, ['#ffffff', '#000000'])
        : fallbackIsDark
          ? '#ffffff'
          : '#000000';

      const useLightText = best.toLowerCase() === '#ffffff';

      setBackBgSampleHex(normalizedBg ?? (useLightText ? '#0b0b0f' : '#ffffff'));

      if (useLightText) {
        setInLovingMemoryColor('#e4e4e7'); // zinc-200
        setBackNameColor('#ffffff');
        setBackDatesColor('#a1a1aa'); // zinc-400
        setPrayerColor('#ffffff');
      } else {
        setInLovingMemoryColor('#71717a'); // zinc-500
        setBackNameColor('#18181b'); // zinc-900
        setBackDatesColor('#52525b'); // zinc-600
        setPrayerColor('#000000');
      }
    },
    []
  );

  const syncBackTextColors = useCallback(
    async (opts?: { imageSrc?: string | null; fallbackIsDark?: boolean }) => {
      const fallbackIsDark = opts?.fallbackIsDark ?? false;
      const imageSrc = typeof opts?.imageSrc !== 'undefined' ? opts?.imageSrc : backBgImage;

      if (imageSrc) {
        const avg = await getAverageImageHex(imageSrc);
        const withOverlay = avg ? applyBlackOverlay(avg, BACK_IMAGE_OVERLAY_ALPHA) : null;
        applyBackTextPalette(withOverlay, true);
        return;
      }

      // No image selected: use a representative metal/paper background color.
      if (cardType === 'paper') {
        applyBackTextPalette('#ffffff', false);
        return;
      }

      const metalHex = METAL_SAMPLE_HEX[backMetalFinish] ?? '#ffffff';
      applyBackTextPalette(metalHex, relativeLuminance(metalHex) < 0.45);
    },
    [applyBackTextPalette, applyBlackOverlay, backBgImage, backMetalFinish, cardType, getAverageImageHex]
  );

  // Helper kept for existing call sites (now auto-detects instead of trusting the boolean).
  const updateBackTextColors = (fallbackIsDark: boolean) => {
    void syncBackTextColors({ fallbackIsDark });
  };

  useEffect(() => {
    void syncBackTextColors();
  }, [syncBackTextColors]);
  
  // Easel photo state - supports multiple photos with individual sizes
  const [easelPhotos, setEaselPhotos] = useState<{src: string, size: EaselPhotoSize}[]>([]);
  const easelPhotosInputRef = useRef<HTMLInputElement>(null);
  
  // Shipping address state
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingStreet, setShippingStreet] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [shippingZip, setShippingZip] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Refs for print capture
  const frontPrintRef = useRef<HTMLDivElement>(null);
  const backPrintRef = useRef<HTMLDivElement>(null);
  
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

    // Parse date string (YYYY-MM-DD) to avoid timezone offset issues
    const parseLocalDate = (dateStr: string): Date => {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
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
    const birthD = parseLocalDate(birth);
    const deathD = parseLocalDate(death);
    
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

  // Use pixel line-height to avoid mobile Safari rounding/clipping
  const getPrayerLineHeightPx = (fontPx: number) => {
    const mult = fontPx <= 8 ? 1.05 : 1.15;
    return Math.max(1, Math.round(fontPx * mult));
  };

  // Compute the maximum prayer font size that fits the available space
  // (space changes when QR/logo/header elements change)
  useLayoutEffect(() => {
    if (cardSide !== 'back') return;

    const container = prayerContainerRef.current;
    const textEl = prayerTextRef.current;
    if (!container || !textEl) return;

    let disposed = false;

    const recompute = () => {
      if (disposed) return;

      const minPx = 3;
      const maxPx = 22;

      // Compute available space inside the prayer container (clientHeight/Width includes padding)
      const cs = window.getComputedStyle(container);
      const padY = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
      const padX = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
      const availH = Math.max(0, container.clientHeight - padY);
      const availW = Math.max(0, container.clientWidth - padX);

      // Temporarily remove clipping while measuring (clipping can make scrollHeight unreliable on some browsers)
      const prev = {
        fontSize: textEl.style.fontSize,
        lineHeight: textEl.style.lineHeight,
        maxHeight: textEl.style.maxHeight,
        overflow: textEl.style.overflow,
      };

      const fits = (px: number) => {
        textEl.style.fontSize = `${px}px`;
        const lhPx = getPrayerLineHeightPx(px);
        textEl.style.lineHeight = `${lhPx}px`;
        textEl.style.maxHeight = 'none';
        textEl.style.overflow = 'visible';

        // Force layout
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        textEl.offsetHeight;

        const rect = textEl.getBoundingClientRect();

        // Safety margin to prevent bottom-line clipping (mobile Safari can round line boxes)
        // Use ~1 line of safety, scaled by current line height.
        const safety = Math.max(10, Math.round(lhPx * 0.9));
        return rect.height <= availH - safety;
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

      // Restore previous styles
      textEl.style.fontSize = prev.fontSize;
      textEl.style.lineHeight = prev.lineHeight;
      textEl.style.maxHeight = prev.maxHeight;
      textEl.style.overflow = prev.overflow;

      setAutoPrayerFontSize((prevSize) => (prevSize === best ? prevSize : best));
    };

    // Schedule twice to allow layout to settle (fonts/QR/footer can shift after first paint)
    const schedule = () => {
      requestAnimationFrame(() => requestAnimationFrame(recompute));
    };

    schedule();

    // Recompute when the container size changes (e.g., mobile viewport/keyboard changes)
    const ro = new ResizeObserver(() => schedule());
    ro.observe(container);

    // Recompute again once fonts are loaded (prevents late font-metric changes from causing clipping)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fontsReady = (document as any).fonts?.ready as Promise<void> | undefined;
    fontsReady?.then(() => {
      if (!disposed) schedule();
    });

    return () => {
      disposed = true;
      ro.disconnect();
    };
  }, [
    backText,
    prayerBold,
    prayerTextSize,
    prayerLayoutNonce,
    cardSide,
    orientation,
    showQrCode,
    qrUrl,
    showDatesOnBack,
    showNameOnBack,
    backNameSize,
    backDatesSize,
    backDatesPosition,
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
      updateFrontTextColors(true); // Photos are treated as dark backgrounds - use light text
    } else if (type === 'back') {
      setBackBgImage(previewUrl);
      void syncBackTextColors({ imageSrc: previewUrl, fallbackIsDark: true });
    } else if (type === 'logo') {
      setFuneralHomeLogo(previewUrl);
    }
    toast.success('Image uploaded!');
  };

  const handleEaselPhotosUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newPhotos: {src: string, size: EaselPhotoSize}[] = [];
    Array.from(files).forEach(file => {
      const previewUrl = URL.createObjectURL(file);
      newPhotos.push({ src: previewUrl, size: '16x20' });
    });
    
    setEaselPhotos(prev => [...prev, ...newPhotos]);
    toast.success(`${newPhotos.length} photo${newPhotos.length > 1 ? 's' : ''} added!`);
  };

  const removeEaselPhoto = (index: number) => {
    setEaselPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const currentPackage =
    (packages as Record<string, PackageConfig>)[selectedPackage] ?? Object.values(packages)[0];

  const calculatePrice = () => {
    // Paper cards: $67 for 72 cards + $0.77/additional card + $7/design for size upgrade + shipping
    if (cardType === 'paper') {
      const totalPaperCards = mainDesignQty + additionalDesigns.reduce((sum, d) => sum + d.qty, 0);
      const includedCards = currentPackage.cards; // 72 cards included
      const additionalCards = Math.max(0, totalPaperCards - includedCards);
      
      // Starter set base price ($67 for 72 cards) + additional cards at $0.77 each
      let total = currentPackage.price + Math.round(additionalCards * PAPER_PER_CARD_PRICE * 100) / 100;
      
      // Additional designs at $7 each
      if (additionalDesigns.length > 0) {
        total += additionalDesigns.length * ADDITIONAL_DESIGN_PRICE;
      }
      
      // Size upsell: $7 per design that is large size
      if (mainDesignSize === '3x4.75') {
        total += PAPER_SIZE_UPSELL;
      }
      additionalDesigns.forEach(d => {
        if (d.size === '3x4.75') {
          total += PAPER_SIZE_UPSELL;
        }
      });
      
      // Add shipping cost
      total += SHIPPING_PRICES[shippingSpeed].price;
      
      return Math.round(total);
    }

    // Metal cards: package-based pricing
    let total = currentPackage.price;

    // Extra card sets beyond package
    total += extraSets * METAL_ADDITIONAL_SET_PRICE;

    // Additional photos beyond package includes
    const includedPhotos = currentPackage.photos;
    const additionalPhotosCount = Math.max(0, easelPhotos.length - includedPhotos);
    total += additionalPhotosCount * ADDITIONAL_PHOTO_PRICE;

    // 18x24 upsell - count how many photos are upgraded
    const upgradedCount = easelPhotos.filter((p) => p.size === '18x24').length;
    total += upgradedCount * EASEL_18X24_UPSELL;

    // Premium thickness upgrade
    if (upgradeThickness && currentPackage.thickness !== 'premium') {
      const totalSets = currentPackage.cards / 55 + extraSets;
      total += PREMIUM_THICKNESS_PRICE * totalSets;
    }

    // Additional designs ($7 each for metal)
    if (additionalDesigns.length > 0) {
      total += additionalDesigns.length * ADDITIONAL_DESIGN_PRICE;
    }


    return total;
  };

  // Derived values for display
  const totalCards = currentPackage.cards + (cardType === 'metal' ? extraSets * 55 : 0);
  const includedPhotos = currentPackage.photos;
  const effectiveThickness: CardThickness =
    cardType === 'metal' && (upgradeThickness || currentPackage.thickness === 'premium')
      ? 'premium'
      : 'standard';
  const effectiveShipping = 'express'; // 48-72 hours delivery
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deceasedName.trim()) {
      toast.error('Please enter the name of the deceased');
      return;
    }
    if (!customerName.trim() || !customerEmail.trim() || !shippingStreet.trim() || 
        !shippingCity.trim() || !shippingState.trim() || !shippingZip.trim() || !shippingPhone.trim()) {
      toast.error('Please fill in all shipping information');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Generate print-ready images with bleed
      let frontCardImage = '';
      let backCardImage = '';
      
      // Capture front card
      if (frontPrintRef.current) {
        const frontCanvas = await html2canvas(frontPrintRef.current, {
          scale: 3, // High resolution for print
          useCORS: true,
          backgroundColor: '#ffffff',
        });
        frontCardImage = frontCanvas.toDataURL('image/jpeg', 0.95);
      }
      
      // Capture back card
      if (backPrintRef.current) {
        const backCanvas = await html2canvas(backPrintRef.current, {
          scale: 3,
          useCORS: true,
          backgroundColor: '#ffffff',
        });
        backCardImage = backCanvas.toDataURL('image/jpeg', 0.95);
      }

      // Send order to edge function
      const { data, error } = await supabase.functions.invoke('send-order-emails', {
        body: {
          customerEmail,
          customerName,
          shippingAddress: {
            street: shippingStreet,
            city: shippingCity,
            state: shippingState,
            zip: shippingZip,
            phone: shippingPhone,
          },
          orderDetails: {
            deceasedName,
            birthDate,
            deathDate,
            metalFinish: currentFinish.name,
            orientation,
            totalCards,
            easelPhotoCount: Math.max(includedPhotos, easelPhotos.length),
            easelPhotoSizes: easelPhotos.map(p => p.size),
            cardThickness: effectiveThickness,
            shipping: effectiveShipping,
            totalPrice: calculatePrice(),
            packageName: currentPackage.name,
            extraSets,
            prayerText: backText,
            qrUrl,
          },
          frontCardImage,
          backCardImage,
          easelPhotos, // All easel photos as base64 data URLs
        },
      });

      if (error) throw error;

      toast.success(`Order #${data.orderId} placed successfully! Check your email for confirmation.`);
      setStep(5); // Success step
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentFinish = METAL_FINISHES.find(f => f.id === metalFinish) || METAL_FINISHES[0];

  // Metal cards: 2" x 3.5" (credit card size), Paper cards: 2.5x4.25 or 3x4.75
  const getCardClass = () => {
    if (cardType === 'paper') {
      // Paper prayer cards - aspect ratio based on active design's size selection
      const activeSize = activeDesignIndex === -1 ? mainDesignSize : (additionalDesigns[activeDesignIndex]?.size || '2.5x4.25');
      return activeSize === '3x4.75' ? 'aspect-[3/4.75] w-64' : 'aspect-[2.5/4.25] w-60';
    }
    // Metal cards 2" x 3.5"
    return orientation === 'landscape' 
      ? 'aspect-[3.5/2] w-80' 
      : 'aspect-[2/3.5] w-56';
  };
  const cardClass = getCardClass();
  const cardRounding = cardType === 'paper' ? '' : 'rounded-2xl';

  return (
    <>
      {/* Card Type Selection Modal */}
      <Dialog open={showTypeModal} onOpenChange={(open) => !open && navigate('/')}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold text-center">Choose Your Card Type</DialogTitle>
            <DialogDescription className="text-center">
              Select the type of prayer cards you'd like to design
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid md:grid-cols-2 gap-6 py-6">
            {/* Paper Cards Option */}
            <button
              onClick={() => handleSelectCardType('paper')}
              className="group relative overflow-hidden rounded-xl border-2 border-border hover:border-primary transition-all p-6 text-left bg-card hover:bg-accent/50"
            >
              <div className="aspect-[4/3] mb-4 rounded-lg overflow-hidden bg-muted">
                <img 
                  src={paperCardsProduct} 
                  alt="Paper Prayer Cards" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">Paper Cards</h3>
              <p className="text-primary font-semibold mb-2">Starting at $67</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  55 Cards + Memorial Photo
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Thick glossy cardstock
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  $0.77 per additional card
                </li>
              </ul>
            </button>

            {/* Metal Cards Option */}
            <button
              onClick={() => handleSelectCardType('metal')}
              className="group relative overflow-hidden rounded-xl border-2 border-border hover:border-primary transition-all p-6 text-left bg-card hover:bg-accent/50"
            >
              <div className="absolute top-4 right-4 z-10">
                <span className="bg-secondary text-secondary-foreground text-xs font-medium px-3 py-1 rounded-full">
                  PREMIUM
                </span>
              </div>
              <div className="aspect-[4/3] mb-4 rounded-lg overflow-hidden bg-muted">
                <img 
                  src={metalCardProduct} 
                  alt="Metal Prayer Cards" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">Metal Cards</h3>
              <p className="text-primary font-semibold mb-2">Starting at $97</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  55 Cards + Memorial Photo
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Heirloom quality metal
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Premium finish options
                </li>
              </ul>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="design-page min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-amber-900/30 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="text-lg font-bold text-white">LuxuryPrayerCards.com</span>
          </Link>
          <div className="text-sm text-slate-400">
            Step {Math.min(step, 4)} of 4
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {step === 1 && `Design Your ${cardType === 'paper' ? 'Photo Prayer Card' : 'Metal Prayer Card'}${additionalDesigns.length > 0 ? 's' : ''}`}
            {step === 2 && (cardType === 'paper' ? 'Review Your Order' : 'Choose Your Package')}
            {step === 3 && 'Shipping Information'}
            {step === 4 && 'Review & Order'}
            {step === 5 && 'Order Confirmed!'}
          </h1>
          <p className="text-slate-400">
            {step === 1 && 'Customize your cards and set quantities'}
            {step === 2 && (cardType === 'paper' ? 'Confirm your card selection and options' : 'Select quantity and shipping options')}
            {step === 3 && 'Enter your shipping details'}
            {step === 4 && 'Confirm your order details'}
          </p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <form onSubmit={handleSubmitOrder}>
              {/* Step 1: Card Design */}
              {step === 1 && (
                <div className="space-y-6">
                  {/* Paper Card Size Selection - only for paper cards */}
                  {cardType === 'paper' && (
                    <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
                      <h3 className="text-lg font-semibold text-white mb-3 text-center">
                        Card Size {activeDesignIndex >= 0 ? `(Design ${activeDesignIndex + 2})` : '(Main Design)'}
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            if (activeDesignIndex === -1) {
                              setMainDesignSize('2.5x4.25');
                            } else {
                              const updated = [...additionalDesigns];
                              updated[activeDesignIndex] = { ...updated[activeDesignIndex], size: '2.5x4.25' };
                              setAdditionalDesigns(updated);
                            }
                          }}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            (activeDesignIndex === -1 ? mainDesignSize : additionalDesigns[activeDesignIndex]?.size) === '2.5x4.25'
                              ? 'border-amber-500 bg-amber-500/20'
                              : 'border-slate-600 hover:border-slate-500'
                          }`}
                        >
                          <div className="flex flex-col items-center">
                            {/* Proportional card silhouette - 2.5:4.25 ratio */}
                            <div 
                              className="border-2 border-white/60 mb-3 shadow-lg"
                              style={{ 
                                width: '40px', 
                                height: '68px',
                                backgroundImage: `url(${cloudsLightBg})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }}
                            />
                            <div className="text-xl font-bold text-white mb-1">2.5" × 4.25"</div>
                            <div className="text-slate-300 text-sm">Standard Size</div>
                            <div className="text-amber-400 font-semibold mt-2">Included</div>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (activeDesignIndex === -1) {
                              setMainDesignSize('3x4.75');
                            } else {
                              const updated = [...additionalDesigns];
                              updated[activeDesignIndex] = { ...updated[activeDesignIndex], size: '3x4.75' };
                              setAdditionalDesigns(updated);
                            }
                          }}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            (activeDesignIndex === -1 ? mainDesignSize : additionalDesigns[activeDesignIndex]?.size) === '3x4.75'
                              ? 'border-amber-500 bg-amber-500/20'
                              : 'border-slate-600 hover:border-slate-500'
                          }`}
                        >
                          <div className="flex flex-col items-center">
                            {/* Proportional card silhouette - 3:4.75 ratio (~40% larger area) */}
                            <div 
                              className="border-2 border-white/60 mb-3 shadow-lg"
                              style={{ 
                                width: '48px', 
                                height: '76px',
                                backgroundImage: `url(${cloudsLightBg})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }}
                            />
                            <div className="text-xl font-bold text-white mb-1">3" × 4.75"</div>
                            <div className="text-slate-300 text-sm">Large Size</div>
                            <div className="text-amber-400 font-semibold mt-2">+${PAPER_SIZE_UPSELL}</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Metal Card Thickness Selection - only for metal cards */}
                  {cardType === 'metal' && (
                    <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
                      <h3 className="text-lg font-semibold text-white mb-3 text-center">Choose Your Card Thickness</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setUpgradeThickness(false)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            !upgradeThickness
                              ? 'border-amber-500 bg-amber-500/20'
                              : 'border-slate-600 hover:border-slate-500'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-xl font-bold text-white mb-1">.040"</div>
                            <div className="text-slate-400 text-sm">Standard Thickness</div>
                            <div className="text-amber-400 font-semibold mt-2">Included</div>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setUpgradeThickness(true)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            upgradeThickness
                              ? 'border-amber-500 bg-amber-500/20'
                              : 'border-slate-600 hover:border-slate-500'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-xl font-bold text-white mb-1">.080"</div>
                            <div className="text-slate-400 text-sm">Premium Thickness</div>
                            <div className="text-amber-400 font-semibold mt-2">+$15/set</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Orientation Toggle - only for metal cards */}
                  {cardType === 'metal' && (
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        type="button"
                        variant={orientation === 'landscape' ? 'default' : 'outline'}
                        onClick={() => setOrientation('landscape')}
                        className={orientation === 'landscape' 
                          ? 'bg-amber-600 hover:bg-amber-700 !text-white' 
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
                          ? 'bg-amber-600 hover:bg-amber-700 !text-white' 
                          : 'border-slate-600 text-slate-300 hover:bg-slate-700'}
                      >
                        <RectangleVertical className="h-4 w-4 mr-2" />
                        Portrait
                      </Button>
                    </div>
                  )}

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
                          className={`${cardClass} ${cardRounding} overflow-hidden shadow-2xl relative`}
                        >
                          <div className={`absolute inset-0 ${cardType === 'metal' ? `bg-gradient-to-br ${currentFinish.gradient} p-1` : 'bg-white'}`}>
                            <div 
                              ref={photoContainerRef}
                              className={`w-full h-full ${cardType === 'metal' ? 'rounded-xl' : ''} overflow-hidden bg-slate-700 flex items-center justify-center touch-none relative`}
                              style={{ cursor: deceasedPhoto && !draggingText ? (isPanning ? 'grabbing' : 'grab') : 'default' }}
                              onPointerDown={handlePhotoPointerDown}
                              onPointerMove={handlePhotoPointerMove}
                              onPointerUp={handlePhotoPointerUp}
                              onPointerCancel={handlePhotoPointerUp}
                              onWheel={handlePhotoWheel}
                            >
                              {deceasedPhoto ? (
                                <>
                                  <img
                                    src={deceasedPhoto}
                                    alt="Deceased"
                                    draggable={false}
                                    className="w-full h-full object-cover pointer-events-none select-none"
                                    style={{
                                      transform: `translate(${photoPanX}px, ${photoPanY}px) scale(${photoZoom}) rotate(${photoRotation}deg)`,
                                      transformOrigin: 'center',
                                      willChange: 'transform',
                                      filter: `brightness(${photoBrightness}%)`,
                                    }}
                                  />
                                  {/* Fade overlay */}
                                  {photoFade && (
                                    <div 
                                      className="absolute inset-0 pointer-events-none"
                                      style={{
                                        background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.6) 100%)',
                                      }}
                                    />
                                  )}
                                </>
                              ) : (
                                <div className="text-center p-4">
                                  <ImageIcon className="h-12 w-12 text-slate-500 mx-auto mb-2" />
                                  <p className="text-slate-500 text-sm">Upload photo</p>
                                </div>
                              )}
                              
                              {/* Text Overlay - Name */}
                              {showNameOnFront && (() => {
                                // Calculate line count and offset Y position for multi-line names
                                const nameText = deceasedName || 'Name Here';
                                const lineCount = nameText.split('\n').length;
                                // Offset by ~3% per additional line to keep name above dates
                                const lineOffset = (lineCount - 1) * 3;
                                const adjustedY = namePosition.y - lineOffset;
                                
                                return (
                                  <div
                                    className="absolute touch-none select-none px-2 py-1 rounded"
                                    style={{
                                      left: `${namePosition.x}%`,
                                      top: `${adjustedY}%`,
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
                                      {nameText}
                                    </span>
                                  </div>
                                );
                              })()}
                              
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
                                  setPhotoRotation(0);
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
                                  setPhotoRotation(0);
                                  updateFrontTextColors(false); // No photo - reset to dark text
                                }}
                                className="border-rose-600/50 text-rose-400 hover:bg-rose-600/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>

                        {/* Photo Controls Panel */}
                        {deceasedPhoto && (
                          <div className="w-full max-w-md space-y-2 p-3 bg-slate-700/30 rounded-lg">
                            <Label className="text-white text-sm font-medium">Adjust Photo</Label>
                            <div className="flex items-center gap-3">
                              <Label className="text-slate-400 text-xs w-12">Zoom</Label>
                              <input
                                type="range"
                                min="1"
                                max="3"
                                step="0.1"
                                value={photoZoom}
                                onChange={(e) => setPhotoZoom(parseFloat(e.target.value))}
                                className="flex-1 accent-amber-600"
                              />
                              <span className="text-xs text-slate-400 min-w-[40px]">{Math.round(photoZoom * 100)}%</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Label className="text-slate-400 text-xs w-16">Left/Right</Label>
                              <input
                                type="range"
                                min="-100"
                                max="100"
                                step="1"
                                value={photoPanX}
                                onChange={(e) => setPhotoPanX(parseFloat(e.target.value))}
                                className="flex-1 accent-amber-600"
                              />
                            </div>
                            <div className="flex items-center gap-3">
                              <Label className="text-slate-400 text-xs w-16">Up/Down</Label>
                              <input
                                type="range"
                                min="-100"
                                max="100"
                                step="1"
                                value={photoPanY}
                                onChange={(e) => setPhotoPanY(parseFloat(e.target.value))}
                                className="flex-1 accent-amber-600"
                              />
                            </div>
                            <div className="flex items-center gap-3">
                              <Label className="text-slate-400 text-xs w-12">Rotate</Label>
                              <input
                                type="range"
                                min="-180"
                                max="180"
                                step="1"
                                value={photoRotation}
                                onChange={(e) => setPhotoRotation(parseFloat(e.target.value))}
                                className="flex-1 accent-amber-600"
                              />
                              <span className="text-xs text-slate-400 min-w-[40px]">{photoRotation}°</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Label className="text-slate-400 text-xs w-12">Brightness</Label>
                              <input
                                type="range"
                                min="50"
                                max="150"
                                step="5"
                                value={photoBrightness}
                                onChange={(e) => setPhotoBrightness(parseFloat(e.target.value))}
                                className="flex-1 accent-amber-600"
                              />
                              <span className="text-xs text-slate-400 min-w-[40px]">{photoBrightness}%</span>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-slate-600">
                              <Label className="text-slate-400 text-xs">Photo Fade Effect</Label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={photoFade} 
                                  onChange={(e) => setPhotoFade(e.target.checked)}
                                  className="accent-amber-600"
                                />
                                <span className="text-slate-300 text-xs">{photoFade ? 'On' : 'Off'}</span>
                              </label>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setPhotoZoom(1);
                                setPhotoPanX(0);
                                setPhotoPanY(0);
                                setPhotoRotation(0);
                                setPhotoBrightness(100);
                                setPhotoFade(false);
                              }}
                              className="border-slate-600 text-slate-300 text-xs w-full"
                            >
                              Reset All
                            </Button>
                          </div>
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
                          className={`${cardClass} ${cardRounding} shadow-2xl relative overflow-hidden`}
                        >
                          {(() => {
                            // Determine background and if it's dark
                            const currentBackMetal = METAL_BG_OPTIONS.find(m => m.id === backMetalFinish) || METAL_BG_OPTIONS[0];
                            const isBackDark = relativeLuminance(backBgSampleHex) < 0.45;
                            const textColorClass = isBackDark ? 'text-zinc-200' : 'text-zinc-700';
                            const mutedTextColorClass = isBackDark ? 'text-zinc-400' : 'text-zinc-600';
                            
                            return (
                              <div 
                                className={`absolute inset-0 ${cardRounding} overflow-hidden ${!backBgImage ? (cardType === 'metal' ? `bg-gradient-to-br ${currentBackMetal.gradient}` : 'bg-white') : ''}`}
                              >
                                {backBgImage && (
                                  <>
                                    <img 
                                      src={backBgImage}
                                      alt="Background"
                                      className="absolute w-full h-full object-cover"
                                      style={{
                                        transform: `scale(${backBgZoom}) translate(${backBgPanX}%, ${backBgPanY}%) rotate(${backBgRotation}deg)`,
                                        transformOrigin: 'center center',
                                      }}
                                    />
                                    <div className={`absolute inset-0 bg-black/20 ${cardRounding}`}></div>
                                  </>
                                )}
                                {!backBgImage && cardType === 'metal' && (
                                  <div 
                                    className={`absolute inset-0 opacity-20 ${cardRounding}`}
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
                                            onLoad={() => setPrayerLayoutNonce((n) => n + 1)}
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
                                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                                      }}
                                    >
                                      {inLovingMemoryText}
                                    </p>
                                  )}
                                  {showNameOnBack && (
                                    <p 
                                      className="mb-0.5 whitespace-pre text-center"
                                      style={{ 
                                        fontSize: `${backNameSize}px`,
                                        color: backNameColor,
                                        fontWeight: backNameBold ? 'bold' : 'normal',
                                        fontFamily: backNameFont,
                                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                                      }}
                                    >
                                      {deceasedName || 'Name Here'}
                                    </p>
                                  )}
                                  
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
                                        fontWeight: datesBold ? 'bold' : 'normal',
                                        whiteSpace: 'nowrap',
                                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                                      }}>
                                        {formatDates(birthDate, deathDate, backDateFormat)}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Prayer - takes remaining space, vertically centered */}
                                <div
                                  ref={prayerContainerRef}
                                  className="flex-1 flex items-center justify-center py-1 px-1 overflow-hidden min-h-0"
                                >
                                  <p 
                                    ref={prayerTextRef}
                                    className="font-serif italic whitespace-pre-line text-center w-full"
                                    style={{
                                      color: prayerColor,
                                      fontSize: `${(
                                        prayerTextSize === 'auto'
                                          ? autoPrayerFontSize
                                          : Math.min(prayerTextSize, autoPrayerFontSize)
                                      )}px`,
                                      lineHeight: `${getPrayerLineHeightPx(
                                        prayerTextSize === 'auto'
                                          ? autoPrayerFontSize
                                          : Math.min(prayerTextSize, autoPrayerFontSize)
                                      )}px`,
                                      textWrap: 'pretty',
                                      overflowWrap: 'break-word',
                                      fontWeight: prayerBold ? 'bold' : 'normal',
                                      paddingBottom: '2px',
                                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                                    }}
                                  >
                                    {preventOrphans(backText)}
                                  </p>
                                </div>

                                {/* Footer Section - Logo and/or QR Code */}
                                <div className="shrink-0 flex flex-col items-center">
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
                                      <p className={`text-[6px] mt-0.5 ${mutedTextColorClass}`}>
                                        Scan to visit
                                      </p>
                                    </div>
                                  )}

                                  {/* Funeral Home Logo - Bottom */}
                                  {funeralHomeLogo && funeralHomeLogoPosition === 'bottom' && (
                                    <div className="flex justify-center mt-1">
                                      <img 
                                        src={funeralHomeLogo} 
                                        alt="Funeral Home Logo" 
                                        className="object-contain"
                                        style={{ height: `${funeralHomeLogoSize}px`, maxWidth: '70%' }}
                                        onLoad={() => setPrayerLayoutNonce((n) => n + 1)}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                            );
                          })()}
                        </div>

                        {/* Name on Back Controls */}
                        <div className="w-full max-w-md space-y-3 p-3 bg-slate-700/30 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <Label className="text-white text-sm font-medium">Name on Back</Label>
                              {showNameOnBack && (
                                <span className="text-xs text-primary truncate max-w-[180px]" style={{ fontFamily: backNameFont }}>
                                  {deceasedName || 'Name Here'}
                                </span>
                              )}
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={showNameOnBack} 
                                onChange={(e) => setShowNameOnBack(e.target.checked)}
                                className="accent-amber-600"
                              />
                              <span className="text-slate-400 text-xs">Show</span>
                            </label>
                          </div>
                          {showNameOnBack && (
                            <>
                              <Select value={backNameFont} onValueChange={setBackNameFont}>
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
                              <div className="flex items-center gap-3 flex-wrap">
                                <div className="flex items-center gap-2">
                                  <Label className="text-slate-400 text-xs">Color</Label>
                                  <input
                                    type="color"
                                    value={backNameColor}
                                    onChange={(e) => setBackNameColor(e.target.value)}
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
                                    onClick={() => setBackNameSize(Math.max(8, backNameSize - 2))}
                                  >
                                    <span className="text-xs">−</span>
                                  </Button>
                                  <span className="text-xs text-white bg-slate-700 px-2 py-1 rounded min-w-[40px] text-center">
                                    {backNameSize}px
                                  </span>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6 border-slate-600"
                                    onClick={() => setBackNameSize(Math.min(36, backNameSize + 2))}
                                  >
                                    <span className="text-xs">+</span>
                                  </Button>
                                </div>
                                <Button
                                  type="button"
                                  variant={backNameBold ? 'default' : 'outline'}
                                  size="sm"
                                  className={`h-7 px-3 text-xs font-bold ${backNameBold ? 'bg-amber-600 !text-white' : 'border-slate-600 text-slate-300'}`}
                                  onClick={() => setBackNameBold(!backNameBold)}
                                >
                                  B
                                </Button>
                              </div>
                            </>
                          )}
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
                                    className={`h-6 px-2 text-xs ${backDatesSize === 'auto' ? 'bg-amber-600 !text-white border-amber-600' : 'border-slate-600 text-slate-300'}`}
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
                                    className={`h-7 px-3 text-xs ${backDatesAlign === 'left' ? 'bg-amber-600 !text-white' : 'border-slate-600 text-slate-300'}`}
                                    onClick={() => { setBackDatesAlign('left'); setBackDatesPosition(prev => ({ ...prev, x: 15 })); }}
                                  >
                                    Left
                                  </Button>
                                  <Button
                                    type="button"
                                    variant={backDatesAlign === 'center' ? 'default' : 'outline'}
                                    size="sm"
                                    className={`h-7 px-3 text-xs ${backDatesAlign === 'center' ? 'bg-amber-600 !text-white' : 'border-slate-600 text-slate-300'}`}
                                    onClick={() => { setBackDatesAlign('center'); setBackDatesPosition(prev => ({ ...prev, x: 50 })); }}
                                  >
                                    Center
                                  </Button>
                                  <Button
                                    type="button"
                                    variant={backDatesAlign === 'right' ? 'default' : 'outline'}
                                    size="sm"
                                    className={`h-7 px-3 text-xs ${backDatesAlign === 'right' ? 'bg-amber-600 !text-white' : 'border-slate-600 text-slate-300'}`}
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
                        {/* Metal Finish Options - Only for metal cards */}
                        {cardType === 'metal' && (
                          <div className="w-full max-w-md">
                            <Label className="text-slate-400 text-xs mb-2 block">Metal Finish</Label>
                            <div className="flex gap-2 flex-wrap">
                              {METAL_BG_OPTIONS.map((metal) => (
                                <button
                                  key={metal.id}
                                  type="button"
                                  onClick={() => {
                                    setBackBgImage(null);
                                    setBackMetalFinish(metal.id);
                                    setBackBgZoom(1);
                                    setBackBgPanX(0);
                                    setBackBgPanY(0);
                                    setBackBgRotation(0);
                                    applyBackTextPalette(METAL_SAMPLE_HEX[metal.id] ?? '#ffffff', metal.isDark);
                                  }}
                                  className={`w-12 h-16 rounded-lg overflow-hidden border-2 transition-all bg-gradient-to-br ${metal.gradient} ${
                                    !backBgImage && backMetalFinish === metal.id ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-slate-600 hover:border-slate-500'
                                  }`}
                                  title={metal.name}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Preset Image Backgrounds */}
                        <div className="w-full max-w-md">
                          <Label className="text-slate-400 text-xs mb-2 block">Image Backgrounds</Label>
                          <div className="flex gap-2 flex-wrap">
                            {PRESET_BACKGROUNDS.map((bg) => (
                              <button
                                key={bg.id}
                                type="button"
                                onClick={() => {
                                  setBackBgImage(bg.src);
                                  setBackBgZoom(1);
                                  setBackBgPanX(0);
                                  setBackBgPanY(0);
                                  setBackBgRotation(0);
                                  void syncBackTextColors({ imageSrc: bg.src, fallbackIsDark: bg.isDark });
                                }}
                                className={`w-12 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                  backBgImage === bg.src ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-slate-600 hover:border-slate-500'
                                }`}
                                title={bg.name}
                              >
                                <img src={bg.src} alt={bg.name} className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => backInputRef.current?.click()}
                            className="border-amber-600/50 text-amber-400 hover:bg-amber-600/20"
                          >
                            <ImageIcon className="h-4 w-4 mr-2" />
                            {backBgImage ? 'Change Background' : 'Upload Background'}
                          </Button>
                          {backBgImage && cardType === 'metal' && (
                            <>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setBackBgImage(null);
                                  setBackBgZoom(1);
                                  setBackBgPanX(0);
                                  setBackBgPanY(0);
                                  setBackBgRotation(0);
                                  // Reset to current metal finish colors
                                  const currentMetal = METAL_BG_OPTIONS.find(m => m.id === backMetalFinish);
                                  applyBackTextPalette(METAL_SAMPLE_HEX[backMetalFinish] ?? '#ffffff', currentMetal?.isDark ?? false);
                                }}
                                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                              >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Use Metal
                              </Button>
                            </>
                          )}
                          {backBgImage && cardType === 'paper' && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setBackBgImage(null);
                                setBackBgZoom(1);
                                setBackBgPanX(0);
                                setBackBgPanY(0);
                                setBackBgRotation(0);
                                applyBackTextPalette('#ffffff', false); // Paper default is light
                              }}
                              className="border-slate-600 text-slate-300 hover:bg-slate-700"
                            >
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Plain White
                            </Button>
                          )}
                        </div>

                        {/* Zoom/Pan/Rotate Controls for Back Background */}
                        {backBgImage && (
                          <div className="w-full max-w-md space-y-2 p-3 bg-slate-700/30 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Label className="text-slate-400 text-xs w-12">Zoom</Label>
                              <input
                                type="range"
                                min="1"
                                max="3"
                                step="0.1"
                                value={backBgZoom}
                                onChange={(e) => setBackBgZoom(parseFloat(e.target.value))}
                                className="flex-1 accent-amber-600"
                              />
                              <span className="text-xs text-slate-400 min-w-[40px]">{Math.round(backBgZoom * 100)}%</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Label className="text-slate-400 text-xs w-16">Left/Right</Label>
                              <input
                                type="range"
                                min="-50"
                                max="50"
                                step="1"
                                value={backBgPanX}
                                onChange={(e) => setBackBgPanX(parseFloat(e.target.value))}
                                className="flex-1 accent-amber-600"
                              />
                            </div>
                            <div className="flex items-center gap-3">
                              <Label className="text-slate-400 text-xs w-16">Up/Down</Label>
                              <input
                                type="range"
                                min="-50"
                                max="50"
                                step="1"
                                value={backBgPanY}
                                onChange={(e) => setBackBgPanY(parseFloat(e.target.value))}
                                className="flex-1 accent-amber-600"
                              />
                            </div>
                            <div className="flex items-center gap-3">
                              <Label className="text-slate-400 text-xs w-12">Rotate</Label>
                              <input
                                type="range"
                                min="-180"
                                max="180"
                                step="1"
                                value={backBgRotation}
                                onChange={(e) => setBackBgRotation(parseFloat(e.target.value))}
                                className="flex-1 accent-amber-600"
                              />
                              <span className="text-xs text-slate-400 min-w-[40px]">{backBgRotation}°</span>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setBackBgZoom(1);
                                setBackBgPanX(0);
                                setBackBgPanY(0);
                                setBackBgRotation(0);
                              }}
                              className="border-slate-600 text-slate-300 text-xs w-full"
                            >
                              Reset Position
                            </Button>
                          </div>
                        )}

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
                                ? 'bg-amber-600 !text-white' 
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
                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setPrayerTextSize('auto')}
                                className={`text-xs px-2 py-1 h-7 ${prayerTextSize === 'auto' ? 'bg-amber-600 !text-white border-amber-600' : 'border-slate-600 text-slate-300'}`}
                              >
                                Auto
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const current =
                                    prayerTextSize === 'auto'
                                      ? autoPrayerFontSize
                                      : Math.min(prayerTextSize, autoPrayerFontSize);
                                  const newSize = Math.max(3, current - 1);
                                  setPrayerTextSize(newSize);
                                }}
                                className="h-7 w-7 p-0 border-slate-600 text-slate-300 hover:bg-slate-700"
                              >
                                −
                              </Button>
                              <span className="text-slate-300 text-xs w-8 text-center">
                                {(prayerTextSize === 'auto'
                                  ? autoPrayerFontSize
                                  : Math.min(prayerTextSize, autoPrayerFontSize))}px
                              </span>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const current =
                                    prayerTextSize === 'auto'
                                      ? autoPrayerFontSize
                                      : Math.min(prayerTextSize, autoPrayerFontSize);
                                  const maxAllowed = autoPrayerFontSize; // Can't exceed what fits
                                  const newSize = Math.min(maxAllowed, current + 1);
                                  setPrayerTextSize(newSize);
                                }}
                                className="h-7 w-7 p-0 border-slate-600 text-slate-300 hover:bg-slate-700"
                              >
                                +
                              </Button>
                              <Button
                                type="button"
                                variant={prayerBold ? 'default' : 'outline'}
                                size="sm"
                                className={`h-7 px-3 text-xs font-bold ${prayerBold ? 'bg-amber-600 !text-white' : 'border-slate-600 text-slate-300'}`}
                                onClick={() => setPrayerBold(!prayerBold)}
                              >
                                B
                              </Button>
                              <div className="flex items-center gap-1 ml-2">
                                <Label className="text-slate-400 text-xs">Color:</Label>
                                <input
                                  type="color"
                                  value={prayerColor}
                                  onChange={(e) => setPrayerColor(e.target.value)}
                                  className="w-7 h-7 rounded border border-slate-600 cursor-pointer bg-transparent"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setPrayerColor('#ffffff')}
                                  className={`h-7 px-2 text-xs ${prayerColor === '#ffffff' ? 'bg-white text-black border-amber-500' : 'border-slate-600 text-slate-300'}`}
                                >
                                  White
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setPrayerColor('#000000')}
                                  className={`h-7 px-2 text-xs ${prayerColor === '#000000' ? 'bg-black text-white border-amber-500' : 'border-slate-600 text-slate-300'}`}
                                >
                                  Black
                                </Button>
                              </div>
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

                  {/* Main Design Quantity - Paper cards */}
                  {cardType === 'paper' && (
                    <div className="space-y-4">
                      {/* Main Design with Quantity */}
                      <div 
                        className={`rounded-xl p-5 border cursor-pointer transition-all ${
                          activeDesignIndex === -1 
                            ? 'bg-gradient-to-br from-amber-900/20 to-slate-800/50 border-amber-500/50' 
                            : 'bg-slate-800/50 border-slate-600 hover:border-slate-500'
                        }`}
                        onClick={() => {
                          setActiveDesignIndex(-1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        <div className="flex flex-wrap items-center gap-4">
                          {/* Thumbnails - Front & Back */}
                          <div className="flex gap-1 flex-shrink-0">
                            {/* Front Thumbnail */}
                            <div className="w-14 h-20 bg-slate-700 rounded-lg overflow-hidden shadow-lg relative">
                              {deceasedPhoto ? (
                                <img 
                                  src={deceasedPhoto} 
                                  alt="Main design front" 
                                  className="w-full h-full object-cover"
                                  style={{
                                    transform: `translate(${photoPanX * 0.1}px, ${photoPanY * 0.1}px) scale(${photoZoom})`,
                                    filter: `brightness(${photoBrightness}%)`,
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-700">
                                  <ImageIcon className="h-5 w-5 text-slate-400" />
                                </div>
                              )}
                              <span className="absolute bottom-0.5 left-0.5 text-[8px] bg-black/50 text-white px-1 rounded">F</span>
                            </div>
                            {/* Back Thumbnail */}
                            <div 
                              className="w-14 h-20 bg-slate-700 rounded-lg overflow-hidden shadow-lg relative"
                              style={{
                                backgroundImage: backBgImage ? `url(${backBgImage})` : undefined,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundColor: !backBgImage ? (backMetalFinish === 'white' ? '#f8f8f8' : backMetalFinish === 'gold' ? '#d4af37' : backMetalFinish === 'silver' ? '#c0c0c0' : '#18181b') : undefined,
                              }}
                            >
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-1">
                                <span className="text-[6px] text-white text-center leading-tight line-clamp-4">{backText.slice(0, 60)}...</span>
                              </div>
                              <span className="absolute bottom-0.5 left-0.5 text-[8px] bg-black/50 text-white px-1 rounded">B</span>
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-white font-semibold">Design 1</span>
                              <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">Primary</span>
                              {activeDesignIndex === -1 && (
                                <span className="text-xs bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded">Editing</span>
                              )}
                            </div>
                            <p className="text-slate-400 text-sm">{deceasedName || 'Your Design'}</p>
                            {activeDesignIndex !== -1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveDesignIndex(-1);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="border-amber-600/50 text-amber-400 hover:bg-amber-600/20 text-xs h-7 mt-2"
                              >
                                Edit Design
                              </Button>
                            )}
                          </div>
                          
                          <div className="ml-auto flex flex-col items-end gap-1 flex-shrink-0">
                            <Label className="text-slate-400 text-xs">How many?</Label>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMainDesignQty(Math.max(1, mainDesignQty - 12));
                                }}
                                className="h-8 w-8 border-slate-600 text-slate-300"
                              >
                                −
                              </Button>
                              <input
                                type="number"
                                min="1"
                                value={mainDesignQty}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => setMainDesignQty(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-20 h-8 px-2 text-center text-base sm:text-lg leading-none font-bold tabular-nums bg-slate-800 border border-amber-500/50 rounded text-white appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMainDesignQty(mainDesignQty + 12);
                                }}
                                className="h-8 w-8 border-slate-600 text-slate-300"
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Additional Designs - Inline */}
                      {additionalDesigns.map((design, idx) => (
                        <div 
                          key={idx} 
                          className={`rounded-xl p-5 border cursor-pointer transition-all ${
                            activeDesignIndex === idx 
                              ? 'bg-gradient-to-br from-amber-900/20 to-slate-800/50 border-amber-500/50' 
                              : 'bg-slate-800/50 border-slate-600 hover:border-slate-500'
                          }`}
                          onClick={() => {
                            setActiveDesignIndex(idx);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          <div className="flex flex-wrap items-center gap-4">
                            {/* Thumbnails - Front & Back */}
                            <div className="flex gap-1 flex-shrink-0">
                              {/* Front Thumbnail */}
                              <div className="w-14 h-20 bg-slate-700 rounded-lg overflow-hidden shadow-lg relative">
                                {design.photo ? (
                                  <img 
                                    src={design.photo} 
                                    alt={`Design ${idx + 2} front`} 
                                    className="w-full h-full object-cover"
                                    style={{
                                      transform: `scale(${design.photoZoom})`,
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-700">
                                    <ImageIcon className="h-5 w-5 text-slate-400" />
                                  </div>
                                )}
                                <span className="absolute bottom-0.5 left-0.5 text-[8px] bg-black/50 text-white px-1 rounded">F</span>
                              </div>
                              {/* Back Thumbnail */}
                              <div 
                                className="w-14 h-20 bg-slate-700 rounded-lg overflow-hidden shadow-lg relative"
                                style={{
                                  backgroundImage: design.backgroundId 
                                    ? `url(${PRESET_BACKGROUNDS.find(b => b.id === design.backgroundId)?.src || ''})` 
                                    : design.customBackground 
                                      ? `url(${design.customBackground})` 
                                      : undefined,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  backgroundColor: !design.backgroundId && !design.customBackground ? '#f8f8f8' : undefined,
                                }}
                              >
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-1">
                                  <span className="text-[6px] text-white text-center leading-tight line-clamp-4">{design.prayerText.slice(0, 60)}...</span>
                                </div>
                                <span className="absolute bottom-0.5 left-0.5 text-[8px] bg-black/50 text-white px-1 rounded">B</span>
                              </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-white font-semibold">Design {idx + 2}</span>
                                {design.photo && (
                                  <span className="text-xs text-green-400 bg-green-500/20 px-1.5 py-0.5 rounded">Photo ✓</span>
                                )}
                                <span className="text-xs text-amber-400">+${ADDITIONAL_DESIGN_PRICE}</span>
                                {activeDesignIndex === idx && (
                                  <span className="text-xs bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded">Editing</span>
                                )}
                              </div>
                              <p className="text-slate-400 text-sm truncate mb-2">{design.prayerText.slice(0, 30)}...</p>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveDesignIndex(idx);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className="border-amber-600/50 text-amber-400 hover:bg-amber-600/20 text-xs h-7"
                                >
                                  Edit Design
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setAdditionalDesigns(additionalDesigns.filter((_, i) => i !== idx));
                                    if (activeDesignIndex === idx) {
                                      setActiveDesignIndex(-1);
                                    } else if (activeDesignIndex > idx) {
                                      setActiveDesignIndex(activeDesignIndex - 1);
                                    }
                                  }}
                                  className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 text-xs h-7"
                                >
                                  <Trash2 className="h-3 w-3 mr-1" /> Remove
                                </Button>
                              </div>
                            </div>
                            
                            <div className="ml-auto flex flex-col items-end gap-1 flex-shrink-0">
                              <Label className="text-slate-400 text-xs">How many?</Label>
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const newDesigns = [...additionalDesigns];
                                    newDesigns[idx].qty = Math.max(1, design.qty - 12);
                                    setAdditionalDesigns(newDesigns);
                                  }}
                                  className="h-8 w-8 border-slate-600 text-slate-300"
                                >
                                  −
                                </Button>
                                <input
                                  type="number"
                                  min="1"
                                  value={design.qty}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => {
                                    const newDesigns = [...additionalDesigns];
                                    newDesigns[idx].qty = Math.max(1, parseInt(e.target.value) || 1);
                                    setAdditionalDesigns(newDesigns);
                                  }}
                                  className="w-20 h-8 px-2 text-center text-base sm:text-lg leading-none font-bold tabular-nums bg-slate-800 border border-slate-500 rounded text-white appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const newDesigns = [...additionalDesigns];
                                    newDesigns[idx].qty = design.qty + 12;
                                    setAdditionalDesigns(newDesigns);
                                  }}
                                  className="h-8 w-8 border-slate-600 text-slate-300"
                                >
                                  +
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add Another Design Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const newDesign = createEmptyDesign();
                          setAdditionalDesigns([...additionalDesigns, newDesign]);
                          setActiveDesignIndex(additionalDesigns.length);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full p-4 border-2 border-dashed border-slate-600 hover:border-amber-500/50 rounded-xl transition-all group"
                      >
                        <div className="flex items-center justify-center gap-3 text-slate-400 group-hover:text-amber-400">
                          <Sparkles className="h-5 w-5" />
                          <span className="font-medium">+ Add Another Design</span>
                        </div>
                        <p className="text-slate-500 text-sm mt-1">Different photo, prayer, or background</p>
                      </button>

                      {/* Total Summary */}
                      {(additionalDesigns.length > 0 || mainDesignQty > 0) && (
                        <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-slate-300 text-sm">Total Cards</p>
                              <p className="text-white font-medium">{1 + additionalDesigns.length} design{additionalDesigns.length > 0 ? 's' : ''}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-3xl font-bold text-amber-400">
                                {mainDesignQty + additionalDesigns.reduce((sum, d) => sum + d.qty, 0)}
                              </p>
                              <p className="text-slate-400 text-xs">cards total</p>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-amber-500/20">
                            <p className="text-slate-400 text-sm">
                              ${PAPER_PER_CARD_PRICE.toFixed(2)}/card
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <Button 
                    type="button" 
                    onClick={() => {
                      if (!deceasedName.trim()) {
                        toast.error('Please enter the name for the card');
                        return;
                      }
                      setStep(2);
                    }} 
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                  >
                    Continue <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}


              {/* Step 2: Package Selection (Metal) / Order Summary (Paper) */}
              {step === 2 && (
                <div className="space-y-6">
                  {/* Paper Cards: Simple Order Summary */}
                  {cardType === 'paper' ? (
                    <>
                      {/* Order Summary for Paper */}
                      <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-600">
                        <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                          <Package className="h-5 w-5 text-amber-400" />
                          Starter Bundle
                        </h3>
                        
                        {/* Retail Value Display */}
                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-600">
                          <span className="text-slate-400 line-through text-lg">$125</span>
                          <span className="text-2xl font-bold text-white">$67</span>
                          <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">Save $58</span>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-slate-600">
                            <span className="text-slate-300">Photo Prayer Cards</span>
                            <span className="text-white font-medium">
                              {mainDesignQty + additionalDesigns.reduce((sum, d) => sum + d.qty, 0)} cards
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b border-slate-600">
                            <span className="text-slate-300">Memorial Easel Photo</span>
                            <span className="text-white font-medium">1 included</span>
                          </div>
                          
                          {additionalDesigns.length > 0 && (
                            <div className="flex justify-between items-center py-2 border-b border-slate-600">
                              <span className="text-slate-300">Designs</span>
                              <span className="text-white font-medium">{1 + additionalDesigns.length} different designs</span>
                            </div>
                          )}
                          
                          <div className="flex justify-between items-center py-2 border-b border-slate-600">
                            <span className="text-slate-300">Card Sizes</span>
                            <span className="text-white font-medium text-sm">
                              {mainDesignSize === '3x4.75' ? 'Main: Large' : 'Main: Standard'}
                              {additionalDesigns.length > 0 && `, +${additionalDesigns.filter(d => d.size === '3x4.75').length} large`}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center py-2">
                            <span className="text-slate-300">Shipping</span>
                            <span className="text-white font-medium">Delivered in 48-72 hours</span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Metal Cards: Package Selection */
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                        <Package className="h-5 w-5 text-amber-400" />
                        Choose Your Package
                      </h3>
                      
                      <div className="grid grid-cols-1 gap-4">
                        {Object.entries(packages).map(([id, pkg]) => {
                          const showCompare = pkg.comparePrice > pkg.price;
                          return (
                            <button
                              key={id}
                              type="button"
                              onClick={() => setSelectedPackage(id as PackageId)}
                              className={`relative p-5 rounded-xl border-2 transition-all text-left ${
                                selectedPackage === (id as PackageId)
                                  ? 'border-amber-500 bg-gradient-to-br from-amber-600/20 to-amber-900/10'
                                  : 'border-slate-600 hover:border-amber-500/50'
                              }`}
                            >
                              {pkg.popular && (
                                <div className="absolute -top-3 left-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                  MOST POPULAR
                                </div>
                              )}

                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h4 className="text-xl font-bold text-white">{pkg.name}</h4>
                                    {pkg.badge === 'BEST VALUE' && (
                                      <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">BEST VALUE</span>
                                    )}
                                  </div>
                                  <p className="text-slate-400 text-sm mb-3">{pkg.description}</p>
                                  <ul className="space-y-1.5 text-sm">
                                    <li className="flex items-center gap-2 text-slate-300">
                                      <span className="text-amber-400">✓</span>
                                      {pkg.cards} Premium Metal Cards
                                      {pkg.thickness === 'premium' && (
                                        <span className="text-amber-400 text-xs">(Premium .080\")</span>
                                      )}
                                    </li>
                                    <li className="flex items-center gap-2 text-slate-300">
                                      <span className="text-amber-400">✓</span>
                                      {pkg.shipping}
                                      {pkg.shipping === 'Overnight' && <span className="text-rose-400 text-xs ml-1">⚡</span>}
                                    </li>
                                  </ul>
                                </div>

                                <div className="text-right">
                                  <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold text-white">${pkg.price}</span>
                                  </div>
                                  {showCompare && (
                                    <>
                                      <span className="text-slate-500 line-through text-sm">${pkg.comparePrice}</span>
                                      <p className="text-amber-400 text-xs font-medium">Save ${pkg.comparePrice - pkg.price}</p>
                                    </>
                                  )}
                                </div>
                              </div>

                              {selectedPackage === (id as PackageId) && (
                                <div className="absolute top-4 right-4 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm">✓</span>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Add-ons */}
                  <div className="space-y-4">
                    <Label className="text-slate-400 block text-sm">Customize (Optional)</Label>
                    
                    {/* Additional Card Sets (metal only) */}
                    {cardType === 'metal' && (
                      <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Extra Card Sets (+55 each)</p>
                          <p className="text-slate-400 text-sm">${METAL_ADDITIONAL_SET_PRICE} per set</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setExtraSets(Math.max(0, extraSets - 1))}
                            className="h-8 w-8 border-slate-600"
                          >
                            −
                          </Button>
                          <span className="text-white w-8 text-center">{extraSets}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setExtraSets(extraSets + 1)}
                            className="h-8 w-8 border-slate-600"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Additional Photos beyond package */}
                    {easelPhotos.length > currentPackage.photos && (
                      <div className="p-4 bg-slate-700/30 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">Extra Easel Photos</p>
                            <p className="text-slate-400 text-sm">${ADDITIONAL_PHOTO_PRICE} each (beyond {currentPackage.photos} included)</p>
                          </div>
                          <div className="text-right">
                            <span className="text-white font-medium">{easelPhotos.length - currentPackage.photos} extra</span>
                            <p className="text-amber-400 text-sm">+${(easelPhotos.length - currentPackage.photos) * ADDITIONAL_PHOTO_PRICE}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Premium Thickness Upgrade (metal only, only if package doesn't include it) */}
                    {cardType === 'metal' && currentPackage.thickness !== 'premium' && (
                      <div 
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          upgradeThickness 
                            ? 'bg-amber-900/30 border-amber-500' 
                            : 'bg-slate-700/30 border-transparent hover:border-slate-500'
                        }`}
                        onClick={() => setUpgradeThickness(!upgradeThickness)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              id="upgradeThickness"
                              checked={upgradeThickness}
                              onChange={(e) => setUpgradeThickness(e.target.checked)}
                              className="accent-amber-600 w-5 h-5 mt-1"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div>
                              <p className="text-white font-medium">Upgrade to Premium Thickness</p>
                              <p className="text-slate-400 text-sm mb-3">Heirloom quality that lasts generations</p>
                              
                              {/* Visual comparison */}
                              <div className="flex items-end gap-6 mt-2">
                                <div className="flex flex-col items-center">
                                  <div className="w-14 h-1 bg-slate-500 rounded-sm shadow-md" />
                                  <span className="text-xs text-slate-500 mt-1.5">Standard</span>
                                  <span className="text-[10px] text-slate-600">.040\"</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <div className="w-14 h-2.5 bg-gradient-to-b from-amber-400 to-amber-600 rounded-sm shadow-lg" />
                                  <span className="text-xs text-amber-400 mt-1.5 font-medium">Premium</span>
                                  <span className="text-[10px] text-amber-500">.080\"</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <span className="text-amber-400 font-bold text-lg">+${PREMIUM_THICKNESS_PRICE * ((currentPackage.cards / 55) + extraSets)}</span>
                        </div>
                      </div>
                    )}

                    {/* Paper Card Size info - size is now per-design in step 2 */}
                    {cardType === 'paper' && (
                      <div className="p-4 rounded-lg bg-slate-700/30 border border-slate-600">
                        <div className="flex items-start gap-3">
                          <div>
                            <p className="text-white font-medium">Card Size Options</p>
                            <p className="text-slate-400 text-sm">Each design can have its own size (+${PAPER_SIZE_UPSELL} for large)</p>
                            <div className="flex items-end gap-4 mt-2">
                              <div className="flex flex-col items-center">
                                <div className="w-10 h-14 border border-slate-500 rounded-sm" />
                                <span className="text-xs text-slate-500 mt-1">2.5×4.25</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <div className="w-12 h-16 border-2 border-amber-500 rounded-sm bg-amber-500/10" />
                                <span className="text-xs text-amber-400 mt-1 font-medium">3×4.75</span>
                              </div>
                            </div>
                            <p className="text-amber-400 text-sm mt-2">
                              Large designs: {(mainDesignSize === '3x4.75' ? 1 : 0) + additionalDesigns.filter(d => d.size === '3x4.75').length}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Border Design Selection (paper only) */}
                    {cardType === 'paper' && (
                      <div className="space-y-3">
                        <Label className="text-slate-400 block text-sm">Border Design</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {BORDER_DESIGNS.map((border) => (
                            <button
                              key={border.id}
                              type="button"
                              onClick={() => setBorderDesign(border.id)}
                              className={`p-3 rounded-lg border-2 transition-all text-center ${
                                borderDesign === border.id
                                  ? 'border-amber-500 bg-amber-900/20'
                                  : 'border-slate-600 hover:border-slate-500'
                              }`}
                            >
                              <div className={`w-full aspect-[3/4] rounded mb-2 bg-slate-700 ${border.preview}`} />
                              <span className="text-xs text-slate-300">{border.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Shipping Speed Selection */}
                    <div className="space-y-3">
                      <Label className="text-slate-400 block text-sm">Shipping Speed</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {(Object.entries(SHIPPING_PRICES) as [ShippingSpeed, { price: number; label: string }][]).map(([speed, info]) => (
                          <button
                            key={speed}
                            type="button"
                            onClick={() => setShippingSpeed(speed)}
                            className={`p-4 rounded-lg border-2 transition-all text-left ${
                              shippingSpeed === speed
                                ? 'border-amber-500 bg-amber-900/20'
                                : 'border-slate-600 hover:border-slate-500'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-white font-medium">{info.label}</p>
                                <p className="text-slate-400 text-sm">
                                  {speed === '48hour' ? 'Rush delivery' : 'Standard delivery'}
                                </p>
                              </div>
                              <span className="text-amber-400 font-bold">${info.price}</span>
                            </div>
                            {shippingSpeed === speed && (
                              <div className="absolute top-2 right-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Price Summary */}
                  <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-slate-300 text-sm">Your Order</p>
                        <p className="text-white font-medium">
                          {cardType === 'paper' 
                            ? `${mainDesignQty + additionalDesigns.reduce((sum, d) => sum + d.qty, 0)} Photo Prayer Cards`
                            : `${currentPackage.name} Package + Add-ons`
                          }
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-amber-400">${calculatePrice()}</p>
                    </div>
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
                        // Store card data in sessionStorage for memorial photo editor
                        sessionStorage.setItem('memorialPhotoData', JSON.stringify({
                          deceasedName,
                          birthDate,
                          deathDate,
                          deceasedPhoto,
                          funeralHomeLogo,
                        }));
                        // Navigate to memorial photo editor with package info
                        const params = new URLSearchParams({
                          package: selectedPackage,
                          photos: String(currentPackage.photos),
                        });
                        window.location.href = `/memorial-photo?${params.toString()}`;
                      }} 
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                    >
                      Continue to Memorial Photos <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Shipping Information */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-5 w-5 text-amber-400" />
                    <Label className="text-white font-semibold text-lg">Shipping Address</Label>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-400">Full Name *</Label>
                        <Input
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="John Smith"
                          className="bg-slate-700 border-slate-600 text-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-400">Email *</Label>
                        <Input
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="john@example.com"
                          className="bg-slate-700 border-slate-600 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-400">Street Address *</Label>
                      <Input
                        value={shippingStreet}
                        onChange={(e) => setShippingStreet(e.target.value)}
                        placeholder="123 Main Street, Apt 4B"
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2 col-span-2 md:col-span-2">
                        <Label className="text-slate-400">City *</Label>
                        <Input
                          value={shippingCity}
                          onChange={(e) => setShippingCity(e.target.value)}
                          placeholder="New York"
                          className="bg-slate-700 border-slate-600 text-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-400">State *</Label>
                        <Input
                          value={shippingState}
                          onChange={(e) => setShippingState(e.target.value)}
                          placeholder="NY"
                          className="bg-slate-700 border-slate-600 text-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-400">ZIP *</Label>
                        <Input
                          value={shippingZip}
                          onChange={(e) => setShippingZip(e.target.value)}
                          placeholder="10001"
                          className="bg-slate-700 border-slate-600 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-400">Phone Number *</Label>
                      <Input
                        type="tel"
                        value={shippingPhone}
                        onChange={(e) => setShippingPhone(e.target.value)}
                        placeholder="(555) 123-4567"
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep(2)}
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => {
                        if (!customerName.trim() || !customerEmail.trim() || !shippingStreet.trim() || 
                            !shippingCity.trim() || !shippingState.trim() || !shippingZip.trim() || !shippingPhone.trim()) {
                          toast.error('Please fill in all shipping fields');
                          return;
                        }
                        setStep(4);
                      }} 
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                    >
                      Review Order <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Review & Order */}
              {step === 4 && (
                <div className="space-y-6">
                  {/* Order Summary */}
                  <div className="bg-slate-700/30 rounded-lg p-6 space-y-4">
                    <h4 className="text-white font-semibold text-lg mb-4">Order Summary</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-300">{currentPackage.name} Package ({currentPackage.cards} cards + {currentPackage.photos} photos)</span>
                        <span className="text-white">${currentPackage.price}</span>
                      </div>
                      
                      {cardType === 'metal' && extraSets > 0 && (
                        <div className="flex justify-between">
                          <span className="text-slate-300">Extra Card Sets × {extraSets}</span>
                          <span className="text-white">${extraSets * METAL_ADDITIONAL_SET_PRICE}</span>
                        </div>
                      )}
                      
                      {easelPhotos.some(p => p.size === '18x24') && (
                        <div className="flex justify-between">
                          <span className="text-slate-300">18×24 Easel Photo Upgrade × {easelPhotos.filter(p => p.size === '18x24').length}</span>
                          <span className="text-white">${EASEL_18X24_UPSELL * easelPhotos.filter(p => p.size === '18x24').length}</span>
                        </div>
                      )}
                      
                      {easelPhotos.length > currentPackage.photos && (
                        <div className="flex justify-between">
                          <span className="text-slate-300">Additional Easel Photos × {easelPhotos.length - currentPackage.photos}</span>
                          <span className="text-white">${(easelPhotos.length - currentPackage.photos) * ADDITIONAL_PHOTO_PRICE}</span>
                        </div>
                      )}
                      
                      {cardType === 'metal' && upgradeThickness && currentPackage.thickness !== 'premium' && (
                        <div className="flex justify-between">
                          <span className="text-slate-300">Premium Thickness Upgrade</span>
                          <span className="text-white">${PREMIUM_THICKNESS_PRICE * ((currentPackage.cards / 55) + extraSets)}</span>
                        </div>
                      )}
                      
                      {cardType === 'paper' && ((mainDesignSize === '3x4.75' ? 1 : 0) + additionalDesigns.filter(d => d.size === '3x4.75').length) > 0 && (
                        <div className="flex justify-between">
                          <span className="text-slate-300">Large Size Upgrades × {(mainDesignSize === '3x4.75' ? 1 : 0) + additionalDesigns.filter(d => d.size === '3x4.75').length}</span>
                          <span className="text-white">${((mainDesignSize === '3x4.75' ? 1 : 0) + additionalDesigns.filter(d => d.size === '3x4.75').length) * PAPER_SIZE_UPSELL}</span>
                        </div>
                      )}
                      
                      {cardType === 'paper' && additionalDesigns.length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-slate-300">Additional Designs × {additionalDesigns.length} (total {additionalDesigns.reduce((s, d) => s + d.qty, 0)} cards)</span>
                          <span className="text-white">${additionalDesigns.length * ADDITIONAL_DESIGN_PRICE}</span>
                        </div>
                      )}
                      
                      {/* Shipping Cost */}
                      <div className="flex justify-between">
                        <span className="text-slate-300">{SHIPPING_PRICES[shippingSpeed].label}</span>
                        <span className="text-white">${SHIPPING_PRICES[shippingSpeed].price}</span>
                      </div>
                      
                      <div className="border-t border-slate-600 pt-3 mt-3">
                        <div className="flex justify-between text-lg font-semibold">
                          <span className="text-white">Total</span>
                          <span className="text-amber-400">${calculatePrice()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="bg-slate-800/50 rounded-lg p-4">
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
                      <span className="text-slate-400">Total Cards:</span> {totalCards}
                    </p>
                    {cardType === 'metal' && (
                      <p className="text-slate-300">
                        <span className="text-slate-400">Card Thickness:</span>{' '}
                        {effectiveThickness === 'premium' ? 'Premium .080"' : 'Standard .040"'}
                      </p>
                    )}
                    <p className="text-slate-300">
                      <span className="text-slate-400">Easel Photos:</span> {Math.max(currentPackage.photos, easelPhotos.length)} ({easelPhotos.filter(p => p.size === '18x24').length} upgraded to 18x24)
                    </p>
                    <p className="text-slate-300">
                      <span className="text-slate-400">Shipping:</span> {SHIPPING_PRICES[shippingSpeed].label}
                    </p>
                  </div>

                  {/* Shipping Details */}
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <h5 className="text-white font-medium mb-2">Shipping To</h5>
                    <p className="text-slate-300">{customerName}</p>
                    <p className="text-slate-300">{shippingStreet}</p>
                    <p className="text-slate-300">{shippingCity}, {shippingState} {shippingZip}</p>
                    <p className="text-slate-300">{shippingPhone}</p>
                    <p className="text-slate-400 text-sm mt-2">{customerEmail}</p>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep(3)}
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                      disabled={isSubmitting}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>Place Order - ${calculatePrice()}</>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 5: Order Confirmation */}
              {step === 5 && (
                <div className="text-center space-y-6 py-8">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                    <Package className="h-10 w-10 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Thank You for Your Order!</h2>
                  <p className="text-slate-300 max-w-md mx-auto">
                    A confirmation email has been sent to <strong>{customerEmail}</strong>.
                    Your {cardType === 'metal' ? 'premium metal prayer cards' : 'prayer cards'} will be shipped within 2 business days.
                  </p>
                  <Link to="/">
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white font-semibold mt-4">
                      Return Home
                    </Button>
                  </Link>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Hidden print-ready card captures (with 1.25" bleed at 300 DPI = ~375px padding) */}
      <div className="fixed -left-[9999px] -top-[9999px] pointer-events-none">
        {/* Front card print version */}
        <div 
          ref={frontPrintRef}
          className="relative"
          style={{
            width: orientation === 'landscape' ? '1275px' : '825px', // 3.5" or 2.25" + bleed at 300 DPI
            height: orientation === 'landscape' ? '900px' : '1275px',
            padding: '112px', // ~0.375" bleed (1.25" total minus card edge)
            backgroundColor: '#f5f5f5',
          }}
        >
          <div 
            className={`w-full h-full rounded-lg overflow-hidden relative bg-gradient-to-br ${currentFinish.gradient}`}
            style={{ padding: '4px' }}
          >
            <div className="w-full h-full rounded-lg overflow-hidden bg-slate-700 relative">
              {deceasedPhoto && (
                <>
                  <img
                    src={deceasedPhoto}
                    alt="Memorial"
                    className="w-full h-full object-cover"
                    style={{
                      transform: `translate(${photoPanX}px, ${photoPanY}px) scale(${photoZoom})`,
                      transformOrigin: 'center',
                      filter: `brightness(${photoBrightness}%)`,
                    }}
                  />
                  {photoFade && (
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.6) 100%)',
                      }}
                    />
                  )}
                </>
              )}
              {showNameOnFront && (
                <div
                  className="absolute px-2 py-1"
                  style={{
                    left: `${namePosition.x}%`,
                    top: `${namePosition.y}%`,
                    transform: 'translate(-50%, -50%)',
                    fontFamily: nameFont,
                    fontSize: `${nameSize * 3}px`,
                    color: nameColor,
                    fontWeight: nameBold ? 'bold' : 'normal',
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                    whiteSpace: 'pre-line',
                    textAlign: 'center',
                  }}
                >
                  {deceasedName || 'Name Here'}
                </div>
              )}
              {showDatesOnFront && birthDate && deathDate && (
                <div
                  className="absolute"
                  style={{
                    left: `${datesPosition.x}%`,
                    top: `${datesPosition.y}%`,
                    transform: 'translate(-50%, -50%)',
                    fontFamily: datesFont,
                    fontSize: `${(typeof frontDatesSize === 'number' ? frontDatesSize : 12) * 3}px`,
                    color: frontDatesColor,
                    fontWeight: datesBold ? 'bold' : 'normal',
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                  }}
                >
                  {formatDates(birthDate, deathDate, frontDateFormat)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Back card print version */}
        <div 
          ref={backPrintRef}
          className="relative"
          style={{
            width: orientation === 'landscape' ? '1275px' : '825px',
            height: orientation === 'landscape' ? '900px' : '1275px',
            padding: '112px',
            backgroundColor: '#f5f5f5',
          }}
        >
          <div 
            className={`w-full h-full rounded-lg overflow-hidden relative bg-gradient-to-br ${currentFinish.gradient}`}
            style={{ padding: '4px' }}
          >
            <div 
              className="w-full h-full rounded-lg overflow-hidden relative flex flex-col"
              style={{
                backgroundColor: backBgImage ? 'transparent' : '#ffffff',
              }}
            >
              {backBgImage && (
                <>
                  <img 
                    src={backBgImage}
                    alt="Background"
                    className="absolute w-full h-full object-cover"
                    style={{
                      transform: `scale(${backBgZoom}) translate(${backBgPanX}%, ${backBgPanY}%) rotate(${backBgRotation}deg)`,
                      transformOrigin: 'center center',
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                </>
              )}
              {/* Back content */}
              <div className="flex-1 flex flex-col p-6 relative z-10">
                {showInLovingMemory && (
                  <div
                    className="text-center mb-2"
                    style={{
                      fontFamily: inLovingMemoryFont,
                      fontSize: `${inLovingMemorySize * 3}px`,
                      color: inLovingMemoryColor,
                      fontWeight: inLovingMemoryBold ? 'bold' : 'normal',
                    }}
                  >
                    {inLovingMemoryText}
                  </div>
                )}
                {showNameOnBack && (
                  <div
                    className="text-center"
                    style={{
                      fontFamily: backNameFont,
                      fontSize: `${backNameSize * 3}px`,
                      color: backNameColor,
                      fontWeight: backNameBold ? 'bold' : 'normal',
                    }}
                  >
                    {deceasedName}
                  </div>
                )}
                {showDatesOnBack && birthDate && deathDate && (
                  <div
                    className="text-center mt-1"
                    style={{
                      fontFamily: datesFont,
                      fontSize: `${(typeof backDatesSize === 'number' ? backDatesSize : 10) * 3}px`,
                      color: backDatesColor,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {formatDates(birthDate, deathDate, backDateFormat)}
                  </div>
                )}
                <div
                  className="flex-1 mt-4 text-center"
                  style={{
                    fontFamily: 'Cormorant Garamond',
                    fontSize: `${(prayerTextSize === 'auto' ? autoPrayerFontSize : Math.min(prayerTextSize, autoPrayerFontSize)) * 3}px`,
                    color: '#333',
                    fontWeight: prayerBold ? 'bold' : 'normal',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {backText}
                </div>
                {showQrCode && qrUrl && (
                  <div className="flex justify-center mt-4">
                    <QRCodeSVG value={qrUrl} size={120} />
                  </div>
                )}
                {funeralHomeLogo && funeralHomeLogoPosition === 'bottom' && (
                  <div className="flex justify-center mt-4">
                    <img src={funeralHomeLogo} alt="Logo" style={{ height: `${funeralHomeLogoSize * 2}px` }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-slate-500">
          <p>© 2025 Luxury Prayer Cards. LuxuryPrayerCards.com</p>
        </div>
      </footer>
    </div>
    </>
  );
};

export default Design;
