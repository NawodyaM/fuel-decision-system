"""Train a weekly fuel RANGE classifier. No exact-litre targets are available."""
from pathlib import Path
import json
import re
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.dummy import DummyClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score, confusion_matrix, classification_report

BASE = Path(__file__).resolve().parent
FEATURES = ["IV_Vehicle_Type", "IV_Fuel_Type", "IV_Driving_Style", "IV_Average_Speed", "IV_Traffic_Type", "IV_Fuel_Consumption_Rating", "IV_Quick_Acceleration", "IV_Sudden_Brakes", "IV_Traffic_Congestion", "IV_Stop_and_Go", "IV_Distance_KM"]
RANGES = {
    0: {"label": "Less than 10 L", "lower_litres": 0, "upper_litres": 10},
    1: {"label": "10-20 L", "lower_litres": 10, "upper_litres": 20},
    2: {"label": "21-40 L", "lower_litres": 21, "upper_litres": 40},
    3: {"label": "41-60 L", "lower_litres": 41, "upper_litres": 60},
    4: {"label": "61-80 L", "lower_litres": 61, "upper_litres": 80},
    5: {"label": "81-100 L", "lower_litres": 81, "upper_litres": 100},
    6: {"label": "More than 100 L", "lower_litres": 100, "upper_litres": None},
}

def prepare_data():
    df = pd.read_csv(BASE / "fuel_data.xlsx - Survey Responses.csv")
    if len(df.columns) != 19:
        raise ValueError("Unexpected survey schema")
    x = pd.DataFrame(index=df.index)
    for name, index in [("IV_Vehicle_Type", 0), ("IV_Fuel_Type", 1), ("IV_Driving_Style", 3), ("IV_Average_Speed", 6), ("IV_Traffic_Type", 7), ("IV_Fuel_Consumption_Rating", 10), ("IV_Distance_KM", 18)]:
        x[name] = pd.to_numeric(df.iloc[:, index], errors="raise")
    for name, index, mapping in [
        ("IV_Quick_Acceleration", 4, {"Never": 0, "Sometimes": 1, "Often": 2}),
        ("IV_Sudden_Brakes", 5, {"Never": 0, "Sometimes": 1, "Often": 2}),
        ("IV_Traffic_Congestion", 8, {"Rarely": 1, "Sometimes": 2, "Frequently": 3}),
        ("IV_Stop_and_Go", 9, {"No": 0, "Yes": 1}),
    ]:
        x[name] = df.iloc[:, index].str.strip().map(mapping)
    targets = {"Less than 10 Liters": 0, "10-20 Liters": 1, "21-40 Liters": 2, "41-60 Liters": 3, "61-80 Liters": 4, "81-100 Liters": 5, "More than 100 Liters": 6}
    labels = df.iloc[:, 12].map(lambda s: re.sub(r"\s+", " ", s.strip().replace(chr(8211), "-").replace(chr(8212), "-")))
    y = labels.map(targets)
    if x.isna().any().any() or y.isna().any():
        raise ValueError("Missing or unsupported survey values")
    return x[FEATURES], y.astype(int)

def train():
    x, y = prepare_data()
    # Exclude all ambiguous input groups rather than choosing an arbitrary label.
    # Preserve the source survey; record exclusions in the evaluation artifact.
    combined = x.assign(target=y)
    raw_rows = len(combined)
    target_counts = combined.groupby(FEATURES, dropna=False).target.transform("nunique")
    conflicting_rows = int((target_counts > 1).sum())
    conflicting_groups = int((combined.groupby(FEATURES, dropna=False).target.nunique() > 1).sum())
    combined = combined.loc[target_counts == 1]
    nonconflicting_rows = len(combined)
    combined = combined.drop_duplicates(subset=FEATURES)
    x, y = combined[FEATURES], combined.target
    xt, xv, yt, yv = train_test_split(x, y, test_size=0.2, stratify=y, random_state=42)
    model = RandomForestClassifier(n_estimators=300, min_samples_leaf=2, random_state=42, n_jobs=1)
    model.fit(xt, yt)
    predicted = model.predict(xv)
    baseline = DummyClassifier(strategy="most_frequent").fit(xt, yt)
    metrics = {
        "target": "survey/measurement-corrected weekly fuel range; not exact litres",
        "distance_period": "Total distance for the same week, confirmed by dataset owner",
        "split": "80/20 stratified holdout, random_state=42; model fitted on training split only",
        "training_rows": len(xt), "test_rows": len(xv),
        "raw_rows": raw_rows,
        "conflicting_input_groups_excluded": conflicting_groups,
        "conflicting_rows_excluded": conflicting_rows,
        "duplicate_rows_removed": nonconflicting_rows - len(combined),
        "retained_rows": len(combined),
        "accuracy": accuracy_score(yv, predicted),
        "macro_f1": f1_score(yv, predicted, average="macro", zero_division=0),
        "baseline_accuracy": accuracy_score(yv, baseline.predict(xv)),
        "class_labels": [RANGES[i]["label"] for i in range(7)],
        "confusion_matrix": confusion_matrix(yv, predicted, labels=list(range(7))).tolist(),
        "classification_report": classification_report(yv, predicted, labels=list(range(7)), target_names=[RANGES[i]["label"] for i in range(7)], output_dict=True, zero_division=0),
        "limitations": ["Fuel targets are survey ranges, not exact litres", "Contradictory-label input groups excluded if present", "Respondent/vehicle identifiers unavailable for grouped validation", "No independent road-test validation", "Range boundaries preserve survey labels; not a continuous measurement scale"],
    }
    bundle = {"model": model, "features": FEATURES, "ranges": RANGES, "schema_version": 1, "distance_min": float(xt.IV_Distance_KM.min()), "distance_max": float(xt.IV_Distance_KM.max()), "metrics": metrics}
    joblib.dump(bundle, BASE / "fuel_range_model.joblib")
    (BASE / "model_evaluation.json").write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    print(json.dumps({k: metrics[k] for k in ["training_rows", "test_rows", "accuracy", "macro_f1", "baseline_accuracy"]}, indent=2))

if __name__ == "__main__":
    train()
