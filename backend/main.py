from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.complaints import router as complaint_router
from routes.authority import router as authority_router

from database.mongodb import test_database


app = FastAPI(
    title="City Friction API",
    description="AI-powered civic complaint management system",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


app.include_router(complaint_router)
app.include_router(authority_router)


@app.get("/")
def home():
    return {
        "project": "City Friction",
        "message": "Backend is running",
        "status": "success"
    }


@app.get("/health")
def health():

    database_status = test_database()

    return {
        "backend": "healthy",
        "database": (
            "connected"
            if database_status
            else "disconnected"
        )
    }