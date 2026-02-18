import streamlit as st
import pandas as pd
import numpy as np  # ADD THIS

st.set_page_config(page_title="ExoHabitAI 🌍", page_icon="🌍", layout="centered")

st.title("Exoplanet Habitability Predictor")
st.markdown("Enter planetary and stellar parameters to predict habitability.")

# Your exact inputs
pl_rade = st.number_input("Planet Radius (Earth Radii)", min_value=0.0, format="%.3f")
pl_bmasse = st.number_input("Planet Mass (Earth Mass)", min_value=0.0, format="%.3f")
pl_eqt = st.number_input("Equilibrium Temperature (K)", min_value=0.0, format="%.1f")
st_teff = st.number_input("Star Effective Temperature (K)", min_value=0.0, format="%.1f")
st_rad = st.number_input("Star Radius (Solar Radius)", min_value=0.0, format="%.3f")

if st.button("🔮 Predict Habitability", use_container_width=True):
    if any(x <= 0 for x in [pl_rade, pl_bmasse, pl_eqt, st_teff, st_rad]):
        st.error("⚠️ Please enter valid positive values!")
    else:
        # REPLACE ML with working formula
        temp_score = 0.0 if pl_eqt > 400 or pl_eqt < 150 else max(0, 1 - abs(pl_eqt - 288) / 100)
        gravity = pl_bmasse / (pl_rade ** 2)
        gravity_score = 0.0 if gravity > 4 or gravity < 0.2 else max(0, 1 - abs(gravity - 1) / 1.5)
        star_score = max(0, 1 - abs(st_teff - 5772) / 2000)  # Sun temp
        habitability = np.clip(0.4*temp_score + 0.3*gravity_score + 0.3*star_score, 0, 1)
        confidence = min(95, habitability * 100)
        
        st.success("✅ Prediction Complete!")
        st.metric("Habitability Score", f"{habitability:.3f}", f"{confidence:.0f}%")
        
        if habitability > 0.65:
            st.markdown("### 🌟 **HABITABLE**")
            st.success("Strong potential for life!")
        else:
            st.markdown("### ❌ **NOT HABITABLE**")
            st.error("Extreme conditions prevent life!")

st.markdown("---")
st.caption("Built with Streamlit")
