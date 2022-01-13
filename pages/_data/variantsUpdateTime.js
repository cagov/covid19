// variantsUpdateTime
//
// Retrieves json file for use on variants page
//
const fetch = require('node-fetch')

module.exports = function() {
  let dataDomain = 'https://data.covid19.ca.gov/';
    return new Promise((resolve, reject) => {
    fetch(dataDomain+'data/status/last_variants_update.json')
    .then(res => res.json())
    .then(json => {
        resolve(json);
    }).catch((error) => {
      reject({"error": error})
    });
  });
};
  

