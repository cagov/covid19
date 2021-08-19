// vaccineSparkdata
//
// Retrieves vaccine sparkline json file for use in dashboard-v4
//
const fetch = require('node-fetch')

module.exports = function() {
  let dataDomain = 'https://files.covid19.ca.gov/data/';
    return new Promise((resolve, reject) => {
    fetch(dataDomain+'dashboard/vaccines/sparkline.json')
    .then(res => res.json())
    .then(json => {
        resolve(json);
    });
  });
};



