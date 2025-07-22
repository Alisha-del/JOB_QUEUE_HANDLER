require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Queue } = require('bullmq');
const IORedis = require('ioredis');
const config = require('../config/default');
const importRouter = require('./routes/import');
const { startImportCron } = require('./utils/cron');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Redis connection
const redis = new IORedis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  maxRetriesPerRequest: null, // Required for BullMQ with Redis Cloud
});

redis.on('connect', () => {
  console.log('Redis connected');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// BullMQ Queue setup
const jobQueue = new Queue(config.bullmq.queueName, {
  connection: redis,
});

// Example route
app.get('/', (req, res) => {
  res.send('Job Importer API is running');
});

app.use('/import', importRouter);

// TODO: Add routes for job import, logs, etc.

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

startImportCron();

module.exports = { app, jobQueue, redis }; 