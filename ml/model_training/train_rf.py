# ============================================================
# SAHARA | Model Training — Random Forest
# Input : data/features_rf.csv
# Output: models/rf_model.pkl, models/label_encoder.pkl
# Run   : python ml/model_training/train_rf.py
# ============================================================

import pandas as pd
import numpy as np
import joblib, json, os, warnings
warnings.filterwarnings("ignore")

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import LabelEncoder

os.makedirs("models", exist_ok=True)

SPECIALIST_MAP = {
    "Fungal infection": "Dermatologist",
    "Allergy": "General Physician",
    "GERD": "Gastroenterologist",
    "Chronic cholestasis": "Gastroenterologist",
    "Drug Reaction": "General Physician",
    "Peptic ulcer disease": "Gastroenterologist",
    "AIDS": "Infectious Disease Specialist",
    "Diabetes": "Endocrinologist",
    "Gastroenteritis": "Gastroenterologist",
    "Bronchial Asthma": "Pulmonologist",
    "Hypertension": "Cardiologist",
    "Migraine": "Neuro Surgeon",
    "Cervical spondylosis": "Orthopedic Surgeon",
    "Paralysis (brain hemorrhage)": "Neuro Surgeon",
    "Jaundice": "Gastroenterologist",
    "Malaria": "General Physician",
    "Chicken pox": "General Physician",
    "Dengue": "General Physician",
    "Typhoid": "General Physician",
    "hepatitis A": "Gastroenterologist",
    "Hepatitis B": "Gastroenterologist",
    "Hepatitis C": "Gastroenterologist",
    "Hepatitis D": "Gastroenterologist",
    "Hepatitis E": "Gastroenterologist",
    "Alcoholic hepatitis": "Gastroenterologist",
    "Tuberculosis": "Pulmonologist",
    "Common Cold": "General Physician",
    "Pneumonia": "Pulmonologist",
    "Dimorphic hemmorhoids(piles)": "General Surgeon",
    "Heart attack": "Cardiologist",
    "Varicose veins": "General Surgeon",
    "Hypothyroidism": "Endocrinologist",
    "Hyperthyroidism": "Endocrinologist",
    "Hypoglycemia": "Endocrinologist",
    "Osteoarthritis": "Orthopedic Surgeon",
    "Arthritis": "Orthopedic Surgeon",
    "(vertigo) Paroymsal  Positional Vertigo": "Neuro Surgeon",
    "Acne": "Dermatologist",
    "Urinary tract infection": "Urologist",
    "Psoriasis": "Dermatologist",
    "Impetigo": "Dermatologist",
}

def load_features():
    df = pd.read_csv("data/features_rf.csv")
    X  = df.drop("Disease", axis=1)
    y_raw = df["Disease"]
    le = LabelEncoder()
    y  = le.fit_transform(y_raw)
    print(f" Features loaded  : {X.shape}")
    print(f"   Classes         : {len(le.classes_)}")
    return X, y, le

def train_model(X, y):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"\n   Train samples   : {X_train.shape[0]}")
    print(f"   Test samples    : {X_test.shape[0]}")

    print("\n⏳ Training Random Forest (200 trees)...")
    rf = RandomForestClassifier(
        n_estimators=200,
        max_depth=None,
        min_samples_split=2,
        min_samples_leaf=1,
        random_state=42,
        n_jobs=-1
    )
    rf.fit(X_train, y_train)
    print(" Training complete!")
    return rf, X_test, y_test

def save_model(rf, le):
    joblib.dump(rf, "models/rf_model.pkl")
    joblib.dump(le, "models/label_encoder.pkl")
    with open("models/specialist_map.json", "w") as f:
        json.dump(SPECIALIST_MAP, f, indent=2)

    print("\n Saved → models/rf_model.pkl")
    print("Saved → models/label_encoder.pkl")
    print("Saved → models/specialist_map.json")
    return X_test, y_test

if __name__ == "__main__":
    print("=" * 55)
    print("  SAHARA | Model Training — Random Forest")
    print("=" * 55)
    X, y, le = load_features()
    rf, X_test, y_test = train_model(X, y)
    save_model(rf, le)
    # Save test data for evaluation
    np.save("data/rf_X_test.npy", X_test)
    np.save("data/rf_y_test.npy", y_test)
    print("\n Done. Next → python ml/model_training/train_ann.py")
