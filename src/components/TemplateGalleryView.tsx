import { useState } from 'react';
import { CardCategory, categoryInfo } from '@/types/businessCard';
import { TemplateCard, Template } from './TemplateCard';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import eternityLogo from '@/assets/eternity-cards-logo.png';

const templates: Template[] = [
  // Wedding templates
  {
    id: 'wedding-classic',
    name: 'THE WEDDING OF',
    category: 'wedding',
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
    backgroundImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop',
    backgroundColor: '#fefefe',
    frameStyle: 'ornate',
    frameColor: '#b8860b',
    textColor: '#ffffff',
    accentColor: '#b8860b',
    fontFamily: 'Playfair Display',
  },
  {
    id: 'wedding-romantic',
    name: 'Clean Editorial',
    category: 'wedding',
    thumbnail: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=600&h=400&fit=crop',
    backgroundImage: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=1200&h=800&fit=crop',
    backgroundColor: '#fff5f5',
    frameStyle: 'none',
    frameColor: '#e8b4b8',
    textColor: '#ffffff',
    accentColor: '#e8b4b8',
    fontFamily: 'Cormorant Garamond',
  },
  {
    id: 'wedding-modern',
    name: 'Forever Begins',
    category: 'wedding',
    thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=400&fit=crop',
    backgroundImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&h=800&fit=crop',
    backgroundColor: '#ffffff',
    frameStyle: 'none',
    frameColor: '#333333',
    textColor: '#ffffff',
    accentColor: '#ffffff',
    fontFamily: 'Montserrat',
  },
  // Baby templates
  {
    id: 'baby-arrival',
    name: 'Welcome Baby',
    category: 'baby',
    thumbnail: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=400&fit=crop',
    backgroundImage: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=1200&h=800&fit=crop',
    backgroundColor: '#fdf2f8',
    frameStyle: 'none',
    frameColor: '#f9a8d4',
    textColor: '#ffffff',
    accentColor: '#ec4899',
    fontFamily: 'Dancing Script',
  },
  {
    id: 'baby-little-arrival',
    name: 'Our Little Arrival',
    category: 'baby',
    thumbnail: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&h=400&fit=crop',
    backgroundImage: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=1200&h=800&fit=crop',
    backgroundColor: '#fef7ed',
    frameStyle: 'none',
    frameColor: '#d4a574',
    textColor: '#1a1a1a',
    accentColor: '#d97706',
    fontFamily: 'Playfair Display',
  },
  // Graduation templates
  {
    id: 'graduation-day',
    name: 'GRADUATION DAY',
    category: 'graduation',
    thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop',
    backgroundImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=800&fit=crop',
    backgroundColor: '#ffffff',
    frameStyle: 'none',
    frameColor: '#1e3a5f',
    textColor: '#1e3a5f',
    accentColor: '#c9a227',
    fontFamily: 'Montserrat',
  },
  {
    id: 'graduation-class',
    name: 'Class of 2025',
    category: 'graduation',
    thumbnail: 'https://images.unsplash.com/photo-1627556704302-624286467c65?w=600&h=400&fit=crop',
    backgroundImage: 'https://images.unsplash.com/photo-1627556704302-624286467c65?w=1200&h=800&fit=crop',
    backgroundColor: '#1e3a5f',
    frameStyle: 'none',
    frameColor: '#fbbf24',
    textColor: '#ffffff',
    accentColor: '#fbbf24',
    fontFamily: 'Playfair Display',
  },
  // Memorial templates
  {
    id: 'memorial-life',
    name: 'Celebration of Life',
    category: 'memorial',
    thumbnail: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=400&fit=crop',
    backgroundImage: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&h=800&fit=crop',
    backgroundColor: '#fef3e2',
    frameStyle: 'none',
    frameColor: '#ea580c',
    textColor: '#ffffff',
    accentColor: '#f97316',
    fontFamily: 'Cormorant Garamond',
  },
  {
    id: 'memorial-hearts',
    name: 'Always in Our Hearts',
    category: 'memorial',
    thumbnail: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop',
    backgroundImage: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&h=800&fit=crop',
    backgroundColor: '#faf8f5',
    frameStyle: 'none',
    frameColor: '#8b7355',
    textColor: '#ffffff',
    accentColor: '#8b7355',
    fontFamily: 'Dancing Script',
  },
  {
    id: 'memorial-tribute',
    name: 'A Life Celebrated',
    category: 'memorial',
    thumbnail: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&h=400&fit=crop',
    backgroundImage: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1200&h=800&fit=crop',
    backgroundColor: '#ffffff',
    frameStyle: 'none',
    frameColor: '#94a3b8',
    textColor: '#ffffff',
    accentColor: '#64748b',
    fontFamily: 'Great Vibes',
  },
  // Prayer templates
  {
    id: 'prayer-peaceful',
    name: 'Peaceful Light',
    category: 'prayer',
    thumbnail: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&h=400&fit=crop',
    backgroundImage: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1200&h=800&fit=crop',
    backgroundColor: '#f8fafc',
    frameStyle: 'none',
    frameColor: '#94a3b8',
    textColor: '#ffffff',
    accentColor: '#64748b',
    fontFamily: 'Cormorant Garamond',
  },
  // Anniversary templates
  {
    id: 'anniversary-happy',
    name: 'Happy Anniversary',
    category: 'anniversary',
    thumbnail: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&h=400&fit=crop',
    backgroundImage: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=1200&h=800&fit=crop',
    backgroundColor: '#fff5f5',
    frameStyle: 'none',
    frameColor: '#e8b4b8',
    textColor: '#ffffff',
    accentColor: '#e8b4b8',
    fontFamily: 'Great Vibes',
  },
  {
    id: 'anniversary-golden',
    name: 'Golden Years',
    category: 'anniversary',
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=400&fit=crop',
    backgroundImage: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200&h=800&fit=crop',
    backgroundColor: '#fffbeb',
    frameStyle: 'none',
    frameColor: '#d4af37',
    textColor: '#ffffff',
    accentColor: '#d4af37',
    fontFamily: 'Playfair Display',
  },
  // New Home templates
  {
    id: 'home-first',
    name: 'Our First Home',
    category: 'anniversary',
    thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop',
    backgroundImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=800&fit=crop',
    backgroundColor: '#f0f9ff',
    frameStyle: 'none',
    frameColor: '#1e3a5f',
    textColor: '#ffffff',
    accentColor: '#0ea5e9',
    fontFamily: 'Montserrat',
  },
  {
    id: 'home-together',
    name: 'Home & Together',
    category: 'anniversary',
    thumbnail: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop',
    backgroundImage: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&h=800&fit=crop',
    backgroundColor: '#fef7ed',
    frameStyle: 'none',
    frameColor: '#d4a574',
    textColor: '#ffffff',
    accentColor: '#d97706',
    fontFamily: 'Cormorant Garamond',
  },
];

