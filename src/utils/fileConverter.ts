import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function convertFile(file: File, outputFormat: string, quality: string): Promise<Blob> {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = async (e) => {
      try {
        const content = e.target?.result;
        
        switch (outputFormat) {
          case 'xlsx':
            const workbook = XLSX.read(content, { type: 'binary' });
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            resolve(new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
            break;

          case 'jpg':
          case 'png':
            const loadingTask = pdfjsLib.getDocument(content);
            const pdf = await loadingTask.promise;
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: quality === 'high' ? 2 : 1 });
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            await page.render({
              canvasContext: context!,
              viewport: viewport
            }).promise;
            
            canvas.toBlob((blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Failed to convert to image'));
            }, `image/${outputFormat}`);
            break;

          case 'txt':
            const doc = await pdfjsLib.getDocument(content).promise;
            let text = '';
            
            for (let i = 1; i <= doc.numPages; i++) {
              const page = await doc.getPage(i);
              const textContent = await page.getTextContent();
              text += textContent.items.map((item: any) => item.str).join(' ') + '\n';
            }
            
            resolve(new Blob([text], { type: 'text/plain' }));
            break;

          default:
            reject(new Error('Unsupported output format'));
        }
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}