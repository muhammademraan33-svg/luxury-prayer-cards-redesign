import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, RotateCcw, Image as ImageIcon, Type, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

// Import backgrounds
import cloudsLightBg from '@/assets/backgrounds/clouds-light.jpg';
import marbleGreyBg from '@/assets/backgrounds/marble-grey.jpg';
import sunsetCloudsBg from '@/assets/backgrounds/sunset-clouds.jpg';
import heavenlyRaysBg from '@/assets/backgrounds/heavenly-rays.jpg';
import oceanSunsetBg from '@/assets/backgrounds/ocean-sunset.jpg';
import doveLightBg from '@/assets/backgrounds/dove-light.jpg';
import mountainSunriseBg from '@/assets/backgrounds/mountain-sunrise.jpg';
import starryNightBg from '@/assets/backgrounds/starry-night.jpg';
import goldMarbleBg from '@/assets/backgrounds/gold-marble.jpg';
import mistyLakeBg from '@/assets/backgrounds/misty-lake.jpg';
import whiteFeathersBg from '@/assets/backgrounds/white-feathers.jpg';
import wheatSunsetBg from '@/assets/backgrounds/wheat-sunset.jpg';

const BACKGROUNDS = [
  { id: 'clouds', name: 'Soft Clouds', src: cloudsLightBg, isDark: false },
  { id: 'marble', name: 'Grey Marble', src: marbleGreyBg, isDark: false },
  { id: 'sunset', name: 'Sunset Clouds', src: sunsetCloudsBg, isDark: true },
  { id: 'rays', name: 'Heavenly Rays', src: heavenlyRaysBg, isDark: false },
  { id: 'ocean', name: 'Ocean Sunset', src: oceanSunsetBg, isDark: true },
  { id: 'dove', name: 'Dove Light', src: doveLightBg, isDark: false },
  { id: 'mountain', name: 'Mountain Sunrise', src: mountainSunriseBg, isDark: true },
  { id: 'starry', name: 'Starry Night', src: starryNightBg, isDark: true },
  { id: 'gold-marble', name: 'Gold Marble', src: goldMarbleBg, isDark: false },
  { id: 'misty-lake', name: 'Misty Lake', src: mistyLakeBg, isDark: false },
  { id: 'feathers', name: 'White Feathers', src: whiteFeathersBg, isDark: false },
  { id: 'wheat', name: 'Wheat Sunset', src: wheatSunsetBg, isDark: true },
];

const FONT_OPTIONS = [
  { value: 'Playfair Display', name: 'Playfair Display' },
  { value: 'Cormorant Garamond', name: 'Cormorant Garamond' },
  { value: 'Great Vibes', name: 'Great Vibes' },
  { value: 'Dancing Script', name: 'Dancing Script' },
  { value: 'Montserrat', name: 'Montserrat' },
];

const COLOR_PRESETS = [
  '#ffffff', '#f5f5f5', '#18181b', '#d4af37', '#f472b6',
];

export type EaselPhotoSize = '16x20' | '18x24';

export interface TextBox {
  id: string;
  content: string;
  x: number;
  y: number;
  fontFamily: string;
  fontSize: number;
  color: string;
}

export interface MemorialPhotoData {
  photo: string | null;
  photoZoom: number;
  photoPanX: number;
  photoPanY: number;
  brightness: number;
  backgroundId: string;
  customBackground: string | null;
  textBoxes: TextBox[];
  size: EaselPhotoSize;
}

interface MemorialPhotoDesignerProps {
  data: MemorialPhotoData;
  onChange: (data: MemorialPhotoData) => void;
  onRemove?: () => void;
  photoIndex: number;
  deceasedName?: string;
  birthDate?: string;
  deathDate?: string;
}

const createDefaultTextBoxes = (name?: string, birthDate?: string, deathDate?: string): TextBox[] => {
  let datesContent = '1950 - 2024';
  if (birthDate && deathDate) {
    const birthYear = birthDate.split('-')[0];
    const deathYear = deathDate.split('-')[0];
    datesContent = `${birthYear} - ${deathYear}`;
  } else if (birthDate) {
    datesContent = birthDate.split('-')[0];
  } else if (deathDate) {
    datesContent = deathDate.split('-')[0];
  }

  return [
    {
      id: 'name',
      content: name || 'Name',
      x: 50,
      y: 80,
      fontFamily: 'Great Vibes',
      fontSize: 28,
      color: '#ffffff',
    },
    {
      id: 'dates',
      content: datesContent,
      x: 50,
      y: 90,
      fontFamily: 'Cormorant Garamond',
      fontSize: 16,
      color: '#ffffff',
    },
  ];
};

export const createEmptyMemorialPhoto = (name?: string, birthDate?: string, deathDate?: string): MemorialPhotoData => ({
  photo: null,
  photoZoom: 1,
  photoPanX: 0,
  photoPanY: 0,
  brightness: 100,
  backgroundId: 'clouds',
  customBackground: null,
  textBoxes: createDefaultTextBoxes(name, birthDate, deathDate),
  size: '16x20',
});

