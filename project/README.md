# SQL Survival Game

An interactive SQL learning game where players solve database challenges across different themed zones (Beach, Jungle, Ancient Ruins).

## Features

- 🏖️ **Beach Zone**: 15 levels of SQL challenges
- 🌿 **Jungle Zone**: 20 levels of intermediate SQL challenges  
- 🏛️ **Ruins Zone**: 15 levels of advanced SQL challenges
- 💾 **Progress Saving**: Local storage with comprehensive game state
- 🎨 **Zone Completion**: Animated completion pages with statistics
- 📊 **Statistics Tracking**: Score, success rate, and progress tracking
- 🎮 **Interactive UI**: Modern React interface with Tailwind CSS

## Tech Stack

### Frontend
- React 19
- Tailwind CSS
- Radix UI Components
- React Router DOM
- SQL.js (client-side SQL engine)

### Backend
- FastAPI (Python)
- MongoDB
- Uvicorn (ASGI server)
- Pydantic (data validation)

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- MongoDB (local or cloud)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd survivor4-emerg/project
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy from env_backend.txt)
copy env_backend.txt .env
# or on macOS/Linux:
cp env_backend.txt .env

# Edit .env file with your MongoDB connection string
# Start the backend server
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env file (copy from env_frontend.txt)
copy env_frontend.txt .env
# or on macOS/Linux:
cp env_frontend.txt .env

# Start the development server
npm start
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Environment Variables

### Backend (.env)
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=survivor4_emerg
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
DEBUG=True
PORT=8000
HOST=0.0.0.0
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_API_BASE_URL=http://localhost:8000/api
NODE_ENV=development
```

## Game Structure

### Zones
1. **Beach Zone** (15 levels)
   - Basic SELECT queries
   - WHERE clauses
   - ORDER BY sorting

2. **Jungle Zone** (20 levels)
   - JOIN operations
   - GROUP BY aggregations
   - HAVING clauses

3. **Ruins Zone** (15 levels)
   - Complex subqueries
   - Window functions
   - Advanced SQL features

### Progress System
- **Local Storage**: All progress saved locally
- **Statistics**: Score, success rate, levels completed
- **Zone Unlocking**: Complete zones to unlock next areas
- **Completion Pages**: Animated celebration screens

## Development

### Running Tests
```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests
cd frontend
npm test
```

### Building for Production
```bash
# Frontend build
cd frontend
npm run build

# Backend (no build step needed)
cd backend
uvicorn server:app --host 0.0.0.0 --port 8000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the GitHub repository.