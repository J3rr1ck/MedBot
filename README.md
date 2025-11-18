<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1lcTy8nerFo5xPO9FyfiuRQovUeHdWE3c

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

# MedBot AI

**MediAssist AI** is an intelligent medical symptom analysis application powered by Google's Gemini 3 Pro model. It provides users with preliminary health assessments based on symptom descriptions and visual evidence, helping them understand potential conditions and determine appropriate next steps.

## Features

- **Symptom Analysis**: Describe your symptoms in detail through a user-friendly text interface
- **Visual Evidence Support**: Upload up to 5 images (JPG, PNG, WebP) to help the AI analyze visual markers like rashes, swelling, or discoloration
- **AI-Powered Diagnosis**: Leverages Gemini 3 Pro to analyze symptoms and provide:
  - Potential medical conditions with probability ratings
  - Urgency level assessment (Low, Medium, High, Emergency)
  - Recommended actions and next steps
  - Questions to ask your healthcare provider
  - Comprehensive medical disclaimers
- **Modern UI**: Clean, responsive interface built with React, TypeScript, and Tailwind CSS
- **Safety First**: Mandatory medical disclaimer that must be accepted before use

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **AI Model**: Google Gemini 3 Pro (`gemini-3-pro-preview`)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Important Disclaimer

⚠️ **This application is for informational purposes only and is not a medical device.** It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.
