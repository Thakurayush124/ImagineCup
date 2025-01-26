import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const tempDir = path.join(process.cwd(), 'public', 'Temp');
  
  // Ensure Temp directory exists
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const form = new formidable.IncomingForm({
    uploadDir: tempDir,
    keepExtensions: true
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Upload failed' });
    }

    const file = files.image;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const newPath = path.join(tempDir, 'sample.jpg');
    
    try {
      fs.renameSync(file.filepath, newPath);
      res.status(200).json({ message: 'Image uploaded successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to save image', error: error.message });
    }
  });
}