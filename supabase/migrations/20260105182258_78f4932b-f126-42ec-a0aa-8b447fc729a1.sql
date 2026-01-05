-- Create orders table for the public order flow
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  
  -- Customer info
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  
  -- Shipping address
  shipping_address text NOT NULL,
  shipping_city text NOT NULL,
  shipping_state text NOT NULL,
  shipping_zip text NOT NULL,
  
  -- Order details
  package_name text NOT NULL,
  total_cards integer NOT NULL,
  total_photos integer NOT NULL,
  total_price numeric NOT NULL,
  shipping_type text NOT NULL DEFAULT 'express',
  
  -- Design images (URLs from storage)
  front_design_url text,
  back_design_url text,
  
  -- Tracking
  tracking_number text,
  tracking_carrier text,
  tracking_sent_at timestamp with time zone,
  
  -- Status
  status text NOT NULL DEFAULT 'pending'
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Admin role for managing orders
CREATE TYPE public.admin_role AS ENUM ('admin');

CREATE TABLE public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  role admin_role NOT NULL DEFAULT 'admin',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = _user_id
  )
$$;

-- RLS policies for orders - only admins can access
CREATE POLICY "Admins can view all orders"
ON public.orders
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can insert orders"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- RLS for admin_users
CREATE POLICY "Admins can view admin users"
ON public.admin_users
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Trigger to update updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for order designs
INSERT INTO storage.buckets (id, name, public) VALUES ('order-designs', 'order-designs', false);

-- Storage policies for order-designs bucket
CREATE POLICY "Anyone can upload order designs"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'order-designs');

CREATE POLICY "Admins can view order designs"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'order-designs' AND public.is_admin(auth.uid()));