from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Dict, Any, List
from datetime import datetime, timedelta

from ..models.database import get_db
from ..models.expense import Expense
from ..services.ai_service import get_financial_insights, chat_with_assistant

router = APIRouter(prefix="/ai", tags=["ai-assistant"])

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    context: Dict[str, Any] = {}

class InsightsResponse(BaseModel):
    insights: List[str]
    recommendations: List[str]
    summary: Dict[str, Any]

@router.post("/chat", response_model=ChatResponse)
async def chat(message: ChatMessage, db: Session = Depends(get_db)):
    """Chat with the AI financial assistant"""
    
    # Get recent expenses for context
    thirty_days_ago = datetime.now() - timedelta(days=30)
    recent_expenses = db.query(Expense).filter(
        Expense.date >= thirty_days_ago
    ).all()
    
    # Create context from recent expenses
    context = {}
    if recent_expenses:
        total_spent = sum(expense.amount for expense in recent_expenses)
        categories = {}
        for expense in recent_expenses:
            categories[expense.category] = categories.get(expense.category, 0) + expense.amount
        
        context = {
            "total_spent_30_days": total_spent,
            "expense_count": len(recent_expenses),
            "top_categories": dict(sorted(categories.items(), key=lambda x: x[1], reverse=True)[:3])
        }
    
    response = await chat_with_assistant(message.message, context)
    
    return ChatResponse(response=response, context=context)

@router.get("/insights", response_model=InsightsResponse)
async def get_insights(
    days: int = 30,
    db: Session = Depends(get_db)
):
    """Get AI-powered financial insights based on recent expenses"""
    
    # Get expenses from the specified number of days
    start_date = datetime.now() - timedelta(days=days)
    expenses = db.query(Expense).filter(
        Expense.date >= start_date
    ).all()
    
    if not expenses:
        return InsightsResponse(
            insights=["No expenses found for the specified period"],
            recommendations=["Start tracking your expenses to get personalized insights"],
            summary={"total_expenses": 0, "expense_count": 0, "period_days": days}
        )
    
    # Prepare expense data for AI analysis
    expenses_data = []
    for expense in expenses:
        expenses_data.append({
            "description": expense.description,
            "amount": expense.amount,
            "category": expense.category,
            "date": expense.date.isoformat()
        })
    
    # Get AI insights
    ai_insights = await get_financial_insights(expenses_data)
    
    # Calculate summary statistics
    total_amount = sum(expense.amount for expense in expenses)
    categories = {}
    for expense in expenses:
        categories[expense.category] = categories.get(expense.category, 0) + expense.amount
    
    summary = {
        "total_expenses": total_amount,
        "expense_count": len(expenses),
        "period_days": days,
        "average_daily_spend": total_amount / days if days > 0 else 0,
        "category_breakdown": categories,
        "top_category": max(categories.items(), key=lambda x: x[1])[0] if categories else "None"
    }
    
    return InsightsResponse(
        insights=ai_insights.get("insights", []),
        recommendations=ai_insights.get("recommendations", []),
        summary=summary
    )

@router.post("/categorize")
async def categorize_description(description: str):
    """Get AI-suggested category for an expense description"""
    
    from ..services.ai_service import categorize_expense
    
    category = await categorize_expense(description)
    return {"suggested_category": category} 