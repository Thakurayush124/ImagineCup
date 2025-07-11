import pytest
from models.aquatic import run

def test_predict_aquatic_binary_classification():
    # Test prediction for binary classification outcome
    dummy_features = [1.0, 2.0, 3.0, 4.0, 5.0]
    scaler = run.load_scaler()
    model = run.load_model()
    scaled = run.preprocess_input(dummy_features, scaler)
    prediction = run.predict(model, scaled)
    assert prediction.shape == (1,)
    assert prediction[0] in [0, 1]  # Assuming binary classification

def test_predict_aquatic_invalid_features():
    # Test prediction when invalid features are provided
    invalid_features = [1.0, 2.0]  # Fewer features than expected
    scaler = run.load_scaler()
    model = run.load_model()
    try:
        scaled = run.preprocess_input(invalid_features, scaler)
        _ = run.predict(model, scaled)
    except ValueError as e:
        assert str(e) == f"Expected {scaler.n_features_in_} features, but got {len(invalid_features)}."

def test_predict_aquatic_feature_scaling():
    # Test if feature scaling transforms features correctly
    dummy_features = [1.0, 2.0, 3.0, 4.0, 5.0]
    scaler = run.load_scaler()
    scaled = run.preprocess_input(dummy_features, scaler)
    # Check if scaled features have the expected shape
    assert scaled.shape == (1, scaler.n_features_in_)

