import { CardCategory, categoryInfo } from '@/types/businessCard';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface CategorySelectorProps {
  value: CardCategory;
  onChange: (category: CardCategory) => void;
}

export const CategorySelector = ({ value, onChange }: CategorySelectorProps) => {
  const categories = Object.entries(categoryInfo) as [CardCategory, typeof categoryInfo[CardCategory]][];

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Card Type</Label>
      <div className="grid grid-cols-2 gap-2">
        {categories.map(([key, info]) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={cn(
              'category-card text-left',
              value === key && 'active'
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{info.icon}</span>
              <div>
                <p className="font-medium text-sm">{info.name}</p>
                <p className="text-xs text-muted-foreground">{info.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
