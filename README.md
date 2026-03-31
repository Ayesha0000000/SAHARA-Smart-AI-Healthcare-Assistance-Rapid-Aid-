# 🏥 SAHARA – Smart AI Healthcare Assistance & Rapid Aid

> An AI-powered healthcare platform for Attock, Pakistan — combining symptom checking, emergency navigation, and appointment booking.

![Tech Stack](https://img.shields.io/badge/Frontend-React-blue) ![Backend](https://img.shields.io/badge/Backend-FastAPI-green) ![ML](https://img.shields.io/badge/ML-RandomForest%20%2B%20ANN-orange) ![DB](https://img.shields.io/badge/DB-Firebase-yellow)

---

## 🚀 Live Demo
- **Frontend (Vercel):** _Coming Soon_
- **Backend (Render):** _Coming Soon_

---

## 📌 Problem Statement
In Attock, patients struggle to:
- Find the right doctor for their symptoms
- Navigate to hospitals in emergencies
- Book appointments online

SAHARA solves this with a unified AI-powered platform — 100% free stack, built for rural Pakistan.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤒 **Symptom Checker** | 2-step AI diagnosis: Random Forest (quick check) → ANN (detailed prediction + specialist) |
| 🤖 **AI Chatbot** | Website assistant for doctor info, appointments, hospital details |
| 🚨 **Emergency Mode** | Live GPS → nearest hospital on map + turn-by-turn directions |
| 📅 **Appointments** | Book, view, and manage doctor appointments |
| 🔐 **Auth** | Guest access + Firebase Auth (email/Google) |

---

## 🛠️ Tech Stack

```
Frontend   → React.js (deployed on Vercel)
Backend    → FastAPI (deployed on Render/Railway)
Auth & DB  → Firebase Auth + Firestore
ML Models  → Scikit-learn (Random Forest) + TensorFlow/Keras (ANN)
Maps       → OpenStreetMap + Leaflet.js + Nominatim
```

---

## 📁 Project Structure

```
SAHARA/
├── frontend/               # React app
│   └── src/
│       ├── components/
│       │   ├── Navbar/
│       │   ├── SymptomChecker/
│       │   ├── Chatbot/
│       │   ├── Emergency/
│       │   └── Appointments/
│       └── pages/
├── backend/                # FastAPI app
│   ├── routes/             # API endpoints
│   ├── models/             # Pydantic models
│   └── utils/              # Helpers
├── ml/                     # ML/DL code
│   ├── notebooks/          # Jupyter notebooks
│   ├── models/             # Saved .pkl / .h5 models
│   └── data/               # Datasets
└── docs/                   # SRS, report, slides
```

---

## 🤖 ML Models

### Model 1 — Random Forest (Step 1: Quick Check)
- **Dataset:** Kaggle Disease Symptom Description Dataset (41 diseases)
- **Library:** Scikit-learn
- **Task:** Quick symptom-to-disease category classification

### Model 2 — ANN (Step 2: Detailed Prediction)
- **Dataset:** HuggingFace `gretelai/symptom_to_diagnosis`
- **Library:** TensorFlow / Keras
- **Task:** Detailed disease prediction + specialist recommendation
- **Metrics:** Accuracy, F1, Precision, Recall

---

## ⚙️ Local Setup

### Prerequisites
- Node.js >= 18
- Python >= 3.10
- Firebase project (Auth + Firestore)

### 1. Clone the repo
```bash
git clone https://github.com/Ayesha0000000/SAHARA-Smart-AI-Healthcare-Assistance-Rapid-Aid-.git
cd SAHARA-Smart-AI-Healthcare-Assistance-Rapid-Aid-
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env    # Add your Firebase config
npm run dev
```

### 3. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 4. ML Notebooks
```bash
cd ml
pip install -r requirements.txt
jupyter notebook
```

---

## 🔑 Environment Variables

### Frontend (`frontend/.env`)
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_BACKEND_URL=http://localhost:8000
```

### Backend (`backend/.env`)
```
FIREBASE_SERVICE_ACCOUNT_KEY=path/to/serviceAccountKey.json
```

---

## 📊 Datasets
- [Kaggle — Disease Symptom Description Dataset](https://www.kaggle.com/)
- [HuggingFace — gretelai/symptom_to_diagnosis](https://huggingface.co/datasets/gretelai/symptom_to_diagnosis)
- Attock hospital & doctor registry (manually collected)

---

## 📚 References
- [Symptom-Based Disease Prediction Using ML (RFC vs MLP) — ResearchGate 2025](https://www.researchgate.net/publication/392157203)
- [Comparing Supervised ML Algorithms for Disease Prediction — PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC6925840)
- [Web-Based Disease Prediction Using ML — IEEE 2024](https://ieeexplore.ieee.org/document/11042494)

---

## 👩‍💻 Author
**Ayesha** — [gmayesha2004@gmail.com](mailto:gmayesha2004@gmail.com)

---

## 📄 License
This project is for academic purposes. All rights reserved.
