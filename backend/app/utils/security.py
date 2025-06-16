
from datetime import datetime, timedelta
from typing import Optional, Dict
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
from dotenv import load_dotenv

load_dotenv()

# Simple configuration
SECRET_KEY = os.getenv("SECRET_KEY", "change-this-secret-key-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24  # Longer for better UX since no sensitive bank data

# Password hashing (essential)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

class Auth:
    """Authentication utilities for manual-entry finance apps"""
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash password for storage"""
        return pwd_context.hash(password)
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify password"""
        return pwd_context.verify(plain_password, hashed_password)
    
    @staticmethod
    def create_token(user_data: Dict) -> str:
        """Create JWT token with longer expiry for better UX"""
        expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
        to_encode = {
            "sub": str(user_data["id"]),
            "email": user_data["email"],
            "is_admin": user_data.get("is_admin", False),
            "exp": expire
        }
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    @staticmethod
    def verify_token(token: str) -> Dict:
        """Verify JWT token"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = payload.get("sub")
            email = payload.get("email")
            is_admin = payload.get("is_admin", False)
            
            if user_id is None or email is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token"
                )
            
            return {"user_id": int(user_id), "email": email, "is_admin": is_admin}
        
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

class Validation:
    """Input validation utilities for manual entry data"""
    
    @staticmethod
    def validate_expense_amount(amount: float) -> bool:
        """Validate expense amount is reasonable"""
        if amount <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Amount must be positive"
            )
        
        if amount > 1000000:  # $1M limit for manual entry
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Amount too large for manual entry"
            )
        
        return True
    
    @staticmethod
    def validate_description(description: str) -> str:
        """Basic description validation and sanitization"""
        if not description or len(description.strip()) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Description is required"
            )
        
        # Basic sanitization - remove potential XSS
        description = description.strip()
        if len(description) > 500:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Description too long (max 500 characters)"
            )
        
        # Remove basic HTML tags for safety
        import re
        description = re.sub(r'<[^>]+>', '', description)
        
        return description
    
    @staticmethod
    def validate_category(category: str) -> str:
        """Validate expense category"""
        allowed_categories = [
            "Food", "Transportation", "Entertainment", "Shopping", 
            "Bills", "Healthcare", "Education", "Travel", "Other"
        ]
        
        if category not in allowed_categories:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid category. Must be one of: {', '.join(allowed_categories)}"
            )
        
        return category

class RateLimit:
    """Rate limiting utilities for manual entry apps"""
    
    def __init__(self):
        self.requests = {}
    
    def check_rate_limit(self, key: str, max_requests: int = 100, window_minutes: int = 60) -> bool:
        """Simple rate limiting - 100 requests per hour is generous for manual entry"""
        now = datetime.utcnow()
        window_start = now - timedelta(minutes=window_minutes)
        
        if key not in self.requests:
            self.requests[key] = []
        
        # Clean old requests
        self.requests[key] = [req_time for req_time in self.requests[key] if req_time > window_start]
        
        # Check limit
        if len(self.requests[key]) >= max_requests:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again later."
            )
        
        # Add current request
        self.requests[key].append(now)
        return True

# Global instances
rate_limiter = RateLimit()

# Dependencies for FastAPI
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user from JWT token"""
    try:
        token = credentials.credentials
        return Auth.verify_token(token)
    except HTTPException as e:
        # Log the authentication error for debugging
        log_security_event("AUTH_ERROR", None, f"Token verification failed: {e.detail}")
        raise e
    except Exception as e:
        # Handle any other authentication errors
        log_security_event("AUTH_ERROR", None, f"Unexpected auth error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed"
        )

from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional

security_optional = HTTPBearer(auto_error=False)

async def get_current_user_optional(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_optional)):
    """Get current user from JWT token - optional (for debugging)"""
    try:
        if not credentials:
            return None
        token = credentials.credentials
        return Auth.verify_token(token)
    except Exception as e:
        log_security_event("AUTH_DEBUG", None, f"Optional auth failed: {str(e)}")
        return None

async def rate_limit_check(request: Request):
    """Rate limiting dependency"""
    client_ip = request.client.host
    rate_limiter.check_rate_limit(client_ip)
    return True

# Password strength check (simplified)
def is_password_strong_enough(password: str) -> tuple[bool, str]:
    """Simplified password requirements for better UX"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters"
    
    if password.lower() in ["password", "12345678", "qwerty123"]:
        return False, "Password is too common"
    
    # Just require length and not being common
    return True, "Password is acceptable"

# Simple logging for security events
def log_security_event(event_type: str, user_id: Optional[int] = None, details: str = ""):
    """Basic security event logging"""
    timestamp = datetime.utcnow().isoformat()
    print(f"[SECURITY] {timestamp} - {event_type} - User: {user_id} - {details}")
    
    # In production, log to a file or service
    # For now, console logging is sufficient

# Admin utilities
def require_admin(current_user: dict):
    """Check if current user is admin, raise exception if not"""
    from fastapi import HTTPException, status
    
    if not current_user.get("is_admin", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return True

async def get_admin_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user and verify admin status"""
    from fastapi import Depends
    
    user_data = Auth.verify_token(credentials.credentials)
    
    # In a real app, you'd fetch the user from database to get is_admin
    # For now, we'll check if it's in the token or assume based on email
    if user_data.get("email") == "admin@financeai.com":
        user_data["is_admin"] = True
    
    require_admin(user_data)
    return user_data 