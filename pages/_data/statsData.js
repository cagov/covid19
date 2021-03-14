const caseStats = require('./tableauCovidMetrics.json');

const data = {
  summary: {
    totalCases: caseStats[0]['TOTALCONFIRMED'],
    totalCasesIncrease: caseStats[0]['TOTALCONFIRMED_DAILYPCTCHG'] * 100,
    totalDeaths: caseStats[0]['NUMBERDIED'],
    totalDeathsIncrease: caseStats[0]['NUMBERDIED_DAILYPCTCHG'] * 100,
    testsReported: caseStats[0]['TESTED'],
    lastStatsDate: caseStats[0]['DATE'] + 'T18:00:00Z'
  }
};

module.exports = data;
