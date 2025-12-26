# AgroConnect AI Service - Enhanced for Driver Rating & Price Estimation
import os
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

# Initialize FastAPI
app = FastAPI(title="AgroConnect AI Service", version="2.0")

# CORS middleware for Node.js backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML models
try:
    model = joblib.load('agri_vtc_model.pkl')
    le_vehicule = joblib.load('encoder_vehicule.pkl')
    le_category = joblib.load('encoder_category.pkl')
    le_city = joblib.load('encoder_city.pkl')
    print("✅ Models loaded successfully")
except Exception as e:
    print(f"❌ Error loading models: {e}")
    model = None

# Data models
class TripData(BaseModel):
    vehicule: str
    produit: str
    ville: str
    poids: float
    duree: float
    prix: float

class DriverRatingRequest(BaseModel):
    driverId: str
    trips: List[TripData]

class PriceEstimationRequest(BaseModel):
    vehicule: str
    produit: str
    ville: str
    poids: float
    duree: float

# Helper function to encode and predict
def predict_reliability(vehicule: str, produit: str, ville: str, poids: float, duree: float, prix: float):
    if model is None:
        return 75.0  # Default score if model not loaded
    
    try:
        # Encode features
        try:
            vehicule_code = le_vehicule.transform([vehicule])[0]
        except:
            vehicule_code = 0
        
        try:
            category_code = le_category.transform([produit])[0]
        except:
            category_code = 0
        
        try:
            city_code = le_city.transform([ville])[0]
        except:
            city_code = 0
        
        # Create features dataframe
        features = pd.DataFrame(
            [[vehicule_code, category_code, city_code, poids, duree, prix]], 
            columns=['Type_Vehicule', 'Category Name', 'Order City', 
                    'Order Item Quantity (KG)', 'Duree_Trajet_Heures', 'Prix_Total_Course_DZD']
        )
        
        # Predict probability of failure
        proba_risque = model.predict_proba(features)[0][1]
        
        # Convert to reliability score (0-100)
        score_fiabilite = round((1 - proba_risque) * 100, 1)
        
        return score_fiabilite
    except Exception as e:
        print(f"Prediction error: {e}")
        return 75.0  # Default score on error

# Endpoint 1: Analyze single trip
@app.post("/analyze")
def analyze_trip(data: TripData):
    """Analyze a single trip and return reliability score"""
    score = predict_reliability(
        data.vehicule, data.produit, data.ville,
        data.poids, data.duree, data.prix
    )
    
    # Generate insight based on score
    if score >= 85:
        insight = "Excellent! Cette livraison a de très bonnes chances de réussir."
        risk_level = "Faible"
    elif score >= 70:
        insight = "Bien. Livraison fiable avec quelques précautions standards."
        risk_level = "Moyen"
    elif score >= 50:
        insight = "Attention. Vérifiez les conditions et prévoyez du temps supplémentaire."
        risk_level = "Moyen-Élevé"
    else:
        insight = "Risque élevé. Recommandez une assurance ou un véhicule plus adapté."
        risk_level = "Élevé"
    
    return {
        "score": score,
        "insight": insight,
        "risk_level": risk_level,
        "recommendation": "OK" if score >= 70 else "REVIEW_NEEDED"
    }

# Endpoint 2: Calculate driver rating
@app.post("/rate-driver")
def rate_driver(request: DriverRatingRequest):
    """Calculate aggregate driver rating based on trip history"""
    if not request.trips:
        return {
            "driverId": request.driverId,
            "overall_rating": 0,
            "total_trips": 0,
            "message": "No trip history available"
        }
    
    scores = []
    trip_details = []
    
    for trip in request.trips:
        score = predict_reliability(
            trip.vehicule, trip.produit, trip.ville,
            trip.poids, trip.duree, trip.prix
        )
        scores.append(score)
        trip_details.append({
            "destination": trip.ville,
            "score": score,
            "weight": trip.poids,
            "duration": trip.duree
        })
    
    # Calculate overall rating
    overall_rating = round(sum(scores) / len(scores), 1)
    
    # Performance category
    if overall_rating >= 85:
        category = "⭐ Excellence"
    elif overall_rating >= 75:
        category = "✅ Très Bien"
    elif overall_rating >= 65:
        category = "👍 Bien"
    else:
        category = "⚠️ Amélioration Nécessaire"
    
    return {
        "driverId": request.driverId,
        "overall_rating": overall_rating,
        "category": category,
        "total_trips": len(scores),
        "best_score": max(scores),
        "worst_score": min(scores),
        "consistency": round(100 - (max(scores) - min(scores)), 1),
        "trip_details": trip_details[:5]  # Return last 5 trips
    }

# Endpoint 3: Estimate optimal price
@app.post("/estimate-price")
def estimate_price(request: PriceEstimationRequest):
    """Estimate optimal price for a trip based on historical data"""
    
    # Base price calculation (simple heuristic)
    # Prix = (Poids × 0.5) + (Durée × 100) + (Facteur Ville × 500)
    base_price = (request.poids * 0.5) + (request.duree * 100) + 1000
    
    # Get reliability score at this base price
    score_at_base = predict_reliability(
        request.vehicule, request.produit, request.ville,
        request.poids, request.duree, base_price
    )
    
    # Adjust price based on reliability
    # If low reliability, suggest higher price (more compensation for risk)
    if score_at_base < 60:
        suggested_price = base_price * 1.3  # +30%
        note = "Prix majoré pour compenser le risque"
    elif score_at_base < 75:
        suggested_price = base_price * 1.15  # +15%
        note = "Prix légèrement majoré"
    else:
        suggested_price = base_price
        note = "Prix optimal standard"
    
    return {
        "suggested_price": round(suggested_price, 2),
        "min_price": round(suggested_price * 0.85, 2),
        "max_price": round(suggested_price * 1.15, 2),
        "reliability_score": score_at_base,
        "note": note,
        "currency": "DZD"
    }

# Health check
@app.get("/")
def health_check():
    return {
        "status": "running",
        "service": "AgroConnect AI",
        "version": "2.0",
        "model_loaded": model is not None
    }

# Run with: uvicorn main:app --reload --port 8000
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)