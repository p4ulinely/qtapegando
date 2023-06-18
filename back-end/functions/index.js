const { dailyTrendsByRegion } = require('./gtrends');
const { dailyTrendsFrequenciesByRegion } = require('./gtrends');
const { realTimeTrendsByRegion } = require('./gtrends');

const { getTwitterTrendsByRegion } = require('./twitter');

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Google trends functions
exports.dailyTrendsByRegion = dailyTrendsByRegion;
exports.dailyTrendsFrequenciesByRegion = dailyTrendsFrequenciesByRegion;
exports.realTimeTrendsByRegion = realTimeTrendsByRegion;

// Twitter functions
exports.getTwitterTrendsByRegion = getTwitterTrendsByRegion;