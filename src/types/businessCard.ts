export interface BusinessCardData {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  logo: string | null;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  borderRadius: number;
  frameStyle: 'none' | 'solid' | 'double' | 'gradient' | 'shadow';
  frameColor: string;
}

export const defaultCardData: BusinessCardData = {
  name: 'John Smith',
  title: 'Creative Director',
  company: 'Design Studio',
  email: 'john@designstudio.com',
  phone: '+1 (555) 123-4567',
  website: 'www.designstudio.com',
  logo: null,
  backgroundColor: '#ffffff',
  textColor: '#1a1a2e',
  accentColor: '#2d9596',
  fontFamily: 'Inter',
  borderRadius: 16,
  frameStyle: 'none',
  frameColor: '#2d9596',
};

export const fontOptions = [
  { name: 'Inter', value: 'Inter', className: 'font-sans' },
  { name: 'Playfair Display', value: 'Playfair Display', className: 'font-display' },
  { name: 'Montserrat', value: 'Montserrat', className: 'font-montserrat' },
  { name: 'Roboto Slab', value: 'Roboto Slab', className: 'font-roboto-slab' },
  { name: 'Poppins', value: 'Poppins', className: 'font-poppins' },
];

export const colorPresets = [
  '#ffffff', '#f8f9fa', '#1a1a2e', '#16213e', '#0f3460',
  '#2d9596', '#e94560', '#ff6b35', '#ffc045', '#4ecdc4',
  '#95e1d3', '#f38181', '#aa96da', '#fcbad3', '#a8d8ea',
];

export const frameStyles = [
  { name: 'None', value: 'none' as const },
  { name: 'Solid', value: 'solid' as const },
  { name: 'Double', value: 'double' as const },
  { name: 'Gradient', value: 'gradient' as const },
  { name: 'Shadow', value: 'shadow' as const },
];
