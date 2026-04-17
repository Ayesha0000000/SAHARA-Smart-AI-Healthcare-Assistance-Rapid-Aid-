# ============================================================
# SAHARA | Model Training — ANN (TensorFlow/Keras) — IMPROVED
# Input : data/features_ann.npz
# Output: models/ann_model.h5
# Run   : python ml/model_training/train_ann.py
# ============================================================

import numpy as np
import joblib, os, json, warnings
warnings.filterwarnings("ignore")
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, BatchNormalization
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.optimizers import Adam
from sklearn.model_selection import train_test_split

os.makedirs("models", exist_ok=True)

def load_features():
    data   = np.load("data/features_ann.npz")
    X, y_raw = data["X"], data["y"]
    le     = joblib.load("models/ann_label_encoder.pkl")
    num_classes = len(le.classes_)
    y = to_categorical(y_raw, num_classes=num_classes)
    print(f"  Features loaded  : X={X.shape}, y={y.shape}")
    print(f"  Classes          : {num_classes}")
    return X, y, num_classes

def augment_short_symptoms(X, y_raw, tfidf, le, n_aug=3):
    """
    Data augmentation: short single-symptom inputs ko
    expanded sentences mein convert karke extra training samples banao.
    Isse model short inputs pe bhi confident hoga.
    """
    print("  Augmenting short symptom samples...")
    aug_texts = []
    aug_labels = []

    # Common single symptoms aur unke diseases
    SINGLE_SYMPTOMS = {
        "fever":        "Typhoid",
        "high fever":   "Typhoid",
        "mild fever":   "Common Cold",
        "cough":        "Common Cold",
        "headache":     "Migraine",
        "rash":         "Chicken pox",
        "itching":      "Fungal infection",
        "nausea":       "Gastroenteritis",
        "vomiting":     "Gastroenteritis",
        "diarrhea":     "Gastroenteritis",
        "fatigue":      "Diabetes",
        "chest pain":   "Heart attack",
        "breathless":   "Bronchial Asthma",
        "joint pain":   "Arthritis",
        "back pain":    "Cervical spondylosis",
        "weight loss":  "Tuberculosis",
        "yellow skin":  "Hepatitis B",
        "yellow eyes":  "Jaundice",
        "frequent urination": "Diabetes",
        "blurred vision":     "Diabetes",
        "skin rash":    "Psoriasis",
        "anxiety":      "Anxiety",
        "dizziness":    "Hypertension",
    }

    templates = [
        "patient has {sym}",
        "suffering from {sym}",
        "main complaint is {sym}",
        "the patient is experiencing {sym}",
        "{sym} is the primary symptom",
        "I have {sym}",
        "feeling {sym}",
        "symptoms include {sym}",
    ]

    classes = list(le.classes_)
    for sym, disease in SINGLE_SYMPTOMS.items():
        if disease not in classes:
            continue
        label_idx = classes.index(disease)
        for template in templates:
            text = template.format(sym=sym)
            aug_texts.append(text)
            aug_labels.append(label_idx)

    if aug_texts:
        X_aug = tfidf.transform(aug_texts).toarray()
        y_aug = to_categorical(aug_labels, num_classes=len(classes))
        X_combined = np.vstack([X, X_aug])
        y_combined = np.vstack([y_raw, y_aug])
        print(f"  Augmented samples added: {len(aug_texts)}")
        print(f"  Total samples now     : {X_combined.shape[0]}")
        return X_combined, y_combined

    return X, y_raw

def build_ann(input_dim, num_classes):
    model = Sequential([
        Dense(512, activation="relu", input_shape=(input_dim,)),
        BatchNormalization(),
        Dropout(0.4),

        Dense(256, activation="relu"),
        BatchNormalization(),
        Dropout(0.3),

        Dense(128, activation="relu"),
        BatchNormalization(),
        Dropout(0.2),

        Dense(64, activation="relu"),
        Dropout(0.1),

        Dense(num_classes, activation="softmax")
    ])
    model.compile(
        optimizer=Adam(learning_rate=0.001),
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )
    return model

def train_model(X, y, num_classes):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    print(f"\n  Train samples   : {X_train.shape[0]}")
    print(f"  Test samples    : {X_test.shape[0]}")

    model = build_ann(X_train.shape[1], num_classes)
    model.summary()

    callbacks = [
        EarlyStopping(monitor="val_loss", patience=15,
                      restore_best_weights=True, verbose=1),
        ReduceLROnPlateau(monitor="val_loss", factor=0.5,
                          patience=6, min_lr=1e-6, verbose=1),
        ModelCheckpoint("models/ann_best.h5", monitor="val_accuracy",
                        save_best_only=True, verbose=1),
    ]

    print("\n Training ANN (up to 120 epochs with early stopping)...")
    history = model.fit(
        X_train, y_train,
        epochs=120,
        batch_size=32,
        validation_split=0.15,
        callbacks=callbacks,
        verbose=1,
    )
    print("Training complete!")
    return model, history, X_test, y_test

def save_model(model, history):
    model.save("models/ann_model.h5")
    hist_dict = {k: [float(v) for v in vals]
                 for k, vals in history.history.items()}
    with open("models/ann_history.json", "w") as f:
        json.dump(hist_dict, f)
    print("\nSaved → models/ann_model.h5")
    print("Saved → models/ann_history.json")

if __name__ == "__main__":
    print("=" * 55)
    print("  SAHARA | Model Training — ANN (Improved)")
    print("=" * 55)

    X, y, num_classes = load_features()

    # Load tfidf for augmentation
    tfidf = joblib.load("models/tfidf_vectorizer.pkl")
    le    = joblib.load("models/ann_label_encoder.pkl")

    # Augment data
    X, y = augment_short_symptoms(X, y, tfidf, le)

    model, history, X_test, y_test = train_model(X, y, num_classes)
    save_model(model, history)
    np.savez("data/ann_test.npz", X_test=X_test, y_test=y_test)
    print("\nDone. Next → python ml/evaluation/evaluate_rf.py")
