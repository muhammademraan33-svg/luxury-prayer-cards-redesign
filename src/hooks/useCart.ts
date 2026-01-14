import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  cardType: 'paper' | 'metal';
  imagePreview?: string;
  designData?: any;
}

const CART_STORAGE_KEY = 'prayerCardsCart';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart:', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((item: Omit<CartItem, 'id'>) => {
    const newItem: CartItem = {
      ...item,
      id: `${item.cardType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setCart(prev => [...prev, newItem]);
    toast.success(`Added ${item.name} to cart`);
    return newItem.id;
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
    toast.success('Item removed from cart');
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const checkout = useCallback(async (customerEmail?: string, shippingInfo?: any) => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return null;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          items: cart.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            cardType: item.cardType,
            designData: item.designData,
          })),
          customerEmail,
          shippingInfo,
        },
      });

      if (error) throw error;

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
        return data.sessionId;
      }

      throw new Error('No checkout URL returned');
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to start checkout');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [cart]);

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartItemCount,
    checkout,
    isLoading,
  };
};
