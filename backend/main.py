from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.routers import expenses, ai_assistant, analytics, auth, admin
from app.models.database import engine, Base
from app.services.ai_service import categorize_expense
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Rebel Budget",
    description="A comprehensive financial management tool powered by AI",
    version="1.0.0"
)

# Configure CORS
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")
app.include_router(expenses.router, prefix="/api/v1")
app.include_router(ai_assistant.router, prefix="/api/v1")
app.include_router(analytics.router, prefix="/api/v1")

# Static files and frontend serving
static_dir = Path("static")
if static_dir.exists():
    # Mount static files (CSS, JS, images) - React build puts files in static/css and static/js
    app.mount("/static", StaticFiles(directory="static/static"), name="static")
    
    # Serve React app for all non-API routes
    @app.get("/{full_path:path}")
    async def serve_react_app(request: Request, full_path: str):
        # If it's an API route, let it pass through
        if full_path.startswith("api/"):
            return {"error": "API endpoint not found"}
        
        # For all other routes, serve the React app
        return FileResponse("static/index.html")

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "Rebel Budget API is running!"} 