import { CardCategory, categoryInfo } from '@/types/businessCard';

export interface Template {
  id: string;
  name: string;
  category: CardCategory;
  thumbnail: string;
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
      className="group relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-transparent bg-card transition-all duration-300 hover:border-primary hover:shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/50"
    >
      <img
        src={template.thumbnail}
        alt={template.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
      
      {/* Color preview dots */}
      <div className="absolute top-3 right-3 flex gap-1.5">
        <div 
          className="w-5 h-5 rounded-full border-2 border-white/60 shadow-md"
          style={{ backgroundColor: template.backgroundColor }}
        />
        <div 
          className="w-5 h-5 rounded-full border-2 border-white/60 shadow-md"
          style={{ backgroundColor: template.accentColor }}
        />
      </div>

      {/* Template info */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-white font-semibold text-lg mb-1">{template.name}</p>
        <div className="flex items-center gap-2 text-white/80 text-sm">
          <span>{categoryInfo[template.category].icon}</span>
          <span>{categoryInfo[template.category].name}</span>
        </div>
      </div>

      {/* Hover overlay with CTA */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="px-5 py-2.5 bg-white text-primary font-semibold rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
          Use This Template
        </span>
      </div>
    </button>
  );
};
