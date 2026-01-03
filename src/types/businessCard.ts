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
  name: string;
  title: string;
  subtitle: string;
  line1: string;
  line2: string;
  line3: string;
  logo: string | null;
  logoScale: number;
  logoX: number;
  logoY: number;
  logoOpacity: number;
  backgroundColor: string;
  frameStyle: 'none' | 'solid' | 'double' | 'gradient' | 'ornate' | 'dashed' | 'dotted' | 'inset' | 'shadow' | 'corner';
  frameColor: string;
  nameStyle: TextElementStyle;
  titleStyle: TextElementStyle;
  subtitleStyle: TextElementStyle;
  line1Style: TextElementStyle;
  line2Style: TextElementStyle;
  line3Style: TextElementStyle;
}

export interface BusinessCardData {
  front: CardSideData;
  back: CardSideData;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  category: CardCategory;
  orientation: 'landscape' | 'portrait';
  activeSide: 'front' | 'back';
}

export type CardCategory = 'wedding' | 'baby' | 'prayer' | 'memorial' | 'graduation' | 'anniversary';

export const defaultTextStyle = (fontSize: number, color: string, y: number): TextElementStyle => ({
  fontFamily: 'Playfair Display',
  fontSize,
  color,
  x: 200,
  y,
  scaleX: 1,
  scaleY: 1,
});

export const createDefaultStyles = (textColor: string, accentColor: string): Pick<CardSideData, 'nameStyle' | 'titleStyle' | 'subtitleStyle' | 'line1Style' | 'line2Style' | 'line3Style'> => ({
  nameStyle: defaultTextStyle(12, accentColor, 80),
  titleStyle: defaultTextStyle(22, textColor, 110),
  subtitleStyle: defaultTextStyle(14, textColor, 140),
  line1Style: defaultTextStyle(12, textColor, 175),
  line2Style: defaultTextStyle(12, textColor, 195),
  line3Style: defaultTextStyle(10, accentColor, 220),
});

export const createDefaultSide = (
  textColor: string,
  accentColor: string,
  backgroundColor: string,
  frameColor: string,
  content: {
    name: string;
    title: string;
    subtitle: string;
    line1: string;
    line2: string;
    line3: string;
  }
): CardSideData => ({
  ...content,
  logo: null,
  logoScale: 1,
  logoX: 200,
  logoY: 130,
  logoOpacity: 1,
  backgroundColor,
  frameStyle: 'ornate',
  frameColor,
  ...createDefaultStyles(textColor, accentColor),
});

