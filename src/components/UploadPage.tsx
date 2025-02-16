import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    setMessage('');

    for (const file of acceptedFiles) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('photos')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('photos')
          .getPublicUrl(filePath);

        const { error: dbError } = await supabase
          .from('photos')
          .insert([
            {
              name: file.name,
              url: publicUrl,
              user_id: (await supabase.auth.getUser()).data.user?.id
            }
          ]);

        if (dbError) throw dbError;
        setMessage('Upload successful! Waiting for admin approval.');
      } catch (error) {
        console.error('Error uploading file:', error);
        setMessage('Error uploading file. Please try again.');
      }
    }
    setUploading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    disabled: uploading
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`mb-8 p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {uploading
            ? "Uploading..."
            : isDragActive
            ? "Drop the files here..."
            : "Drag 'n' drop photos here, or click to select files"}
        </p>
      </div>
      {message && (
        <div className="text-center text-sm text-indigo-600">{message}</div>
      )}
    </div>
  );
}