#!/usr/bin/env python3
"""
Admin Setup Script for Rebel Budget
Run this script to create your initial admin account.
"""

import sys
import os
from getpass import getpass
from sqlalchemy.orm import Session

# Add the app directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.models.database import SessionLocal, engine, Base
from app.models.user import User

def create_admin_user():
    """Create an admin user interactively"""
    print("🎭 Rebel Budget - Admin Setup")
    print("=" * 40)
    
    # Create database tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Get admin details
        print("\nSetting up your admin account...")
        email = input("Admin email: ").strip()
        
        if not email:
            print("❌ Email is required!")
            return False
            
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            print(f"❌ User with email {email} already exists!")
            
            # Ask if they want to make existing user admin
            make_admin = input("Make this user an admin? (y/N): ").strip().lower()
            if make_admin == 'y':
                existing_user.is_admin = True
                existing_user.is_verified = True
                db.commit()
                print(f"✅ {email} is now an admin!")
                return True
            else:
                return False
        
        full_name = input("Full name (optional): ").strip() or None
        
        # Get password securely
        while True:
            password = getpass("Password: ")
            if len(password) < 6:
                print("❌ Password must be at least 6 characters!")
                continue
                
            confirm_password = getpass("Confirm password: ")
            if password != confirm_password:
                print("❌ Passwords don't match!")
                continue
            break
        
        # Create admin user
        hashed_password = User.hash_password(password)
        admin_user = User(
            email=email,
            hashed_password=hashed_password,
            full_name=full_name,
            is_admin=True,
            is_verified=True,
            is_active=True
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print(f"\n✅ Admin user created successfully!")
        print(f"📧 Email: {email}")
        print(f"👤 Name: {full_name or 'Not provided'}")
        print(f"🔑 Admin: Yes")
        print(f"✅ Verified: Yes")
        
        return True
        
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        db.rollback()
        return False
    finally:
        db.close()

def list_users():
    """List all users in the database"""
    db = SessionLocal()
    try:
        users = db.query(User).all()
        if not users:
            print("No users found in database.")
            return
            
        print("\n👥 Current Users:")
        print("-" * 60)
        for user in users:
            admin_badge = "👑 ADMIN" if user.is_admin else "👤 USER"
            status = "✅ Active" if user.is_active else "❌ Inactive"
            verified = "✅ Verified" if user.is_verified else "❌ Unverified"
            
            print(f"{admin_badge} | {user.email}")
            print(f"    Name: {user.full_name or 'Not provided'}")
            print(f"    Status: {status} | {verified}")
            print(f"    Created: {user.created_at}")
            print("-" * 60)
            
    except Exception as e:
        print(f"❌ Error listing users: {e}")
    finally:
        db.close()

def main():
    """Main function"""
    if len(sys.argv) > 1 and sys.argv[1] == "list":
        list_users()
        return
    
    print("Welcome to Rebel Budget Admin Setup!")
    print("\nOptions:")
    print("1. Create admin account")
    print("2. List existing users")
    print("3. Exit")
    
    while True:
        choice = input("\nChoose an option (1-3): ").strip()
        
        if choice == "1":
            if create_admin_user():
                print("\n🎉 Admin setup complete! You can now log in to the app.")
            break
        elif choice == "2":
            list_users()
        elif choice == "3":
            print("Goodbye!")
            break
        else:
            print("❌ Invalid choice. Please enter 1, 2, or 3.")

if __name__ == "__main__":
    main() 