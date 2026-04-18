# SAHARA | Routes — symptoms.py

from fastapi import APIRouter
from app.services.model_loader import symptom_list

router = APIRouter()

@router.get("/")
def get_all_symptoms():
    return {"total": len(symptom_list), "symptoms": symptom_list}

@router.get("/search")
def search_symptoms(q: str = ""):
    if not q:
        return {"symptoms": symptom_list[:20]}
    matches = [s for s in symptom_list if q.lower() in s.lower()]
    return {"total": len(matches), "symptoms": matches[:30]}
