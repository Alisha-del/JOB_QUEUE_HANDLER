const cron = require('node-cron');
const { importJobs } = require('../services/importService');

function startImportCron() {
  cron.schedule('0 * * * *', async () => {
    console.log('Running scheduled job import...');
    await importJobs();
  });
}

module.exports = { startImportCron }; 