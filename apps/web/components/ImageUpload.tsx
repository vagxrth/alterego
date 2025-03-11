'use client'

import React, { useState, useRef } from 'react';
import { Cloud, X } from 'lucide-react';
import Image from 'next/image';

interface ImageUploaderProps {
  onImageUpload?: (file: File) => void;
}

export function ImageUpload({ onImageUpload }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onImageUpload?.(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          className="hidden"
        />
        
        {preview ? (
          <div className="relative">
            <Image
              src={preview}
              alt="Preview"
              width={500}
              height={300}
              unoptimized={preview.startsWith('data:')}
              className="w-full h-64 object-contain rounded-lg"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center space-y-4 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="p-4 bg-gray-50 rounded-full">
              <Cloud className="w-10 h-10 text-gray-400" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700">
                Drag an image
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Select a image or drag here to upload directly
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}