export const categoryDefaults: Record<CardCategory, { front: Partial<CardSideData>; back: Partial<CardSideData>; textColor: string; accentColor: string; backgroundColor: string; fontFamily: string }> = {
  wedding: {
    front: {
      name: 'Sarah & Michael',
      title: 'Request the pleasure of your company',
      subtitle: 'at their wedding celebration',
      line1: 'Saturday, June 15th, 2025',
      line2: 'The Grand Estate • 5:00 PM',
      line3: 'Dinner & Dancing to follow',
    },
    back: {
      name: 'RSVP',
      title: 'Please respond by May 1st',
      subtitle: 'rsvp@sarahandmichael.com',
      line1: 'Dinner Options:',
      line2: '☐ Beef  ☐ Chicken  ☐ Vegetarian',
      line3: 'We can\'t wait to celebrate with you!',
    },
    backgroundColor: '#fefefe',
    textColor: '#2c2c2c',
    accentColor: '#b8860b',
    fontFamily: 'Playfair Display',
  },
  baby: {
    front: {
      name: 'Introducing',
      title: 'Emma Rose Johnson',
      subtitle: 'Born March 12, 2025',
      line1: '7 lbs 8 oz • 20 inches',
      line2: 'Proud Parents: James & Anna',
      line3: '♥',
    },
    back: {
      name: 'Welcome Baby',
      title: 'She has arrived!',
      subtitle: '',
      line1: 'Special thanks to all our',
      line2: 'family and friends for',
      line3: 'your love and support',
    },
    backgroundColor: '#fdf6f0',
    textColor: '#5c4033',
    accentColor: '#e8b4b8',
    fontFamily: 'Cormorant Garamond',
  },
  prayer: {
    front: {
      name: 'In Loving Memory',
      title: 'Robert James Wilson',
      subtitle: '1945 - 2024',
      line1: '"Forever in our hearts"',
      line2: "Those we love don't go away,",
      line3: 'they walk beside us every day.',
    },
    back: {
      name: '🕊️',
      title: 'The Lord is my shepherd',
      subtitle: 'I shall not want',
      line1: 'He maketh me to lie down',
      line2: 'in green pastures',
      line3: 'Psalm 23',
    },
    backgroundColor: '#f5f5f5',
    textColor: '#333333',
    accentColor: '#708090',
    fontFamily: 'Cormorant Garamond',
  },
  memorial: {
    front: {
      name: 'Celebration of Life',
      title: 'Margaret Anne Thompson',
      subtitle: '1938 - 2024',
      line1: 'A beautiful soul, forever remembered',
      line2: 'Service: March 20, 2025',
      line3: "St. Mary's Chapel",
    },
    back: {
      name: '🕯️',
      title: 'In Memory',
      subtitle: 'A life well lived',
      line1: 'Your love lives on',
      line2: 'in the hearts of all',
      line3: 'who knew you',
    },
    backgroundColor: '#faf8f5',
    textColor: '#3d3d3d',
    accentColor: '#8b7355',
    fontFamily: 'Cormorant Garamond',
  },
  graduation: {
    front: {
      name: 'Class of 2025',
      title: 'Alexandra Chen',
      subtitle: 'Bachelor of Science, Magna Cum Laude',
      line1: 'University of California',
      line2: 'Commencement: May 18, 2025',
      line3: 'The future belongs to those who believe',
    },
    back: {
      name: '🎓',
      title: 'Thank You',
      subtitle: 'For your support & encouragement',
      line1: 'The journey continues...',
      line2: 'Next stop: Graduate School',
      line3: 'Dream big!',
    },
    backgroundColor: '#1a1a2e',
    textColor: '#ffffff',
    accentColor: '#c9a227',
    fontFamily: 'Montserrat',
  },
  anniversary: {
    front: {
      name: '25 Years',
      title: 'David & Elizabeth',
      subtitle: 'Silver Anniversary Celebration',
      line1: 'Join us as we celebrate',
      line2: 'August 22, 2025 • 6:00 PM',
      line3: 'The Riverside Ballroom',
    },
    back: {
      name: '💝',
      title: 'A Love Story',
      subtitle: '25 years and counting',
      line1: 'Through every joy and challenge',
      line2: 'Our love has only grown stronger',
      line3: 'Here\'s to many more!',
    },
    backgroundColor: '#f8f8f8',
    textColor: '#2c2c2c',
    accentColor: '#c0c0c0',
    fontFamily: 'Playfair Display',
  },
};

export const createDefaultCardData = (category: CardCategory): BusinessCardData => {
  const defaults = categoryDefaults[category];
  const frontSide = createDefaultSide(
    defaults.textColor,
    defaults.accentColor,
    defaults.backgroundColor,
    defaults.accentColor,
    {
      name: defaults.front.name || '',
      title: defaults.front.title || '',
      subtitle: defaults.front.subtitle || '',
      line1: defaults.front.line1 || '',
      line2: defaults.front.line2 || '',
      line3: defaults.front.line3 || '',
    }
  );
  const backSide = createDefaultSide(
    defaults.textColor,
    defaults.accentColor,
    defaults.backgroundColor,
    defaults.accentColor,
    {
      name: defaults.back.name || '',
      title: defaults.back.title || '',
      subtitle: defaults.back.subtitle || '',
      line1: defaults.back.line1 || '',
      line2: defaults.back.line2 || '',
      line3: defaults.back.line3 || '',
    }
  );

  return {
    front: frontSide,
    back: backSide,
    textColor: defaults.textColor,
    accentColor: defaults.accentColor,
    fontFamily: defaults.fontFamily,
    category,
    orientation: 'landscape',
    activeSide: 'front',
  };
};

