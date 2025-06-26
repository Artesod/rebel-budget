from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
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

# Security middleware (only in production)
use_https = os.getenv("USE_HTTPS", "false").lower() == "true"
if use_https:
    # HTTPS redirect middleware
    app.add_middleware(HTTPSRedirectMiddleware)
    
    # Trusted host middleware for production
    allowed_hosts = os.getenv("ALLOWED_HOSTS", "localhost").split(",")
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=allowed_hosts)

# Configure CORS
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://192.168.50.57:3000,http://192.168.50.5:3000").split(",")
print(f"🌐 CORS Origins configured: {cors_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request debugging middleware
@app.middleware("http")
async def debug_requests(request: Request, call_next):
    # Log request details
    print(f"🔍 {request.method} {request.url.path}")
    print(f"📍 Client: {request.client.host if request.client else 'Unknown'}")
    print(f"🏷️ Headers: Origin={request.headers.get('origin')}, User-Agent={request.headers.get('user-agent', 'Unknown')[:50]}")
    
    response = await call_next(request)
    
    print(f"📤 Response: {response.status_code}")
    if response.status_code >= 400:
        print(f"❌ Error response for {request.method} {request.url.path}")
    
    return response

# Security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    
    # Security headers for HTTPS
    if use_https:
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
    
    return response

# Include routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")
app.include_router(expenses.router, prefix="/api/v1")
app.include_router(ai_assistant.router, prefix="/api/v1")
app.include_router(analytics.router, prefix="/api/v1")


# Static files and frontend serving (only if built frontend exists)
static_dir = Path("static")
static_files_dir = Path("static/static")
index_file = Path("static/index.html")

if static_dir.exists() and static_files_dir.exists() and index_file.exists():
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