from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List
import json

from ..models.database import get_db
from ..models.user import User, UserResponse, UserCreate
from ..utils.security import get_admin_user, log_security_event, Auth

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/users", response_model=List[UserResponse])
async def get_all_users(
    admin_user: dict = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all users (admin only)"""
    log_security_event("ADMIN_USER_LIST", admin_user.get("user_id"), "Admin viewed user list")
    
    users = db.query(User).all()
    return users

@router.post("/users/{user_id}/toggle-admin")
async def toggle_user_admin(
    user_id: int,
    admin_user: dict = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Toggle admin status for a user (admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_admin = not user.is_admin
    db.commit()
    
    log_security_event(
        "ADMIN_STATUS_CHANGED", 
        admin_user.get("user_id"), 
        f"Changed admin status for user {user_id} to {user.is_admin}"
    )
    
    return {"message": f"User {user.email} admin status set to {user.is_admin}"}

@router.post("/users/{user_id}/toggle-active")
async def toggle_user_active(
    user_id: int,
    admin_user: dict = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Toggle active status for a user (admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_active = not user.is_active
    db.commit()
    
    log_security_event(
        "USER_STATUS_CHANGED", 
        admin_user.get("user_id"), 
        f"Changed active status for user {user_id} to {user.is_active}"
    )
    
    return {"message": f"User {user.email} active status set to {user.is_active}"}

@router.post("/create-admin")
async def create_admin_user(
    user_data: UserCreate,
    admin_user: dict = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Create a new admin user (admin only)"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    # Create new admin user
    hashed_password = User.hash_password(user_data.password)
    new_user = User(
        email=user_data.email,
        hashed_password=hashed_password,
        full_name=user_data.full_name,
        is_admin=True,
        is_verified=True
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    log_security_event(
        "ADMIN_USER_CREATED", 
        admin_user.get("user_id"), 
        f"Created admin user: {user_data.email}"
    )
    
    return {"message": f"Admin user {user_data.email} created successfully"}

@router.get("/stats")
async def get_admin_stats(
    admin_user: dict = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get admin dashboard stats"""
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    admin_users = db.query(User).filter(User.is_admin == True).count()
    verified_users = db.query(User).filter(User.is_verified == True).count()
    
    return {
        "total_users": total_users,
        "active_users": active_users,
        "admin_users": admin_users,
        "verified_users": verified_users,
        "inactive_users": total_users - active_users
    } 