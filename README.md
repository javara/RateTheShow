# RateTheShow 📺⭐

[![React](https://img.shields.io/badge/React-18.2.0-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776ab?logo=python&logoColor=white)](https://python.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ed?logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**RateTheShow** is a modern, cloud-native web application for discovering, reviewing, and tracking TV shows. It integrates automated poster retrieval, official trailer search, streaming provider availability, and a community-driven rating engine.

---

## 🌟 Key Features

- **TV Show Catalog & Discovery:** Browse shows by genre (*Drama*, *Comedy*, *Sci-Fi*, *Crime*) with instant search.
- **Automated Artwork & Media:** Real-time poster integration via OMDb API, one-click YouTube trailer searches, and JustWatch streaming lookup.
- **Scoring & Review Engine:** Dynamic aggregate ratings (1-10 scale) updated in real-time as users submit reviews.
- **User Authentication & Bookmarks:** Secure credential hashing (bcrypt) and local client-side favorites management.
- **Platform Analytics:** Live stats dashboard calculating total shows, average scores, and per-genre metrics.
- **Responsive Modern UI:** Glassmorphism navigation, dark theme aesthetic, and mobile-friendly responsive layout.

---

## 🛠️ Architecture & Tech Stack

```
+-------------------------------------------------------------+
|                      React 18 Frontend                      |
|           (Axios, React Router, Vanilla CSS System)          |
+------------------------------+------------------------------+
                               | REST API Calls (JSON)
+------------------------------v------------------------------+
|                     FastAPI Backend                         |
|           (Pydantic validation, SQLAlchemy ORM)             |
+---------------+-----------------------------+---------------+
                |                             |
+---------------v---------------+   +---------v---------------+
|      PostgreSQL Database      |   |  External APIs (OMDb,   |
|   (Shows, Reviews, Users)     |   |    YouTube, JustWatch)  |
+-------------------------------+   +-------------------------+
```

### Components:
- **Frontend:** React 18 with custom modern CSS design tokens, smooth animations, and glassmorphism.
- **Backend:** FastAPI with modular routers, Pydantic data validation, and SQLAlchemy ORM.
- **Database:** PostgreSQL for relational data integrity (cascade deletes on show reviews).
- **Containerization:** Multi-container orchestration using Docker Compose.

---

## 🚀 Quick Start (Docker)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/RateTheShow.git
cd RateTheShow
```

### 2. Configure Environment Variables
Copy or adjust `.env` in the root directory:
```bash
cp .env.example .env
```

### 3. Start the Stack
For production
```bash
docker compose -f ./docker-compose.prod.yml up --build
```
For local development
```bash
docker compose up --build
```

### 4. Access the App

For production
- **Web Application:** [http://<public-ip-address>:28080](http://<public-ip-address>:28080)
- **Interactive API Docs (Swagger):** [http://<public-ip-address>:28001/docs](http://<public-ip-address>:28001/docs)

For local development
- **Web Application:** [http://localhost:28080](http://localhost:28080)
- **Interactive API Docs (Swagger):** [http://localhost:28001/docs](http://localhost:28001/docs)

---

## 🧪 Database Seeding & Testing

To populate the catalog with over 20 acclaimed TV shows:
```bash
docker exec -it ratetheshow_backend python seed_shows.py
```

To run automated backend tests:
```bash
docker exec -it ratetheshow_backend pytest -v
```

---

## 📡 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/shows` | List all shows (optional `?genre=drama` filter) |
| `GET` | `/shows/search/?title=...` | Substring search by show title |
| `GET` | `/shows/{id}` | Get single show details |
| `POST` | `/shows` | Create a new TV show |
| `DELETE` | `/shows/{id}` | Delete a TV show |
| `POST` | `/shows/{id}/rate` | Submit rating (1-10) and optional comment |
| `GET` | `/shows/{id}/reviews` | Retrieve verified reviews for a show |
| `GET` | `/stats` | Platform metrics, genre breakdown & top shows |
| `POST` | `/register` | Create a new user account |
| `POST` | `/login` | Authenticate user credentials |

---

## 👤 Author

Developed by **Gemini**  

Original Idea by Marcel.Dean

Original Developer Team:

- 	Marcel 	as Frontend Developer – UI design, React components, API integration
-	Javier 	as Backend Developer – REST API, Database model, Sample data
-  	Baris 	as Cloud Engineer – Docker setup, AWS ECR/EC2/RDS deployment