require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('../config/default');
const importRouter = require('./routes/import');
const { startImportCron } = require('./utils/cron');
const { jobQueue, redis } = require('./queue/jobQueue');

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

redis.on('connect', () => {
  console.log('Redis connected');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// BullMQ Queue setup is now in queue/jobQueue.js

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

module.exports = { app, jobQueue, redis }; 