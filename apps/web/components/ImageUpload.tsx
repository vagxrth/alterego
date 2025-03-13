'use client'

import React, { useState, useRef } from 'react';
import { Cloud, X, Plus, Upload } from 'lucide-react';
import Image from 'next/image';
import JSZip from 'jszip';
import axios from 'axios';
import { BACKEND_URL } from '../app/config';

interface ImageUploaderProps {
  onImagesUpload?: (files: File[]) => void;
  maxImages?: number;
  onZipUploaded?: (zipUrl: string, zipKey: string) => void;
}

export function ImageUpload({ onImagesUpload, maxImages = 10, onZipUploaded }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
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

  const zipAndUploadImages = async () => {
    if (files.length === 0) return;
    
    try {
      setIsUploading(true);
      setUploadProgress(10);
      
      // Step 1: Create a zip file containing all images
      const zip = new JSZip();
      
      // Add each file to the zip
      files.forEach((file, index) => {
        zip.file(`image_${index + 1}.${file.name.split('.').pop()}`, file);
      });
      
      // Generate the zip file
      setUploadProgress(30);
      const zipBlob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      }, (metadata) => {
        // Update progress during zip creation
        setUploadProgress(30 + Math.floor(metadata.percent * 0.3));
      });
      
      // Step 2: Get a presigned URL from the backend
      setUploadProgress(60);
      console.log('Requesting presigned URL from:', `${BACKEND_URL}/pre-signed-url`);
      
      // Add a timestamp to prevent caching issues
      const presignedResponse = await axios.get(`${BACKEND_URL}/pre-signed-url?t=${Date.now()}`);
      console.log('Presigned URL response:', presignedResponse.data);
      const { url: presignedUrl, key } = presignedResponse.data;
      
      if (!presignedUrl) {
        throw new Error('No presigned URL received from server');
      }
      
      // Step 3: Upload the zip file to the presigned URL
      setUploadProgress(70);
      console.log('Uploading to presigned URL:', presignedUrl);
      
      try {
        // Use XMLHttpRequest instead of fetch for better compatibility with S3
        const xhr = new XMLHttpRequest();
        
        // Create a promise to handle the XHR request
        const uploadPromise = new Promise<void>((resolve, reject) => {
          xhr.open('PUT', presignedUrl, true);
          xhr.setRequestHeader('Content-Type', 'application/zip');
          
          // Set up progress tracking
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const percentComplete = Math.round((e.loaded / e.total) * 30);
              setUploadProgress(70 + percentComplete);
            }
          };
          
          // Set up completion handlers
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(new Error(`Upload failed with status: ${xhr.status} - ${xhr.responseText}`));
            }
          };
          
          xhr.onerror = () => {
            reject(new Error('Network error occurred during upload'));
          };
          
          xhr.onabort = () => {
            reject(new Error('Upload aborted'));
          };
          
          // Send the zip blob
          xhr.send(zipBlob);
        });
        
        // Wait for the upload to complete
        await uploadPromise;
        
        // Step 4: Notify parent component about successful upload
        setUploadProgress(100);
        
        // Construct the final URL for the zip file (remove query parameters)
        const zipUrl = presignedUrl.split('?')[0];
        console.log('Final zip URL:', zipUrl);
        
        // Notify parent component
        if (onZipUploaded) {
          onZipUploaded(zipUrl, key);
        }
        
        setIsUploading(false);
      } catch (uploadError: Error | unknown) {
        console.error('Error during S3 upload:', uploadError);
        const errorMessage = uploadError instanceof Error ? uploadError.message : 'Unknown error';
        throw new Error(`S3 upload failed: ${errorMessage}`);
      }
    } catch (error: any) {
      console.error('Error uploading images:', error);
      
      // More detailed error logging
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        alert(`Upload failed: ${error.response.status} - ${error.response.data?.message || 'Server error'}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        alert('Upload failed: No response from server. Check your network connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        alert(`Upload failed: ${error.message}`);
      }
      
      setIsUploading(false);
      setUploadProgress(0);
    }
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
      
      <div className="mt-3 flex justify-between items-center">
        {previews.length > 0 && (
          <p className="text-xs text-gray-500">
            {previews.length} of {maxImages} images
          </p>
        )}
        
        {previews.length > 0 && (
          <button
            onClick={zipAndUploadImages}
            disabled={isUploading}
            className={`flex items-center px-3 py-1.5 rounded-md text-sm ${
              isUploading 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            <Upload className="w-4 h-4 mr-1" />
            {isUploading ? 'Uploading...' : 'Upload Images'}
          </button>
        )}
      </div>
      
      {isUploading && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">
            {uploadProgress}%
          </p>
        </div>
      )}
    </div>
  );
}