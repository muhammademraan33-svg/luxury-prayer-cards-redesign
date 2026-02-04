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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Sparkles, QrCode, Loader2, Truck, Zap, ArrowLeft, ArrowRight, ImageIcon, RotateCcw, RectangleHorizontal, RectangleVertical, Type, Book, Trash2, Package, Clock, MapPin, Layers, CheckCircle2, Plus, Eye, Download, Minus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { prayerTemplates } from '@/data/prayerTemplates';
import { toast } from 'sonner';
import metalCardProduct from '@/assets/metal-card-product.jpg';
import paperCardsProduct from '@/assets/paper-cards-product.jpg';
import { AutoFitSingleLineText } from '@/components/AutoFitSingleLineText';
import { AutoFitText } from '@/components/AutoFitText';
import { format } from 'date-fns';
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
import { QrCodeBadge } from '@/components/QrCodeBadge';
const PRESET_BACKGROUNDS = [{
  id: 'clouds',
  name: 'Soft Clouds',
  src: cloudsLightBg,
  isDark: false
}, {
  id: 'marble',
  name: 'Grey Marble',
  src: marbleGreyBg,
  isDark: false
}, {
  id: 'sunset',
  name: 'Sunset Clouds',
  src: sunsetCloudsBg,
  isDark: true
}, {
  id: 'rays',
  name: 'Heavenly Rays',
  src: heavenlyRaysBg,
  isDark: false
}, {
  id: 'ocean',
  name: 'Ocean Sunset',
  src: oceanSunsetBg,
  isDark: true
}, {
  id: 'dove',
  name: 'Dove Light',
  src: doveLightBg,
  isDark: false
}, {
  id: 'mountain',
  name: 'Mountain Sunrise',
  src: mountainSunriseBg,
  isDark: true
}, {
  id: 'starry',
  name: 'Starry Night',
  src: starryNightBg,
  isDark: true
}, {
  id: 'gold-marble',
  name: 'Gold Marble',
  src: goldMarbleBg,
  isDark: false
}, {
  id: 'misty-lake',
  name: 'Misty Lake',
  src: mistyLakeBg,
  isDark: false
}, {
  id: 'feathers',
  name: 'White Feathers',
  src: whiteFeathersBg,
  isDark: false
}, {
  id: 'wheat',
  name: 'Wheat Sunset',
  src: wheatSunsetBg,
  isDark: true
}];

// Metal background options for back of card
type BackBgType = 'image' | 'metal';
const METAL_BG_OPTIONS: {
  id: MetalFinish;
  name: string;
  gradient: string;
  isDark: boolean;
}[] = [{
  id: 'silver',
  name: 'Brushed Silver',
  gradient: 'from-zinc-400 via-zinc-300 to-zinc-500',
  isDark: false
}, {
  id: 'gold',
  name: 'Polished Gold',
  gradient: 'from-yellow-600 via-yellow-500 to-yellow-700',
  isDark: false
}, {
  id: 'rosegold',
  name: 'Rose Gold',
  gradient: 'from-[#e8c4bc] via-[#d4a59a] to-[#c9968a]',
  isDark: false
}, {
  id: 'black',
  name: 'Matte Black',
  gradient: 'from-zinc-800 via-zinc-700 to-zinc-900',
  isDark: true
}, {
  id: 'white',
  name: 'Pearl White',
  gradient: 'from-gray-100 via-white to-gray-200',
  isDark: false
}, {
  id: 'marble',
  name: 'Silver Marble',
  gradient: 'from-gray-300 via-slate-100 to-gray-400',
  isDark: false
}];
const FONT_OPTIONS = [{
  value: 'Playfair Display',
  name: 'Playfair Display'
}, {
  value: 'Cormorant Garamond',
  name: 'Cormorant Garamond'
}, {
  value: 'Great Vibes',
  name: 'Great Vibes'
}, {
  value: 'Dancing Script',
  name: 'Dancing Script'
}, {
  value: 'Allura',
  name: 'Allura'
}, {
  value: 'Sacramento',
  name: 'Sacramento'
}, {
  value: 'Montserrat',
  name: 'Montserrat'
}];

// Helper to convert px to points at 300 DPI (print standard)
// 1 inch = 72 points, 1 inch = 300 px at 300 DPI
const PX_PER_INCH = 300;
const POINTS_PER_INCH = 72;
const pxToPoints = (px: number): number => {
  return Math.round(px / PX_PER_INCH * POINTS_PER_INCH);
};
const pointsToPx = (points: number): number => {
  return Math.round(points / POINTS_PER_INCH * PX_PER_INCH);
};
type MetalFinish = 'silver' | 'gold' | 'rosegold' | 'black' | 'white' | 'marble';
type Orientation = 'landscape' | 'portrait';
type CardSide = 'front' | 'back';
type CardType = 'metal' | 'paper';
const METAL_FINISHES: {
  id: MetalFinish;
  name: string;
  gradient: string;
}[] = [{
  id: 'silver',
  name: 'Brushed Silver',
  gradient: 'from-zinc-400 via-zinc-300 to-zinc-500'
}, {
  id: 'gold',
  name: 'Polished Gold',
  gradient: 'from-yellow-600 via-yellow-500 to-yellow-700'
}, {
  id: 'rosegold',
  name: 'Rose Gold',
  gradient: 'from-[#e8c4bc] via-[#d4a59a] to-[#c9968a]'
}, {
  id: 'black',
  name: 'Matte Black',
  gradient: 'from-zinc-800 via-zinc-700 to-zinc-900'
}, {
  id: 'white',
  name: 'Pearl White',
  gradient: 'from-gray-100 via-white to-gray-200'
}, {
  id: 'marble',
  name: 'Silver Marble',
  gradient: 'from-gray-300 via-slate-100 to-gray-400'
}];

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
    description: '55 premium metal cards'
  }
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
    description: '72 prayer cards + $0.77/additional card'
  }
};

// Add-on pricing
const METAL_ADDITIONAL_SET_PRICE = 87; // Additional 55 metal cards
const ADDITIONAL_PHOTO_PRICE = 17; // Additional memorial photo 16x20
const PHOTO_18X24_UPSELL = 7; // Upgrade from 16x20 to 18x24
const PREMIUM_THICKNESS_PRICE = 15; // Upgrade to .080" thick cards per set

const PAPER_SIZE_UPSELL = 7; // Upgrade from 2.5x4.25 to 3x4.75
const ADDITIONAL_DESIGN_PRICE = 7; // Per additional design
const PAPER_PER_CARD_PRICE = 0.77; // Per card price for paper cards (beyond 72)

