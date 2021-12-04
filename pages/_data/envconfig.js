const defaultConfig = {
  equityChartsDataHome: 'https://data.covid19.ca.gov/data/'
}

const stagingConfig =  {
  equityChartsDataHome: 'https://data.covid19.ca.gov/data/to-review/'
}

module.exports = function() {
  if(process.env.NODE_ENV=='staging') {
    return stagingConfig;
  }
  return defaultConfig;
};

