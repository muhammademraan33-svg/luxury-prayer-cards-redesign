import { CardCategory, categoryInfo } from '@/types/businessCard';

export interface Template {
  id: string;
  name: string;
  category: CardCategory;
  thumbnail: string;
  backgroundImage: string; // Full-size image for the actual card
  backgroundColor: string;
  frameStyle: 'none' | 'solid' | 'double' | 'gradient' | 'ornate' | 'dashed' | 'dotted' | 'inset' | 'shadow' | 'corner';
  frameColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
}

interface TemplateCardProps {
  template: Template;
  onSelect: (template: Template) => void;
}

export const TemplateCard = ({ template, onSelect }: TemplateCardProps) => {
  return (
    <button
      onClick={() => onSelect(template)}
      className="group relative aspect-[3/2] rounded-lg overflow-hidden bg-card shadow-md transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/50"
    >
      {/* Full photo background */}
      <img
        src={template.thumbnail}
        alt={template.name}
        className="w-full h-full object-cover"
      />
      
      {/* Subtle gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Template info - bottom positioned like reference */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
        <h3 
          className="text-white text-xl font-bold tracking-wide drop-shadow-lg"
          style={{ fontFamily: template.fontFamily }}
        >
          {template.name}
        </h3>
        <p className="text-white/90 text-sm mt-1 drop-shadow">
          {categoryInfo[template.category].name}
        </p>
      </div>

      {/* Hover state - simple darken with CTA */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <span className="px-6 py-2 bg-white text-foreground font-medium rounded shadow-lg">
          Customize
        </span>
      </div>
    </button>
  );
};
