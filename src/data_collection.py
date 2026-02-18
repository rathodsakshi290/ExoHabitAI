# data_collection.py
# -*- coding: utf-8 -*-

import pandas as pd
import requests

print("🚀 Starting data collection for ExoHabitAI...")

# API source: NASA Exoplanet Archive (CSV format)
URL = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,pl_rade,pl_bmasse,pl_orbper,pl_eqt,pl_dens,st_teff,st_rad,st_mass,st_lum+from+ps&format=csv"

print("📥 Downloading dataset from NASA Exoplanet Archive...")
try:
    response = requests.get(URL)
    response.raise_for_status()
    
    # Save raw CSV
    raw_csv_path = "data/exoplanet_data_raw.csv"
    with open(raw_csv_path, "wb") as f:
        f.write(response.content)
    
    print(f"✅ Dataset saved to {raw_csv_path}")
    
    # Load CSV into pandas
    df = pd.read_csv(raw_csv_path)
    print("📊 Dataset loaded:", df.shape)
    
    # Keep only numeric features + planet name
    FEATURES = [
        "pl_name",
        "pl_rade",
        "pl_bmasse",
        "pl_orbper",
        "pl_eqt",
        "pl_dens",
        "st_teff",
        "st_rad",
        "st_mass",
        "st_lum"
    ]
    
    df = df[[f for f in FEATURES if f in df.columns]]
    
    # Fill missing values with median
    df = df.fillna(df.median(numeric_only=True))
    
    # Save cleaned version
    cleaned_path = "data/exoplanet_data_cleaned.csv"
    df.to_csv(cleaned_path, index=False)
    print(f"💾 Cleaned dataset saved to {cleaned_path}")
    
except Exception as e:
    print("❌ Error during data collection:", e)

print("🚀 Data collection completed!")

