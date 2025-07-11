import React, { useState } from "react";
import axios from "axios";

const AnimalDetection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [error, setError] = useState(null);

  const detectAnimalFromImage = async (base64Image, apiKey) => {
    try {
      // Make the API call
      const response = await axios({
        method: "POST",
        url: "https://detect.roboflow.com/animal-detection-yolov8/1",
        params: {
          api_key: apiKey,
        },
        data: base64Image,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      // Return the API response
      return response.data;
    } catch (error) {
      // Log and rethrow the error for further handling
      console.error("Error during API call:", error.message);
      throw error;
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const apiKey = "CD5wfK2Z9BOgliQxrlv9"; // Replace with your API key

    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    try {
      // Convert the file to Base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Image = event.target.result.split(",")[1]; // Extract Base64 string without metadata

        // Call the detection API
        const result = await detectAnimalFromImage(base64Image, apiKey);

        // Display the result
        setPredictions(result);
        setError(null);
      };

      reader.readAsDataURL(file); // Start reading the file as Base64
    } catch (error) {
      setPredictions(null);
      setError(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Upload an Image for Animal Detection</h1>
      <input 
        type="file" 
        onChange={handleFileUpload} 
        accept="image/*"
      />

      {selectedImage && (
        <div>
          <h2>Preview:</h2>
          <img src={selectedImage} alt="Selected" style={{ maxWidth: "300px" }} />
        </div>
      )}

      <div>
        {predictions && (
          <div>
            <h2>Predictions:</h2>
            <pre>{JSON.stringify(predictions, null, 2)}</pre>
          </div>
        )}

        {error && <div>{error}</div>}
      </div>
      <style>
        {
            `.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.header {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 2rem;
}

.upload-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.file-input {
  margin-bottom: 20px;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 4px;
}

.upload-button {
  background-color: #38a169;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.upload-button:hover {
  background-color: #2f855a;
}

.image-preview {
  text-align: center;
}

.image-display {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.result-section {
  margin-top: 30px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.result {
  margin-bottom: 20px;
}

.error {
  color: #e53e3e;
  background-color: #fdd6d6;
  padding: 10px;
  border-radius: 4px;
}

pre {
  background-color: #f4f4f4;
  padding: 15px;
  border-radius: 4px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
`
        }
      </style>
    </div>
  );
};

export default AnimalDetection;
