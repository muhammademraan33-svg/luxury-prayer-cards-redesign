import { Card } from '@/components/ui/card';
import { Check, Sparkles, Image, Camera } from 'lucide-react';
import type { CardBuilderState } from '@/pages/CardBuilder';

interface Props {
  state: CardBuilderState;
  updateState: (updates: Partial<CardBuilderState>) => void;
}

type ProductType = 'metal' | 'paper' | 'photos';

interface ProductOption {
  id: ProductType;
  name: string;
  description: string;
  icon: React.ReactNode;
  highlight?: string;
  popular?: boolean;
}

const PRODUCT_OPTIONS: ProductOption[] = [
  {
    id: 'metal',
    name: 'Metal Prayer Cards',
    description: 'Premium engraved metal cards with a luxurious finish. A beautiful keepsake that lasts forever.',
    icon: <Sparkles className="w-8 h-8" />,
    highlight: 'Most Popular',
    popular: true,
  },
  {
    id: 'paper',
    name: 'Photo Prayer Cards',
    description: 'Traditional prayer cards printed on premium cardstock. Perfect for services and sharing.',
    icon: <Image className="w-8 h-8" />,
  },
  {
    id: 'photos',
    name: 'Celebration Photos',
    description: 'Large format memorial photos for display at services and in the home.',
    icon: <Camera className="w-8 h-8" />,
  },
];

const BuilderStepProduct = ({ state, updateState }: Props) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          What would you like to create?
        </h2>
        <p className="text-muted-foreground">
          Choose the memorial product for {state.deceasedName || 'your loved one'}
        </p>
      </div>

      <div className="grid gap-4">
        {PRODUCT_OPTIONS.map((product) => {
          const isSelected = state.productType === product.id;
          
          return (
            <Card
              key={product.id}
              onClick={() => updateState({ productType: product.id })}
              className={`relative p-5 cursor-pointer transition-all border-2 ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-accent/50'
              }`}
            >
              {product.popular && (
                <div className="absolute -top-3 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                  {product.highlight}
                </div>
              )}
              
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {product.icon}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {product.description}
                  </p>
                </div>
                
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected
                    ? 'border-primary bg-primary'
                    : 'border-muted-foreground/30'
                }`}>
                  {isSelected && <Check className="w-4 h-4 text-primary-foreground" />}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default BuilderStepProduct;
