from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class SymptomRequest(BaseModel):
    symptoms: List[str]

@router.post("/predict")
def predict_disease(request: SymptomRequest):
    # Step 1: Random Forest | Step 2: ANN
    # TODO: Load trained models
    return {
        "step1_rf": {"disease_category": "placeholder", "confidence": 0.0},
        "step2_ann": {"disease": "placeholder", "specialist": "General Physician", "confidence": 0.0}
    }
