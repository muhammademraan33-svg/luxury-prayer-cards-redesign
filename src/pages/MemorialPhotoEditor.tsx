import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, RotateCcw, Image as ImageIcon, Type, Trash2, ShoppingCart, Plus, Minus } from 'lucide-react';
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
];

type PhotoSize = '16x20' | '18x24';

const MemorialPhotoEditor = () => {
  // Photo state
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoZoom, setPhotoZoom] = useState(1);
  const [photoPanX, setPhotoPanX] = useState(0);
  const [photoPanY, setPhotoPanY] = useState(0);
  
  // Background state
  const [selectedBg, setSelectedBg] = useState(BACKGROUNDS[0]);
  const [customBg, setCustomBg] = useState<string | null>(null);
  
  // Text state
  const [name, setName] = useState('');
  const [dates, setDates] = useState('');
  const [nameFont, setNameFont] = useState('Great Vibes');
  const [datesFont, setDatesFont] = useState('Cormorant Garamond');
  const [nameSize, setNameSize] = useState(32);
  const [datesSize, setDatesSize] = useState(18);
  const [textColor, setTextColor] = useState('#ffffff');
  const [showText, setShowText] = useState(true);
  
  // Order state
  const [photoSize, setPhotoSize] = useState<PhotoSize>('16x20');
  const [quantity, setQuantity] = useState(1);
  
  const photoInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

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
    // Auto-adjust text color based on background
    setTextColor(bg.isDark ? '#ffffff' : '#18181b');
  };

  const getPrice = () => {
    return photoSize === '16x20' ? 17 : 24;
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

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Preview */}
          <div className="space-y-4">
            <Label className="text-white text-lg font-semibold">Preview</Label>
            <div 
              className="relative mx-auto bg-slate-800 rounded-lg overflow-hidden shadow-2xl"
              style={{ 
                aspectRatio,
                maxWidth: photoSize === '16x20' ? '400px' : '375px',
              }}
            >
              {/* Background */}
              <div className="absolute inset-0">
                <img 
                  src={customBg || selectedBg.src} 
                  alt="Background" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Photo */}
              {photo && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="w-3/4 h-3/4 rounded-lg overflow-hidden shadow-xl border-4 border-white/20"
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
              
              {/* Text Overlay */}
              {showText && (name || dates) && (
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                  {name && (
                    <h2 
                      className="text-center mb-1"
                      style={{ 
                        fontFamily: nameFont, 
                        fontSize: `${nameSize}px`,
                        color: textColor,
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                      }}
                    >
                      {name}
                    </h2>
                  )}
                  {dates && (
                    <p 
                      className="text-center"
                      style={{ 
                        fontFamily: datesFont, 
                        fontSize: `${datesSize}px`,
                        color: textColor,
                        opacity: 0.9,
                        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                      }}
                    >
                      {dates}
                    </p>
                  )}
                </div>
              )}
              
              {/* Upload prompt if no photo */}
              {!photo && (
                <div 
                  className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-black/20 transition-colors"
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

          {/* Controls */}
          <div className="space-y-6">
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

            {/* Background Selection */}
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

            {/* Text Controls */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Type className="h-5 w-5 text-amber-400" />
                    <Label className="text-white font-semibold">Text Overlay</Label>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={showText} 
                      onChange={(e) => setShowText(e.target.checked)}
                      className="accent-amber-600"
                    />
                    <span className="text-slate-300 text-sm">{showText ? 'On' : 'Off'}</span>
                  </label>
                </div>
                
                {showText && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-slate-400 text-xs">Name</Label>
                      <Input 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="bg-slate-700 border-slate-600 text-white mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-slate-400 text-xs">Dates</Label>
                      <Input 
                        value={dates}
                        onChange={(e) => setDates(e.target.value)}
                        placeholder="1950 - 2024"
                        className="bg-slate-700 border-slate-600 text-white mt-1"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-400 text-xs">Name Font</Label>
                        <Select value={nameFont} onValueChange={setNameFont}>
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
                      <div>
                        <Label className="text-slate-400 text-xs">Dates Font</Label>
                        <Select value={datesFont} onValueChange={setDatesFont}>
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
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Label className="text-slate-400 text-xs">Name Size</Label>
                        <input
                          type="range"
                          min="18"
                          max="48"
                          value={nameSize}
                          onChange={(e) => setNameSize(parseInt(e.target.value))}
                          className="w-full accent-amber-600 mt-1"
                        />
                      </div>
                      <div className="flex-1">
                        <Label className="text-slate-400 text-xs">Dates Size</Label>
                        <input
                          type="range"
                          min="12"
                          max="28"
                          value={datesSize}
                          onChange={(e) => setDatesSize(parseInt(e.target.value))}
                          className="w-full accent-amber-600 mt-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-slate-400 text-xs">Text Color</Label>
                      <div className="flex gap-2 mt-1">
                        {['#ffffff', '#18181b', '#fbbf24', '#f472b6'].map((color) => (
                          <button
                            key={color}
                            onClick={() => setTextColor(color)}
                            className={`w-8 h-8 rounded-full border-2 transition-all ${
                              textColor === color ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-slate-600'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                        <input 
                          type="color" 
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer"
                        />
                      </div>
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
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-400 text-xs">Size</Label>
                    <Select value={photoSize} onValueChange={(v) => setPhotoSize(v as PhotoSize)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="16x20">16x20 - $17</SelectItem>
                        <SelectItem value="18x24">18x24 - $24</SelectItem>
                      </SelectContent>
                    </Select>
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
        </div>
      </div>
    </div>
  );
};

export default MemorialPhotoEditor;
