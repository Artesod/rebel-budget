from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta

from ..models.database import get_db
from ..models.expense import Expense

router = APIRouter(prefix="/analytics", tags=["analytics"])

class CategoryAnalysis(BaseModel):
    category: str
    total_amount: float
    percentage: float
    expense_count: int
    average_amount: float

class TrendAnalysis(BaseModel):
    period: str
    total_amount: float
    expense_count: int
    average_daily_spend: float

class AnalyticsOverview(BaseModel):
    total_expenses: float
    expense_count: int
    categories: List[CategoryAnalysis]
    monthly_trends: List[TrendAnalysis]

@router.get("/overview", response_model=AnalyticsOverview)
async def get_analytics_overview(
    months: int = Query(6, ge=1, le=12),
    db: Session = Depends(get_db)
):
    """Get comprehensive analytics overview"""
    
    # Get expenses from the specified number of months
    start_date = datetime.now() - timedelta(days=months * 30)
    expenses = db.query(Expense).filter(
        Expense.date >= start_date
    ).all()
    
    if not expenses:
        return AnalyticsOverview(
            total_expenses=0,
            expense_count=0,
            categories=[],
            monthly_trends=[]
        )
    
    # Calculate category analysis
    category_data = {}
    total_amount = sum(expense.amount for expense in expenses)
    
    for expense in expenses:
        if expense.category not in category_data:
            category_data[expense.category] = {
                'total': 0,
                'count': 0,
                'amounts': []
            }
        category_data[expense.category]['total'] += expense.amount
        category_data[expense.category]['count'] += 1
        category_data[expense.category]['amounts'].append(expense.amount)
    
    categories = []
    for category, data in category_data.items():
        categories.append(CategoryAnalysis(
            category=category,
            total_amount=data['total'],
            percentage=(data['total'] / total_amount) * 100 if total_amount > 0 else 0,
            expense_count=data['count'],
            average_amount=data['total'] / data['count'] if data['count'] > 0 else 0
        ))
    
    # Sort categories by total amount
    categories.sort(key=lambda x: x.total_amount, reverse=True)
    
    # Calculate monthly trends
    monthly_trends = []
    for i in range(months):
        month_start = datetime.now() - timedelta(days=(i + 1) * 30)
        month_end = datetime.now() - timedelta(days=i * 30)
        
        month_expenses = [
            expense for expense in expenses
            if month_start <= expense.date <= month_end
        ]
        
        month_total = sum(expense.amount for expense in month_expenses)
        monthly_trends.append(TrendAnalysis(
            period=month_start.strftime("%B %Y"),
            total_amount=month_total,
            expense_count=len(month_expenses),
            average_daily_spend=month_total / 30 if month_total > 0 else 0
        ))
    
    return AnalyticsOverview(
        total_expenses=total_amount,
        expense_count=len(expenses),
        categories=categories,
        monthly_trends=monthly_trends
    )

@router.get("/category/{category}")
async def get_category_analysis(
    category: str,
    days: int = Query(90, ge=1, le=365),
    db: Session = Depends(get_db)
):
    """Get detailed analysis for a specific category"""
    
    start_date = datetime.now() - timedelta(days=days)
    expenses = db.query(Expense).filter(
        Expense.category == category,
        Expense.date >= start_date
    ).all()
    
    if not expenses:
        return {"message": f"No expenses found for category '{category}' in the last {days} days"}
    
    total_amount = sum(expense.amount for expense in expenses)
    amounts = [expense.amount for expense in expenses]
    
    return {
        "category": category,
        "period_days": days,
        "total_amount": total_amount,
        "expense_count": len(expenses),
        "average_amount": total_amount / len(expenses),
        "min_amount": min(amounts),
        "max_amount": max(amounts),
        "recent_expenses": [
            {
                "description": expense.description,
                "amount": expense.amount,
                "date": expense.date.isoformat()
            }
            for expense in sorted(expenses, key=lambda x: x.date, reverse=True)[:10]
        ]
    }

@router.get("/trends/daily")
async def get_daily_trends(
    days: int = Query(30, ge=7, le=90),
    db: Session = Depends(get_db)
):
    """Get daily spending trends"""
    
    start_date = datetime.now() - timedelta(days=days)
    expenses = db.query(Expense).filter(
        Expense.date >= start_date
    ).all()
    
    # Group by date
    daily_data = {}
    for expense in expenses:
        date_str = expense.date.strftime("%Y-%m-%d")
        if date_str not in daily_data:
            daily_data[date_str] = {"total": 0, "count": 0}
        daily_data[date_str]["total"] += expense.amount
        daily_data[date_str]["count"] += 1
    
    # Fill in missing dates with zero
    trend_data = []
    for i in range(days):
        date = (start_date + timedelta(days=i)).strftime("%Y-%m-%d")
        data = daily_data.get(date, {"total": 0, "count": 0})
        trend_data.append({
            "date": date,
            "total_amount": data["total"],
            "expense_count": data["count"]
        })
    
    return {"trends": trend_data} 