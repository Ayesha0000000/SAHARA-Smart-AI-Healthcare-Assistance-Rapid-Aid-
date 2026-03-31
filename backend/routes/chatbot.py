from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
def chat(request: ChatRequest):
    # Website-only chatbot — redirects medical queries to symptom checker
    # TODO: Implement chatbot logic
    return {"reply": "Hello! I can help with doctor listings, hospital info, and appointments."}
