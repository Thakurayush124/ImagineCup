import joblib
import numpy as np
import warnings
import json
import sys

warnings.filterwarnings("ignore", category=UserWarning)

# Hardcoded paths to the scaler and model files
SCALER_FILE_PATH = r"./models/aquatic/scaler_aquatic.pkl"
MODEL_FILE_PATH = r"./models/aquatic/aquatic_rf.pkl"

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

def main():
    """
    Main function to process input, make predictions, and return results.
    """
    try:
        # Read JSON input from command line arguments
        input_json = sys.argv[1]
        input_data = json.loads(input_json)
        features = input_data.get("features")

        if not features:
            raise ValueError("Input features are missing or invalid.")

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
            "interpretation": interpretation,
        }

        # Print the result to console (Node.js will parse this)
        print(json.dumps(result))

    except Exception as e:
        # Print errors as JSON (Node.js will parse this)
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
