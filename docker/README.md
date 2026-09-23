# Docker Infrastructure - RateTheShow

This directory contains container definitions and deployment configurations for **RateTheShow**.

## Prerequisites
- [Docker](https://www.docker.com/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/) (v2.0+)

## Running the Application Locally
To launch the full stack (FastAPI Backend, React Frontend, PostgreSQL, MongoDB, MinIO):

```bash
docker compose up --build
```

- **Frontend Application:** http://localhost:28080
- **FastAPI Documentation (Swagger UI):** http://localhost:28001/docs
- **PostgreSQL Database:** localhost:5432
- **MinIO Console:** http://localhost:9001

## Stopping Services
```bash
docker compose down
```

To stop and remove data volumes:
```bash
docker compose down -v
```

## Structure
```
docker/
├── Dockerfile.backend      # Python 3.11 Slim container for FastAPI
├── Dockerfile.frontend     # Multi-stage Node/Nginx container for React
├── nginx.conf              # Production Nginx reverse proxy configuration
└── README.md               # Infrastructure documentation
```
