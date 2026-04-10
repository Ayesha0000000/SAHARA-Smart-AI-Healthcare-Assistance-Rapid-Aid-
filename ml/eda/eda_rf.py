# ============================================================
# SAHARA | EDA — Random Forest Dataset
# Input : data/cleaned_rf.csv, data/cleaned_severity.csv
# Output: reports/figures/rf_*.png
# Run   : python ml/eda/eda_rf.py
# ============================================================

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings("ignore")

import os
os.makedirs("reports/figures", exist_ok=True)

sns.set_theme(style="whitegrid", palette="muted")

def load_data():
    df  = pd.read_csv("data/cleaned_rf.csv")
    sev = pd.read_csv("data/cleaned_severity.csv")
    print(f" Loaded cleaned RF data : {df.shape}")
    return df, sev

def plot_disease_distribution(df):
    counts = df["Disease"].value_counts()
    plt.figure(figsize=(14, 7))
    sns.barplot(x=counts.values, y=counts.index, palette="Blues_r")
    plt.title("Disease Distribution in Dataset", fontsize=15, fontweight="bold")
    plt.xlabel("Number of Records")
    plt.tight_layout()
    plt.savefig("reports/figures/rf_disease_distribution.png", dpi=150)
    plt.close()
    print(" Saved: rf_disease_distribution.png")

def plot_top_symptoms(df):
    sym_cols = [c for c in df.columns if c.startswith("Symptom_")]
    freq = {}
    for col in sym_cols:
        for s in df[col].values:
            if s != "none":
                freq[s] = freq.get(s, 0) + 1
    top = sorted(freq.items(), key=lambda x: -x[1])[:25]
    names, counts = zip(*top)

    plt.figure(figsize=(13, 7))
    sns.barplot(x=list(counts), y=list(names), palette="Greens_r")
    plt.title("Top 25 Most Frequent Symptoms", fontsize=15, fontweight="bold")
    plt.xlabel("Frequency")
    plt.tight_layout()
    plt.savefig("reports/figures/rf_top_symptoms.png", dpi=150)
    plt.close()
    print("Saved: rf_top_symptoms.png")

def plot_severity_distribution(sev):
    plt.figure(figsize=(9, 5))
    sns.histplot(sev["weight"], bins=8, color="#1565C0", kde=True)
    plt.title("Symptom Severity Weight Distribution", fontsize=14, fontweight="bold")
    plt.xlabel("Severity Weight (1–7)")
    plt.tight_layout()
    plt.savefig("reports/figures/rf_severity_dist.png", dpi=150)
    plt.close()
    print(" Saved: rf_severity_dist.png")

def plot_symptoms_per_disease(df):
    sym_cols = [c for c in df.columns if c.startswith("Symptom_")]
    df["symptom_count"] = df[sym_cols].apply(
        lambda r: (r != "none").sum(), axis=1
    )
    avg = df.groupby("Disease")["symptom_count"].mean().sort_values(ascending=False).head(20)

    plt.figure(figsize=(13, 7))
    sns.barplot(x=avg.values, y=avg.index, palette="Oranges_r")
    plt.title("Avg Symptoms per Disease (Top 20)", fontsize=14, fontweight="bold")
    plt.xlabel("Avg Symptom Count")
    plt.tight_layout()
    plt.savefig("reports/figures/rf_symptoms_per_disease.png", dpi=150)
    plt.close()
    print(" Saved: rf_symptoms_per_disease.png")

def print_summary(df, sev):
    print("\nDATASET SUMMARY")
    print(f"   Total records    : {len(df)}")
    print(f"   Unique diseases  : {df['Disease'].nunique()}")
    sym_cols = [c for c in df.columns if c.startswith("Symptom_")]
    all_syms = set(s for c in sym_cols for s in df[c].unique() if s != "none")
    print(f"   Unique symptoms  : {len(all_syms)}")
    print(f"   Severity range   : {sev['weight'].min()} – {sev['weight'].max()}")
    print(f"\n   Top 5 diseases:")
    for d, c in df["Disease"].value_counts().head(5).items():
        print(f"     {d:35s}: {c}")

if __name__ == "__main__":
    print("=" * 55)
    print("  SAHARA | EDA — RF Dataset")
    print("=" * 55)
    df, sev = load_data()
    print_summary(df, sev)
    plot_disease_distribution(df)
    plot_top_symptoms(df)
    plot_severity_distribution(sev)
    plot_symptoms_per_disease(df)
    print("\n EDA complete → reports/figures/")
    print("   Next → python ml/eda/eda_ann.py")
