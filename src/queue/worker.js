const { Worker } = require('bullmq');
const mongoose = require('mongoose');
const IORedis = require('ioredis');
const config = require('../../config/default');
const Job = require('../models/Job');
const ImportLog = require('../models/ImportLog');

const redis = new IORedis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  maxRetriesPerRequest: null, // Required for BullMQ with Redis Cloud
});

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const worker = new Worker(
  config.bullmq.queueName,
  async job => {
    const { jobs, source } = job.data;
    let newJobs = 0, updatedJobs = 0, failedJobs = [];
    for (const jobData of jobs) {
      try {
        const externalId = jobData.raw.guid || jobData.raw.id || jobData.raw.link || jobData.raw.url || jobData.raw.title;
        const update = {
          ...jobData.raw,
          externalId: String(externalId),
          source,
          raw: jobData.raw,
          updatedAt: new Date(),
        };
        const result = await Job.findOneAndUpdate(
          { externalId: update.externalId, source },
          update,
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        if (result.createdAt.getTime() === result.updatedAt.getTime()) {
          newJobs++;
        } else {
          updatedJobs++;
        }
      } catch (err) {
        failedJobs.push({ job: jobData, reason: err.message });
      }
    }
    await ImportLog.create({
      source,
      fileName: source,
      timestamp: new Date(),
      totalFetched: jobs.length,
      totalImported: newJobs + updatedJobs,
      newJobs,
      updatedJobs,
      failedJobs,
    });
    return { newJobs, updatedJobs, failedJobs: failedJobs.length };
  },
  { connection: redis, concurrency: config.bullmq.concurrency }
);

worker.on('completed', job => {
  console.log(`Job import completed: ${job.id}`);
});
worker.on('failed', (job, err) => {
  console.error(`Job import failed: ${job.id}`, err);
}); 