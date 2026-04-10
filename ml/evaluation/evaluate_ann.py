# ============================================================
# SAHARA | Evaluation — ANN
# Input : models/ann_model.h5, data/ann_test.npz
# Output: reports/figures/ann_eval_*.png, reports/ann_report.txt
# Run   : python ml/evaluation/evaluate_ann.py
# ============================================================

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import joblib, json, os, warnings
warnings.filterwarnings("ignore")
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import tensorflow as tf
from sklearn.metrics import (accuracy_score, f1_score, precision_score,
                             recall_score, classification_report, confusion_matrix)

os.makedirs("reports/figures", exist_ok=True)
sns.set_theme(style="whitegrid")

def load_model_and_data():
    model  = tf.keras.models.load_model("models/ann_model.h5")
    le     = joblib.load("models/ann_label_encoder.pkl")
    data   = np.load("data/ann_test.npz")
    X_test, y_test_cat = data["X_test"], data["y_test"]
    y_test = np.argmax(y_test_cat, axis=1)
    with open("models/ann_history.json") as f:
        history = json.load(f)
    print("✅ ANN model + test data loaded")
    return model, le, X_test, y_test, history

def evaluate(model, le, X_test, y_test):
    y_pred_prob = model.predict(X_test, verbose=0)
    y_pred = np.argmax(y_pred_prob, axis=1)

    acc  = accuracy_score(y_test, y_pred)
    f1   = f1_score(y_test, y_pred, average="weighted")
    prec = precision_score(y_test, y_pred, average="weighted", zero_division=0)
    rec  = recall_score(y_test, y_pred, average="weighted", zero_division=0)

    print(f"\n📊 ANN RESULTS")
    print(f"   Accuracy  : {acc*100:.2f}%")
    print(f"   F1-Score  : {f1:.4f}")
    print(f"   Precision : {prec:.4f}")
    print(f"   Recall    : {rec:.4f}")

    report = classification_report(y_test, y_pred, target_names=le.classes_)
    print(f"\n{report}")

    with open("reports/ann_report.txt", "w") as f:
        f.write("SAHARA — ANN Evaluation Report\n")
        f.write("=" * 50 + "\n")
        f.write(f"Accuracy  : {acc*100:.2f}%\n")
        f.write(f"F1-Score  : {f1:.4f}\n")
        f.write(f"Precision : {prec:.4f}\n")
        f.write(f"Recall    : {rec:.4f}\n\n")
        f.write(report)
    print("✅ Report saved → reports/ann_report.txt")
    return y_pred, acc, f1

def plot_training_history(history):
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))
    axes[0].plot(history["accuracy"],     label="Train",      color="#1565C0")
    axes[0].plot(history["val_accuracy"], label="Validation", color="#FF8F00")
    axes[0].set_title("Accuracy per Epoch", fontweight="bold")
    axes[0].set_xlabel("Epoch")
    axes[0].set_ylabel("Accuracy")
    axes[0].legend()

    axes[1].plot(history["loss"],     label="Train",      color="#1565C0")
    axes[1].plot(history["val_loss"], label="Validation", color="#FF8F00")
    axes[1].set_title("Loss per Epoch", fontweight="bold")
    axes[1].set_xlabel("Epoch")
    axes[1].set_ylabel("Loss")
    axes[1].legend()

    plt.suptitle("SAHARA — ANN Training History", fontsize=14, fontweight="bold")
    plt.tight_layout()
    plt.savefig("reports/figures/ann_eval_history.png", dpi=150)
    plt.close()
    print("✅ Saved: ann_eval_history.png")

def plot_confusion_matrix(y_test, y_pred, le):
    labels = np.unique(y_test)[:18]
    mask   = np.isin(y_test, labels) & np.isin(y_pred, labels)
    cm     = confusion_matrix(y_test[mask], y_pred[mask], labels=labels)
    names  = [le.classes_[i] for i in labels]

    plt.figure(figsize=(16, 12))
    sns.heatmap(cm, xticklabels=names, yticklabels=names,
                annot=True, fmt="d", cmap="Purples", linewidths=0.3)
    plt.title("Confusion Matrix — ANN (Top 18 Diagnoses)",
              fontsize=14, fontweight="bold")
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.xticks(rotation=45, ha="right")
    plt.tight_layout()
    plt.savefig("reports/figures/ann_eval_confusion.png", dpi=150)
    plt.close()
    print("✅ Saved: ann_eval_confusion.png")

def plot_model_comparison(rf_report="reports/rf_report.txt",
                          ann_report="reports/ann_report.txt"):
    """Bar chart comparing RF vs ANN metrics"""
    def parse_metrics(path):
        metrics = {}
        with open(path) as f:
            for line in f:
                for m in ["Accuracy", "F1-Score", "Precision", "Recall"]:
                    if line.startswith(m):
                        val = float(line.split(":")[1].strip().replace("%",""))
                        metrics[m] = val / 100 if val > 1 else val
        return metrics

    if not (os.path.exists(rf_report) and os.path.exists(ann_report)):
        print("⚠️  Both reports needed for comparison. Run evaluate_rf.py first.")
        return

    rf_m  = parse_metrics(rf_report)
    ann_m = parse_metrics(ann_report)
    labels = list(rf_m.keys())
    rf_vals  = [rf_m[l]  for l in labels]
    ann_vals = [ann_m[l] for l in labels]

    x = np.arange(len(labels))
    w = 0.35
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.bar(x - w/2, rf_vals,  w, label="Random Forest", color="#1565C0")
    ax.bar(x + w/2, ann_vals, w, label="ANN",           color="#7B1FA2")
    ax.set_xticks(x)
    ax.set_xticklabels(labels)
    ax.set_ylim(0, 1.1)
    ax.set_ylabel("Score")
    ax.set_title("Model Comparison: RF vs ANN", fontsize=14, fontweight="bold")
    ax.legend()
    for i, (rv, av) in enumerate(zip(rf_vals, ann_vals)):
        ax.text(i - w/2, rv + 0.01, f"{rv:.2f}", ha="center", fontsize=9)
        ax.text(i + w/2, av + 0.01, f"{av:.2f}", ha="center", fontsize=9)
    plt.tight_layout()
    plt.savefig("reports/figures/model_comparison.png", dpi=150)
    plt.close()
    print("✅ Saved: model_comparison.png")

if __name__ == "__main__":
    print("=" * 55)
    print("  SAHARA | Evaluation — ANN")
    print("=" * 55)
    model, le, X_test, y_test, history = load_model_and_data()
    y_pred, acc, f1 = evaluate(model, le, X_test, y_test)
    plot_training_history(history)
    plot_confusion_matrix(y_test, y_pred, le)
    plot_model_comparison()
    print("\n✅ All evaluations complete!")
    print("   Next → cd backend && uvicorn app.main:app --reload")
