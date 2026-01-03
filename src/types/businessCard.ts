import { CardElement } from './cardElements';

// Background textures for premium metal cards
export type BackgroundTexture = 
  | 'marble-white' 
  | 'marble-black' 
  | 'brushed-gold' 
  | 'brushed-silver' 
  | 'brushed-black' 
  | 'brushed-rose-gold'
  | 'solid-black'
  | 'solid-white'
  | 'custom-photo';

export interface BackgroundStyle {
  texture: BackgroundTexture;
  customImage?: string;
}

export const backgroundTextures: { value: BackgroundTexture; name: string; preview: string }[] = [
  { value: 'brushed-gold', name: 'Brushed Gold', preview: 'linear-gradient(135deg, #d4af37 0%, #f5d77a 25%, #c9a227 50%, #f5d77a 75%, #d4af37 100%)' },
  { value: 'brushed-silver', name: 'Brushed Silver', preview: 'linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 25%, #a8a8a8 50%, #e8e8e8 75%, #c0c0c0 100%)' },
  { value: 'brushed-black', name: 'Brushed Black', preview: 'linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 25%, #0a0a0a 50%, #3a3a3a 75%, #1a1a1a 100%)' },
  { value: 'brushed-rose-gold', name: 'Rose Gold', preview: 'linear-gradient(135deg, #b76e79 0%, #e8c4c4 25%, #c9a0a0 50%, #e8c4c4 75%, #b76e79 100%)' },
  { value: 'marble-white', name: 'White Marble', preview: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 30%, #f8f8f8 60%, #ececec 100%)' },
  { value: 'marble-black', name: 'Black Marble', preview: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 30%, #1a1a2e 60%, #3d3d5c 100%)' },
  { value: 'solid-black', name: 'Solid Black', preview: '#0a0a0a' },
  { value: 'solid-white', name: 'Solid White', preview: '#fefefe' },
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
