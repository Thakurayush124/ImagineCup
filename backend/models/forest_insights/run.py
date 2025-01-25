import joblib
import numpy as np
import warnings
import json
import sys

warnings.filterwarnings("ignore", category=UserWarning)

# Paths to the scaler and model files for forest_insights (relative paths)
SCALER_FILE_PATH = r"./models/forest_insights/scaler4.pkl"
MODEL_FILE_PATH = r"./models/forest_insights/forest_reduction_model.pkl"

def load_scaler():
    """
    Load the scaler for forest_insights using joblib.
    """
    return joblib.load(SCALER_FILE_PATH)

def load_model():
    """
    Load the trained model for forest_insights using joblib.
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
    Main function to process input, make predictions, and return results for forest_insights model.
    """
    try:
        # Read JSON input from command line arguments
        input_json = sys.argv[1]
        input_data = json.loads(input_json)
        features = input_data.get("features")

        if not features:
            raise ValueError("Input features are missing or invalid.")

        # Load the scaler and model for forest_insights
        scaler = load_scaler()
        model = load_model()

        # Preprocess the input features
        scaled_features = preprocess_input(features, scaler)

        # Make predictions
        prediction = predict(model, scaled_features)
        formatted_prediction = float(f"{prediction[0]:.2f}")  # Format prediction to two decimal places

        # Prepare the result
        result = {
            "input_features": features,
            "predicted_forest_area_reduction": formatted_prediction
        }

        # Print the result to console (Node.js will parse this)
        print(json.dumps(result, indent=None))

    except Exception as e:
        # Print errors as JSON (Node.js will parse this)
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
