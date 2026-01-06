import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RectangleHorizontal, RectangleVertical, Check } from 'lucide-react';
import type { CardBuilderState } from '@/pages/CardBuilder';

interface Props {
  state: CardBuilderState;
  updateState: (updates: Partial<CardBuilderState>) => void;
}

const METAL_FINISHES: Array<{ id: string; name: string; gradient: string; popular?: boolean }> = [
  { id: 'white', name: 'Pearl White', gradient: 'from-gray-100 via-white to-gray-200', popular: true },
  { id: 'silver', name: 'Brushed Silver', gradient: 'from-zinc-400 via-zinc-300 to-zinc-500' },
  { id: 'gold', name: 'Polished Gold', gradient: 'from-yellow-600 via-yellow-500 to-yellow-700' },
  { id: 'black', name: 'Matte Black', gradient: 'from-zinc-800 via-zinc-700 to-zinc-900' },
  { id: 'marble', name: 'Silver Marble', gradient: 'from-gray-300 via-slate-100 to-gray-400' },
];

const BuilderStepFinish = ({ state, updateState }: Props) => {
  const selectedFinish = METAL_FINISHES.find(f => f.id === state.metalFinish) || METAL_FINISHES[0];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Choose Your Finish
        </h2>
        <p className="text-slate-400">
          Select the perfect metal finish for your prayer card.
        </p>
      </div>

      {/* Card Preview with selected finish */}
      <div className="flex justify-center">
        <div 
          className={`${
            state.orientation === 'landscape' ? 'aspect-[3.5/2] w-64' : 'aspect-[2/3.5] w-44'
          } rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br ${selectedFinish.gradient} p-1 transition-all duration-300`}
        >
          <div className="w-full h-full rounded-lg bg-slate-700 overflow-hidden relative">
            {state.photo ? (
              <img
                src={state.photo}
                alt="Preview"
                className="w-full h-full object-cover"
                style={{
                  transform: `scale(${state.photoZoom})`,
                }}
              />
            ) : (
              <div className="w-full h-full bg-slate-600" />
            )}
            {state.deceasedName && (
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p 
                  className="text-white font-bold text-sm drop-shadow-lg"
                  style={{ 
                    fontFamily: 'Great Vibes, cursive',
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  }}
                >
                  {state.deceasedName}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Orientation */}
      <div className="space-y-2">
        <Label className="text-slate-400 text-sm">Orientation</Label>
        <div className="flex justify-center gap-3">
          <Button
            type="button"
            variant={state.orientation === 'portrait' ? 'default' : 'outline'}
            onClick={() => updateState({ orientation: 'portrait' })}
            className={state.orientation === 'portrait' 
              ? 'bg-amber-600 hover:bg-amber-700' 
              : 'border-slate-600 text-slate-300 hover:bg-slate-700'}
          >
            <RectangleVertical className="h-4 w-4 mr-2" />
            Portrait
          </Button>
          <Button
            type="button"
            variant={state.orientation === 'landscape' ? 'default' : 'outline'}
            onClick={() => updateState({ orientation: 'landscape' })}
            className={state.orientation === 'landscape' 
              ? 'bg-amber-600 hover:bg-amber-700' 
              : 'border-slate-600 text-slate-300 hover:bg-slate-700'}
          >
            <RectangleHorizontal className="h-4 w-4 mr-2" />
            Landscape
          </Button>
        </div>
      </div>

      {/* Metal Finishes */}
      <div className="space-y-3">
        <Label className="text-slate-400 text-sm">Metal Finish</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {METAL_FINISHES.map((finish) => (
            <button
              key={finish.id}
              type="button"
              onClick={() => updateState({ metalFinish: finish.id as CardBuilderState['metalFinish'] })}
              className={`relative p-3 rounded-lg border-2 transition-all ${
                state.metalFinish === finish.id
                  ? 'border-amber-500 ring-2 ring-amber-500/20'
                  : 'border-slate-600 hover:border-slate-500'
              }`}
            >
              <div className={`w-full h-10 rounded-md bg-gradient-to-br ${finish.gradient} mb-2`} />
              <p className="text-sm text-white font-medium">{finish.name}</p>
              {finish.popular && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-xs text-white px-2 py-0.5 rounded-full">
                  Popular
                </span>
              )}
              {state.metalFinish === finish.id && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="text-center pt-4 border-t border-slate-700">
        <p className="text-sm text-slate-500">
          All finishes are printed on premium .040" aluminum with a protective coating.
        </p>
      </div>
    </div>
  );
};

export default BuilderStepFinish;
