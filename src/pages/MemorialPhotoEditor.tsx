import { useState, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Upload, RotateCcw, Image as ImageIcon, Type, Trash2, ShoppingCart, Plus, Minus, Copy, Building } from 'lucide-react';
import { toast } from 'sonner';

// Import all backgrounds
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

const BACKGROUNDS = [
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

const FONT_OPTIONS = [
  { value: 'Playfair Display', name: 'Playfair Display' },
  { value: 'Cormorant Garamond', name: 'Cormorant Garamond' },
  { value: 'Great Vibes', name: 'Great Vibes' },
  { value: 'Dancing Script', name: 'Dancing Script' },
  { value: 'Cinzel', name: 'Cinzel' },
  { value: 'Lora', name: 'Lora' },
  { value: 'Raleway', name: 'Raleway' },
  { value: 'Montserrat', name: 'Montserrat' },
];

const COLOR_PRESETS = [
  '#ffffff', '#f5f5f5', '#e0e0e0', // Whites
  '#18181b', '#3f3f46', '#71717a', // Blacks/Grays  
  '#d4af37', '#c9a227', '#b8860b', // Golds
  '#f472b6', '#ec4899', '#db2777', // Pinks
];

type PhotoSize = '16x20' | '18x24';

interface TextBox {
  id: string;
  content: string;
  x: number; // percentage from left
  y: number; // percentage from top
  fontFamily: string;
  fontSize: number;
  color: string;
}

// Helper to format dates for display - MMMM DD, YYYY format
const formatDateForDisplay = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateStr;
  }
};

const createDefaultTextBoxes = (name?: string, birthDate?: string, deathDate?: string): TextBox[] => {
  // Format full dates if available
  let datesContent = 'January 1, 1950 - December 31, 2024';
  if (birthDate && deathDate) {
    const formattedBirth = formatDateForDisplay(birthDate);
    const formattedDeath = formatDateForDisplay(deathDate);
    datesContent = `${formattedBirth} - ${formattedDeath}`;
  } else if (birthDate) {
    datesContent = formatDateForDisplay(birthDate);
  } else if (deathDate) {
    datesContent = formatDateForDisplay(deathDate);
  }

  return [
    {
      id: 'name',
      content: name || 'John Doe',
      x: 50,
      y: 80,
      fontFamily: 'Great Vibes',
      fontSize: 36,
      color: '#ffffff',
    },
    {
      id: 'dates',
      content: datesContent,
      x: 50,
      y: 88,
      fontFamily: 'Cormorant Garamond',
      fontSize: 16,
      color: '#ffffff',
    },
  ];
};

