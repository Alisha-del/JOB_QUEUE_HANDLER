const axios = require('axios');
const xml2js = require('xml2js');
const config = require('../../config/default');

async function fetchJobsFromSource(sourceUrl) {
  try {
    const response = await axios.get(sourceUrl);
    const xml = response.data;
    const json = await xml2js.parseStringPromise(xml, { explicitArray: false });
    // Normalize jobs from different feeds (customize as needed)
    let jobs = [];
    if (json.rss && json.rss.channel && json.rss.channel.item) {
      jobs = Array.isArray(json.rss.channel.item) ? json.rss.channel.item : [json.rss.channel.item];
    } else if (json.feed && json.feed.entry) {
      jobs = Array.isArray(json.feed.entry) ? json.feed.entry : [json.feed.entry];
    }
    return jobs.map(job => ({ raw: job, source: sourceUrl }));
  } catch (err) {
    console.error(`Error fetching/parsing jobs from ${sourceUrl}:`, err.message);
    return [];
  }
}

async function fetchAllJobs() {
  const allJobs = [];
  for (const source of config.importSources) {
    const jobs = await fetchJobsFromSource(source);
    allJobs.push({ source, jobs });
  }
  return allJobs;
}

module.exports = { fetchAllJobs }; 