const mongoose = require('mongoose');
const Job = require('./models/Job');

mongoose.connect('mongodb://localhost:27017/job_importer', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const jobs = [
  {
    externalId: "job-12345",
    title: "Frontend Developer",
    company: "Acme Corp",
    location: "Remote",
    description: "Develop and maintain web applications using React.",
    url: "https://acme.example.com/jobs/frontend-developer",
    source: "https://jobicy.com/?feed=job_feed",
    raw: {
      guid: "job-12345",
      title: "Frontend Developer",
      company: "Acme Corp",
      location: "Remote",
      description: "Develop and maintain web applications using React.",
      link: "https://acme.example.com/jobs/frontend-developer",
      postedAt: "2024-06-01T10:00:00Z"
    },
    updatedAt: "2024-06-01T10:00:00Z"
  },
  {
    externalId: "job-67890",
    title: "Backend Engineer",
    company: "Beta Solutions",
    location: "New York, NY",
    description: "Design and implement scalable backend services using Node.js and MongoDB.",
    url: "https://beta.example.com/careers/backend-engineer",
    source: "https://jobicy.com/?feed=job_feed&job_categories=data-science",
    raw: {
      guid: "job-67890",
      title: "Backend Engineer",
      company: "Beta Solutions",
      location: "New York, NY",
      description: "Design and implement scalable backend services using Node.js and MongoDB.",
      link: "https://beta.example.com/careers/backend-engineer",
      postedAt: "2024-06-02T09:30:00Z"
    },
    updatedAt: "2024-06-02T09:30:00Z"
  }
];

Job.insertMany(jobs)
  .then(() => {
    console.log('Dummy jobs inserted!');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error inserting jobs:', err);
    mongoose.disconnect();
  }); 