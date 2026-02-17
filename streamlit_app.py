import streamlit as st

st.title("ExoHabitAI 🌍")

st.write("Welcome to Exoplanet Habitability Predictor")

number = st.number_input("Enter a value")

if st.button("Predict"):
    st.success("Prediction completed!")
