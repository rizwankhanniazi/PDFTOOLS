import React from 'react';
import { 
  Minimize, 
  Combine, 
  FileOutput, 
  Scissors,
  ChevronRight 
} from 'lucide-react';
import type { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
  onClick: (tool: Tool) => void;
}

export function ToolCard({ tool, onClick }: ToolCardProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'minimize':
        return <Minimize className="w-6 h-6" />;
      case 'combine':
        return <Combine className="w-6 h-6" />;
      case 'fileOutput':
        return <FileOutput className="w-6 h-6" />;
      case 'scissors':
        return <Scissors className="w-6 h-6" />;
      default:
        return null;
    }
  };

  return (
    <button
      onClick={() => onClick(tool)}
      className="flex flex-col p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
          {getIcon(tool.icon)}
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{tool.name}</h3>
      <p className="text-sm text-gray-600">{tool.description}</p>
    </button>
  );
}