# Backend for AI-Powered Prediction Models

This backend provides dynamic endpoints for three machine learning models: **Aquatic**, **Forest Insights**, and **Wildlife Trend**. The backend processes user-provided input features, sends them to the respective Python models, and returns predictions in JSON format.

---

## **Tech Stack**

- **Node.js**: Backend server
- **Express.js**: API framework
- **Python**: Machine learning models
- **Docker**: Containerized deployment
- **Axios**: HTTP requests in the frontend
- **Render**: Hosting for the backend

---

## **How It Works**

1. The backend exposes dynamic endpoints for three ML models:
   - `/api/predict/aquatic`
   - `/api/predict/forest_insights`
   - `/api/predict/wildlife_trend`
2. The backend takes **user input features** in JSON format.
3. It runs the input through a Python script (`run.py`) specific to the selected model.
4. The Python script processes the input using the model and returns a prediction in JSON format.
5. The backend sends the prediction response back to the user.

---

## **Installation**

### Clone the Repository

```bash
git clone https://github.com/Shashwat-Darshan/ImagineCup
cd backend
```

### Install Dependencies

Run the following command to install all required libraries:

```bash
npm install
```

### Required Python Libraries

Ensure the following Python libraries are installed for the ML models:

```bash
pip install -r requirements.txt
```

---

## **Endpoints**

### **1. /aquatic**``

#### **Description**

Predicts results for the aquatic model based on user-provided features.

#### **Request Example (using Axios)**

```javascript
import axios from "axios";

const backendUrl = "https://backend-image-latest-cn0k.onrender.com";

const callAquaticEndpoint = async () => {
  try {
    const response = await axios.post(`${backendUrl}/api/predict/aquatic`, {
      features: [5.1, 3.5, 1.4, 0.2, 0.5],
    });

    console.log("Prediction Result:", response.data);
  } catch (error) {
    console.error("Error calling Aquatic endpoint:", error);
  }
};

callAquaticEndpoint();
```

#### **Input Body**

```json
{
    "features": [5.1, 3.5, 1.4, 0.2, 0.5]
}
```

#### **Expected Response**

```json
{
    "input_features": [5.1, 3.5, 1.4, 0.2, 0.5],
    "predicted_class": 0,
    "interpretation": "decreased"
}
```

---

### **2. /forest_insights**``

#### **Description**

Predicts forest area reduction using the Forest Insights model.

#### **Request Example (using Axios)**

```javascript
const callForestInsightsEndpoint = async () => {
  try {
    const response = await axios.post(`${backendUrl}/api/predict/forest_insights`, {
      features: [10.0, 15.5, 20.3, 5.2, 2.1],
    });

    console.log("Prediction Result:", response.data);
  } catch (error) {
    console.error("Error calling Forest Insights endpoint:", error);
  }
};

callForestInsightsEndpoint();
```

#### **Input Body**

```json
{
    "features": [10.0, 15.5, 20.3, 5.2, 2.1]
}
```

#### **Expected Response**

```json
{
    "input_features": [10.0, 15.5, 20.3, 5.2, 2.1],
    "predicted_forest_area_reduction": 1.25
}
```

---

### **3./wildlife_trend**``

#### **Description**

Predicts wildlife trends using the Wildlife Trend model.

#### **Request Example (using Axios)**

```javascript
const callWildlifeTrendEndpoint = async () => {
  try {
    const response = await axios.post(`${backendUrl}/api/predict/wildlife_trend`, {
      features: [8.5, 12.1, 6.7, 4.4, 3.3],
    });

    console.log("Prediction Result:", response.data);
  } catch (error) {
    console.error("Error calling Wildlife Trend endpoint:", error);
  }
};

callWildlifeTrendEndpoint();
```

#### **Input Body**

```json
{
    "features": [8.5, 12.1, 6.7, 4.4, 3.3]
}
```

#### **Expected Response**

```json
{
    "input_features": [8.5, 12.1, 6.7, 4.4, 3.3],
    "predicted_class": 1,
    "interpretation": "increased"
}
```

---

## **Summary of the Backend**

- **Dynamic Endpoint Management**: Allows multiple models to be served using a single base route (`/api/predict/:modelName`).
- **Real-Time Predictions**: Uses Python scripts to load pre-trained machine learning models and provide predictions.
- **Easy Integration**: Simple JSON input and output, designed to work seamlessly with any frontend.

---

## **Contact**

For any questions or issues, feel free to raise an issue in the repository or contact the project maintainer.

---
