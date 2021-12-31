// stateDashboardCasesUpdateTime
//
// Retrieves json file for use in state dashboard
//
const fetch = require('node-fetch')

module.exports = function() {
  let dataDomain = 'https://data.covid19.ca.gov/';
    return new Promise((resolve, reject) => {
    fetch(dataDomain+'data/status/last_cases_update.json')
    .then(res => res.json())
    .then(json => {
        resolve(json);
     }).catch((error) => {
       reject({"error": error})
     });
   });
 };
  

