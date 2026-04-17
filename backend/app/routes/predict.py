# SAHARA | Routes - predict.py
# Flow: Groq NLP -> RF (category) -> ANN (disease) -> Groq (advice)

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services.model_loader import predict_rf, predict_ann
from app.services.nlp_utils import get_disease_category
from app.services.groq_service import (
    groq_extract_symptoms,
    groq_quick_analysis,
    groq_advanced_analysis,
)

router = APIRouter()


class Step1Request(BaseModel):
    symptoms: List[str]

class Step2Request(BaseModel):
    symptom_text: str

class TopDisease(BaseModel):
    disease: str
    confidence: float
    specialist: str

class PredictionResult(BaseModel):
    category: str
    disease: str
    confidence: float
    specialist: str
    model: str
    confidence_level: str
    show_disease: bool
    possible_conditions: List[TopDisease]
    advice: str
    note: str
    home_treatment: Optional[str] = ""
    precautions_list: Optional[List[str]] = []
    warning: Optional[str] = ""
    severity: Optional[str] = ""

class FullResponse(BaseModel):
    step1: PredictionResult
    step2: PredictionResult
    recommendation: str


def get_confidence_label(conf: float) -> str:
    if conf >= 0.75:
        return "High"
    elif conf >= 0.50:
        return "Medium"
    else:
        return "Low"


def expand_for_ann(text: str) -> str:
    """Short input ko ANN ke liye expand karo"""
    text = text.strip().lower()
    if len(text.split()) <= 8:
        return (
            f"I have {text} as my main symptoms. "
            f"I am experiencing {text}. "
            f"Symptoms: {text}."
        )
    return text


@router.post("/step1", response_model=PredictionResult)
def step1_predict(req: Step1Request):
    """
    Quick Check:
    1. Groq NLP - extract + normalize symptoms
    2. RF - disease category
    3. ANN - disease prediction
    4. Groq - quick advice
    """
    if not req.symptoms:
        raise HTTPException(400, "Provide at least one symptom")

    raw_text = ", ".join(req.symptoms)

    # Step 1: Groq NLP
    nlp_symptoms = groq_extract_symptoms(raw_text)
    if not nlp_symptoms:
        nlp_symptoms = req.symptoms

    # Step 2: RF - category only
    rf_disease, rf_conf, rf_spec = predict_rf(nlp_symptoms)
    category = get_disease_category(rf_disease)

    # Step 3: ANN - disease prediction
    ann_text = expand_for_ann(raw_text)
    ann_disease, ann_conf, ann_spec, top3 = predict_ann(ann_text)

    # Step 4: Groq - quick advice
    groq_result = groq_quick_analysis(nlp_symptoms, category, ann_disease, ann_conf)

    conf_label = get_confidence_label(ann_conf)
    final_disease = groq_result.get("disease", ann_disease)
    final_spec = groq_result.get("specialist", ann_spec)

    if ann_conf >= 0.75:
        note = "Our AI is highly confident about this prediction."
    elif ann_conf >= 0.50:
        note = "Possible condition identified. Add more symptoms for better accuracy."
    else:
        note = "Low confidence — please add more symptoms or try Advanced AI Check."

    return PredictionResult(
        category=category,
        disease=final_disease,
        confidence=round(ann_conf, 4),
        specialist=final_spec,
        model="Random Forest",
        confidence_level=conf_label,
        show_disease=True,
        possible_conditions=[],
        advice=groq_result.get("advice", "Consult a General Physician."),
        note=note,
        home_treatment="",
        precautions_list=[],
        warning=groq_result.get("warning", ""),
        severity="",
    )


@router.post("/step2", response_model=PredictionResult)
def step2_predict(req: Step2Request):
    """
    Advanced Check:
    1. Groq NLP - extract symptoms
    2. RF - category
    3. ANN - top 3 diseases
    4. Groq - full detailed analysis
    """
    if not req.symptom_text.strip():
        raise HTTPException(400, "Provide symptom description")

    # Step 1: Groq NLP
    nlp_symptoms = groq_extract_symptoms(req.symptom_text)

    # Step 2: RF - category
    category = "General Health"
    if nlp_symptoms:
        rf_disease, _, _ = predict_rf(nlp_symptoms)
        category = get_disease_category(rf_disease)

    # Step 3: ANN - top 3
    ann_text = expand_for_ann(req.symptom_text)
    disease, conf, spec, top3_raw = predict_ann(ann_text)

    top3 = [
        TopDisease(
            disease=item["disease"],
            confidence=item["confidence"],
            specialist=item["specialist"]
        ) for item in top3_raw
    ]

    # Step 4: Groq - full analysis
    groq_result = groq_advanced_analysis(
        symptom_text=req.symptom_text,
        rf_category=category,
        ann_disease=disease,
        ann_top3=top3_raw,
        ann_confidence=conf,
    )

    conf_label = get_confidence_label(conf)
    final_disease = groq_result.get("disease", disease)
    final_spec = groq_result.get("specialist", spec)

    if conf >= 0.75:
        note = "Our AI is highly confident about this prediction."
    elif conf >= 0.50:
        note = "Possible condition identified. Consult a doctor for confirmation."
    else:
        note = "Low confidence — please describe symptoms in more detail."

    return PredictionResult(
        category=groq_result.get("category", category),
        disease=final_disease,
        confidence=round(conf, 4),
        specialist=final_spec,
        model="ANN (Deep Learning)",
        confidence_level=conf_label,
        show_disease=True,
        possible_conditions=top3,
        advice=groq_result.get("advice", "Consult a General Physician."),
        note=note,
        home_treatment=groq_result.get("home_treatment", ""),
        precautions_list=groq_result.get("precautions", []),
        warning=groq_result.get("warning", ""),
        severity=groq_result.get("severity", ""),
    )


@router.post("/full", response_model=FullResponse)
def full_predict(req: Step1Request):
    if not req.symptoms:
        raise HTTPException(400, "Provide at least one symptom")

    raw_text = ", ".join(req.symptoms)
    nlp_symptoms = groq_extract_symptoms(raw_text)
    if not nlp_symptoms:
        nlp_symptoms = req.symptoms

    rf_disease, _, _ = predict_rf(nlp_symptoms)
    category = get_disease_category(rf_disease)

    ann_text = expand_for_ann(raw_text)
    ann_disease, ann_conf, ann_spec, top3_raw = predict_ann(ann_text)

    top3 = [TopDisease(disease=d["disease"], confidence=d["confidence"], specialist=d["specialist"]) for d in top3_raw]
    groq_q = groq_quick_analysis(nlp_symptoms, category, ann_disease, ann_conf)
    conf_label = get_confidence_label(ann_conf)

    step1 = PredictionResult(
        category=category, disease=groq_q.get("disease", ann_disease),
        confidence=round(ann_conf, 4), specialist=groq_q.get("specialist", ann_spec),
        model="Random Forest", confidence_level=conf_label, show_disease=True,
        possible_conditions=[], advice=groq_q.get("advice", ""),
        note="Quick analysis.", home_treatment="", precautions_list=[],
        warning=groq_q.get("warning", ""), severity=""
    )
    step2 = PredictionResult(
        category=category, disease=ann_disease,
        confidence=round(ann_conf, 4), specialist=ann_spec,
        model="ANN", confidence_level=conf_label, show_disease=True,
        possible_conditions=top3, advice=groq_q.get("advice", ""),
        note="Detailed analysis.", home_treatment="", precautions_list=[],
        warning="", severity=""
    )

    return FullResponse(step1=step1, step2=step2,
                        recommendation=f"Consult {ann_spec} for {ann_disease}.")