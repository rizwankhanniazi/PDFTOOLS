import React, { useState } from 'react';
import { File, X, LayoutGrid, List, Eye } from 'lucide-react';
import { FileViewer } from './FileViewer';
import type { FileItem } from '../types';

interface FileListProps {
  files: FileItem[];
  onRemove?: (id: string) => void;
}

export function FileList({ files, onRemove }: FileListProps) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [viewingFile, setViewingFile] = useState<FileItem | null>(null);

  const ViewToggle = () => (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-sm text-gray-500">View:</span>
      <button
        onClick={() => setViewMode('list')}
        className={`p-1.5 rounded-md ${
          viewMode === 'list'
            ? 'bg-blue-50 text-blue-500'
            : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => setViewMode('grid')}
        className={`p-1.5 rounded-md ${
          viewMode === 'grid'
            ? 'bg-blue-50 text-blue-500'
            : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
    </div>
  );

  const ListView = () => (
    <div className="space-y-2">
      {files.map(file => (
        <div
          key={file.id}
          className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
        >
          <div className="flex items-center gap-3">
            <File className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {file.status === 'processing' && (
              <div className="w-24">
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={() => setViewingFile(file)}
              className="p-1.5 text-gray-400 hover:text-blue-500 rounded-full hover:bg-blue-50"
            >
              <Eye className="w-4 h-4" />
            </button>

            {onRemove && (
              <button
                onClick={() => onRemove(file.id)}
                className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const GridView = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {files.map(file => (
        <div
          key={file.id}
          className="relative group bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 p-3 bg-blue-50 rounded-lg">
              <File className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1 truncate w-full">
              {file.name}
            </p>
            <p className="text-xs text-gray-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>

          {file.status === 'processing' && (
            <div className="mt-3">
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${file.progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="absolute top-2 right-2 flex gap-1">
            <button
              onClick={() => setViewingFile(file)}
              className="p-1.5 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-50"
            >
              <Eye className="w-4 h-4 text-gray-400 hover:text-blue-500" />
            </button>

            {onRemove && (
              <button
                onClick={() => onRemove(file.id)}
                className="p-1.5 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <ViewToggle />
      {viewMode === 'list' ? <ListView /> : <GridView />}
      
      {viewingFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <FileViewer
              file={viewingFile}
              onClose={() => setViewingFile(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}