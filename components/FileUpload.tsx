
import React, { useState, useCallback } from 'react';
import { Icon } from './Icon';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  title?: string;
  description?: string;
  supportedFormats?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, accept, title, description, supportedFormats }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);


  return (
    <div
      className={`relative w-full max-w-2xl p-8 sm:p-12 border-2 border-dashed rounded-xl transition-all duration-300 ${isDragging ? 'border-brand-secondary bg-slate-700' : 'border-slate-600 hover:border-slate-500 bg-slate-800'}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-upload"
        className="absolute w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileChange}
        accept={accept || "image/png, image/jpeg, image/webp"}
      />
      <div className="flex flex-col items-center justify-center text-center text-slate-400">
        <Icon name="upload" className="w-16 h-16 mb-4 text-slate-500"/>
        <p className="text-xl font-semibold text-slate-300">
          {title || 'Drag & drop your image here'}
        </p>
        <p className="mt-1">{description || <>or <span className="font-medium text-brand-secondary">click to browse</span></>}</p>
        <p className="text-xs mt-4 text-slate-500">{supportedFormats || 'Supports PNG, JPG, and WEBP'}</p>
      </div>
    </div>
  );
};

export default FileUpload;
