import React from 'react';
import { Download } from 'lucide-react';
import { FileViewer } from './FileViewer';
import type { FileItem } from '../types';

interface ProcessedFilesProps {
  files: FileItem[];
  onDownloadAll: () => void;
}

export function ProcessedFiles({ files, onDownloadAll }: ProcessedFilesProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900">Processed Files</h3>
          <button
            onClick={onDownloadAll}
            className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600"
          >
            <Download className="w-4 h-4" />
            Download All
          </button>
        </div>

        <div className="space-y-4">
          {files.map(file => (
            <div key={file.id}>
              {file.previewUrl ? (
                <FileViewer
                  previewUrl={file.previewUrl}
                  downloadUrl={file.url!}
                  totalPages={file.pages || 1}
                  fileName={file.name}
                />
              ) : (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <span className="text-sm text-gray-600">{file.name}</span>
                  {file.url && (
                    <a
                      href={file.url}
                      download={`processed_${file.name}`}
                      className="text-sm text-blue-500 hover:text-blue-600"
                    >
                      Download
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}