const categories: (CardCategory | 'all')[] = ['all', 'wedding', 'baby', 'prayer', 'memorial', 'graduation', 'anniversary'];

interface TemplateGalleryViewProps {
  onSelectTemplate: (template: Template) => void;
}

export const TemplateGalleryView = ({ onSelectTemplate }: TemplateGalleryViewProps) => {
  const [activeCategory, setActiveCategory] = useState<CardCategory | 'all'>('all');

  const filteredTemplates = activeCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={eternityLogo} alt="Eternity Cards" className="h-12 w-12 rounded-xl object-contain" />
            <div>
              <h1 className="text-xl font-semibold">eternity Cards</h1>
              <p className="text-xs text-muted-foreground">Premium Metal Cards</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="py-12 px-6 text-center bg-gradient-to-b from-accent/30 to-transparent">
        <h2 className="text-3xl md:text-4xl font-display font-semibold mb-3">
          Choose Your Template
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Start with a beautiful design, then customize every detail to make it yours
        </p>
      </section>

      {/* Category filters */}
      <div className="sticky top-[73px] z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-1">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveCategory(cat)}
                  className="whitespace-nowrap rounded-full px-4"
                >
                  {cat === 'all' ? (
                    'All Templates'
                  ) : (
                    <>
                      <span className="mr-1.5">{categoryInfo[cat].icon}</span>
                      {categoryInfo[cat].name}
                    </>
                  )}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Templates grid */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={onSelectTemplate}
            />
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            No templates found in this category
          </div>
        )}
      </main>
    </div>
  );
};

export { templates };
