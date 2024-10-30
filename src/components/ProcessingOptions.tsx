import React from 'react';
import { Settings } from 'lucide-react';

interface ProcessingOptionsProps {
  onOptionsChange: (options: any) => void;
}

export function ProcessingOptions({ onOptionsChange }: ProcessingOptionsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-gray-500" />
        <h3 className="font-medium text-gray-900">Processing Options</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Output Format
          </label>
          <select
            onChange={(e) => onOptionsChange({ format: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="pdf">PDF</option>
            <option value="docx">Word (DOCX)</option>
            <option value="xlsx">Excel (XLSX)</option>
            <option value="pptx">PowerPoint (PPTX)</option>
            <option value="jpg">Image (JPG)</option>
            <option value="png">Image (PNG)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quality
          </label>
          <select
            onChange={(e) => onOptionsChange({ quality: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="high">High Quality</option>
            <option value="medium">Medium Quality</option>
            <option value="low">Low Quality</option>
          </select>
        </div>
      </div>
    </div>
  );
}