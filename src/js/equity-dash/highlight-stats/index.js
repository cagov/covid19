class CAGovEquityHighlightStats extends window.HTMLElement {
  connectedCallback () {
    window.fetch(config.equityChartsDataLoc+"/equitydash/equitytopboxdatav2.json")
      .then((response) => response.json())
      .then(function (data) {
        console.log(data)
        this.processData(data);
      }.bind(this)
    );
  }

  processData(data) {
    const demographics=data.Demographics;
      let output = {
          "cases_per_100K_statewide":0,
          "death_rate_per_100K_statewide":0,
          "cases_per_100K_latino":0,
          "cases_per_100K_pacific_islanders": 0,
          "case_rate_vs_statewide_percent_latino":0,
          "case_rate_vs_statewide_percent_pacific_islanders":0,
          "case_rate_vs_statewide_percent_low_income":0,
          "case_rate_per_100K_low_income":0,
          "death_rate_vs_statewide_percent_black":0,
          "death_rate_per_100K_black":0
        };

      const roundNumber = (number, fractionDigits=3) => {
        const roundscale = Math.pow(10,fractionDigits);
        return Math.round(Number.parseFloat(number)*roundscale)/roundscale;
      }

      const totalPopulation = demographics.reduce((a,c)=> c.POPULATION+a,0);
      const totalDeaths = demographics.reduce((a,c)=> c.DEATHS+a,0);
      const totalCaseRate = roundNumber(data.LowIncome[0].STATE_CASE_RATE_PER_100K,0);
      const totalDeathRate = totalDeaths/totalPopulation*100000;

      //use updated values
      output.death_rate_per_100K_statewide = roundNumber(totalDeathRate,1);
      output.cases_per_100K_statewide = totalCaseRate

      const raceLatino = demographics.find(x=>x.RACE_ETHNICITY==='Latino');
      output.death_rate_per_100K_latino = roundNumber(raceLatino.DEATH_RATE,1);
      output.case_rate_vs_statewide_percent_latino = roundNumber(compare(totalCaseRate,raceLatino.CASE_RATE),0);

      const raceNHPI = demographics.find(x=>x.RACE_ETHNICITY==='Native Hawaiian and other Pacific Islander');
      output.cases_per_100K_pacific_islanders = roundNumber(raceNHPI.CASE_RATE,1);
      output.case_rate_vs_statewide_percent_pacific_islanders = roundNumber(compare(totalCaseRate,raceNHPI.CASE_RATE),0);

      const raceBlack = demographics.find(x=>x.RACE_ETHNICITY==='African American');
      output.death_rate_per_100K_black = roundNumber(raceBlack.DEATH_RATE,1);
      output.death_rate_vs_statewide_percent_black = roundNumber(compare(totalDeathRate,raceBlack.DEATH_RATE),0);

      output.case_rate_vs_statewide_percent_low_income = roundNumber(compare(totalCaseRate,data.LowIncome[0].CASE_RATE_PER_100K),0);
      output.case_rate_per_100K_low_income = roundNumber(data.LowIncome[0].CASE_RATE_PER_100K,0);

console.log('eh')
      this.replaceValues(output)
  }

  replaceValues(output) {
    this.querySelectorAll('.case_rate_vs_statewide_percent_latino').forEach(e => e.innerHTML = output.case_rate_vs_statewide_percent_latino)
    this.querySelectorAll('.death_rate_per_100K_latino').forEach(e => e.innerHTML = output.death_rate_per_100K_latino.toLocaleString())
    this.querySelectorAll('.cases_per_100K_statewide').forEach(e => e.innerHTML = output.cases_per_100K_statewide.toLocaleString())
    this.querySelectorAll('.case_rate_vs_statewide_percent_pacific_islanders').forEach(e => e.innerHTML = output.case_rate_vs_statewide_percent_pacific_islanders)
    this.querySelectorAll('.cases_per_100K_pacific_islanders').forEach(e => e.innerHTML = output.cases_per_100K_pacific_islanders.toLocaleString())
    this.querySelectorAll('.death_rate_vs_statewide_percent_black').forEach(e => e.innerHTML = output.death_rate_vs_statewide_percent_black)
    this.querySelectorAll('.death_rate_per_100K_black').forEach(e => e.innerHTML = output.death_rate_per_100K_black)
    this.querySelectorAll('.death_rate_per_100K_statewide').forEach(e => e.innerHTML = output.death_rate_per_100K_statewide)
    this.querySelectorAll('.case_rate_vs_statewide_percent_low_income').forEach(e => e.innerHTML = output.case_rate_vs_statewide_percent_low_income)
    this.querySelectorAll('.case_rate_per_100K_low_income').forEach(e => e.innerHTML = output.case_rate_per_100K_low_income.toLocaleString())
  }
}

window.customElements.define('cagov-equity-highlight-stats', CAGovEquityHighlightStats);

function compare(statewide,subset) {
  let diff = subset - statewide; // the in page logic looks for positive increase in percnetage to display language: subset is x% higher than statewide
  return (diff / statewide) * 100;
}
/*
format numbers
handle absolute values
*/