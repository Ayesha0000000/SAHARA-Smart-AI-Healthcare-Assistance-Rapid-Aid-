from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class AppointmentRequest(BaseModel):
    doctor_id: str
    patient_uid: str
    date: str
    time_slot: str

@router.post("/book")
def book_appointment(req: AppointmentRequest):
    # TODO: Save to Firestore
    return {"status": "success", "message": "Appointment booked (placeholder)"}

@router.get("/list/{patient_uid}")
def list_appointments(patient_uid: str):
    return {"appointments": []}
