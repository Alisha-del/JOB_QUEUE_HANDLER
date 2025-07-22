const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  externalId: { type: String, required: true, index: true }, // Unique ID from source
  title: String,
  company: String,
  location: String,
  description: String,
  url: String,
  source: String, // API URL
  raw: Object, // Store raw job data
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

JobSchema.index({ externalId: 1, source: 1 }, { unique: true });

module.exports = mongoose.model('Job', JobSchema); 