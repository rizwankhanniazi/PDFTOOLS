import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import type { FileItem } from '../types';

interface FileUploadProps {
  onFileSelect: (files: FileItem[]) => void;
  multiple?: boolean;
}

export function FileUpload({ onFileSelect, multiple = false }: FileUploadProps) {
  const processFiles = useCallback((fileList: FileList) => {
    const files: FileItem[] = Array.from(fileList).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type
    }));
    onFileSelect(files);
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  }, [processFiles]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
    >
      <input
        type="file"
        onChange={handleChange}
        multiple={multiple}
        accept=".pdf"
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer flex flex-col items-center gap-2"
      >
        <Upload className="w-8 h-8 text-gray-400" />
        <span className="text-sm text-gray-600">
          Drop your files here or click to browse
        </span>
        <span className="text-xs text-gray-500">
          {multiple ? 'You can upload multiple PDF files' : 'Only PDF files are supported'}
        </span>
      </label>
    </div>
  );
}