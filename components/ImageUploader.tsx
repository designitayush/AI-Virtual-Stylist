import React, { useState, useRef } from 'react';

interface ImageUploaderProps {
  id: string;
  title: string;
  tip: string;
  onImageUpload: (base64: string | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ id, title, tip, onImageUpload }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setImagePreview(reader.result as string);
        onImageUpload(base64String);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      onImageUpload(null);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImagePreview(null);
    onImageUpload(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click();
  }

  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-brand-light mb-2">{title}</label>
      <div
        onClick={handleClick}
        className="group aspect-square w-full border-2 border-dashed border-brand-border rounded-lg flex flex-col justify-center items-center text-center p-4 cursor-pointer hover:border-brand-action transition-all duration-300 relative bg-white/5 hover:shadow-[0_0_15px_rgba(129,140,248,0.4)]"
      >
        <input
          id={id}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
        />
        {imagePreview ? (
          <>
            <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
            <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-gray-900/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </>
        ) : (
          <div className="text-brand-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-sm">Click to upload</p>
            <p className="text-xs text-gray-500 mt-1">{tip}</p>
          </div>
        )}
      </div>
    </div>
  );
};