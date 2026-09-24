from pathlib import Path
import logging
import os
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)
app = FastAPI()
allowed_origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
allowed_origins.extend(
    origin.strip().rstrip("/")
    for origin in os.getenv("FRONTEND_ORIGINS", "").split(",")
    if origin.strip()
)
app.add_middleware(CORSMiddleware, allow_origins=allowed_origins, allow_methods=["GET", "POST"], allow_headers=["Content-Type"])

class FuelInput(BaseModel):
    IV_Vehicle_Type: int = Field(ge=1, le=6)
    IV_Fuel_Type: int = Field(ge=1, le=2)
    IV_Driving_Style: int = Field(ge=1, le=3)
    IV_Average_Speed: int = Field(ge=1, le=5)
    IV_Traffic_Type: int = Field(ge=1, le=3)
    IV_Fuel_Consumption_Rating: int = Field(ge=1, le=3)
    IV_Quick_Acceleration: int = Field(ge=0, le=2)
    IV_Sudden_Brakes: int = Field(ge=0, le=2)
    IV_Traffic_Congestion: int = Field(ge=1, le=3)
    IV_Stop_and_Go: int = Field(ge=0, le=1)
    IV_Distance_KM: float = Field(gt=0, allow_inf_nan=False)

MODEL_PATH = Path(__file__).resolve().parent / "fuel_range_model.joblib"
try:
    bundle = joblib.load(MODEL_PATH)
    if bundle["schema_version"] != 1:
        raise ValueError("Unsupported model schema")
    model = bundle["model"]
    expected_features = bundle["features"]
    if set(expected_features) != set(FuelInput.model_fields):
        raise ValueError("Model features do not match API inputs")
except Exception as exc:
    raise RuntimeError("Cannot load fuel range model. Run: python backend/train_model.py") from exc

@app.get("/")
def read_root():
    return {"message": "Weekly fuel range prediction API is running", "model": type(model).__name__}

@app.post("/predict")
def predict(input_data: FuelInput):
    frame = pd.DataFrame([input_data.model_dump()], columns=expected_features)
    try:
        category = int(model.predict(frame)[0])
        fuel_range = bundle["ranges"][category]
    except Exception as exc:
        logger.exception("Fuel prediction failed")
        raise HTTPException(status_code=500, detail="Unable to generate a fuel estimate") from exc
    warnings = ["This is an estimated weekly survey category, not an exact fuel measurement or a guarantee of sufficient fuel."]
    if not bundle["distance_min"] <= input_data.IV_Distance_KM <= bundle["distance_max"]:
        warnings.append("Distance is outside the model's training range; this estimate may be unreliable.")
    return {"fuel_range": fuel_range, "period": "weekly", "warnings": warnings}
