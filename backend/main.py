from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import pickle
import numpy as np

app = FastAPI(title="SpaceX Land-Prediction API")

# Setup CORS to allow React Frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load machine learning artifacts at startup
try:
    with open('model.pkl', 'rb') as f:
        model = pickle.load(f)
    with open('scaler.pkl', 'rb') as f:
        scaler = pickle.load(f)
    with open('features.pkl', 'rb') as f:
        feature_columns = pickle.load(f)
except Exception as e:
    print("Warning: ML Artifacts could not be loaded. Please run train_model.py first.")
    model = None

@app.get("/api/data")
def get_dashboard_data():
    """
    Returns the historical launch data for the dashboard.
    """
    try:
        df = pd.read_csv('data/dashboard.csv')
        # Replace NaN with None so it translates correctly to JSON null
        df = df.where(pd.notnull(df), None)
        return df.to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class PredictRequest(BaseModel):
    # Defining input features expected from the frontend Predictor form
    PayloadMass: float
    Flights: int
    GridFins: bool
    Reused: bool
    Legs: bool
    LaunchSite: str  # Options: 'CCAFS SLC 40', 'VAFB SLC 4E', 'KSC LC 39A', etc.
    Orbit: str       # Options: 'LEO', 'ISS', 'PO', 'GTO', 'ES-L1', 'SSO', 'HEO', 'MEO', 'VLEO', 'SO', 'GEO'

@app.post("/api/predict")
def predict_landing(req: PredictRequest):
    """
    Predicts if the Falcon 9 will land successfully.
    Applies one-hot encoding according to feature_columns.
    """
    if model is None:
        raise HTTPException(status_code=500, detail="Model is not trained. Run backend/train_model.py.")
        
    # We must match exactly the features structure used during training.
    # The training dataset `dataset_part_3.csv` contained flight params + dummies.
    
    # Initialize a dict with 0 for all expected columns
    input_data = {col: 0 for col in feature_columns}
    
    # Fill in numericals and booleans
    # Important: dataset_part_3 has exact column caps, so we ensure matching
    if 'PayloadMass' in input_data: input_data['PayloadMass'] = req.PayloadMass
    if 'Flights' in input_data: input_data['Flights'] = req.Flights
    if 'GridFins' in input_data: input_data['GridFins'] = int(req.GridFins)
    if 'Reused' in input_data: input_data['Reused'] = int(req.Reused)
    if 'Legs' in input_data: input_data['Legs'] = int(req.Legs)
    
    # Fill in categoricals (One-Hot Encoding matching Pandas get_dummies output)
    site_col = f"LaunchSite_{req.LaunchSite}"
    if site_col in input_data:
        input_data[site_col] = 1
        
    orbit_col = f"Orbit_{req.Orbit}"
    if orbit_col in input_data:
        input_data[orbit_col] = 1
        
    # Construct DF ensuring column order is exactly as `feature_columns`
    df_input = pd.DataFrame([input_data])[feature_columns]
    
    # Scale features
    X_scaled = scaler.transform(df_input)
    
    # Predict
    prediction = model.predict(X_scaled)
    # Get probability using predict_proba
    prob = model.predict_proba(X_scaled)[0][1] # Probability of Class 1
    
    return {
        "prediction": int(prediction[0]),
        "probability": float(prob)
    }
