"""
Authentication routes for manual-entry finance app
Simple login/register functionality
"""

from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr
from app.utils.security import Auth, Validation, get_current_user, is_password_strong_enough, log_security_event
from app.models.user import User, UserCreate, UserLogin, UserResponse
from app.models.database import get_db
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

router = APIRouter(prefix="/auth", tags=["authentication"])

# Response models
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class MessageResponse(BaseModel):
    message: str

@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    
    # Validate password strength
    is_strong, message = is_password_strong_enough(user_data.password)
    if not is_strong:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = Auth.hash_password(user_data.password)
    db_user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=hashed_password
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create token
    token = Auth.create_token({"id": db_user.id, "email": db_user.email, "is_admin": db_user.is_admin})
    
    # Log security event
    log_security_event("USER_REGISTERED", db_user.id, f"Email: {db_user.email}")
    
    return TokenResponse(
        access_token=token,
        user=UserResponse.from_orm(db_user)
    )

@router.post("/login", response_model=TokenResponse)
async def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """Login user"""
    
    # Find user
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user:
        log_security_event("LOGIN_FAILED", None, f"Email not found: {login_data.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check if account is locked
    if user.locked_until and user.locked_until > datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_423_LOCKED,
            detail="Account temporarily locked due to failed login attempts"
        )
    
    # Verify password
    if not Auth.verify_password(login_data.password, user.hashed_password):
        # Increment failed attempts
        user.failed_login_attempts += 1
        
        # Lock account after 5 failed attempts
        if user.failed_login_attempts >= 5:
            user.locked_until = datetime.utcnow() + timedelta(minutes=15)
            log_security_event("ACCOUNT_LOCKED", user.id, "Too many failed login attempts")
        
        db.commit()
        
        log_security_event("LOGIN_FAILED", user.id, "Invalid password")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Reset failed attempts on successful login
    user.failed_login_attempts = 0
    user.locked_until = None
    user.last_login = datetime.utcnow()
    db.commit()
    
    # Create token
    token = Auth.create_token({"id": user.id, "email": user.email, "is_admin": user.is_admin})
    
    log_security_event("LOGIN_SUCCESS", user.id, f"Email: {user.email}")
    
    return TokenResponse(
        access_token=token,
        user=UserResponse.from_orm(user)
    )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get current user information"""
    
    user = db.query(User).filter(User.id == current_user["user_id"]).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse.from_orm(user)

@router.post("/logout", response_model=MessageResponse)
async def logout(current_user: dict = Depends(get_current_user)):
    """Logout user (client should delete token)"""
    
    log_security_event("LOGOUT", current_user["user_id"], f"Email: {current_user['email']}")
    
    return MessageResponse(message="Successfully logged out") 