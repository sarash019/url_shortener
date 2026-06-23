<div align="center">

# ⚡ SmartURL
### High-Performance Link Management System

*Transform long, complex URLs into shortened, manageable links — built for speed, designed for scale.*

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)

</div>

---

## 📌 Overview

**SmartURL** is a production-grade, full-stack link shortening application engineered for high-concurrency environments. It uses a **hybrid database-caching architecture** — persisting data in PostgreSQL while serving redirects from Redis — to deliver sub-millisecond response times under real-world load.

The project covers the full development lifecycle: from system design and local containerization to cloud deployment and performance tuning.

---

## 🚀 Live Demo

> Deployed on Railway — [Add your live URL here]

---

## ✨ Features

| Feature | Description |
|---|---|
| **Dual-Storage Strategy** | Links are written to PostgreSQL for durability and cached in Redis for speed (Write-Through pattern) |
| **Idempotent API** | Recognizes duplicate shortening requests and returns the existing link instead of throwing a collision error |
| **Smart Slug Sanitization** | Automatically strips spaces, special characters, and normalizes casing for URL-safe slugs |
| **Base62 Encoding** | Custom algorithm generates unique, compact 6-character short codes when no custom alias is provided |
| **Cyber-Glass UI** | Dark-themed interface with a real-time Matrix Rain canvas background and glassmorphism card effects |

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** [Fastify](https://fastify.dev/) — chosen for its low overhead and industry-leading throughput benchmarks over Express

### Databases
- **Primary Store:** PostgreSQL — relational storage for permanent link mappings
- **Cache Layer:** Redis — in-memory store for sub-millisecond redirect lookups

### Frontend
- HTML5, CSS3 (Glassmorphism design), Vanilla JavaScript
- Real-time Matrix Rain canvas animation

### DevOps & Infrastructure
- **Docker & Docker Compose** — containerized local development, mirroring production
- **Railway.app** — automated cloud hosting, environment variable management, and CI/CD
- **GitHub** — version control and continuous deployment pipeline

---

## 🏗️ Architecture

```
Client Request
      │
      ▼
  [ Fastify Server ]
      │
      ├──► Redis Cache ──► HIT: return redirect instantly
      │
      └──► PostgreSQL ──► MISS: fetch, populate cache, return redirect
```

**Write Path (link creation):**
1. Sanitize and validate the custom slug or generate a Base62 code
2. Persist to PostgreSQL (source of truth)
3. Write to Redis cache simultaneously (Write-Through)
4. Return the short URL to the client

**Read Path (redirect):**
1. Check Redis first — cache hit serves the redirect with near-zero latency
2. On cache miss, query PostgreSQL and repopulate the cache
3. Issue HTTP 301/302 redirect to the original URL

---

## 📂 Project Structure

```
smarturl/
├── src/
│   ├── controllers/       # Route handler logic
│   ├── routes/            # Fastify route definitions
│   ├── utils/
│   │   └── base62.js      # Custom ID generation algorithm
│   └── server.js          # Entry point
├── public/                # Static frontend assets
│   ├── index.html
│   ├── style.css
│   └── matrix.js          # Canvas animation
├── docker-compose.yml     # Local dev environment
├── Dockerfile
├── .env.example
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Docker](https://www.docker.com/) & Docker Compose

### Local Development

**1. Clone the repository**
```bash
git clone https://github.com/your-username/smarturl.git
cd smarturl
```

**2. Set up environment variables**
```bash
cp .env.example .env
# Fill in your values
```

**3. Spin up the database containers**
```bash
docker-compose up -d
```

**4. Install dependencies and start the server**
```bash
npm install
npm run dev
```

The app will be running at `http://localhost:3000`.

---

## 🌍 Environment Variables

```env
# Server
PORT=3000

# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/smarturl

# Redis
REDIS_URL=redis://localhost:6379
```

---

## 📈 Development Phases

### Phase 1 — Architecture & Containerization
Set up Docker Compose to run local PostgreSQL and Redis instances, ensuring development and production environments are identical.

### Phase 2 — Backend & Database Schema
Designed the relational schema in PostgreSQL, integrated it with the Fastify server, and implemented the Base62 encoding utility for unique ID generation.

### Phase 3 — Performance Optimization (Redis)
Introduced a Write-Through caching strategy so every redirect request is served from memory first, eliminating the database as a bottleneck.

### Phase 4 — Error Handling & UX
Refined controller logic to handle edge cases: custom slug collisions (resolved via idempotency), invalid inputs (resolved via sanitization), and internal module errors.

### Phase 5 — Cloud Deployment & CI/CD
Connected the GitHub repository to Railway, configured production environment variables, and established a continuous deployment pipeline on every push to `main`.

---

## 🔮 Roadmap

- [ ] Analytics dashboard (click counts, referrer tracking)
- [ ] User authentication and link ownership
- [ ] Link expiration and TTL support
- [ ] QR code generation per short link
- [ ] Rate limiting per IP

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  Built with ⚡ by <a href="https://github.com/your-username">your-username</a>
</div>
