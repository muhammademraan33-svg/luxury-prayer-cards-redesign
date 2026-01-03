-- Create funeral_homes table for funeral home profiles
CREATE TABLE public.funeral_homes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  logo_url TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create memorial_orders table for prayer card orders
CREATE TABLE public.memorial_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  funeral_home_id UUID NOT NULL REFERENCES public.funeral_homes(id) ON DELETE CASCADE,
  deceased_name TEXT NOT NULL,
  birth_date DATE,
  death_date DATE,
  photo_url TEXT,
  qr_code TEXT NOT NULL UNIQUE,
  quantity INTEGER NOT NULL DEFAULT 50,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create memorial_messages table for visitor messages
CREATE TABLE public.memorial_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  memorial_id UUID NOT NULL REFERENCES public.memorial_orders(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  message TEXT,
  video_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.funeral_homes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memorial_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memorial_messages ENABLE ROW LEVEL SECURITY;

-- Funeral homes policies (only owner can manage their profile)
CREATE POLICY "Funeral homes can view own profile"
  ON public.funeral_homes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Funeral homes can insert own profile"
  ON public.funeral_homes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Funeral homes can update own profile"
  ON public.funeral_homes FOR UPDATE
  USING (auth.uid() = user_id);

-- Memorial orders policies (funeral homes manage their orders)
CREATE POLICY "Funeral homes can view own orders"
  ON public.memorial_orders FOR SELECT
  USING (funeral_home_id IN (SELECT id FROM public.funeral_homes WHERE user_id = auth.uid()));

CREATE POLICY "Funeral homes can insert own orders"
  ON public.memorial_orders FOR INSERT
  WITH CHECK (funeral_home_id IN (SELECT id FROM public.funeral_homes WHERE user_id = auth.uid()));

CREATE POLICY "Funeral homes can update own orders"
  ON public.memorial_orders FOR UPDATE
  USING (funeral_home_id IN (SELECT id FROM public.funeral_homes WHERE user_id = auth.uid()));

CREATE POLICY "Funeral homes can delete own orders"
  ON public.memorial_orders FOR DELETE
  USING (funeral_home_id IN (SELECT id FROM public.funeral_homes WHERE user_id = auth.uid()));

-- Public can view memorial orders by QR code (for the memorial page)
CREATE POLICY "Anyone can view memorial by qr_code"
  ON public.memorial_orders FOR SELECT
  USING (true);

-- Memorial messages policies (anyone can add, funeral home can manage)
CREATE POLICY "Anyone can view messages"
  ON public.memorial_messages FOR SELECT
  USING (true);

CREATE POLICY "Anyone can add messages"
  ON public.memorial_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Funeral homes can delete messages on their memorials"
  ON public.memorial_messages FOR DELETE
  USING (memorial_id IN (
    SELECT mo.id FROM public.memorial_orders mo
    JOIN public.funeral_homes fh ON mo.funeral_home_id = fh.id
    WHERE fh.user_id = auth.uid()
  ));

-- Trigger for auto-creating funeral home profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_funeral_home()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.funeral_homes (user_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'funeral_home_name', 'My Funeral Home'));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_funeral_home
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_funeral_home();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_funeral_homes_updated_at
  BEFORE UPDATE ON public.funeral_homes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_memorial_orders_updated_at
  BEFORE UPDATE ON public.memorial_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();