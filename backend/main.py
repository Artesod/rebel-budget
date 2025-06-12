from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import expenses, ai_assistant, analytics
from app.models.database import engine, Base
from app.services.ai_service import categorize_expense
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Finance AI Assistant",
    description="A comprehensive financial management tool powered by AI",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(expenses.router, prefix="/api/v1")
app.include_router(ai_assistant.router, prefix="/api/v1")
app.include_router(analytics.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Finance AI Assistant API is running!"} 