# Finance AI Assistant 🤖💰

A comprehensive financial management application powered by AI, featuring intelligent expense tracking, financial insights, and an AI chat assistant.

## 🚀 Features

### Core Functionality
- **Smart Expense Tracking**: Automatically categorize expenses using AI
- **RESTful API**: Complete CRUD operations for expense management
- **Financial Analytics**: Comprehensive spending analysis and trends
- **AI Chat Assistant**: Get personalized financial advice and insights

### AI-Powered Features
- **Auto-Categorization**: Expenses are automatically categorized using AI/ML
- **Financial Insights**: AI-generated spending patterns and recommendations  
- **Chat Assistant**: Natural language financial advice and Q&A
- **Predictive Analytics**: Spending trends and category analysis

## 🏗️ Architecture

### Backend (Python FastAPI)
- **FastAPI** - Modern, fast web framework
- **SQLAlchemy** - Database ORM with SQLite
- **OpenAI Integration** - AI-powered features (optional)
- **Pydantic** - Data validation and serialization

### Frontend (React TypeScript)
- **React** - Modern UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Chart.js** - Data visualization

## 📁 Project Structure

```
finance-ai-assistant/
├── backend/
│   ├── app/
│   │   ├── models/          # Database models
│   │   ├── routers/         # API endpoints
│   │   ├── services/        # Business logic & AI services
│   │   └── main.py         # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── env.example         # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API client
│   │   └── types/          # TypeScript types
│   ├── package.json        # Node dependencies
│   └── tailwind.config.js  # Styling configuration
└── README.md
```

## 🛠️ Setup & Installation

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment** (recommended):
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # or
   source venv/bin/activate  # macOS/Linux
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables** (optional for AI features):
   ```bash
   cp env.example .env
   # Edit .env and add your OpenAI API key
   ```

5. **Run the application**:
   ```bash
   uvicorn main:app --reload
   ```

The API will be available at: `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- Alternative docs: `http://localhost:8000/redoc`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Start development server**:
   ```bash
   yarn start
   ```

The frontend will be available at: `http://localhost:3000`

## 🔌 API Endpoints

### Expenses
- `GET /api/v1/expenses/` - List all expenses
- `POST /api/v1/expenses/` - Create new expense (with auto-categorization)
- `GET /api/v1/expenses/{id}` - Get specific expense
- `PUT /api/v1/expenses/{id}` - Update expense
- `DELETE /api/v1/expenses/{id}` - Delete expense
- `GET /api/v1/expenses/categories/list` - Get all categories

### AI Assistant
- `POST /api/v1/ai/chat` - Chat with AI assistant
- `GET /api/v1/ai/insights` - Get financial insights
- `POST /api/v1/ai/categorize` - Get category suggestion

### Analytics
- `GET /api/v1/analytics/overview` - Comprehensive analytics
- `GET /api/v1/analytics/category/{category}` - Category analysis
- `GET /api/v1/analytics/trends/daily` - Daily spending trends

## 💡 Key Features Implemented

### 1. Smart Expense Creation
```python
# Expenses are automatically categorized when created
expense = {
    "description": "Starbucks coffee",
    "amount": 5.50,
    "category": "Other"  # Will be auto-categorized as "Food & Dining"
}
```

### 2. AI Financial Insights
- Spending pattern analysis
- Category breakdowns with percentages
- Personalized recommendations
- Monthly trend analysis

### 3. Chat Assistant
- Natural language financial advice
- Context-aware responses using your expense data
- Budgeting tips and recommendations

### 4. Comprehensive Analytics
- Category-wise spending analysis
- Daily/monthly trend tracking
- Statistical insights (averages, totals, etc.)

## 🤖 AI Integration

The application includes both AI-powered and fallback functionality:

- **With OpenAI API**: Advanced categorization and personalized insights
- **Without API**: Rule-based categorization and basic insights

Set your OpenAI API key in the `.env` file to enable full AI features.

## 🛡️ Data & Privacy

- All data stored locally in SQLite database
- No external data sharing (except OpenAI API when enabled)
- Complete control over your financial information

## 🚀 Next Steps & Enhancements

- [ ] Add budget management and tracking
- [ ] Implement recurring expense detection
- [ ] Add data export functionality
- [ ] Create mobile-responsive design
- [ ] Add expense receipt scanning
- [ ] Implement expense categories customization
- [ ] Add financial goal tracking

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Demo Usage

### Adding an Expense
```bash
curl -X POST "http://localhost:8000/api/v1/expenses/" \
     -H "Content-Type: application/json" \
     -d '{
       "description": "Grocery shopping at Whole Foods",
       "amount": 85.50,
       "date": "2024-01-15"
     }'
```

### Getting Financial Insights
```bash
curl "http://localhost:8000/api/v1/ai/insights?days=30"
```

### Chatting with AI Assistant
```bash
curl -X POST "http://localhost:8000/api/v1/ai/chat" \
     -H "Content-Type: application/json" \
     -d '{"message": "How can I reduce my food expenses?"}'
```

---

Built with ❤️ using FastAPI, React, and AI technologies. 
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