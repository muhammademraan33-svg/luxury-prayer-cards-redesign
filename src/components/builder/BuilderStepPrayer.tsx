import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Book, Pen } from 'lucide-react';
import { prayerTemplates } from '@/data/prayerTemplates';
import type { CardBuilderState } from '@/pages/CardBuilder';

interface Props {
  state: CardBuilderState;
  updateState: (updates: Partial<CardBuilderState>) => void;
}

// Popular prayers for quick selection
const POPULAR_PRAYERS = [
  { id: 'psalm23', name: 'Psalm 23', preview: 'The Lord is my shepherd...' },
  { id: 'lordsPrayer', name: "The Lord's Prayer", preview: 'Our Father, who art in heaven...' },
  { id: 'hailMary', name: 'Hail Mary', preview: 'Hail Mary, full of grace...' },
  { id: 'serenity', name: 'Serenity Prayer', preview: 'God grant me the serenity...' },
  { id: 'custom', name: 'Custom Text', preview: 'Write your own message' },
];

const BuilderStepPrayer = ({ state, updateState }: Props) => {
  const handlePrayerSelect = (prayerId: string) => {
    updateState({ selectedPrayerId: prayerId });
    
    if (prayerId !== 'custom') {
      const prayer = prayerTemplates.find(p => p.id === prayerId);
      if (prayer) {
        updateState({ prayerText: prayer.text });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-600/20 flex items-center justify-center">
          <Book className="w-8 h-8 text-amber-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Choose a Prayer or Message
        </h2>
        <p className="text-slate-400">
          Select from popular prayers or write your own heartfelt message.
        </p>
      </div>

      {/* Prayer selection */}
      <RadioGroup
        value={state.selectedPrayerId}
        onValueChange={handlePrayerSelect}
        className="space-y-3"
      >
        {POPULAR_PRAYERS.map((prayer) => (
          <div
            key={prayer.id}
            className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
              state.selectedPrayerId === prayer.id
                ? 'border-amber-500 bg-amber-500/10'
                : 'border-slate-600 hover:border-slate-500 bg-slate-700/30'
            }`}
            onClick={() => handlePrayerSelect(prayer.id)}
          >
            <RadioGroupItem value={prayer.id} id={prayer.id} className="mt-1" />
            <label htmlFor={prayer.id} className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2 mb-1">
                {prayer.id === 'custom' ? (
                  <Pen className="w-4 h-4 text-amber-400" />
                ) : (
                  <Book className="w-4 h-4 text-slate-400" />
                )}
                <span className="font-medium text-white">{prayer.name}</span>
              </div>
              <p className="text-sm text-slate-400">{prayer.preview}</p>
            </label>
          </div>
        ))}
      </RadioGroup>

      {/* Text preview/edit */}
      <div className="space-y-2">
        <Label className="text-slate-400 text-sm">
          {state.selectedPrayerId === 'custom' ? 'Your Message' : 'Preview (you can edit)'}
        </Label>
        <Textarea
          value={state.prayerText}
          onChange={(e) => updateState({ prayerText: e.target.value, selectedPrayerId: 'custom' })}
          placeholder="Enter your message here..."
          className="bg-slate-700 border-slate-600 text-white min-h-[120px] resize-none"
        />
      </div>

      <div className="text-center pt-4 border-t border-slate-700">
        <p className="text-sm text-slate-500">
          This will appear on the back of the card with a QR code linking to the memorial page.
        </p>
      </div>
    </div>
  );
};

export default BuilderStepPrayer;
