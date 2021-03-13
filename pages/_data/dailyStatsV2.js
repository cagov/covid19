// dailyStatsV2
//
// Retrieves json file for use in dashboard-v2
//
const fetch = require('node-fetch')

module.exports = function() {
  let dataDomain = 'https://files.covid19.ca.gov/data/';
  // if preproduction or staging
  // console.log("!!!!! daiyStatsV2.js NODE_ENV",process.env.NODE_ENV);
  // if (process.env.NODE_ENV === 'staging' || process.env.NODE_ENV == "development") {
  //   console.log("  Using Dev/Staging");
  //   dataDomain = 'https://raw.githubusercontent.com/cagov/covid-static/e6e97242925cef36ba8445da00338a117f88522f/data/';
  // }
    return new Promise((resolve, reject) => {
    fetch(dataDomain+'daily-stats-v2.json')
    .then(res => res.json())
    .then(json => {
        resolve(json);
    });
  });
};




