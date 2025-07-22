const { jobQueue } = require('../app');
const { fetchAllJobs } = require('../jobs/fetchJobs');
const config = require('../../config/default');

async function importJobs() {
  const allJobs = await fetchAllJobs();
  for (const { source, jobs } of allJobs) {
    // Batch jobs for queueing
    for (let i = 0; i < jobs.length; i += config.bullmq.batchSize) {
      const batch = jobs.slice(i, i + config.bullmq.batchSize);
      await jobQueue.add('import', { jobs: batch, source });
    }
  }
  return { status: 'queued', sources: allJobs.map(j => j.source) };
}

module.exports = { importJobs }; 