const MemorialPhotoEditor = () => {
  const [searchParams] = useSearchParams();
  
  // Photo state
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoZoom, setPhotoZoom] = useState(1);
  const [photoPanX, setPhotoPanX] = useState(0);
  const [photoPanY, setPhotoPanY] = useState(0);
  
  // Background state
  const [selectedBg, setSelectedBg] = useState(BACKGROUNDS[0]);
  const [customBg, setCustomBg] = useState<string | null>(null);
  
  // Text boxes state
  const [textBoxes, setTextBoxes] = useState<TextBox[]>(createDefaultTextBoxes());
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Funeral home logo state
  const [funeralHomeLogo, setFuneralHomeLogo] = useState<string | null>(null);
  const [showFuneralLogo, setShowFuneralLogo] = useState(false);
  
  // Order state
  const [photoSize, setPhotoSize] = useState<PhotoSize>('16x20');
  const [quantity, setQuantity] = useState(1);
  
  const photoInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Load data from card design if available
  useEffect(() => {
    const storedData = sessionStorage.getItem('memorialPhotoData');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        
        // Pre-fill name and dates
        if (data.deceasedName || data.birthDate || data.deathDate) {
          setTextBoxes(createDefaultTextBoxes(data.deceasedName, data.birthDate, data.deathDate));
        }
        
        // Pre-fill photo from card design
        if (data.deceasedPhoto) {
          setPhoto(data.deceasedPhoto);
        }
        
        // Store funeral home logo if provided
        if (data.funeralHomeLogo) {
          setFuneralHomeLogo(data.funeralHomeLogo);
        }
      } catch (e) {
        console.error('Failed to parse memorial photo data:', e);
      }
    }
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhoto(url);
      setPhotoZoom(1);
      setPhotoPanX(0);
      setPhotoPanY(0);
      toast.success('Photo uploaded!');
    }
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomBg(url);
      toast.success('Background uploaded!');
    }
  };

  const selectBackground = (bg: typeof BACKGROUNDS[0]) => {
    setSelectedBg(bg);
    setCustomBg(null);
  };

  // Text box handlers
  const addTextBox = () => {
    const newTextBox: TextBox = {
      id: `text-${Date.now()}`,
      content: 'New Text',
      x: 50,
      y: 50,
      fontFamily: 'Playfair Display',
      fontSize: 20,
      color: '#ffffff',
    };
    setTextBoxes([...textBoxes, newTextBox]);
    setSelectedTextId(newTextBox.id);
    toast.success('Text box added!');
  };

  const updateTextBox = (id: string, updates: Partial<TextBox>) => {
    setTextBoxes(textBoxes.map(tb => 
      tb.id === id ? { ...tb, ...updates } : tb
    ));
  };

  const deleteTextBox = (id: string) => {
    setTextBoxes(textBoxes.filter(tb => tb.id !== id));
    if (selectedTextId === id) {
      setSelectedTextId(null);
    }
    toast.success('Text deleted');
  };

  const duplicateTextBox = (id: string) => {
    const original = textBoxes.find(tb => tb.id === id);
    if (original) {
      const newTextBox: TextBox = {
        ...original,
        id: `text-${Date.now()}`,
        x: Math.min(original.x + 5, 95),
        y: Math.min(original.y + 5, 95),
      };
      setTextBoxes([...textBoxes, newTextBox]);
      setSelectedTextId(newTextBox.id);
      toast.success('Text duplicated');
    }
  };

  // Drag handlers
  const handleTextPointerDown = (e: React.PointerEvent, textBox: TextBox) => {
    e.stopPropagation();
    setSelectedTextId(textBox.id);
    setIsDragging(true);
    
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const percentX = ((e.clientX - rect.left) / rect.width) * 100;
      const percentY = ((e.clientY - rect.top) / rect.height) * 100;
      setDragOffset({
        x: textBox.x - percentX,
        y: textBox.y - percentY,
      });
    }
  };

  const handleCanvasPointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !selectedTextId || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const percentX = ((e.clientX - rect.left) / rect.width) * 100;
    const percentY = ((e.clientY - rect.top) / rect.height) * 100;
    
    const newX = Math.max(5, Math.min(95, percentX + dragOffset.x));
    const newY = Math.max(5, Math.min(95, percentY + dragOffset.y));
    
    updateTextBox(selectedTextId, { x: newX, y: newY });
  };

  const handleCanvasPointerUp = () => {
    setIsDragging(false);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('canvas-background')) {
      setSelectedTextId(null);
    }
  };

  const selectedTextBox = textBoxes.find(tb => tb.id === selectedTextId);

  const basePrice = 17;
  const upsellPrice = 7;
  
  const getPrice = () => {
    return photoSize === '16x20' ? basePrice : basePrice + upsellPrice;
  };

  const aspectRatio = photoSize === '16x20' ? '4/5' : '3/4';

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <span className="text-xl font-bold text-white">Memorial Photo Editor</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="md:flex md:gap-6">
          {/* Left Column - Preview Canvas */}
          <div className="space-y-4 md:flex-1 md:min-w-0">
            <div className="flex items-center justify-between">
              <Label className="text-white text-lg font-semibold">Preview</Label>
              <Button 
                onClick={addTextBox}
                size="sm"
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Text
              </Button>
            </div>
            <div 
              ref={canvasRef}
              className="relative mx-auto bg-slate-800 rounded-lg overflow-hidden shadow-2xl select-none"
              style={{ 
                aspectRatio,
                maxWidth: '100%',
                width: '100%',
              }}
              onPointerMove={handleCanvasPointerMove}
              onPointerUp={handleCanvasPointerUp}
              onPointerLeave={handleCanvasPointerUp}
              onClick={handleCanvasClick}
            >
              {/* Background */}
              <div className="absolute inset-0 canvas-background">
                <img 
                  src={customBg || selectedBg.src} 
                  alt="Background" 
                  className="w-full h-full object-cover pointer-events-none"
                />
              </div>
              
              {/* Photo */}
              {photo && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div 
                    className="w-3/4 h-3/4 overflow-hidden shadow-xl border-4 border-white/20"
                    style={{
                      transform: `scale(${photoZoom}) translate(${photoPanX}px, ${photoPanY}px)`,
                    }}
                  >
                    <img 
                      src={photo} 
                      alt="Memorial" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              
              {/* Draggable Text Boxes */}
              {textBoxes.map((textBox) => (
                <div
                  key={textBox.id}
                  className={`absolute cursor-move transition-all ${
                    selectedTextId === textBox.id 
                      ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-transparent' 
                      : 'hover:ring-1 hover:ring-white/50'
                  }`}
                  style={{
                    left: `${textBox.x}%`,
                    top: `${textBox.y}%`,
                    transform: 'translate(-50%, -50%)',
                    fontFamily: textBox.fontFamily,
                    fontSize: `${textBox.fontSize}px`,
                    color: textBox.color,
                    textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.9)',
                    whiteSpace: 'nowrap',
                    padding: '4px 8px',
                  }}
                  onPointerDown={(e) => handleTextPointerDown(e, textBox)}
                >
                  {textBox.content}
                </div>
              ))}
              
              {/* Funeral Home Logo */}
              {showFuneralLogo && funeralHomeLogo && (
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 pointer-events-none">
                  <img 
                    src={funeralHomeLogo} 
                    alt="Funeral Home Logo" 
                    className="h-10 w-auto max-w-[40%] object-contain opacity-90"
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
                  />
                </div>
              )}
              {/* Upload prompt if no photo */}
              {!photo && (
                <div 
                  className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-black/20 transition-colors z-10"
                  onClick={() => photoInputRef.current?.click()}
                >
                  <div className="text-center text-white/70">
                    <Upload className="h-12 w-12 mx-auto mb-2" />
                    <p>Click to upload photo</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Size indicator */}
            <p className="text-center text-slate-400 text-sm">
              {photoSize} Memorial Photo • ${getPrice()} each
            </p>
          </div>

          {/* Right Column - Controls */}
          <div className="mt-6 md:mt-0 md:w-[380px] md:flex-shrink-0">
            <ScrollArea className="h-auto md:h-[calc(100vh-140px)]">
              <div className="space-y-4 pr-4">
            {/* Photo Upload */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <ImageIcon className="h-5 w-5 text-amber-400" />
                  <Label className="text-white font-semibold">Photo</Label>
                </div>
                
                <input 
                  ref={photoInputRef}
                  type="file" 
                  accept="image/*" 
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    onClick={() => photoInputRef.current?.click()}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {photo ? 'Change Photo' : 'Upload Photo'}
                  </Button>
                  {photo && (
                    <Button 
                      variant="outline" 
                      onClick={() => setPhoto(null)}
                      className="border-rose-600/50 text-rose-400 hover:bg-rose-600/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                {photo && (
                  <div className="space-y-3 pt-4 border-t border-slate-600">
                    <div className="flex items-center gap-3">
                      <Label className="text-slate-400 text-xs w-16">Zoom</Label>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.05"
                        value={photoZoom}
                        onChange={(e) => setPhotoZoom(parseFloat(e.target.value))}
                        className="flex-1 accent-amber-600"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Label className="text-slate-400 text-xs w-16">Left/Right</Label>
                      <input
                        type="range"
                        min="-50"
                        max="50"
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
                        min="-50"
                        max="50"
                        step="1"
                        value={photoPanY}
                        onChange={(e) => setPhotoPanY(parseFloat(e.target.value))}
                        className="flex-1 accent-amber-600"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPhotoZoom(1);
                        setPhotoPanX(0);
                        setPhotoPanY(0);
                      }}
                      className="border-slate-600 text-slate-300 text-xs w-full"
                    >
                      <RotateCcw className="h-3 w-3 mr-2" />
                      Reset Position
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Funeral Home Logo Toggle */}
            {funeralHomeLogo && (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-5 w-5 text-amber-400" />
                    <Label className="text-white font-semibold">Funeral Home Logo</Label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={funeralHomeLogo} 
                        alt="Funeral Home Logo" 
                        className="h-10 w-auto max-w-[100px] object-contain rounded"
                      />
                      <span className="text-slate-300 text-sm">Show on photo</span>
                    </div>
                    <Switch 
                      checked={showFuneralLogo} 
                      onCheckedChange={setShowFuneralLogo}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Upload logo if not from card design */}
            {!funeralHomeLogo && (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-5 w-5 text-amber-400" />
                    <Label className="text-white font-semibold">Funeral Home Logo</Label>
                  </div>
                  
                  <input 
                    ref={logoInputRef}
                    type="file" 
                    accept="image/*" 
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setFuneralHomeLogo(url);
                        setShowFuneralLogo(true);
                        toast.success('Logo added!');
                      }
                    }}
                  />
                  
                  <Button 
                    variant="outline"
                    onClick={() => logoInputRef.current?.click()}
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Add Funeral Home Logo
                  </Button>
                  <p className="text-slate-500 text-xs">Optional - adds your funeral home's logo to the photo</p>
                </CardContent>
              </Card>
            )}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <ImageIcon className="h-5 w-5 text-amber-400" />
                  <Label className="text-white font-semibold">Background</Label>
                </div>
                
                <div className="grid grid-cols-5 gap-2">
                  {BACKGROUNDS.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => selectBackground(bg)}
                      className={`aspect-[4/5] rounded-lg overflow-hidden border-2 transition-all ${
                        !customBg && selectedBg.id === bg.id 
                          ? 'border-amber-500 ring-2 ring-amber-500/30' 
                          : 'border-slate-600 hover:border-slate-500'
                      }`}
                      title={bg.name}
                    >
                      <img src={bg.src} alt={bg.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                
                <input 
                  ref={bgInputRef}
                  type="file" 
                  accept="image/*" 
                  className="hidden"
                  onChange={handleBgUpload}
                />
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => bgInputRef.current?.click()}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Custom Background
                  </Button>
                  {customBg && (
                    <Button 
                      variant="outline" 
                      onClick={() => setCustomBg(null)}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Use Preset
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Text Properties Panel */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Type className="h-5 w-5 text-amber-400" />
                    <Label className="text-white font-semibold">Text Properties</Label>
                  </div>
                  <Button 
                    onClick={addTextBox}
                    size="sm"
                    variant="outline"
                    className="border-amber-600/50 text-amber-400 hover:bg-amber-600/20"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Text
                  </Button>
                </div>
                
                {selectedTextBox ? (
                  <div className="space-y-4">
                    {/* Content */}
                    <div>
                      <Label className="text-slate-400 text-xs">Text Content</Label>
                      <Input 
                        value={selectedTextBox.content}
                        onChange={(e) => updateTextBox(selectedTextBox.id, { content: e.target.value })}
                        placeholder="Enter text..."
                        className="bg-slate-700 border-slate-600 text-white mt-1"
                      />
                    </div>
                    
                    {/* Font */}
                    <div>
                      <Label className="text-slate-400 text-xs">Font</Label>
                      <Select 
                        value={selectedTextBox.fontFamily} 
                        onValueChange={(value) => updateTextBox(selectedTextBox.id, { fontFamily: value })}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          {FONT_OPTIONS.map((font) => (
                            <SelectItem 
                              key={font.value} 
                              value={font.value}
                              style={{ fontFamily: font.value }}
                            >
                              {font.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Font Size */}
                    <div>
                      <Label className="text-slate-400 text-xs">Size: {selectedTextBox.fontSize}px</Label>
                      <input
                        type="range"
                        min="12"
                        max="72"
                        value={selectedTextBox.fontSize}
                        onChange={(e) => updateTextBox(selectedTextBox.id, { fontSize: parseInt(e.target.value) })}
                        className="w-full accent-amber-600 mt-1"
                      />
                    </div>
                    
                    {/* Color */}
                    <div>
                      <Label className="text-slate-400 text-xs">Color</Label>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {COLOR_PRESETS.map((color) => (
                          <button
                            key={color}
                            onClick={() => updateTextBox(selectedTextBox.id, { color })}
                            className={`w-8 h-8 rounded-full border-2 transition-all ${
                              selectedTextBox.color === color 
                                ? 'border-amber-500 ring-2 ring-amber-500/30' 
                                : 'border-slate-600'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                        <input 
                          type="color" 
                          value={selectedTextBox.color}
                          onChange={(e) => updateTextBox(selectedTextBox.id, { color: e.target.value })}
                          className="w-8 h-8 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => duplicateTextBox(selectedTextBox.id)}
                        className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Duplicate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteTextBox(selectedTextBox.id)}
                        className="flex-1 border-rose-600/50 text-rose-400 hover:bg-rose-600/20"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-400">
                    <Type className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Select a text box to edit</p>
                    <p className="text-xs mt-1">Click on text in the preview, or add new text</p>
                  </div>
                )}
                
                {/* Text box list */}
                {textBoxes.length > 0 && (
                  <div className="pt-4 border-t border-slate-600">
                    <Label className="text-slate-400 text-xs mb-2 block">All Text Boxes</Label>
                    <div className="space-y-1">
                      {textBoxes.map((tb) => (
                        <button
                          key={tb.id}
                          onClick={() => setSelectedTextId(tb.id)}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition-all ${
                            selectedTextId === tb.id
                              ? 'bg-amber-600/20 text-amber-400'
                              : 'text-slate-300 hover:bg-slate-700'
                          }`}
                          style={{ fontFamily: tb.fontFamily }}
                        >
                          {tb.content || 'Empty text'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Options */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingCart className="h-5 w-5 text-amber-400" />
                  <Label className="text-white font-semibold">Order</Label>
                </div>
                
                {/* Size Selection with Upsell */}
                <div className="space-y-3">
                  <Label className="text-slate-400 text-xs">Size</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPhotoSize('16x20')}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        photoSize === '16x20'
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      <div className="text-white font-semibold">16x20</div>
                      <div className="text-amber-400 text-lg font-bold">${basePrice}</div>
                    </button>
                    <button
                      onClick={() => setPhotoSize('18x24')}
                      className={`p-4 rounded-lg border-2 transition-all text-left relative overflow-hidden ${
                        photoSize === '18x24'
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      <div className="absolute top-0 right-0 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl">
                        UPGRADE
                      </div>
                      <div className="text-white font-semibold">18x24</div>
                      <div className="text-amber-400 text-lg font-bold">${basePrice + upsellPrice} <span className="text-green-400 text-sm font-normal">(+${upsellPrice})</span></div>
                    </button>
                  </div>
                </div>
                
                <div>
                  <Label className="text-slate-400 text-xs">Quantity</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="border-slate-600 text-slate-300 h-10 w-10"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-white font-semibold w-8 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      className="border-slate-600 text-slate-300 h-10 w-10"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-600">
                  <span className="text-slate-300">Total</span>
                  <span className="text-2xl font-bold text-amber-400">${getPrice() * quantity}</span>
                </div>
                
                <Button 
                  className="w-full bg-amber-600 hover:bg-amber-700 text-lg py-6"
                  disabled={!photo}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                
                {!photo && (
                  <p className="text-center text-slate-400 text-sm">Upload a photo to continue</p>
                )}
              </CardContent>
            </Card>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  </div>
  );
};

export default MemorialPhotoEditor;
