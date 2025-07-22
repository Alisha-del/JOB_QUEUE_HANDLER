const { Queue } = require('bullmq');
const IORedis = require('ioredis');
const config = require('../../config/default');

const redis = new IORedis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  maxRetriesPerRequest: null,
});

const jobQueue = new Queue(config.bullmq.queueName, {
  connection: redis,
});

module.exports = { jobQueue, redis }; 