const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const cors = require('cors'); // Import CORS

const app = express();

// Enable CORS for all origins (or restrict it to your frontend)
app.use(cors());
app.use(express.json());

// Dynamic prediction endpoint
app.post('/api/predict/:modelName', (req, res) => {
    // output the endpoint called
    console.log('Endpoint called:', req.originalUrl);
    //output modelname and input
    console.log('modelName:', req.params.modelName);
    console.log('input:', req.body.features);
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
