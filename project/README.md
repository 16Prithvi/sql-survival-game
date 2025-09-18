🎮 SQL Survival Game
An interactive, story-driven game designed to make learning SQL an exciting adventure. Players find themselves stranded on a mysterious island and must use their SQL skills to query their way through challenges, gather resources, and uncover the secrets to their escape.

✨ Live Demo ✨
Check out the deployed application on Vercel:

https://sql-survival-game.vercel.app/

📸 Project Showcase:

Here's a glimpse into the world of "SQL Survival: The Data Isles."

🚀 Engaging Landing Page
A vibrant and animated landing page introduces players to the story of the Data Isles and invites them to begin their survival adventure.

<img width="1833" height="849" alt="image" src="https://github.com/user-attachments/assets/2a590da4-f501-4a8c-8a1b-ff2d7e121df9" />

🗺️ Interactive World Map
Players navigate a stylized, interactive map to track their progress through the different zones. Completed areas are unlocked, visually guiding the journey from The Beach to The Ruins.

<img width="1734" height="871" alt="image" src="https://github.com/user-attachments/assets/5294d7e7-4a2a-4bc4-bbc9-454917da8d1c" />

💻 SQL Slate & Mission Log
The core gameplay interface where players receive their mission briefing and write SQL queries in a live editor. The system provides instant feedback and results, creating an immersive learning loop.
<img width="1451" height="881" alt="image" src="https://github.com/user-attachments/assets/73ce828e-630b-4d05-8b3d-d249f290535e" />


Features
🏝️ Themed, Progressive Zones: Journey through three unique zones, each with its own set of challenges that build on the last.

🏖️ Beach Zone: Learn SQL basics through 15 engaging challenges focused on SELECT, WHERE, and ORDER BY.

🌿 Jungle Zone: Master intermediate concepts across 20 levels covering JOIN operations, GROUP BY, and HAVING.

🏛️ Ruins Zone: Tackle 15 advanced puzzles involving complex subqueries and window functions.

💾 Comprehensive Progress Saving: Your entire game state, including completed levels and scores, is saved in local storage so you can pick up where you left off.

🎨 Animated Zone Completion: Celebrate your progress with animated completion pages that display your statistics for each zone.

📊 Detailed Statistics Tracking: Monitor your performance with trackers for your overall score, query success rate, and level progress.

🎮 Interactive UI: A modern, responsive interface built with React and Tailwind CSS for a seamless gameplay experience.
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
```

```

### Frontend (.env)
```env

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
