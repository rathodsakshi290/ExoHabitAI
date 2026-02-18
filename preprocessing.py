import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler

print("Starting preprocessing...")

# Paths
INPUT_PATH = "data/raw/dataset NASA.csv"
OUTPUT_PATH = "data/processed/preprocessed.csv"

# Load dataset
df = pd.read_csv(INPUT_PATH, low_memory=False)
print("Loaded shape:", df.shape)

# Remove duplicates
df.drop_duplicates(inplace=True)

# Handle missing values
num_cols = df.select_dtypes(include=np.number).columns
df[num_cols] = df[num_cols].fillna(df[num_cols].median())

cat_cols = df.select_dtypes(include="object").columns
for col in cat_cols:
    df[col] = df[col].fillna(df[col].mode()[0])

# Remove invalid values
if "planet_radius" in df.columns:
    df = df[df["planet_radius"] > 0]

if "equilibrium_temperature" in df.columns:
    df = df[df["equilibrium_temperature"] > 0]

# Feature engineering: Habitability score
needed = ["equilibrium_temperature", "planet_radius", "semi_major_axis"]

if all(c in df.columns for c in needed):
    df["habitability_score"] = (
        1 / (abs(df["equilibrium_temperature"] - 288) + 1) +
        1 / (abs(df["planet_radius"] - 1) + 1) +
        1 / (abs(df["semi_major_axis"] - 1) + 1)
    )

# Encode categorical columns
df = pd.get_dummies(df, drop_first=True)

# Scale numerical features
num_cols = df.select_dtypes(include=np.number).columns

if len(num_cols) > 0:
    scaler = StandardScaler()
    df[num_cols] = scaler.fit_transform(df[num_cols])

# Create target column
if "habitability_score" in df.columns:
    df["habitable"] = np.where(
        df["habitability_score"] > df["habitability_score"].median(),
        1,
        0
    )

# Save output
df.to_csv(OUTPUT_PATH, index=False)

print("DONE!")
print("Saved to:", OUTPUT_PATH)
