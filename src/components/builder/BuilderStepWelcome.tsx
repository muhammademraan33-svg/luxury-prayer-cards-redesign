import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart } from 'lucide-react';
import type { CardBuilderState } from '@/pages/CardBuilder';

interface Props {
  state: CardBuilderState;
  updateState: (updates: Partial<CardBuilderState>) => void;
}

const BuilderStepWelcome = ({ state, updateState }: Props) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-600/20 flex items-center justify-center">
          <Heart className="w-8 h-8 text-amber-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Let's Create Something Beautiful
        </h2>
        <p className="text-slate-400">
          Honor your loved one with a premium metal prayer card that will be treasured forever.
        </p>
      </div>

      <div className="space-y-4 max-w-sm mx-auto">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">
            Who are you honoring? <span className="text-amber-400">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Enter their name"
            value={state.deceasedName}
            onChange={(e) => updateState({ deceasedName: e.target.value })}
            className="bg-slate-700 border-slate-600 text-white text-center text-lg h-12"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="birth" className="text-slate-400 text-sm">
              Date of Birth
            </Label>
            <Input
              id="birth"
              type="date"
              value={state.birthDate}
              onChange={(e) => updateState({ birthDate: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="death" className="text-slate-400 text-sm">
              Date of Passing
            </Label>
            <Input
              id="death"
              type="date"
              value={state.deathDate}
              onChange={(e) => updateState({ deathDate: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
        </div>
      </div>

      <div className="text-center pt-4 border-t border-slate-700">
        <p className="text-sm text-slate-500">
          Your card will include their name and dates beautifully displayed on premium metal.
        </p>
      </div>
    </div>
  );
};

export default BuilderStepWelcome;
