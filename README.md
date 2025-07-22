# Job Queue Handler

A scalable system for importing jobs from multiple external APIs, processing them via a queue, and tracking import history with a modern admin dashboard.

## Features
- Fetch jobs from multiple XML APIs and normalize to JSON
- Queue-based background processing with BullMQ and Redis
- Import jobs into MongoDB with upsert (new/updated)
- Import history tracking (total, new, updated, failed, reasons)
- Admin dashboard (Next.js) for monitoring and manual imports
- Scheduled imports via cron

## Tech Stack
- **Frontend:** Next.js (TypeScript)
- **Backend:** Node.js (Express)
- **Database:** MongoDB (Mongoose)
- **Queue:** BullMQ + Redis

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Redis (local, Memurai, or Redis Cloud)

### Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/JOB_QUEUE_HANDLER.git
   cd JOB_QUEUE_HANDLER
   ```
2. **Install backend dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and update values as needed (MongoDB, Redis, etc.)
4. **Start backend services:**
   - API server: `node src/app.js`
   - Worker: `node src/queue/worker.js`
5. **Start the frontend:**
   ```bash
   cd client
   npm install
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000)

## Usage
- Use the admin dashboard to view import logs and trigger manual imports.
- Imports run automatically every hour via cron.
- API endpoints:
  - `POST /import` — Trigger import
  - `GET /import/logs` — View import history

## Contribution
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
MIT 