# ============================================================
# SAHARA | FastAPI Backend — main.py
# Run: uvicorn app.main:app --reload
# Docs: http://localhost:8000/docs
# ============================================================

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import predict, hospitals, symptoms

app = FastAPI(
    title="SAHARA API",
    description="Smart AI Healthcare Assistance & Rapid Aid — Attock, Pakistan",
    version="1.0.0"
)

# ── CORS — allow React frontend ──────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Change to Vercel URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register Routers ─────────────────────────────────────
app.include_router(predict.router,   prefix="/predict",   tags=["Predictions"])
app.include_router(hospitals.router, prefix="/hospitals", tags=["Hospitals"])
app.include_router(symptoms.router,  prefix="/symptoms",  tags=["Symptoms"])

@app.get("/", tags=["Root"])
def root():
    return {
        "project": "SAHARA",
        "version": "1.0.0",
        "endpoints": {
            "step1_rf":  "POST /predict/step1",
            "step2_ann": "POST /predict/step2",
            "full":      "POST /predict/full",
            "symptoms":  "GET  /symptoms",
            "hospitals": "GET  /hospitals",
            "health":    "GET  /health"
        }
    }

@app.get("/health", tags=["Root"])
def health():
    return {"status": "ok", "models": "loaded"}
