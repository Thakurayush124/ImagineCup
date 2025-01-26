const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const upload = multer({ dest: 'public/Temp/' });

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000', // specify your frontend URL
    methods: 'GET, POST', // allowed methods
    allowedHeaders: 'Content-Type' // allowed headers
  }));

// Remove temp image endpoint
app.delete('/api/removeTempImage', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'Temp', 'sample.jpg');

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.status(200).json({ message: 'Previous image removed' });
    } else {
      res.status(404).json({ message: 'No previous image found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove image', error: error.message });
  }
});

// Upload image to temp folder
app.post('/api/uploadToTemp', upload.single('image'), (req, res) => {
  try {
    const tempDir = path.join(__dirname, 'public', 'Temp');
    const originalPath = req.file.path;
    const newPath = path.join(tempDir, 'sample.jpg');

    // Rename the uploaded file
    fs.renameSync(originalPath, newPath);

    res.status(200).json({ message: 'Image uploaded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// Dynamic prediction endpoint
app.post('/api/predict/:modelName', (req, res) => {
  console.log('Endpoint called:', req.originalUrl);
  const { modelName } = req.params;
  const inputFeatures = req.body.features;

  // Validate the modelName and inputFeatures
  if (!modelName || !['aquatic', 'forest_insights', 'wildlife_trend'].includes(modelName)) {
    return res.status(400).json({ error: 'Invalid or missing modelName.' });
  }

  if (!inputFeatures || !Array.isArray(inputFeatures)) {
    return res.status(400).json({ error: 'Invalid input. Features must be an array.' });
  }

  // Path to the Python script
  const scriptPath = path.join(__dirname, 'models', modelName, 'run.py');

  // Spawn a Python process
  const pythonProcess = spawn('python', [scriptPath, JSON.stringify({ model_name: modelName, features: inputFeatures })]);

  let data = '';
  let error = '';

  // Collect data from Python script
  pythonProcess.stdout.on('data', (chunk) => {
    data += chunk.toString();
  });

  // Collect errors from Python script
  pythonProcess.stderr.on('data', (chunk) => {
    error += chunk.toString();
  });

  // Handle process close
  pythonProcess.on('close', (code) => {
    if (code !== 0 || error) {
      console.error('Python script error:', error);
      return res.status(500).json({ error: 'Failed to process prediction.' });
    }

    try {
      const result = JSON.parse(data);
      if (result.error) {
        return res.status(400).json({ error: result.error });
      }
      console.log('Result:', result);
      res.json(result);
    } catch (err) {
      console.error('Error parsing Python response:', err.message);
      res.status(500).json({ error: 'Error parsing Python response.' });
    }
  });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});