<div align="center">
  <br />
  <img src="https://img.icons8.com/fluency/96/console.png" alt="SQL Survival Logo" />
  <h1>🎮 SQL Survival: The Data Isles</h1>
  <h3>The only way off the island... is a query.</h3>

  <p>
    An interactive, story-driven adventure game designed to master SQL. <br />
    Stranded on a mysterious island, you must write code to survive, gather resources, and uncover the secrets of the ancients.
  </p>

  <p>
    <a href="https://sql-survival-game.vercel.app/">
      <img src="https://img.shields.io/badge/PLAY_NOW-Live_Demo-2ea44f?style=for-the-badge&logo=vercel" alt="Live Demo" />
    </a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" alt="FastAPI" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  </p>
</div>

---

## 📖 The Lore

> *"You wake up on the wet sand, the wreckage of your ship scattered along the shore. A glowing slate lies beside you, pulsing with strange symbols. To survive the Data Isles, you must learn to speak the language of the island—Structured Query Language. Every query brings you closer to the truth... or closer to danger."*

## 📸 Visual Tour

### 🚀 The Adventure Begins
A vibrant, animated entry point into the world of the Data Isles.
<img width="100%" alt="Landing Page" src="https://github.com/user-attachments/assets/2a590da4-f501-4a8c-8a1b-ff2d7e121df9" />

<br />

### 🗺️ The World Map
Navigate through unlocked territories. Track your journey from the safety of the Beach to the mysterious Ruins.
<img width="100%" alt="World Map" src="https://github.com/user-attachments/assets/5294d7e7-4a2a-4bc4-bbc9-454917da8d1c" />

<br />

### 💻 The SQL Slate (Mission Log)
The core gameplay loop. Receive briefings, write live queries, and get instant feedback from the island's database.
<img width="100%" alt="SQL Slate" src="https://github.com/user-attachments/assets/73ce828e-630b-4d05-8b3d-d249f290535e" />

---

## ✨ Key Features

### 🎮 Gameplay Mechanics
* **Progressive Difficulty:** Journey through 3 unique zones, scaling from novice to expert.
* **Persistent Saves:** Your game state, inventory, and unlocked levels are saved locally.
* **Instant Feedback:** The `SQL.js` engine provides immediate validation of your syntax and logic.
* **Gamified Rewards:** Unlock animated completion screens and badges as you conquer zones.

### 📊 Player Statistics
* **Performance Tracking:** Monitor your global query success rate.
* **Mission History:** Review past solutions and optimize your code.

### 🎨 Modern Experience
* **Responsive UI:** Built with **Radix UI** and **Tailwind CSS** for a polished look on any device.
* **Immersive Audio:** (Optional) Ambient soundscapes matching the zone environment.

---

## 🗺️ Game Zones & Curriculum

| Zone | Environment | Levels | SQL Concepts Mastered |
| :--- | :--- | :---: | :--- |
| **Zone 1** | 🏖️ **The Beach** | 15 | `SELECT`, `WHERE`, `ORDER BY`, `LIMIT` |
| **Zone 2** | 🌿 **The Jungle** | 20 | `INNER JOIN`, `LEFT JOIN`, `GROUP BY`, `HAVING`, Aggregates |
| **Zone 3** | 🏛️ **The Ruins** | 15 | Subqueries, Window Functions (`RANK`, `OVER`), CTEs |

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** React 19
* **Routing:** React Router DOM
* **Styling:** Tailwind CSS + Radix UI Primitives
* **Logic:** SQL.js (Client-side WASM SQL engine)

### Backend
* **API:** FastAPI (Python)
* **Server:** Uvicorn (ASGI)
* **Database:** MongoDB (Player analytics & global leaderboards)
* **Validation:** Pydantic models

---

## ⚙️ Installation & Setup

Follow these steps to run the game locally.

### Prerequisites
* Node.js (v16+)
* Python 3.8+
* MongoDB Instance (Local or Atlas)

### 1. Clone the Project
```bash
git clone <your-repo-url>
cd survivor4-emerg/project

### 2. Backend Configuration
```bash
cd backend

# Create & Activate Virtual Environment
python -m venv venv
# Windows:
venv\Scripts\activate

# Mac/Linux:
source venv/bin/activate

# Install Dependencies
pip install -r requirements.txt

# Setup Environment Variables
# Create a .env file based on env_backend.txt
cp env_backend.txt .env

# Run Server
uvicorn server:app --reload --host 0.0.0.0 --port 8000

### 3. Frontend Configuration
```bash

cd frontend

# Install Dependencies
npm install

# Setup Environment Variables
# Create a .env file based on env_frontend.txt
cp env_frontend.txt .env

# Run Client
npm start

### 4. 🔐Environment Variables
```bash
Ensure your .env files are populated correctly:

Backend (backend/.env)

MONGODB_URL=mongodb://localhost:27017/sql_survival
SECRET_KEY=your_secret_key_here
Frontend (frontend/.env

REACT_APP_API_URL=http://localhost:8000

### 5.🧪 Testing
```bash

# Backend Tests (Pytest)
cd backend && python -m pytest

# Frontend Tests (Jest)
cd frontend && npm test
