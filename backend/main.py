from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import symptom, chatbot, emergency, appointments

app = FastAPI(
    title="SAHARA API",
    description="Smart AI Healthcare Assistance & Rapid Aid — Backend",
    version="1.0.0"
)

# CORS — allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your Vercel URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(symptom.router,     prefix="/api/symptom",     tags=["Symptom Checker"])
app.include_router(chatbot.router,     prefix="/api/chatbot",     tags=["Chatbot"])
app.include_router(emergency.router,   prefix="/api/emergency",   tags=["Emergency"])
app.include_router(appointments.router,prefix="/api/appointments",tags=["Appointments"])

@app.get("/")
def root():
    return {"message": "SAHARA API is running 🏥"}
