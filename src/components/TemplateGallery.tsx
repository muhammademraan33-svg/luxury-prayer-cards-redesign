import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardCategory, categoryInfo, CardSideData } from '@/types/businessCard';
import { LayoutGrid } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: CardCategory;
  thumbnail: string;
  backgroundColor: string;
  frameStyle: CardSideData['frameStyle'];
  frameColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
}

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

interface TemplateGalleryProps {
  currentCategory: CardCategory;
  onSelectTemplate: (template: Template) => void;
}

export const TemplateGallery = ({ currentCategory, onSelectTemplate }: TemplateGalleryProps) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<CardCategory | 'all'>('all');

  const filteredTemplates = activeTab === 'all' 
    ? templates 
    : templates.filter(t => t.category === activeTab);

  const handleSelect = (template: Template) => {
    onSelectTemplate(template);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2">
          <LayoutGrid className="w-4 h-4" />
          Browse Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-display">Template Gallery</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as CardCategory | 'all')} className="w-full">
          <TabsList className="w-full flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="all" className="text-xs">
              All
            </TabsTrigger>
            {(Object.keys(categoryInfo) as CardCategory[]).map((cat) => (
              <TabsTrigger key={cat} value={cat} className="text-xs gap-1">
                <span>{categoryInfo[cat].icon}</span>
                <span className="hidden sm:inline">{categoryInfo[cat].name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          <ScrollArea className="h-[60vh] mt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-1">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleSelect(template)}
                  className="group relative rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <div className="aspect-[4/3] relative">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                      <p className="text-white font-medium text-sm">{template.name}</p>
                      <p className="text-white/70 text-xs flex items-center gap-1">
                        {categoryInfo[template.category].icon} {categoryInfo[template.category].name}
                      </p>
                    </div>
                  </div>
                  
                  {/* Color preview */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <div 
                      className="w-4 h-4 rounded-full border border-white/50 shadow-sm"
                      style={{ backgroundColor: template.backgroundColor }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border border-white/50 shadow-sm"
                      style={{ backgroundColor: template.accentColor }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export type { Template };
