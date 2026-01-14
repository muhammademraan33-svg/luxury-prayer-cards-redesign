-- Create products table for prayer cards
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  stripe_product_id TEXT,
  stripe_price_id TEXT,
  category TEXT NOT NULL DEFAULT 'prayer_card',
  card_type TEXT NOT NULL DEFAULT 'paper', -- 'paper' or 'metal'
  base_quantity INTEGER NOT NULL DEFAULT 55,
  additional_card_price NUMERIC DEFAULT 0.77,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public can view active products
CREATE POLICY "Anyone can view active products"
ON public.products
FOR SELECT
USING (is_active = true);

-- Only admins can manage products
CREATE POLICY "Admins can manage products"
ON public.products
FOR ALL
USING (is_admin(auth.uid()));

-- Insert the default products
INSERT INTO public.products (name, description, price, stripe_product_id, stripe_price_id, card_type, base_quantity, additional_card_price) VALUES
('Paper Prayer Cards Starter Pack', '55 glossy paper prayer cards + 1 memorial photo', 67.00, 'prod_Tn4751z2vPrQqv', 'price_1SpTzICBz02YzPQdBWYsxF8k', 'paper', 55, 0.77),
('Metal Prayer Cards Starter Pack', '55 premium metal prayer cards with luxurious finish', 97.00, 'prod_Tn478azxjqLkXF', 'price_1SpTzaCBz02YzPQdLAw3vTNI', 'metal', 55, 0.87);

-- Add stripe_session_id and payment_status to orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_intent_id TEXT;

-- Create order_items table for individual items in an order
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL,
  design_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Anyone can insert order items (during checkout)
CREATE POLICY "Anyone can insert order items"
ON public.order_items
FOR INSERT
WITH CHECK (true);

-- Admins can view all order items
CREATE POLICY "Admins can view all order items"
ON public.order_items
FOR SELECT
USING (is_admin(auth.uid()));

-- Create trigger for products updated_at
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();