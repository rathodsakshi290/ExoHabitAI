

# ExoHabitAI — AI Exoplanet Habitability Prediction Platform

## Design System
- **Dark space theme** with deep navy/black backgrounds
- **Animated starfield** background using CSS animations (twinkling stars + subtle parallax)
- **Glassmorphism panels** with backdrop-blur, translucent borders, and subtle glow effects
- **Gradient accent colors**: cyan-to-purple gradients for buttons and highlights
- **Scientific typography**: clean, modern sans-serif with monospace accents for data
- Smooth scroll behavior, hover animations on all interactive elements
- Fully responsive across mobile and desktop

---

## Page 1: Home (Landing Page)
- **Hero Section**: Large headline "Discover Habitable Worlds Using Artificial Intelligence" with animated typing or fade-in effect, subtitle about AI-based habitability prediction, and a glowing gradient "Start Prediction" CTA button linking to the Prediction page
- **Animated star/galaxy background** spanning the full viewport
- **Feature Cards** (3 glassmorphism cards with icons and hover effects):
  - 🤖 Machine Learning Prediction
  - 🛰️ NASA Dataset Analysis
  - 📊 Interactive Dashboard Visualization
- **Navigation bar** with links to all 4 pages, sleek and translucent

## Page 2: Prediction Tool (Core Feature)
- **Input form** in a glassmorphism panel with 4 user-editable fields:
  - Planet Radius, Planet Mass, Orbital Period, Star Temperature
- Other parameters sent with default values as specified
- **"Predict Habitability"** gradient button
- **Loading state** with a spinning/pulsing planet animation
- **Result card** appearing after prediction:
  - Shows "Habitable" (green glow) or "Not Habitable" (red glow)
  - Displays confidence percentage with a circular progress indicator
- Sends POST request to `http://127.0.0.1:5000/predict` with the exact JSON structure provided
- Graceful error handling if backend is unreachable

## Page 3: Dashboard
- **Analytics panels** in glassmorphism style showing mock/sample data
- **Doughnut chart** showing habitability probability (using Recharts, already installed)
- **Bar chart** comparing planet feature values
- Stylish data summary cards with key metrics
- Note: Dashboard will display sample/demo data since there's no persistent data store

## Page 4: About
- Informational sections explaining:
  - What exoplanets are
  - What habitability means
  - How ML (Random Forest algorithm) is applied
  - NASA Exoplanet Archive dataset usage
- Clean layout with space-themed imagery and glassmorphism content cards

