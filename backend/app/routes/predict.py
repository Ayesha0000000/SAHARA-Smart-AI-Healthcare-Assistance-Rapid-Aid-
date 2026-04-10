# ============================================================
# SAHARA | Routes — predict.py
# Endpoints: /predict/step1, /predict/step2, /predict/full
# ============================================================

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.services.model_loader import predict_rf, predict_ann

router = APIRouter()

# ── Schemas ───────────────────────────────────────────────
class Step1Request(BaseModel):
    symptoms: List[str]      # ["fever", "cough", "fatigue"]

class Step2Request(BaseModel):
    symptom_text: str        # "I have fever, cough and chest pain"

class PredictionResult(BaseModel):
    disease: str
    confidence: float
    specialist: str
    model: str

class FullResponse(BaseModel):
    step1: PredictionResult
    step2: PredictionResult
    recommendation: str

# ── Endpoints ─────────────────────────────────────────────
@router.post("/step1", response_model=PredictionResult)
def step1_predict(req: Step1Request):
    """Step 1 — Random Forest quick symptom check"""
    if not req.symptoms:
        raise HTTPException(400, "Provide at least one symptom")
    disease, conf, spec = predict_rf(req.symptoms)
    return PredictionResult(
        disease=disease, confidence=conf,
        specialist=spec, model="Random Forest"
    )

@router.post("/step2", response_model=PredictionResult)
def step2_predict(req: Step2Request):
    """Step 2 — ANN detailed diagnosis"""
    if not req.symptom_text.strip():
        raise HTTPException(400, "Provide symptom description")
    disease, conf, spec = predict_ann(req.symptom_text)
    return PredictionResult(
        disease=disease, confidence=conf,
        specialist=spec, model="ANN (Deep Learning)"
    )

@router.post("/full", response_model=FullResponse)
def full_predict(req: Step1Request):
    """Both models — returns RF + ANN result + final recommendation"""
    if not req.symptoms:
        raise HTTPException(400, "Provide at least one symptom")

    # Step 1: RF
    d1, c1, s1 = predict_rf(req.symptoms)
    # Step 2: ANN (use symptom list as text)
    text = ", ".join(req.symptoms)
    d2, c2, s2 = predict_ann(text)

    step1 = PredictionResult(disease=d1, confidence=c1, specialist=s1, model="Random Forest")
    step2 = PredictionResult(disease=d2, confidence=c2, specialist=s2, model="ANN")

    # Final: higher confidence wins
    if c2 >= c1:
        rec = f"Detailed analysis suggests: {d2}. Please consult a {s2}."
    else:
        rec = f"Quick check suggests: {d1}. Please consult a {s1}."

    return FullResponse(step1=step1, step2=step2, recommendation=rec)
