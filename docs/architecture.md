# Architecture Overview

## System Components

- **Job Fetcher**: Fetches jobs from multiple XML APIs, parses XML to JSON, and normalizes job data.
- **Queue (BullMQ + Redis)**: Handles background job processing with concurrency and batching.
- **Worker**: Processes job batches, upserts into MongoDB, and logs import results.
- **Import Log**: Tracks each import run (total, new, updated, failed, reasons) in MongoDB.
- **API (Express)**: Exposes endpoints to trigger imports and fetch logs.
- **Cron Scheduler**: Triggers imports every hour automatically.
- **Admin UI (Next.js)**: Allows viewing import history and triggering imports manually.

## Data Flow Diagram

```mermaid
graph TD
    A[External XML APIs] -->|Fetch & Parse| B(Job Fetcher)
    B -->|Batch| C[Queue (BullMQ)]
    C -->|Process| D[Worker]
    D -->|Upsert| E[MongoDB: Jobs]
    D -->|Log| F[MongoDB: ImportLog]
    F -->|Read| G[Admin UI]
    G -->|Trigger Import| API[Express API]
    API -->|Enqueue| C
    Cron[Scheduler] -->|Hourly| API
```

## Key Design Decisions
- **Separation of Concerns**: Fetching, queueing, processing, and logging are modularized.
- **Scalability**: BullMQ allows horizontal scaling of workers; MongoDB and Redis can be cloud-hosted.
- **Extensibility**: New job sources can be added in config; normalization logic is isolated.
- **Resilience**: Failed jobs are logged with reasons; retry logic can be added in BullMQ config.
- **Observability**: Import logs are queryable via API and UI.

## Module Overview
- `/src/jobs/fetchJobs.js`: Fetches and parses jobs from all sources.
- `/src/queue/worker.js`: BullMQ worker for processing job batches.
- `/src/services/importService.js`: Orchestrates fetching and queueing jobs.
- `/src/routes/import.js`: API endpoints for import and logs.
- `/src/utils/cron.js`: Schedules hourly imports.
- `/client/src/app/admin/page.tsx`: Admin dashboard UI.

## Extending the System
- Add new job sources in `config/default.js`.
- Add more fields to the Job model as needed.
- Integrate real-time updates (Socket.IO/SSE) for live import status.
- Add authentication to the admin dashboard for security.

## Diagram Links
- [Edit this diagram on Excalidraw](https://excalidraw.com/)
- [Edit this diagram on draw.io](https://app.diagrams.net/) 