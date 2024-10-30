import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, X, Loader2 } from 'lucide-react';
import type { FileItem } from '../types';
import { getFilePreview } from '../utils/api';

interface FileViewerProps {
  file: FileItem;
  onClose: () => void;
}

export function FileViewer({ file, onClose }: FileViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadPreview = async () => {
      try {
        setLoading(true);
        const preview = await getFilePreview(file);
        setPreviewUrl(preview.url);
        setTotalPages(preview.pages);
      } catch (error) {
        console.error('Failed to load preview:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPreview();
  }, [file]);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(200, prev + 25));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(25, prev - 25));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <h3 className="font-medium text-gray-900">{file.name}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-md hover:bg-gray-100"
            disabled={loading}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600">{zoom}%</span>
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-md hover:bg-gray-100"
            disabled={loading}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          
          {file.url && (
            <a
              href={file.url}
              download={file.name}
              className="ml-2 flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Download</span>
            </a>
          )}

          <button
            onClick={onClose}
            className="ml-2 p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 relative bg-gray-50 overflow-hidden">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : previewUrl ? (
          <>
            <div 
              className="h-full overflow-auto p-4"
              style={{ 
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center'
              }}
            >
              <iframe
                src={`${previewUrl}/preview.html?page=${currentPage}`}
                className="w-full bg-white rounded shadow-sm"
                style={{ height: 'calc(100vh - 200px)' }}
              />
            </div>

            {totalPages > 1 && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-white rounded-full shadow-sm px-4 py-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-500">Preview not available</p>
          </div>
        )}
      </div>

      {!loading && previewUrl && totalPages > 1 && (
        <div className="border-t border-gray-200 p-4 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`relative w-20 aspect-[3/4] rounded-md overflow-hidden border-2 transition-all ${
                  currentPage === page
                    ? 'border-blue-500 shadow-sm'
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <img
                  src={`${previewUrl}/p_${page}.png`}
                  alt={`Page ${page}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-0.5 text-center">
                  {page}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}