export const defaultCardData: BusinessCardData = createDefaultCardData('wedding');

export const fontOptions = [
  { name: 'Playfair Display', value: 'Playfair Display', className: 'font-display', style: 'Elegant Serif' },
  { name: 'Cormorant Garamond', value: 'Cormorant Garamond', className: 'font-cormorant', style: 'Classic Serif' },
  { name: 'Montserrat', value: 'Montserrat', className: 'font-montserrat', style: 'Modern Sans' },
  { name: 'Great Vibes', value: 'Great Vibes', className: 'font-script', style: 'Script/Cursive' },
  { name: 'Poppins', value: 'Poppins', className: 'font-poppins', style: 'Clean Sans' },
  { name: 'Dancing Script', value: 'Dancing Script', className: 'font-dancing', style: 'Flowing Script' },
  { name: 'Tangerine', value: 'Tangerine', className: 'font-tangerine', style: 'Formal Script' },
  { name: 'Alex Brush', value: 'Alex Brush', className: 'font-alexbrush', style: 'Brush Script' },
  { name: 'Allura', value: 'Allura', className: 'font-allura', style: 'Wedding Script' },
  { name: 'Sacramento', value: 'Sacramento', className: 'font-sacramento', style: 'Casual Script' },
];

export const colorPresets = [
  // Whites & Creams
  '#ffffff', '#fefefe', '#fdf6f0', '#f5f5f5', '#faf8f5', '#f8f8f8', '#fffaf0', '#fff8dc',
  // Blacks & Grays
  '#000000', '#1a1a2e', '#2c2c2c', '#333333', '#4a4a4a', '#5c5c5c', '#708090', '#4a5568',
  // Golds & Browns
  '#b8860b', '#c9a227', '#d4af37', '#daa520', '#8b7355', '#a67c52', '#5c4033', '#3d3d3d',
  // Silvers & Metallics
  '#c0c0c0', '#9c8b75', '#a8a8a8', '#b0b0b0',
  // Pinks & Reds
  '#e8b4b8', '#dda0dd', '#ffb6c1', '#ff69b4', '#dc143c', '#8b0000', '#a52a2a',
  // Blues
  '#000080', '#00008b', '#4169e1', '#6495ed', '#87ceeb', '#add8e6',
  // Greens
  '#006400', '#228b22', '#2e8b57', '#3cb371', '#90ee90',
  // Purples
  '#4b0082', '#800080', '#9370db', '#ba55d3', '#dda0dd',
];

export const frameStyles = [
  { name: 'None', value: 'none' as const },
  { name: 'Simple', value: 'solid' as const },
  { name: 'Double', value: 'double' as const },
  { name: 'Gradient', value: 'gradient' as const },
  { name: 'Ornate', value: 'ornate' as const },
  { name: 'Dashed', value: 'dashed' as const },
  { name: 'Dotted', value: 'dotted' as const },
  { name: 'Inset', value: 'inset' as const },
  { name: 'Shadow', value: 'shadow' as const },
  { name: 'Corner', value: 'corner' as const },
];

export const categoryInfo: Record<CardCategory, { name: string; icon: string; description: string }> = {
  wedding: { name: 'Wedding', icon: '💍', description: 'Invitations & Save the Dates' },
  baby: { name: 'Baby', icon: '👶', description: 'Birth Announcements' },
  prayer: { name: 'Prayer', icon: '🕊️', description: 'Memorial Prayer Cards' },
  memorial: { name: 'Memorial', icon: '🕯️', description: 'Celebration of Life' },
  graduation: { name: 'Graduation', icon: '🎓', description: 'Achievement Cards' },
  anniversary: { name: 'Anniversary', icon: '💝', description: 'Milestone Celebrations' },
};
