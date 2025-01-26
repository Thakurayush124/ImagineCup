import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const tempImagePath = path.join(process.cwd(), 'public', 'Temp', 'sample.jpg');

  try {
    if (fs.existsSync(tempImagePath)) {
      fs.unlinkSync(tempImagePath);
    }
    res.status(200).json({ message: 'Previous image removed' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove image', error: error.message });
  }
}