# **App Name**: BioMind Insights

## Core Features:

- Firebase Realtime Data Streaming: Stream biosignal data (EEG, heart rate, temperature) from Firebase Realtime Database.
- Firebase User Data: Uses data saved to Firestore by user, to help compute metrics such as headache and migraine risks. 
- Real-time Biosignal Data Display: Display live heart rate, temperature, and EEG band levels using charts and gauges.
- Headache/Migraine Risk Prediction: Compute and display headache and migraine risk levels based on EEG, heart rate, and temperature data.
- Stress Level Calculation: Calculate and display stress levels based on heart rate and EEG data.
- Sleep Level/Quality Analysis: Determine sleep level and sleep quality based on EEG data, using LLM reasoning tool to classify different sleep patterns (Awake, Drowsy, Very sleepy, Possible microsleep risk).
- Session Report Generation: Generate a comprehensive session report with average heart rate, EEG levels, stress level, sleep patterns, and sentiment analysis, with simple LLM-driven recommendations.

## Style Guidelines:

- Primary color: Deep blue (#3F51B5) to convey calmness, intelligence, and trust in health monitoring.
- Background color: Light gray (#ECEFF1), a muted and desaturated shade of the primary color for a clean and professional backdrop.
- Accent color: Teal (#009688), an analogous color providing a refreshing contrast for interactive elements.
- Body and headline font: 'Inter', a grotesque-style sans-serif with a modern look, suitable for both headlines and body text.
- Use minimalist, clear icons to represent different data points and metrics. Consider health and wellness icons from Material Design.
- Responsive layout with clear sections for live data, historical charts, and reports. Prioritize key metrics for quick overview.
- Subtle animations for data updates and transitions to provide a smooth user experience.