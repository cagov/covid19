// stateDashboardCasesUpdateTime
//
// Retrieves json file for use in state dashboard
//
const fetch = require('node-fetch')

module.exports = function() {
  let dataDomain = (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging') ? 'https://raw.githubusercontent.com/cagov/covid-static-data/CovidStateDashboardTables_Staging/' : 'https://data.covid19.ca.gov/';
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
  

