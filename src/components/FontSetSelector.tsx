import { motion } from 'framer-motion';
import { CardCategory, categoryInfo, BackgroundStyle, backgroundTextures } from '@/types/businessCard';
import { cn } from '@/lib/utils';

export interface FontSet {
  id: string;
  name: string;
  mainFont: string;
  subFont: string;
  accentColor: string;
  textColor: string;
}

interface FontSetSelectorProps {
  category: CardCategory;
  background: BackgroundStyle;
  selectedFontSet: FontSet | null;
  onSelect: (fontSet: FontSet) => void;
}

// Font sets based on celebration type - focusing on cursive/script combos
const getFontSetsForCategory = (category: CardCategory): FontSet[] => {
  const info = categoryInfo[category];
  const baseColor = info.suggestedFrameColors[0];
  const textColor = info.defaultTextColor;

  const baseSets: FontSet[] = [
    {
      id: 'elegant-script',
      name: 'Elegant Script',
      mainFont: 'Great Vibes',
      subFont: 'Cormorant Garamond',
      accentColor: baseColor,
      textColor,
    },
    {
      id: 'romantic-flow',
      name: 'Romantic Flow',
      mainFont: 'Allura',
      subFont: 'Playfair Display',
      accentColor: baseColor,
      textColor,
    },
    {
      id: 'dancing-classic',
      name: 'Dancing Classic',
      mainFont: 'Dancing Script',
      subFont: 'Montserrat',
      accentColor: baseColor,
      textColor,
    },
    {
      id: 'brush-modern',
      name: 'Brush Modern',
      mainFont: 'Alex Brush',
      subFont: 'Poppins',
      accentColor: baseColor,
      textColor,
    },
    {
      id: 'sacramento-serif',
      name: 'Casual Elegance',
      mainFont: 'Sacramento',
      subFont: 'Cormorant Garamond',
      accentColor: baseColor,
      textColor,
    },
    {
      id: 'tangerine-formal',
      name: 'Formal Script',
      mainFont: 'Tangerine',
      subFont: 'Playfair Display',
      accentColor: baseColor,
      textColor,
    },
  ];

  // Customize based on category
  switch (category) {
    case 'wedding':
    case 'anniversary':
      return baseSets.map(set => ({
        ...set,
        accentColor: '#d4af37',
        textColor: '#2c2c2c',
      }));
    case 'baby':
      return baseSets.map(set => ({
        ...set,
        accentColor: '#e8b4b8',
        textColor: '#5c4033',
      }));
    case 'memorial':
    case 'prayer':
      return baseSets.map(set => ({
        ...set,
        accentColor: '#708090',
        textColor: '#333333',
      }));
    case 'graduation':
      return baseSets.map(set => ({
        ...set,
        accentColor: '#c9a227',
        textColor: '#1a1a2e',
      }));
    default:
      return baseSets;
  }
};

const getSampleText = (category: CardCategory): { main: string; sub: string } => {
  switch (category) {
    case 'wedding':
      return { main: 'Sarah & Michael', sub: 'June 15, 2025' };
    case 'baby':
      return { main: 'Welcome Baby Emma', sub: 'Born December 20, 2024' };
    case 'prayer':
      return { main: 'In Loving Memory', sub: 'Forever in our hearts' };
    case 'memorial':
      return { main: 'Celebrating Life', sub: 'A life well lived' };
    case 'graduation':
      return { main: 'Class of 2025', sub: 'The journey begins' };
    case 'anniversary':
      return { main: '25 Years Together', sub: 'Forever & Always' };
    default:
      return { main: 'Your Title', sub: 'Your Subtitle' };
  }
};

export const FontSetSelector = ({ category, background, selectedFontSet, onSelect }: FontSetSelectorProps) => {
  const fontSets = getFontSetsForCategory(category);
  const sampleText = getSampleText(category);

  const getBackgroundStyle = (): React.CSSProperties => {
    if (background.texture === 'custom-photo' && background.customImage) {
      return {
        backgroundImage: `url(${background.customImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }

    const texture = backgroundTextures.find(t => t.value === background.texture);
    if (texture) {
      return { background: texture.preview };
    }

    return { backgroundColor: '#fefefe' };
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium text-foreground mb-1">Choose Your Font Style</h3>
        <p className="text-sm text-muted-foreground">
          Select a font combination that matches your celebration
        </p>
      </div>

      <div className="grid gap-4">
        {fontSets.map((fontSet, index) => (
          <motion.button
            key={fontSet.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(fontSet)}
            className={cn(
              'w-full rounded-xl border-2 overflow-hidden transition-all group',
              selectedFontSet?.id === fontSet.id
                ? 'border-primary ring-2 ring-primary/20 scale-[1.02]'
                : 'border-border hover:border-primary/40'
            )}
          >
            {/* Preview Card */}
            <div
              className="relative px-6 py-8 text-center"
              style={getBackgroundStyle()}
            >
              {/* Metallic shine overlay */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)',
                }}
              />
              
              {/* Font Preview */}
              <div className="relative z-10 space-y-2">
                <p
                  className="text-3xl leading-tight"
                  style={{
                    fontFamily: fontSet.mainFont,
                    color: fontSet.textColor,
                  }}
                >
                  {sampleText.main}
                </p>
                <p
                  className="text-sm tracking-wide"
                  style={{
                    fontFamily: fontSet.subFont,
                    color: fontSet.accentColor,
                  }}
                >
                  {sampleText.sub}
                </p>
              </div>
            </div>

            {/* Font Set Name */}
            <div className="px-4 py-3 bg-card/80 backdrop-blur-sm border-t border-border/50 flex items-center justify-between">
              <div className="text-left">
                <p className="font-medium text-sm">{fontSet.name}</p>
                <p className="text-xs text-muted-foreground">
                  {fontSet.mainFont} + {fontSet.subFont}
                </p>
              </div>
              <div
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: fontSet.accentColor }}
              />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
