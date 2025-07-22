# Proctor-System

A basic proctoring system to detect tab switches and multiple faces during online tests.

## Tech Stack
- Frontend: React + TypeScript
- Backend: Node.js (Express)
- Face Detection: Python (OpenCV/face_recognition)

## Features
- Detect tab switches and window focus loss
- Detect multiple faces via webcam
- Log and expose suspicious events via API
- User authentication with session tracking (JWT)
- Live dashboard with real-time updates (WebSocket)

## Setup Instructions

### Prerequisites
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed

### 1. Clone the repository
```sh
git clone https://github.com/Distroto/Proctor-System.git
cd Proctor-System
```

### 2. Build and start all services
```sh
docker-compose up --build
```
This will start:
- **Backend** (Node.js/Express) on port **4000**
- **Frontend** (React) on port **3000**
- **Face Detection** (Python/FastAPI) on port **8000**

### 3. Access the application
- Open [http://localhost:3000](http://localhost:3000) in your browser.
- Sign up or log in with a username and password.
- The main page shows the proctoring view (webcam, tab switch detection) and a live dashboard of suspicious events.

### 4. Usage
- **Tab switch/focus loss**: Switch tabs, minimize, or blur the window to trigger suspicious events.
- **Face detection**: Allow webcam access. If no face or multiple faces are detected, a suspicious event is logged.
- **Dashboard**: See all your suspicious events in real time (WebSocket-powered).
- **Logout**: Use the dashboard's logout button to end your session.

### 5. API Endpoints (for reference)
- `POST /auth/signup` — Register a new user
- `POST /auth/login` — Login and receive JWT
- `POST /events/tab-switch` — Log tab switch event (JWT required)
- `POST /events/face-detection` — Log face detection event (JWT required)
- `GET /events` — Get all events for the authenticated user
- `ws://localhost:4000/ws/events?token=...` — WebSocket for live event updates

## Postman API Documentation

You can view the full API documentation and try out the endpoints using the published Postman docs:
- **View the API documentation:** [Postman Public API Docs](https://documenter.getpostman.com/view/26948551/2sB34mhxzs)
