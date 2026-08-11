# 🏛️ Aura Campus Digital Twin Platform

An interactive 3D Spatial Digital Twin & AI Copilot platform built with React, Vite, Three.js, Tailwind CSS, and Google Gemini 3.6 Flash.

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/rupamghosh3000/AuraCampus/deploy.yml?branch=main&label=GitHub%20Pages%20Deploy)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

🌐 **Live GitHub Pages Site**: [https://rupamghosh3000.github.io/AuraCampus/](https://rupamghosh3000.github.io/AuraCampus/)

---

## 🌟 Key Features

- **🎮 3D Digital Twin Viewer**: Interactive 3D visualization of campus buildings, floors, rooms, and facilities using Three.js.
- **🤖 Campus Copilot (AI Assistant)**: Real-time spatial query assistant powered by Google Gemini 3.6 Flash.
- **📍 Smart Indoor Navigation**: Dijkstra-based shortest-path routing between campus buildings and rooms.
- **📊 Real-time Telemetry & Management**: Live status tracking for equipment, faculty directory, classrooms, labs, and campus events.
- **💾 Offline-First Fallback**: Fully functional client-side offline mode with local storage persistence and mock telemetry fallback.

---

## 🚀 GitHub Repository & GitHub Pages

This repository is configured to push to:
`https://github.com/rupamghosh3000/AuraCampus`

### Quick Deployment Instructions

Run the following commands in your terminal:

```bash
git init
git add .
git commit -m "Deploy Aura Campus Digital Twin to GitHub Pages"
git branch -M main
git remote add origin https://github.com/rupamghosh3000/AuraCampus.git
git push -u origin main
```

---

## ⚙️ Enabling GitHub Pages

1. Go to repository settings: [https://github.com/rupamghosh3000/AuraCampus/settings/pages](https://github.com/rupamghosh3000/AuraCampus/settings/pages)
2. Under **Build and deployment** -> **Source**, select **GitHub Actions**.
3. GitHub Actions will build and deploy the site automatically. Your live application will be available at:
   👉 **[https://rupamghosh3000.github.io/AuraCampus/](https://rupamghosh3000.github.io/AuraCampus/)**

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Three.js, Tailwind CSS v4, Motion
- **Backend / API**: Express, TypeScript, Node.js, MongoDB
- **AI Engine**: Google Gen AI SDK (`@google/genai`), Gemini 3.6 Flash
- **CI/CD & Hosting**: GitHub Actions, GitHub Pages
