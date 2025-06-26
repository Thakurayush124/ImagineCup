import pytest
from models.forest_insights import run

@pytest.mark.timeout(30)
def test_predict_forest_insights():
    # Use the same features as the curl example
    dummy_features = [1.0, 2.0, 3.0, 4.0, 5.0]
    scaler = run.load_scaler()
    model = run.load_model()
    scaled = run.preprocess_input(dummy_features, scaler)
    prediction = run.predict(model, scaled)
    assert prediction.shape == (1,)
    # For forest_insights, the output is a float (predicted_forest_area_reduction)
    assert isinstance(prediction[0], float)
