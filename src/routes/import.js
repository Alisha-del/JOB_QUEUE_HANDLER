const express = require('express');
const ImportLog = require('../models/ImportLog');
const { importJobs } = require('../services/importService');

const router = express.Router();

// POST /import - trigger import
router.post('/', async (req, res) => {
  try {
    const result = await importJobs();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /import/logs - get import logs
router.get('/logs', async (req, res) => {
  try {
    const logs = await ImportLog.find().sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 