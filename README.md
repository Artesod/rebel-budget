# Rebel Budget 🎭💰

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
rebel-budget/
├── backend/
│   ├── app/
│   │   ├── models/          # Database models
│   │   ├── routers/         # API endpoints
│   │   ├── services/        # Business logic & AI services
│   │   └── main.py         # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   ├── setup_admin.py      # Admin user creation script
│   └── env.example         # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API client
│   │   └── types/          # TypeScript types
│   ├── package.json        # Node dependencies
│   └── tailwind.config.js  # Styling configuration
├── Dockerfile              # Multi-stage Docker build
├── docker-compose.yml      # Docker Compose configuration
└── README.md
```

## 🛠️ Setup & Installation

### 🐳 Docker Deployment (Recommended)

The easiest way to run Rebel Budget is using Docker, which bundles both frontend and backend into a single container.

#### Prerequisites
- Docker and Docker Compose installed
- Git (to clone the repository)

#### Quick Start
```bash
# Clone the repository
git clone <your-repo-url>
cd rebel-budget

# Build and start the application
docker compose up --build

# The application will be available at http://localhost:8000
```

#### Create Admin Account
After the container is running, create your first admin account:
```bash
# Run the admin setup script inside the container
docker compose exec app python setup_admin.py

# Follow the prompts to create your admin account
```

#### Docker Commands
```bash
# Start the application
docker compose up

# Start in background
docker compose up -d

# Stop the application
docker compose down

# Rebuild after code changes
docker compose up --build

# View logs
docker compose logs -f app

# Clean rebuild (if having issues)
docker compose down
docker system prune -f
docker compose up --build --no-cache
```

#### Environment Variables for Docker
Create a `.env` file in the project root for production settings:
```bash
# Optional: OpenAI API key for AI features
OPENAI_API_KEY=your_openai_api_key_here

# CORS origins (comma-separated)
CORS_ORIGINS=http://localhost:8000,https://yourdomain.com

# Database URL (uses SQLite by default)
DATABASE_URL=sqlite:///./finance_ai.db
```

### 🔧 Local Development Setup

For development with hot reload and debugging:

#### Backend Setup

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

5. **Create admin account**:
   ```bash
   python setup_admin.py
   ```

6. **Run the application**:
   ```bash
   uvicorn main:app --reload
   ```

The API will be available at: `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- Alternative docs: `http://localhost:8000/redoc`

#### Frontend Setup

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

## 🚀 Production Deployment

### Docker Production Setup

1. **Clone and configure**:
   ```bash
   git clone <your-repo-url>
   cd rebel-budget
   
   # Create production environment file
   cp backend/env.example .env
   # Edit .env with your production settings
   ```

2. **Deploy**:
   ```bash
   docker compose up -d --build
   ```

3. **Create admin account**:
   ```bash
   docker compose exec app python setup_admin.py
   ```

4. **Verify deployment**:
   ```bash
   curl http://localhost:8000/api/health
   # Should return: {"status":"healthy","message":"Rebel Budget API is running!"}
   ```

### Database Management

#### Docker Database
- **Location**: Inside container at `/app/finance_ai.db`
- **Persistence**: Data persists between container restarts
- **Backup**: Use `docker cp` to copy database file out of container

```bash
# Backup database
docker compose exec app cp finance_ai.db finance_ai_backup.db
docker cp $(docker compose ps -q app):/app/finance_ai_backup.db ./backup.db

# Restore database
docker cp ./backup.db $(docker compose ps -q app):/app/finance_ai.db
docker compose restart app
```

#### Local vs Docker Databases
- **Local development**: Uses `backend/finance_ai.db`
- **Docker container**: Uses separate database inside container
- **No data sharing**: Local and Docker databases are completely separate

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout

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

### Admin
- `GET /api/v1/admin/users` - List all users (admin only)
- `POST /api/v1/admin/users/{user_id}/toggle-admin` - Toggle admin status

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
- [ ] Enhanced mobile responsiveness
- [ ] Add expense receipt scanning
- [ ] Implement expense categories customization
- [ ] Add financial goal tracking
- [ ] Multi-user support with role-based access
- [ ] Advanced mascot AI integration

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