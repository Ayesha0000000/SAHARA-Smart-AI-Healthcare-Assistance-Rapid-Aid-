# ============================================================
# SAHARA | Feature Engineering — ANN
# Input : data/cleaned_ann.csv
# Output: data/features_ann.npz, models/tfidf_vectorizer.pkl,
#         models/ann_label_encoder.pkl
# Run   : python ml/feature_engineering/features_ann.py
# ============================================================

import pandas as pd
import numpy as np
import joblib, os, warnings
warnings.filterwarnings("ignore")

from sklearn.preprocessing import LabelEncoder
from sklearn.feature_extraction.text import TfidfVectorizer

os.makedirs("models", exist_ok=True)

def load_cleaned():
    df = pd.read_csv("data/cleaned_ann.csv")
    print(f"Loaded cleaned ANN data : {df.shape}")
    return df

def build_features(df):
    # ── TF-IDF Vectorization ─────────────────────────────
    print(" Fitting TF-IDF vectorizer (max 500 features)...")
    tfidf = TfidfVectorizer(
        max_features=500,
        ngram_range=(1, 2),     # unigrams + bigrams
        min_df=2,
        sublinear_tf=True       # log normalization
    )
    X = tfidf.fit_transform(df["symptoms"]).toarray()
    print(f"   TF-IDF feature matrix  : {X.shape}")

    # ── Label Encoding ───────────────────────────────────
    le = LabelEncoder()
    y = le.fit_transform(df["diagnosis"])
    print(f"   Classes                : {len(le.classes_)}")

    return X, y, tfidf, le

def save_features(X, y, tfidf, le):
    np.savez("data/features_ann.npz", X=X, y=y)
    joblib.dump(tfidf, "models/tfidf_vectorizer.pkl")
    joblib.dump(le,    "models/ann_label_encoder.pkl")

    print(f"\n Saved → data/features_ann.npz")
    print(f" Saved → models/tfidf_vectorizer.pkl")
    print(f" Saved → models/ann_label_encoder.pkl")

if __name__ == "__main__":
    print("=" * 55)
    print("  SAHARA | Feature Engineering — ANN")
    print("=" * 55)
    df = load_cleaned()
    X, y, tfidf, le = build_features(df)
    save_features(X, y, tfidf, le)
    print("\n Done. Next → python ml/model_training/train_rf.py")
