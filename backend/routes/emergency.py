from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class LocationRequest(BaseModel):
    latitude: float
    longitude: float

@router.post("/nearest-hospital")
def nearest_hospital(location: LocationRequest):
    # TODO: Query Attock hospital registry + Nominatim/OSM
    return {"hospital_name": "placeholder", "address": "", "distance_km": 0.0, "directions_url": ""}
