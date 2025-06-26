import pytest
from models.aquatic import run

def test_predict_aquatic():
    # Use the same features as the curl example
    dummy_features = [1.0, 2.0, 3.0, 4.0, 5.0]
    scaler = run.load_scaler()
    model = run.load_model()
    scaled = run.preprocess_input(dummy_features, scaler)
    prediction = run.predict(model, scaled)
    assert prediction.shape == (1,)
    assert prediction[0] in [0, 1]  # Assuming binary classification
