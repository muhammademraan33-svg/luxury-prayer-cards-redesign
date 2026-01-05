-- Drop the overly permissive public SELECT policy that exposes all memorial orders
DROP POLICY IF EXISTS "Anyone can view memorial by qr_code" ON public.memorial_orders;