# Job Queue Handler

A scalable job import system that fetches jobs from multiple external XML APIs, queues them using Redis + BullMQ, imports them into MongoDB, and provides an admin UI for import history tracking.

## Features
- Fetch jobs from multiple XML APIs and convert to JSON
- Queue jobs using BullMQ and Redis
- Import jobs into MongoDB with upsert (new/updated)
- Track import history (total, new, updated, failed, reasons)
- Admin dashboard (Next.js) to view logs and trigger imports
- Scheduled imports every hour (cron)

## Tech Stack
- **Frontend:** Next.js (TypeScript)
- **Backend:** Node.js (Express)
- **Database:** MongoDB (Mongoose)
- **Queue:** BullMQ
- **Queue Store:** Redis

## Folder Structure
```
/client   # Next.js frontend
/server   # (reserved for backend, code is in root/src)
/src      # Backend source code
  /jobs
  /models
  /queue
  /routes
  /services
  /utils
/config   # Configuration files
```

## Setup & Installation

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB
- Redis

### Backend
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables in `.env` (see `config/default.js` for defaults):
   - `MONGO_URI`, `REDIS_HOST`, `REDIS_PORT`, etc.
3. Start the API server:
   ```bash
   node src/app.js
   ```
4. Start the BullMQ worker (in a separate terminal):
   ```bash
   node src/queue/worker.js
   ```

### Frontend
1. Go to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js dev server:
   ```bash
   npm run dev
   ```
4. Visit [http://localhost:3000](http://localhost:3000) and go to the Admin Dashboard.

## API Endpoints
- `POST /import` — Trigger a manual import
- `GET /import/logs` — Get import history logs

## Assumptions
- Job uniqueness is determined by `externalId` (from guid/id/link/title) and `source`.
- XML feeds may have different structures; normalization is basic and may need adjustment for new sources.
- The backend and frontend run on different ports (5000 and 3000 by default).

## Testing
- No automated tests included. Manual testing via the admin dashboard and API endpoints.

## Deployment
- Environment variables can be set for MongoDB, Redis, BullMQ concurrency, etc.
- Can be deployed to Docker, Render, Vercel, etc.

## License
MIT 

---

## **What to Do Next**

### 1. **Try Connecting Without a Password**

- In your `.env` or config, **do not set** a `REDIS_PASSWORD` variable.
- When creating your Redis connection in code, omit the password field:

```js
const redis = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  // password: process.env.REDIS_PASSWORD, // <-- leave this out
});
```

Or, if you use a connection string, just use:
```
redis://<host>:<port>
```

---

### 2. **Test the Connection**

You can test with the Redis CLI (no password):

```sh
redis-cli -h <your_redis_host> -p <your_redis_port> ping
```
You should see:
```
PONG
```

---

### 3. **(Optional) Enable Authentication**

If you want to add a password for security:
- Go to your Redis Cloud dashboard.
- Look for a **Users**, **Access Control**, or **Security** tab.
- Add a user or set a password for the default user.
- After setting a password, update your code/config accordingly.

---

**Summary:**  
If your Redis Cloud database does not require a password, just use the host and port in your config and you should be able to connect!

If you run into any connection errors, let me know the error message and I’ll help you troubleshoot. 

---

This error is caused by a **BullMQ requirement**:  
When using BullMQ with Redis Cloud (or any cloud Redis), you must set the Redis option `maxRetriesPerRequest` to `null` in your connection options.

---

## **How to Fix**

### 1. **Update Your Redis Connection Code**

Wherever you create your `IORedis` instance (in both `src/app.js` and `src/queue/worker.js`), update it like this:

```js
const redis = new IORedis({
  host: config.redis.host,
  port: config.redis.port,
  // password: config.redis.password, // if you add a password in the future
  maxRetriesPerRequest: null, // <-- ADD THIS LINE
});
```

This tells BullMQ to work correctly with Redis Cloud.

---

### 2. **Restart Your Worker**

After making this change, save the file and restart your worker:

```bash
node src/queue/worker.js
```

---

**If you have this connection code in multiple files (like `src/app.js` and `src/queue/worker.js`), update it in both places.**

---

Let me know if you need the exact code edit or if you see any other errors! 