# ============================================================
# SAHARA | Routes — hospitals.py
# Endpoints: /hospitals, /hospitals/{id}, /hospitals/nearby
# ============================================================

from fastapi import APIRouter, Query
from typing import Optional
import json, os

router = APIRouter()

# Load Attock hospital registry
DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "hospitals.json")

def load_hospitals():
    if os.path.exists(DATA_PATH):
        with open(DATA_PATH) as f:
            return json.load(f)
    # Fallback: inline data if JSON not yet exported from Excel
    return [
        {"id": "HOS001", "name": "Family Dental Clinic",         "city": "Hazro",    "address": "Circular Rd, near Nawaz Shareef School, Hazro", "lat": 33.910, "lng": 72.490, "phone": "0311-1222398", "emergency": False, "specializations": ["General Physician", "Dentist"]},
        {"id": "HOS002", "name": "Wajahat Surgical Hospital",     "city": "Attock",   "address": "Darul Islam Colony, Attock",                    "lat": 33.766, "lng": 72.360, "phone": "0311-1222398", "emergency": True,  "specializations": ["Gynecologist"]},
        {"id": "HOS005", "name": "INDUS Hospital",                "city": "Attock",   "address": "Pleader Lane, Attock",                          "lat": 33.768, "lng": 72.362, "phone": "042-32380080", "emergency": True,  "specializations": ["Neuro Surgeon", "Dentist"]},
        {"id": "HOS006", "name": "Hameed Memorial Hospital Kamra","city": "Kamra",    "address": "Main GT Road, Gate#2, Kamra Cantt",             "lat": 33.780, "lng": 72.350, "phone": "042-32380080", "emergency": True,  "specializations": ["Psychologist"]},
        {"id": "HOS023", "name": "CMH Attock Hospital",           "city": "Attock",   "address": "Near Army Public School, Cantt",                "lat": 33.775, "lng": 72.358, "phone": "N/A",          "emergency": True,  "specializations": ["General", "Surgery", "Pediatrics", "Gynae", "ENT", "ICU"]},
        {"id": "HOS027", "name": "DHQ Hospital",                  "city": "Attock",   "address": "Kamra Road, Mehr Pura East",                    "lat": 33.770, "lng": 72.365, "phone": "042-32380080", "emergency": True,  "specializations": ["Family Medicine"]},
    ]

@router.get("/")
def get_hospitals(city: Optional[str] = None, emergency: Optional[bool] = None):
    """Get all hospitals, optionally filter by city or emergency"""
    data = load_hospitals()
    if city:
        data = [h for h in data if h["city"].lower() == city.lower()]
    if emergency is not None:
        data = [h for h in data if h["emergency"] == emergency]
    return {"total": len(data), "hospitals": data}

@router.get("/emergency")
def get_emergency_hospitals():
    """Get all hospitals with emergency services"""
    data = [h for h in load_hospitals() if h.get("emergency")]
    return {"total": len(data), "hospitals": data}

@router.get("/{hospital_id}")
def get_hospital(hospital_id: str):
    """Get single hospital by ID"""
    data = load_hospitals()
    for h in data:
        if h["id"] == hospital_id:
            return h
    return {"error": "Hospital not found"}

@router.get("/nearby/location")
def get_nearby(lat: float = Query(...), lng: float = Query(...), radius_km: float = 10):
    """Get hospitals within radius_km of given coordinates"""
    import math
    def distance(lat1, lng1, lat2, lng2):
        R = 6371
        dlat = math.radians(lat2 - lat1)
        dlng = math.radians(lng2 - lng1)
        a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng/2)**2
        return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    data = load_hospitals()
    nearby = []
    for h in data:
        if h.get("lat") and h.get("lng"):
            d = distance(lat, lng, h["lat"], h["lng"])
            if d <= radius_km:
                h["distance_km"] = round(d, 2)
                nearby.append(h)
    nearby.sort(key=lambda x: x["distance_km"])
    return {"total": len(nearby), "hospitals": nearby}
