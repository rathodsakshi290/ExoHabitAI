# preprocessing.py
import pandas as pd
from sklearn.preprocessing import StandardScaler
import os

INPUT_PATH = "data/exoplanet_data_cleaned.csv"
OUTPUT_PATH = "data/processed/exoplanet_ml_ready.csv"

FEATURES = [
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

# Load dataset
df = pd.read_csv(INPUT_PATH)

# Keep original values
for col in FEATURES:
    if col in df.columns:
        df[f"{col}_original"] = df[col]

# Select numeric features for ML
numeric_features = [f for f in FEATURES if f in df.columns]

# Fill missing values
df[numeric_features] = df[numeric_features].fillna(df[numeric_features].median())

# Scale features
scaler = StandardScaler()
df_scaled = scaler.fit_transform(df[numeric_features])
df[numeric_features] = df_scaled

# Save ML-ready dataset
os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
df.to_csv(OUTPUT_PATH, index=False)
print("✅ ML-ready dataset saved with original columns:", OUTPUT_PATH)
