export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  path: string;
}

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  status?: 'processing' | 'completed';
  progress?: number;
  url?: string;
  previewUrl?: string;
  pages?: number;
}