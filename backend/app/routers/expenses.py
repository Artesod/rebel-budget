from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from ..models.database import get_db
from ..models.expense import Expense, ExpenseCreate, ExpenseUpdate, ExpenseResponse
from ..utils.security import get_current_user

router = APIRouter(prefix="/expenses", tags=["expenses"])

@router.post("/", response_model=ExpenseResponse)
async def create_expense(
    expense: ExpenseCreate, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Create a new expense with AI-powered categorization"""
    from ..services.ai_service import categorize_expense
    
    # Auto-categorize if no category provided or if category is "Other"
    category = expense.category
    if not category or category.lower() in ["other", ""]:
        category = await categorize_expense(expense.description)
    
    db_expense = Expense(
        user_id=current_user["user_id"],
        description=expense.description,
        amount=expense.amount,
        category=category,
        date=expense.date or datetime.now(),
        notes=expense.notes
    )
    
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    
    return db_expense

@router.get("/", response_model=List[ExpenseResponse])
async def get_expenses(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=1000),
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get expenses with optional filtering"""
    
    query = db.query(Expense).filter(Expense.user_id == current_user["user_id"])
    
    if category:
        query = query.filter(Expense.category == category)
    
    expenses = query.order_by(Expense.date.desc()).offset(skip).limit(limit).all()
    return expenses

@router.get("/{expense_id}", response_model=ExpenseResponse)
async def get_expense(
    expense_id: int, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get a specific expense by ID"""
    
    expense = db.query(Expense).filter(
        Expense.id == expense_id,
        Expense.user_id == current_user["user_id"]
    ).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    return expense

@router.put("/{expense_id}", response_model=ExpenseResponse)
async def update_expense(
    expense_id: int, 
    expense_update: ExpenseUpdate, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Update an existing expense"""
    
    expense = db.query(Expense).filter(
        Expense.id == expense_id,
        Expense.user_id == current_user["user_id"]
    ).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    update_data = expense_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(expense, field, value)
    
    db.commit()
    db.refresh(expense)
    
    return expense

@router.delete("/{expense_id}")
async def delete_expense(
    expense_id: int, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Delete an expense"""
    
    expense = db.query(Expense).filter(
        Expense.id == expense_id,
        Expense.user_id == current_user["user_id"]
    ).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    db.delete(expense)
    db.commit()
    
    return {"message": "Expense deleted successfully"}

@router.get("/categories/list")
async def get_categories(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get all available expense categories"""
    
    # Return predefined categories instead of only user's existing categories
    predefined_categories = [
        "Food & Dining",
        "Transportation", 
        "Shopping",
        "Entertainment",
        "Bills & Utilities",
        "Healthcare",
        "Travel",
        "Education",
        "Groceries",
        "Gas",
        "Insurance",
        "Investment",
        "Other"
    ]
    
    return predefined_categories 