const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function convertFile(file: File, outputFormat: string): Promise<{
  url: string;
  preview: string;
  pages: number;
}> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('outputFormat', outputFormat);

  const response = await fetch(`${API_BASE_URL}/convert`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Conversion failed');
  }

  return await response.json();
}

export async function mergeFiles(files: File[]): Promise<{
  url: string;
  preview: string;
  pages: number;
}> {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });

  const response = await fetch(`${API_BASE_URL}/merge`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Merge failed');
  }

  return await response.json();
}

export async function getFilePreview(file: File): Promise<{
  url: string;
  pages: number;
}> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/preview`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to generate preview');
  }

  return await response.json();
}