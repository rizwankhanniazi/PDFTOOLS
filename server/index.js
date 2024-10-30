import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { Viewer, HtmlViewOptions, PngViewOptions } from '@groupdocs/groupdocs.viewer';
import { Converter } from '@groupdocs/groupdocs.conversion';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use('/downloads', express.static('downloads'));
app.use('/previews', express.static('previews'));

const PORT = process.env.PORT || 3000;

// Ensure directories exist
['uploads', 'downloads', 'previews'].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
});

// Configure GroupDocs license
if (process.env.GROUPDOCS_LICENSE) {
  const license = new License();
  license.setLicense(process.env.GROUPDOCS_LICENSE);
}

app.post('/api/preview', upload.single('file'), async (req, res) => {
  try {
    const inputFile = req.file.path;
    const fileName = path.parse(req.file.originalname).name;
    const previewPath = await generatePreview(inputFile, fileName);

    const previewUrl = `${req.protocol}://${req.get('host')}/previews/${fileName}`;
    
    res.json({ 
      url: previewUrl,
      pages: previewPath.pages
    });

  } catch (error) {
    console.error('Preview generation error:', error);
    res.status(500).json({ error: 'Failed to generate preview' });
  }
});

app.post('/api/convert', upload.single('file'), async (req, res) => {
  try {
    const { outputFormat } = req.body;
    const inputFile = req.file.path;
    const fileName = path.parse(req.file.originalname).name;
    const outputFile = path.join('downloads', `${fileName}.${outputFormat}`);

    // Initialize converter
    const converter = new Converter(inputFile);
    
    // Convert the file
    converter.convert(outputFile, getConversionOptions(outputFormat));

    // Generate preview
    const previewPath = await generatePreview(outputFile, fileName);

    // Return the download and preview URLs
    const downloadUrl = `${req.protocol}://${req.get('host')}/downloads/${path.basename(outputFile)}`;
    const previewUrl = `${req.protocol}://${req.get('host')}/previews/${fileName}`;
    
    res.json({ 
      url: downloadUrl,
      preview: previewUrl,
      pages: previewPath.pages
    });

  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Conversion failed' });
  }
});

app.post('/api/merge', upload.array('files'), async (req, res) => {
  try {
    const files = req.files;
    const outputFile = path.join('downloads', `merged_${Date.now()}.pdf`);

    // Initialize merger
    const merger = new Merger();
    
    // Join files
    files.forEach(file => {
      merger.join(file.path);
    });

    // Save merged file
    merger.save(outputFile);

    // Generate preview
    const previewPath = await generatePreview(outputFile, 'merged');

    // Return the download and preview URLs
    const downloadUrl = `${req.protocol}://${req.get('host')}/downloads/${path.basename(outputFile)}`;
    const previewUrl = `${req.protocol}://${req.get('host')}/previews/merged`;
    
    res.json({ 
      url: downloadUrl,
      preview: previewUrl,
      pages: previewPath.pages
    });

  } catch (error) {
    console.error('Merge error:', error);
    res.status(500).json({ error: 'Merge failed' });
  }
});

async function generatePreview(filePath, fileName) {
  const previewDir = path.join('previews', fileName);
  await fs.mkdir(previewDir, { recursive: true });

  // Initialize viewer
  const viewer = new Viewer(filePath);
  
  // Generate HTML preview with embedded resources
  const htmlOptions = HtmlViewOptions.forEmbeddedResources(path.join(previewDir, 'preview.html'));
  const viewInfo = viewer.view(htmlOptions);

  // Generate PNG previews for thumbnails
  const pngOptions = PngViewOptions.forPngImages(path.join(previewDir, 'p'));
  viewer.view(pngOptions);

  return {
    path: previewDir,
    pages: viewInfo.pages
  };
}

function getConversionOptions(format) {
  switch (format) {
    case 'docx':
      return new WordProcessingConvertOptions();
    case 'xlsx':
      return new SpreadsheetConvertOptions();
    case 'pptx':
      return new PresentationConvertOptions();
    case 'jpg':
    case 'png':
      return new ImageConvertOptions();
    default:
      return null;
  }
}

// Cleanup old files periodically
setInterval(async () => {
  const dirs = ['uploads', 'downloads', 'previews'];
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours

  for (const dir of dirs) {
    try {
      const files = await fs.readdir(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = await fs.stat(filePath);
        if (now - stats.mtime.getTime() > maxAge) {
          await fs.unlink(filePath);
        }
      }
    } catch (error) {
      console.error(`Error cleaning up ${dir}:`, error);
    }
  }
}, 60 * 60 * 1000); // Run every hour

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});