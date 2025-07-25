const mongoose = require('mongoose');

const ImportLogSchema = new mongoose.Schema({
  source: { type: String, required: true }, // API URL
  fileName: { type: String }, // Alias for source
  timestamp: { type: Date, default: Date.now },
  totalFetched: { type: Number, default: 0 },
  totalImported: { type: Number, default: 0 },
  newJobs: { type: Number, default: 0 },
  updatedJobs: { type: Number, default: 0 },
  failedJobs: [
    {
      job: Object,
      reason: String,
    },
  ],
});

module.exports = mongoose.model('ImportLog', ImportLogSchema); 