# utils.py
import joblib
import os

def load_model():
    model_path = os.path.join("models", "habitability_model.pkl")
    return joblib.load(model_path)
