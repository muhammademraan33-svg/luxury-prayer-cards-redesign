-- Create storage bucket for card backgrounds
INSERT INTO storage.buckets (id, name, public) VALUES ('card-backgrounds', 'card-backgrounds', true);

-- Allow anyone to view backgrounds (public bucket)
CREATE POLICY "Anyone can view card backgrounds"
ON storage.objects FOR SELECT
USING (bucket_id = 'card-backgrounds');

-- Authenticated users can upload backgrounds
CREATE POLICY "Authenticated users can upload backgrounds"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'card-backgrounds' AND auth.role() = 'authenticated');

-- Users can delete their own uploads
CREATE POLICY "Users can delete own backgrounds"
ON storage.objects FOR DELETE
USING (bucket_id = 'card-backgrounds' AND auth.uid()::text = (storage.foldername(name))[1]);