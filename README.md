# DevOps Launchpad — Full Stack App with Production DevOps Pipeline

A full-stack task management app built to practice real-world DevOps workflows end to end.

## Live Demo
🌐 [https://taskapp-hanny.ddns.net](https://taskapp-hanny.ddns.net)

## Architecture

```
                     ┌─────────────────────────────────────┐
                     │         GitHub Repository            │
                     │         (main branch)                │
                     └──────────────┬──────────────────────┘
                                    │ push
                                    ▼
                     ┌─────────────────────────────────────┐
                     │       GitHub Actions (CD)            │
                     │  1. SSH into VM                      │
                     │  2. git pull                         │
                     │  3. docker compose up --build        │
                     │  4. Health check /api/health         │
                     │  5. Rollback if failed               │
                     └──────────────┬──────────────────────┘
                                    │ SSH
                                    ▼
┌─────────────────────────────────────────────────────────────┐
│                        Azure VM                              │
│  ┌──────────┐    ┌──────────────────────────────────────┐  │
│  │  Nginx   │    │          Docker Network               │  │
│  │Port 80/43│    │  ┌──────────┐   ┌────────────────┐  │  │
│  │/ → :3000 │───▶│  │ Frontend │   │    Backend     │  │  │
│  │/api→:4000│    │  │  Nginx   │   │    Express     │  │  │
│  └──────────┘    │  │ Port 3000│   │    Port 4000   │  │  │
│                  │  └──────────┘   └───────┬────────┘  │  │
│                  │                 ┌────────┴────────┐  │  │
│                  │                 │   PostgreSQL    │  │  │
│                  │                 │   Port 5432     │  │  │
│                  │                 │ (Named Volume)  │  │  │
│                  │                 └─────────────────┘  │  │
│                  │                 ┌─────────────────┐  │  │
│                  │                 │     Redis       │  │  │
│                  │                 │   Port 6379     │  │  │
│                  │                 └─────────────────┘  │  │
│                  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Cache/Sessions | Redis |
| Containerization | Docker + Docker Compose |
| Reverse Proxy | Nginx |
| SSL | Let's Encrypt (Certbot) |
| Cloud | Microsoft Azure VM |
| CI/CD | GitHub Actions |

## Features
- JWT authentication with Redis session storage
- Full task CRUD (create, read, update, delete)
- Dockerized microservices architecture
- Automated deployments via GitHub Actions
- Health check + automatic rollback on failed deploys
- SSL/HTTPS via Let's Encrypt
- Persistent data via Docker named volumes

## Project Structure
```
task-app/
├── apps/
│   ├── backend/          # Express API
│   │   ├── src/
│   │   │   ├── routes/   # auth + tasks
│   │   │   ├── middleware/
│   │   │   └── index.js
│   │   └── Dockerfile
│   └── frontend/         # React + Vite
│       ├── src/
│       │   ├── pages/    # Login, Register, TaskBoard
│       │   └── api.js
│       └── Dockerfile
├── .github/
│   └── workflows/
│       └── deploy.yml    # CD pipeline
├── docker-compose.yml
└── README.md
```

## How to Run Locally

### Prerequisites
- Docker Desktop
- Node.js 20+

### Steps
```bash
# Clone the repo
git clone https://github.com/HayyanHaider/practicee2-20hrs-.git
cd practicee2-20hrs-

# Create .env file
echo "POSTGRES_PASSWORD=yourpassword
POSTGRES_DB=taskapp
JWT_SECRET=yoursecret" > .env

# Run all services
docker compose up --build

# Create database tables
docker exec -it practicee2-20hrs--postgres-1 psql -U postgres -d taskapp -c "
CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, created_at TIMESTAMP DEFAULT NOW());
CREATE TABLE IF NOT EXISTS tasks (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), title TEXT NOT NULL, status TEXT DEFAULT 'todo', created_at TIMESTAMP DEFAULT NOW());
"
```

Visit `http://localhost` 🚀

## CD Pipeline

Every push to `main` branch:
1. GitHub Actions SSHs into Azure VM
2. Pulls latest code
3. Rebuilds Docker containers
4. Runs health check on `/api/health`
5. Automatically rolls back if health check fails

## What I Learned
- Docker networking and container communication
- Multi-stage Docker builds for optimization
- Nginx as reverse proxy and static file server
- SSL certificate management with Certbot
- GitHub Actions for automated deployments
- Health checks and rollback strategies
- Volume persistence for stateful services
- Redis for JWT session management