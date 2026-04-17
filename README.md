# SAHARA — Smart AI Healthcare Assistance & Rapid Aid
**AI-powered healthcare platform for Attock District, Pakistan**
> Built by Ayesha | Buildables AI/ML Fellowship 2025

---

## Project Structure

```
SAHARA/
├── backend/                  ← FastAPI Backend
│   ├── app/
│   │   ├── main.py           ← FastAPI app + CORS
│   │   ├── routes/
│   │   │   ├── predict.py    ← /predict/step1, /step2, /full
│   │   │   ├── hospitals.py  ← /hospitals
│   │   │   └── symptoms.py   ← /symptoms
│   │   └── services/
│   │       └── model_loader.py ← RF + ANN prediction logic
│   └── requirements.txt
│
├── frontend/                 ← React + Vite + Tailwind + Firebase
│   ├── src/
│   │   ├── firebase.js       ← Firebase config
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx ← Google Auth state
│   │   ├── components/
│   │   │   ├── Navbar.jsx    ← with login/logout
│   │   │   ├── Footer.jsx
│   │   │   └── Chatbot.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── AICheck.jsx   ← Step 1 + Step 2 AI
│   │   │   ├── Login.jsx     ← Google Sign In
│   │   │   ├── Doctors.jsx
│   │   │   ├── Hospitals.jsx
│   │   │   ├── Emergency.jsx ← GPS navigation
│   │   │   └── About.jsx
│   │   └── data/
│   │       └── data.js       ← 39 doctors, 34 hospitals
│   ├── .env                  ← API URL config
│   └── package.json
│
├── ml/                       ← ML Pipeline
│   ├── data_cleaning/        ← RF + ANN data cleaning
│   ├── eda/                  ← Exploratory Data Analysis
│   ├── feature_engineering/  ← TF-IDF + binary features
│   ├── model_training/
│   │   ├── train_rf.py       ← Random Forest
│   │   └── train_ann.py      ← ANN (improved with augmentation)
│   └── evaluation/           ← metrics + plots
│
├── models/                   ← Trained model files (.pkl, .h5)
├── data/                     ← Datasets (CSV, NPZ)
├── reports/figures/          ← EDA + evaluation plots
├── notebooks/                ← Jupyter notebooks
├── requirements.txt          ← All Python dependencies
└── README.md
```

---

## ML Models

| | Model | Dataset | Accuracy |
|--|-------|---------|----------|
| Step 1 | Random Forest (200 trees) | Kaggle — 41 diseases, 131 symptoms | ~98% |
| Step 2 | ANN (4 layers, TF-IDF 500 features) | HuggingFace gretelai/symptom_to_diagnosis | ~86% |

---

## How to Run Locally

### Step 1 — Setup

```bash
cd "D:\SAHARA FINAL\SAHARA"

# Virtual environment activate karo
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
```

### Step 2 — Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
# Runs on: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Step 3 — Frontend

```bash
# Naya terminal
cd frontend
npm install
npm run dev
# Runs on: http://localhost:5173
```

### Step 4 — ML (sirf retrain karna ho to)

```bash
# SAHARA root se — is order mein run karo:
python ml/data_cleaning/clean_rf_data.py
python ml/data_cleaning/clean_ann_data.py
python ml/feature_engineering/features_rf.py
python ml/feature_engineering/features_ann.py
python ml/model_training/train_rf.py
python ml/model_training/train_ann.py      # improved version
python ml/evaluation/evaluate_rf.py
python ml/evaluation/evaluate_ann.py
```

---

## Deployment

### Frontend → Vercel
1. GitHub pe push karo
2. vercel.com → New Project → GitHub repo
3. Framework: **Vite**
4. Environment Variable add karo:
   - `VITE_API_URL` = `https://your-render-url.onrender.com`
5. Deploy!

### Backend → Render
1. render.com → New Web Service
2. GitHub repo connect karo
3. Root Directory: `backend`
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Deploy → URL copy karo → frontend `.env` mein lagao

### Firebase Auth
- Google login already configured
- Vercel deploy ke baad Firebase Console mein:
  - Authentication → Settings → Authorized Domains
  - Add: `your-app.vercel.app`

---

## Dataset Sources

- **RF:** [Kaggle Disease Symptom Dataset](https://www.kaggle.com/datasets/itachi9604/disease-symptom-description-dataset)
- **ANN:** [HuggingFace gretelai/symptom_to_diagnosis](https://huggingface.co/datasets/gretelai/symptom_to_diagnosis)
- **Local:** Attock hospital & doctor registry (manually collected)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Auth | Firebase Auth (Google Sign-In) |
| Backend | FastAPI, Python 3.10 |
| ML | Scikit-learn (RF), TensorFlow/Keras (ANN) |
| Maps | OpenStreetMap + Google Maps |
| Deployment | Vercel + Render |

---

*SAHARA — Connecting Attock to better healthcare through AI* 🏥
