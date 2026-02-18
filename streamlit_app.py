import streamlit as st
import numpy as np
import pandas as pd

st.set_page_config(page_title="Exohabitat", layout="wide")
st.title("🌍 Planet Habitability Predictor")

# Clean CSS - black input text
st.markdown("""
<style>
[data-testid="stNumberInput"] label { display: none !important; }
[data-testid="stNumberInput"] input { 
    color: black !important; 
    background-color: white !important; 
    font-size: 18px !important;
    padding: 12px !important;
    border-radius: 8px !important;
}
</style>
""", unsafe_allow_html=True)

# Editable inputs - fully manual entry
st.markdown("### 📊 Enter Planet Parameters")

col1, col2 = st.columns(2)
with col1:
    radius = st.number_input("🌐 Radius (Earth=1)", 0.1, 10.0, 1.0, 0.1, label_visibility="collapsed")
    mass = st.number_input("⚖️ Mass (Earth=1)", 0.1, 20.0, 1.0, 0.1, label_visibility="collapsed")

with col2:
    temp = st.number_input("🌡️ Temperature (K)", 100.0, 500.0, 288.0, 1.0, label_visibility="collapsed")
    distance = st.number_input("🌌 Distance (AU)", 0.01, 10.0, 1.0, 0.01, label_visibility="collapsed")
    flux = st.number_input("☀️ Stellar Flux", 0.01, 5.0, 1.0, 0.01, label_visibility="collapsed")

# Predict button
if st.button("🔮 Predict Habitability", use_container_width=True):
    if any(x <= 0 for x in [radius, mass, temp, distance, flux]):
        st.error("⚠️ Please enter valid positive values!")
    else:
        # SCIENTIFICALLY ACCURATE SCORING
        optimal_temp = 288  # Earth average
        
        # 1. TEMPERATURE (most important)
        if temp > 400 or temp < 150:  # Too hot/cold
            temp_score = 0.0
        else:
            temp_score = max(0, 1 - abs(temp - optimal_temp) / 100)  # ±100K tolerance
        
        # 2. GRAVITY (surface gravity = mass/radius²)
        gravity = mass / (radius ** 2)
        if gravity > 4 or gravity < 0.2:  # >4g or <0.2g impossible
            gravity_score = 0.0
        else:
            gravity_score = max(0, 1 - abs(gravity - 1) / 1.5)  # Earth=1g
        
        # 3. FLUX (radiation)
        if flux > 3 or flux < 0.1:  # Sterilizing levels
            flux_score = 0.0
        else:
            flux_score = max(0, 1 - abs(flux - 1) / 1.0)  # Earth flux=1
        
        # 4. DISTANCE (habitable zone)
        if distance < 0.1 or distance > 10:  # Too close/far
            distance_score = 0.0
        else:
            distance_score = max(0, 1 - abs(distance - 1) / 3)  # Earth orbit=1AU
        
        # FINAL HABITABILITY SCORE
        habitability = np.clip(
            0.35 * temp_score +      # Temperature (35%)
            0.30 * gravity_score +   # Gravity (30%)
            0.20 * flux_score +      # Radiation (20%)
            0.15 * distance_score,   # Orbit (15%)
            0, 1
        )
        
        # RESULTS DISPLAY
        st.success("✅ Analysis Complete!")
        
        col1, col2 = st.columns(2)
        with col1:
            st.metric("Habitability Score", f"{habitability:.3f}")
            st.progress(habitability)  # Visual progress bar
        
        with col2:
            if habitability > 0.65:
                st.markdown("### 🌟 **HABITABLE**")
                st.success("⭐ Strong potential for life!")
            elif habitability > 0.35:
                st.markdown("### ⚠️ **MARGINALLY HABITABLE**")
                st.info("ℹ️ Possible with adaptation")
            else:
                st.markdown("### ❌ **NOT HABITABLE**")
                st.error("💀 Extreme conditions prevent life")
        
        # Summary table
        results = pd.DataFrame({
            'Parameter': ['Radius (R⊕)', 'Mass (M⊕)', 'Temp (K)', 'Distance (AU)', 'Flux', 'Habitability'],
            'Value': [f"{radius:.2f}", f"{mass:.2f}", f"{temp:.0f}", f"{distance:.2f}", f"{flux:.2f}", f"{habitability:.3f}"]
        })
        st.subheader("📊 Results Summary")
        st.dataframe(results, use_container_width=True, hide_index=True)

st.markdown("---")
st.caption("Enter values manually → Click Predict → Get instant habitability analysis!")
