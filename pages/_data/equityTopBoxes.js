/*
 * Run test against this object with: npm run testdata
*/

const fetch = require('node-fetch')

function getSnowflakeStyleDateJS(date) {
  let month = '' + (date.getMonth() + 1),
  day = '' + date.getDate(),
  year = date.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

module.exports = function() {
  let dataDomain = 'https://data.covid19.ca.gov/data/reviewed/';
  // console.log(dataDomain+'equitydash/equitytopboxdatav2.json');

  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging') {
    dataDomain = 'https://data.covid19.ca.gov/data/to-review/';
  }
  return new Promise((resolve, reject) => {
    fetch(dataDomain+'equitydash/equitytopboxdatav2.json')
    .then(res => res.json())
    .then(json => {

      const data = json;          
      const demographics=data.Demographics;
      let output = [
        {
          "lowincome_date":"",
          "demographics_date":"",
          "cases_per_100K_statewide":0,
          "death_rate_per_100K_statewide":0,
          "cases_per_100K_latino":0,
          "cases_per_100K_pacific_islanders": 0,
          "case_rate_vs_statewide_percent_latino":0,
          "case_rate_vs_statewide_percent_pacific_islanders":0,
          "case_rate_vs_statewide_percent_low_income":0,
          "case_rate_per_100K_low_income":0,
          "death_rate_vs_statewide_percent_black":0,
          "death_rate_per_100K_black":0,
          "death_rate_vs_statewide_percent_latino":0,
          "death_rate_per_100K_latino":0,
        }
      ];

      const roundNumber = (number, fractionDigits=3) => {
        const roundscale = Math.pow(10,fractionDigits);
        return Math.round(Number.parseFloat(number)*roundscale)/roundscale;
      }

      const totalPopulation = demographics.reduce((a,c)=> c.POPULATION+a,0);
      const totalDeaths = demographics.reduce((a,c)=> c.DEATHS+a,0);
      const totalCaseRate = roundNumber(data.LowIncome[0].STATE_CASE_RATE_PER_100K,0);
      const totalDeathRate = totalDeaths/totalPopulation*100000;

      //use updated values
      output[0].death_rate_per_100K_statewide = roundNumber(totalDeathRate,1);
      output[0].cases_per_100K_statewide = totalCaseRate

      const raceLatino = demographics.find(x=>x.RACE_ETHNICITY==='Latino');
      output[0].cases_per_100K_latino = roundNumber(raceLatino.CASE_RATE,1);
      output[0].case_rate_vs_statewide_percent_latino = roundNumber(compare(totalCaseRate,raceLatino.CASE_RATE),0);
      output[0].death_rate_per_100K_latino = roundNumber(raceLatino.DEATH_RATE,1);
      output[0].death_rate_vs_statewide_percent_latino = roundNumber(compare(totalDeathRate,raceLatino.DEATH_RATE),0);

      const raceNHPI = demographics.find(x=>x.RACE_ETHNICITY==='Native Hawaiian and other Pacific Islander');
      output[0].cases_per_100K_pacific_islanders = roundNumber(raceNHPI.CASE_RATE,1);
      output[0].case_rate_vs_statewide_percent_pacific_islanders = roundNumber(compare(totalCaseRate,raceNHPI.CASE_RATE),0);

      const raceBlack = demographics.find(x=>x.RACE_ETHNICITY==='African American'||x.RACE_ETHNICITY==='Black');
      output[0].death_rate_per_100K_black = roundNumber(raceBlack.DEATH_RATE,1);
      output[0].death_rate_vs_statewide_percent_black = roundNumber(compare(totalDeathRate,raceBlack.DEATH_RATE),0);

      output[0].case_rate_vs_statewide_percent_low_income = roundNumber(compare(totalCaseRate,data.LowIncome[0].CASE_RATE_PER_100K),0);
      output[0].case_rate_per_100K_low_income = roundNumber(data.LowIncome[0].CASE_RATE_PER_100K,0);

      output[0].lowincome_date = data.LowIncome[0].DATE;
      output[0].demographics_date = raceLatino.REPORT_DATE;

      // force to most recent wednesday
      const theDate = new Date();
      while (theDate.getDay() != 3) {
        theDate.setDate(theDate.getDate() - 1);
      }
      output[0].publish_date = getSnowflakeStyleDateJS(theDate);
      resolve(output);
    });
  });
};

function compare(statewide,subset) {
  let diff = subset - statewide; // the in page logic looks for positive increase in percnetage to display language: subset is x% higher than statewide
  return (diff / statewide) * 100;
}
