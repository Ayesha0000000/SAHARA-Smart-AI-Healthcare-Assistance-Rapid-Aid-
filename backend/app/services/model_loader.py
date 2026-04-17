# SAHARA | Backend Service - model_loader.py

import joblib
import json
import numpy as np
import pandas as pd
import tensorflow as tf
import os

BASE = os.path.join(os.path.dirname(__file__), "..", "..", "..", "models")

def _path(filename):
    return os.path.join(BASE, filename)

print("Loading SAHARA models...")

rf_model     = joblib.load(_path("rf_model.pkl"))
rf_encoder   = joblib.load(_path("label_encoder.pkl"))
symptom_list = joblib.load(_path("symptom_list.pkl"))

ann_model    = tf.keras.models.load_model(_path("ann_model.h5"))
ann_encoder  = joblib.load(_path("ann_label_encoder.pkl"))
tfidf        = joblib.load(_path("tfidf_vectorizer.pkl"))

with open(_path("specialist_map.json")) as f:
    specialist_map = json.load(f)

RF_FEATURE_COLS = list(symptom_list) + [f"{s}_sev" for s in symptom_list]

print("All models loaded!")


def _expand_symptom_text(text: str) -> str:
    """ANN ke liye short input ko medical sentence mein convert"""
    text = text.strip().lower()
    words = text.split()
    if len(words) <= 4:
        return (
            f"The patient is suffering from {text}. "
            f"Main complaints include {text}. "
            f"Symptoms present: {text}."
        )
    return text


def predict_rf(normalized_symptoms: list):
    """
    Random Forest: normalized symptom list → disease category
    Input: already normalized symptoms from NLP layer
    """
    row = {col: 0 for col in RF_FEATURE_COLS}
    for sym in normalized_symptoms:
        if sym in row:
            row[sym] = 1
        sev_key = f"{sym}_sev"
        if sev_key in row:
            row[sev_key] = 1

    vec = pd.DataFrame([row])
    expected = rf_model.n_features_in_
    if vec.shape[1] < expected:
        for i in range(expected - vec.shape[1]):
            vec[f"extra_{i}"] = 0
    elif vec.shape[1] > expected:
        vec = vec.iloc[:, :expected]

    idx        = rf_model.predict(vec)[0]
    prob       = rf_model.predict_proba(vec)[0]
    confidence = float(np.max(prob))
    disease    = rf_encoder.inverse_transform([idx])[0]
    specialist = specialist_map.get(disease, "General Physician")
    return disease, round(confidence, 4), specialist


def predict_ann(symptom_text: str):
    """ANN: symptom text → disease + top3"""
    expanded = _expand_symptom_text(symptom_text)
    vec  = tfidf.transform([expanded]).toarray()
    prob = ann_model.predict(vec, verbose=0)[0]

    # Top prediction
    idx        = int(np.argmax(prob))
    confidence = float(np.max(prob))
    disease    = ann_encoder.inverse_transform([idx])[0]
    specialist = specialist_map.get(disease, "General Physician")

    # Top 3
    top3_idx = np.argsort(prob)[::-1][:3]
    top3 = []
    for i in top3_idx:
        d = ann_encoder.inverse_transform([i])[0]
        s = specialist_map.get(d, "General Physician")
        top3.append({
            "disease": d,
            "confidence": round(float(prob[i]), 4),
            "specialist": s
        })

    return disease, round(confidence, 4), specialist, top3