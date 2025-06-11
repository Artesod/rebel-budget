# Finance AI Assistant

A comprehensive financial management tool powered by AI to help track expenses, provide insights, and predict future spending patterns.

## Features

- 💰 **Smart Expense Tracking**: Add and categorize expenses with AI-powered categorization
- 🤖 **AI Chat Assistant**: Natural language queries about your finances
- 📊 **Predictive Analytics**: ML-powered expense prediction and trend analysis
- 📈 **Interactive Dashboards**: Beautiful visualizations of spending patterns

## Quick Start

1. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   python -m uvicorn main:app --reload --port 8000
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   yarn install
   yarn start
   ```

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/docs

## Tech Stack

- **Backend**: Python, FastAPI, SQLAlchemy, OpenAI API
- **Frontend**: React, TypeScript, Tailwind CSS
- **Database**: SQLite 