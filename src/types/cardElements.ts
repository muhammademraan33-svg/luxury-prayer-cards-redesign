// Element types for Canva-style editor

export type ElementType = 'shape' | 'icon' | 'sticker' | 'line' | 'image';

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  locked?: boolean;
}

export interface ShapeElement extends BaseElement {
  type: 'shape';
  shape: 'rectangle' | 'circle' | 'triangle' | 'star' | 'heart' | 'diamond' | 'hexagon' | 'oval';
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface IconElement extends BaseElement {
  type: 'icon';
  icon: string; // Lucide icon name
  color: string;
}

export interface StickerElement extends BaseElement {
  type: 'sticker';
  emoji: string;
}

export interface LineElement extends BaseElement {
  type: 'line';
  lineStyle: 'solid' | 'dashed' | 'dotted';
  color: string;
  thickness: number;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  borderRadius: number;
}

export type CardElement = ShapeElement | IconElement | StickerElement | LineElement | ImageElement;

// Element library data
export const shapeLibrary: { name: string; shape: ShapeElement['shape']; preview: string }[] = [
  { name: 'Rectangle', shape: 'rectangle', preview: '▬' },
  { name: 'Circle', shape: 'circle', preview: '●' },
  { name: 'Triangle', shape: 'triangle', preview: '▲' },
  { name: 'Star', shape: 'star', preview: '★' },
  { name: 'Heart', shape: 'heart', preview: '♥' },
  { name: 'Diamond', shape: 'diamond', preview: '◆' },
  { name: 'Hexagon', shape: 'hexagon', preview: '⬡' },
  { name: 'Oval', shape: 'oval', preview: '⬭' },
];

export const iconLibrary: { name: string; icon: string }[] = [
  { name: 'Heart', icon: 'Heart' },
  { name: 'Star', icon: 'Star' },
  { name: 'Crown', icon: 'Crown' },
  { name: 'Sparkles', icon: 'Sparkles' },
  { name: 'Flower', icon: 'Flower2' },
  { name: 'Sun', icon: 'Sun' },
  { name: 'Moon', icon: 'Moon' },
  { name: 'Cloud', icon: 'Cloud' },
  { name: 'Music', icon: 'Music' },
  { name: 'Camera', icon: 'Camera' },
  { name: 'Gift', icon: 'Gift' },
  { name: 'Cake', icon: 'Cake' },
  { name: 'Baby', icon: 'Baby' },
  { name: 'Church', icon: 'Church' },
  { name: 'Cross', icon: 'Cross' },
  { name: 'Dove', icon: 'Bird' },
  { name: 'Ring', icon: 'CircleDot' },
  { name: 'Graduation', icon: 'GraduationCap' },
  { name: 'Award', icon: 'Award' },
  { name: 'Trophy', icon: 'Trophy' },
];

export const stickerLibrary: { name: string; emoji: string; category: string }[] = [
  // Wedding
  { name: 'Rings', emoji: '💍', category: 'wedding' },
  { name: 'Hearts', emoji: '💕', category: 'wedding' },
  { name: 'Bride', emoji: '👰', category: 'wedding' },
  { name: 'Groom', emoji: '🤵', category: 'wedding' },
  { name: 'Champagne', emoji: '🥂', category: 'wedding' },
  { name: 'Rose', emoji: '🌹', category: 'wedding' },
  { name: 'Bouquet', emoji: '💐', category: 'wedding' },
  { name: 'Kiss', emoji: '💋', category: 'wedding' },
  // Baby
  { name: 'Baby', emoji: '👶', category: 'baby' },
  { name: 'Bottle', emoji: '🍼', category: 'baby' },
  { name: 'Footprints', emoji: '👣', category: 'baby' },
  { name: 'Teddy', emoji: '🧸', category: 'baby' },
  { name: 'Rattle', emoji: '🎀', category: 'baby' },
  { name: 'Stork', emoji: '🦩', category: 'baby' },
  // Religious
  { name: 'Dove', emoji: '🕊️', category: 'prayer' },
  { name: 'Praying', emoji: '🙏', category: 'prayer' },
  { name: 'Angel', emoji: '👼', category: 'prayer' },
  { name: 'Candle', emoji: '🕯️', category: 'prayer' },
  { name: 'Cross', emoji: '✝️', category: 'prayer' },
  { name: 'Church', emoji: '⛪', category: 'prayer' },
  // Celebration
  { name: 'Party', emoji: '🎉', category: 'graduation' },
  { name: 'Confetti', emoji: '🎊', category: 'graduation' },
  { name: 'Balloon', emoji: '🎈', category: 'graduation' },
  { name: 'Trophy', emoji: '🏆', category: 'graduation' },
  { name: 'Grad Cap', emoji: '🎓', category: 'graduation' },
  { name: 'Medal', emoji: '🏅', category: 'graduation' },
  // Anniversary
  { name: 'Gift', emoji: '🎁', category: 'anniversary' },
  { name: 'Heart', emoji: '❤️', category: 'anniversary' },
  { name: 'Sparkle', emoji: '✨', category: 'anniversary' },
  { name: 'Love', emoji: '💝', category: 'anniversary' },
  { name: 'Wine', emoji: '🍷', category: 'anniversary' },
  { name: 'Couple', emoji: '💑', category: 'anniversary' },
  // Decorative
  { name: 'Star', emoji: '⭐', category: 'decorative' },
  { name: 'Sparkles', emoji: '✨', category: 'decorative' },
  { name: 'Diamond', emoji: '💎', category: 'decorative' },
  { name: 'Crown', emoji: '👑', category: 'decorative' },
  { name: 'Ribbon', emoji: '🎀', category: 'decorative' },
  { name: 'Flower', emoji: '🌸', category: 'decorative' },
  { name: 'Leaf', emoji: '🍃', category: 'decorative' },
  { name: 'Butterfly', emoji: '🦋', category: 'decorative' },
];

export const lineStyles: { name: string; style: LineElement['lineStyle'] }[] = [
  { name: 'Solid', style: 'solid' },
  { name: 'Dashed', style: 'dashed' },
  { name: 'Dotted', style: 'dotted' },
];

// Helper to create elements
export const createShapeElement = (shape: ShapeElement['shape'], x: number, y: number): ShapeElement => ({
  id: `shape-${Date.now()}`,
  type: 'shape',
  shape,
  x,
  y,
  width: 60,
  height: 60,
  rotation: 0,
  opacity: 1,
  fill: '#d4af37',
  stroke: 'transparent',
  strokeWidth: 0,
});

export const createIconElement = (icon: string, x: number, y: number): IconElement => ({
  id: `icon-${Date.now()}`,
  type: 'icon',
  icon,
  x,
  y,
  width: 40,
  height: 40,
  rotation: 0,
  opacity: 1,
  color: '#d4af37',
});

export const createStickerElement = (emoji: string, x: number, y: number): StickerElement => ({
  id: `sticker-${Date.now()}`,
  type: 'sticker',
  emoji,
  x,
  y,
  width: 50,
  height: 50,
  rotation: 0,
  opacity: 1,
});

export const createLineElement = (x: number, y: number): LineElement => ({
  id: `line-${Date.now()}`,
  type: 'line',
  lineStyle: 'solid',
  x,
  y,
  width: 100,
  height: 2,
  rotation: 0,
  opacity: 1,
  color: '#d4af37',
  thickness: 2,
});

export const createImageElement = (src: string, x: number, y: number): ImageElement => ({
  id: `image-${Date.now()}`,
  type: 'image',
  src,
  x,
  y,
  width: 80,
  height: 80,
  rotation: 0,
  opacity: 1,
  borderRadius: 0,
});
