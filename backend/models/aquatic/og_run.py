import joblib
import numpy as np
import warnings
import json
import os

warnings.filterwarnings("ignore", category=UserWarning)

# Hardcoded paths to the scaler and model files
SCALER_FILE_PATH = r"./models/model_1_aquatic/scaler_aquatic.pkl"
MODEL_FILE_PATH = r"./models/model_1_aquatic/aquatic_rf.pkl"


def load_scaler():
    """
    Load the scaler from a predefined file using joblib.
    """
    return joblib.load(SCALER_FILE_PATH)

def load_model():
    """
    Load the trained model from a predefined file using joblib.
    """
    return joblib.load(MODEL_FILE_PATH)

def preprocess_input(features, scaler):
    """
    Preprocess the input features using the scaler.
    """
    if len(features) != scaler.n_features_in_:
        raise ValueError(
            f"Expected {scaler.n_features_in_} features, but got {len(features)}."
        )
    features = np.array(features).reshape(1, -1)
    return scaler.transform(features)

def predict(model, scaled_features):
    """
    Make predictions using the trained model.
    """
    return model.predict(scaled_features)

def save_to_json(file_path, data):
    """
    Save the input and output to a JSON file.
    """
    # Check if the file exists and is not empty
    if os.path.exists(file_path) and os.path.getsize(file_path) > 0:
        # Append to existing JSON file
        with open(file_path, "r") as file:
            existing_data = json.load(file)
        existing_data.append(data)
    else:
        # Create a new JSON file or initialize it if empty
        existing_data = [data]
    
    # Save the updated data back to the file
    with open(file_path, "w") as file:
        json.dump(existing_data, file, indent=4)

def main():
    print("Welcome to the ML Prediction Tool!")
    
    try:
        # Get features from command line input
        features_input = input("Enter the feature values as a comma-separated list (e.g., 0.59,0.93,0.87,0.11,0.75): ")
        features = [float(x) for x in features_input.split(",")]

        # Load the scaler and model
        scaler = load_scaler()
        model = load_model()

        # Preprocess the input features
        scaled_features = preprocess_input(features, scaler)

        # Make predictions
        prediction = predict(model, scaled_features)

        # Interpret the prediction
        interpretation = "increased" if prediction[0] == 1 else "decreased"

        # Prepare the result
        result = {
            "input_features": features,
            "predicted_class": int(prediction[0]),
            "interpretation": interpretation
        }


        # Output the result
        print("\nPrediction complete! Results:", result)
        
    except Exception as e:
        print(f"\nAn error occurred: {e}")

if __name__ == "__main__":
    main()