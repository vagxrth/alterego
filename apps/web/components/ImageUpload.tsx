'use client'

import React, { useState, useRef } from 'react';
import { Cloud, X, Plus } from 'lucide-react';
import Image from 'next/image';

interface ImageUploaderProps {
  onImagesUpload?: (files: File[]) => void;
  maxImages?: number;
}

export function ImageUpload({ onImagesUpload, maxImages = 10 }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
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
    
    const newFiles = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/') && previews.length < maxImages
    );
    
    if (newFiles.length > 0) {
      handleImagesUpload(newFiles);
    }
  };

  const handleImagesUpload = (newFiles: File[]) => {
    const updatedFiles = [...files, ...newFiles].slice(0, maxImages);
    setFiles(updatedFiles);
    
    // Create previews for new files
    const newPreviews: Promise<string>[] = newFiles.map(file => 
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      })
    );
    
    Promise.all(newPreviews).then(results => {
      const allPreviews = [...previews, ...results].slice(0, maxImages);
      setPreviews(allPreviews);
      onImagesUpload?.(updatedFiles);
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).filter(() => 
        previews.length < maxImages
      );
      handleImagesUpload(newFiles);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedPreviews = [...previews];
    const updatedFiles = [...files];
    updatedPreviews.splice(index, 1);
    updatedFiles.splice(index, 1);
    setPreviews(updatedPreviews);
    setFiles(updatedFiles);
    onImagesUpload?.(updatedFiles);
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${
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
          multiple
          className="hidden"
        />
        
        {previews.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {previews.map((preview, index) => (
              <div key={index} className="relative">
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  width={200}
                  height={150}
                  unoptimized={preview.startsWith('data:')}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            ))}
            
            {previews.length < maxImages && (
              <div
                className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                onClick={() => fileInputRef.current?.click()}
              >
                <Plus className="w-8 h-8 text-gray-400" />
                <span className="text-xs text-gray-500 mt-1">Add more</span>
              </div>
            )}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center py-4 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="p-3 bg-gray-50 rounded-full">
              <Cloud className="w-8 h-8 text-gray-400" />
            </div>
            <div className="text-center mt-2">
              <h3 className="text-sm font-semibold text-gray-700">
                Drag images
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Select images or drag here to upload directly
              </p>
            </div>
          </div>
        )}
      </div>
      {previews.length > 0 && (
        <p className="text-xs text-gray-500 mt-1 text-right">
          {previews.length} of {maxImages} images
        </p>
      )}
    </div>
  );
}