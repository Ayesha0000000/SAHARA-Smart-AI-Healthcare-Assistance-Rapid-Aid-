# ============================================================
# SAHARA | Data Cleaning — Random Forest Dataset
# Dataset: Kaggle — Disease Symptom Description Dataset
#   → dataset.csv, Symptom-severity.csv, symptom_Description.csv
# Run: python ml/data_cleaning/clean_rf_data.py
# ============================================================

import pandas as pd
import numpy as np
import os, warnings
warnings.filterwarnings("ignore")

RAW_PATH  = "data/dataset.csv"
SEV_PATH  = "data/Symptom-severity.csv"
DESC_PATH = "data/symptom_Description.csv"
OUT_CLEAN = "data/cleaned_rf.csv"
OUT_SEV   = "data/cleaned_severity.csv"

def load_raw():
    df   = pd.read_csv(RAW_PATH)
    sev  = pd.read_csv(SEV_PATH)
    desc = pd.read_csv(DESC_PATH)
    print(f"✅ Raw dataset       : {df.shape[0]} rows, {df.shape[1]} cols")
    print(f"   Severity table   : {sev.shape}")
    print(f"   Unique diseases  : {df['Disease'].nunique()}")
    return df, sev, desc

def clean_dataset(df, sev):
    # Strip whitespace from all string columns
    df  = df.apply(lambda c: c.str.strip() if c.dtype == "object" else c)
    sev["Symptom"] = sev["Symptom"].str.strip()
    sev["weight"]  = pd.to_numeric(sev["weight"], errors="coerce").fillna(0)

    sym_cols = [c for c in df.columns if c.startswith("Symptom_")]

    # Replace NaN symptoms with "none"
    df[sym_cols] = df[sym_cols].fillna("none")

    # Remove duplicate rows
    before = len(df)
    df = df.drop_duplicates()
    print(f"\n🧹 Duplicates removed : {before - len(df)}")

    # Drop rows where Disease is null
    df = df.dropna(subset=["Disease"])

    print(f"   Final rows       : {len(df)}")
    print(f"   Symptom columns  : {len(sym_cols)}")

    # Get all unique symptom values (excluding "none")
    all_symptoms = sorted(set(
        s for col in sym_cols
        for s in df[col].unique() if s != "none"
    ))
    print(f"   Unique symptoms  : {len(all_symptoms)}")

    return df, sev, sym_cols, all_symptoms

def save_cleaned(df, sev):
    df.to_csv(OUT_CLEAN, index=False)
    sev.to_csv(OUT_SEV,  index=False)
    print(f"\n Saved → {OUT_CLEAN}")
    print(f" Saved → {OUT_SEV}")

if __name__ == "__main__":
    print("=" * 55)
    print("  SAHARA | Data Cleaning — RF Dataset")
    print("=" * 55)
    df, sev, desc = load_raw()
    df, sev, sym_cols, all_syms = clean_dataset(df, sev)
    save_cleaned(df, sev)
    print("\n Done. Next → python ml/data_cleaning/clean_ann_data.py")