// Shipping options
type ShippingSpeed = '72hour' | '48hour';
const SHIPPING_PRICES: Record<ShippingSpeed, {
  price: number;
  label: string;
}> = {
  '72hour': {
    price: 10,
    label: '72-Hour Delivery'
  },
  '48hour': {
    price: 17,
    label: '48-Hour Rush Delivery'
  }
};
import { DecorativeBorderOverlay, DECORATIVE_BORDERS, DecorativeBorderType } from '@/components/DecorativeBorderOverlay';
type CardThickness = 'standard' | 'premium';
type EaselPhotoSize = '16x20' | '18x24';
type PaperCardSize = '2.625x4.375' | '3.125x4.875';
const Design = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Show type selection modal if no type specified
  const urlType = searchParams.get('type');
  const [showTypeModal, setShowTypeModal] = useState(!urlType);
  const handleSelectCardType = (type: CardType) => {
    setSearchParams({
      type,
      quantity: type === 'paper' ? '55' : '55'
    });
    setShowTypeModal(false);
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Persist state to sessionStorage for browser back/forward navigation
  useEffect(() => {
    const persistCurrentState = () => {
      const stateToSave = {
        step,
        deceasedName,
        birthDate: birthDate?.toISOString(),
        deathDate: deathDate?.toISOString(),
        metalFinish,
        extraSets,
        upgradeThickness,
        shippingSpeed,
        frontBorderDesign,
        frontBorderColor,
        backBorderDesign,
        backBorderColor,
        mainDesignSize,
        mainDesignQty,
        qrUrl,
        showQrCode,
        orientation,
        cardSide,
        deceasedPhoto,
        photoZoom,
        photoPanX,
        photoPanY,
        photoRotation,
        photoFade,
        fadeColor,
        fadeShape,
        metalBorderColor,
        photoBrightness,
        photoShape,
        backBgImage,
        backBgType,
        backMetalFinish,
        backBgZoom,
        backBgPanX,
        backBgPanY,
        backBgRotation,
        backText,
        prayerTextSize,
        prayerBold,
        prayerItalic,
        autoPrayerFontSize,
        prayerColor,
        showNameOnFront,
        showDatesOnFront,
        showDatesOnBack,
        nameFont,
        datesFont,
        namePosition,
        datesPosition,
        nameSize,
        frontDatesSize,
        backNameSize,
        backNamePosition,
        backDatesSize,
        backDatesPosition,
        inLovingMemorySize,
        inLovingMemoryPosition,
        additionalTextSize,
        additionalTextPosition,
        prayerPosition,
        funeralHomeLogo,
        _persistedAt: Date.now(),
      };
      sessionStorage.setItem('designPageState', JSON.stringify(stateToSave));
    };

    // Save state before page unload (for browser back button)
    const handleBeforeUnload = () => {
      persistCurrentState();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Also save on visibility change (tab switch, etc.)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        persistCurrentState();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  });

  // Restore state from sessionStorage if returning from memorial photo editor
  const savedState = (() => {
    const saved = sessionStorage.getItem('designPageState');
    if (saved) {
      sessionStorage.removeItem('designPageState'); // Clear after reading
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved design state:', e);
      }
    }
    return null;
  })();
  const [step, setStep] = useState(savedState?.step || 1);

  // Form state
  const [deceasedName, setDeceasedName] = useState(savedState?.deceasedName || '');
  const [birthDate, setBirthDate] = useState<Date | undefined>(savedState?.birthDate ? new Date(savedState.birthDate) : undefined);
  const [deathDate, setDeathDate] = useState<Date | undefined>(savedState?.deathDate ? new Date(savedState.deathDate) : undefined);
  const [metalFinish, setMetalFinish] = useState<MetalFinish>(savedState?.metalFinish || 'white');

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
  const [extraSets, setExtraSets] = useState(savedState?.extraSets || 0); // Additional 55-card sets beyond package
  const [extraPhotos, setExtraPhotos] = useState(savedState?.extraPhotos || 0); // Extra photos beyond package (handled by easelPhotos length)

  const [upgradeThickness, setUpgradeThickness] = useState(savedState?.upgradeThickness || false);
  const [shippingSpeed, setShippingSpeed] = useState<ShippingSpeed>(savedState?.shippingSpeed || '72hour');
  const [frontBorderDesign, setFrontBorderDesign] = useState<DecorativeBorderType>(savedState?.frontBorderDesign || 'none');
  const [frontBorderColor, setFrontBorderColor] = useState(savedState?.frontBorderColor || '#d4af37'); // Gold (metallic) default
  const [backBorderDesign, setBackBorderDesign] = useState<DecorativeBorderType>(savedState?.backBorderDesign || 'none');
  const [backBorderColor, setBackBorderColor] = useState(savedState?.backBorderColor || '#d4af37'); // Gold (metallic) default

  // Only allow the 4 metallic border colors
  const METALLIC_BORDER_HEXES = ['#d4af37', '#c0c0c0', '#b76e79', '#f8f8f8'] as const;
  const normalizeBorderHex = (hex: string) => {
    const v = hex.trim().toLowerCase();
    return v.startsWith('#') && v.length === 9 ? v.slice(0, 7) : v;
  };
  const isAllowedBorderHex = (hex: string) => METALLIC_BORDER_HEXES.includes(normalizeBorderHex(hex) as (typeof METALLIC_BORDER_HEXES)[number]);
  useEffect(() => {
    if (cardType !== 'paper') return;
    if (frontBorderDesign !== 'none' && !isAllowedBorderHex(frontBorderColor)) {
      setFrontBorderColor('#d4af37');
    }
  }, [cardType, frontBorderDesign]);
  useEffect(() => {
    if (cardType !== 'paper') return;
    if (backBorderDesign !== 'none' && !isAllowedBorderHex(backBorderColor)) {
      setBackBorderColor('#d4af37');
    }
  }, [cardType, backBorderDesign]);

  // Auto-set border color to white when traditional frame is selected
  useEffect(() => {
    if (cardType !== 'paper') return;
    if (frontBorderDesign === 'traditional-frame' && frontBorderColor !== '#f8f8f8') {
      setFrontBorderColor('#f8f8f8');
    }
  }, [cardType, frontBorderDesign]);

  // Keep front dates safely inside paper borders
  useEffect(() => {
    if (cardType !== 'paper') return;
    if (frontBorderDesign === 'none') return;

    // Mirrors the drag bounds (maxY = 95 - 8)
    const SAFE_MAX_Y = 87;
    setDatesPosition(prev => ({
      ...prev,
      y: Math.min(prev.y, SAFE_MAX_Y)
    }));
  }, [cardType, frontBorderDesign]);
  const [mainDesignSize, setMainDesignSize] = useState<PaperCardSize>(savedState?.mainDesignSize || '2.625x4.375'); // Size for main design
  const [additionalDesigns, setAdditionalDesigns] = useState<AdditionalDesignData[]>(savedState?.additionalDesigns || []); // Additional designs with full data
  const [mainDesignQty, setMainDesignQty] = useState(savedState?.mainDesignQty || 55); // Quantity for main design
  const [activeDesignIndex, setActiveDesignIndex] = useState<number>(savedState?.activeDesignIndex ?? -1); // -1 = main design, 0+ = additional designs
  const [qrUrl, setQrUrl] = useState(savedState?.qrUrl || '');
  const [showQrCode, setShowQrCode] = useState(savedState?.showQrCode ?? true);

  const normalizeQrUrl = (value: string): string => {
    const v = value.trim();
    if (!v) return '';
    if (/^https?:\/\//i.test(v)) return v;
    return `https://${v}`;
  };

  const qrValue = showQrCode ? normalizeQrUrl(qrUrl) : '';
  const [orientation, setOrientation] = useState<Orientation>(savedState?.orientation || 'portrait');
  const [cardSide, setCardSide] = useState<CardSide>(savedState?.cardSide || 'front');
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [printPreviewImages, setPrintPreviewImages] = useState<{
    front: string;
    back: string;
  } | null>(null);
  const [generatingPreview, setGeneratingPreview] = useState(false);
  const [deceasedPhoto, setDeceasedPhoto] = useState<string | null>(savedState?.deceasedPhoto || null);
  const [photoZoom, setPhotoZoom] = useState(savedState?.photoZoom || 1);
  const [photoPanX, setPhotoPanX] = useState(savedState?.photoPanX || 0);
  const [photoPanY, setPhotoPanY] = useState(savedState?.photoPanY || 0);
  const [photoRotation, setPhotoRotation] = useState(savedState?.photoRotation || 0);
  const [photoFade, setPhotoFade] = useState(savedState?.photoFade ?? true);
  const [fadeColor, setFadeColor] = useState(savedState?.fadeColor || '#000000');
  const [fadeShape, setFadeShape] = useState<'rectangle' | 'circle'>(savedState?.fadeShape || 'rectangle');
  const [metalBorderColor, setMetalBorderColor] = useState<string>(savedState?.metalBorderColor || '#d4af37'); // 'none' or metallic hex
  const [photoBrightness, setPhotoBrightness] = useState(savedState?.photoBrightness || 100);
  const [photoShape, setPhotoShape] = useState<'circle' | 'square' | 'full'>(savedState?.photoShape || 'full');

  // Sync back of card background to match front border color
  useEffect(() => {
    if (cardType !== 'metal' || metalBorderColor === 'none') return;

    // Map border color to metal finish
    let newFinish: MetalFinish;
    switch (metalBorderColor) {
      case '#d4af37':
        // Gold
        newFinish = 'gold';
        break;
      case '#c0c0c0':
        // Silver
        newFinish = 'silver';
        break;
      case '#b76e79':
        // Rose Gold
        newFinish = 'rosegold';
        break;
      case '#f8f8f8':
        // White
        newFinish = 'white';
        break;
      default:
        newFinish = 'gold';
    }
    setBackBgImage(null);
    setBackMetalFinish(newFinish);
  }, [metalBorderColor, cardType]);

  // Metal border gradient based on color
  const getMetalBorderGradient = (color: string): string => {
    switch (color) {
      case '#d4af37':
        // Gold
        return 'from-yellow-200 via-yellow-400 to-yellow-700';
      case '#c0c0c0':
        // Silver
        return 'from-gray-200 via-gray-300 to-gray-500';
      case '#b76e79':
        // Rose Gold
        return 'from-[#e8c4bc] via-[#d4a59a] to-[#c9968a]';
      case '#f8f8f8':
        // White
        return 'from-gray-100 via-white to-gray-200';
      default:
        return 'from-yellow-200 via-yellow-400 to-yellow-700';
    }
  };
  const [isPanning, setIsPanning] = useState(false);
  const [backBgImage, setBackBgImage] = useState<string | null>(savedState?.backBgImage || null);
  const [backBgType, setBackBgType] = useState<BackBgType>(savedState?.backBgType || 'metal');
  const [backMetalFinish, setBackMetalFinish] = useState<MetalFinish>(savedState?.backMetalFinish || 'white');
  const [backBgZoom, setBackBgZoom] = useState(savedState?.backBgZoom || 1);
  const [backBgPanX, setBackBgPanX] = useState(savedState?.backBgPanX || 0);
  const [backBgPanY, setBackBgPanY] = useState(savedState?.backBgPanY || 0);
  const [backBgRotation, setBackBgRotation] = useState(savedState?.backBgRotation || 0);
  const [backText, setBackText] = useState(savedState?.backText || 'The Lord is my shepherd; I shall not want.');
  const [prayerTextSize, setPrayerTextSize] = useState<number | 'auto'>(savedState?.prayerTextSize ?? 'auto');
  const [autoPrayerFontSize, setAutoPrayerFontSize] = useState(savedState?.autoPrayerFontSize || 16);
  const [prayerLayoutNonce, setPrayerLayoutNonce] = useState(0);
  const [prayerColor, setPrayerColor] = useState(savedState?.prayerColor || '#ffffff');
  const [backBgSampleHex, setBackBgSampleHex] = useState<string>(savedState?.backBgSampleHex || '#ffffff');

  // Front card text state
  const [showNameOnFront, setShowNameOnFront] = useState(savedState?.showNameOnFront ?? true);
  const [showDatesOnFront, setShowDatesOnFront] = useState(savedState?.showDatesOnFront ?? true);
  const [showDatesOnBack, setShowDatesOnBack] = useState(savedState?.showDatesOnBack ?? true);
  const [nameFont, setNameFont] = useState(savedState?.nameFont || 'Great Vibes');
  const [datesFont, setDatesFont] = useState(savedState?.datesFont || (cardType === 'paper' ? 'Montserrat' : 'Cormorant Garamond'));
  const [namePosition, setNamePosition] = useState(savedState?.namePosition || {
    x: 50,
    y: 82
  });
  const [datesPosition, setDatesPosition] = useState(savedState?.datesPosition || {
    x: 50,
    y: cardType === 'metal' ? 86 : 86
  });

  // Calculate estimated text height as percentage of card height
  // Based on 300 DPI and typical card dimensions
  const getTextHeightPercent = (fontSize: number, lineCount: number, cardHeightPx: number = 420) => {
    const lineHeightMultiplier = 1.3;
    const totalHeightPx = fontSize * lineHeightMultiplier * lineCount;
    return totalHeightPx / cardHeightPx * 100;
  };

  // Auto-wrap text based on font size and card width
  const getAutoWrappedText = (text: string, fontSize: number, maxWidthPercent: number = 85) => {
    // Estimate chars per line based on font size (rough approximation)
    // Average char width is roughly 0.5-0.6 of font size for most fonts
    const cardWidthPx = 280; // Approximate card width in pixels at display scale
    const maxWidthPx = maxWidthPercent / 100 * cardWidthPx;
    const avgCharWidth = fontSize * 0.5;
    const charsPerLine = Math.floor(maxWidthPx / avgCharWidth);
    if (charsPerLine <= 0 || text.length <= charsPerLine) {
      return text;
    }

    // Split into words and wrap
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (testLine.length > charsPerLine && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines.join('\n');
  };

  // Refs for auto-adjustment (declared here, used in useEffect below after states)
  const prevBorderRef = useRef(frontBorderDesign);
  const [nameColor, setNameColor] = useState('#ffffff');
  const [frontDatesColor, setFrontDatesColor] = useState('#ffffff');
  const [backDatesColor, setBackDatesColor] = useState('#666666');
  const [nameSize, setNameSize] = useState(24);
  const [frontDatesSize, setFrontDatesSize] = useState<number | 'auto'>(16);
  const [backDatesSize, setBackDatesSize] = useState<number | 'auto'>(22);
  const [frontDateFormat, setFrontDateFormat] = useState<'full' | 'short-month' | 'mmm-dd-yyyy' | 'numeric' | 'year'>('full');
  const [backDateFormat, setBackDateFormat] = useState<'full' | 'short-month' | 'mmm-dd-yyyy' | 'numeric' | 'year'>('full');
  const [additionalText, setAdditionalText] = useState('');
  const [additionalTextPosition, setAdditionalTextPosition] = useState({
    x: 50,
    y: 70
  });
  const [additionalTextColor, setAdditionalTextColor] = useState('#ffffff');
  const [additionalTextSize, setAdditionalTextSize] = useState(14);
  const [additionalTextFont, setAdditionalTextFont] = useState('Cormorant Garamond');
  const [showAdditionalText, setShowAdditionalText] = useState(false);
  const [selectedPrayerId, setSelectedPrayerId] = useState<string>('custom');
  const [draggingText, setDraggingText] = useState<'name' | 'dates' | 'additional' | 'backDates' | 'prayer' | 'inLovingMemory' | 'backName' | null>(null);
  const [resizingText, setResizingText] = useState<'name' | 'dates' | 'additional' | 'backDates' | 'prayer' | 'inLovingMemory' | 'backName' | null>(null);
  
  // Track if we're in an active resize operation to prevent auto-adjustment
  const isResizingRef = useRef(false);
  
  // Store initial positions when resize starts for deterministic restoration
  const initialPositionsRef = useRef<{
    namePosition: { x: number; y: number };
    datesPosition: { x: number; y: number };
    additionalTextPosition: { x: number; y: number };
  } | null>(null);

  // DEFAULT VALUES - used for reset and deterministic restoration
  const DEFAULT_VALUES = {
    nameSize: 24,
    frontDatesSize: 16 as number | 'auto',
    backDatesSize: 22 as number | 'auto',
    backNameSize: 32,
    additionalTextSize: 14,
    inLovingMemorySize: 24,
    prayerTextSize: 'auto' as number | 'auto',
    namePosition: { x: 50, y: 82 },
    datesPosition: { x: 50, y: 86 },
    backNamePosition: { x: 0, y: 12 },
    backDatesPosition: { x: 50, y: 48 },
    inLovingMemoryPosition: { x: 0, y: 8 },
    additionalTextPosition: { x: 50, y: 70 },
    prayerPosition: { x: 0, y: 0 },
  };

  // Store the slider values at the start of a resize session for deterministic restoration
  const resizeStartValuesRef = useRef<{
    nameSize: number;
    frontDatesSize: number | 'auto';
    backDatesSize: number | 'auto';
    backNameSize: number;
    additionalTextSize: number;
    inLovingMemorySize: number;
    prayerTextSize: number | 'auto';
    namePosition: { x: number; y: number };
    datesPosition: { x: number; y: number };
    backNamePosition: { x: number; y: number };
    backDatesPosition: { x: number; y: number };
    inLovingMemoryPosition: { x: number; y: number };
    additionalTextPosition: { x: number; y: number };
    prayerPosition: { x: number; y: number };
  } | null>(null);

  // Prayer text position (percentage from center, 0 = centered)
  const [prayerPosition, setPrayerPosition] = useState({
    x: 0,
    y: 0
  });

  // Back card dates position - default to middle horizontal alignment
  const [backDatesPosition, setBackDatesPosition] = useState({
    x: 50,
    y: 48
  });
  const [backDatesAlign, setBackDatesAlign] = useState<'left' | 'center' | 'right'>('center');

  // Back name styling - now has its own size control
  const [backNameSize, setBackNameSize] = useState(32);
  const [backNameColor, setBackNameColor] = useState('#ffffff');
  const [backNameBold, setBackNameBold] = useState(true);
  const [backNameFont, setBackNameFont] = useState('Great Vibes');
  const [showNameOnBack, setShowNameOnBack] = useState(true);

  // Bold options
  const [nameBold, setNameBold] = useState(true);
  const [datesBold, setDatesBold] = useState(true);
  const [additionalTextBold, setAdditionalTextBold] = useState(false);
  const [inLovingMemoryBold, setInLovingMemoryBold] = useState(false);
  const [prayerBold, setPrayerBold] = useState(savedState?.prayerBold ?? false);
  const [prayerItalic, setPrayerItalic] = useState(savedState?.prayerItalic ?? true); // Default to italic for traditional look

  // Text shadow options
  const [nameTextShadow, setNameTextShadow] = useState(true);
  const [datesTextShadow, setDatesTextShadow] = useState(true);
  const [additionalTextShadow, setAdditionalTextShadow] = useState(true);

  // "In Loving Memory" customization
  const [inLovingMemoryText, setInLovingMemoryText] = useState('In Loving Memory');
  const [inLovingMemoryColor, setInLovingMemoryColor] = useState('#ffffff');
  const [inLovingMemorySize, setInLovingMemorySize] = useState(24);
  const [inLovingMemoryFont, setInLovingMemoryFont] = useState('Cormorant Garamond');
  const [showInLovingMemory, setShowInLovingMemory] = useState(true);
  const [inLovingMemoryPosition, setInLovingMemoryPosition] = useState({
    x: 0,
    y: 8
  });

  // Back name position
  const [backNamePosition, setBackNamePosition] = useState({
    x: 0,
    y: 12
  });

  // Funeral home logo
  const [funeralHomeLogo, setFuneralHomeLogo] = useState<string | null>(null);
  const [funeralHomeLogoPosition, setFuneralHomeLogoPosition] = useState<'top' | 'bottom'>('bottom');
  const [funeralHomeLogoSize, setFuneralHomeLogoSize] = useState(40);

  // Reset all positions and sizes to defaults
  const resetAllDesignSettings = useCallback(() => {
    // Front card defaults
    setNameSize(24);
    setNamePosition({ x: 50, y: 82 });
    setFrontDatesSize('auto');
    setDatesPosition({ x: 50, y: 86 });
    setAdditionalTextPosition({ x: 50, y: 70 });
    setAdditionalTextSize(14);
    
    // Back card defaults
    setBackNameSize(32);
    setBackNamePosition({ x: 0, y: 12 });
    setBackDatesSize('auto');
    setBackDatesPosition({ x: 50, y: 48 });
    setPrayerTextSize('auto');
    setPrayerPosition({ x: 0, y: 0 });
    setInLovingMemorySize(24);
    setInLovingMemoryPosition({ x: 0, y: 8 });
    
    // Photo/background defaults
    setPhotoZoom(1);
    setPhotoPanX(0);
    setPhotoPanY(0);
    setPhotoRotation(0);
    setPhotoBrightness(100);
    setPhotoShape('full');
    setBackBgZoom(1);
    setBackBgPanX(0);
    setBackBgPanY(0);
    setBackBgRotation(0);
    
    toast.success('All positions and sizes reset to defaults');
  }, []);

  // Capture current values when slider interaction starts
  const captureResizeStartValues = useCallback(() => {
    if (!resizeStartValuesRef.current) {
      resizeStartValuesRef.current = {
        nameSize,
        frontDatesSize,
        backDatesSize,
        backNameSize,
        additionalTextSize,
        inLovingMemorySize,
        prayerTextSize,
        namePosition: { ...namePosition },
        datesPosition: { ...datesPosition },
        backNamePosition: { ...backNamePosition },
        backDatesPosition: { ...backDatesPosition },
        inLovingMemoryPosition: { ...inLovingMemoryPosition },
        additionalTextPosition: { ...additionalTextPosition },
        prayerPosition: { ...prayerPosition },
      };
    }
  }, [nameSize, frontDatesSize, backDatesSize, backNameSize, additionalTextSize, inLovingMemorySize, prayerTextSize, namePosition, datesPosition, backNamePosition, backDatesPosition, inLovingMemoryPosition, additionalTextPosition, prayerPosition]);
  
  // Check if returning to original value and restore position if so
  const handleDeterministicResize = useCallback((
    textType: 'name' | 'dates' | 'backDates' | 'backName' | 'inLovingMemory' | 'additional' | 'prayer',
    newSize: number
  ) => {
    const startValues = resizeStartValuesRef.current;
    if (!startValues) return;
    
    // Check if slider returned to original value (within 0.5 tolerance)
    const getOriginalSize = () => {
      switch (textType) {
        case 'name': return typeof startValues.nameSize === 'number' ? startValues.nameSize : 24;
        case 'dates': return typeof startValues.frontDatesSize === 'number' ? startValues.frontDatesSize : 16;
        case 'backDates': return typeof startValues.backDatesSize === 'number' ? startValues.backDatesSize : 22;
        case 'backName': return startValues.backNameSize;
        case 'inLovingMemory': return startValues.inLovingMemorySize;
        case 'additional': return startValues.additionalTextSize;
        case 'prayer': return typeof startValues.prayerTextSize === 'number' ? startValues.prayerTextSize : 16;
        default: return 16;
      }
    };
    
    const originalSize = getOriginalSize();
    
    // If returning to original size, restore original position too
    if (Math.abs(newSize - originalSize) < 0.5) {
      switch (textType) {
        case 'name':
          setNamePosition({ ...startValues.namePosition });
          break;
        case 'dates':
          setDatesPosition({ ...startValues.datesPosition });
          break;
        case 'backDates':
          setBackDatesPosition({ ...startValues.backDatesPosition });
          break;
        case 'backName':
          setBackNamePosition({ ...startValues.backNamePosition });
          break;
        case 'inLovingMemory':
          setInLovingMemoryPosition({ ...startValues.inLovingMemoryPosition });
          break;
        case 'additional':
          setAdditionalTextPosition({ ...startValues.additionalTextPosition });
          break;
        case 'prayer':
          setPrayerPosition({ ...startValues.prayerPosition });
          break;
      }
    }
  }, []);

  // Auto-adjust name/dates/additional text positions based on elements
  // IMPORTANT: Skip auto-adjustment during active resize to prevent position drift
  useEffect(() => {
    if (cardType !== 'paper') return;
    // Don't auto-adjust while user is actively resizing text - this prevents position drift
    if (isResizingRef.current) return;
    
    const hasBorder = frontBorderDesign !== 'none';
    const hadBorder = prevBorderRef.current !== 'none';
    const borderJustAdded = hasBorder && !hadBorder;
    prevBorderRef.current = frontBorderDesign;

    // Safe zones for text positioning
    const SAFE_MAX_Y = hasBorder ? 84 : 96;
    const SAFE_MIN_Y = hasBorder ? 12 : 5;

    // Calculate text heights
    const nameText = deceasedName || 'Name Here';
    // Count actual line breaks entered by user (pre-line respects \n)
    const nameLineCount = Math.max(1, nameText.split('\n').length);
    const nameHeightPercent = getTextHeightPercent(nameSize, nameLineCount);
    const datesHeightPercent = typeof frontDatesSize === 'number' ? getTextHeightPercent(frontDatesSize, 1) : getTextHeightPercent(14, 1); // Default for auto

    const additionalHeightPercent = showAdditionalText ? getTextHeightPercent(additionalTextSize, (additionalText || 'Text').split('\n').length) : 0;

    // FIXED gap between name and dates - consistent regardless of borders
    const NAME_DATES_GAP = 0.5;
    const MIN_GAP = 2;
    let newNameY = namePosition.y;
    let newDatesY = datesPosition.y;
    let newAdditionalY = additionalTextPosition.y;

    // Calculate where dates should be based on name position
    const nameBottom = newNameY + nameHeightPercent / 2;
    const idealDatesY = nameBottom + NAME_DATES_GAP + datesHeightPercent / 2;

    // When border is added, pull everything into safe zone
    if (borderJustAdded) {
      // First check if ideal positions fit
      if (idealDatesY + datesHeightPercent / 2 > SAFE_MAX_Y) {
        // Need to move name up to fit dates
        const maxDatesY = SAFE_MAX_Y - datesHeightPercent / 2;
        const requiredNameBottom = maxDatesY - NAME_DATES_GAP - datesHeightPercent / 2;
        newNameY = requiredNameBottom - nameHeightPercent / 2;
        newDatesY = maxDatesY;
      } else {
        newNameY = Math.min(namePosition.y, SAFE_MAX_Y - nameHeightPercent - NAME_DATES_GAP - datesHeightPercent);
        newDatesY = idealDatesY;
      }
      if (showAdditionalText) {
        newAdditionalY = Math.min(additionalTextPosition.y, SAFE_MAX_Y - additionalHeightPercent / 2);
      }
    } else {
      // Always position dates with fixed gap below name
      if (showDatesOnFront) {
        newDatesY = nameBottom + NAME_DATES_GAP + datesHeightPercent / 2;
      }
    }

    // Ensure dates stay in safe zone
    if (showDatesOnFront && newDatesY + datesHeightPercent / 2 > SAFE_MAX_Y) {
      newDatesY = SAFE_MAX_Y - datesHeightPercent / 2;
      // Push name up to maintain gap
      const requiredNameBottom = newDatesY - NAME_DATES_GAP - datesHeightPercent / 2;
      newNameY = requiredNameBottom - nameHeightPercent / 2;
    }

    // Recalculate name top after any adjustments
    const nameTop = newNameY - nameHeightPercent / 2;

    // Ensure additional text doesn't overlap (usually above name)
    if (showAdditionalText) {
      const additionalBottom = newAdditionalY + additionalHeightPercent / 2;
      if (additionalBottom + MIN_GAP > nameTop) {
        newAdditionalY = nameTop - MIN_GAP - additionalHeightPercent / 2;
      }
      // Keep in safe zone
      if (newAdditionalY - additionalHeightPercent / 2 < SAFE_MIN_Y) {
        newAdditionalY = SAFE_MIN_Y + additionalHeightPercent / 2;
      }
    }

    // Ensure name doesn't go too high
    if (newNameY - nameHeightPercent / 2 < SAFE_MIN_Y) {
      newNameY = SAFE_MIN_Y + nameHeightPercent / 2;
      // Recalculate dates position
      if (showDatesOnFront) {
        newDatesY = newNameY + nameHeightPercent / 2 + NAME_DATES_GAP + datesHeightPercent / 2;
      }
    }

    // Update positions if changed
    if (Math.abs(newDatesY - datesPosition.y) > 0.5) {
      setDatesPosition(prev => ({
        ...prev,
        y: newDatesY
      }));
    }
    if (Math.abs(newNameY - namePosition.y) > 0.5) {
      setNamePosition(prev => ({
        ...prev,
        y: newNameY
      }));
    }
    if (showAdditionalText && Math.abs(newAdditionalY - additionalTextPosition.y) > 0.5) {
      setAdditionalTextPosition(prev => ({
        ...prev,
        y: newAdditionalY
      }));
    }
  }, [cardType, frontBorderDesign, showNameOnFront, showDatesOnFront, showAdditionalText, deceasedName, nameSize, frontDatesSize, additionalTextSize, additionalText, namePosition.y, datesPosition.y, additionalTextPosition.y]);

  // Helper to apply front text colors based on background darkness
  const applyFrontTextPalette = useCallback((useLightText: boolean) => {
    if (useLightText) {
      // Light text for dark backgrounds
      setNameColor('#ffffff');
      setFrontDatesColor('#ffffff');
      setAdditionalTextColor('#ffffff');
    } else {
      // Dark text for light backgrounds
      setNameColor('#111827');
      setFrontDatesColor('#111827');
      setAdditionalTextColor('#111827');
    }
  }, []);

  // Legacy wrapper for existing call sites (used before async function is ready)
  const updateFrontTextColors = (isDark: boolean) => {
    applyFrontTextPalette(isDark);
  };
  const BACK_IMAGE_OVERLAY_ALPHA = 0.2;
  const METAL_SAMPLE_HEX: Record<MetalFinish, string> = {
    silver: '#b9bcc1',
    gold: '#c9a227',
    rosegold: '#d4a59a',
    black: '#0b0b0f',
    white: '#f5f5f5',
    marble: '#d3d7de'
  };
  const applyBlackOverlay = useCallback((hex: string, alpha: number) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    return rgbToHex({
      r: rgb.r * (1 - alpha),
      g: rgb.g * (1 - alpha),
      b: rgb.b * (1 - alpha)
    });
  }, []);
  const getAverageImageHex = useCallback((src: string) => {
    return new Promise<string | null>(resolve => {
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
          const {
            data
          } = ctx.getImageData(0, 0, size, size);

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
          resolve(rgbToHex({
            r: r / count,
            g: g / count,
            b: b / count
          }));
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }, []);

  // Sync front text colors by analyzing the image luminance
  const syncFrontTextColors = useCallback(async (imageSrc: string | null) => {
    if (!imageSrc) {
      // No photo - default to white text (user can change if needed)
      applyFrontTextPalette(true);
      return;
    }

    // Analyze the photo to determine if it's dark or light
    const avg = await getAverageImageHex(imageSrc);
    if (avg) {
      const lum = relativeLuminance(avg);
      // If luminance is below 0.45, background is dark, use light text
      applyFrontTextPalette(lum < 0.45);
    } else {
      // Default to light text for photos (common case)
      applyFrontTextPalette(true);
    }
  }, [applyFrontTextPalette, getAverageImageHex]);
  const applyBackTextPalette = useCallback((backgroundHex: string | null, fallbackIsDark: boolean) => {
    const normalizedBg = backgroundHex ? backgroundHex.toLowerCase() : null;
    const best = normalizedBg ? pickBestTextColor(normalizedBg, ['#ffffff', '#000000']) : fallbackIsDark ? '#ffffff' : '#000000';
    const useLightText = best.toLowerCase() === '#ffffff';

    // Keep a reference sample for any luminance checks elsewhere.
    setBackBgSampleHex(normalizedBg ?? (useLightText ? '#0b0b0f' : '#ffffff'));
    const light = '#ffffff';
    const dark = '#111827';
    setInLovingMemoryColor(useLightText ? light : dark);
    setBackNameColor(useLightText ? light : dark);
    setBackDatesColor(useLightText ? light : dark);
    setPrayerColor(useLightText ? light : dark);
  }, []);
  const syncBackTextColors = useCallback(async (opts?: {
    imageSrc?: string | null;
    fallbackIsDark?: boolean;
  }) => {
    const fallbackIsDark = opts?.fallbackIsDark ?? false;
    const imageSrc = typeof opts?.imageSrc !== 'undefined' ? opts?.imageSrc : backBgImage;
    if (imageSrc) {
      const avg = await getAverageImageHex(imageSrc);
      applyBackTextPalette(avg, fallbackIsDark);
      return;
    }

    // No image selected: use a representative metal/paper background color.
    if (cardType === 'paper') {
      applyBackTextPalette('#ffffff', false);
      return;
    }
    const metalHex = METAL_SAMPLE_HEX[backMetalFinish] ?? '#ffffff';
    applyBackTextPalette(metalHex, relativeLuminance(metalHex) < 0.45);
  }, [applyBackTextPalette, backBgImage, backMetalFinish, cardType, getAverageImageHex]);

  // Helper kept for existing call sites (now auto-detects instead of trusting the boolean).
  const updateBackTextColors = (fallbackIsDark: boolean) => {
    void syncBackTextColors({
      fallbackIsDark
    });
  };
  useEffect(() => {
    void syncBackTextColors();
  }, [syncBackTextColors]);

  // Sync front text colors when photo changes
  useEffect(() => {
    void syncFrontTextColors(deceasedPhoto);
  }, [deceasedPhoto, syncFrontTextColors]);

  // Memorial photo state - supports multiple photos with individual sizes
  const [memorialPhotos, setMemorialPhotos] = useState<{
    src: string;
    size: EaselPhotoSize;
  }[]>([]);
  const memorialPhotosInputRef = useRef<HTMLInputElement>(null);

  // Celebration of Life photo state - separate from memorial photos
  const [celebrationPhotos, setCelebrationPhotos] = useState<{
    src: string;
    size: EaselPhotoSize;
  }[]>([]);
  const celebrationPhotosInputRef = useRef<HTMLInputElement>(null);

  // Legacy alias for compatibility (combines both types for total count)
  const easelPhotos = [...memorialPhotos, ...celebrationPhotos];
  const easelPhotosInputRef = memorialPhotosInputRef; // Keep for backward compat

  // Shipping address state
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingStreet, setShippingStreet] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [shippingZip, setShippingZip] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const textDragStartRef = useRef<{
    x: number;
    y: number;
    posX: number;
    posY: number;
  } | null>(null);
  const textPinchStartRef = useRef<{
    distance: number;
    size: number;
  } | null>(null);
  const textPointerCacheRef = useRef<Map<number, PointerEvent>>(new Map());
  const photoInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const photoContainerRef = useRef<HTMLDivElement>(null);
  const cardPreviewRef = useRef<HTMLDivElement>(null);
  const prayerContainerRef = useRef<HTMLDivElement>(null);
  const prayerTextRef = useRef<HTMLParagraphElement>(null);
  const panStartRef = useRef<{
    x: number;
    y: number;
    panX: number;
    panY: number;
  } | null>(null);
  const pinchStartRef = useRef<{
    distance: number;
    scale: number;
  } | null>(null);
  const pointerCacheRef = useRef<Map<number, PointerEvent>>(new Map());
  const photoZoomRef = useRef(photoZoom);
  useEffect(() => {
    photoZoomRef.current = photoZoom;
  }, [photoZoom]);

  // Text drag handlers
  const handleTextPointerDown = (e: React.PointerEvent, textType: 'name' | 'dates' | 'additional' | 'backDates' | 'prayer' | 'inLovingMemory' | 'backName') => {
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
      const currentPos = textType === 'name' ? namePosition : textType === 'dates' ? datesPosition : textType === 'backDates' ? backDatesPosition : textType === 'prayer' ? {
        x: 50 + prayerPosition.x,
        y: 50 + prayerPosition.y
      } : textType === 'inLovingMemory' ? {
        x: 50 + inLovingMemoryPosition.x,
        y: 50 + inLovingMemoryPosition.y
      } : textType === 'backName' ? {
        x: 50 + backNamePosition.x,
        y: 50 + backNamePosition.y
      } : additionalTextPosition;
      textDragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        posX: currentPos.x,
        posY: currentPos.y
      };
    } else if (textPointerCacheRef.current.size === 2) {
      setResizingText(textType);
      isResizingRef.current = true;
      // Store initial positions to prevent drift during resize
      if (!initialPositionsRef.current) {
        initialPositionsRef.current = {
          namePosition: { ...namePosition },
          datesPosition: { ...datesPosition },
          additionalTextPosition: { ...additionalTextPosition },
        };
      }
      // Capture resize start values for deterministic restoration
      captureResizeStartValues();
      const pointers = Array.from(textPointerCacheRef.current.values());
      const currentSize = textType === 'name' ? nameSize : textType === 'dates' ? typeof frontDatesSize === 'number' ? frontDatesSize : 12 : textType === 'backDates' ? typeof backDatesSize === 'number' ? backDatesSize : 10 : textType === 'prayer' ? prayerTextSize === 'auto' ? autoPrayerFontSize : prayerTextSize : textType === 'inLovingMemory' ? inLovingMemorySize : textType === 'backName' ? backNameSize : additionalTextSize;
      textPinchStartRef.current = {
        distance: getDistance(pointers[0], pointers[1]),
        size: currentSize
      };
    }
  };
  const handleTextPointerMove = (e: React.PointerEvent) => {
    textPointerCacheRef.current.set(e.pointerId, e.nativeEvent);
    if (textPointerCacheRef.current.size === 2 && textPinchStartRef.current && resizingText) {
      const pointers = Array.from(textPointerCacheRef.current.values());
      const currentDistance = getDistance(pointers[0], pointers[1]);
      const scaleChange = currentDistance / textPinchStartRef.current.distance;
      const newSize = Math.max(8, Math.min(60, textPinchStartRef.current.size * scaleChange));
      if (resizingText === 'name') {
        setNameSize(newSize);
      } else if (resizingText === 'dates') {
        setFrontDatesSize(newSize);
      } else if (resizingText === 'backDates') {
        setBackDatesSize(newSize);
      } else if (resizingText === 'prayer') {
        setPrayerTextSize(newSize);
      } else if (resizingText === 'inLovingMemory') {
        setInLovingMemorySize(newSize);
      } else if (resizingText === 'backName') {
        setBackNameSize(newSize);
      } else {
        setAdditionalTextSize(newSize);
      }
      return;
    }
    if (!draggingText || !textDragStartRef.current) return;
    const cardEl = (e.currentTarget as HTMLElement).closest('[data-card-preview]') as HTMLElement | null;
    const rect = (cardEl ?? cardPreviewRef.current)?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return;
    const dx = (e.clientX - textDragStartRef.current.x) / rect.width * 100;
    const dy = (e.clientY - textDragStartRef.current.y) / rect.height * 100;

    // Adjust bounds based on whether border is active (keep text away from border)
    const hasFrontBorder = cardType === 'paper' && frontBorderDesign !== 'none';
    const hasBackBorder = cardType === 'paper' && backBorderDesign !== 'none';
    const isBackText = draggingText === 'backDates' || draggingText === 'prayer' || draggingText === 'inLovingMemory' || draggingText === 'backName';
    const borderPadding = (isBackText ? hasBackBorder : hasFrontBorder) ? 8 : 0;
    const minX = 10 + borderPadding;
    const maxX = 90 - borderPadding;
    const minY = 5 + borderPadding;
    const maxY = 95 - borderPadding;
    const newX = Math.max(minX, Math.min(maxX, textDragStartRef.current.posX + dx));
    const newY = Math.max(minY, Math.min(maxY, textDragStartRef.current.posY + dy));
    if (draggingText === 'name') {
      setNamePosition({
        x: newX,
        y: newY
      });
    } else if (draggingText === 'dates') {
      setDatesPosition({
        x: newX,
        y: newY
      });
    } else if (draggingText === 'backDates') {
      setBackDatesPosition({
        x: newX,
        y: newY
      });
    } else if (draggingText === 'prayer') {
      // Prayer position is offset from center (0,0 = centered)
      setPrayerPosition({
        x: newX - 50,
        y: newY - 50
      });
    } else if (draggingText === 'inLovingMemory') {
      setInLovingMemoryPosition({
        x: newX - 50,
        y: newY - 50
      });
    } else if (draggingText === 'backName') {
      setBackNamePosition({
        x: newX - 50,
        y: newY - 50
      });
    } else {
      setAdditionalTextPosition({
        x: newX,
        y: newY
      });
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
      // End resize operation - allow auto-adjustment again
      isResizingRef.current = false;
      initialPositionsRef.current = null;
      // Clear resize start values when resize ends
      resizeStartValuesRef.current = null;
    }
    if (textPointerCacheRef.current.size === 0) {
      setDraggingText(null);
      textDragStartRef.current = null;
    }
  };
  // Debounce ref for wheel resize to prevent auto-adjustment during scroll resize
  const wheelResizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleTextWheel = (e: React.WheelEvent, textType: 'name' | 'dates' | 'additional' | 'backDates' | 'prayer' | 'inLovingMemory' | 'backName') => {
    e.preventDefault();
    e.stopPropagation();
    
    // Capture start values on first wheel event in a session
    captureResizeStartValues();
    
    // Set resize flag to prevent auto-adjustment during wheel resize
    isResizingRef.current = true;
    
    // Clear any existing timeout
    if (wheelResizeTimeoutRef.current) {
      clearTimeout(wheelResizeTimeoutRef.current);
    }
    
    // Reset resize flag and clear start values after wheel stops (debounced)
    wheelResizeTimeoutRef.current = setTimeout(() => {
      isResizingRef.current = false;
      resizeStartValuesRef.current = null;
    }, 500);
    
    const delta = -e.deltaY * 0.05;
    const currentSize = textType === 'name' ? nameSize : textType === 'dates' ? typeof frontDatesSize === 'number' ? frontDatesSize : 12 : textType === 'backDates' ? typeof backDatesSize === 'number' ? backDatesSize : 10 : textType === 'prayer' ? prayerTextSize === 'auto' ? autoPrayerFontSize : prayerTextSize : textType === 'inLovingMemory' ? inLovingMemorySize : textType === 'backName' ? backNameSize : additionalTextSize;
    const newSize = Math.max(8, Math.min(60, currentSize + delta));
    
    // Check for deterministic restoration (if returning to original size)
    handleDeterministicResize(textType, newSize);
    
    if (textType === 'name') {
      setNameSize(newSize);
    } else if (textType === 'dates') {
      setFrontDatesSize(newSize);
    } else if (textType === 'backDates') {
      setBackDatesSize(newSize);
    } else if (textType === 'prayer') {
      setPrayerTextSize(newSize);
    } else if (textType === 'inLovingMemory') {
      setInLovingMemorySize(newSize);
    } else if (textType === 'backName') {
      setBackNameSize(newSize);
    } else {
      setAdditionalTextSize(newSize);
    }
  };
  const formatDates = (birth: Date | undefined, death: Date | undefined, formatType: 'full' | 'short-month' | 'mmm-dd-yyyy' | 'numeric' | 'year'): string => {
    const monthsFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Format a Date object based on selected format
    const formatDate = (date: Date): string => {
      const month = date.getMonth();
      const day = date.getDate();
      const dayPadded = String(day).padStart(2, '0');
      const monthPadded = String(month + 1).padStart(2, '0');
      const year = date.getFullYear();
      switch (formatType) {
        case 'year':
          return String(year);
        case 'numeric':
          return `${monthPadded}/${dayPadded}/${year}`;
        case 'mmm-dd-yyyy':
          return `${monthsShort[month]} ${dayPadded}, ${year}`;
        case 'short-month':
          return `${monthsShort[month]} ${day}, ${year}`;
        case 'full':
        default:
          return `${monthsFull[month]} ${day}, ${year}`;
      }
    };

    // If no dates provided, show placeholder
    if (!birth && !death) {
      switch (formatType) {
        case 'year':
          return '1945 – 2025';
        case 'numeric':
          return '01/01/1945 – 12/31/2025';
        case 'mmm-dd-yyyy':
          return 'Jan 01, 1945 – Dec 31, 2025';
        case 'short-month':
          return 'Jan 1, 1945 – Dec 31, 2025';
        default:
          return 'January 1, 1945 – December 31, 2025';
      }
    }
    const birthDisplay = birth ? formatDate(birth) : 'Birth Date';
    const deathDisplay = death ? formatDate(death) : 'Death Date';
    return `${birthDisplay} – ${deathDisplay}`;
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
    // Comfortable line height for readability with word wrap
    const mult = 1.25;
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

      // Auto-size to maximize text while keeping readable with word wrap
      const minPx = 16;  // Minimum readable size (increased from 14)
      const containerHeight = container.clientHeight || 200;
      // Scale max based on container - larger containers can have larger text
      // Increased max from 48px to 72px to make prayer text bigger
      const maxPx = Math.max(32, Math.min(72, Math.round(containerHeight * 0.35)));

      // Compute available space inside the prayer container
      const cs = window.getComputedStyle(container);
      const padY = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
      const padX = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);

      // Extra safety margin so wrapped text stays fully inside decorative borders.
      // (Borders are mostly strokes, so text can show through if it reaches the edges.)
      const borderPadding = backBorderDesign !== 'none' ? 16 : 0;
      const availH = Math.max(0, container.clientHeight - padY - borderPadding);
      const availW = Math.max(0, container.clientWidth - padX - borderPadding);

      // Temporarily remove clipping while measuring (clipping can make scrollHeight unreliable on some browsers)
      const prev = {
        fontSize: textEl.style.fontSize,
        lineHeight: textEl.style.lineHeight,
        maxHeight: textEl.style.maxHeight,
        overflow: textEl.style.overflow
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

        // Minimal safety margin
        const safety = 2;
        return rect.height <= availH - safety && rect.width <= availW - safety;
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
      setAutoPrayerFontSize(prevSize => prevSize === best ? prevSize : best);
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
  }, [backText, prayerBold, prayerTextSize, prayerLayoutNonce, cardSide, orientation, showQrCode, qrUrl, showDatesOnBack, showNameOnBack, backNameSize, backDatesSize, backDatesPosition, showInLovingMemory, inLovingMemoryText, inLovingMemorySize, funeralHomeLogo, funeralHomeLogoPosition, funeralHomeLogoSize, backBorderDesign]);
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
    if (!el) return {
      panX,
      panY
    };
    const rect = el.getBoundingClientRect();
    const maxX = Math.max(0, (scale - 1) * rect.width * 0.5);
    const maxY = Math.max(0, (scale - 1) * rect.height * 0.5);
    return {
      panX: Math.max(-maxX, Math.min(maxX, panX)),
      panY: Math.max(-maxY, Math.min(maxY, panY))
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
      // Allow dragging even at 100% zoom by slightly increasing zoom on first drag.
      const MIN_DRAG_ZOOM = 1.08;
      let startPanX = photoPanX;
      let startPanY = photoPanY;
      if (photoZoomRef.current < MIN_DRAG_ZOOM) {
        photoZoomRef.current = MIN_DRAG_ZOOM;
        setPhotoZoom(MIN_DRAG_ZOOM);
        const clamped = clampPhotoPan(photoPanX, photoPanY, MIN_DRAG_ZOOM);
        startPanX = clamped.panX;
        startPanY = clamped.panY;
        setPhotoPanX(clamped.panX);
        setPhotoPanY(clamped.panY);
      }
      setIsPanning(true);
      panStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        panX: startPanX,
        panY: startPanY
      };
    } else if (pointerCacheRef.current.size === 2) {
      const pointers = Array.from(pointerCacheRef.current.values());
      pinchStartRef.current = {
        distance: getDistance(pointers[0], pointers[1]),
        scale: photoZoomRef.current
      };
    }
  };
  const handlePhotoPointerMove = (e: React.PointerEvent) => {
    if (!deceasedPhoto) return;
    pointerCacheRef.current.set(e.pointerId, e.nativeEvent);
    const currentScale = photoZoomRef.current;
    if (pointerCacheRef.current.size === 2 && pinchStartRef.current) {
      const pointers = Array.from(pointerCacheRef.current.values());
      const currentDistance = getDistance(pointers[0], pointers[1]);
      const scaleChange = currentDistance / pinchStartRef.current.distance;
      const newScale = Math.max(1, Math.min(3, pinchStartRef.current.scale * scaleChange));
      photoZoomRef.current = newScale;
      setPhotoZoom(newScale);
      const clamped = clampPhotoPan(photoPanX, photoPanY, newScale);
      setPhotoPanX(clamped.panX);
      setPhotoPanY(clamped.panY);
    } else if (pointerCacheRef.current.size === 1 && panStartRef.current && isPanning) {
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      const nextPanX = panStartRef.current.panX + dx;
      const nextPanY = panStartRef.current.panY + dy;
      const clamped = clampPhotoPan(nextPanX, nextPanY, currentScale);
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
    const newScale = Math.max(1, Math.min(3, photoZoomRef.current + delta));
    photoZoomRef.current = newScale;
    setPhotoZoom(newScale);
    const clamped = clampPhotoPan(photoPanX, photoPanY, newScale);
    setPhotoPanX(clamped.panX);
    setPhotoPanY(clamped.panY);
  };
  const handleImageUpload = (file: File, type: 'photo' | 'back' | 'logo') => {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    if (type === 'photo') {
      // Check if we're editing an additional design
      if (activeDesignIndex >= 0) {
        const updated = [...additionalDesigns];
        updated[activeDesignIndex] = {
          ...updated[activeDesignIndex],
          photo: previewUrl,
          photoZoom: 1,
          photoPanX: 0,
          photoPanY: 0,
          photoRotation: 0
        };
        setAdditionalDesigns(updated);
      } else {
        setDeceasedPhoto(previewUrl);
        setPhotoZoom(1);
        setPhotoPanX(0);
        setPhotoPanY(0);
        void syncFrontTextColors(previewUrl); // Analyze photo and adjust text colors
      }
    } else if (type === 'back') {
      // For additional designs, update backgroundId/customBackground
      if (activeDesignIndex >= 0) {
        const updated = [...additionalDesigns];
        updated[activeDesignIndex] = {
          ...updated[activeDesignIndex],
          customBackground: previewUrl,
          backgroundId: null
        };
        setAdditionalDesigns(updated);
      } else {
        setBackBgImage(previewUrl);
        void syncBackTextColors({
          imageSrc: previewUrl,
          fallbackIsDark: true
        });
      }
    } else if (type === 'logo') {
      setFuneralHomeLogo(previewUrl);
    }
    toast.success('Image uploaded!');
  };
  // Memorial Photos handlers
  const handleMemorialPhotosUpload = (files: FileList | null) => {
    if (!files) return;
    const newPhotos: {
      src: string;
      size: EaselPhotoSize;
    }[] = [];
    Array.from(files).forEach(file => {
      const previewUrl = URL.createObjectURL(file);
      newPhotos.push({
        src: previewUrl,
        size: '16x20'
      });
    });
    setMemorialPhotos(prev => [...prev, ...newPhotos]);
    toast.success(`${newPhotos.length} memorial photo${newPhotos.length > 1 ? 's' : ''} added!`);
  };
  const removeMemorialPhoto = (index: number) => {
    setMemorialPhotos(prev => prev.filter((_, i) => i !== index));
  };

  // Celebration of Life Photos handlers
  const handleCelebrationPhotosUpload = (files: FileList | null) => {
    if (!files) return;
    const newPhotos: {
      src: string;
      size: EaselPhotoSize;
    }[] = [];
    Array.from(files).forEach(file => {
      const previewUrl = URL.createObjectURL(file);
      newPhotos.push({
        src: previewUrl,
        size: '16x20'
      });
    });
    setCelebrationPhotos(prev => [...prev, ...newPhotos]);
    toast.success(`${newPhotos.length} celebration photo${newPhotos.length > 1 ? 's' : ''} added!`);
  };
  const removeCelebrationPhoto = (index: number) => {
    setCelebrationPhotos(prev => prev.filter((_, i) => i !== index));
  };
  const currentPackage = (packages as Record<string, PackageConfig>)[selectedPackage] ?? Object.values(packages)[0];
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
      if (mainDesignSize === '3.125x4.875') {
        total += PAPER_SIZE_UPSELL;
      }
      additionalDesigns.forEach(d => {
        if (d.size === '3.125x4.875') {
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

    // Memorial Photos - all are additional (no included photos in packages now)
    const memorialPhotosCost = memorialPhotos.length * ADDITIONAL_PHOTO_PRICE;
    const memorialUpgradedCount = memorialPhotos.filter(p => p.size === '18x24').length;
    total += memorialPhotosCost + memorialUpgradedCount * PHOTO_18X24_UPSELL;

    // Celebration of Life Photos - all are additional
    const celebrationPhotosCost = celebrationPhotos.length * ADDITIONAL_PHOTO_PRICE;
    const celebrationUpgradedCount = celebrationPhotos.filter(p => p.size === '18x24').length;
    total += celebrationPhotosCost + celebrationUpgradedCount * PHOTO_18X24_UPSELL;

    // Premium thickness upgrade (for both metal and paper cards)
    if (upgradeThickness && currentPackage.thickness !== 'premium') {
      // For metal cards: price per set (55 cards)
      // For paper cards: price per set (72 cards)
      const cardsPerSet = cardType === 'metal' ? 55 : 72;
      const totalSets = currentPackage.cards / cardsPerSet + extraSets;
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
  const effectiveThickness: CardThickness = cardType === 'metal' && (upgradeThickness || currentPackage.thickness === 'premium') ? 'premium' : 'standard';
  const effectiveShipping = 'express'; // 48-72 hours delivery

  // Generate print preview by capturing the actual visible design preview cards
  // This captures exactly what the user sees in the design preview
  // Works on both desktop and mobile by finding the visible card element
  const handleGeneratePrintPreview = async () => {
    setGeneratingPreview(true);
    try {
      // Helper function to find the visible card preview element
      const findVisibleCard = (): HTMLElement | null => {
        const allCards = document.querySelectorAll('[data-card-preview]') as NodeListOf<HTMLElement>;
        
        for (const card of allCards) {
          // Check if element is actually visible (not hidden by CSS)
          const rect = card.getBoundingClientRect();
          const style = window.getComputedStyle(card);
          
          // Element is visible if:
          // 1. It has dimensions (width and height > 0)
          // 2. It's not display: none
          // 3. It's not visibility: hidden
          // 4. It's not opacity: 0
          if (
            rect.width > 0 && 
            rect.height > 0 && 
            style.display !== 'none' && 
            style.visibility !== 'hidden' && 
            parseFloat(style.opacity) > 0
          ) {
            return card;
          }
        }
        return null;
      };

      // Store original card side to restore later
      const originalCardSide = cardSide;
      
      // Capture options for high-quality print-ready images
      // Enhanced settings to capture all text including overflow content
      const captureOptions = {
        scale: 4, // High resolution for print quality (300 DPI equivalent)
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
        removeContainer: false,
        // Temporarily adjust styles during capture to ensure all text is visible
        onclone: (clonedDoc: Document) => {
          try {
            // Fix front side text elements
            const frontNameElements = clonedDoc.querySelectorAll('[data-front-name]');
            frontNameElements.forEach((el: Element) => {
              const htmlEl = el as HTMLElement;
              htmlEl.style.overflow = 'visible';
              const textEl = htmlEl.querySelector('[data-front-name-text]') as HTMLElement;
              if (textEl) {
                textEl.style.overflow = 'visible';
                textEl.style.textOverflow = 'clip';
              }
              const parent = htmlEl.parentElement;
              if (parent) {
                parent.style.overflow = 'visible';
              }
            });
            
            const frontDatesElements = clonedDoc.querySelectorAll('[data-front-dates]');
            frontDatesElements.forEach((el: Element) => {
              const htmlEl = el as HTMLElement;
              htmlEl.style.overflow = 'visible';
              const textEl = htmlEl.querySelector('[data-front-dates-text]') as HTMLElement;
              if (textEl) {
                textEl.style.overflow = 'visible';
              }
              const parent = htmlEl.parentElement;
              if (parent) {
                parent.style.overflow = 'visible';
              }
            });
            
            const frontAdditionalElements = clonedDoc.querySelectorAll('[data-front-additional]');
            frontAdditionalElements.forEach((el: Element) => {
              const htmlEl = el as HTMLElement;
              htmlEl.style.overflow = 'visible';
              const textEl = htmlEl.querySelector('[data-front-additional-text]') as HTMLElement;
              if (textEl) {
                textEl.style.overflow = 'visible';
                textEl.style.textOverflow = 'clip';
              }
              const parent = htmlEl.parentElement;
              if (parent) {
                parent.style.overflow = 'visible';
              }
            });
            
            // Fix back side "In Loving Memory" text elements
            const inLovingMemoryElements = clonedDoc.querySelectorAll('[data-in-loving-memory]');
            inLovingMemoryElements.forEach((el: Element) => {
              const htmlEl = el as HTMLElement;
              htmlEl.style.overflow = 'visible';
              htmlEl.style.textOverflow = 'clip';
              htmlEl.style.whiteSpace = 'nowrap';
              const parent = htmlEl.parentElement;
              if (parent) {
                parent.style.overflow = 'visible';
              }
            });
            
            // Also ensure card containers allow overflow during capture
            const cardPreviews = clonedDoc.querySelectorAll('[data-card-preview]');
            cardPreviews.forEach((el: Element) => {
              const htmlEl = el as HTMLElement;
              htmlEl.style.overflow = 'visible';
            });
          } catch (e) {
            // Silently handle any errors during clone manipulation
            console.warn('Error in onclone:', e);
          }
        },
      };

      let frontImage = '';
      let backImage = '';

      // Helper to wait for element to be visible with retries
      const waitForVisibleCard = async (side: 'front' | 'back', maxRetries = 10): Promise<HTMLElement | null> => {
        for (let i = 0; i < maxRetries; i++) {
          const element = findVisibleCard();
          if (element) {
            // Double-check it's actually visible and has dimensions
            const rect = element.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              return element;
            }
          }
          // Wait a bit longer on mobile or for metal cards
          await new Promise(resolve => setTimeout(resolve, i < 3 ? 300 : 200));
        }
        return null;
      };

      // Capture front card - switch to front if needed
      if (cardSide !== 'front') {
        setCardSide('front');
        // Longer wait for mobile or metal cards to ensure rendering
        await new Promise(resolve => setTimeout(resolve, cardType === 'metal' ? 400 : 300));
      }
      
      const frontElement = await waitForVisibleCard('front');
      if (frontElement) {
        try {
          const frontCanvas = await html2canvas(frontElement, captureOptions);
          frontImage = frontCanvas.toDataURL('image/png', 1.0);
        } catch (frontError) {
          console.error('Error capturing front card:', frontError);
          toast.error('Failed to capture front card preview');
        }
      } else {
        toast.error('Front card preview not visible. Please ensure the card is displayed.');
      }

      // Capture back card - switch to back
      setCardSide('back');
      // Longer wait for mobile or metal cards to ensure rendering
      await new Promise(resolve => setTimeout(resolve, cardType === 'metal' ? 400 : 300));
      
      const backElement = await waitForVisibleCard('back');
      if (backElement) {
        try {
          const backCanvas = await html2canvas(backElement, captureOptions);
          backImage = backCanvas.toDataURL('image/png', 1.0);
        } catch (backError) {
          console.error('Error capturing back card:', backError);
          toast.error('Failed to capture back card preview');
        }
      } else {
        toast.error('Back card preview not visible. Please ensure the card is displayed.');
      }

      // Restore original card side
      if (originalCardSide !== 'back') {
        setCardSide(originalCardSide);
      }

      if (!frontImage && !backImage) {
        toast.error('Failed to generate preview. Please ensure images are loaded and cards are visible.');
        return;
      }

      setPrintPreviewImages({
        front: frontImage,
        back: backImage
      });
      setShowPrintPreview(true);
      toast.success('Print preview generated successfully');
    } catch (error) {
      console.error('Error generating preview:', error);
      toast.error('Failed to generate print preview. Please try again.');
    } finally {
      setGeneratingPreview(false);
    }
  };
  const handleDownloadPrintFiles = () => {
    if (!printPreviewImages) return;

    // Download front as PNG for print quality
    const frontLink = document.createElement('a');
    frontLink.href = printPreviewImages.front;
    frontLink.download = `${(deceasedName || 'prayer-card').replace(/\s+/g, '-')}-front-print-ready.png`;
    frontLink.click();

    // Download back
    setTimeout(() => {
      const backLink = document.createElement('a');
      backLink.href = printPreviewImages.back;
      backLink.download = `${(deceasedName || 'prayer-card').replace(/\s+/g, '-')}-back-print-ready.png`;
      backLink.click();
    }, 500);
    
    toast.success('Print-ready files downloaded! These are high-resolution images suitable for professional printing.');
  };
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deceasedName.trim()) {
      toast.error('Please enter the name of the deceased');
      return;
    }
    if (!customerName.trim() || !customerEmail.trim() || !shippingStreet.trim() || !shippingCity.trim() || !shippingState.trim() || !shippingZip.trim() || !shippingPhone.trim()) {
      toast.error('Please fill in all shipping information');
      return;
    }
    setIsSubmitting(true);
    try {
      // Generate print-ready images at high resolution (300 DPI equivalent)
      let frontCardImage = '';
      let backCardImage = '';

      const printCaptureOptions = {
        scale: 4, // Higher scale for print quality
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
        removeContainer: false,
        // Temporarily adjust styles during capture to ensure all text is visible
        onclone: (clonedDoc: Document) => {
          try {
            // Fix front side text elements
            const frontNameElements = clonedDoc.querySelectorAll('[data-front-name]');
            frontNameElements.forEach((el: Element) => {
              const htmlEl = el as HTMLElement;
              htmlEl.style.overflow = 'visible';
              const textEl = htmlEl.querySelector('[data-front-name-text]') as HTMLElement;
              if (textEl) {
                textEl.style.overflow = 'visible';
                textEl.style.textOverflow = 'clip';
              }
              const parent = htmlEl.parentElement;
              if (parent) {
                parent.style.overflow = 'visible';
              }
            });
            
            const frontDatesElements = clonedDoc.querySelectorAll('[data-front-dates]');
            frontDatesElements.forEach((el: Element) => {
              const htmlEl = el as HTMLElement;
              htmlEl.style.overflow = 'visible';
              const textEl = htmlEl.querySelector('[data-front-dates-text]') as HTMLElement;
              if (textEl) {
                textEl.style.overflow = 'visible';
              }
              const parent = htmlEl.parentElement;
              if (parent) {
                parent.style.overflow = 'visible';
              }
            });
            
            const frontAdditionalElements = clonedDoc.querySelectorAll('[data-front-additional]');
            frontAdditionalElements.forEach((el: Element) => {
              const htmlEl = el as HTMLElement;
              htmlEl.style.overflow = 'visible';
              const textEl = htmlEl.querySelector('[data-front-additional-text]') as HTMLElement;
              if (textEl) {
                textEl.style.overflow = 'visible';
                textEl.style.textOverflow = 'clip';
              }
              const parent = htmlEl.parentElement;
              if (parent) {
                parent.style.overflow = 'visible';
              }
            });
            
            // Fix back side "In Loving Memory" text elements
            const inLovingMemoryElements = clonedDoc.querySelectorAll('[data-in-loving-memory]');
            inLovingMemoryElements.forEach((el: Element) => {
              const htmlEl = el as HTMLElement;
              htmlEl.style.overflow = 'visible';
              htmlEl.style.textOverflow = 'clip';
              htmlEl.style.whiteSpace = 'nowrap';
              const parent = htmlEl.parentElement;
              if (parent) {
                parent.style.overflow = 'visible';
              }
            });
            
            // Also ensure card containers allow overflow during capture
            const cardPreviews = clonedDoc.querySelectorAll('[data-card-preview]');
            cardPreviews.forEach((el: Element) => {
              const htmlEl = el as HTMLElement;
              htmlEl.style.overflow = 'visible';
            });
          } catch (e) {
            // Silently handle any errors during clone manipulation
            console.warn('Error in onclone:', e);
          }
        },
      };

      // Helper function to find the visible card preview element
      const findVisibleCard = (): HTMLElement | null => {
        const allCards = document.querySelectorAll('[data-card-preview]') as NodeListOf<HTMLElement>;
        
        for (const card of allCards) {
          const rect = card.getBoundingClientRect();
          const style = window.getComputedStyle(card);
          
          if (
            rect.width > 0 && 
            rect.height > 0 && 
            style.display !== 'none' && 
            style.visibility !== 'hidden' && 
            parseFloat(style.opacity) > 0
          ) {
            return card;
          }
        }
        return null;
      };

      const originalCardSide = cardSide;
      
      // Capture front card
      setCardSide('front');
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const frontElement = findVisibleCard();
      if (frontElement) {
        const frontCanvas = await html2canvas(frontElement, printCaptureOptions);
        frontCardImage = frontCanvas.toDataURL('image/png', 1.0);
      }
      
      // Capture back card
      setCardSide('back');
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const backElement = findVisibleCard();
      if (backElement) {
        const backCanvas = await html2canvas(backElement, printCaptureOptions);
        backCardImage = backCanvas.toDataURL('image/png', 1.0);
      }
      
      // Restore original card side
      if (originalCardSide !== 'back') {
        setCardSide(originalCardSide);
      }

      // Send order to edge function
      const {
        data,
        error
      } = await supabase.functions.invoke('send-order-emails', {
        body: {
          customerEmail,
          customerName,
          shippingAddress: {
            street: shippingStreet,
            city: shippingCity,
            state: shippingState,
            zip: shippingZip,
            phone: shippingPhone
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
            qrUrl
          },
          frontCardImage,
          backCardImage,
          easelPhotos // All easel photos as base64 data URLs
        }
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

  // Metal cards: 2" x 3.5" (credit card size), Paper cards: 2.625x4.375 or 3.125x4.875
  // Designer cards use CSS physical units (in) so they can be calibrated by the browser.
  // Note: true physical size still depends on OS scaling + browser zoom.
  const getCardClass = (forSidebar = false) => {
    if (cardType === 'paper') {
      const activeSize = activeDesignIndex === -1 ? mainDesignSize : additionalDesigns[activeDesignIndex]?.size || '2.625x4.375';

      // Use actual inch-based sizes for sidebar preview (scaled up for visibility)
      if (forSidebar) {
        return activeSize === '3.125x4.875' 
          ? 'aspect-[3.125/4.875] w-[3.125in] max-w-[90vw] sm:max-w-none' 
          : 'aspect-[2.625/4.375] w-[2.625in] max-w-[85vw] sm:max-w-none';
      }
      // Mobile: use viewport-relative sizing, desktop: use inch-based
      return activeSize === '3.125x4.875' 
        ? 'aspect-[3.125/4.875] w-full max-w-[280px] sm:max-w-[3.125in] sm:w-[3.125in]' 
        : 'aspect-[2.625/4.375] w-full max-w-[240px] sm:max-w-[2.625in] sm:w-[2.625in]';
    }

    // Metal cards
    if (forSidebar) {
      return orientation === 'landscape' 
        ? 'aspect-[3.5/2] w-[3.5in] max-w-[90vw] sm:max-w-none' 
        : 'aspect-[2/3.5] w-[2in] max-w-[85vw] sm:max-w-none';
    }

    // Mobile: use viewport-relative sizing, desktop: use inch-based
    // Width determines height via aspect ratio: portrait 2in x 3.5in, landscape 3.5in x 2in
    return orientation === 'landscape' 
      ? 'aspect-[3.5/2] w-full max-w-[280px] sm:max-w-[3.5in] sm:w-[3.5in]' 
      : 'aspect-[2/3.5] w-full max-w-[200px] sm:max-w-[2in] sm:w-[2in]';
  };
  const cardClass = getCardClass();
  const sidebarCardClass = getCardClass(true);

  // Paper corner radius state - simple toggle
  const [paperCornerRadius, setPaperCornerRadius] = useState<'none' | 'medium'>('none');
  const getCardRounding = () => {
    if (cardType === 'metal') return 'rounded-2xl';
    if (cardType === 'paper' && paperCornerRadius === 'medium') return 'rounded-lg';
    return '';
  };
  const cardRounding = getCardRounding();

  // Compute active photo and settings based on which design is being edited
  const activeDesign = activeDesignIndex >= 0 ? additionalDesigns[activeDesignIndex] : null;
  const activePhoto = activeDesign?.photo ?? deceasedPhoto;
  const activePhotoZoom = activeDesign?.photoZoom ?? photoZoom;
  const activePhotoPanX = activeDesign?.photoPanX ?? photoPanX;
  const activePhotoPanY = activeDesign?.photoPanY ?? photoPanY;
  const activePhotoRotation = activeDesign?.photoRotation ?? photoRotation;
  const activePhotoBrightness = activeDesign?.photoBrightness ?? photoBrightness;
  const activePhotoFade = activeDesign?.photoFade ?? photoFade;
  return <>
      {/* Card Type Selection Modal */}
      <Dialog open={showTypeModal} onOpenChange={open => !open && navigate('/')}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold text-center">Choose Your Card Type</DialogTitle>
            <DialogDescription className="text-center">
              Select the type of prayer cards you'd like to design
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid md:grid-cols-2 gap-6 py-6">
            {/* Paper Cards Option */}
            <button onClick={() => handleSelectCardType('paper')} className="group relative overflow-hidden rounded-xl border-2 border-border hover:border-primary transition-all p-6 text-left bg-card hover:bg-accent/50">
              <div className="aspect-[4/3] mb-4 rounded-lg overflow-hidden bg-muted">
                <img src={paperCardsProduct} alt="Paper Prayer Cards" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
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
            <button onClick={() => handleSelectCardType('metal')} className="group relative overflow-hidden rounded-xl border-2 border-border hover:border-primary transition-all p-6 text-left bg-card hover:bg-accent/50">
              <div className="absolute top-4 right-4 z-10">
                <span className="bg-secondary text-secondary-foreground text-xs font-medium px-3 py-1 rounded-full">
                  PREMIUM
                </span>
              </div>
              <div className="aspect-[4/3] mb-4 rounded-lg overflow-hidden bg-muted">
                <img src={metalCardProduct} alt="Metal Prayer Cards" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
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
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="text-base sm:text-lg font-bold text-white truncate">LuxuryPrayerCards.com</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {step === 1 && <Button type="button" variant="outline" size="sm" onClick={handleGeneratePrintPreview} disabled={generatingPreview} className="border-slate-600 text-slate-300 hover:bg-slate-700 text-xs sm:text-sm">
                  {generatingPreview ? <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" /> : <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />}
                  <span className="hidden xs:inline">Print Preview</span>
                  <span className="xs:hidden">Preview</span>
                </Button>}
              <div className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/40 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 animate-pulse">
                <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-amber-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-amber-300 whitespace-nowrap">Delivered in 48-72 Hours</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-400 hidden sm:block">
                Step {Math.min(step, 4)} of 4
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`container mx-auto px-2 sm:px-3 md:px-4 py-2 sm:py-3 ${step === 1 ? 'max-w-6xl' : 'max-w-4xl'}`}>
        <div className="text-center mb-2 sm:mb-3">
          <h1 className="text-lg sm:text-xl font-bold text-white mb-1">
            {step === 1 && `Design Your ${cardType === 'paper' ? 'Photo Prayer Card' : 'Metal Prayer Card'}${additionalDesigns.length > 0 ? 's' : ''}`}
            {step === 2 && (cardType === 'paper' ? 'Review Your Order' : 'Choose Your Package')}
            {step === 3 && 'Shipping Information'}
            {step === 4 && 'Review & Order'}
            {step === 5 && 'Order Confirmed!'}
          </h1>
          <p className="text-slate-400 text-sm">
            {step === 1 && 'Customize your cards and set quantities'}
            {step === 2 && (cardType === 'paper' ? 'Confirm your card selection and options' : 'Select quantity and shipping options')}
            {step === 3 && 'Enter your shipping details'}
            {step === 4 && 'Confirm your order details'}
          </p>
        </div>

        {/* Prominent Controls Section - Mobile First Design */}
        {step === 1 && <div className="mb-3 sm:mb-4 space-y-3 sm:space-y-4">
          {/* Card Thickness Selection - For both paper and metal */}
          <div className="bg-slate-700/50 rounded-xl p-3 sm:p-4">
            <h3 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3 text-center">CHOOSE YOUR CARD THICKNESS</h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button 
                type="button" 
                onClick={() => setUpgradeThickness(false)} 
                className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${!upgradeThickness ? 'border-amber-500 bg-amber-500/20' : 'border-slate-600 hover:border-slate-500'}`}
              >
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-white mb-1">.040"</div>
                  <div className="text-slate-400 text-xs sm:text-sm">Standard Thickness</div>
                  <div className="text-amber-400 font-semibold mt-1 sm:mt-2 text-xs sm:text-sm">Included</div>
                </div>
              </button>
              <button 
                type="button" 
                onClick={() => setUpgradeThickness(true)} 
                className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${upgradeThickness ? 'border-amber-500 bg-amber-500/20' : 'border-slate-600 hover:border-slate-500'}`}
              >
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-white mb-1">.080"</div>
                  <div className="text-slate-400 text-xs sm:text-sm">Premium Thickness</div>
                  <div className="text-amber-400 font-semibold mt-1 sm:mt-2 text-xs sm:text-sm">+$15/set</div>
                </div>
              </button>
            </div>
          </div>

          {/* Orientation and Side Selection */}
          <div className="space-y-3">
            {/* Orientation Toggle */}
            <div className="flex items-center justify-center gap-2">
              <Button 
                type="button" 
                variant={orientation === 'landscape' ? 'default' : 'outline'} 
                onClick={() => cardType === 'metal' && setOrientation('landscape')} 
                disabled={cardType === 'paper'}
                className={orientation === 'landscape' ? 'bg-amber-600 hover:bg-amber-700 !text-white' : 'border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-50'} 
                size="sm"
              >
                <RectangleHorizontal className="h-4 w-4 mr-2" />
                Landscape
              </Button>
              <Button 
                type="button" 
                variant={orientation === 'portrait' ? 'default' : 'outline'} 
                onClick={() => setOrientation('portrait')} 
                className={orientation === 'portrait' ? 'bg-amber-600 hover:bg-amber-700 !text-white' : 'border-slate-600 text-slate-300 hover:bg-slate-700'} 
                size="sm"
              >
                <RectangleVertical className="h-4 w-4 mr-2" />
                Portrait
              </Button>
            </div>

            {/* Front/Back Side Selection */}
            <div className="flex items-center justify-center gap-2">
              <Button 
                type="button" 
                variant={cardSide === 'front' ? 'default' : 'outline'} 
                onClick={() => setCardSide('front')} 
                className={cardSide === 'front' ? 'bg-amber-600 hover:bg-amber-700 !text-white' : 'border-slate-600 text-slate-300 hover:bg-slate-700'} 
                size="sm"
              >
                Front (Photo)
              </Button>
              <Button 
                type="button" 
                variant={cardSide === 'back' ? 'default' : 'outline'} 
                onClick={() => setCardSide('back')} 
                className={cardSide === 'back' ? 'bg-amber-600 hover:bg-amber-700 !text-white' : 'border-slate-600 text-slate-300 hover:bg-slate-700'} 
                size="sm"
              >
                Back (Info + QR)
              </Button>
            </div>
          </div>
        </div>}

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-2 sm:p-3">
            <form onSubmit={handleSubmitOrder}>
              {/* Step 1: Card Design */}
              {step === 1 && <div className="md:flex md:gap-6">
                  {/* Left Column: Preview (sticky on medium+ screens) */}
                  <div className="hidden md:flex md:flex-col md:items-center md:justify-start md:flex-shrink-0 md:sticky md:top-14 md:self-start">
                    {/* Paper Card Size Selection - Above Front/Back */}
                    {cardType === 'paper' && <div className="w-full bg-slate-700/50 rounded-lg p-2 mb-2">
                        <h3 className="text-xs font-semibold text-white mb-1.5 text-center">
                          Card Size {activeDesignIndex >= 0 ? `(Design ${activeDesignIndex + 2})` : ''}
                        </h3>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button type="button" onClick={() => {
                        if (activeDesignIndex === -1) {
                          setMainDesignSize('2.625x4.375');
                        } else {
                          const updated = [...additionalDesigns];
                          updated[activeDesignIndex] = {
                            ...updated[activeDesignIndex],
                            size: '2.625x4.375'
                          };
                          setAdditionalDesigns(updated);
                        }
                      }} className={`p-1 rounded-lg border-2 transition-all ${(activeDesignIndex === -1 ? mainDesignSize : additionalDesigns[activeDesignIndex]?.size) === '2.625x4.375' ? 'border-amber-500 bg-amber-500/20' : 'border-slate-600 hover:border-slate-500'}`}>
                            <div className="text-center">
                              <div className="text-xs font-bold text-white">2.5"×4.25"</div>
                              <div className="text-amber-400 font-semibold text-[10px]">Included</div>
                            </div>
                          </button>
                          <button type="button" onClick={() => {
                        if (activeDesignIndex === -1) {
                          setMainDesignSize('3.125x4.875');
                        } else {
                          const updated = [...additionalDesigns];
                          updated[activeDesignIndex] = {
                            ...updated[activeDesignIndex],
                            size: '3.125x4.875'
                          };
                          setAdditionalDesigns(updated);
                        }
                      }} className={`p-1 rounded-lg border-2 transition-all ${(activeDesignIndex === -1 ? mainDesignSize : additionalDesigns[activeDesignIndex]?.size) === '3.125x4.875' ? 'border-amber-500 bg-amber-500/20' : 'border-slate-600 hover:border-slate-500'}`}>
                            <div className="text-center">
                              <div className="text-xs font-bold text-white">3"×4.75"</div>
                              <div className="text-amber-400 font-semibold text-[10px]">+${PAPER_SIZE_UPSELL}</div>
                            </div>
                          </button>
                        </div>
                      </div>}
                    
                    {/* Front/Back Toggle - Above the card */}
                    <div className="flex justify-center gap-1 mb-2">
                      <Button type="button" variant={cardSide === 'front' ? 'default' : 'outline'} onClick={() => setCardSide('front')} className={cardSide === 'front' ? 'bg-amber-600 hover:bg-amber-700 !text-white' : 'border-slate-600 text-slate-300 hover:bg-slate-700'} size="sm">
                        Front (Photo)
                      </Button>
                      <Button type="button" variant={cardSide === 'back' ? 'default' : 'outline'} onClick={() => setCardSide('back')} className={cardSide === 'back' ? 'bg-amber-600 hover:bg-amber-700 !text-white' : 'border-slate-600 text-slate-300 hover:bg-slate-700'} size="sm">
                        Back (Info + QR)
                      </Button>
                    </div>
                    
                    {/* Card Preview - Front */}
                    {cardSide === 'front' && <div className="flex flex-col items-center gap-2">
                        <div data-card-preview className={`${sidebarCardClass} ${cardRounding} overflow-hidden shadow-2xl relative cursor-pointer ${cardType === 'metal' && metalBorderColor !== 'none' ? `bg-gradient-to-br ${getMetalBorderGradient(metalBorderColor)} p-1` : ''}`} onClick={() => !activePhoto && photoInputRef.current?.click()}>
                          <div className={`w-full h-full ${cardType === 'metal' && metalBorderColor !== 'none' ? 'rounded-lg' : cardRounding} overflow-hidden bg-slate-700 flex items-center justify-center relative ${!activePhoto ? 'hover:bg-slate-600 transition-colors' : ''}`}>
                            {activePhoto ? <>
                                {frontBorderDesign === 'traditional-frame' && photoShape !== 'full' ? (
                                  <div className="flex items-center justify-center w-full h-full" style={{
                                    width: photoShape === 'circle' ? '60%' : '70%',
                                    height: photoShape === 'circle' ? '60%' : '70%',
                                    borderRadius: photoShape === 'circle' ? '50%' : '8px',
                                    overflow: 'hidden',
                                    position: 'relative',
                                  }}>
                                    <img src={activePhoto} alt="Deceased" draggable={false} className="w-full h-full object-cover pointer-events-none select-none" style={{
                                      transform: `translate(${activePhotoPanX}px, ${activePhotoPanY}px) scale(${activePhotoZoom}) rotate(${activePhotoRotation}deg)`,
                                      transformOrigin: 'center',
                                      filter: `brightness(${activePhotoBrightness}%)`
                                    }} />
                                  </div>
                                ) : (
                                  <img src={activePhoto} alt="Deceased" draggable={false} className="w-full h-full object-cover pointer-events-none select-none" style={{
                                    transform: `translate(${activePhotoPanX}px, ${activePhotoPanY}px) scale(${activePhotoZoom}) rotate(${activePhotoRotation}deg)`,
                                    transformOrigin: 'center',
                                    filter: `brightness(${activePhotoBrightness}%)`
                                  }} />
                                )}
                                {activePhotoFade && (() => {
                            const hex = fadeColor;
                            const r = parseInt(hex.slice(1, 3), 16);
                            const g = parseInt(hex.slice(3, 5), 16);
                            const b = parseInt(hex.slice(5, 7), 16);
                            const fadeStyle = fadeShape === 'circle' ? {
                              background: `radial-gradient(ellipse at center, transparent 30%, rgba(${r},${g},${b},0.3) 60%, rgba(${r},${g},${b},0.7) 100%)`
                            } : {
                              background: `linear-gradient(to bottom, transparent 40%, rgba(${r},${g},${b},0.3) 70%, rgba(${r},${g},${b},0.6) 100%)`
                            };
                            return <div className="absolute inset-0 pointer-events-none" style={fadeStyle} />;
                          })()}
                              </> : <div className="text-center p-4 pointer-events-none">
                                <ImageIcon className="h-10 w-10 text-slate-400 mx-auto mb-2" />
                                <p className="text-slate-400 text-xs">Click to upload</p>
                              </div>}
                            
                            {/* Text Overlay - Name - FIXED BOUNDING CONTAINER */}
                            {showNameOnFront && <div 
                          className="absolute touch-none select-none rounded"
                          data-front-name
                          style={{
                            left: `${namePosition.x}%`,
                            top: `${namePosition.y}%`,
                            transform: 'translate(-50%, -50%)',
                            width: '95%',
                            maxWidth: '95%',
                            overflow: 'visible',
                            whiteSpace: 'nowrap',
                            cursor: draggingText === 'name' || resizingText === 'name' ? 'grabbing' : 'grab',
                            boxShadow: draggingText === 'name' || resizingText === 'name' ? '0 0 0 2px #d97706' : 'none',
                            zIndex: 15,
                            pointerEvents: 'auto',
                            padding: '2px 4px'
                          }} 
                          onPointerDown={e => handleTextPointerDown(e, 'name')} 
                          onPointerMove={handleTextPointerMove} 
                          onPointerUp={handleTextPointerUp} 
                          onPointerCancel={handleTextPointerUp} 
                          onWheel={e => handleTextWheel(e, 'name')}
                        >
                                <div style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              width: 'max-content',
                              overflow: 'visible',
                            }}>
                                  <span data-front-name-text style={{
                                fontFamily: nameFont,
                                fontSize: `${Math.max(10, nameSize * 0.7)}px`,
                                color: nameColor,
                                fontWeight: nameBold ? 'bold' : 'normal',
                                textShadow: nameTextShadow ? '0 1px 2px rgba(0,0,0,0.5)' : 'none',
                                whiteSpace: 'pre-line',
                                textAlign: 'center',
                                display: 'block',
                                lineHeight: 1.2,
                                overflow: 'visible',
                                textOverflow: 'clip',
                              }}>
                                    {deceasedName || 'Name Here'}
                                  </span>
                                </div>
                              </div>}
                            
                            {/* Text Overlay - Dates - FIXED BOUNDING CONTAINER */}
                            {showDatesOnFront && <div 
                          className="absolute touch-none select-none rounded"
                          data-front-dates
                          style={{
                            left: `${datesPosition.x}%`,
                            top: `${datesPosition.y}%`,
                            transform: 'translate(-50%, -50%)',
                            width: '95%',
                            maxWidth: '95%',
                            overflow: 'visible',
                            minHeight: frontDatesSize === 'auto' ? '20px' : `${Math.max(16, (typeof frontDatesSize === 'number' ? frontDatesSize : 12) * 0.65 * 2.5)}px`,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingTop: '4px',
                            paddingBottom: '4px',
                            cursor: draggingText === 'dates' || resizingText === 'dates' ? 'grabbing' : 'grab',
                            boxShadow: draggingText === 'dates' || resizingText === 'dates' ? '0 0 0 2px #d97706' : 'none',
                            zIndex: 15,
                            pointerEvents: 'auto',
                            boxSizing: 'border-box'
                          }} 
                          onPointerDown={e => handleTextPointerDown(e, 'dates')} 
                          onPointerMove={handleTextPointerMove} 
                          onPointerUp={handleTextPointerUp} 
                          onPointerCancel={handleTextPointerUp} 
                          onWheel={e => handleTextWheel(e, 'dates')}
                        >
                                <div data-front-dates-text style={{
                                  width: '100%',
                                  maxWidth: '100%',
                                  overflow: 'visible'
                                }}>
                                  <AutoFitText 
                                    text={formatDates(birthDate, deathDate, frontDateFormat)} 
                                    maxWidth="100%" 
                                    containerWidth="100%"
                                    containerHeight={frontDatesSize === 'auto' ? '20px' : `${Math.max(16, (typeof frontDatesSize === 'number' ? frontDatesSize : 12) * 0.65 * 2.5)}px`}
                                    allowWrap={false} 
                                    style={{
                                      fontFamily: datesFont,
                                      fontSize: frontDatesSize === 'auto' ? '8px' : `${Math.max(7, (typeof frontDatesSize === 'number' ? frontDatesSize : 12) * 0.65)}px`,
                                      color: frontDatesColor,
                                      fontWeight: datesBold ? 'bold' : 'normal',
                                      textShadow: datesTextShadow ? '0 1px 2px rgba(0,0,0,0.5)' : 'none',
                                      textAlign: 'center',
                                      lineHeight: 1.2
                                    }} 
                                  />
                                </div>
                              </div>}

                            {/* Text Overlay - Additional - FIXED BOUNDING CONTAINER */}
                            {showAdditionalText && <div 
                          className="absolute touch-none select-none rounded"
                          data-front-additional
                          style={{
                            left: `${additionalTextPosition.x}%`,
                            top: `${additionalTextPosition.y}%`,
                            transform: 'translate(-50%, -50%)',
                            width: '90%',
                            maxWidth: '90%',
                            overflow: 'visible',
                            cursor: draggingText === 'additional' || resizingText === 'additional' ? 'grabbing' : 'grab',
                            boxShadow: draggingText === 'additional' || resizingText === 'additional' ? '0 0 0 2px #d97706' : 'none',
                            zIndex: 15,
                            pointerEvents: 'auto',
                            padding: '2px 4px'
                          }} 
                          onPointerDown={e => handleTextPointerDown(e, 'additional')} 
                          onPointerMove={handleTextPointerMove} 
                          onPointerUp={handleTextPointerUp} 
                          onPointerCancel={handleTextPointerUp} 
                          onWheel={e => handleTextWheel(e, 'additional')}
                        >
                                <div style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              width: 'max-content',
                              overflow: 'visible',
                            }}>
                                  <span data-front-additional-text style={{
                                fontFamily: additionalTextFont,
                                fontSize: `${Math.max(10, additionalTextSize * 0.7)}px`,
                                color: additionalTextColor,
                                fontWeight: additionalTextBold ? 'bold' : 'normal',
                                textShadow: additionalTextShadow ? '0 1px 2px rgba(0,0,0,0.5)' : 'none',
                                whiteSpace: 'pre-wrap',
                                display: 'block',
                                lineHeight: 1.2,
                                maxWidth: '100%',
                                textAlign: 'center',
                                overflow: 'visible',
                                textOverflow: 'clip',
                              }}>
                                    {additionalText || 'Your text here'}
                                  </span>
                                </div>
                              </div>}
                            
                            {/* Funeral Home Logo - Front Card (Desktop) */}
                            {funeralHomeLogo && <div className="absolute left-1/2 -translate-x-1/2 z-10 pointer-events-none" style={{
                          [funeralHomeLogoPosition === 'top' ? 'top' : 'bottom']: frontBorderDesign !== 'none' ? '10px' : '6px'
                        }}>
                                <img src={funeralHomeLogo} alt="Funeral Home Logo" className="object-contain drop-shadow-md" style={{
                            height: `${Math.min(funeralHomeLogoSize * 0.4, 24)}px`,
                            maxWidth: '50%'
                          }} />
                              </div>}
                            
                            {/* QR Code - Front Card (Desktop) - Only for paper cards, not metal */}
                            {qrValue && cardType === 'paper' && <div className="absolute z-10 pointer-events-none" style={{
                          bottom: frontBorderDesign !== 'none' ? '14px' : '8px',
                          right: frontBorderDesign !== 'none' ? '14px' : '8px'
                        }}>
                                <QrCodeBadge value={qrValue} size={32} level="M" paddingClassName="p-1" />
                              </div>}
                            
                            {/* Decorative Border Overlay */}
                            {cardType === 'paper' && frontBorderDesign !== 'none' && <div className="absolute inset-0 z-20 pointer-events-none">
                                <DecorativeBorderOverlay type={frontBorderDesign} color={frontBorderColor} />
                              </div>}
                          </div>
                        </div>
                        <p className="text-slate-500 text-xs text-center">Front of card</p>
                      </div>}
                    
                    {/* Card Preview - Back */}
                    {cardSide === 'back' && <div className="flex flex-col items-center gap-2">
                        <div data-card-preview className={`${sidebarCardClass} ${cardRounding} shadow-2xl relative overflow-hidden`}>
                          {(() => {
                        const currentBackMetal = METAL_BG_OPTIONS.find(m => m.id === backMetalFinish) || METAL_BG_OPTIONS[0];
                        const isBackDark = relativeLuminance(backBgSampleHex) < 0.45;
                         const resolvedPrayerFontPx = prayerTextSize === 'auto' ? autoPrayerFontSize : prayerTextSize;
                        return <div className={`absolute inset-0 ${cardRounding} overflow-hidden ${!backBgImage ? cardType === 'metal' ? `bg-gradient-to-br ${currentBackMetal.gradient}` : 'bg-white' : ''}`}>
                                {backBgImage && <img src={backBgImage} alt="Background" className="absolute w-full h-full object-cover" style={{
                            transform: `scale(${backBgZoom}) translate(${backBgPanX}%, ${backBgPanY}%) rotate(${backBgRotation}deg)`,
                            transformOrigin: 'center center'
                          }} />}
                                <div className={`relative z-10 h-full ${cardRounding}`} style={{
                            padding: '6px',
                            paddingTop: backBorderDesign !== 'none' ? '18px' : '6px',
                            // Extra safe area so QR isn't covered by decorative borders.
                            paddingBottom: backBorderDesign !== 'none' ? '24px' : '6px'
                          }}>
                                  {/* Funeral Home Logo - Top */}
                                  {funeralHomeLogo && funeralHomeLogoPosition === 'top' && <div className="absolute left-1/2 -translate-x-1/2 z-10 pointer-events-none" style={{
                                    top: backBorderDesign !== 'none' ? '16px' : '8px'
                                  }}>
                                      <img src={funeralHomeLogo} alt="Funeral Home Logo" className="object-contain" style={{
                                  height: `${Math.max(10, funeralHomeLogoSize * 0.35)}px`,
                                  maxWidth: '60%'
                                }} />
                                    </div>}
                                  {/* In Loving Memory - ABSOLUTE POSITIONED */}
                                  {showInLovingMemory && <div 
                                className="absolute touch-none select-none rounded" 
                                style={{
                                  left: `${50 + inLovingMemoryPosition.x}%`,
                                  top: `${50 + inLovingMemoryPosition.y}%`,
                                  transform: 'translate(-50%, -50%)',
                                  maxWidth: '95%',
                                  width: 'max-content',
                                  overflow: 'visible',
                                  whiteSpace: 'nowrap',
                                  cursor: draggingText === 'inLovingMemory' || resizingText === 'inLovingMemory' ? 'grabbing' : 'grab',
                                  boxShadow: draggingText === 'inLovingMemory' || resizingText === 'inLovingMemory' ? '0 0 0 2px #d97706' : 'none',
                                  zIndex: 15,
                                  pointerEvents: 'auto',
                                  padding: '2px 4px'
                                }}
                                onPointerDown={e => handleTextPointerDown(e, 'inLovingMemory')} 
                                onPointerMove={handleTextPointerMove} 
                                onPointerUp={handleTextPointerUp} 
                                onPointerCancel={handleTextPointerUp} 
                                onWheel={e => handleTextWheel(e, 'inLovingMemory')}
                              >
                                        <div data-in-loving-memory style={{
                                    fontFamily: inLovingMemoryFont,
                                    color: inLovingMemoryColor,
                                    fontSize: `${Math.max(5, inLovingMemorySize * 0.5)}px`,
                                    fontWeight: inLovingMemoryBold ? 'bold' : 'normal',
                                    textAlign: 'center',
                                    overflow: 'visible',
                                    whiteSpace: 'nowrap',
                                  }}>
                                          {inLovingMemoryText}
                                        </div>
                                      </div>}
                                  {/* Back Name - ABSOLUTE POSITIONED */}
                                  {showNameOnBack && <div 
                                className="absolute touch-none select-none rounded"
                                style={{
                                  left: `${50 + backNamePosition.x}%`,
                                  top: `${50 + backNamePosition.y}%`,
                                  transform: 'translate(-50%, -50%)',
                                  maxWidth: '90%',
                                  overflow: 'visible',
                                  minHeight: `${Math.max(16, backNameSize * 0.5 * 2.5)}px`,
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  paddingTop: '3px',
                                  paddingBottom: '3px',
                                  cursor: draggingText === 'backName' || resizingText === 'backName' ? 'grabbing' : 'grab',
                                  boxShadow: draggingText === 'backName' || resizingText === 'backName' ? '0 0 0 2px #d97706' : 'none',
                                  zIndex: 15,
                                  pointerEvents: 'auto'
                                }}
                                onPointerDown={e => handleTextPointerDown(e, 'backName')} 
                                onPointerMove={handleTextPointerMove} 
                                onPointerUp={handleTextPointerUp} 
                                onPointerCancel={handleTextPointerUp} 
                                onWheel={e => handleTextWheel(e, 'backName')}
                              >
                                        <div style={{
                                    fontFamily: backNameFont,
                                    color: backNameColor,
                                    fontSize: `${Math.max(6, backNameSize * 0.5)}px`,
                                    fontWeight: backNameBold ? 'bold' : 'normal',
                                    textAlign: 'center',
                                    overflow: 'visible',
                                    textOverflow: 'clip',
                                    whiteSpace: 'pre-line',
                                    lineHeight: 1.3,
                                    width: '100%',
                                    maxHeight: '100%'
                                  }}>
                                          {deceasedName || 'Name Here'}
                                        </div>
                                      </div>}
                                  {/* Back Dates - ABSOLUTE POSITIONED */}
                                  {showDatesOnBack && <div 
                                className="absolute touch-none select-none rounded" 
                                style={{
                                  left: `${backDatesPosition.x}%`,
                                  top: `${backDatesPosition.y}%`,
                                  transform: 'translate(-50%, -50%)',
                                  width: '95%',
                                  maxWidth: '95%',
                                  overflow: 'visible',
                                  minHeight: backDatesSize === 'auto' ? '16px' : `${Math.max(12, (typeof backDatesSize === 'number' ? backDatesSize : 9) * 0.5 * 2.5)}px`,
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  paddingTop: '3px',
                                  paddingBottom: '3px',
                                  cursor: draggingText === 'backDates' || resizingText === 'backDates' ? 'grabbing' : 'grab',
                                  boxShadow: draggingText === 'backDates' || resizingText === 'backDates' ? '0 0 0 2px #d97706' : 'none',
                                  zIndex: 15,
                                  pointerEvents: 'auto'
                                }}
                                onPointerDown={e => handleTextPointerDown(e, 'backDates')} 
                                onPointerMove={handleTextPointerMove} 
                                onPointerUp={handleTextPointerUp} 
                                onPointerCancel={handleTextPointerUp} 
                                onWheel={e => handleTextWheel(e, 'backDates')}
                              >
                                        <AutoFitSingleLineText 
                                    text={formatDates(birthDate, deathDate, backDateFormat)} 
                                    maxWidth="100%" 
                                    containerWidth="100%"
                                    containerHeight={backDatesSize === 'auto' ? '16px' : `${Math.max(12, (typeof backDatesSize === 'number' ? backDatesSize : 9) * 0.5 * 2.5)}px`}
                                    style={{
                                      fontFamily: datesFont,
                                      color: backDatesColor,
                                      fontSize: backDatesSize === 'auto' ? '5px' : `${Math.max(4, (typeof backDatesSize === 'number' ? backDatesSize : 9) * 0.5)}px`,
                                      lineHeight: 1.2
                                    }} 
                                  />
                                      </div>}
                                  {/* Prayer - ABSOLUTE POSITIONED */}
                                   <div
                                     className="absolute touch-none select-none"
                                     style={{
                                       left: `${50 + prayerPosition.x}%`,
                                       top: `${50 + prayerPosition.y}%`,
                                       transform: 'translate(-50%, -50%)',
                                       width: '85%',
                                       maxWidth: '85%',
                                       cursor: draggingText === 'prayer' || resizingText === 'prayer' ? 'grabbing' : 'grab',
                                       boxShadow: draggingText === 'prayer' || resizingText === 'prayer' ? '0 0 0 2px #d97706' : 'none',
                                       zIndex: 15,
                                       pointerEvents: 'auto'
                                     }}
                                     onPointerDown={e => handleTextPointerDown(e, 'prayer')} 
                                     onPointerMove={handleTextPointerMove} 
                                     onPointerUp={handleTextPointerUp} 
                                     onPointerCancel={handleTextPointerUp} 
                                     onWheel={e => handleTextWheel(e, 'prayer')}
                                   >
                                     <div
                                       className="text-center w-full"
                                       style={{
                                         fontSize: `${Math.max(5, resolvedPrayerFontPx * 0.5)}px`,
                                         color: prayerColor,
                                         fontWeight: prayerBold ? 'bold' : 'normal',
                                         fontStyle: prayerItalic ? 'italic' : 'normal',
                                         lineHeight: 1.25,
                                         whiteSpace: 'pre-wrap',
                                         overflowWrap: 'anywhere',
                                         wordBreak: 'break-word',
                                       }}
                                     >
                                       {backText}
                                     </div>
                                   </div>
                                  {/* Footer - QR code and/or Logo - ABSOLUTE POSITIONED */}
                                  {qrValue && <div className="absolute left-1/2 -translate-x-1/2 z-10 pointer-events-none" style={{
                                    bottom: backBorderDesign !== 'none' ? '20px' : '8px'
                                  }}>
                                      <QrCodeBadge value={qrValue} size={36} level="M" paddingClassName="p-1" />
                                    </div>}
                                  {funeralHomeLogo && funeralHomeLogoPosition === 'bottom' && <div className="absolute left-1/2 -translate-x-1/2 z-10 pointer-events-none" style={{
                                    bottom: backBorderDesign !== 'none' ? '16px' : '8px'
                                  }}>
                                      <img src={funeralHomeLogo} alt="Funeral Home Logo" className="object-contain" style={{
                                  height: `${Math.max(10, funeralHomeLogoSize * 0.35)}px`,
                                  maxWidth: '60%'
                                }} />
                                    </div>}
                                </div>
                                {cardType === 'paper' && backBorderDesign !== 'none' && <div className="absolute inset-0 z-20 pointer-events-none">
                                    <DecorativeBorderOverlay type={backBorderDesign} color={backBorderColor} />
                                  </div>}
                              </div>;
                      })()}
                        </div>
                        <p className="text-slate-500 text-xs text-center">Back of card</p>
                      </div>}
                  </div>
                  
                  {/* Right Column: All Controls */}
                  <div className="flex-1 space-y-3 min-w-0">

                  {/* Border Style Selection - Paper cards only, at top for easy access on desktop */}
                  {cardType === 'paper' && <div className="hidden md:block bg-slate-700/50 rounded-lg p-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xs font-semibold text-white whitespace-nowrap">
                          {cardSide === 'front' ? 'Front' : 'Back'} Border
                        </h3>
                        <div className="flex items-center gap-1 flex-wrap">
                          {DECORATIVE_BORDERS.map(border => {
                          const currentBorder = cardSide === 'front' ? frontBorderDesign : backBorderDesign;
                          const currentColor = cardSide === 'front' ? frontBorderColor : backBorderColor;
                          return <button key={border.id} type="button" onClick={() => cardSide === 'front' ? setFrontBorderDesign(border.id) : setBackBorderDesign(border.id)} className={`w-8 h-8 rounded border-2 transition-all overflow-hidden relative ${currentBorder === border.id ? 'border-amber-500 ring-1 ring-amber-500/30 scale-105' : 'border-slate-600 hover:border-slate-400'}`} title={border.name}>
                                <div className="absolute inset-0" style={{
                              background: cardSide === 'front' ? deceasedPhoto ? `url(${deceasedPhoto}) center/cover` : 'linear-gradient(135deg, #f8f5f0, #ebe6df)' : backBgImage ? `url(${backBgImage}) center/cover` : 'linear-gradient(135deg, #f8f5f0, #ebe6df)'
                            }} />
                                <div className="absolute inset-0 scale-[5] origin-top-left">
                                  <DecorativeBorderOverlay type={border.id} color={currentColor} />
                                </div>
                              </button>;
                        })}
                        </div>
                        <div className="w-px h-6 bg-slate-600" />
                        <div className="flex items-center gap-1">
                          {(['#d4af37', '#c0c0c0', '#b76e79', '#f8f8f8'] as const).map(color => {
                          const currentColor = cardSide === 'front' ? frontBorderColor : backBorderColor;
                          const setColor = cardSide === 'front' ? setFrontBorderColor : setBackBorderColor;
                          const gradients: Record<string, string> = {
                            '#d4af37': 'linear-gradient(135deg, #ffd700, #b8860b)',
                            '#c0c0c0': 'linear-gradient(135deg, #e8e8e8, #a8a8a8)',
                            '#b76e79': 'linear-gradient(135deg, #e8b4b8, #9e5a65)',
                            '#f8f8f8': 'linear-gradient(135deg, #ffffff, #e0e0e0)'
                          };
                          const titles: Record<string, string> = {
                            '#d4af37': 'Gold',
                            '#c0c0c0': 'Silver',
                            '#b76e79': 'Rose Gold',
                            '#f8f8f8': 'White'
                          };
                          return <button key={color} type="button" onClick={() => setColor(color)} className={`w-5 h-5 rounded-full border-2 transition-all ${currentColor === color ? 'border-amber-400 ring-1 ring-amber-400/40 scale-110' : 'border-slate-500'}`} style={{
                            background: gradients[color]
                          }} title={titles[color]} />;
                        })}
                        </div>
                      </div>
                    </div>}

                  {/* Rounded Corners Toggle - Paper cards only */}
                  {cardType === 'paper' && <div className="hidden md:block bg-slate-700/50 rounded-lg p-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xs font-semibold text-white whitespace-nowrap">Corners</h3>
                        <button type="button" onClick={() => setPaperCornerRadius(paperCornerRadius === 'none' ? 'medium' : 'none')} className={`px-3 py-1 text-xs rounded transition-all flex items-center gap-2 ${paperCornerRadius !== 'none' ? 'bg-amber-500 text-white' : 'bg-slate-600 text-slate-300 hover:bg-slate-500'}`}>
                          <div className={`w-3 h-3 border ${paperCornerRadius !== 'none' ? 'rounded border-white' : 'border-slate-400'}`} />
                          Rounded
                        </button>
                      </div>
                    </div>}

                  {/* Metal Card Thickness Selection - Hidden on mobile since it's shown at top, visible on desktop */}
                  {cardType === 'metal' && <div className="hidden md:block bg-slate-700/50 rounded-xl p-4 mb-4">
                      <h3 className="text-lg font-semibold text-white mb-3 text-center">Choose Your Card Thickness</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <button type="button" onClick={() => setUpgradeThickness(false)} className={`p-4 rounded-lg border-2 transition-all ${!upgradeThickness ? 'border-amber-500 bg-amber-500/20' : 'border-slate-600 hover:border-slate-500'}`}>
                          <div className="text-center">
                            <div className="text-xl font-bold text-white mb-1">.040"</div>
                            <div className="text-slate-400 text-sm">Standard Thickness</div>
                            <div className="text-amber-400 font-semibold mt-2">Included</div>
                          </div>
                        </button>
                        <button type="button" onClick={() => setUpgradeThickness(true)} className={`p-4 rounded-lg border-2 transition-all ${upgradeThickness ? 'border-amber-500 bg-amber-500/20' : 'border-slate-600 hover:border-slate-500'}`}>
                          <div className="text-center">
                            <div className="text-xl font-bold text-white mb-1">.080"</div>
                            <div className="text-slate-400 text-sm">Premium Thickness</div>
                            <div className="text-amber-400 font-semibold mt-2">+$15/set</div>
                          </div>
                        </button>
                      </div>
                    </div>}

                  {/* Orientation Toggle - Hidden on mobile since it's shown at top, visible on desktop for metal cards */}
                  {cardType === 'metal' && <div className="hidden md:flex items-center justify-center gap-4">
                      <Button type="button" variant={orientation === 'landscape' ? 'default' : 'outline'} onClick={() => setOrientation('landscape')} className={orientation === 'landscape' ? 'bg-amber-600 hover:bg-amber-700 !text-white' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}>
                        <RectangleHorizontal className="h-4 w-4 mr-2" />
                        Landscape
                      </Button>
                      <Button type="button" variant={orientation === 'portrait' ? 'default' : 'outline'} onClick={() => setOrientation('portrait')} className={orientation === 'portrait' ? 'bg-amber-600 hover:bg-amber-700 !text-white' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}>
                        <RectangleVertical className="h-4 w-4 mr-2" />
                        Portrait
                      </Button>
                    </div>}

                  {/* Hidden file inputs - moved outside tabs so they're always accessible */}
                  <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={e => {
                    if (e.target.files?.[0]) {
                      handleImageUpload(e.target.files[0], 'logo');
                      e.target.value = ''; // Reset for re-upload
                    }
                  }} />

                  {/* Front/Back Tabs */}
                  <Tabs value={cardSide} onValueChange={v => setCardSide(v as CardSide)} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-700 md:hidden text-xs sm:text-sm">
                      <TabsTrigger value="front" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white py-2">
                        Front (Photo)
                      </TabsTrigger>
                      <TabsTrigger value="back" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white py-2">
                        Back (Info + QR)
                      </TabsTrigger>
                    </TabsList>

                    {/* Front Card */}
                    <TabsContent value="front" className="mt-4 md:mt-0">
                      {/* Mobile Paper Card Size Selector */}
                      {cardType === 'paper' && (
                        <div className="md:hidden w-full bg-slate-700/50 rounded-lg p-3 mb-4">
                          <h3 className="text-sm font-semibold text-white mb-2 text-center">
                            Card Size {activeDesignIndex >= 0 ? `(Design ${activeDesignIndex + 2})` : ''}
                          </h3>
                          <div className="grid grid-cols-2 gap-2">
                            <button 
                              type="button" 
                              onClick={() => setMainDesignSize('2.625x4.375')}
                              className={`p-2 rounded-lg border-2 transition-all ${
                                mainDesignSize === '2.625x4.375' 
                                  ? 'border-amber-500 bg-amber-500/20' 
                                  : 'border-slate-600 hover:border-slate-500'
                              }`}
                            >
                              <div className="text-center">
                                <div className="text-sm font-bold text-white">2.5"×4.25"</div>
                                <div className="text-amber-400 font-semibold text-xs">Included</div>
                              </div>
                            </button>
                            <button 
                              type="button" 
                              onClick={() => setMainDesignSize('3.125x4.875')}
                              className={`p-2 rounded-lg border-2 transition-all ${
                                mainDesignSize === '3.125x4.875' 
                                  ? 'border-amber-500 bg-amber-500/20' 
                                  : 'border-slate-600 hover:border-slate-500'
                              }`}
                            >
                              <div className="text-center">
                                <div className="text-sm font-bold text-white">3"×4.75"</div>
                                <div className="text-amber-400 font-semibold text-xs">+$7</div>
                              </div>
                            </button>
                          </div>
                        </div>
                      )}
                      <div className="flex flex-col items-center gap-3 sm:gap-4 md:hidden w-full">
                        {/* Card Preview */}
                        <div data-card-preview ref={cardPreviewRef} className={`${cardClass} ${cardRounding} overflow-hidden shadow-2xl relative ${cardType === 'metal' && metalBorderColor !== 'none' ? `bg-gradient-to-br ${getMetalBorderGradient(metalBorderColor)} p-1` : ''}`}>
                            <div ref={photoContainerRef} className={`w-full h-full ${cardType === 'metal' && metalBorderColor !== 'none' ? 'rounded-lg' : cardRounding} overflow-hidden bg-slate-700 flex items-center justify-center touch-none relative ${!activePhoto ? 'cursor-pointer hover:bg-slate-600 transition-colors' : ''}`} style={{
                            cursor: activePhoto && !draggingText ? isPanning ? 'grabbing' : 'grab' : !activePhoto ? 'pointer' : 'default',
                            pointerEvents: draggingText ? 'none' : 'auto'
                          }} onPointerDown={handlePhotoPointerDown} onPointerMove={handlePhotoPointerMove} onPointerUp={handlePhotoPointerUp} onPointerCancel={handlePhotoPointerUp} onWheel={handlePhotoWheel} onClick={() => {
                            if (!activePhoto) {
                              photoInputRef.current?.click();
                            }
                          }}>
                              {activePhoto ? <>
                                  {frontBorderDesign === 'traditional-frame' && photoShape !== 'full' ? (
                                    <div className="flex items-center justify-center w-full h-full" style={{
                                      width: photoShape === 'circle' ? '60%' : '70%',
                                      height: photoShape === 'circle' ? '60%' : '70%',
                                      borderRadius: photoShape === 'circle' ? '50%' : '8px',
                                      overflow: 'hidden',
                                      position: 'relative',
                                    }}>
                                      <img src={activePhoto} alt="Deceased" draggable={false} className="w-full h-full object-cover pointer-events-none select-none" style={{
                                        transform: `translate(${activePhotoPanX}px, ${activePhotoPanY}px) scale(${activePhotoZoom}) rotate(${activePhotoRotation}deg)`,
                                        transformOrigin: 'center',
                                        willChange: 'transform',
                                        filter: `brightness(${activePhotoBrightness}%)`
                                      }} />
                                    </div>
                                  ) : (
                                    <img src={activePhoto} alt="Deceased" draggable={false} className="w-full h-full object-cover pointer-events-none select-none" style={{
                                      transform: `translate(${activePhotoPanX}px, ${activePhotoPanY}px) scale(${activePhotoZoom}) rotate(${activePhotoRotation}deg)`,
                                      transformOrigin: 'center',
                                      willChange: 'transform',
                                      filter: `brightness(${activePhotoBrightness}%)`
                                    }} />
                                  )}
                                  {/* Fade overlay */}
                                  {activePhotoFade && (() => {
                                const hex = fadeColor;
                                const r = parseInt(hex.slice(1, 3), 16);
                                const g = parseInt(hex.slice(3, 5), 16);
                                const b = parseInt(hex.slice(5, 7), 16);
                                const fadeStyle = fadeShape === 'circle' ? {
                                  background: `radial-gradient(ellipse at center, transparent 30%, rgba(${r},${g},${b},0.3) 60%, rgba(${r},${g},${b},0.7) 100%)`
                                } : {
                                  background: `linear-gradient(to bottom, transparent 40%, rgba(${r},${g},${b},0.3) 70%, rgba(${r},${g},${b},0.6) 100%)`
                                };
                                return <div className="absolute inset-0 pointer-events-none" style={fadeStyle} />;
                              })()}
                                </> : <div className="text-center p-4 pointer-events-none">
                                  <ImageIcon className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                                  <p className="text-slate-400 text-sm">Click to upload photo</p>
                                </div>}
                              
                              {/* Text Overlay - Name */}
                              {showNameOnFront && <div data-front-name className="absolute touch-none select-none px-2 py-1 rounded" style={{
                              left: `${namePosition.x}%`,
                              top: `${namePosition.y}%`,
                              transform: 'translate(-50%, -50%)',
                              fontFamily: nameFont,
                              cursor: draggingText === 'name' || resizingText === 'name' ? 'grabbing' : 'grab',
                              textShadow: nameTextShadow ? '0 2px 4px rgba(0,0,0,0.5)' : 'none',
                              boxShadow: draggingText === 'name' || resizingText === 'name' ? '0 0 0 2px #d97706' : 'none',
                              maxWidth: '95%',
                              width: 'max-content',
                              textAlign: 'center',
                              zIndex: 15,
                              pointerEvents: 'auto',
                              overflow: 'visible'
                            }} onPointerDown={e => handleTextPointerDown(e, 'name')} onPointerMove={handleTextPointerMove} onPointerUp={handleTextPointerUp} onPointerCancel={handleTextPointerUp} onWheel={e => handleTextWheel(e, 'name')}>
                                  <span data-front-name-text style={{
                                fontSize: `${Math.max(10, nameSize * 0.7)}px`,
                                color: nameColor,
                                fontWeight: nameBold ? 'bold' : 'normal',
                                whiteSpace: 'pre-line',
                                textAlign: 'center',
                                display: 'block',
                                lineHeight: 1.2,
                                overflow: 'visible',
                                textOverflow: 'clip'
                              }}>
                                    {deceasedName || 'Name Here'}
                                  </span>
                                </div>}
                              
                              {/* Text Overlay - Dates */}
                              {showDatesOnFront && (() => {
                              return <div data-front-dates className="absolute touch-none select-none px-2 rounded" style={{
                                left: `${datesPosition.x}%`,
                                top: `${datesPosition.y}%`,
                                transform: 'translate(-50%, -50%)',
                                fontFamily: datesFont,
                                cursor: draggingText === 'dates' || resizingText === 'dates' ? 'grabbing' : 'grab',
                                textShadow: datesTextShadow ? '0 2px 4px rgba(0,0,0,0.5)' : 'none',
                                boxShadow: draggingText === 'dates' || resizingText === 'dates' ? '0 0 0 2px #d97706' : 'none',
                                textAlign: 'center',
                                width: '95%',
                                maxWidth: '95%',
                                overflow: 'visible',
                                zIndex: 15,
                                pointerEvents: 'auto'
                              }} onPointerDown={e => handleTextPointerDown(e, 'dates')} onPointerMove={handleTextPointerMove} onPointerUp={handleTextPointerUp} onPointerCancel={handleTextPointerUp} onWheel={e => handleTextWheel(e, 'dates')}>
                                    <div data-front-dates-text>
                                      <AutoFitText text={formatDates(birthDate, deathDate, frontDateFormat)} maxWidth="100%" allowWrap={false} style={{
                                    fontSize: frontDatesSize === 'auto' ? '8px' : `${Math.max(7, (typeof frontDatesSize === 'number' ? frontDatesSize : 12) * 0.65)}px`,
                                    color: frontDatesColor,
                                    fontWeight: datesBold ? 'bold' : 'normal',
                                    textAlign: 'center'
                                  }} />
                                    </div>
                                  </div>;
                            })()}
                              
                              {/* Text Overlay - Additional */}
                              {showAdditionalText && <div data-front-additional className="absolute touch-none select-none px-2 py-1 rounded" style={{
                              left: `${additionalTextPosition.x}%`,
                              top: `${additionalTextPosition.y}%`,
                              transform: 'translate(-50%, -50%)',
                              fontFamily: additionalTextFont,
                              cursor: draggingText === 'additional' || resizingText === 'additional' ? 'grabbing' : 'grab',
                              textShadow: additionalTextShadow ? '0 2px 4px rgba(0,0,0,0.5)' : 'none',
                              boxShadow: draggingText === 'additional' || resizingText === 'additional' ? '0 0 0 2px #d97706' : 'none',
                              maxWidth: '90%',
                              zIndex: 15,
                              pointerEvents: 'auto',
                              overflow: 'visible'
                            }} onPointerDown={e => handleTextPointerDown(e, 'additional')} onPointerMove={handleTextPointerMove} onPointerUp={handleTextPointerUp} onPointerCancel={handleTextPointerUp} onWheel={e => handleTextWheel(e, 'additional')}>
                                  <span data-front-additional-text style={{
                                fontSize: `${Math.max(10, additionalTextSize * 0.7)}px`,
                                color: additionalTextColor,
                                whiteSpace: 'pre-wrap',
                                textAlign: 'center',
                                display: 'block',
                                fontWeight: additionalTextBold ? 'bold' : 'normal',
                                overflow: 'visible',
                                textOverflow: 'clip'
                              }}>
                                    {additionalText || 'Your text here'}
                                  </span>
                                </div>}
                              
                              {/* Funeral Home Logo - Front Card */}
                              {funeralHomeLogo && <div className="absolute left-1/2 -translate-x-1/2 z-10 pointer-events-none" style={{
                              [funeralHomeLogoPosition === 'top' ? 'top' : 'bottom']: frontBorderDesign !== 'none' ? '16px' : '8px'
                            }}>
                                  <img src={funeralHomeLogo} alt="Funeral Home Logo" className="object-contain drop-shadow-md" style={{
                                height: `${Math.min(funeralHomeLogoSize * 0.6, 35)}px`,
                                maxWidth: '60%'
                              }} />
                                </div>}
                              
                              {/* QR Code - Front Card (bottom corner) - Only for paper cards, not metal */}
                              {qrValue && cardType === 'paper' && <div className="absolute z-10 pointer-events-none" style={{
                              bottom: frontBorderDesign !== 'none' ? '20px' : '10px',
                              right: frontBorderDesign !== 'none' ? '20px' : '10px'
                            }}>
                                  <QrCodeBadge value={qrValue} size={40} level="M" paddingClassName="p-1" />
                                </div>}
                              
                              {/* Decorative Border Overlay - Paper cards only (Front) */}
                              {cardType === 'paper' && frontBorderDesign !== 'none' && <div className="absolute inset-0 z-20 pointer-events-none">
                                  <DecorativeBorderOverlay type={frontBorderDesign} color={frontBorderColor} />
                                </div>}
                            </div>
                        </div>
                      </div>
                      
                      {/* Mobile Border Selector - Paper cards only */}
                      {cardType === 'paper' && <div className="md:hidden w-full max-w-xs mx-auto mt-3 space-y-2">
                          <Label className="text-slate-400 block text-xs text-center">{cardSide === 'front' ? 'Front' : 'Back'} Border Style</Label>
                          <div className="flex justify-center gap-2 flex-wrap">
                            {DECORATIVE_BORDERS.map(border => {
                            const currentBorder = cardSide === 'front' ? frontBorderDesign : backBorderDesign;
                            const currentColor = cardSide === 'front' ? frontBorderColor : backBorderColor;
                            return <button key={border.id} type="button" onClick={() => cardSide === 'front' ? setFrontBorderDesign(border.id) : setBackBorderDesign(border.id)} className={`w-12 h-12 rounded-lg border-2 transition-all overflow-hidden relative ${currentBorder === border.id ? 'border-amber-500 ring-2 ring-amber-500/30 scale-105' : 'border-slate-600 hover:border-slate-400'}`} title={border.name}>
                                  {/* Show card background with corner of border */}
                                  <div className="absolute inset-0" style={{
                                background: cardSide === 'front' ? deceasedPhoto ? `url(${deceasedPhoto}) center/cover` : 'linear-gradient(135deg, #f8f5f0, #ebe6df)' : backBgImage ? `url(${backBgImage}) center/cover` : 'linear-gradient(135deg, #f8f5f0, #ebe6df)'
                              }} />
                                  {/* Border overlay scaled to show top-left corner detail */}
                                  <div className="absolute inset-0 scale-[5] origin-top-left">
                                    <DecorativeBorderOverlay type={border.id} color={currentColor} />
                                  </div>
                                </button>;
                          })}
                          </div>
                          {/* Border Color Selection */}
                          <div className="flex justify-center gap-2 pt-1">
                            {(['#d4af37', '#c0c0c0', '#b76e79', '#f8f8f8'] as const).map(color => {
                            const currentColor = cardSide === 'front' ? frontBorderColor : backBorderColor;
                            const setColor = cardSide === 'front' ? setFrontBorderColor : setBackBorderColor;
                            const gradients: Record<string, string> = {
                              '#d4af37': 'linear-gradient(135deg, #ffd700, #b8860b)',
                              '#c0c0c0': 'linear-gradient(135deg, #e8e8e8, #a8a8a8)',
                              '#b76e79': 'linear-gradient(135deg, #e8b4b8, #9e5a65)',
                              '#f8f8f8': 'linear-gradient(135deg, #ffffff, #e0e0e0)'
                            };
                            const titles: Record<string, string> = {
                              '#d4af37': 'Gold',
                              '#c0c0c0': 'Silver',
                              '#b76e79': 'Rose Gold',
                              '#f8f8f8': 'White'
                            };
                            return <button key={color} type="button" onClick={() => setColor(color)} className={`w-7 h-7 rounded-full border-2 transition-all ${currentColor === color ? 'border-amber-400 ring-2 ring-amber-400/40 scale-110' : 'border-slate-500'}`} style={{
                              background: gradients[color]
                            }} title={titles[color]} />;
                          })}
                          </div>
                        </div>}

                      {/* Photo Shape Selector - Only for Traditional Frame */}
                      {cardSide === 'front' && frontBorderDesign === 'traditional-frame' && activePhoto && (
                        <div className="w-full max-w-md space-y-2 p-3 bg-slate-700/30 rounded-lg">
                          <Label className="text-white text-sm font-medium">Photo Shape</Label>
                          <div className="flex gap-2">
                            <Button 
                              type="button" 
                              variant={photoShape === 'circle' ? 'default' : 'outline'} 
                              size="sm" 
                              onClick={() => setPhotoShape('circle')} 
                              className={`flex-1 ${photoShape === 'circle' ? 'bg-amber-600 text-white' : 'border-slate-600 text-slate-300'}`}
                            >
                              Circle
                            </Button>
                            <Button 
                              type="button" 
                              variant={photoShape === 'square' ? 'default' : 'outline'} 
                              size="sm" 
                              onClick={() => setPhotoShape('square')} 
                              className={`flex-1 ${photoShape === 'square' ? 'bg-amber-600 text-white' : 'border-slate-600 text-slate-300'}`}
                            >
                              Square
                            </Button>
                            <Button 
                              type="button" 
                              variant={photoShape === 'full' ? 'default' : 'outline'} 
                              size="sm" 
                              onClick={() => setPhotoShape('full')} 
                              className={`flex-1 ${photoShape === 'full' ? 'bg-amber-600 text-white' : 'border-slate-600 text-slate-300'}`}
                            >
                              Full
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Controls Section - Always Visible */}
                      <div className="flex flex-col items-center gap-4">
                        {/* Photo Upload */}
                        <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'photo')} />
                        {activePhoto && <div className="flex gap-2 flex-wrap justify-center">
                            <Button type="button" variant="outline" onClick={() => photoInputRef.current?.click()} className="border-amber-600/50 text-amber-400 hover:bg-amber-600/20">
                              <ImageIcon className="h-4 w-4 mr-2" />
                              Change Photo
                            </Button>
                            <Button type="button" variant="outline" onClick={() => {
                            if (activeDesignIndex >= 0) {
                              const updated = [...additionalDesigns];
                              updated[activeDesignIndex] = {
                                ...updated[activeDesignIndex],
                                photoZoom: 1,
                                photoPanX: 0,
                                photoPanY: 0,
                                photoRotation: 0
                              };
                              setAdditionalDesigns(updated);
                            } else {
                              setPhotoZoom(1);
                              setPhotoPanX(0);
                              setPhotoPanY(0);
                              setPhotoRotation(0);
                            }
                          }} className="border-slate-600 text-slate-300 hover:bg-slate-700">
                              <RotateCcw className="h-4 w-4 mr-1" />
                              Reset
                            </Button>
                            <Button type="button" variant="outline" onClick={() => {
                            if (activeDesignIndex >= 0) {
                              const updated = [...additionalDesigns];
                              updated[activeDesignIndex] = {
                                ...updated[activeDesignIndex],
                                photo: null,
                                photoZoom: 1,
                                photoPanX: 0,
                                photoPanY: 0,
                                photoRotation: 0
                              };
                              setAdditionalDesigns(updated);
                            } else {
                              setDeceasedPhoto(null);
                              setPhotoZoom(1);
                              setPhotoPanX(0);
                              setPhotoPanY(0);
                              setPhotoRotation(0);
                              void syncFrontTextColors(null);
                            }
                          }} className="border-rose-600/50 text-rose-400 hover:bg-rose-600/20">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>}

                        {/* Photo Controls Panel */}
                        {activePhoto && <div className="w-full max-w-md space-y-2 p-3 bg-slate-700/30 rounded-lg">
                            <Label className="text-white text-sm font-medium">Adjust Photo</Label>
                            
                            {/* Photo Shape Selector - Show when Traditional Frame is selected */}
                            {cardSide === 'front' && frontBorderDesign === 'traditional-frame' && (
                              <div className="mb-3 pb-3 border-b border-slate-600">
                                <Label className="text-slate-400 text-xs mb-2 block">Photo Shape</Label>
                                <div className="flex gap-2">
                                  <Button 
                                    type="button" 
                                    variant={photoShape === 'circle' ? 'default' : 'outline'} 
                                    size="sm" 
                                    onClick={() => setPhotoShape('circle')} 
                                    className={`flex-1 ${photoShape === 'circle' ? 'bg-amber-600 text-white' : 'border-slate-600 text-slate-300'}`}
                                  >
                                    Circle
                                  </Button>
                                  <Button 
                                    type="button" 
                                    variant={photoShape === 'square' ? 'default' : 'outline'} 
                                    size="sm" 
                                    onClick={() => setPhotoShape('square')} 
                                    className={`flex-1 ${photoShape === 'square' ? 'bg-amber-600 text-white' : 'border-slate-600 text-slate-300'}`}
                                  >
                                    Square
                                  </Button>
                                  <Button 
                                    type="button" 
                                    variant={photoShape === 'full' ? 'default' : 'outline'} 
                                    size="sm" 
                                    onClick={() => setPhotoShape('full')} 
                                    className={`flex-1 ${photoShape === 'full' ? 'bg-amber-600 text-white' : 'border-slate-600 text-slate-300'}`}
                                  >
                                    Full
                                  </Button>
                                </div>
                              </div>
                            )}
                            
                            <Button type="button" variant="outline" size="sm" onClick={() => {
                            setPhotoZoom(1);
                            setPhotoPanX(0);
                            setPhotoPanY(0);
                            setPhotoRotation(0);
                            setPhotoBrightness(100);
                          }} className="border-slate-600 text-slate-300 text-xs w-full mb-2">
                              Reset Photo Position
                            </Button>
                            <div className="pt-2 border-t border-slate-600 space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-slate-400 text-xs">Photo Fade Effect</Label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input type="checkbox" checked={photoFade} onChange={e => setPhotoFade(e.target.checked)} className="accent-amber-600" />
                                  <span className="text-slate-300 text-xs">{photoFade ? 'On' : 'Off'}</span>
                                </label>
                              </div>
                              {photoFade && <div className="flex items-center gap-3">
                                  {/* Shape toggle */}
                                  <div className="flex gap-1">
                                    <button type="button" onClick={() => setFadeShape('rectangle')} className={`p-1.5 rounded transition-all ${fadeShape === 'rectangle' ? 'bg-amber-600 text-white' : 'bg-slate-600 text-slate-300 hover:bg-slate-500'}`} title="Rectangle fade (bottom)">
                                      <RectangleHorizontal className="h-4 w-4" />
                                    </button>
                                    <button type="button" onClick={() => setFadeShape('circle')} className={`p-1.5 rounded transition-all ${fadeShape === 'circle' ? 'bg-amber-600 text-white' : 'bg-slate-600 text-slate-300 hover:bg-slate-500'}`} title="Circle fade (vignette)">
                                      <div className="h-4 w-4 rounded-full border-2 border-current" />
                                    </button>
                                  </div>
                                  {/* Color picker */}
                                  <div className="flex items-center gap-2 flex-1">
                                    <Label className="text-slate-400 text-xs">Color</Label>
                                    <div className="flex gap-1">
                                      {['#000000', '#1a1a2e', '#2d3436', '#4a3c31', '#1e3a5f'].map(color => <button key={color} type="button" onClick={() => setFadeColor(color)} className={`w-6 h-6 rounded-full border-2 transition-all ${fadeColor === color ? 'border-amber-400 scale-110' : 'border-slate-500'}`} style={{
                                    backgroundColor: color
                                  }} title={color} />)}
                                      <input type="color" value={fadeColor} onChange={e => setFadeColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0 p-0" title="Custom color" />
                                    </div>
                                  </div>
                                </div>}
                            </div>
                            {cardType === 'metal' && <div className="pt-2 border-t border-slate-600">
                                <Label className="text-slate-400 text-xs mb-2 block">Metal Border Frame</Label>
                                <div className="flex gap-2 flex-wrap">
                                  {/* None option */}
                                  <button type="button" onClick={() => setMetalBorderColor('none')} className={`w-10 h-10 rounded-lg border-2 transition-all flex items-center justify-center ${metalBorderColor === 'none' ? 'border-amber-400 scale-110 ring-2 ring-amber-400/50' : 'border-slate-600 hover:border-slate-500'} bg-slate-700`} title="No Border">
                                    <span className="text-slate-400 text-xs font-medium">None</span>
                                  </button>
                                  {/* Gold */}
                                  <button type="button" onClick={() => setMetalBorderColor('#d4af37')} className={`w-10 h-10 rounded-lg border-2 transition-all overflow-hidden relative ${metalBorderColor === '#d4af37' ? 'border-amber-400 scale-110 ring-2 ring-amber-400/50' : 'border-slate-600 hover:border-slate-500'}`} title="Gold">
                                    <div className="w-full h-full" style={{
                                  background: 'linear-gradient(135deg, #fff9e6 0%, #ffd700 15%, #d4af37 30%, #b8860b 50%, #d4af37 70%, #ffd700 85%, #fff9e6 100%)',
                                  boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.6), inset 0 -2px 4px rgba(0,0,0,0.2)'
                                }} />
                                  </button>
                                  {/* Silver */}
                                  <button type="button" onClick={() => setMetalBorderColor('#c0c0c0')} className={`w-10 h-10 rounded-lg border-2 transition-all overflow-hidden relative ${metalBorderColor === '#c0c0c0' ? 'border-amber-400 scale-110 ring-2 ring-amber-400/50' : 'border-slate-600 hover:border-slate-500'}`} title="Silver">
                                    <div className="w-full h-full" style={{
                                  background: 'linear-gradient(135deg, #ffffff 0%, #e8e8e8 15%, #c0c0c0 30%, #a8a8a8 50%, #c0c0c0 70%, #e8e8e8 85%, #ffffff 100%)',
                                  boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.8), inset 0 -2px 4px rgba(0,0,0,0.15)'
                                }} />
                                  </button>
                                  {/* Rose Gold */}
                                  <button type="button" onClick={() => setMetalBorderColor('#b76e79')} className={`w-10 h-10 rounded-lg border-2 transition-all overflow-hidden relative ${metalBorderColor === '#b76e79' ? 'border-amber-400 scale-110 ring-2 ring-amber-400/50' : 'border-slate-600 hover:border-slate-500'}`} title="Rose Gold">
                                    <div className="w-full h-full" style={{
                                  background: 'linear-gradient(135deg, #fce4e4 0%, #e8b4b8 15%, #b76e79 30%, #9e5a65 50%, #b76e79 70%, #e8b4b8 85%, #fce4e4 100%)',
                                  boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.5), inset 0 -2px 4px rgba(0,0,0,0.2)'
                                }} />
                                  </button>
                                  {/* White */}
                                  <button type="button" onClick={() => setMetalBorderColor('#f8f8f8')} className={`w-10 h-10 rounded-lg border-2 transition-all overflow-hidden relative ${metalBorderColor === '#f8f8f8' ? 'border-amber-400 scale-110 ring-2 ring-amber-400/50' : 'border-slate-600 hover:border-slate-500'}`} title="White">
                                    <div className="w-full h-full" style={{
                                  background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 25%, #f0f0f0 50%, #fafafa 75%, #ffffff 100%)',
                                  boxShadow: 'inset 0 2px 4px rgba(255,255,255,1), inset 0 -2px 4px rgba(0,0,0,0.05)'
                                }} />
                                  </button>
                                </div>
                              </div>}
                            <Button type="button" variant="outline" size="sm" onClick={() => {
                            setPhotoZoom(1);
                            setPhotoPanX(0);
                            setPhotoPanY(0);
                            setPhotoRotation(0);
                            setPhotoBrightness(100);
                            setPhotoFade(false);
                          }} className="border-slate-600 text-slate-300 text-xs w-full">
                              Reset All
                            </Button>
                          </div>}

                        {/* Text Controls - Compact layout */}
                        <div className="w-full space-y-1.5 border-t border-slate-700 pt-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Type className="h-3 w-3 text-slate-400" />
                              <Label className="text-slate-400 text-xs font-medium">Front Card Text</Label>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={resetAllDesignSettings}
                              className="h-5 px-2 text-xs text-slate-400 hover:text-amber-400"
                              title="Reset all positions and sizes to defaults"
                            >
                              <RotateCcw className="h-3 w-3 mr-1" />
                              Reset All
                            </Button>
                          </div>
                          
                          {/* Name Controls - Compact */}
                          <div className="p-1.5 bg-slate-700/30 rounded-lg space-y-1">
                            <div className="flex items-center justify-between">
                              <Label className="text-white text-xs font-medium">Name</Label>
                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input type="checkbox" checked={showNameOnFront} onChange={e => setShowNameOnFront(e.target.checked)} className="accent-amber-600 w-3 h-3" />
                                <span className="text-slate-400 text-xs">Show</span>
                              </label>
                            </div>
                            <div className="flex gap-2">
                              <Textarea placeholder="Name" value={deceasedName} onChange={e => setDeceasedName(e.target.value)} rows={2} className="bg-slate-700 border-slate-600 text-white text-sm flex-1 resize-none min-h-[40px]" />
                              <Select value={nameFont} onValueChange={setNameFont}>
                                <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-8 w-[100px]">
                                  <SelectValue placeholder="Font" />
                                </SelectTrigger>
                                <SelectContent>
                                  {FONT_OPTIONS.map(font => <SelectItem key={font.value} value={font.value} style={{
                                    fontFamily: font.value
                                  }}>
                                      {font.name}
                                    </SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <input type="color" value={nameColor} onChange={e => setNameColor(e.target.value)} className="w-6 h-6 rounded border border-slate-600 cursor-pointer" />
                              <Button type="button" variant={nameBold ? 'default' : 'outline'} size="sm" className={`h-5 px-2 text-xs font-bold ${nameBold ? 'bg-amber-600 text-white' : 'border-slate-600 text-slate-300'}`} onClick={() => setNameBold(!nameBold)}>
                                B
                              </Button>
                              <Button type="button" variant={nameTextShadow ? 'default' : 'outline'} size="sm" className={`h-5 px-2 text-xs ${nameTextShadow ? 'bg-amber-600 text-white' : 'border-slate-600 text-slate-300'}`} onClick={() => setNameTextShadow(!nameTextShadow)} title="Text Shadow">
                                S
                              </Button>
                            </div>
                          </div>

                          {/* Dates Controls - Compact */}
                          <div className="p-1.5 bg-slate-700/30 rounded-lg space-y-1">
                            <div className="flex items-center justify-between">
                              <Label className="text-white text-xs font-medium">Dates</Label>
                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input type="checkbox" checked={showDatesOnFront} onChange={e => setShowDatesOnFront(e.target.checked)} className="accent-amber-600 w-3 h-3" />
                                <span className="text-slate-400 text-xs">Show on Front</span>
                              </label>
                            </div>
                            <div className="flex gap-2">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="outline" className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 h-8 text-sm flex-1 justify-start">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {birthDate ? format(birthDate, "MM/dd/yyyy") : "Birth Date"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600" align="start">
                                  <Calendar mode="single" selected={birthDate} onSelect={setBirthDate} initialFocus className="bg-slate-800 text-white" />
                                </PopoverContent>
                              </Popover>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="outline" className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 h-8 text-sm flex-1 justify-start">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {deathDate ? format(deathDate, "MM/dd/yyyy") : "Death Date"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600" align="start">
                                  <Calendar mode="single" selected={deathDate} onSelect={setDeathDate} initialFocus className="bg-slate-800 text-white" />
                                </PopoverContent>
                              </Popover>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Select value={datesFont} onValueChange={setDatesFont}>
                                <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-7 text-xs w-[90px]">
                                  <SelectValue placeholder="Font" />
                                </SelectTrigger>
                                <SelectContent>
                                  {FONT_OPTIONS.map(font => <SelectItem key={font.value} value={font.value} style={{
                                    fontFamily: font.value
                                  }}>
                                      {font.name}
                                    </SelectItem>)}
                                </SelectContent>
                              </Select>
                              <Select value={frontDateFormat} onValueChange={v => setFrontDateFormat(v as 'full' | 'short-month' | 'mmm-dd-yyyy' | 'numeric' | 'year')} disabled={!showDatesOnFront}>
                                <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-6 text-xs w-[100px]">
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
                              <input type="color" value={frontDatesColor.replace('cc', '')} onChange={e => setFrontDatesColor(e.target.value)} className="w-6 h-6 rounded border border-slate-600 cursor-pointer" disabled={!showDatesOnFront} />
                              <Button type="button" variant={frontDatesSize === 'auto' ? 'default' : 'outline'} size="sm" className={`h-5 px-1.5 text-xs ${frontDatesSize === 'auto' ? 'bg-amber-600' : 'border-slate-600'}`} onClick={() => setFrontDatesSize('auto')} disabled={!showDatesOnFront}>
                                Auto
                              </Button>
                              <Button type="button" variant={datesBold ? 'default' : 'outline'} size="sm" className={`h-5 px-2 text-xs font-bold ${datesBold ? 'bg-amber-600 text-white' : 'border-slate-600 text-slate-300'}`} onClick={() => setDatesBold(!datesBold)}>
                                B
                              </Button>
                              <Button type="button" variant={datesTextShadow ? 'default' : 'outline'} size="sm" className={`h-5 px-2 text-xs ${datesTextShadow ? 'bg-amber-600 text-white' : 'border-slate-600 text-slate-300'}`} onClick={() => setDatesTextShadow(!datesTextShadow)} disabled={!showDatesOnFront} title="Text Shadow">
                                S
                              </Button>
                            </div>
                          </div>
                          
                          {/* Additional Text Controls - Compact */}
                          <div className="p-1.5 bg-slate-700/30 rounded-lg space-y-1">
                            <div className="flex items-center justify-between">
                              <Label className="text-white text-xs font-medium">Additional Text</Label>
                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input type="checkbox" checked={showAdditionalText} onChange={e => setShowAdditionalText(e.target.checked)} className="accent-amber-600 w-3 h-3" />
                                <span className="text-slate-400 text-xs">Show</span>
                              </label>
                            </div>
                            {showAdditionalText && <>
                                <Input placeholder="Additional text..." value={additionalText} onChange={e => setAdditionalText(e.target.value)} className="bg-slate-700 border-slate-600 text-white h-8 text-sm" />
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Select value={additionalTextFont} onValueChange={setAdditionalTextFont}>
                                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-7 text-xs w-[90px]">
                                      <SelectValue placeholder="Font" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {FONT_OPTIONS.map(font => <SelectItem key={font.value} value={font.value} style={{
                                      fontFamily: font.value
                                    }}>
                                          {font.name}
                                        </SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                  <input type="color" value={additionalTextColor} onChange={e => setAdditionalTextColor(e.target.value)} className="w-6 h-6 rounded border border-slate-600 cursor-pointer" />
                                  <Button type="button" variant={additionalTextBold ? 'default' : 'outline'} size="sm" className={`h-5 px-2 text-xs font-bold ${additionalTextBold ? 'bg-amber-600 text-white' : 'border-slate-600 text-slate-300'}`} onClick={() => setAdditionalTextBold(!additionalTextBold)}>
                                    B
                                  </Button>
                                  <Button type="button" variant={additionalTextShadow ? 'default' : 'outline'} size="sm" className={`h-5 px-2 text-xs ${additionalTextShadow ? 'bg-amber-600 text-white' : 'border-slate-600 text-slate-300'}`} onClick={() => setAdditionalTextShadow(!additionalTextShadow)} title="Text Shadow">
                                    S
                                  </Button>
                                </div>
                                {/* Additional Text Size & Position Sliders */}
                                <div className="space-y-1.5 pt-1">
                                  <div className="flex items-center gap-2">
                                    <Label className="text-slate-400 text-xs w-10">Size</Label>
                                    <input type="range" min="10" max="72" step="1" value={pxToPoints(additionalTextSize)} onChange={e => setAdditionalTextSize(pointsToPx(parseFloat(e.target.value)))} className="flex-1 accent-amber-600 h-1" />
                                    <span className="text-xs text-slate-400 w-12 text-right">{pxToPoints(additionalTextSize)}pt</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Label className="text-slate-400 text-xs w-10">L/R</Label>
                                    <input type="range" min="10" max="90" step="1" value={additionalTextPosition.x} onChange={e => setAdditionalTextPosition(prev => ({
                                    ...prev,
                                    x: parseFloat(e.target.value)
                                  }))} className="flex-1 accent-amber-600 h-1" />
                                    <span className="text-xs text-slate-400 w-12 text-right">{Math.round(additionalTextPosition.x)}%</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Label className="text-slate-400 text-xs w-10">U/D</Label>
                                    <input type="range" min="5" max="95" step="1" value={additionalTextPosition.y} onChange={e => setAdditionalTextPosition(prev => ({
                                    ...prev,
                                    y: parseFloat(e.target.value)
                                  }))} className="flex-1 accent-amber-600 h-1" />
                                    <span className="text-xs text-slate-400 w-12 text-right">{Math.round(additionalTextPosition.y)}%</span>
                                  </div>
                                </div>
                              </>}
                          </div>
                        </div>


                        {/* Variety Upsell CTA - Paper cards only */}
                        {cardType === 'paper' && <button type="button" onClick={() => {
                          const newDesign = createEmptyDesign();
                          setAdditionalDesigns([...additionalDesigns, newDesign]);
                          setActiveDesignIndex(additionalDesigns.length);
                        }} className="w-full mt-2 p-2.5 bg-gradient-to-r from-amber-600/20 via-amber-500/10 to-amber-600/20 border border-amber-500/40 hover:border-amber-400 rounded-lg transition-all group">
                            <div className="flex items-center justify-center gap-3">
                              {/* Mini card mockup */}
                              <div className="w-6 h-9 bg-gradient-to-br from-slate-200 to-slate-400 rounded-sm shadow-md flex items-center justify-center">
                                <div className="w-4 h-5 bg-slate-300 rounded-[1px]" />
                              </div>
                              <div className="flex flex-col items-start">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-amber-300 text-sm">Add Style</span>
                                  <span className="bg-amber-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded">$7</span>
                                </div>
                                <span className="text-slate-500 text-[10px]">New background or prayer</span>
                              </div>
                            </div>
                          </button>}
                      </div>
                    </TabsContent>

                    {/* Back Card */}
                    <TabsContent value="back" className="mt-4 md:mt-0">
                      <div className="flex flex-col items-center gap-3 sm:gap-4 md:hidden w-full">
                        {/* Card Preview */}
                        <div data-card-preview ref={cardPreviewRef} className={`${cardClass} ${cardRounding} shadow-2xl relative overflow-hidden`}>
                          {(() => {
                            // Determine background and if it's dark
                            const currentBackMetal = METAL_BG_OPTIONS.find(m => m.id === backMetalFinish) || METAL_BG_OPTIONS[0];
                            const isBackDark = relativeLuminance(backBgSampleHex) < 0.45;
                            const textColorClass = isBackDark ? 'text-zinc-200' : 'text-zinc-700';
                            const mutedTextColorClass = isBackDark ? 'text-zinc-400' : 'text-zinc-600';
                             const resolvedPrayerFontPx = prayerTextSize === 'auto' ? autoPrayerFontSize : prayerTextSize;
                            return <div className={`absolute inset-0 ${cardRounding} overflow-hidden ${!backBgImage ? cardType === 'metal' ? `bg-gradient-to-br ${currentBackMetal.gradient}` : 'bg-white' : ''}`}>
                                {backBgImage && <>
                                    <img src={backBgImage} alt="Background" className="absolute w-full h-full object-cover" style={{
                                  transform: `scale(${backBgZoom}) translate(${backBgPanX}%, ${backBgPanY}%) rotate(${backBgRotation}deg)`,
                                  transformOrigin: 'center center'
                                }} />
                                    {/* No dark overlay - relying on text shadows for readability */}
                                  </>}
                                {!backBgImage && cardType === 'metal' && <div className={`absolute inset-0 opacity-20 ${cardRounding}`} style={{
                                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.1) 1px, rgba(255,255,255,0.1) 2px)'
                              }} />}
                                <div className="relative z-10 w-full h-full" style={{
                                padding: backBorderDesign !== 'none' ? '20px' : '8px',
                                paddingTop: backBorderDesign !== 'none' ? '44px' : '12px',
                                // Extra safe area so QR isn't covered by decorative borders.
                                paddingBottom: backBorderDesign !== 'none' ? '52px' : '12px'
                              }}>
                                  <div className="h-full flex flex-col text-center gap-0">
                                    {/* Header Section - Logo, In Loving Memory, Name, Dates */}
                                    <div className="flex flex-col items-center shrink-0">
                                      {/* Funeral Home Logo - Top (above In Loving Memory) */}
                                      {funeralHomeLogo && funeralHomeLogoPosition === 'top' && <div className="flex justify-center">
                                          <img src={funeralHomeLogo} alt="Funeral Home Logo" className="object-contain" style={{
                                        height: `${funeralHomeLogoSize}px`,
                                        maxWidth: '70%'
                                      }} onLoad={() => setPrayerLayoutNonce(n => n + 1)} />
                                        </div>}
                                  
                                  {showInLovingMemory && <div className="touch-none select-none rounded" style={{
                                      cursor: draggingText === 'inLovingMemory' || resizingText === 'inLovingMemory' ? 'grabbing' : 'grab',
                                      boxShadow: draggingText === 'inLovingMemory' || resizingText === 'inLovingMemory' ? '0 0 0 2px #d97706' : 'none',
                                      zIndex: 15,
                                      pointerEvents: 'auto',
                                      position: 'relative',
                                      overflow: 'visible',
                                      whiteSpace: 'nowrap',
                                      padding: '2px 4px',
                                      width: 'max-content',
                                      maxWidth: '95%'
                                    }} onPointerDown={e => handleTextPointerDown(e, 'inLovingMemory')} onPointerMove={handleTextPointerMove} onPointerUp={handleTextPointerUp} onPointerCancel={handleTextPointerUp} onWheel={e => handleTextWheel(e, 'inLovingMemory')}>
                                      <p data-in-loving-memory className="uppercase tracking-[0.12em]" style={{
                                        fontSize: `${Math.max(5, inLovingMemorySize * 0.5)}px`,
                                        color: inLovingMemoryColor,
                                        fontWeight: inLovingMemoryBold ? 'bold' : 'normal',
                                        fontFamily: inLovingMemoryFont,
                                        textShadow: '1px 1px 3px rgba(0,0,0,0.4)',
                                        marginBottom: '1px',
                                        transform: `translate(${inLovingMemoryPosition.x}%, ${inLovingMemoryPosition.y}%)`,
                                        overflow: 'visible',
                                        whiteSpace: 'nowrap'
                                      }}>
                                        {inLovingMemoryText}
                                      </p>
                                    </div>}
                                  {showNameOnBack && <div className="touch-none select-none px-1 rounded" style={{
                                      cursor: draggingText === 'backName' || resizingText === 'backName' ? 'grabbing' : 'grab',
                                      boxShadow: draggingText === 'backName' || resizingText === 'backName' ? '0 0 0 2px #d97706' : 'none',
                                      zIndex: 15,
                                      pointerEvents: 'auto',
                                      position: 'relative'
                                    }} onPointerDown={e => handleTextPointerDown(e, 'backName')} onPointerMove={handleTextPointerMove} onPointerUp={handleTextPointerUp} onPointerCancel={handleTextPointerUp} onWheel={e => handleTextWheel(e, 'backName')}>
                                      <p className="whitespace-pre text-center" style={{
                                        fontSize: `${Math.max(6, backNameSize * 0.5)}px`,
                                        color: backNameColor,
                                        fontWeight: backNameBold ? 'bold' : 'normal',
                                        fontFamily: backNameFont,
                                        textShadow: '1px 1px 3px rgba(0,0,0,0.4)',
                                        marginBottom: '1px',
                                        transform: `translate(${backNamePosition.x}%, ${backNamePosition.y}%)`
                                      }}>
                                        {deceasedName || 'Name Here'}
                                      </p>
                                    </div>}
                                  
                                  {/* Dates - now in flow, not absolute */}
                                  {showDatesOnBack && <div className="touch-none select-none px-1 rounded w-full overflow-hidden" style={{
                                      cursor: draggingText === 'backDates' || resizingText === 'backDates' ? 'grabbing' : 'grab',
                                      boxShadow: draggingText === 'backDates' || resizingText === 'backDates' ? '0 0 0 2px #d97706' : 'none',
                                      textAlign: backDatesAlign,
                                      marginBottom: '2px',
                                      maxWidth: '100%',
                                      zIndex: 15,
                                      pointerEvents: 'auto',
                                      position: 'relative'
                                    }} onPointerDown={e => handleTextPointerDown(e, 'backDates')} onPointerMove={handleTextPointerMove} onPointerUp={handleTextPointerUp} onPointerCancel={handleTextPointerUp} onWheel={e => handleTextWheel(e, 'backDates')}>
                                      <AutoFitSingleLineText text={formatDates(birthDate, deathDate, backDateFormat)} maxWidth="100%" style={{
                                        fontSize: backDatesSize === 'auto' ? '5px' : `${Math.max(4, (typeof backDatesSize === 'number' ? backDatesSize : 9) * 0.5)}px`,
                                        color: backDatesColor,
                                        fontWeight: datesBold ? 'bold' : 'normal',
                                        textAlign: 'center',
                                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                                      }} />
                                    </div>}
                                </div>

                                {/* Prayer - takes remaining space, centered vertically */}
                                <div ref={prayerContainerRef} className="flex-1 flex items-center justify-center overflow-hidden min-h-0 touch-none select-none" style={{
                                    cursor: draggingText === 'prayer' || resizingText === 'prayer' ? 'grabbing' : 'grab',
                                    paddingLeft: backBorderDesign !== 'none' ? '12px' : '2px',
                                    paddingRight: backBorderDesign !== 'none' ? '12px' : '2px',
                                    paddingTop: backBorderDesign !== 'none' ? '6px' : '0px',
                                    paddingBottom: backBorderDesign !== 'none' ? '6px' : '0px',
                                    boxSizing: 'border-box'
                                  }} onPointerDown={e => handleTextPointerDown(e, 'prayer')} onPointerMove={handleTextPointerMove} onPointerUp={handleTextPointerUp} onPointerCancel={handleTextPointerUp} onWheel={e => handleTextWheel(e, 'prayer')}>
                                  <p ref={prayerTextRef} className="font-serif text-center w-full" style={{
                                      color: prayerColor,
                                      fontSize: `${Math.max(5, resolvedPrayerFontPx * 0.5)}px`,
                                      lineHeight: `${getPrayerLineHeightPx(Math.max(5, resolvedPrayerFontPx * 0.5))}px`,
                                      whiteSpace: 'pre-wrap',
                                      overflowWrap: 'anywhere',
                                      wordBreak: 'break-word',
                                      fontWeight: prayerBold ? 'bold' : 'normal',
                                      fontStyle: prayerItalic ? 'italic' : 'normal',
                                      paddingBottom: '1px',
                                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                                      transform: `translate(${prayerPosition.x}%, ${prayerPosition.y}%)`,
                                      boxShadow: draggingText === 'prayer' || resizingText === 'prayer' ? '0 0 0 2px #d97706' : 'none',
                                      borderRadius: '4px'
                                    }}>
                                    {backText}
                                  </p>
                                </div>

                                {/* Footer Section - Logo and/or QR Code */}
                                <div className="shrink-0 flex flex-col items-center" style={{
                                marginBottom: backBorderDesign !== 'none' ? '8px' : '0px'
                              }}>
                                  {/* QR Code */}
                                  {qrValue && <QrCodeBadge value={qrValue} size={orientation === 'portrait' ? 48 : 40} level="M" paddingClassName="p-1" />}

                                  {/* Funeral Home Logo - Bottom */}
                                  {funeralHomeLogo && funeralHomeLogoPosition === 'bottom' && <div className="flex justify-center mt-1">
                                      <img src={funeralHomeLogo} alt="Funeral Home Logo" className="object-contain" style={{
                                        height: `${funeralHomeLogoSize}px`,
                                        maxWidth: '70%'
                                      }} onLoad={() => setPrayerLayoutNonce(n => n + 1)} />
                                    </div>}
                                </div>
                              </div>
                              
                              {/* Decorative Border Overlay - Paper cards only (Back) */}
                              {cardType === 'paper' && backBorderDesign !== 'none' && <div className="absolute inset-0 z-20 pointer-events-none">
                                  <DecorativeBorderOverlay type={backBorderDesign} color={backBorderColor} />
                                </div>}
                            </div>
                          </div>;
                          })()}
                        </div>
                      </div>

                      {/* Controls Section - Always Visible */}
                      <div className="flex flex-col items-center gap-4">
                        {/* Hidden file input for back background */}
                        <input ref={backInputRef} type="file" accept="image/*" className="hidden" onChange={e => {
                          if (e.target.files?.[0]) {
                            handleImageUpload(e.target.files[0], 'back');
                          }
                        }} />

                        {/* 1. Name & Dates (consolidated) */}
                        <div className="w-full max-w-md space-y-3 p-3 bg-slate-700/30 rounded-lg">
                          <Label className="text-white text-sm font-medium">Name & Dates</Label>
                          
                          {/* Name Controls */}
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 text-xs">Name</span>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={showNameOnBack} onChange={e => setShowNameOnBack(e.target.checked)} className="accent-amber-600" />
                              <span className="text-slate-400 text-xs">Show</span>
                            </label>
                          </div>
                          {showNameOnBack && <div className="space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Select value={backNameFont} onValueChange={setBackNameFont}>
                                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-8 w-[120px] text-xs">
                                    <SelectValue placeholder="Font" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {FONT_OPTIONS.map(font => <SelectItem key={font.value} value={font.value} style={{
                                    fontFamily: font.value
                                  }}>
                                        {font.name}
                                      </SelectItem>)}
                                  </SelectContent>
                                </Select>
                                <input type="color" value={backNameColor} onChange={e => setBackNameColor(e.target.value)} className="w-7 h-7 rounded border border-slate-600 cursor-pointer" />
                                <Button type="button" variant={backNameBold ? 'default' : 'outline'} size="sm" className={`h-7 px-3 text-xs font-bold ${backNameBold ? 'bg-amber-600 !text-white' : 'border-slate-600 text-slate-300'}`} onClick={() => setBackNameBold(!backNameBold)}>
                                  B
                                </Button>
                              </div>
                            </div>}
                          
                          {/* Dates Controls */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-600/50">
                            <span className="text-slate-400 text-xs">Dates</span>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={showDatesOnBack} onChange={e => setShowDatesOnBack(e.target.checked)} className="accent-amber-600" />
                              <span className="text-slate-400 text-xs">Show</span>
                            </label>
                          </div>
                          {showDatesOnBack && <div className="space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <input type="color" value={backDatesColor} onChange={e => setBackDatesColor(e.target.value)} className="w-7 h-7 rounded border border-slate-600 cursor-pointer" />
                                <Select value={backDateFormat} onValueChange={v => setBackDateFormat(v as any)}>
                                  <SelectTrigger className="h-7 w-[130px] bg-slate-700 border-slate-600 text-white text-xs">
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
                            </div>}
                        </div>
                        {/* Metal Finish Options - Only for metal cards */}
                        {cardType === 'metal' && <div className="w-full max-w-md">
                            <Label className="text-slate-400 text-xs mb-2 block">Metal Finish</Label>
                            <div className="flex gap-2 flex-wrap">
                              {METAL_BG_OPTIONS.map(metal => <button key={metal.id} type="button" onClick={() => {
                              setBackBgImage(null);
                              setBackMetalFinish(metal.id);
                              setBackBgZoom(1);
                              setBackBgPanX(0);
                              setBackBgPanY(0);
                              setBackBgRotation(0);
                              applyBackTextPalette(METAL_SAMPLE_HEX[metal.id] ?? '#ffffff', metal.isDark);
                            }} className={`w-12 h-16 rounded-lg overflow-hidden border-2 transition-all bg-gradient-to-br ${metal.gradient} ${!backBgImage && backMetalFinish === metal.id ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-slate-600 hover:border-slate-500'}`} title={metal.name} />)}
                            </div>
                          </div>}

                        {/* Preset Image Backgrounds */}
                        <div className="w-full max-w-md">
                          <Label className="text-slate-400 text-xs mb-2 block">Image Backgrounds</Label>
                          <div className="flex gap-2 flex-wrap">
                            {PRESET_BACKGROUNDS.map(bg => <button key={bg.id} type="button" onClick={() => {
                              setBackBgImage(bg.src);
                              setBackBgZoom(1);
                              setBackBgPanX(0);
                              setBackBgPanY(0);
                              setBackBgRotation(0);
                              void syncBackTextColors({
                                imageSrc: bg.src,
                                fallbackIsDark: bg.isDark
                              });
                            }} className={`w-12 h-16 rounded-lg overflow-hidden border-2 transition-all ${backBgImage === bg.src ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-slate-600 hover:border-slate-500'}`} title={bg.name}>
                                <img src={bg.src} alt={bg.name} className="w-full h-full object-cover" />
                              </button>)}
                          </div>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          <Button type="button" variant="outline" onClick={() => backInputRef.current?.click()} className="border-amber-600/50 text-amber-400 hover:bg-amber-600/20">
                            <ImageIcon className="h-4 w-4 mr-2" />
                            {backBgImage ? 'Change Background' : 'Upload Background'}
                          </Button>
                          {backBgImage && cardType === 'metal' && <>
                              <Button type="button" variant="outline" onClick={() => {
                              setBackBgImage(null);
                              setBackBgZoom(1);
                              setBackBgPanX(0);
                              setBackBgPanY(0);
                              setBackBgRotation(0);
                              // Reset to current metal finish colors
                              const currentMetal = METAL_BG_OPTIONS.find(m => m.id === backMetalFinish);
                              applyBackTextPalette(METAL_SAMPLE_HEX[backMetalFinish] ?? '#ffffff', currentMetal?.isDark ?? false);
                            }} className="border-slate-600 text-slate-300 hover:bg-slate-700">
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Use Metal
                              </Button>
                            </>}
                          {backBgImage && cardType === 'paper' && <Button type="button" variant="outline" onClick={() => {
                            setBackBgImage(null);
                            setBackBgZoom(1);
                            setBackBgPanX(0);
                            setBackBgPanY(0);
                            setBackBgRotation(0);
                            applyBackTextPalette('#ffffff', false); // Paper default is light
                          }} className="border-slate-600 text-slate-300 hover:bg-slate-700">
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Plain White
                            </Button>}
                        </div>


                        {/* In Loving Memory Controls */}
                        <div className="w-full max-w-md space-y-3 p-3 bg-slate-700/30 rounded-lg">
                          <div className="flex items-center justify-between">
                            <Label className="text-white text-sm font-medium">"In Loving Memory" Text</Label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={showInLovingMemory} onChange={e => setShowInLovingMemory(e.target.checked)} className="accent-amber-600" />
                              <span className="text-slate-400 text-xs">Show</span>
                            </label>
                          </div>
                          {showInLovingMemory && <>
                              <Input placeholder="In Loving Memory" value={inLovingMemoryText} onChange={e => setInLovingMemoryText(e.target.value)} className="bg-slate-700 border-slate-600 text-white" />
                              <div className="flex items-center gap-2">
                                <Label className="text-slate-400 text-xs">Font</Label>
                                <Select value={inLovingMemoryFont} onValueChange={setInLovingMemoryFont}>
                                  <SelectTrigger className="h-8 flex-1 bg-slate-700 border-slate-600 text-white text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-slate-800 border-slate-600">
                                    {FONT_OPTIONS.map(font => <SelectItem key={font.value} value={font.value} className="text-white text-xs">
                                        <span style={{
                                      fontFamily: font.value
                                    }}>{font.name}</span>
                                      </SelectItem>)}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <input type="color" value={inLovingMemoryColor} onChange={e => setInLovingMemoryColor(e.target.value)} className="w-7 h-7 rounded border border-slate-600 cursor-pointer" />
                                <Button type="button" variant={inLovingMemoryBold ? 'default' : 'outline'} size="sm" className={`h-7 px-3 text-xs font-bold ${inLovingMemoryBold ? 'bg-amber-600 text-white' : 'border-slate-600 text-slate-300'}`} onClick={() => setInLovingMemoryBold(!inLovingMemoryBold)}>
                                  B
                                </Button>
                              </div>
                            </>}
                        </div>

                        {/* 4. Prayer Selection */}
                        <div className="w-full max-w-md space-y-3 p-3 bg-slate-700/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Book className="h-4 w-4 text-slate-400" />
                            <Label className="text-white text-sm font-medium">Prayer</Label>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {[{
                              id: 'psalm-23',
                              label: 'Psalm 23'
                            }, {
                              id: 'serenity-prayer',
                              label: 'Serenity Prayer'
                            }, {
                              id: 'lords-prayer',
                              label: "Lord's Prayer"
                            }, {
                              id: 'irish-blessing',
                              label: 'Irish Blessing'
                            }, {
                              id: 'remember-me',
                              label: 'Remember Me'
                            }].map(prayer => <Button key={prayer.id} type="button" variant={selectedPrayerId === prayer.id ? 'default' : 'outline'} size="sm" onClick={() => handlePrayerSelect(prayer.id)} className={selectedPrayerId === prayer.id ? 'bg-amber-600 text-white' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}>
                                {prayer.label}
                              </Button>)}
                            <Button type="button" variant={selectedPrayerId === 'custom' ? 'default' : 'outline'} size="sm" onClick={() => setSelectedPrayerId('custom')} className={selectedPrayerId === 'custom' ? 'bg-amber-600 !text-white' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}>
                              ✏️ Custom
                            </Button>
                          </div>
                          
                          <Textarea placeholder="The Lord is my shepherd..." value={backText} onChange={e => {
                            setBackText(e.target.value);
                            setSelectedPrayerId('custom');
                          }} className="bg-slate-700 border-slate-600 text-white min-h-[80px]" rows={3} />
                          
                          {/* Prayer Text Size Control */}
                          <div className="flex items-center gap-3 flex-wrap">
                            <Label className="text-slate-400 text-xs">Text Size:</Label>
                            <div className="flex items-center gap-1">
                              <Button type="button" variant="outline" size="sm" onClick={() => setPrayerTextSize('auto')} className={`text-xs px-2 py-1 h-7 ${prayerTextSize === 'auto' ? 'bg-amber-600 !text-white border-amber-600' : 'border-slate-600 text-slate-300'}`}>
                                Auto Max
                              </Button>
                              <Button type="button" variant={prayerBold ? 'default' : 'outline'} size="sm" className={`h-7 px-3 text-xs font-bold ${prayerBold ? 'bg-amber-600 !text-white' : 'border-slate-600 text-slate-300'}`} onClick={() => setPrayerBold(!prayerBold)}>
                                B
                              </Button>
                              <Button type="button" variant={prayerItalic ? 'default' : 'outline'} size="sm" className={`h-7 px-3 text-xs italic ${prayerItalic ? 'bg-amber-600 !text-white' : 'border-slate-600 text-slate-300'}`} onClick={() => setPrayerItalic(!prayerItalic)}>
                                I
                              </Button>
                              <input type="color" value={prayerColor} onChange={e => setPrayerColor(e.target.value)} className="w-7 h-7 rounded border border-slate-600 cursor-pointer bg-transparent" />
                              <Button type="button" variant="outline" size="sm" onClick={() => setPrayerColor('#ffffff')} className={`h-7 px-2 text-xs ${prayerColor === '#ffffff' ? 'bg-white text-black border-amber-500' : 'border-slate-600 text-slate-300'}`}>
                                W
                              </Button>
                              <Button type="button" variant="outline" size="sm" onClick={() => setPrayerColor('#000000')} className={`h-7 px-2 text-xs ${prayerColor === '#000000' ? 'bg-black text-white border-amber-500' : 'border-slate-600 text-slate-300'}`}>
                                B
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* 5. Funeral Home Logo Upload */}
                        <div className="w-full max-w-md space-y-3 p-3 bg-slate-700/30 rounded-lg">
                          <Label className="text-white text-sm font-medium">Funeral Home Logo</Label>
                          <div className="flex gap-2 flex-wrap">
                            <Button type="button" variant="outline" onClick={() => logoInputRef.current?.click()} className="border-amber-600/50 text-amber-400 hover:bg-amber-600/20">
                              <ImageIcon className="h-4 w-4 mr-2" />
                              {funeralHomeLogo ? 'Change Logo' : 'Upload Logo'}
                            </Button>
                            {funeralHomeLogo && <Button type="button" variant="outline" onClick={() => setFuneralHomeLogo(null)} className="border-rose-600/50 text-rose-400 hover:bg-rose-600/20">
                                <Trash2 className="h-4 w-4" />
                              </Button>}
                          </div>
                          {funeralHomeLogo && <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <Label className="text-slate-400 text-xs">Position</Label>
                                <div className="flex gap-1">
                                  <Button type="button" variant={funeralHomeLogoPosition === 'top' ? 'default' : 'outline'} size="sm" className={`h-7 px-3 text-xs ${funeralHomeLogoPosition === 'top' ? 'bg-amber-600 text-white' : 'border-slate-600 text-slate-300'}`} onClick={() => setFuneralHomeLogoPosition('top')}>
                                    Top
                                  </Button>
                                  <Button type="button" variant={funeralHomeLogoPosition === 'bottom' ? 'default' : 'outline'} size="sm" className={`h-7 px-3 text-xs ${funeralHomeLogoPosition === 'bottom' ? 'bg-amber-600 text-white' : 'border-slate-600 text-slate-300'}`} onClick={() => setFuneralHomeLogoPosition('bottom')}>
                                    Bottom
                                  </Button>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Label className="text-slate-400 text-xs">Size</Label>
                                <div className="flex items-center gap-2">
                                  <Button type="button" variant="outline" size="sm" className="h-7 w-7 p-0 border-slate-600 text-slate-300 hover:bg-slate-600" onClick={() => setFuneralHomeLogoSize(Math.max(20, funeralHomeLogoSize - 5))} disabled={funeralHomeLogoSize <= 20}>
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="text-slate-300 text-xs min-w-[2rem] text-center">{funeralHomeLogoSize}</span>
                                  <Button type="button" variant="outline" size="sm" className="h-7 w-7 p-0 border-slate-600 text-slate-300 hover:bg-slate-600" onClick={() => setFuneralHomeLogoSize(Math.min(100, funeralHomeLogoSize + 5))} disabled={funeralHomeLogoSize >= 100}>
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>}
                        </div>

                        {/* 6. QR Code URL */}
                        <div className="w-full max-w-md space-y-2 p-3 bg-slate-700/30 rounded-lg">
                          <div className="flex items-center justify-between">
                            <Label className="text-white text-sm font-medium">QR Code Link</Label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={showQrCode} onChange={e => setShowQrCode(e.target.checked)} className="accent-amber-600" />
                              <span className="text-slate-400 text-xs">Show</span>
                            </label>
                          </div>
                          {showQrCode && <>
                              <Input placeholder="https://example.com" value={qrUrl} onChange={e => setQrUrl(e.target.value)} className="bg-slate-700 border-slate-600 text-white" />
                              <p className="text-xs text-slate-500">Enter URL to generate QR code on card</p>
                            </>}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Paper cards: Design Quantity */}
                  {cardType === 'paper' && <div className="space-y-4">

                      {/* Main Design with Quantity */}
                      <div className={`rounded-xl p-5 border cursor-pointer transition-all ${activeDesignIndex === -1 ? 'bg-gradient-to-br from-amber-900/20 to-slate-800/50 border-amber-500/50' : 'bg-slate-800/50 border-slate-600 hover:border-slate-500'}`} onClick={() => {
                      setActiveDesignIndex(-1);
                      window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                      });
                    }}>
                        <div className="flex flex-wrap items-center gap-4">
                          {/* Thumbnails - Front & Back */}
                          <div className="flex gap-1 flex-shrink-0">
                            {/* Front Thumbnail */}
                            <div className="w-14 h-20 bg-slate-700 rounded-lg overflow-hidden shadow-lg relative">
                              {deceasedPhoto ? <img src={deceasedPhoto} alt="Main design front" className="w-full h-full object-cover" style={{
                              transform: `translate(${photoPanX * 0.1}px, ${photoPanY * 0.1}px) scale(${photoZoom})`,
                              filter: `brightness(${photoBrightness}%)`
                            }} /> : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-700">
                                  <ImageIcon className="h-5 w-5 text-slate-400" />
                                </div>}
                              <span className="absolute bottom-0.5 left-0.5 text-[8px] bg-black/50 text-white px-1 rounded">F</span>
                            </div>
                            {/* Back Thumbnail */}
                            <div className="w-14 h-20 bg-slate-700 rounded-lg overflow-hidden shadow-lg relative" style={{
                            backgroundImage: backBgImage ? `url(${backBgImage})` : undefined,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundColor: !backBgImage ? backMetalFinish === 'white' ? '#f8f8f8' : backMetalFinish === 'gold' ? '#d4af37' : backMetalFinish === 'silver' ? '#c0c0c0' : '#18181b' : undefined
                          }}>
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
                              {activeDesignIndex === -1 && <span className="text-xs bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded">Editing</span>}
                            </div>
                            <p className="text-slate-400 text-sm">{deceasedName || 'Your Design'}</p>
                            {activeDesignIndex !== -1 && <Button type="button" variant="outline" size="sm" onClick={e => {
                            e.stopPropagation();
                            setActiveDesignIndex(-1);
                            window.scrollTo({
                              top: 0,
                              behavior: 'smooth'
                            });
                          }} className="border-amber-600/50 text-amber-400 hover:bg-amber-600/20 text-xs h-7 mt-2">
                                Edit Design
                              </Button>}
                          </div>
                          
                          <div className="ml-auto flex flex-col items-end gap-1 flex-shrink-0">
                            <Label className="text-slate-400 text-xs">How many?</Label>
                            <div className="flex items-center gap-2">
                              <Button type="button" variant="outline" size="icon" onClick={e => {
                              e.stopPropagation();
                              setMainDesignQty(Math.max(1, mainDesignQty - 12));
                            }} className="h-8 w-8 border-slate-600 text-slate-300">
                                −
                              </Button>
                              <input type="number" min="1" value={mainDesignQty} onClick={e => e.stopPropagation()} onChange={e => setMainDesignQty(Math.max(1, parseInt(e.target.value) || 1))} className="w-20 h-8 px-2 text-center text-base sm:text-lg leading-none font-bold tabular-nums bg-slate-800 border border-amber-500/50 rounded text-white appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                              <Button type="button" variant="outline" size="icon" onClick={e => {
                              e.stopPropagation();
                              setMainDesignQty(mainDesignQty + 12);
                            }} className="h-8 w-8 border-slate-600 text-slate-300">
                                +
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Additional Designs - Inline */}
                      {additionalDesigns.map((design, idx) => <div key={idx} className={`rounded-xl p-5 border cursor-pointer transition-all ${activeDesignIndex === idx ? 'bg-gradient-to-br from-amber-900/20 to-slate-800/50 border-amber-500/50' : 'bg-slate-800/50 border-slate-600 hover:border-slate-500'}`} onClick={() => {
                      setActiveDesignIndex(idx);
                      window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                      });
                    }}>
                          <div className="flex flex-wrap items-center gap-4">
                            {/* Thumbnails - Front & Back */}
                            <div className="flex gap-1 flex-shrink-0">
                              {/* Front Thumbnail */}
                              <div className="w-14 h-20 bg-slate-700 rounded-lg overflow-hidden shadow-lg relative">
                                {design.photo ? <img src={design.photo} alt={`Design ${idx + 2} front`} className="w-full h-full object-cover" style={{
                              transform: `scale(${design.photoZoom})`
                            }} /> : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-700">
                                    <ImageIcon className="h-5 w-5 text-slate-400" />
                                  </div>}
                                <span className="absolute bottom-0.5 left-0.5 text-[8px] bg-black/50 text-white px-1 rounded">F</span>
                              </div>
                              {/* Back Thumbnail */}
                              <div className="w-14 h-20 bg-slate-700 rounded-lg overflow-hidden shadow-lg relative" style={{
                            backgroundImage: design.backgroundId ? `url(${PRESET_BACKGROUNDS.find(b => b.id === design.backgroundId)?.src || ''})` : design.customBackground ? `url(${design.customBackground})` : undefined,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundColor: !design.backgroundId && !design.customBackground ? '#f8f8f8' : undefined
                          }}>
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-1">
                                  <span className="text-[6px] text-white text-center leading-tight line-clamp-4">{design.prayerText.slice(0, 60)}...</span>
                                </div>
                                <span className="absolute bottom-0.5 left-0.5 text-[8px] bg-black/50 text-white px-1 rounded">B</span>
                              </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-white font-semibold">Design {idx + 2}</span>
                                {design.photo && <span className="text-xs text-green-400 bg-green-500/20 px-1.5 py-0.5 rounded">Photo ✓</span>}
                                <span className="text-xs text-amber-400">+${ADDITIONAL_DESIGN_PRICE}</span>
                                {activeDesignIndex === idx && <span className="text-xs bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded">Editing</span>}
                              </div>
                              <p className="text-slate-400 text-sm truncate mb-2">{design.prayerText.slice(0, 30)}...</p>
                              <div className="flex gap-2">
                                <Button type="button" variant="outline" size="sm" onClick={e => {
                              e.stopPropagation();
                              setActiveDesignIndex(idx);
                              window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                              });
                            }} className="border-amber-600/50 text-amber-400 hover:bg-amber-600/20 text-xs h-7">
                                  Edit Design
                                </Button>
                                <Button type="button" variant="ghost" size="sm" onClick={e => {
                              e.stopPropagation();
                              setAdditionalDesigns(additionalDesigns.filter((_, i) => i !== idx));
                              if (activeDesignIndex === idx) {
                                setActiveDesignIndex(-1);
                              } else if (activeDesignIndex > idx) {
                                setActiveDesignIndex(activeDesignIndex - 1);
                              }
                            }} className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 text-xs h-7">
                                  <Trash2 className="h-3 w-3 mr-1" /> Remove
                                </Button>
                              </div>
                            </div>
                            
                            <div className="ml-auto flex flex-col items-end gap-1 flex-shrink-0">
                              <Label className="text-slate-400 text-xs">How many?</Label>
                              <div className="flex items-center gap-2">
                                <Button type="button" variant="outline" size="icon" onClick={e => {
                              e.stopPropagation();
                              const newDesigns = [...additionalDesigns];
                              newDesigns[idx].qty = Math.max(1, design.qty - 12);
                              setAdditionalDesigns(newDesigns);
                            }} className="h-8 w-8 border-slate-600 text-slate-300">
                                  −
                                </Button>
                                <input type="number" min="1" value={design.qty} onClick={e => e.stopPropagation()} onChange={e => {
                              const newDesigns = [...additionalDesigns];
                              newDesigns[idx].qty = Math.max(1, parseInt(e.target.value) || 1);
                              setAdditionalDesigns(newDesigns);
                            }} className="w-20 h-8 px-2 text-center text-base sm:text-lg leading-none font-bold tabular-nums bg-slate-800 border border-slate-500 rounded text-white appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                <Button type="button" variant="outline" size="icon" onClick={e => {
                              e.stopPropagation();
                              const newDesigns = [...additionalDesigns];
                              newDesigns[idx].qty = design.qty + 12;
                              setAdditionalDesigns(newDesigns);
                            }} className="h-8 w-8 border-slate-600 text-slate-300">
                                  +
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>)}

                      {/* Add More Cards Button - Prominent */}
                      <button type="button" onClick={() => {
                      const newDesign = createEmptyDesign();
                      setAdditionalDesigns([...additionalDesigns, newDesign]);
                      setActiveDesignIndex(additionalDesigns.length);
                      window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                      });
                    }} className="w-full p-5 bg-gradient-to-r from-emerald-600/30 via-emerald-500/20 to-emerald-600/30 border-2 border-emerald-500/60 hover:border-emerald-400 hover:from-emerald-600/40 hover:via-emerald-500/30 hover:to-emerald-600/40 rounded-xl transition-all group shadow-lg shadow-emerald-900/20">
                        <div className="flex items-center justify-center gap-4">
                          {/* Plus Icon */}
                          <div className="w-12 h-12 rounded-full bg-emerald-500/30 flex items-center justify-center group-hover:bg-emerald-500/40 transition-colors">
                            <Plus className="h-6 w-6 text-emerald-300" />
                          </div>
                          <div className="flex flex-col items-start">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-lg text-emerald-300">Add More Cards</span>
                              <span className="bg-emerald-500 text-black text-xs font-bold px-2 py-0.5 rounded animate-pulse">+$7</span>
                            </div>
                            <span className="text-slate-300 text-sm">Different photo, background, or prayer</span>
                          </div>
                        </div>
                      </button>

                      {/* Total Summary */}
                      {(additionalDesigns.length > 0 || mainDesignQty > 0) && <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-4">
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
                        </div>}
                    </div>}

                    <Button type="button" onClick={() => {
                    if (!deceasedName.trim()) {
                      toast.error('Please enter the name for the card');
                      return;
                    }
                    setStep(2);
                  }} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold">
                      Continue <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>}


              {/* Step 2: Package Selection (Metal) / Order Summary (Paper) */}
              {step === 2 && <div className="space-y-6">
                  {/* Paper Cards: Simple Order Summary */}
                  {cardType === 'paper' ? <>
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
                            <span className="text-slate-300">Memorial Photo</span>
                            <span className="text-white font-medium">1 included</span>
                          </div>
                          
                          {additionalDesigns.length > 0 && <div className="flex justify-between items-center py-2 border-b border-slate-600">
                              <span className="text-slate-300">Designs</span>
                              <span className="text-white font-medium">{1 + additionalDesigns.length} different designs</span>
                            </div>}
                          
                          <div className="flex justify-between items-center py-2 border-b border-slate-600">
                            <span className="text-slate-300">Card Sizes</span>
                            <span className="text-white font-medium text-sm">
                              {mainDesignSize === '3.125x4.875' ? 'Main: Large' : 'Main: Standard'}
                              {additionalDesigns.length > 0 && `, +${additionalDesigns.filter(d => d.size === '3.125x4.875').length} large`}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center py-2">
                            <span className="text-slate-300">Shipping</span>
                            <span className="text-white font-medium">Delivered in 48-72 hours</span>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-t border-slate-600 mt-2 pt-3">
                            <span className="text-slate-300">Corners</span>
                            <span className="text-white font-medium">{paperCornerRadius !== 'none' ? 'Rounded' : 'Square'}</span>
                          </div>
                        </div>
                        
                      </div>
                    </> : (/* Metal Cards: Package Selection */
                <div>
                      <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                        <Package className="h-5 w-5 text-amber-400" />
                        Choose Your Package
                      </h3>
                      
                      <div className="grid grid-cols-1 gap-4">
                        {Object.entries(packages).map(([id, pkg]) => {
                      const showCompare = pkg.comparePrice > pkg.price;
                      return <button key={id} type="button" onClick={() => setSelectedPackage(id as PackageId)} className={`relative p-5 rounded-xl border-2 transition-all text-left ${selectedPackage === id as PackageId ? 'border-amber-500 bg-gradient-to-br from-amber-600/20 to-amber-900/10' : 'border-slate-600 hover:border-amber-500/50'}`}>
                              {pkg.popular && <div className="absolute -top-3 left-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                  MOST POPULAR
                                </div>}

                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h4 className="text-xl font-bold text-white">{pkg.name}</h4>
                                    {pkg.badge === 'BEST VALUE' && <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">BEST VALUE</span>}
                                  </div>
                                  <p className="text-slate-400 text-sm mb-3">{pkg.description}</p>
                                  <ul className="space-y-1.5 text-sm">
                                    <li className="flex items-center gap-2 text-slate-300">
                                      <span className="text-amber-400">✓</span>
                                      {pkg.cards} Premium Metal Cards
                                      {pkg.thickness === 'premium' && <span className="text-amber-400 text-xs">(Premium .080\")</span>}
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
                                  {showCompare && <>
                                      <span className="text-slate-500 line-through text-sm">${pkg.comparePrice}</span>
                                      <p className="text-amber-400 text-xs font-medium">Save ${pkg.comparePrice - pkg.price}</p>
                                    </>}
                                </div>
                              </div>

                              {selectedPackage === id as PackageId && <div className="absolute top-4 right-4 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm">✓</span>
                                </div>}
                            </button>;
                    })}
                      </div>
                    </div>)}

                  {/* Add-ons */}
                  <div className="space-y-4">
                    <Label className="text-slate-400 block text-sm">Customize (Optional)</Label>
                    
                    {/* Additional Card Sets (metal only) */}
                    {cardType === 'metal' && <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Extra Card Sets (+55 each)</p>
                          <p className="text-slate-400 text-sm">${METAL_ADDITIONAL_SET_PRICE} per set</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button type="button" variant="outline" size="icon" onClick={() => setExtraSets(Math.max(0, extraSets - 1))} className="h-8 w-8 border-slate-600">
                            −
                          </Button>
                          <span className="text-white w-8 text-center">{extraSets}</span>
                          <Button type="button" variant="outline" size="icon" onClick={() => setExtraSets(extraSets + 1)} className="h-8 w-8 border-slate-600">
                            +
                          </Button>
                        </div>
                      </div>}

                    {/* Memorial Photos Section */}
                    <div className="p-4 bg-gradient-to-br from-amber-900/30 to-amber-800/10 border-2 border-amber-500/40 rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center shrink-0">
                          <ImageIcon className="h-6 w-6 text-amber-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-white font-semibold">Memorial Photos</p>
                          </div>
                          <p className="text-slate-400 text-sm mb-3">
                            Large format prints for display at the service
                          </p>
                          
                          {/* Photo sizes & pricing */}
                          <div className="flex gap-3 mb-3">
                            <div className="bg-slate-800/50 rounded-lg p-2 text-center flex-1">
                              <p className="text-white font-bold text-sm">16×20"</p>
                              <p className="text-amber-400 text-xs font-medium">$17/photo</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-2 text-center flex-1 border border-amber-500/30">
                              <p className="text-white font-bold text-sm">18×24"</p>
                              <p className="text-amber-400 text-xs font-medium">$24/photo</p>
                              <p className="text-[10px] text-slate-500">20% larger</p>
                            </div>
                          </div>

                          {/* Current count if any */}
                          {memorialPhotos.length > 0 && (
                            <div className="flex items-center justify-between bg-amber-500/20 rounded-lg p-2 mb-3">
                              <span className="text-amber-300 text-sm">{memorialPhotos.length} photo{memorialPhotos.length > 1 ? 's' : ''} selected</span>
                              <span className="text-white font-bold">
                                +${memorialPhotos.length * ADDITIONAL_PHOTO_PRICE + memorialPhotos.filter(p => p.size === '18x24').length * PHOTO_18X24_UPSELL}
                              </span>
                            </div>
                          )}

                          {/* Add Photos Button */}
                          <input 
                            ref={memorialPhotosInputRef}
                            type="file" 
                            accept="image/*" 
                            multiple 
                            className="hidden" 
                            onChange={e => handleMemorialPhotosUpload(e.target.files)} 
                          />
                          <Button 
                            type="button" 
                            onClick={() => memorialPhotosInputRef.current?.click()}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            {memorialPhotos.length > 0 ? 'Add More Memorial Photos' : 'Add Memorial Photos'}
                          </Button>

                          {/* Show uploaded photos thumbnails */}
                          {memorialPhotos.length > 0 && (
                            <div className="mt-3 grid grid-cols-4 gap-2">
                              {memorialPhotos.map((photo, idx) => (
                                <div 
                                  key={idx} 
                                  className="relative group"
                                  style={{
                                    // FIXED bounding container - never changes size
                                    aspectRatio: '4/5',
                                    width: '100%',
                                    overflow: 'hidden', // CRITICAL: Never allow overflow
                                  }}
                                >
                                  <img 
                                    src={photo.src} 
                                    alt={`Memorial Photo ${idx + 1}`} 
                                    className="rounded-lg border border-slate-600"
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover',
                                      // Image scales within container, container stays fixed
                                    }}
                                  />
                                  <div className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1 rounded">
                                    {photo.size}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeMemorialPhoto(idx)}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    ×
                                  </button>
                                  {/* Size toggle */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newPhotos = [...memorialPhotos];
                                      newPhotos[idx].size = photo.size === '16x20' ? '18x24' : '16x20';
                                      setMemorialPhotos(newPhotos);
                                    }}
                                    className="absolute bottom-1 right-1 bg-amber-600/90 hover:bg-amber-500 text-white text-[8px] px-1 py-0.5 rounded transition-colors"
                                  >
                                    ↔
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Celebration of Life Photos Section */}
                    <div className="p-4 bg-gradient-to-br from-purple-900/30 to-purple-800/10 border-2 border-purple-500/40 rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center shrink-0">
                          <Sparkles className="h-6 w-6 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-white font-semibold">Celebration of Life Photos</p>
                            <span className="bg-purple-500/30 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded">POPULAR</span>
                          </div>
                          <p className="text-slate-400 text-sm mb-3">
                            Beautiful prints for home display & keepsakes
                          </p>
                          
                          {/* Photo sizes & pricing */}
                          <div className="flex gap-3 mb-3">
                            <div className="bg-slate-800/50 rounded-lg p-2 text-center flex-1">
                              <p className="text-white font-bold text-sm">16×20"</p>
                              <p className="text-purple-400 text-xs font-medium">$17/photo</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-2 text-center flex-1 border border-purple-500/30">
                              <p className="text-white font-bold text-sm">18×24"</p>
                              <p className="text-purple-400 text-xs font-medium">$24/photo</p>
                              <p className="text-[10px] text-slate-500">20% larger</p>
                            </div>
                          </div>

                          {/* Current count if any */}
                          {celebrationPhotos.length > 0 && (
                            <div className="flex items-center justify-between bg-purple-500/20 rounded-lg p-2 mb-3">
                              <span className="text-purple-300 text-sm">{celebrationPhotos.length} photo{celebrationPhotos.length > 1 ? 's' : ''} selected</span>
                              <span className="text-white font-bold">
                                +${celebrationPhotos.length * ADDITIONAL_PHOTO_PRICE + celebrationPhotos.filter(p => p.size === '18x24').length * PHOTO_18X24_UPSELL}
                              </span>
                            </div>
                          )}

                          {/* Add Photos Button */}
                          <input 
                            ref={celebrationPhotosInputRef}
                            type="file" 
                            accept="image/*" 
                            multiple 
                            className="hidden" 
                            onChange={e => handleCelebrationPhotosUpload(e.target.files)} 
                          />
                          <Button 
                            type="button" 
                            onClick={() => celebrationPhotosInputRef.current?.click()}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            {celebrationPhotos.length > 0 ? 'Add More Celebration Photos' : 'Add Celebration Photos'}
                          </Button>

                          {/* Show uploaded photos thumbnails */}
                          {celebrationPhotos.length > 0 && (
                            <div className="mt-3 grid grid-cols-4 gap-2">
                              {celebrationPhotos.map((photo, idx) => (
                                <div 
                                  key={idx} 
                                  className="relative group"
                                  style={{
                                    // FIXED bounding container - never changes size
                                    aspectRatio: '4/5',
                                    width: '100%',
                                    overflow: 'hidden', // CRITICAL: Never allow overflow
                                  }}
                                >
                                  <img 
                                    src={photo.src} 
                                    alt={`Celebration Photo ${idx + 1}`} 
                                    className="rounded-lg border border-slate-600"
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover',
                                      // Image scales within container, container stays fixed
                                    }}
                                  />
                                  <div className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1 rounded">
                                    {photo.size}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeCelebrationPhoto(idx)}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    ×
                                  </button>
                                  {/* Size toggle */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newPhotos = [...celebrationPhotos];
                                      newPhotos[idx].size = photo.size === '16x20' ? '18x24' : '16x20';
                                      setCelebrationPhotos(newPhotos);
                                    }}
                                    className="absolute bottom-1 right-1 bg-purple-600/90 hover:bg-purple-500 text-white text-[8px] px-1 py-0.5 rounded transition-colors"
                                  >
                                    ↔
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Premium Thickness Upgrade (metal only, only if package doesn't include it) */}
                    {cardType === 'metal' && currentPackage.thickness !== 'premium' && <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${upgradeThickness ? 'bg-amber-900/30 border-amber-500' : 'bg-slate-700/30 border-transparent hover:border-slate-500'}`} onClick={() => setUpgradeThickness(!upgradeThickness)}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <input type="checkbox" id="upgradeThickness" checked={upgradeThickness} onChange={e => setUpgradeThickness(e.target.checked)} className="accent-amber-600 w-5 h-5 mt-1" onClick={e => e.stopPropagation()} />
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
                          <span className="text-amber-400 font-bold text-lg">+${PREMIUM_THICKNESS_PRICE * (currentPackage.cards / 55 + extraSets)}</span>
                        </div>
                      </div>}

                    {/* Paper Card Size Upsell - prominent clickable upgrade */}
                    {cardType === 'paper' && <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${mainDesignSize === '3.125x4.875' ? 'bg-gradient-to-br from-amber-900/40 to-amber-800/20 border-amber-500 shadow-lg shadow-amber-500/20' : 'bg-slate-700/30 border-slate-600 hover:border-amber-500/50 hover:bg-slate-700/50'}`} onClick={() => setMainDesignSize(mainDesignSize === '3.125x4.875' ? '2.625x4.375' : '3.125x4.875')}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <input type="checkbox" checked={mainDesignSize === '3.125x4.875'} onChange={() => setMainDesignSize(mainDesignSize === '3.125x4.875' ? '2.625x4.375' : '3.125x4.875')} className="accent-amber-600 w-5 h-5 mt-1" onClick={e => e.stopPropagation()} />
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-white font-medium">Upgrade to Larger Cards</p>
                                {mainDesignSize !== '3.125x4.875' && <span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">
                                    RECOMMENDED
                                  </span>}
                              </div>
                              <p className="text-slate-400 text-sm mb-3">
                                20% bigger — easier to read, more impactful
                              </p>
                              
                              {/* Visual comparison */}
                              <div className="flex items-end gap-6 mt-2">
                                <div className="flex flex-col items-center">
                                  <div className={`w-10 h-14 rounded-sm shadow-md transition-all ${mainDesignSize === '2.625x4.375' ? 'border-2 border-white/50 bg-white/5' : 'border border-slate-500'}`} />
                                  <span className={`text-xs mt-1.5 ${mainDesignSize === '2.625x4.375' ? 'text-white' : 'text-slate-500'}`}>
                                    Standard
                                  </span>
                                  <span className="text-[10px] text-slate-600">2.5×4.25"</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <div className={`w-12 h-[4.25rem] rounded-sm shadow-lg transition-all ${mainDesignSize === '3.125x4.875' ? 'border-2 border-amber-400 bg-gradient-to-b from-amber-400/20 to-amber-600/20' : 'border-2 border-amber-500/50 bg-amber-500/10'}`} />
                                  <span className={`text-xs mt-1.5 font-medium ${mainDesignSize === '3.125x4.875' ? 'text-amber-400' : 'text-amber-500'}`}>
                                    Large
                                  </span>
                                  <span className="text-[10px] text-amber-500/80">3×4.75"</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="bg-green-500/20 border border-green-500/40 rounded-lg px-3 py-1.5">
                              <span className="text-green-400 font-bold text-lg">Only ${PAPER_SIZE_UPSELL}</span>
                              <p className="text-green-400/70 text-xs font-medium">one-time upgrade</p>
                            </div>
                          </div>
                        </div>
                        {mainDesignSize === '3.125x4.875' && <div className="mt-3 pt-3 border-t border-amber-500/30 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                            <span className="text-green-400 text-sm font-medium">Large size selected</span>
                          </div>}
                      </div>}


                    {/* Shipping Speed Selection */}
                    <div className="space-y-3">
                      <Label className="text-slate-400 block text-sm">Shipping Speed</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {(Object.entries(SHIPPING_PRICES) as [ShippingSpeed, {
                        price: number;
                        label: string;
                      }][]).map(([speed, info]) => <button key={speed} type="button" onClick={() => setShippingSpeed(speed)} className={`p-4 rounded-lg border-2 transition-all text-left ${shippingSpeed === speed ? 'border-amber-500 bg-amber-900/20' : 'border-slate-600 hover:border-slate-500'}`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-white font-medium">{info.label}</p>
                                <p className="text-slate-400 text-sm">
                                  {speed === '48hour' ? 'Rush delivery' : 'Standard delivery'}
                                </p>
                              </div>
                              <span className="text-amber-400 font-bold">${info.price}</span>
                            </div>
                            {shippingSpeed === speed && <div className="absolute top-2 right-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>}
                          </button>)}
                      </div>
                    </div>

                  </div>

                  {/* Price Summary */}
                  <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-slate-300 text-sm">Your Order</p>
                        <p className="text-white font-medium">
                          {cardType === 'paper' ? `${mainDesignQty + additionalDesigns.reduce((sum, d) => sum + d.qty, 0)} Photo Prayer Cards` : `${currentPackage.name} Package + Add-ons`}
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-amber-400">${calculatePrice()}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700">
                      <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                    <Button type="button" onClick={() => setStep(3)} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold">
                      Continue <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>}

              {/* Step 3: Shipping Information */}
              {step === 3 && <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-5 w-5 text-amber-400" />
                    <Label className="text-white font-semibold text-lg">Shipping Address</Label>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-400">Full Name *</Label>
                        <Input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="John Smith" className="bg-slate-700 border-slate-600 text-white" required />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-400">Email *</Label>
                        <Input type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} placeholder="john@example.com" className="bg-slate-700 border-slate-600 text-white" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-400">Street Address *</Label>
                      <Input value={shippingStreet} onChange={e => setShippingStreet(e.target.value)} placeholder="123 Main Street, Apt 4B" className="bg-slate-700 border-slate-600 text-white" required />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2 col-span-2 md:col-span-2">
                        <Label className="text-slate-400">City *</Label>
                        <Input value={shippingCity} onChange={e => setShippingCity(e.target.value)} placeholder="New York" className="bg-slate-700 border-slate-600 text-white" required />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-400">State *</Label>
                        <Input value={shippingState} onChange={e => setShippingState(e.target.value)} placeholder="NY" className="bg-slate-700 border-slate-600 text-white" required />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-400">ZIP *</Label>
                        <Input value={shippingZip} onChange={e => setShippingZip(e.target.value)} placeholder="10001" className="bg-slate-700 border-slate-600 text-white" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-400">Phone Number *</Label>
                      <Input type="tel" value={shippingPhone} onChange={e => setShippingPhone(e.target.value)} placeholder="(555) 123-4567" className="bg-slate-700 border-slate-600 text-white" required />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700">
                      <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                    <Button type="button" onClick={() => {
                    if (!customerName.trim() || !customerEmail.trim() || !shippingStreet.trim() || !shippingCity.trim() || !shippingState.trim() || !shippingZip.trim() || !shippingPhone.trim()) {
                      toast.error('Please fill in all shipping fields');
                      return;
                    }
                    setStep(4);
                  }} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold">
                      Review Order <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>}

              {/* Step 4: Review & Order */}
              {step === 4 && <div className="space-y-6">
                  {/* Order Summary */}
                  <div className="bg-slate-700/30 rounded-lg p-6 space-y-4">
                    <h4 className="text-white font-semibold text-lg mb-4">Order Summary</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-300">{currentPackage.name} Package ({currentPackage.cards} cards + {currentPackage.photos} photos)</span>
                        <span className="text-white">${currentPackage.price}</span>
                      </div>
                      
                      {cardType === 'metal' && extraSets > 0 && <div className="flex justify-between">
                          <span className="text-slate-300">Extra Card Sets × {extraSets}</span>
                          <span className="text-white">${extraSets * METAL_ADDITIONAL_SET_PRICE}</span>
                        </div>}
                      
                      {/* Memorial Photos */}
                      {memorialPhotos.length > 0 && <div className="flex justify-between">
                          <span className="text-slate-300">Memorial Photos × {memorialPhotos.length}</span>
                          <span className="text-white">${memorialPhotos.length * ADDITIONAL_PHOTO_PRICE}</span>
                        </div>}
                      
                      {memorialPhotos.some(p => p.size === '18x24') && <div className="flex justify-between">
                          <span className="text-slate-300">Memorial 18×24 Upgrades × {memorialPhotos.filter(p => p.size === '18x24').length}</span>
                          <span className="text-white">${PHOTO_18X24_UPSELL * memorialPhotos.filter(p => p.size === '18x24').length}</span>
                        </div>}
                      
                      {/* Celebration of Life Photos */}
                      {celebrationPhotos.length > 0 && <div className="flex justify-between">
                          <span className="text-slate-300">Celebration Photos × {celebrationPhotos.length}</span>
                          <span className="text-white">${celebrationPhotos.length * ADDITIONAL_PHOTO_PRICE}</span>
                        </div>}
                      
                      {celebrationPhotos.some(p => p.size === '18x24') && <div className="flex justify-between">
                          <span className="text-slate-300">Celebration 18×24 Upgrades × {celebrationPhotos.filter(p => p.size === '18x24').length}</span>
                          <span className="text-white">${PHOTO_18X24_UPSELL * celebrationPhotos.filter(p => p.size === '18x24').length}</span>
                        </div>}
                      
                      {cardType === 'metal' && upgradeThickness && currentPackage.thickness !== 'premium' && <div className="flex justify-between">
                          <span className="text-slate-300">Premium Thickness Upgrade</span>
                          <span className="text-white">${PREMIUM_THICKNESS_PRICE * (currentPackage.cards / 55 + extraSets)}</span>
                        </div>}
                      
                      {cardType === 'paper' && (mainDesignSize === '3.125x4.875' ? 1 : 0) + additionalDesigns.filter(d => d.size === '3.125x4.875').length > 0 && <div className="flex justify-between">
                          <span className="text-slate-300">Large Size Upgrades × {(mainDesignSize === '3.125x4.875' ? 1 : 0) + additionalDesigns.filter(d => d.size === '3.125x4.875').length}</span>
                          <span className="text-white">${((mainDesignSize === '3.125x4.875' ? 1 : 0) + additionalDesigns.filter(d => d.size === '3.125x4.875').length) * PAPER_SIZE_UPSELL}</span>
                        </div>}
                      
                      {cardType === 'paper' && additionalDesigns.length > 0 && <div className="flex justify-between">
                          <span className="text-slate-300">Additional Designs × {additionalDesigns.length} (total {additionalDesigns.reduce((s, d) => s + d.qty, 0)} cards)</span>
                          <span className="text-white">${additionalDesigns.length * ADDITIONAL_DESIGN_PRICE}</span>
                        </div>}
                      
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
                    {birthDate && deathDate && <p className="text-slate-300">
                        <span className="text-slate-400">Dates:</span> {formatDates(birthDate, deathDate, frontDateFormat)}
                      </p>}
                    <p className="text-slate-300">
                      <span className="text-slate-400">Finish:</span> {currentFinish.name}
                    </p>
                    <p className="text-slate-300">
                      <span className="text-slate-400">Orientation:</span> {orientation}
                    </p>
                    <p className="text-slate-300">
                      <span className="text-slate-400">Total Cards:</span> {totalCards}
                    </p>
                    {cardType === 'metal' && <p className="text-slate-300">
                        <span className="text-slate-400">Card Thickness:</span>{' '}
                        {effectiveThickness === 'premium' ? 'Premium .080"' : 'Standard .040"'}
                      </p>}
                    {memorialPhotos.length > 0 && <p className="text-slate-300">
                        <span className="text-slate-400">Memorial Photos:</span> {memorialPhotos.length} ({memorialPhotos.filter(p => p.size === '18x24').length} at 18×24)
                      </p>}
                    {celebrationPhotos.length > 0 && <p className="text-slate-300">
                        <span className="text-slate-400">Celebration Photos:</span> {celebrationPhotos.length} ({celebrationPhotos.filter(p => p.size === '18x24').length} at 18×24)
                      </p>}
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
                    <Button type="button" variant="outline" onClick={() => setStep(3)} className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700" disabled={isSubmitting}>
                      <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                    <Button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold" disabled={isSubmitting}>
                      {isSubmitting ? <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </> : <>Place Order - ${calculatePrice()}</>}
                    </Button>
                  </div>
                </div>}

              {/* Step 5: Order Confirmation */}
              {step === 5 && <div className="text-center space-y-6 py-8">
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
                </div>}
            </form>
          </CardContent>
        </Card>
      </main>


      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-slate-500">
          <p>© 2025 Luxury Prayer Cards. LuxuryPrayerCards.com</p>
        </div>
      </footer>
    </div>

    {/* Print Preview Modal */}
    <Dialog open={showPrintPreview} onOpenChange={setShowPrintPreview}>
      <DialogContent className="max-w-4xl bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Eye className="h-5 w-5 text-amber-400" />
            Print-Ready Preview
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            This is exactly what your cards will look like when printed. High-resolution files at 300 DPI with bleed margins.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {/* Front Preview */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white text-center">Front Side</h3>
            <div className="bg-slate-900 rounded-lg p-4 flex items-center justify-center">
              {printPreviewImages?.front ? <img src={printPreviewImages.front} alt="Front card preview" className="max-h-[400px] w-auto rounded shadow-lg" /> : <div className="text-slate-500">No preview available</div>}
            </div>
          </div>
          
          {/* Back Preview */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white text-center">Back Side</h3>
            <div className="bg-slate-900 rounded-lg p-4 flex items-center justify-center">
              {printPreviewImages?.back ? <img src={printPreviewImages.back} alt="Back card preview" className="max-h-[400px] w-auto rounded shadow-lg" /> : <div className="text-slate-500">No preview available</div>}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => setShowPrintPreview(false)} className="border-slate-600 text-slate-300">
            Close
          </Button>
          <Button onClick={handleDownloadPrintFiles} className="bg-amber-600 hover:bg-amber-700 text-white">
            <Download className="h-4 w-4 mr-2" />
            Download Print Files
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>;
};
export default Design;