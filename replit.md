# NeuroAssist - Brain Tumor Detection Chatbot

## Overview
A static web application for brain tumor detection consultations. Users can register with an MRI image, sign in, and chat with an AI medical assistant (NeuroAssist).

## Architecture
- **Type**: Pure static frontend (HTML/CSS/JS)
- **Backend API**: External service at `https://gaykar-neuroassist.hf.space`
- **Server**: Node.js HTTP server (`server.js`) serving static files on port 5000

## Pages
- `signin.html` - Landing page / Sign in (default route)
- `register.html` - New user registration with MRI image upload
- `chatbot.html` - Main chatbot interface
- `dashboard.html` - Post-registration success page

## Running the App
The app runs via the "Start application" workflow:
```
node server.js
```
Serves all static files on `0.0.0.0:5000`.

## Deployment
Configured as autoscale deployment running `node server.js`.
