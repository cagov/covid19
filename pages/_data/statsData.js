const caseStats = require('./caseStats.json');

const data = {
  summary: {
    year: caseStats.Table1[0]['0 – year'],
    month: caseStats.Table1[0]['1 – month'],
    day: caseStats.Table1[0]['2 – day'],
    totalCases: caseStats.Table1[0]['3 – total cases'],
    totalCasesIncrease: caseStats.Table1[0]['4 – total cases increase'],
    totalDeaths: caseStats.Table1[0]['5 – total deaths'],
    totalDeathsIncrease: caseStats.Table1[0]['6 – total deaths increase'],
    testsReported: caseStats.Table1[0]['7 - tests reported'],
    lastStatsDate: caseStats.Table1[0]['0 – year'] + "-" + caseStats.Table1[0]['1 – month'] + "-" + caseStats.Table1[0]['2 – day'] +"T18:00:00Z"
  }
};

module.exports = data;
