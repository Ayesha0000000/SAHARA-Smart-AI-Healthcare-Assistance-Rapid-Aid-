<div align="center">

# 🏥 SAHARA
## Smart AI Healthcare Assistance & Rapid Aid

**An AI-powered healthcare platform for Attock District, Pakistan**
*Bridging the gap between patients and healthcare through intelligent technology*

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_App-brightgreen?style=for-the-badge)](https://sahara-smart-ai-healthcare-assistan.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/Ayesha0000000/SAHARA-Smart-AI-Healthcare-Assistance-Rapid-Aid-)
[![HuggingFace](https://img.shields.io/badge/🤗_HuggingFace-Models-yellow?style=for-the-badge)](https://huggingface.co/Ayesh104/SAHARA-Model)
[![Medium](https://img.shields.io/badge/Medium-Article-black?style=for-the-badge&logo=medium)](https://medium.com/@gmayesha2004/sahara-smart-ai-healthcare-assistance-rapid-aid-aae442b26c4d)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.10-blue?style=for-the-badge&logo=python)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)

---

*Built by **Ayesha** | Buildables AI/ML Fellowship 2025 | Attock, Pakistan*

</div>

---

## 🌟 What is SAHARA?

SAHARA is a full-stack AI-powered healthcare web application designed specifically for the underserved communities of **Attock District, Pakistan**. It combines Machine Learning, Deep Learning, and Natural Language Processing to provide instant symptom-based disease prediction, local doctor recommendations, and emergency navigation — all in one platform.

> *"From symptoms to specialist — SAHARA guides you every step of the way."*

---

## 🚨 Problem Statement

Attock District, located in Punjab, Pakistan, faces a severe healthcare crisis:

- 🏥 **Limited Specialist Access** — Most specialist doctors are concentrated in Rawalpindi/Islamabad, far from rural Attock residents
- 📋 **No Digital Directory** — There is no centralized, searchable database of local doctors and hospitals
- 🌐 **Language Barrier** — Most healthcare apps are English-only, excluding Urdu-speaking rural population
- ⏱️ **Delayed Diagnosis** — Patients waste hours and money visiting wrong specialists due to lack of guidance
- 🚨 **Emergency Response** — No GPS-based system to locate the nearest hospital during emergencies

**SAHARA solves all of these problems** with a single AI-powered platform that is bilingual, mobile-friendly, and tailored specifically for Attock District.

---

## 🚀 Live Deployment

| Service | Platform | Link |
|---------|----------|------|
| 🌐 Frontend | Vercel | [sahara-smart-ai-healthcare-assistan.vercel.app](https://sahara-smart-ai-healthcare-assistan.vercel.app/) |
| ⚙️ Backend | Hugging Face | [SAHARA Backend](https://huggingface.co/spaces/Ayesh104/SAHARA-backend?logs=container) |
| 🤗 ML Models | HuggingFace | [Ayesh104/SAHARA-Model](https://huggingface.co/Ayesh104/SAHARA-Model) |
| 💻 Source Code | GitHub | [SAHARA Repository](https://github.com/Ayesha0000000/SAHARA-Smart-AI-Healthcare-Assistance-Rapid-Aid-) |
| 📝 Medium Article | Medium | [Read Article](https://medium.com/@gmayesha2004/sahara-smart-ai-healthcare-assistance-rapid-aid-aae442b26c4d) |
| 🎥 Demo Video | YouTube | *Coming Soon* |

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Symptom Checker** | Two-step ML/DL diagnosis — Random Forest + ANN + Groq LLaMA |
| 🧠 **Smart NLP** | Understands Urdu & English symptoms using Groq AI |
| 👨‍⚕️ **Doctor Finder** | 39 verified local doctors in Attock with WhatsApp contact |
| 🏥 **Hospital Directory** | 34 hospitals with location and services |
| 🚨 **Emergency Navigation** | GPS-based nearest hospital routing |
| 🔐 **Google Auth** | Secure login via Firebase Authentication |
| 💬 **Chatbot** | Assistant for general queries |
| 📱 **Mobile Responsive** | Works seamlessly on any device |

---

## 🧠 AI Pipeline

```
User Input (English / Urdu)
        ↓
🔤 Groq LLaMA NLP Layer
   Extract & normalize symptoms
        ↓
🌲 Random Forest (Step 1)
   Detect disease CATEGORY
   (Viral / Bacterial / Metabolic...)
        ↓
🧬 ANN Deep Learning (Step 2)
   Predict TOP 3 diseases + confidence
        ↓
🤖 Groq LLaMA Analysis
   Personalized advice + home treatment + warnings
        ↓
📊 Structured Result
   Disease | Confidence | Specialist | Doctors
```

---

## 📊 ML Models Performance

| Model | Dataset | Features | Accuracy |
|-------|---------|----------|----------|
| 🌲 **Random Forest** | Kaggle — 41 diseases, 4920 samples | 131 binary symptoms | **~98%** |
| 🧬 **ANN** (4 layers) | HuggingFace gretelai/symptom_to_diagnosis | TF-IDF 500 features | **~86%** |

### Model Architecture

**Random Forest:**
- 200 estimators
- max_depth = 20
- Trained on binary symptom vectors (131 features)
- Predicts disease category in Step 1

**ANN (Artificial Neural Network):**
```
Input(500) → Dense(256, ReLU) → Dropout(0.3)
           → Dense(128, ReLU) → Dropout(0.3)
           → Dense(22, Softmax)
```

> 📊 *Confusion matrices and accuracy graphs are available in `reports/figures/`*

---

## 🛠️ Tech Stack

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│  React 18  •  Vite  •  Tailwind CSS  •  Firebase   │
│  React Router  •  Leaflet Maps  •  Framer Motion    │
├─────────────────────────────────────────────────────┤
│                    BACKEND                           │
│  FastAPI  •  Python 3.10  •  Uvicorn  •  Pydantic  │
│  Groq LLaMA API  •  CORS Middleware                 │
├─────────────────────────────────────────────────────┤
│                  ML / AI LAYER                       │
│  Scikit-learn (RF)  •  TensorFlow/Keras (ANN)      │
│  TF-IDF Vectorizer  •  Groq LLaMA 3.3-70B          │
│  Joblib  •  NumPy  •  Pandas                        │
├─────────────────────────────────────────────────────┤
│                  DEPLOYMENT                          │
│  Vercel (Frontend)  •  Render (Backend)             │
│  HuggingFace (Models)  •  Firebase (Auth)           │
└─────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
SAHARA/
├── 🖥️ backend/
│   ├── app/
│   │   ├── main.py              ← FastAPI app + CORS
│   │   ├── routes/
│   │   │   ├── predict.py       ← /predict/step1, /step2
│   │   │   ├── hospitals.py     ← /hospitals
│   │   │   └── symptoms.py      ← /symptoms
│   │   └── services/
│   │       ├── model_loader.py  ← RF + ANN prediction
│   │       ├── groq_service.py  ← Groq LLaMA integration
│   │       └── nlp_utils.py     ← NLP utilities
│   └── requirements.txt
│
├── 🎨 frontend/
│   └── src/
│       ├── pages/
│       │   ├── AICheck.jsx      ← Smart symptom checker
│       │   ├── Doctors.jsx      ← 39 local doctors
│       │   ├── Hospitals.jsx    ← 34 hospitals
│       │   ├── Emergency.jsx    ← GPS navigation
│       │   └── Home.jsx
│       └── components/
│           ├── Navbar.jsx
│           ├── Footer.jsx
│           └── Chatbot.jsx
│
├── 🤖 ml/
│   ├── data_cleaning/           ← RF + ANN data cleaning
│   ├── eda/                     ← Exploratory Data Analysis
│   ├── feature_engineering/     ← TF-IDF + binary features
│   ├── model_training/
│   │   ├── train_rf.py          ← Random Forest training
│   │   └── train_ann.py         ← ANN training
│   └── evaluation/              ← Metrics + confusion matrix
│
├── 📊 models/                   ← Trained model files
├── 📁 data/                     ← Datasets (CSV)
├── 📈 reports/figures/          ← EDA + evaluation plots
├── 📜 LICENSE                   ← MIT License
└── 📖 README.md
```

---

## ⚡ Run Locally

```bash
# 1. Clone repository
git clone https://github.com/Ayesha0000000/SAHARA-Smart-AI-Healthcare-Assistance-Rapid-Aid-.git
cd SAHARA-Smart-AI-Healthcare-Assistance-Rapid-Aid-

# 2. Setup virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

# 3. Setup environment variables
# Create backend/.env file with:
# GROQ_API_KEY=your_groq_api_key_here

# 4. Run Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
# → http://localhost:8000
# → API Docs: http://localhost:8000/docs

# 5. Run Frontend (new terminal)
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### Prerequisites
- Python 3.10+
- Node.js 18+
- Groq API Key (free at [console.groq.com](https://console.groq.com))
- Firebase project (for Google Auth)

---

## 📊 Dataset Sources

| Dataset | Source | Size |
|---------|--------|------|
| Disease-Symptom (RF) | [Kaggle — itachi9604](https://www.kaggle.com/datasets/itachi9604/disease-symptom-description-dataset) | 41 diseases, 131 symptoms, 4920 samples |
| Symptom-to-Diagnosis (ANN) | [HuggingFace — gretelai](https://huggingface.co/datasets/gretelai/symptom_to_diagnosis) | 22 diseases, 1065 samples |
| Attock Doctors & Hospitals | Manually collected & verified | 39 doctors, 34 hospitals |

---

## 📱 Screenshots

<div align="center">

### 🖥️ Desktop View
![SAHARA Desktop](reports/Screenshots/PC/1.png)

### 📱 Mobile View
![SAHARA Mobile](reports/Screenshots/Mobile/2.png)

</div>

---

## 🌍 Real-World Impact

- 🏘️ Serves **Attock District** — a rural area with limited healthcare access
- 👨‍⚕️ Connects patients with **39 verified local doctors** instantly via WhatsApp
- 🏥 Maps **34 hospitals** with real-time GPS navigation
- 🗣️ Supports **Urdu + English** — accessible to local population
- 📱 Fully **mobile responsive** — works on any device
- ⚡ Provides **instant AI diagnosis** — reducing unnecessary hospital visits

---

## 📝 Documentation

| Resource | Link |
|----------|------|
| 📄 Medium Article | [SAHARA — Smart AI Healthcare Assistance & Rapid Aid](https://medium.com/@gmayesha2004/sahara-smart-ai-healthcare-assistance-rapid-aid-aae442b26c4d) |
| 🤗 ML Models | [HuggingFace — Ayesh104/SAHARA-Model](https://huggingface.co/Ayesh104/SAHARA-Model) |
| 🎥 Demo Video | *Coming Soon* |
| 📊 Final Report | `reports/SAHARA_Final_Report.pdf` |
| 🖥️ Presentation | `reports/SAHARA_Presentation.pdf` |

---

## 🙏 Acknowledgements

- **Buildables AI/ML Fellowship 2025** — for the opportunity and mentorship
- **Kaggle** — Disease-Symptom dataset by [itachi9604](https://www.kaggle.com/itachi9604)
- **HuggingFace** — symptom_to_diagnosis dataset by [gretelai](https://huggingface.co/gretelai)
- **Groq AI** — for blazing-fast LLaMA 3.3-70B API access
- **Firebase** — authentication infrastructure
- **Vercel** — free deployment platform for students

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

You are free to use, modify, and distribute this project with proper attribution.

---

## 👩‍💻 Author

<div align="center">

**Ayesha**
*AI/ML Fellow — Buildables Fellowship 2025*
📍 Attock, Punjab, Pakistan

[![Email](https://img.shields.io/badge/Email-gmayesha2004@gmail.com-red?style=flat-square&logo=gmail)](mailto:gmayesha2004@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-Ayesha0000000-black?style=flat-square&logo=github)](https://github.com/Ayesha0000000)
[![HuggingFace](https://img.shields.io/badge/HuggingFace-Ayesh104-yellow?style=flat-square)](https://huggingface.co/Ayesh104)
[![Medium](https://img.shields.io/badge/Medium-gmayesha2004-black?style=flat-square&logo=medium)](https://medium.com/@gmayesha2004)

</div>

---

<div align="center">

*SAHARA — Connecting Attock to better healthcare through AI* 🏥

⭐ **Star this repo if you found it helpful!**

</div>
