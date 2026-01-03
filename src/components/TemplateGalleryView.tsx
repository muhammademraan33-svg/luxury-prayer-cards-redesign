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
    name: 'Classic Elegance',
    category: 'wedding',
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
    backgroundColor: '#fefefe',
    frameStyle: 'ornate',
    frameColor: '#b8860b',
    textColor: '#2c2c2c',
    accentColor: '#b8860b',
    fontFamily: 'Playfair Display',
  },
  {
    id: 'wedding-romantic',
    name: 'Romantic Blush',
    category: 'wedding',
    thumbnail: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=300&fit=crop',
    backgroundColor: '#fff5f5',
    frameStyle: 'double',
    frameColor: '#e8b4b8',
    textColor: '#5c4033',
    accentColor: '#e8b4b8',
    fontFamily: 'Great Vibes',
  },
  {
    id: 'wedding-modern',
    name: 'Modern Minimal',
    category: 'wedding',
    thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop',
    backgroundColor: '#ffffff',
    frameStyle: 'solid',
    frameColor: '#333333',
    textColor: '#1a1a1a',
    accentColor: '#666666',
    fontFamily: 'Montserrat',
  },
  {
    id: 'wedding-garden',
    name: 'Garden Party',
    category: 'wedding',
    thumbnail: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=400&h=300&fit=crop',
    backgroundColor: '#f0f5e9',
    frameStyle: 'corner',
    frameColor: '#6b8e23',
    textColor: '#2d3a1f',
    accentColor: '#6b8e23',
    fontFamily: 'Cormorant Garamond',
  },
  // Baby templates
  {
    id: 'baby-soft-pink',
    name: 'Soft Pink',
    category: 'baby',
    thumbnail: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=300&fit=crop',
    backgroundColor: '#fdf2f8',
    frameStyle: 'double',
    frameColor: '#f9a8d4',
    textColor: '#831843',
    accentColor: '#ec4899',
    fontFamily: 'Dancing Script',
  },
  {
    id: 'baby-sky-blue',
    name: 'Sky Blue',
    category: 'baby',
    thumbnail: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=300&fit=crop',
    backgroundColor: '#f0f9ff',
    frameStyle: 'dotted',
    frameColor: '#7dd3fc',
    textColor: '#0c4a6e',
    accentColor: '#0ea5e9',
    fontFamily: 'Cormorant Garamond',
  },
  {
    id: 'baby-neutral',
    name: 'Warm Neutral',
    category: 'baby',
    thumbnail: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400&h=300&fit=crop',
    backgroundColor: '#fef7ed',
    frameStyle: 'ornate',
    frameColor: '#d4a574',
    textColor: '#78350f',
    accentColor: '#d97706',
    fontFamily: 'Playfair Display',
  },
  // Prayer/Memorial templates
  {
    id: 'prayer-peaceful',
    name: 'Peaceful Light',
    category: 'prayer',
    thumbnail: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400&h=300&fit=crop',
    backgroundColor: '#f8fafc',
    frameStyle: 'gradient',
    frameColor: '#94a3b8',
    textColor: '#334155',
    accentColor: '#64748b',
    fontFamily: 'Cormorant Garamond',
  },
  {
    id: 'prayer-dove',
    name: 'White Dove',
    category: 'prayer',
    thumbnail: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=400&h=300&fit=crop',
    backgroundColor: '#ffffff',
    frameStyle: 'double',
    frameColor: '#d1d5db',
    textColor: '#374151',
    accentColor: '#9ca3af',
    fontFamily: 'Playfair Display',
  },
  // Memorial templates
  {
    id: 'memorial-classic',
    name: 'Classic Memorial',
    category: 'memorial',
    thumbnail: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400&h=300&fit=crop',
    backgroundColor: '#faf8f5',
    frameStyle: 'ornate',
    frameColor: '#8b7355',
    textColor: '#3d3d3d',
    accentColor: '#8b7355',
    fontFamily: 'Cormorant Garamond',
  },
  {
    id: 'memorial-sunset',
    name: 'Sunset Peace',
    category: 'memorial',
    thumbnail: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=400&h=300&fit=crop',
    backgroundColor: '#fef3e2',
    frameStyle: 'gradient',
    frameColor: '#ea580c',
    textColor: '#7c2d12',
    accentColor: '#f97316',
    fontFamily: 'Playfair Display',
  },
  // Graduation templates
  {
    id: 'graduation-bold',
    name: 'Bold Achievement',
    category: 'graduation',
    thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
    backgroundColor: '#1a1a2e',
    frameStyle: 'gradient',
    frameColor: '#c9a227',
    textColor: '#ffffff',
    accentColor: '#c9a227',
    fontFamily: 'Montserrat',
  },
  {
    id: 'graduation-classic',
    name: 'Classic Scholar',
    category: 'graduation',
    thumbnail: 'https://images.unsplash.com/photo-1627556704302-624286467c65?w=400&h=300&fit=crop',
    backgroundColor: '#1e3a5f',
    frameStyle: 'double',
    frameColor: '#fbbf24',
    textColor: '#ffffff',
    accentColor: '#fbbf24',
    fontFamily: 'Playfair Display',
  },
  // Anniversary templates
  {
    id: 'anniversary-silver',
    name: 'Silver Anniversary',
    category: 'anniversary',
    thumbnail: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&h=300&fit=crop',
    backgroundColor: '#f8f8f8',
    frameStyle: 'ornate',
    frameColor: '#c0c0c0',
    textColor: '#2c2c2c',
    accentColor: '#c0c0c0',
    fontFamily: 'Great Vibes',
  },
  {
    id: 'anniversary-gold',
    name: 'Golden Years',
    category: 'anniversary',
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=300&fit=crop',
    backgroundColor: '#fffbeb',
    frameStyle: 'gradient',
    frameColor: '#d4af37',
    textColor: '#78350f',
    accentColor: '#d4af37',
    fontFamily: 'Playfair Display',
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
