// deathsSummaryData
//
// Retrieves cases chart data and compute daily average for use in dashboard-v4
//
const fetch = require('node-fetch')

module.exports = function() {
  let dataDomain = 'https://data.covid19.ca.gov/data/dashboard/';
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging') {
    dataDomain = 'https://raw.githubusercontent.com/cagov/covid-static-data/CovidStateDashboardTables_Staging/data/dashboard/';
  }
  return new Promise((resolve, reject) => {
    fetch(dataDomain+'confirmed-deaths/california.json')
    .then(res => res.json())
    .then(json => {
        // const data = json;          
        // let sumDeathsCount = 0;
        // const pending_date = json.data.latest.CONFIRMED_DEATHS.DEATH_UNCERTAINTY_PERIOD;
        // const deathsList = json.data.time_series.CONFIRMED_DEATHS_DEATH_DATE.VALUES;
        // let parse_state = 0;
        // let summed_days = 0;
        // for (let i = 0; i < deathsList.length; ++i) {
        //     if (parse_state == 0) {
        //         if (deathsList[i].DATE == pending_date) {
        //             parse_state = 1;
        //         }
        //     } else {
        //         sumDeathsCount += deathsList[i].VALUE;
        //         summed_days += 1;
        //     }
        //     if (summed_days == 7) {
        //         break;
        //     }
        // }
        // // console.log("SUMMED DEATHS", sumDeathsCount, summed_days);
        // let output = 
        //     {
        //         DEATHS_DAILY_AVERAGE: sumDeathsCount / summed_days
        //     }
        // ;
        // console.log("DEATH COMPARISON (dyn/pre): ",sumDeathsCount / summed_days, json.data.latest.CONFIRMED_DEATHS.DEATHS_DAILY_AVERAGE);
        // resolve(output);
        resolve(json);
    });
  });
};



