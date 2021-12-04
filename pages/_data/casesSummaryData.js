// casesSummaryData
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
    fetch(dataDomain+'confirmed-cases/california.json')
    .then(res => res.json())
    .then(json => {
        // const data = json;          
        // let sumCasesCount = 0;
        // const pending_date = json.data.latest.CONFIRMED_CASES.EPISODE_UNCERTAINTY_PERIOD;
        // const caseList = json.data.time_series.CONFIRMED_CASES_EPISODE_DATE.VALUES;
        // let parse_state = 0;
        // let summed_days = 0;
        // for (let i = 0; i < caseList.length; ++i) {
        //     if (parse_state == 0) {
        //         if (caseList[i].DATE == pending_date) {
        //             parse_state = 1;
        //         }
        //     } else {
        //         sumCasesCount += caseList[i].VALUE;
        //         summed_days += 1;
        //     }
        //     if (summed_days == 7) {
        //         break;
        //     }
        // }
        // // console.log("SUMMED CASES", sumCasesCount, summed_days);
        // let output = 
        //     {
        //         CASES_DAILY_AVERAGE: sumCasesCount / summed_days
        //     }
        // ;

        // console.log("CASE COMPARISON (dyn/pre): ",sumCasesCount / summed_days, json.data.latest.CONFIRMED_CASES.CASES_DAILY_AVERAGE);
        // resolve(output);
        resolve(json);
    });
  });
};



