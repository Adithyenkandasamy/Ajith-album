/*
  # Create storage bucket for photos

  1. Storage
    - Create a new storage bucket named 'photos' for storing user-uploaded images
  2. Security
    - Enable public access for viewing photos
    - Restrict upload/delete operations to authenticated users
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true);

-- Create a policy to allow public access to view photos
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'photos');

-- Create a policy to allow authenticated users to upload photos
CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'photos');

-- Create a policy to allow authenticated users to delete their own photos
CREATE POLICY "Users can delete own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'photos' AND auth.uid() = owner);