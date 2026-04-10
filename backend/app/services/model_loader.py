# SAHARA | Backend Service — model_loader.py


import joblib
import json
import numpy as np
import tensorflow as tf
import os

# ── Paths ────────────────────────────────────────────────
BASE = os.path.join(os.path.dirname(__file__), "..", "..", "..", "models")

def _path(filename):
    return os.path.join(BASE, filename)

# ── Load all models ───────────────────────────────────────
print("⏳ Loading SAHARA models...")

rf_model       = joblib.load(_path("rf_model.pkl"))
rf_encoder     = joblib.load(_path("label_encoder.pkl"))
symptom_list   = joblib.load(_path("symptom_list.pkl"))

ann_model      = tf.keras.models.load_model(_path("ann_model.h5"))
ann_encoder    = joblib.load(_path("ann_label_encoder.pkl"))
tfidf          = joblib.load(_path("tfidf_vectorizer.pkl"))

with open(_path("specialist_map.json")) as f:
    specialist_map = json.load(f)

print("✅ All models loaded!")

# ── Prediction helpers ────────────────────────────────────
def predict_rf(symptoms: list):
    """Random Forest: symptom list → disease + confidence"""
    vec = np.array([
        1 if sym in symptoms else 0
        for sym in symptom_list
    ]).reshape(1, -1)
    # Pad to match training feature size (binary + severity)
    expected = rf_model.n_features_in_
    if vec.shape[1] < expected:
        pad = np.zeros((1, expected - vec.shape[1]))
        vec = np.hstack([vec, pad])

    idx        = rf_model.predict(vec)[0]
    prob       = rf_model.predict_proba(vec)[0]
    confidence = float(np.max(prob))
    disease    = rf_encoder.inverse_transform([idx])[0]
    specialist = specialist_map.get(disease, "General Physician")
    return disease, round(confidence, 4), specialist

def predict_ann(symptom_text: str):
    """ANN: symptom text → disease + confidence"""
    vec        = tfidf.transform([symptom_text.lower()]).toarray()
    prob       = ann_model.predict(vec, verbose=0)[0]
    idx        = int(np.argmax(prob))
    confidence = float(np.max(prob))
    disease    = ann_encoder.inverse_transform([idx])[0]
    specialist = specialist_map.get(disease, "General Physician")
    return disease, round(confidence, 4), specialist
