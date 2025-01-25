import joblib
import numpy as np
import warnings
import json
import sys

warnings.filterwarnings("ignore", category=UserWarning)

# Paths to the scaler and model files for wildlife_trend (update with relative paths)
SCALER_FILE_PATH = r"./models/wildlife_trend/wildlife_scaler.pkl"
MODEL_FILE_PATH = r"./models/wildlife_trend/wildlife_rf.pkl"

def load_scaler():
    """
    Load the scaler for wildlife_trend using joblib.
    """
    return joblib.load(SCALER_FILE_PATH)

def load_model():
    """
    Load the trained model for wildlife_trend using joblib.
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
    Main function to process input, make predictions, and return results for wildlife_trend model.
    """
    try:
        # Read JSON input from command line arguments (this is passed by server.js)
        input_json = sys.argv[1]
        input_data = json.loads(input_json)
        features = input_data.get("features")

        if not features:
            raise ValueError("Input features are missing or invalid.")

        # Load the scaler and model for wildlife_trend
        scaler = load_scaler()
        model = load_model()

        # Preprocess the input features
        scaled_features = preprocess_input(features, scaler)

        # Make predictions
        prediction = predict(model, scaled_features)

        # Interpretation (Adjust depending on your use case)
        interpretation = "increased" if prediction[0] == 1 else "decreased"

        # Prepare the result (adding predicted_class and interpretation fields)
        result = {
            "input_features": features,
            "predicted_class": int(prediction[0]),  # Assuming the prediction is a binary class (0 or 1)
            "interpretation": interpretation,
        }

        # Print the result to console (Node.js will parse this)
        print(json.dumps(result))

    except Exception as e:
        # Print errors as JSON (Node.js will parse this)
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
