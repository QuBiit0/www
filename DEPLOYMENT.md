# Dokploy / Production Deployment Guide

## 1. Local Development (Hot Reloading)
To develop locally with live changes (Frontend & Backend):

```bash
# Start Dev Server
docker-compose -f docker-compose.dev.yml up --build
```
- Frontend: http://localhost:3000
- Backend: http://localhost:8000/docs
- Database: localhost:5432

## 2. Production Deployment (Dokploy)
This project is configured for **Zero-Config Dokploy Deployment**.

### Steps:
1. Login to your Dokploy Dashboard.
2. Go to **Application** -> **Create Application**.
3. Choose **Docker Compose**.
4. Select your Repository & Branch (`main`).
5. **Build Path**: `/` (Root directory).
6. **Docker Compose File**: `docker-compose-prod.yml` (Ensure you specify this in Dokploy settings if needed, or rename to default).
   *Note: If Dokploy expects `docker-compose.yml`, you may need to specify the file path in the application settings.*

That's it! Dokploy will use `docker-compose-prod.yml` which is optimized for production (Nginx serving React).

### Environment Variables (Production)
Set these in Dokploy's "Environment" tab:
- `OPENAI_API_KEY` (Required for AI Agent)
- `DATABASE_URL` (If using external DB, otherwise internal one is used)
