# SAHARA — ML Models

## Structure
```
ml/
├── notebooks/
│   ├── 01_data_exploration.ipynb       # EDA on both datasets
│   ├── 02_random_forest_model.ipynb    # Step 1: RF training + evaluation
│   ├── 03_ann_model.ipynb              # Step 2: ANN training + evaluation
│   └── 04_model_comparison.ipynb       # Accuracy, F1, Precision, Recall
├── models/
│   ├── random_forest.pkl               # Saved RF model (gitignored - large)
│   └── ann_model.h5                    # Saved ANN model (gitignored - large)
└── data/
    └── (datasets go here - gitignored)
```

## Datasets
1. **Kaggle** — Disease Symptom Description Dataset (41 diseases)
2. **HuggingFace** — `gretelai/symptom_to_diagnosis`

## Models

### Model 1: Random Forest (Step 1 — Quick Check)
- Input: Selected symptoms (multi-label)
- Output: Disease category + confidence
- Library: `scikit-learn`

### Model 2: ANN (Step 2 — Detailed Prediction)
- Input: Symptoms from Step 1 context
- Output: Specific disease + recommended specialist
- Library: `TensorFlow/Keras`
- Architecture: Dense layers with dropout

## Evaluation Metrics
- Accuracy
- F1 Score (weighted)
- Precision
- Recall
- Confusion Matrix
