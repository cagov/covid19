const data = require('../_buildoutput/equitytopboxdataV2.json');
const demographics=data.Demographics;

const output = [
  {
    "cases_per_100K_statewide":1871.4,
    "death_rate_per_100K_statewide":45.5,
    "cases_per_100K_latino":2879.1,
    "cases_per_100K_pacific_islanders": 4024,
    "case_rate_vs_statewide_percent_latino":53,
    "case_rate_vs_statewide_percent_pacific_islanders":115,
    "case_rate_vs_statewide_percent_low_income":36,
    "case_rate_per_100K_low_income":40,
    "death_rate_vs_statewide_percent_black":24,
    "death_rate_per_100K_black":56.2
  }
];

const roundNumber = (number, fractionDigits=3) => {
  const roundscale = Math.pow(10,fractionDigits);
  return Math.round(Number.parseFloat(number)*roundscale)/roundscale;
}

const totalPopulation = demographics.reduce((a,c)=> c.POPULATION+a,0);
const totalCases = demographics.reduce((a,c)=> c.CASES+a,0);
const totalDeaths = demographics.reduce((a,c)=> c.DEATHS+a,0);
const totalCaseRate = totalCases/totalPopulation*100000;
const totalDeathRate = totalDeaths/totalPopulation*100000;

//use updated values
output[0].death_rate_per_100k_statewide = roundNumber(totalDeathRate,1);
output[0].cases_per_100k_statewide = roundNumber(totalCaseRate,1);

const raceLatino = demographics.find(x=>x.RACE_ETHNICITY==='Latino');
output[0].cases_per_100k_latino = roundNumber(raceLatino.CASE_RATE,1);
output[0].case_rate_vs_statewide_percent_latino = roundNumber((raceLatino.CASE_RATE/totalCaseRate)*100-100,0);

const raceNHPI = demographics.find(x=>x.RACE_ETHNICITY==='Native Hawaiian and other Pacific Islander');
output[0].cases_per_100k_pacific_islanders = roundNumber(raceNHPI.CASE_RATE,1);
output[0].case_rate_vs_statewide_percent_pacific_islanders = roundNumber((raceNHPI.CASE_RATE/totalCaseRate)*100-100,0);

const raceBlack = demographics.find(x=>x.RACE_ETHNICITY==='African American');
output[0].death_rate_per_100k_black = roundNumber(raceBlack.DEATH_RATE,1);
output[0].death_rate_vs_statewide_percent_black = roundNumber((raceBlack.DEATH_RATE/totalDeathRate)*100-100,0);

let lowIncomeDiff = data.LowIncome[0].STATE_CASE_RATE_PER_100K - data.LowIncome[0].CASE_RATE_PER_100K;
let lowIncomePercent = (Math.abs(lowIncomeDiff) / data.LowIncome[0].CASE_RATE_PER_100K) * 100;
output[0].case_rate_vs_statewide_percent_low_income = roundNumber(lowIncomePercent,0);
output[0].case_rate_per_100K_low_income = roundNumber(data.LowIncome[0].CASE_RATE_PER_100K,0);

module.exports = output;

