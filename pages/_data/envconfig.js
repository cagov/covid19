const defaultConfig = {
  equityChartsDataHome: 'https://files.covid19.ca.gov/data/'
}

const stagingConfig =  {
  equityChartsDataHome: 'https://files.covid19.ca.gov/data/to-review/'
}

module.exports = function() {
  console.log('hello world')
  console.log(process.env.NODE_ENV)
  if(process.env.NODE_ENV=='staging') {
    return stagingConfig;
  }
  return defaultConfig;
};

