import os
from typing import List, Dict, Any
from datetime import datetime, timedelta
import json

# Try to import OpenAI, make it optional for now
try:
    import openai
    openai.api_key = os.getenv("OPENAI_API_KEY")
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    print("OpenAI not available. Install 'openai' package for AI features.")

# Common expense categories
EXPENSE_CATEGORIES = [
    "Food & Dining", "Transportation", "Shopping", "Entertainment", 
    "Bills & Utilities", "Healthcare", "Travel", "Education", 
    "Groceries", "Gas", "Insurance", "Investment", "Other"
]

async def categorize_expense(description: str) -> str:
    """Use AI to categorize an expense based on its description"""
    
    if not OPENAI_AVAILABLE or not openai.api_key:
        # Fallback to simple keyword matching
        description_lower = description.lower()
        
        if any(word in description_lower for word in ['grocery', 'food', 'restaurant', 'coffee', 'lunch', 'dinner']):
            return "Food & Dining"
        elif any(word in description_lower for word in ['gas', 'fuel', 'uber', 'taxi', 'bus', 'train']):
            return "Transportation"
        elif any(word in description_lower for word in ['electric', 'water', 'rent', 'mortgage', 'phone', 'internet']):
            return "Bills & Utilities"
        elif any(word in description_lower for word in ['shopping', 'store', 'amazon', 'clothes']):
            return "Shopping"
        else:
            return "Other"
    
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": f"""You are a financial categorization assistant. 
                    Categorize the expense description into one of these categories: {', '.join(EXPENSE_CATEGORIES)}.
                    Return ONLY the category name, nothing else."""
                },
                {
                    "role": "user",
                    "content": f"Categorize this expense: {description}"
                }
            ],
            max_tokens=50,
            temperature=0.1
        )
        
        category = response.choices[0].message.content.strip()
        
        # Validate the category is in our list
        if category in EXPENSE_CATEGORIES:
            return category
        else:
            return "Other"
            
    except Exception as e:
        print(f"Error categorizing expense: {e}")
        return "Other"

async def get_financial_insights(expenses_data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Generate AI-powered financial insights from expense data"""
    
    if not expenses_data:
        return {"insights": ["No expenses found"], "recommendations": ["Start tracking expenses"]}
    
    # Prepare expense summary for analysis
    total_amount = sum(expense["amount"] for expense in expenses_data)
    categories = {}
    
    for expense in expenses_data:
        category = expense["category"]
        categories[category] = categories.get(category, 0) + expense["amount"]
    
    # Generate basic insights without AI for now
    insights = []
    recommendations = []
    
    # Top spending category
    if categories:
        top_category = max(categories.items(), key=lambda x: x[1])
        insights.append(f"Your highest spending category is {top_category[0]} at ${top_category[1]:.2f}")
    
    # Daily average
    days = 30  # Assume last 30 days
    daily_avg = total_amount / days
    insights.append(f"Your daily average spending is ${daily_avg:.2f}")
    
    # Recommendations based on patterns
    if total_amount > 1000:
        recommendations.append("Consider setting a monthly budget to track your spending")
    
    if "Food & Dining" in categories and categories["Food & Dining"] > total_amount * 0.3:
        recommendations.append("Food spending is high - consider meal planning to reduce costs")
    
    recommendations.append("Keep tracking expenses regularly for better financial insights")
    
    return {
        "insights": insights,
        "recommendations": recommendations
    }

async def chat_with_assistant(message: str, context: Dict[str, Any] = None) -> str:
    """Chat with the AI assistant about finances"""
    
    if not OPENAI_AVAILABLE or not openai.api_key:
        # Provide basic responses without AI
        message_lower = message.lower()
        
        if any(word in message_lower for word in ['budget', 'save', 'saving']):
            return "Great question about budgeting! I recommend tracking your expenses regularly and setting spending limits for each category. A good rule of thumb is the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings."
        
        elif any(word in message_lower for word in ['spend', 'spending', 'expense']):
            return "To manage spending effectively, try categorizing your expenses and look for patterns. Focus on reducing variable expenses like dining out or entertainment if you need to cut costs."
        
        else:
            return "I'm here to help with your finances! Ask me about budgeting, saving, spending patterns, or any financial questions you have."
    
    # AI-powered response (when OpenAI is available)
    system_prompt = """You are a helpful financial assistant. You can help users with:
    - Understanding their spending patterns
    - Providing budgeting advice
    - Answering questions about personal finance
    - Suggesting ways to save money
    
    Keep responses helpful, concise, and actionable."""
    
    # Add context if provided
    if context:
        system_prompt += f"\n\nUser's financial context: {json.dumps(context)}"
    
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ],
            max_tokens=300,
            temperature=0.7
        )
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"Error in chat: {e}")
        return "I'm having trouble responding right now. Please try again later." 