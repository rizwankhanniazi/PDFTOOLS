import React from 'react';
import { GripVertical, ArrowUpDown } from 'lucide-react';
import type { FileItem } from '../types';

interface MergeOptionsProps {
  files: FileItem[];
  onReorder: (startIndex: number, endIndex: number) => void;
}

export function MergeOptions({ files, onReorder }: MergeOptionsProps) {
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    onReorder(dragIndex, dropIndex);
  };

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <ArrowUpDown className="w-5 h-5 text-gray-500" />
        <h3 className="font-medium text-gray-900">Arrange Files</h3>
      </div>

      <div className="space-y-2">
        {files.map((file, index) => (
          <div
            key={file.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, index)}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-md cursor-move hover:bg-gray-100 transition-colors"
          >
            <GripVertical className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">{index + 1}.</span>
            <span className="text-sm text-gray-600 truncate">{file.name}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Drag and drop to reorder files. Files will be merged in the order shown above.
      </div>
    </div>
  );
}