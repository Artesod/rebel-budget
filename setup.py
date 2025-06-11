#!/usr/bin/env python3
"""
Finance AI Assistant Setup Script
This script helps you set up the development environment.
"""

import os
import subprocess
import sys

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"\n{description}...")
    try:
        subprocess.run(command, shell=True, check=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        return False

def main():
    print("🚀 Setting up Finance AI Assistant...")
    
    # Check if we're in the right directory
    if not os.path.exists("README.md"):
        print("❌ Please run this script from the project root directory")
        sys.exit(1)
    
    # Backend setup
    print("\n📦 Setting up Backend...")
    
    if not os.path.exists("backend/venv"):
        if not run_command("cd backend && python -m venv venv", "Creating Python virtual environment"):
            sys.exit(1)
    
    # Determine activation command based on OS
    if os.name == 'nt':  # Windows
        activate_cmd = "backend\\venv\\Scripts\\activate"
        pip_cmd = "backend\\venv\\Scripts\\pip"
    else:  # Unix/Linux/Mac
        activate_cmd = "source backend/venv/bin/activate"
        pip_cmd = "backend/venv/bin/pip"
    
    if not run_command(f"{pip_cmd} install -r backend/requirements.txt", "Installing Python dependencies"):
        sys.exit(1)
    
    # Frontend setup
    print("\n🎨 Setting up Frontend...")
    
    if not run_command("cd frontend && npm install", "Installing Node.js dependencies"):
        sys.exit(1)
    
    # Create environment files
    print("\n⚙️ Setting up environment files...")
    
    if not os.path.exists("backend/.env"):
        if os.path.exists("backend/env.example"):
            run_command("cp backend/env.example backend/.env", "Creating backend .env file")
            print("📝 Please edit backend/.env and add your OpenAI API key")
    
    if not os.path.exists("frontend/.env"):
        with open("frontend/.env", "w") as f:
            f.write("REACT_APP_API_URL=http://localhost:8000/api/v1\n")
        print("✅ Created frontend .env file")
    
    print("\n🎉 Setup completed!")
    print("\nNext steps:")
    print("1. Edit backend/.env and add your OpenAI API key")
    print("2. Start the backend: cd backend && uvicorn main:app --reload")
    print("3. Start the frontend: cd frontend && npm start")
    print("4. Open http://localhost:3000 in your browser")

if __name__ == "__main__":
    main() 