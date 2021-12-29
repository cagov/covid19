// stateDashboardVaxUpdateTime
//
// Retrieves json file for use in state dashboard
//
const fetch = require('node-fetch')

module.exports = function() {
  let dataDomain = 'https://raw.githubusercontent.com/cagov/covid-static-data/main/';
    return new Promise((resolve, reject) => {
    fetch(dataDomain+'data/status/last_vax_update.json')
    .then(res => res.json())
    .then(json => {
        resolve(json);
      }).catch((error) => {
        reject({"error": error})
      });
    });
  };
  