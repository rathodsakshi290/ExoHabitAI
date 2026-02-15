import joblib
import pandas as pd
import os
import numpy as np

print("Loading models...")

# ---------------- MODEL PATH ----------------
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

model_path = os.path.join(
    BASE_DIR,
    "models",
    "random_forest.pkl"
)

# ---------------- FEATURE COLUMNS ----------------
# EXACT columns model was trained on
FEATURE_COLUMNS = [
    'pl_orbper',    # Orbital Period (normalized internally)
    'pl_dens',      # Planet Density
    'st_teff',      # Star Effective Temperature
    'st_lum',       # Star Luminosity
    'st_met',       # Star Metallicity
    'star_F',       # Star Type F
    'star_G',       # Star Type G
    'star_K'        # Star Type K
]

# ---------------- LOAD MODEL ----------------
try:
    model = joblib.load(model_path)
    print("✅ Random Forest model loaded successfully")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None


# ============================================================
# ---------------- PREDICTION FUNCTION ------------------------
# ============================================================
def predict_habitability(input_json):
    """
    Predict habitability for a single exoplanet.
    Applies manual scaling to match training dataset normalization.
    """

    if model is None:
        raise ValueError("Model not loaded")

    try:
        # ----------------------------------------------------
        # Extract required features
        # ----------------------------------------------------
        feature_dict = {
            col: input_json.get(col, 0)
            for col in FEATURE_COLUMNS
        }

        print("\n📊 RAW FEATURES RECEIVED:")
        print(feature_dict)

        # ====================================================
        # ----------- MANUAL SCALING FIX ----------------------
        # ====================================================
        # Your model was trained on normalized values
        # So we convert real user inputs → scaled space

        # Orbital Period scaling
        # Example: 365 days → 0.365
        feature_dict["pl_orbper"] = float(
            feature_dict["pl_orbper"]
        ) / 1000

        # Stellar Luminosity scaling
        # Example: 1.0 → 0.1
        feature_dict["st_lum"] = float(
            feature_dict["st_lum"]
        ) / 10

        # Metallicity slight normalization
        feature_dict["st_met"] = float(
            feature_dict["st_met"]
        )

        print("\n📊 SCALED FEATURES:")
        print(feature_dict)

        # ----------------------------------------------------
        # Convert to DataFrame
        # ----------------------------------------------------
        df = pd.DataFrame([feature_dict])

        # Ensure correct data types
        for col in FEATURE_COLUMNS:
            if col.startswith('star_'):
                df[col] = df[col].astype(int)
            else:
                df[col] = df[col].astype(float)

        print("\n📊 DATAFRAME FOR MODEL:")
        print(df)

        # ----------------------------------------------------
        # Prediction
        # ----------------------------------------------------
        prediction = model.predict(df)[0]
        probability = model.predict_proba(df)[0][1]

        print(
            f"\n✅ PREDICTION: {prediction}, "
            f"PROBABILITY: {probability:.4f}"
        )

        return {
            "prediction": int(prediction),
            "probability": float(probability)
        }

    except Exception as e:
        print(f"❌ Error during prediction: {str(e)}")
        import traceback
        traceback.print_exc()
        raise ValueError(f"Prediction error: {str(e)}")


# ============================================================
# ---------------- RANKING FUNCTION ---------------------------
# ============================================================
def rank_exoplanets(planets_json):
    """
    Rank multiple exoplanets by habitability.
    Assumes dataset already normalized.
    """

    if model is None:
        raise ValueError("Model not loaded")

    try:
        df = pd.DataFrame(planets_json)

        # Extract only required features
        df_model = df[FEATURE_COLUMNS].copy()

        # Ensure data types
        for col in FEATURE_COLUMNS:
            if col.startswith('star_'):
                df_model[col] = df_model[col].astype(int)
            else:
                df_model[col] = df_model[col].astype(float)

        # Predict probabilities
        scores = model.predict_proba(df_model)[:, 1]

        df["habitability_score"] = scores

        ranked_df = df.sort_values(
            by="habitability_score",
            ascending=False
        )

        return ranked_df.to_dict(orient="records")

    except Exception as e:
        raise ValueError(f"Ranking error: {str(e)}")
