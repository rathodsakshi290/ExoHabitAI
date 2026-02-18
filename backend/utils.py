import numpy as np

FEATURE_ORDER = [
    "pl_rade",
    "pl_bmasse",
    "pl_orbper",
    "pl_orbsmax",
    "pl_eqt",
    "st_teff",
    "st_lum",
    "st_met",
    "pl_insol",
    "Habitability_Score",
    "Steller_Compatibility",
    "Orbital_Stability_Score",
    "Star_Type_A",
    "Star_Type_B",
    "Star_Type_D",
    "Star_Type_F",
    "Star_Type_G",
    "Star_Type_K",
    "Star_Type_L",
    "Star_Type_M",
    "Star_Type_T",
    "Star_Type_W",
    "Stellar_Compatibility"
]


def compute_engineered_features(data):
    # Simple safe approximations (same spirit as preprocessing)
    habitability = data["pl_insol"] / (abs(data["pl_eqt"] - 288) + 1)
    orbital_stability = 1 / (1 + data["pl_orbsmax"])
    stellar_compatibility = 1 if 4000 <= data["st_teff"] <= 6500 else 0

    return habitability, stellar_compatibility, orbital_stability


def encode_star_type(star_type):
    star_types = ["A", "B", "D", "F", "G", "K", "L", "M", "T", "W"]
    encoding = {f"Star_Type_{t}": 0 for t in star_types}

    key = f"Star_Type_{star_type.upper()}"
    if key in encoding:
        encoding[key] = 1

    return encoding


def validate_input(data):
    required = [
        "pl_rade", "pl_bmasse", "pl_orbper", "pl_orbsmax",
        "pl_eqt", "st_teff", "st_lum", "st_met",
        "pl_insol", "star_type"
    ]

    missing = [f for f in required if f not in data]
    if missing:
        return False, f"Missing fields: {', '.join(missing)}"

    try:
        habitability, stellar_comp, orbital_stab = compute_engineered_features(data)
        star_encoding = encode_star_type(data["star_type"])

        feature_dict = {
            "pl_rade": float(data["pl_rade"]),
            "pl_bmasse": float(data["pl_bmasse"]),
            "pl_orbper": float(data["pl_orbper"]),
            "pl_orbsmax": float(data["pl_orbsmax"]),
            "pl_eqt": float(data["pl_eqt"]),
            "st_teff": float(data["st_teff"]),
            "st_lum": float(data["st_lum"]),
            "st_met": float(data["st_met"]),
            "pl_insol": float(data["pl_insol"]),
            "Habitability_Score": habitability,
            "Steller_Compatibility": stellar_comp,
            "Orbital_Stability_Score": orbital_stab,
            "Stellar_Compatibility": stellar_comp,
            **star_encoding
        }

        values = [feature_dict[f] for f in FEATURE_ORDER]
        return True, np.array(values).reshape(1, -1)

    except Exception as e:
        return False, str(e)

# ===============================
# FIX-1: FORMAT PREDICTION OUTPUT
# ===============================
def format_prediction(prediction, probability):
    label = "Habitable" if prediction == 1 else "Non-Habitable"

    return {
        "prediction": label,
        "confidence_score": round(float(probability), 4)
    }
