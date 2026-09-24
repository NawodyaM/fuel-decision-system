# Weekly fuel range model

The original fuel_model.pkl is preserved. It is a classifier with integer classes, not an exact-litre regressor, and requires IV_Quota_Sufficient, which is unavailable at prediction time. The new API uses fuel_range_model.joblib, trained by train_model.py using the eleven available inputs. It never converts class IDs into litres or uses a mileage formula as a fallback.

Run from the project root:

    python backend/train_model.py
    python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000

Run frontend separately with npm start from frontend. REACT_APP_API_URL can override http://localhost:8000 (restart the frontend after changing it).

The target is the self-reported weekly consumption category. Category labels are normalized for whitespace and dash variations. Ordinal survey encodings are retained; Never/Sometimes/Often map to 0/1/2; Rarely/Sometimes/Frequently map to 1/2/3; No/Yes map to 0/1. Vehicle, fuel and speed code meanings should be verified against the original questionnaire; the frontend codebook is the current interpretation.

The project owner confirmed on 2026-09-23 that the survey's Distance (km) column represents the total distance travelled within one week. The UI's total weekly distance input therefore uses the same reporting period as the survey distance and weekly fuel target. This clarification is based on the project owner's confirmation, not an independent review of the original questionnaire. Earlier evaluation artifacts retain the uncertainty recorded when they were generated; this clarification does not change the dataset, trained model, or evaluation scores.

model_evaluation.json contains held-out classification metrics, not accuracy in litres. The persisted model is fitted only on the training split. Do not repeatedly tune on this holdout. No independent road-test validation exists. Exact litres, an exact remaining balance, and guaranteed sufficiency cannot be inferred from these range labels. Large distances outside the observed training range trigger a warning. More-than-100-litre outputs retain an open upper bound.

The current dataset has 1,050 rows. Training excludes all four rows belonging to two identical-input groups with contradictory targets, pending source-data review, and removes 189 repeated inputs. The source CSV is preserved. The retained 857 records are split into 685 training and 172 test records. These exclusions are recorded in model_evaluation.json. The connected model achieves 78.49% held-out accuracy and 77.67% macro F1. Extended ROC, benchmarking, HTTP checks and the Testing chapter are in ../../testing-evidence. The prior model and its evaluation are backed up there and should not be confused with current results. Restart an already running API process to load a newly trained artifact.

Tests: from backend run python -B -m unittest -v test_prediction; from frontend run npm test -- --watchAll=false --runInBand.
