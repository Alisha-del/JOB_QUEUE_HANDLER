module.exports = {
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/job_importer',
  redis: {
    host: process.env.REDIS_HOST || 'redis-16158.crce182.ap-south-1-1.ec2.redns.redis-cloud.com',
    port: process.env.REDIS_PORT || 16158,
    password: process.env.REDIS_PASSWORD || '691mYr0iPVQnHktWsXUP4gsuj3KL44mg',
  },
  bullmq: {
    queueName: process.env.BULLMQ_QUEUE_NAME || 'job_import_queue',
    concurrency: parseInt(process.env.BULLMQ_CONCURRENCY, 10) || 5,
    batchSize: parseInt(process.env.BULLMQ_BATCH_SIZE, 10) || 50,
  },
  importSources: [
    'https://jobicy.com/?feed=job_feed',
    'https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time',
    'https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france',
    'https://jobicy.com/?feed=job_feed&job_categories=design-multimedia',
    'https://jobicy.com/?feed=job_feed&job_categories=data-science',
    'https://jobicy.com/?feed=job_feed&job_categories=copywriting',
    'https://jobicy.com/?feed=job_feed&job_categories=business',
    'https://jobicy.com/?feed=job_feed&job_categories=management',
    'https://www.higheredjobs.com/rss/articleFeed.cfm',
  ],
}; 