export const MemorialPhotoDesigner = ({
  data,
  onChange,
  onRemove,
  photoIndex,
  deceasedName,
  birthDate,
  deathDate,
}: MemorialPhotoDesignerProps) => {
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const photoInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const selectedBg = BACKGROUNDS.find(bg => bg.id === data.backgroundId) || BACKGROUNDS[0];
  const selectedText = data.textBoxes.find(t => t.id === selectedTextId);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange({
          ...data,
          photo: event.target?.result as string,
          photoZoom: 1,
          photoPanX: 0,
          photoPanY: 0,
        });
      };
      reader.readAsDataURL(file);
      toast.success('Photo uploaded!');
    }
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange({
          ...data,
          customBackground: event.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
      toast.success('Custom background added!');
    }
  };

  const handleTextPointerDown = (e: React.PointerEvent, textBox: TextBox) => {
    e.stopPropagation();
    setSelectedTextId(textBox.id);
    setIsDragging(true);
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const percentX = ((e.clientX - rect.left) / rect.width) * 100;
      const percentY = ((e.clientY - rect.top) / rect.height) * 100;
      setDragOffset({ x: percentX - textBox.x, y: percentY - textBox.y });
    }
  };

  const handleCanvasPointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !selectedTextId) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const percentX = ((e.clientX - rect.left) / rect.width) * 100;
      const percentY = ((e.clientY - rect.top) / rect.height) * 100;
      
      const newX = Math.max(10, Math.min(90, percentX - dragOffset.x));
      const newY = Math.max(5, Math.min(95, percentY - dragOffset.y));
      
      onChange({
        ...data,
        textBoxes: data.textBoxes.map(t => 
          t.id === selectedTextId ? { ...t, x: newX, y: newY } : t
        ),
      });
    }
  };

  const handleCanvasPointerUp = () => {
    setIsDragging(false);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setSelectedTextId(null);
    }
  };

  const updateTextBox = (id: string, updates: Partial<TextBox>) => {
    onChange({
      ...data,
      textBoxes: data.textBoxes.map(t => t.id === id ? { ...t, ...updates } : t),
    });
  };

  const addTextBox = () => {
    const newId = `text-${Date.now()}`;
    onChange({
      ...data,
      textBoxes: [...data.textBoxes, {
        id: newId,
        content: 'New Text',
        x: 50,
        y: 50,
        fontFamily: 'Playfair Display',
        fontSize: 20,
        color: '#ffffff',
      }],
    });
    setSelectedTextId(newId);
  };

  const deleteTextBox = (id: string) => {
    onChange({
      ...data,
      textBoxes: data.textBoxes.filter(t => t.id !== id),
    });
    setSelectedTextId(null);
  };

  const aspectRatio = data.size === '16x20' ? '4/5' : '3/4';

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Left: Canvas Designer */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-white font-medium text-sm">
            Photo #{photoIndex + 1}
          </Label>
          {onRemove && photoIndex > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 text-xs h-7"
            >
              <Trash2 className="h-3 w-3 mr-1" /> Remove
            </Button>
          )}
        </div>

        {/* Hidden file inputs */}
        <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
        <input ref={bgInputRef} type="file" accept="image/*" className="hidden" onChange={handleBgUpload} />

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="relative w-full bg-slate-900 rounded-lg overflow-hidden shadow-xl cursor-crosshair"
          style={{ aspectRatio }}
          onPointerMove={handleCanvasPointerMove}
          onPointerUp={handleCanvasPointerUp}
          onPointerLeave={handleCanvasPointerUp}
          onClick={handleCanvasClick}
        >
          {/* Background */}
          <div className="absolute inset-0">
            <img
              src={data.customBackground || selectedBg.src}
              alt="Background"
              className="w-full h-full object-cover pointer-events-none"
            />
          </div>

          {/* Photo */}
          {data.photo && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="w-3/4 h-3/4 overflow-hidden shadow-xl border-4 border-white/20"
                style={{
                  transform: `scale(${data.photoZoom}) translate(${data.photoPanX}px, ${data.photoPanY}px)`,
                  filter: `brightness(${data.brightness}%)`,
                }}
              >
                <img src={data.photo} alt="Memorial" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          {/* Text Boxes */}
          {data.textBoxes.map((textBox) => (
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

          {/* Upload prompt */}
          {!data.photo && (
            <div
              className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-black/20 transition-colors z-10"
              onClick={() => photoInputRef.current?.click()}
            >
              <div className="text-center text-white/70">
                <Upload className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Click to upload photo</p>
              </div>
            </div>
          )}
        </div>

        {/* Size indicator */}
        <p className="text-center text-slate-400 text-xs">
          {data.size} Memorial Photo
        </p>
      </div>

      {/* Right: Controls */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
        {/* Size Toggle */}
        <Card className="bg-slate-700/50 border-slate-600">
          <CardContent className="p-3 space-y-2">
            <Label className="text-slate-300 text-xs">Size</Label>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => onChange({ ...data, size: '16x20' })}
                className={`flex-1 px-2 py-2 text-xs rounded transition-all ${
                  data.size === '16x20'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                }`}
              >
                16×20
              </button>
              <button
                type="button"
                onClick={() => onChange({ ...data, size: '18x24' })}
                className={`flex-1 px-2 py-2 text-xs rounded transition-all ${
                  data.size === '18x24'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                }`}
              >
                18×24 <span className="text-amber-300">+$7</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Photo Controls */}
        <Card className="bg-slate-700/50 border-slate-600">
          <CardContent className="p-3 space-y-2">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-amber-400" />
              <Label className="text-slate-300 text-xs">Photo</Label>
            </div>

            <Button
              type="button"
              size="sm"
              onClick={() => photoInputRef.current?.click()}
              className="w-full bg-amber-600 hover:bg-amber-700 text-xs h-8"
            >
              <Upload className="h-3 w-3 mr-1" />
              {data.photo ? 'Change Photo' : 'Upload Photo'}
            </Button>

            {data.photo && (
              <div className="space-y-2 pt-2 border-t border-slate-600">
                <div>
                  <Label className="text-slate-400 text-xs">Zoom</Label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.05"
                    value={data.photoZoom}
                    onChange={(e) => onChange({ ...data, photoZoom: parseFloat(e.target.value) })}
                    className="w-full accent-amber-600 h-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-slate-400 text-xs">Left/Right</Label>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={data.photoPanX}
                      onChange={(e) => onChange({ ...data, photoPanX: parseFloat(e.target.value) })}
                      className="w-full accent-amber-600 h-2"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-400 text-xs">Up/Down</Label>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={data.photoPanY}
                      onChange={(e) => onChange({ ...data, photoPanY: parseFloat(e.target.value) })}
                      className="w-full accent-amber-600 h-2"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-slate-400 text-xs">Brightness</Label>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    step="5"
                    value={data.brightness}
                    onChange={(e) => onChange({ ...data, brightness: parseFloat(e.target.value) })}
                    className="w-full accent-amber-600 h-2"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onChange({ ...data, photoZoom: 1, photoPanX: 0, photoPanY: 0, brightness: 100 })}
                  className="w-full border-slate-600 text-slate-300 text-xs h-7"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reset
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Background */}
        <Card className="bg-slate-700/50 border-slate-600">
          <CardContent className="p-3 space-y-2">
            <Label className="text-slate-300 text-xs">Background</Label>
            <div className="grid grid-cols-4 gap-1">
              {BACKGROUNDS.slice(0, 8).map((bg) => (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => onChange({ ...data, backgroundId: bg.id, customBackground: null })}
                  className={`aspect-square rounded overflow-hidden border-2 transition-all ${
                    data.backgroundId === bg.id && !data.customBackground
                      ? 'border-amber-500'
                      : 'border-transparent hover:border-slate-400'
                  }`}
                >
                  <img src={bg.src} alt={bg.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => bgInputRef.current?.click()}
              className="w-full border-slate-600 text-slate-300 text-xs h-7"
            >
              <Upload className="h-3 w-3 mr-1" />
              Custom Background
            </Button>
          </CardContent>
        </Card>

        {/* Text Controls */}
        <Card className="bg-slate-700/50 border-slate-600">
          <CardContent className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4 text-amber-400" />
                <Label className="text-slate-300 text-xs">Text</Label>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addTextBox}
                className="text-amber-400 hover:text-amber-300 h-6 text-xs px-2"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>

            {selectedText ? (
              <div className="space-y-2 p-2 bg-slate-800/50 rounded">
                <input
                  type="text"
                  value={selectedText.content}
                  onChange={(e) => updateTextBox(selectedText.id, { content: e.target.value })}
                  className="w-full bg-slate-600 border-slate-500 text-white text-xs px-2 py-1 rounded"
                />
                <Select
                  value={selectedText.fontFamily}
                  onValueChange={(v) => updateTextBox(selectedText.id, { fontFamily: v })}
                >
                  <SelectTrigger className="h-7 text-xs bg-slate-600 border-slate-500 text-white">
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
                <div>
                  <Label className="text-slate-400 text-xs">Size: {selectedText.fontSize}px</Label>
                  <input
                    type="range"
                    min="12"
                    max="48"
                    value={selectedText.fontSize}
                    onChange={(e) => updateTextBox(selectedText.id, { fontSize: parseInt(e.target.value) })}
                    className="w-full accent-amber-600 h-2"
                  />
                </div>
                <div className="flex gap-1">
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => updateTextBox(selectedText.id, { color })}
                      className={`w-6 h-6 rounded-full border-2 ${
                        selectedText.color === color ? 'border-amber-400' : 'border-slate-500'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                {!['name', 'dates'].includes(selectedText.id) && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTextBox(selectedText.id)}
                    className="w-full text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 text-xs h-7"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete Text
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-slate-500 text-xs text-center py-2">Click text on canvas to edit</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemorialPhotoDesigner;
