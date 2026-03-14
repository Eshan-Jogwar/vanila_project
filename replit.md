# NeuroAssist - Brain Tumor Detection Chatbot

## Overview
A React + Vite web application for brain tumor detection consultations. Users can register with an MRI image, sign in, and chat with an AI medical assistant (NeuroAssist).

## Architecture
- **Frontend**: React 18 + Vite, React Router v6 for client-side routing
- **Backend API**: External service at `https://gaykar-neuroassist.hf.space`
- **Port**: 5000

## Pages / Routes
- `/signin` - Sign in page (default redirect)
- `/register` - New user registration with MRI image upload
- `/chatbot` - Main chatbot interface (protected route)

## Project Structure
```
src/
  main.jsx          - React entry point
  App.jsx           - Router setup with protected/public routes
  pages/
    SignIn.jsx      - Sign in form + SignIn.css
    Register.jsx    - Registration form with MRI upload + Register.css
    Chatbot.jsx     - Chat interface + Chatbot.css
```

## Running the App
The app runs via the "Start application" workflow:
```
npm run dev
```
Serves on `0.0.0.0:5000` with Vite dev server.

## Auth
Uses `localStorage` for `auth_token` and `patient_data`. Protected routes redirect to `/signin`, and authenticated users are redirected away from public routes.

## Deployment
Configured as autoscale deployment running `npm run dev`.
