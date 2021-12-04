// vaccineSparkdata
//
// Retrieves vaccine sparkline json file for use in dashboard-v4
//
const fetch = require('node-fetch')

module.exports = function() {
  let dataDomain = 'https://data.covid19.ca.gov/data/';
    return new Promise((resolve, reject) => {
    fetch(dataDomain+'dashboard/vaccines/sparkline.json')
    .then(res => res.json())
    .then(json => {
        let output = json;
        // force 1 week pending data
        // const pending_date = json.data.time_series.VACCINE_DOSES.VALUES[6].DATE;
        // const vaxList = json.data.time_series.VACCINE_DOSES.VALUES;
        // let summedDosesCount = 0;
        // let parse_state = 0;
        // let summed_days = 0;
        // for (let i = 0; i < vaxList.length; ++i) {
        //     if (parse_state == 0) {
        //         if (vaxList[i].DATE == pending_date) {
        //             parse_state = 1;
        //         }
        //     } else {
        //         summedDosesCount += vaxList[i].VALUE;
        //         summed_days += 1;
        //     }
        //     if (summed_days == 7) {
        //         break;
        //     }
        // }
        // // console.log("SUMMED VACCINE DOSES",summedDosesCount, summed_days, vaxList.length);
        // output.data.DOSES_DAILY_AVERAGE = summedDosesCount / summed_days;
        resolve(output);
    });
  });
};



