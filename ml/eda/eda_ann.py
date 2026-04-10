# ============================================================
# SAHARA | EDA — ANN Dataset
# Input : data/cleaned_ann.csv
# Output: reports/figures/ann_*.png
# Run   : python ml/eda/eda_ann.py
# ============================================================

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from collections import Counter
import warnings
warnings.filterwarnings("ignore")

import os
os.makedirs("reports/figures", exist_ok=True)

sns.set_theme(style="whitegrid", palette="muted")

def load_data():
    df = pd.read_csv("data/cleaned_ann.csv")
    print(f"Loaded ANN data        : {df.shape}")
    return df

def plot_diagnosis_distribution(df):
    counts = df["diagnosis"].value_counts().head(25)
    plt.figure(figsize=(14, 7))
    sns.barplot(x=counts.values, y=counts.index, palette="Purples_r")
    plt.title("Top 25 Diagnoses — HuggingFace Dataset", fontsize=15, fontweight="bold")
    plt.xlabel("Count")
    plt.tight_layout()
    plt.savefig("reports/figures/ann_diagnosis_dist.png", dpi=150)
    plt.close()
    print(" Saved: ann_diagnosis_dist.png")

def plot_text_length(df):
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))

    sns.histplot(df["text_length"], bins=40, color="#7B1FA2", kde=True, ax=axes[0])
    axes[0].set_title("Symptom Text Length", fontweight="bold")
    axes[0].set_xlabel("Characters")

    sns.histplot(df["word_count"], bins=30, color="#C2185B", kde=True, ax=axes[1])
    axes[1].set_title("Symptom Word Count", fontweight="bold")
    axes[1].set_xlabel("Words")

    plt.suptitle("Symptom Text Analysis", fontsize=14, fontweight="bold")
    plt.tight_layout()
    plt.savefig("reports/figures/ann_text_analysis.png", dpi=150)
    plt.close()
    print(" Saved: ann_text_analysis.png")

def plot_class_balance(df):
    counts = df["diagnosis"].value_counts()
    plt.figure(figsize=(8, 5))
    sns.histplot(counts.values, bins=20, color="#00838F", kde=True)
    plt.title("Class Balance (Records per Diagnosis)", fontsize=14, fontweight="bold")
    plt.xlabel("Number of Records")
    plt.ylabel("Number of Diagnoses")
    plt.tight_layout()
    plt.savefig("reports/figures/ann_class_balance.png", dpi=150)
    plt.close()
    print(" Saved: ann_class_balance.png")

def plot_top_words(df):
    from sklearn.feature_extraction.text import CountVectorizer
    cv = CountVectorizer(max_features=25, stop_words="english")
    cv.fit(df["symptoms"])
    word_counts = cv.transform(df["symptoms"]).toarray().sum(axis=0)
    words = cv.get_feature_names_out()
    word_df = pd.DataFrame({"word": words, "count": word_counts}).sort_values("count", ascending=False)

    plt.figure(figsize=(13, 6))
    sns.barplot(x="count", y="word", data=word_df, palette="YlOrRd_r")
    plt.title("Top 25 Most Common Words in Symptoms", fontsize=14, fontweight="bold")
    plt.xlabel("Frequency")
    plt.tight_layout()
    plt.savefig("reports/figures/ann_top_words.png", dpi=150)
    plt.close()
    print("✅ Saved: ann_top_words.png")

def print_summary(df):
    print("\n ANN DATASET SUMMARY")
    print(f"   Total records    : {len(df)}")
    print(f"   Unique diagnoses : {df['diagnosis'].nunique()}")
    print(f"   Avg text length  : {df['text_length'].mean():.1f} chars")
    print(f"   Avg word count   : {df['word_count'].mean():.1f} words")
    print(f"\n   Top 5 diagnoses:")
    for d, c in df["diagnosis"].value_counts().head(5).items():
        print(f"     {d:40s}: {c}")

if __name__ == "__main__":
    print("=" * 55)
    print("  SAHARA | EDA — ANN Dataset")
    print("=" * 55)
    df = load_data()
    print_summary(df)
    plot_diagnosis_distribution(df)
    plot_text_length(df)
    plot_class_balance(df)
    plot_top_words(df)
    print("\n EDA complete → reports/figures/")
    print("   Next → python ml/feature_engineering/features_rf.py")
