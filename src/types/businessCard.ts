import { CardElement } from './cardElements';

// Background textures for premium metal cards - designed for metal printing
export type BackgroundTexture = 
  | 'marble-white' 
  | 'marble-grey'
  | 'marble-white-grey'
  | 'marble-black'
  | 'brushed-gold' 
  | 'brushed-silver' 
  | 'brushed-black' 
  | 'brushed-rose-gold'
  | 'pearl-white'
  | 'solid-black'
  | 'solid-white'
  | 'custom-photo';

export interface BackgroundStyle {
  texture: BackgroundTexture;
  customImage?: string;
}

// Luxury metal finishes optimized for metal printing with realistic reflections
export const backgroundTextures: { value: BackgroundTexture; name: string; preview: string }[] = [
  // Premium metals with champagne/warm tones
  { value: 'brushed-gold', name: 'Champagne Gold', preview: 'linear-gradient(135deg, #c5a870 0%, #e8d5b0 15%, #b8965a 35%, #e2cb9a 55%, #a8854d 75%, #d4be8a 90%, #c5a870 100%)' },
  { value: 'brushed-silver', name: 'Platinum Silver', preview: 'linear-gradient(135deg, #b8c0c8 0%, #e8ecef 15%, #9ca5af 35%, #dce1e6 55%, #8d969f 75%, #cdd3d9 90%, #b8c0c8 100%)' },
  { value: 'brushed-rose-gold', name: 'Rose Gold', preview: 'linear-gradient(135deg, #c4a484 0%, #e8d0c0 15%, #b08d6a 35%, #dfc5b5 55%, #9c7856 75%, #d4b8a4 90%, #c4a484 100%)' },
  { value: 'brushed-black', name: 'Gunmetal Black', preview: 'linear-gradient(135deg, #2c2c2c 0%, #4a4a4a 15%, #1a1a1a 35%, #3d3d3d 55%, #0f0f0f 75%, #333333 90%, #2c2c2c 100%)' },
  // Marble finishes with veining effect
  { value: 'marble-white', name: 'Carrara White', preview: 'linear-gradient(125deg, #fafafa 0%, #f0f0f0 20%, #e8e8e8 35%, #f5f5f5 50%, #e0e0e0 65%, #f8f8f8 80%, #ececec 100%)' },
  { value: 'marble-white-grey', name: 'White Grey Marble', preview: 'linear-gradient(125deg, #f5f5f5 0%, #e0e0e0 15%, #d8d8d8 30%, #ebebeb 45%, #c8c8c8 60%, #e5e5e5 75%, #d0d0d0 90%, #f0f0f0 100%)' },
  { value: 'marble-grey', name: 'Grey Marble', preview: 'linear-gradient(125deg, #a8a8a8 0%, #c5c5c5 20%, #8f8f8f 35%, #b8b8b8 50%, #9a9a9a 65%, #d0d0d0 80%, #a0a0a0 100%)' },
  { value: 'marble-black', name: 'Nero Marble', preview: 'linear-gradient(125deg, #1a1a1a 0%, #2e2e2e 20%, #0f0f0f 35%, #252525 50%, #1c1c1c 65%, #383838 80%, #141414 100%)' },
  // Solid finishes with subtle metallic sheen
  { value: 'pearl-white', name: 'Pearl White', preview: 'linear-gradient(135deg, #f8f8f8 0%, #ffffff 25%, #f0f0f0 50%, #fafafa 75%, #f5f5f5 100%)' },
  { value: 'solid-black', name: 'Matte Black', preview: 'linear-gradient(135deg, #0a0a0a 0%, #151515 50%, #0a0a0a 100%)' },
  { value: 'solid-white', name: 'Matte White', preview: 'linear-gradient(135deg, #fefefe 0%, #f5f5f5 50%, #fefefe 100%)' },
];

export interface TextElementStyle {
  fontFamily: string;
  fontSize: number;
  color: string;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
}

