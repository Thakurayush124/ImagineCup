import joblib
import numpy as np
import warnings
import json
import sys

warnings.filterwarnings("ignore", category=UserWarning)

SCALER_FILE_PATH = r"C:\Desktop\Jupyter Files\scaler4.pkl"
MODEL_FILE_PATH = r"C:\Desktop\Jupyter Files\forest_reduction_model.pkl"

def load_scaler():
    return joblib.load(SCALER_FILE_PATH)

def load_model():
    return joblib.load(MODEL_FILE_PATH)

def preprocess_input(features, scaler):
    if len(features) != scaler.n_features_in_:
        raise ValueError(
            f"Expected {scaler.n_features_in_} features, but got {len(features)}."
        )
    features = np.array(features).reshape(1, -1)
    return scaler.transform(features)

def predict(model, scaled_features):
    return model.predict(scaled_features)

def main():
    try:
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

        # Predict the forest area reduction
        prediction = predict(model, scaled_features)
        formatted_prediction = float(f"{prediction[0]:.2f}")

        # Prepare the result
        result = {
            "input_features": features,
            "predicted_forest_area_reduction": formatted_prediction
        }

        print(json.dumps(result, indent=None))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
