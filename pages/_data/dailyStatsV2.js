// dailyStatsV2
//
// Retrieves json file for use in state dashboard
//
const fetch = require('node-fetch')

module.exports = function() {
  let dataDomain = 'https://data.covid19.ca.gov/data/';

  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging') {
    dataDomain = 'https://raw.githubusercontent.com/cagov/covid-static-data/CovidStateDashboard_Summary_Staging/data/';
  }
  
  return new Promise((resolve, reject) => {
    fetch(dataDomain+'daily-stats-v2.json?cachebust='+Math.random())
    .then(res => res.json())
    .then(json => {
        resolve(json);
    });
  });
};