export interface CardSideData {
  background: BackgroundStyle;
  frameStyle: FrameStyleType;
  frameColor: string;
  texts: TextElement[];
  elements: CardElement[];
  logo: string | null;
  logoScale: number;
  logoX: number;
  logoY: number;
  logoOpacity: number;
}

export interface TextElement {
  id: string;
  content: string;
  style: TextElementStyle;
}

export interface BusinessCardData {
  front: CardSideData;
  back: CardSideData;
  category: CardCategory;
  orientation: 'landscape' | 'portrait';
  activeSide: 'front' | 'back';
}

export type CardCategory = 'wedding' | 'baby' | 'prayer' | 'memorial' | 'graduation' | 'anniversary';

export type FrameStyleType = 'none' | 'solid' | 'double' | 'gradient' | 'ornate' | 'dashed' | 'dotted' | 'inset' | 'shadow' | 'corner';

export const frameStyles: { name: string; value: FrameStyleType }[] = [
  { name: 'None', value: 'none' },
  { name: 'Simple', value: 'solid' },
  { name: 'Double', value: 'double' },
  { name: 'Gradient', value: 'gradient' },
  { name: 'Ornate', value: 'ornate' },
  { name: 'Dashed', value: 'dashed' },
  { name: 'Dotted', value: 'dotted' },
  { name: 'Inset', value: 'inset' },
  { name: 'Shadow', value: 'shadow' },
  { name: 'Corner', value: 'corner' },
];

export const categoryInfo: Record<CardCategory, { 
  name: string; 
  icon: string; 
  description: string;
  suggestedFonts: string[];
  suggestedFrameColors: string[];
  defaultTextColor: string;
}> = {
  wedding: { 
    name: 'Wedding', 
    icon: '💍', 
    description: 'Invitations & Save the Dates',
    suggestedFonts: ['Great Vibes', 'Allura', 'Playfair Display', 'Cormorant Garamond'],
    suggestedFrameColors: ['#d4af37', '#c9a227', '#b8860b', '#c0c0c0'],
    defaultTextColor: '#2c2c2c',
  },
  baby: { 
    name: 'Baby', 
    icon: '👶', 
    description: 'Birth Announcements',
    suggestedFonts: ['Dancing Script', 'Sacramento', 'Poppins', 'Montserrat'],
    suggestedFrameColors: ['#e8b4b8', '#87ceeb', '#c9a227', '#dda0dd'],
    defaultTextColor: '#5c4033',
  },
  prayer: { 
    name: 'Prayer', 
    icon: '🕊️', 
    description: 'Memorial Prayer Cards',
    suggestedFonts: ['Cormorant Garamond', 'Playfair Display', 'Alex Brush', 'Tangerine'],
    suggestedFrameColors: ['#708090', '#c9a227', '#8b7355', '#c0c0c0'],
    defaultTextColor: '#333333',
  },
  memorial: { 
    name: 'Memorial', 
    icon: '🕯️', 
    description: 'Celebration of Life',
    suggestedFonts: ['Cormorant Garamond', 'Playfair Display', 'Montserrat'],
    suggestedFrameColors: ['#8b7355', '#708090', '#c9a227', '#c0c0c0'],
    defaultTextColor: '#3d3d3d',
  },
  graduation: { 
    name: 'Graduation', 
    icon: '🎓', 
    description: 'Achievement Cards',
    suggestedFonts: ['Montserrat', 'Poppins', 'Playfair Display'],
    suggestedFrameColors: ['#c9a227', '#000080', '#8b0000', '#006400'],
    defaultTextColor: '#1a1a2e',
  },
  anniversary: { 
    name: 'Anniversary', 
    icon: '💝', 
    description: 'Milestone Celebrations',
    suggestedFonts: ['Great Vibes', 'Playfair Display', 'Allura', 'Cormorant Garamond'],
    suggestedFrameColors: ['#c0c0c0', '#d4af37', '#b76e79', '#c9a227'],
    defaultTextColor: '#2c2c2c',
  },
};

