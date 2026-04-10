# ============================================================
# SAHARA | Feature Engineering — Random Forest
# Input : data/cleaned_rf.csv, data/cleaned_severity.csv
# Output: data/features_rf.csv, models/symptom_list.pkl
# Run   : python ml/feature_engineering/features_rf.py
# ============================================================

import pandas as pd
import numpy as np
import joblib, os, warnings
warnings.filterwarnings("ignore")

os.makedirs("models", exist_ok=True)

def load_cleaned():
    df  = pd.read_csv("data/cleaned_rf.csv")
    sev = pd.read_csv("data/cleaned_severity.csv")
    print(f" Loaded cleaned RF data : {df.shape}")
    return df, sev

def build_features(df, sev):
    sym_cols = [c for c in df.columns if c.startswith("Symptom_")]

    # Build severity weight map: symptom → weight
    severity_map = dict(zip(sev["Symptom"], sev["weight"]))

    # All unique symptoms
    all_symptoms = sorted(set(
        s for col in sym_cols
        for s in df[col].unique() if s != "none"
    ))
    print(f"   Unique symptoms found  : {len(all_symptoms)}")

    # ── Option A: Binary encoding (0/1 per symptom) ──────
    print("⏳ Building binary feature matrix...")
    def encode_row_binary(row):
        present = set(row[sym_cols].values)
        return {sym: int(sym in present) for sym in all_symptoms}

    feature_df = df.apply(encode_row_binary, axis=1, result_type="expand")

    # ── Option B: Severity-weighted encoding ─────────────
    print(" Building severity-weighted matrix...")
    def encode_row_severity(row):
        present = set(row[sym_cols].values)
        return {sym: severity_map.get(sym, 1) if sym in present else 0
                for sym in all_symptoms}

    severity_df = df.apply(encode_row_severity, axis=1, result_type="expand")
    severity_df.columns = [f"{c}_sev" for c in severity_df.columns]

    # Combine binary + severity
    combined = pd.concat([feature_df, severity_df], axis=1)
    combined["Disease"] = df["Disease"].values

    print(f" Feature matrix shape    : {combined.shape}")
    return combined, all_symptoms

def save_features(combined, all_symptoms):
    combined.to_csv("data/features_rf.csv", index=False)
    joblib.dump(all_symptoms, "models/symptom_list.pkl")
    print(f" Saved → data/features_rf.csv")
    print(f" Saved → models/symptom_list.pkl  ({len(all_symptoms)} symptoms)")

if __name__ == "__main__":
    print("=" * 55)
    print("  SAHARA | Feature Engineering — RF")
    print("=" * 55)
    df, sev = load_cleaned()
    combined, all_symptoms = build_features(df, sev)
    save_features(combined, all_symptoms)
    print("\n Done. Next → python ml/feature_engineering/features_ann.py")
