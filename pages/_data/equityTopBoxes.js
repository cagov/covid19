const data = require('../_buildoutput/equitytopboxdata.json');
const output = [
  {
    "cases_per_100k_statewide":1871.4,
    "death_rate_per_100k_statewide":45.5,
    "cases_per_100k_latino":2879.1,
    "cases_per_100k_pacific_islanders": 4024,
    "case_rate_vs_statewide_percent_latino":53,
    "case_rate_vs_statewide_percent_pacific_islanders":115,
    "case_rate_vs_statewide_percent_low_income":36,
    "death_rate_vs_statewide_percent_black":24,
    "death_rate_per_100k_black":56.2
  }
];

const roundNumber = (number, fractionDigits=3) => {
  const roundscale = Math.pow(10,fractionDigits);
  return Math.round(Number.parseFloat(number)*roundscale)/roundscale;
}

const totalPopulation = data.reduce((a,c)=> c.POPULATION+a,0);
const totalCases = data.reduce((a,c)=> c.CASES+a,0);
const totalDeaths = data.reduce((a,c)=> c.DEATHS+a,0);
const totalCaseRate = totalCases/totalPopulation*100000;
const totalDeathRate = totalDeaths/totalPopulation*100000;

//use updated values
output[0].death_rate_per_100k_statewide = roundNumber(totalDeathRate,1);
output[0].cases_per_100k_statewide = roundNumber(totalCaseRate,1);

const raceLatino = data.find(x=>x.RACE_ETHNICITY==='Latino');
output[0].cases_per_100k_latino = roundNumber(raceLatino.CASE_RATE,1);
output[0].case_rate_vs_statewide_percent_latino = roundNumber((raceLatino.CASE_RATE/totalCaseRate)*100-100,0);

const raceNHPI = data.find(x=>x.RACE_ETHNICITY==='Native Hawaiian and other Pacific Islander');
output[0].cases_per_100k_pacific_islanders = roundNumber(raceNHPI.CASE_RATE,1);
output[0].case_rate_vs_statewide_percent_pacific_islanders = roundNumber((raceNHPI.CASE_RATE/totalCaseRate)*100-100,0);

const raceBlack = data.find(x=>x.RACE_ETHNICITY==='African American');
output[0].death_rate_per_100k_black = roundNumber(raceBlack.DEATH_RATE,1);
output[0].death_rate_vs_statewide_percent_black = roundNumber((raceBlack.DEATH_RATE/totalDeathRate)*100-100,0);

module.exports = output;