export const fontOptions = [
  { name: 'Great Vibes', value: 'Great Vibes', style: 'Script/Cursive' },
  { name: 'Allura', value: 'Allura', style: 'Wedding Script' },
  { name: 'Playfair Display', value: 'Playfair Display', style: 'Elegant Serif' },
  { name: 'Cormorant Garamond', value: 'Cormorant Garamond', style: 'Classic Serif' },
  { name: 'Montserrat', value: 'Montserrat', style: 'Modern Sans' },
  { name: 'Poppins', value: 'Poppins', style: 'Clean Sans' },
  { name: 'Dancing Script', value: 'Dancing Script', style: 'Flowing Script' },
  { name: 'Tangerine', value: 'Tangerine', style: 'Formal Script' },
  { name: 'Alex Brush', value: 'Alex Brush', style: 'Brush Script' },
  { name: 'Sacramento', value: 'Sacramento', style: 'Casual Script' },
];

export const colorPresets = [
  // Golds
  '#d4af37', '#c9a227', '#b8860b', '#daa520',
  // Silvers
  '#c0c0c0', '#a8a8a8', '#e8e8e8', '#9c8b75',
  // Rose Golds
  '#b76e79', '#e8c4c4', '#c9a0a0',
  // Blacks & Grays
  '#000000', '#1a1a2e', '#2c2c2c', '#333333', '#708090',
  // Whites & Creams
  '#ffffff', '#fefefe', '#f5f5f5', '#fffaf0',
  // Accent Colors
  '#000080', '#8b0000', '#006400', '#4b0082',
];

export const createDefaultTextElement = (id: string, content: string, fontSize: number, y: number, color: string = '#2c2c2c', fontFamily: string = 'Playfair Display'): TextElement => ({
  id,
  content,
  style: {
    fontFamily,
    fontSize,
    color,
    x: 200,
    y,
    scaleX: 1,
    scaleY: 1,
  },
});

export const createDefaultSide = (category: CardCategory, isFront: boolean): CardSideData => {
  const info = categoryInfo[category];
  const textColor = info.defaultTextColor;
  const frameColor = info.suggestedFrameColors[0];
  const font = info.suggestedFonts[0];

  const texts: TextElement[] = isFront ? [
    createDefaultTextElement('headline', info.name, 14, 70, frameColor, 'Montserrat'),
    createDefaultTextElement('title', 'Your Title Here', 24, 110, textColor, font),
    createDefaultTextElement('subtitle', 'Subtitle text', 14, 145, textColor, info.suggestedFonts[1] || font),
    createDefaultTextElement('detail1', 'Detail line 1', 12, 180, textColor, 'Montserrat'),
    createDefaultTextElement('detail2', 'Detail line 2', 12, 200, textColor, 'Montserrat'),
    createDefaultTextElement('accent', '✦', 10, 230, frameColor, 'serif'),
  ] : [
    createDefaultTextElement('headline', '✦', 14, 80, frameColor, 'serif'),
    createDefaultTextElement('title', 'Back Title', 20, 120, textColor, font),
    createDefaultTextElement('subtitle', 'Additional info', 12, 155, textColor, 'Montserrat'),
    createDefaultTextElement('detail1', 'Contact or details', 11, 190, textColor, 'Montserrat'),
    createDefaultTextElement('accent', info.icon, 10, 220, frameColor, 'serif'),
  ];

  return {
    background: { texture: 'brushed-gold' },
    frameStyle: 'ornate',
    frameColor,
    texts,
    elements: [],
    logo: null,
    logoScale: 1,
    logoX: 200,
    logoY: 130,
    logoOpacity: 1,
  };
};

export const createDefaultCardData = (category: CardCategory): BusinessCardData => ({
  front: createDefaultSide(category, true),
  back: createDefaultSide(category, false),
  category,
  orientation: 'landscape',
  activeSide: 'front',
});

export type EditorStep = 'celebration' | 'front-background' | 'front-fonts' | 'front-frame' | 'front-elements' | 'front-text' | 'back-background' | 'back-fonts' | 'back-frame' | 'back-elements' | 'back-text' | 'review';
