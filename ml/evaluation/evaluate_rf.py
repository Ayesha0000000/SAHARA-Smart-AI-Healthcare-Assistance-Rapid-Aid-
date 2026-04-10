# ============================================================
# SAHARA | Evaluation — Random Forest
# Input : models/rf_model.pkl, data/rf_X_test.npy
# Output: reports/figures/rf_eval_*.png, reports/rf_report.txt
# Run   : python ml/evaluation/evaluate_rf.py
# ============================================================

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import joblib, os, warnings
warnings.filterwarnings("ignore")

from sklearn.metrics import (accuracy_score, f1_score, precision_score,
                             recall_score, classification_report, confusion_matrix)

os.makedirs("reports/figures", exist_ok=True)
sns.set_theme(style="whitegrid")

def load_model_and_data():
    rf = joblib.load("models/rf_model.pkl")
    le = joblib.load("models/label_encoder.pkl")
    X_test = np.load("data/rf_X_test.npy", allow_pickle=True)
    y_test = np.load("data/rf_y_test.npy", allow_pickle=True)
    print("✅ RF model + test data loaded")
    return rf, le, X_test, y_test

def evaluate(rf, le, X_test, y_test):
    y_pred = rf.predict(X_test)
    prob   = rf.predict_proba(X_test)

    acc  = accuracy_score(y_test, y_pred)
    f1   = f1_score(y_test, y_pred, average="weighted")
    prec = precision_score(y_test, y_pred, average="weighted", zero_division=0)
    rec  = recall_score(y_test, y_pred, average="weighted", zero_division=0)

    print(f"\n📊 RANDOM FOREST RESULTS")
    print(f"   Accuracy  : {acc*100:.2f}%")
    print(f"   F1-Score  : {f1:.4f}")
    print(f"   Precision : {prec:.4f}")
    print(f"   Recall    : {rec:.4f}")

    report = classification_report(y_test, y_pred, target_names=le.classes_)
    print(f"\n{report}")

    # Save text report
    with open("reports/rf_report.txt", "w") as f:
        f.write("SAHARA — Random Forest Evaluation Report\n")
        f.write("=" * 50 + "\n")
        f.write(f"Accuracy  : {acc*100:.2f}%\n")
        f.write(f"F1-Score  : {f1:.4f}\n")
        f.write(f"Precision : {prec:.4f}\n")
        f.write(f"Recall    : {rec:.4f}\n\n")
        f.write(report)
    print("✅ Report saved → reports/rf_report.txt")

    return y_pred, acc, f1

def plot_confusion_matrix(y_test, y_pred, le):
    labels = np.unique(y_test)[:20]
    mask   = np.isin(y_test, labels) & np.isin(y_pred, labels)
    cm     = confusion_matrix(y_test[mask], y_pred[mask], labels=labels)
    names  = [le.classes_[i] for i in labels]

    plt.figure(figsize=(16, 12))
    sns.heatmap(cm, xticklabels=names, yticklabels=names,
                annot=True, fmt="d", cmap="Blues", linewidths=0.3)
    plt.title("Confusion Matrix — Random Forest (Top 20 Diseases)",
              fontsize=14, fontweight="bold")
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.xticks(rotation=45, ha="right")
    plt.tight_layout()
    plt.savefig("reports/figures/rf_eval_confusion.png", dpi=150)
    plt.close()
    print("✅ Saved: rf_eval_confusion.png")

def plot_feature_importance(rf, X_test):
    sym_list = joblib.load("models/symptom_list.pkl")
    # X_test has binary + severity columns
    n_sym = len(sym_list)
    importances = rf.feature_importances_[:n_sym]
    feat_series = pd.Series(importances, index=sym_list).nlargest(20)

    plt.figure(figsize=(11, 7))
    sns.barplot(x=feat_series.values, y=feat_series.index, palette="Oranges_r")
    plt.title("Top 20 Feature Importances — Random Forest",
              fontsize=14, fontweight="bold")
    plt.xlabel("Importance Score")
    plt.tight_layout()
    plt.savefig("reports/figures/rf_eval_importance.png", dpi=150)
    plt.close()
    print("✅ Saved: rf_eval_importance.png")

def plot_per_class_f1(y_test, y_pred, le):
    report_dict = {}
    from sklearn.metrics import classification_report
    rep = classification_report(y_test, y_pred, target_names=le.classes_, output_dict=True)
    f1_scores = {k: v["f1-score"] for k, v in rep.items() if k in le.classes_}
    f1_df = pd.DataFrame.from_dict(f1_scores, orient="index", columns=["F1"]).sort_values("F1")

    plt.figure(figsize=(12, 10))
    sns.barplot(x=f1_df["F1"], y=f1_df.index, palette="RdYlGn")
    plt.axvline(x=0.9, color="red", linestyle="--", alpha=0.7, label="0.9 threshold")
    plt.title("Per-Class F1-Score — Random Forest", fontsize=14, fontweight="bold")
    plt.xlabel("F1-Score")
    plt.legend()
    plt.tight_layout()
    plt.savefig("reports/figures/rf_eval_per_class_f1.png", dpi=150)
    plt.close()
    print("✅ Saved: rf_eval_per_class_f1.png")

if __name__ == "__main__":
    print("=" * 55)
    print("  SAHARA | Evaluation — Random Forest")
    print("=" * 55)
    rf, le, X_test, y_test = load_model_and_data()
    y_pred, acc, f1 = evaluate(rf, le, X_test, y_test)
    plot_confusion_matrix(y_test, y_pred, le)
    plot_feature_importance(rf, X_test)
    plot_per_class_f1(y_test, y_pred, le)
    print("\n✅ Evaluation complete → reports/figures/")
    print("   Next → python ml/evaluation/evaluate_ann.py")
