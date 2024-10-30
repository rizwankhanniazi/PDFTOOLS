import React, { useState } from 'react';
import { Header } from './components/Header';
import { ToolCard } from './components/ToolCard';
import { FileUpload } from './components/FileUpload';
import { FileList } from './components/FileList';
import { ProcessingOptions } from './components/ProcessingOptions';
import { ProcessedFiles } from './components/ProcessedFiles';
import { MergeOptions } from './components/MergeOptions';
import type { Tool, FileItem } from './types';

const tools: Tool[] = [
  {
    id: 'compress',
    name: 'Compress PDF',
    description: 'Reduce file size while maintaining quality',
    icon: 'minimize',
    path: '/compress'
  },
  {
    id: 'merge',
    name: 'Merge PDFs',
    description: 'Combine multiple PDFs into one file',
    icon: 'combine',
    path: '/merge'
  },
  {
    id: 'convert',
    name: 'Convert PDF',
    description: 'Convert PDFs to other formats',
    icon: 'fileOutput',
    path: '/convert'
  },
  {
    id: 'split',
    name: 'Split PDF',
    description: 'Extract pages from your PDF',
    icon: 'scissors',
    path: '/split'
  }
];

export function App() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);

  const handleToolSelect = (tool: Tool) => {
    setSelectedTool(tool);
    setFiles([]);
    setProcessed(false);
  };

  const handleFileSelect = (newFiles: FileItem[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    setProcessed(false);
  };

  const handleFileRemove = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
    setProcessed(false);
  };

  const handleReorder = (startIndex: number, endIndex: number) => {
    setFiles(prev => {
      const result = [...prev];
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  const handleProcess = async () => {
    if (!files.length || processing) return;
    
    setProcessing(true);
    setProcessed(false);
    setFiles(prev => 
      prev.map(file => ({ ...file, status: 'processing', progress: 0 }))
    );

    // Simulate processing
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setFiles(prev =>
        prev.map(file => ({ ...file, progress: i }))
      );
    }

    // Simulate output URLs for processed files
    setFiles(prev =>
      prev.map(file => ({
        ...file,
        status: 'completed',
        progress: 100,
        url: URL.createObjectURL(new Blob([''], { type: 'application/pdf' }))
      }))
    );
    
    setProcessing(false);
    setProcessed(true);
  };

  const handleDownloadAll = () => {
    files.forEach(file => {
      if (file.url) {
        const link = document.createElement('a');
        link.href = file.url;
        link.download = `processed_${file.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!selectedTool ? (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Powerful PDF Tools
              </h1>
              <p className="text-lg text-gray-600">
                Edit, compress, merge and convert PDFs with ease
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tools.map(tool => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onClick={handleToolSelect}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => setSelectedTool(null)}
              className="mb-8 text-sm text-gray-600 hover:text-gray-900 flex items-center"
            >
              ← Back to Tools
            </button>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedTool.name}
              </h2>
              <p className="text-gray-600">{selectedTool.description}</p>
            </div>

            <FileUpload
              onFileSelect={handleFileSelect}
              multiple={selectedTool.id === 'merge'}
            />

            {files.length > 0 && (
              <div className="mt-8 space-y-6">
                <FileList
                  files={files}
                  onRemove={!processing ? handleFileRemove : undefined}
                />
                
                {selectedTool.id === 'merge' && (
                  <MergeOptions files={files} onReorder={handleReorder} />
                )}
                
                {selectedTool.id === 'convert' && (
                  <ProcessingOptions onOptionsChange={() => {}} />
                )}
                
                {!processed ? (
                  <button
                    onClick={handleProcess}
                    disabled={processing}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? 'Processing...' : 'Process Files'}
                  </button>
                ) : (
                  <ProcessedFiles files={files} onDownloadAll={handleDownloadAll} />
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}