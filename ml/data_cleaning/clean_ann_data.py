# ============================================================
# SAHARA | Data Cleaning — ANN Dataset
# Dataset: HuggingFace — gretelai/symptom_to_diagnosis
# Run: python ml/data_cleaning/clean_ann_data.py
# ============================================================

import pandas as pd
import re, os, warnings
warnings.filterwarnings("ignore")

OUT_CLEAN = "data/cleaned_ann.csv"

def load_from_huggingface():
    from datasets import load_dataset
    print("⏳ Downloading HuggingFace dataset (needs internet)...")
    ds = load_dataset("gretelai/symptom_to_diagnosis")
    df_train = pd.DataFrame(ds["train"])
    df_test  = pd.DataFrame(ds["test"])
    df = pd.concat([df_train, df_test], ignore_index=True)
    print(f" Loaded            : {df.shape[0]} rows")
    print(f"   Columns          : {list(df.columns)}")
    return df

def clean_ann(df):
    # Rename columns
    df = df.rename(columns={"input_text": "symptoms", "output_text": "diagnosis"})

    # Lowercase + strip
    df["symptoms"]  = df["symptoms"].str.lower().str.strip()
    df["diagnosis"] = df["diagnosis"].str.strip()

    # Remove special characters from symptoms
    df["symptoms"] = df["symptoms"].apply(
        lambda x: re.sub(r"[^a-z0-9\s,.]", " ", str(x))
    )

    # Drop nulls
    before = len(df)
    df = df.dropna(subset=["symptoms", "diagnosis"])
    df = df[df["symptoms"].str.len() > 3]

    # Remove duplicates
    df = df.drop_duplicates()
    print(f"\n Removed bad rows  : {before - len(df)}")
    print(f"   Final rows       : {len(df)}")
    print(f"   Unique diagnoses : {df['diagnosis'].nunique()}")

    # Add text length feature for EDA
    df["text_length"] = df["symptoms"].str.len()
    df["word_count"]  = df["symptoms"].str.split().str.len()

    return df

def save_cleaned(df):
    df.to_csv(OUT_CLEAN, index=False)
    print(f"\n Saved → {OUT_CLEAN}")

if __name__ == "__main__":
    print("=" * 55)
    print("  SAHARA | Data Cleaning — ANN Dataset")
    print("=" * 55)
    df = load_from_huggingface()
    df = clean_ann(df)
    save_cleaned(df)
    print("\nDone. Next → python ml/eda/eda_rf.py")
