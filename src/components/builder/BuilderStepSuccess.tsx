import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Heart, Home } from 'lucide-react';
import type { CardBuilderState } from '@/pages/CardBuilder';

interface Props {
  state: CardBuilderState;
}

const BuilderStepSuccess = ({ state }: Props) => {
  return (
    <div className="text-center py-8 space-y-6">
      <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
        <CheckCircle className="w-10 h-10 text-green-400" />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Order Confirmed!
        </h2>
        <p className="text-slate-400">
          Thank you for honoring {state.deceasedName || 'your loved one'}.
        </p>
      </div>

      <div className="max-w-md mx-auto p-6 bg-slate-700/30 rounded-xl">
        <Heart className="w-8 h-8 text-amber-400 mx-auto mb-4" />
        <p className="text-slate-300">
          We've sent a confirmation email to <strong className="text-white">{state.customerEmail}</strong> with your order details.
        </p>
        <p className="text-sm text-slate-400 mt-3">
          Your beautiful memorial cards are being crafted with care and will arrive within 2-3 business days.
        </p>
      </div>

      <div className="pt-4">
        <Link to="/">
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
            <Home className="w-4 h-4 mr-2" />
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BuilderStepSuccess;
