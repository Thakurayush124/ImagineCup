from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pickle
import numpy as np

# Load the models and scaler
scaler_path = '/mnt/data/scaler_aquatic.pkl'
model_path = '/mnt/data/aquatic_rf.pkl'

with open(scaler_path, 'rb') as scaler_file:
    scaler = pickle.load(scaler_file)

with open(model_path, 'rb') as model_file:
    model = pickle.load(model_file)

# Initialize the FastAPI app
app = FastAPI()

class InputData(BaseModel):
    Turbidity: float
    pH_Level: float
    Salinity: float
    Water_Temperature: float
    Dissolved_Oxygen: float

@app.get("/")
def home():
    return {"message": "Aquatic Trend Prediction API is running."}

@app.post("/predict")
def predict(data: InputData):
    try:
        # Extract features from the input
        features = [
            data.Turbidity,
            data.pH_Level,
            data.Salinity,
            data.Water_Temperature,
            data.Dissolved_Oxygen
        ]

        # Scale the features
        scaled_features = scaler.transform([features])

        # Make prediction
        prediction = model.predict(scaled_features)

        # Return the result
        result = {"trend": int(prediction[0])}  # 0 for decreased, 1 for increased
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
