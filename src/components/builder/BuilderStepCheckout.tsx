import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, MapPin, Package } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { CardBuilderState } from '@/pages/CardBuilder';

interface Props {
  state: CardBuilderState;
  updateState: (updates: Partial<CardBuilderState>) => void;
  onComplete: () => void;
}

const PACKAGES = {
  good: { name: 'Essential', price: 127, cards: 55, photos: 2 },
  better: { name: 'Family', price: 197, cards: 110, photos: 4 },
  best: { name: 'Legacy', price: 297, cards: 165, photos: 6 },
};

const BuilderStepCheckout = ({ state, updateState, onComplete }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pkg = PACKAGES[state.selectedPackage];
  const totalCards = pkg.cards + (state.extraSets * 55);
  const extraPhotos = Math.max(0, state.celebrationPhotos.length - pkg.photos);
  
  const calculateTotal = () => {
    let total = pkg.price;
    total += state.extraSets * 79;
    total += extraPhotos * 19;
    if (state.photoSize === '18x24') {
      total += 5 * Math.max(pkg.photos, state.celebrationPhotos.length);
    }
    if (state.upgradeThickness) {
      total += 15 * ((pkg.cards / 55) + state.extraSets);
    }
    if (state.upgradeToOvernight) {
      total = Math.round(total * 2);
    }
    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.customerName || !state.customerEmail || !state.shippingStreet || 
        !state.shippingCity || !state.shippingState || !state.shippingZip) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-order-emails', {
        body: {
          customerEmail: state.customerEmail,
          customerName: state.customerName,
          shippingAddress: {
            street: state.shippingStreet,
            city: state.shippingCity,
            state: state.shippingState,
            zip: state.shippingZip,
            phone: state.customerPhone,
          },
          orderDetails: {
            deceasedName: state.deceasedName,
            birthDate: state.birthDate,
            deathDate: state.deathDate,
            metalFinish: state.metalFinish,
            orientation: state.orientation,
            totalCards,
            easelPhotoCount: Math.max(pkg.photos, state.celebrationPhotos.length),
            easelPhotoSize: state.photoSize,
            cardThickness: state.upgradeThickness ? 'premium' : 'standard',
            shipping: state.upgradeToOvernight ? 'overnight' : 'express',
            totalPrice: calculateTotal(),
            packageName: pkg.name,
            extraSets: state.extraSets,
            prayerText: state.prayerText,
            qrUrl: state.qrUrl,
          },
          frontCardImage: state.photo || '',
          backCardImage: '',
          easelPhotos: state.celebrationPhotos,
        },
      });

      if (error) throw error;

      toast.success('Order placed successfully!');
      onComplete();
    } catch (error) {
      console.error('Order error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Complete Your Order
        </h2>
        <p className="text-slate-400">
          Enter your shipping information to complete your order.
        </p>
      </div>

      {/* Order Summary */}
      <div className="p-4 bg-slate-700/30 rounded-lg space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-5 h-5 text-amber-400" />
          <span className="font-medium text-white">Order Summary</span>
        </div>
        <div className="text-sm space-y-1 text-slate-300">
          <div className="flex justify-between">
            <span>{pkg.name} Package ({totalCards} cards)</span>
            <span>${pkg.price + (state.extraSets * 79)}</span>
          </div>
          <div className="flex justify-between">
            <span>{Math.max(pkg.photos, state.celebrationPhotos.length)} Easel Photos ({state.photoSize})</span>
            <span>{extraPhotos > 0 || state.photoSize === '18x24' ? `+$${(extraPhotos * 19) + (state.photoSize === '18x24' ? 5 * Math.max(pkg.photos, state.celebrationPhotos.length) : 0)}` : 'Included'}</span>
          </div>
          {state.upgradeThickness && (
            <div className="flex justify-between">
              <span>Premium Thickness</span>
              <span>+${15 * ((pkg.cards / 55) + state.extraSets)}</span>
            </div>
          )}
          {state.upgradeToOvernight && (
            <div className="flex justify-between">
              <span>Overnight Shipping</span>
              <span>+100%</span>
            </div>
          )}
        </div>
        <div className="flex justify-between pt-2 border-t border-slate-600 font-bold text-lg">
          <span className="text-white">Total</span>
          <span className="text-amber-400">${calculateTotal()}</span>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-amber-400" />
          <span className="font-medium text-white">Contact Information</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-400">Full Name *</Label>
            <Input
              id="name"
              value={state.customerName}
              onChange={(e) => updateState({ customerName: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-400">Email *</Label>
            <Input
              id="email"
              type="email"
              value={state.customerEmail}
              onChange={(e) => updateState({ customerEmail: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-slate-400">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={state.customerPhone}
            onChange={(e) => updateState({ customerPhone: e.target.value })}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
      </div>

      {/* Shipping */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-amber-400" />
          <span className="font-medium text-white">Shipping Address</span>
        </div>
        <div className="space-y-2">
          <Label htmlFor="street" className="text-slate-400">Street Address *</Label>
          <Input
            id="street"
            value={state.shippingStreet}
            onChange={(e) => updateState({ shippingStreet: e.target.value })}
            className="bg-slate-700 border-slate-600 text-white"
            required
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city" className="text-slate-400">City *</Label>
            <Input
              id="city"
              value={state.shippingCity}
              onChange={(e) => updateState({ shippingCity: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state" className="text-slate-400">State *</Label>
            <Input
              id="state"
              value={state.shippingState}
              onChange={(e) => updateState({ shippingState: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white"
              required
            />
          </div>
          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label htmlFor="zip" className="text-slate-400">ZIP *</Label>
            <Input
              id="zip"
              value={state.shippingZip}
              onChange={(e) => updateState({ shippingZip: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white"
              required
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 bg-amber-600 hover:bg-amber-700 text-white text-lg font-bold"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            Place Order - ${calculateTotal()}
          </>
        )}
      </Button>

      <p className="text-xs text-center text-slate-500">
        By placing your order, you agree to our terms of service and privacy policy.
      </p>
    </form>
  );
};

export default BuilderStepCheckout;
