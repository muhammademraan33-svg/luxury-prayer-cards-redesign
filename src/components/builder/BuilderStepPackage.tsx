import { Check, Package, Truck, Zap } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { CardBuilderState } from '@/pages/CardBuilder';

interface Props {
  state: CardBuilderState;
  updateState: (updates: Partial<CardBuilderState>) => void;
}

interface PackageOption {
  id: string;
  name: string;
  price: number;
  comparePrice: number;
  cards: number;
  photos: number;
  description: string;
  popular?: boolean;
  items: string[];
}

const PACKAGES: PackageOption[] = [
  {
    id: 'good',
    name: 'Essential',
    price: 127,
    comparePrice: 197,
    cards: 55,
    photos: 2,
    description: 'Perfect for intimate gatherings',
    items: ['55 Premium Metal Prayer Cards', '2 Easel Photos (16×20)', '2-Day Express Shipping'],
  },
  {
    id: 'better',
    name: 'Family',
    price: 197,
    comparePrice: 297,
    cards: 110,
    photos: 4,
    description: 'Most popular for services',
    popular: true,
    items: ['110 Premium Metal Prayer Cards', '4 Easel Photos (16×20)', '2-Day Express Shipping'],
  },
  {
    id: 'best',
    name: 'Legacy',
    price: 297,
    comparePrice: 447,
    cards: 165,
    photos: 6,
    description: 'Complete memorial package',
    items: ['165 Premium Metal Prayer Cards', '6 Easel Photos (16×20)', '2-Day Express Shipping'],
  },
];

const EXTRA_SET_PRICE = 79;

const BuilderStepPackage = ({ state, updateState }: Props) => {
  const selectedPkg = PACKAGES.find(p => p.id === state.selectedPackage) || PACKAGES[1];

  const calculatePrice = () => {
    let total = selectedPkg.price;
    total += state.extraSets * EXTRA_SET_PRICE;
    if (state.upgradeThickness) {
      const sets = (selectedPkg.cards / 55) + state.extraSets;
      total += 15 * sets;
    }
    if (state.upgradeToOvernight) {
      total = Math.round(total * 2);
    }
    return total;
  };

  const totalCards = selectedPkg.cards + (state.extraSets * 55);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-600/20 flex items-center justify-center">
          <Package className="w-8 h-8 text-amber-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Choose Your Package
        </h2>
        <p className="text-slate-400">
          All packages include easel photos for the service.
        </p>
      </div>

      {/* Package selection */}
      <div className="grid gap-4">
        {PACKAGES.map((pkg) => (
          <button
            key={pkg.id}
            type="button"
            onClick={() => updateState({ selectedPackage: pkg.id as CardBuilderState['selectedPackage'] })}
            className={`relative p-4 rounded-xl border-2 text-left transition-all ${
              state.selectedPackage === pkg.id
                ? 'border-amber-500 bg-amber-500/10'
                : 'border-slate-600 hover:border-slate-500 bg-slate-700/30'
            }`}
          >
            {pkg.popular && (
              <span className="absolute -top-3 left-4 bg-amber-500 text-xs font-bold text-white px-3 py-1 rounded-full">
                MOST POPULAR
              </span>
            )}
            
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
                <p className="text-sm text-slate-400">{pkg.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">${pkg.price}</div>
                <div className="text-sm text-slate-500 line-through">${pkg.comparePrice}</div>
              </div>
            </div>
            
            <ul className="mt-3 space-y-1">
              {pkg.items.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            {state.selectedPackage === pkg.id && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Add more cards */}
      <div className="p-4 bg-slate-700/30 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium text-white">Need more cards?</p>
            <p className="text-sm text-slate-400">Add 55 more for ${EXTRA_SET_PRICE}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8 border-slate-600"
              onClick={() => updateState({ extraSets: Math.max(0, state.extraSets - 1) })}
              disabled={state.extraSets === 0}
            >
              -
            </Button>
            <span className="w-8 text-center text-white">{state.extraSets}</span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8 border-slate-600"
              onClick={() => updateState({ extraSets: state.extraSets + 1 })}
            >
              +
            </Button>
          </div>
        </div>
        {state.extraSets > 0 && (
          <p className="text-sm text-amber-400 mt-2">
            +{state.extraSets * 55} cards = {totalCards} total
          </p>
        )}
      </div>

      {/* Upgrades */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-amber-400" />
            <div>
              <p className="font-medium text-white">Premium Thickness</p>
              <p className="text-xs text-slate-400">Upgrade to .080" (+$15/set)</p>
            </div>
          </div>
          <Switch
            checked={state.upgradeThickness}
            onCheckedChange={(checked) => updateState({ upgradeThickness: checked })}
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-amber-400" />
            <div>
              <p className="font-medium text-white">Overnight Shipping</p>
              <p className="text-xs text-slate-400">Get it tomorrow (+100%)</p>
            </div>
          </div>
          <Switch
            checked={state.upgradeToOvernight}
            onCheckedChange={(checked) => updateState({ upgradeToOvernight: checked })}
          />
        </div>
      </div>

      {/* Price summary */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold text-white text-lg">Your Total</p>
            <p className="text-sm text-slate-400">
              {totalCards} cards + {selectedPkg.photos} photos
            </p>
          </div>
          <div className="text-3xl font-bold text-amber-400">
            ${calculatePrice()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderStepPackage;
