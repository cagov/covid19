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

const totalPopulation = data.reduce((a,c)=> c.POPULATION+a,0);
const totalCases = data.reduce((a,c)=> c.CASES+a,0);
const totalDeaths = data.reduce((a,c)=> c.DEATHS+a,0);
const totalCaseRate = totalCases/totalPopulation*100000;
const totalDeathRate = totalDeaths/totalPopulation*100000;

//use updated values
output[0].death_rate_per_100k_statewide = totalDeathRate;
output[0].cases_per_100k_statewide = totalCaseRate;

const raceLatino = data.find(x=>x.RACE_ETHNICITY==='Latino');
output[0].cases_per_100k_latino = raceLatino.CASE_RATE;
output[0].case_rate_vs_statewide_percent_latino = (raceLatino.CASE_RATE/totalCaseRate)*100-100;

const raceNHPI = data.find(x=>x.RACE_ETHNICITY==='Native Hawaiian and other Pacific Islander');
output[0].cases_per_100k_pacific_islanders = raceNHPI.CASE_RATE;
output[0].case_rate_vs_statewide_percent_pacific_islanders = (raceNHPI.CASE_RATE/totalCaseRate)*100-100;

const raceBlack = data.find(x=>x.RACE_ETHNICITY==='African American');
output[0].death_rate_per_100k_black = raceBlack.DEATH_RATE;
output[0].death_rate_vs_statewide_percent_black = (raceBlack.DEATH_RATE/totalDeathRate)*100-100;

module.exports = output;

