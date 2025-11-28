<div align="center">
  <br />
  <img src="https://img.icons8.com/fluency/96/console.png" alt="SQL Survival Logo" />
  <h1>🎮 SQL Survival: The Data Isles</h1>
  <h3>The only way off the island... is a query.</h3>

  <p>
    An interactive, story-driven adventure designed to help players master SQL in a fun and immersive way.<br/>
    Stranded on the mysterious <b>Data Isles</b>, you must write queries to survive, gather resources, and uncover the secrets of the ancients.
  </p>

  <p>
    <a href="https://sql-survival-game.vercel.app/">
      <img src="https://img.shields.io/badge/PLAY_NOW-Live_Demo-2ea44f?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
    </a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  </p>
</div>

---

## 📖 The Lore

> *"You awaken on the wet sands of the Data Isles — a forgotten land ruled by logic and syntax.  
> The only tool you possess is an ancient slate glowing with code.  
> To survive, you must master SQL, uncover the truth of the island, and query your way to freedom."*

---

##  Highlights

- 🧠 **Interactive SQL Practice Engine:** Real-time query editor with data visualization and live syntax feedback.  
- 🎨 **Modern UI:** Sleek dark interface with Tailwind, animations, and responsive layout.  
- ⚡ **Instant Query Validation:** Query results rendered dynamically via SQL.js.  
- 🗺️ **World Map:** Unlock new islands and progressive learning zones.  
- 🧾 **Lessons & Quests:** Over 50 guided missions with tiered difficulty.  
- 💾 **Auto Progress Save:** Player progress stored locally with resume capability.  
- 🧩 **Query Execution Order Visualization:** Interactive guide showing how SQL queries are executed step-by-step.
---

## 📸 Visual Tour

### 🚀 The Adventure Begins
A beautifully animated landing experience introducing the Data Isles world.  
<img width="100%" alt="Landing Page" src="https://github.com/user-attachments/assets/2a590da4-f501-4a8c-8a1b-ff2d7e121df9" />

<br />


### 🧩 Interactive SQL Practice Interface
A dynamic environment where players execute live SQL queries and view real-time results.  
<img width="1839" height="890" alt="Screenshot 2025-11-28 122423" src="https://github.com/user-attachments/assets/348395d0-6e13-4eb4-abb2-fbfeff9cd63b" />

<br />


### 🗺️ The World Map
Visual progression system showing player advancement across different regions.  
<img width="100%" alt="World Map" src="https://github.com/user-attachments/assets/5294d7e7-4a2a-4bc4-bbc9-454917da8d1c" />

<br />

### 💻 The SQL Slate (Mission Log)
The gameplay core — receive tasks, execute SQL commands, and view interactive outputs.  
<img width="100%" alt="SQL Slate" src="https://github.com/user-attachments/assets/73ce828e-630b-4d05-8b3d-d249f290535e" />

---

## ✨ Key Features

### 🎮 Gameplay
- 🏝️ **3 Story Zones:** Progress from *The Beach* to *The Jungle* and finally *The Ruins*.  
- 🧩 **Challenge Missions:** Unlockable tasks with increasing complexity.  
- 💬 **Real-Time Feedback:** Instant query validation and error suggestions.  
- 🎓 **Gamified Learning:** Earn badges, progress levels, and leaderboard ranks.  

### 📊 Analytics & Tracking
- 📈 View global accuracy, query performance, and personal progression metrics.  
- 🕒 Track lesson completion times and learning milestones.  

### 🎨 Design & Aesthetics
- Dark glassmorphism UI with smooth transitions.  
- Built using **Framer Motion** for immersive animations.  
- Fully responsive layout optimized for mobile and desktop.

---

## 🗺️ Curriculum Overview

| Zone | Environment | Levels | Concepts Mastered |
|------|--------------|--------|-------------------|
| 🏖️ **The Beach** | Beginner Zone | 15 | `SELECT`, `WHERE`, `ORDER BY`, `LIMIT` |
| 🌿 **The Jungle** | Intermediate Zone | 20 | `JOIN`, `GROUP BY`, `HAVING`, Aggregates |
| 🏛️ **The Ruins** | Advanced Zone | 15 | Subqueries, CTEs, Window Functions |

---

## 🛠️ Tech Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | React 19, Tailwind CSS, Radix UI, SQL.js, Zustand |
| **Backend** | FastAPI (Python), Uvicorn |
| **Database** | MongoDB (Local/Atlas) |
| **Styling & Animation** | Tailwind CSS, Framer Motion |
| **Testing** | Jest, Pytest |
| **Deployment** | Vercel (Frontend) & Render/Heroku (Backend) |

---

## ⚙️ Installation & Setup

### Prerequisites
Ensure you have:
- **Node.js** ≥ 16.x  
- **Python** ≥ 3.8  
- **MongoDB** (Local or Cloud Instance)

### Steps
```bash
# Clone the repository
git clone <your-repo-url>
cd sql-survival
```
### Frontend Setup
```bash
cd ../frontend
npm install
cp env_frontend.txt .env
npm start
Environment Variables
```
### Backend Setup
```bash
cd backend
python -m venv venv
```
### Windows
```bash

venv\Scripts\activate

### macOS/Linux
source venv/bin/activate
pip install -r requirements.txt
cp env_backend.txt .env
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```


### Backend (.env)
```bash
MONGODB_URL=mongodb://localhost:27017/sql_survival
SECRET_KEY=your_secret_key_here
```
### Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:8000
```
### 🧪 Testing
```bash

# Backend tests
cd backend && pytest

# Frontend tests
cd frontend && npm test
```

