import pandas as pd
import numpy as np

REQUIRED_FIELDS = [
    "Radius", "Mass", "Period", "SemiMajorAxis", "EqTemp",
    "Density", "StarTemp", "StarLum", "StarMet",
    "Insolation", "Star_Type"
]

def validate_input(data):
    for field in REQUIRED_FIELDS:
        if field not in data:
            return False, f"Missing required field: {field}"
    return True, None


def preprocess_input(data):

    # Convert base features to correct training names
    df = pd.DataFrame([{
        "pl_rade": float(data["Radius"]),
        "pl_bmasse": float(data["Mass"]),
        "pl_orbper": float(data["Period"]),
        "pl_orbsmax": float(data["SemiMajorAxis"]),
        "pl_eqt": float(data["EqTemp"]),
        "pl_dens": float(data["Density"]),
        "st_teff": float(data["StarTemp"]),
        "st_lum": float(data["StarLum"]),
        "st_met": float(data["StarMet"]),
        "pl_insol": float(data["Insolation"]),
    }])

    # SAFE feature engineering (avoid division by zero)
    df["Habitability_Score"] = (
        (1 / (abs(df["pl_eqt"] - 288) + 1e-6)) +
        (1 / (abs(df["pl_rade"] - 1) + 1e-6)) +
        (1 / (abs(df["pl_bmasse"] - 1) + 1e-6))
    )

    df["Stellar_Compatibility"] = df["st_teff"] / 5778

    df["Orbital_Stability_Score"] = (
        df["pl_orbsmax"] / (df["pl_orbper"] + 1e-6)
    )

    # Initialize all star columns
    star_columns = [
        "Star_Type_Main_A",
        "Star_Type_Main_B",
        "Star_Type_Main_F",
        "Star_Type_Main_G",
        "Star_Type_Main_K",
        "Star_Type_Main_M",
        "Star_Type_Main_Other",
        "Star_Type_Main_m"
    ]

    for col in star_columns:
        df[col] = 0

    # Set correct star type
    mapping = {
        "A": "Star_Type_Main_A",
        "B": "Star_Type_Main_B",
        "F": "Star_Type_Main_F",
        "G": "Star_Type_Main_G",
        "K": "Star_Type_Main_K",
        "M": "Star_Type_Main_M",
        "m": "Star_Type_Main_m"
    }

    star_type = data["Star_Type"]

    if star_type in mapping:
        df[mapping[star_type]] = 1
    else:
        df["Star_Type_Main_Other"] = 1

    # FINAL — EXACT ORDER REQUIRED
    df = df[[
        'pl_rade',
        'pl_bmasse',
        'pl_orbper',
        'pl_orbsmax',
        'pl_eqt',
        'pl_dens',
        'st_teff',
        'st_lum',
        'st_met',
        'pl_insol',
        'Habitability_Score',
        'Stellar_Compatibility',
        'Orbital_Stability_Score',
        'Star_Type_Main_A',
        'Star_Type_Main_B',
        'Star_Type_Main_F',
        'Star_Type_Main_G',
        'Star_Type_Main_K',
        'Star_Type_Main_M',
        'Star_Type_Main_Other',
        'Star_Type_Main_m'
    ]]

    return df
