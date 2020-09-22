import Awesomplete from 'awesomplete-es6';

window.fetch('/countystatus.json')
.then(response => response.json())
.then(function(data) {
  let aList = [];
  data.forEach(c => { aList.push(c.county) })
  const awesompleteSettings = {
    autoFirst: true,
    filter: function (text, input) {
      return Awesomplete.FILTER_CONTAINS(text, input.match(/[^,]*$/)[0]);
    },  
    item: function (text, input) {
      return Awesomplete.ITEM(text, input.match(/[^,]*$/)[0]);
    },
    replace: function (text) {
      let before = this.input.value.match(/^.+,\s*|/)[0];
      let finalval = before + text;
      this.input.value = finalval;        
      countySelected(finalval);
    },
    list: aList
  };
  const aplete = new Awesomplete('#location-query', awesompleteSettings)
}.bind(this));

function countySelected(county) {
  console.log('hi we have selected a county: '+county)
  //trigger the filter on all the county dashboards
  let casesChartActiveSheet = casesChartCountyViz.getWorkbook().getActiveSheet().getWorksheets()[1];
  let testingChartActiveSheet = testingChartCounty.getWorkbook().getActiveSheet().getWorksheets()[1];
  let hospitalChartActiveSheet = hospitalChartCounty.getWorkbook().getActiveSheet().getWorksheets()[1];
  document.querySelector('.js-toggle-county.county').innerHTML = county;

  function resetCounties() {
    if(casesChartActiveSheet && testingChartActiveSheet && hospitalChartActiveSheet) {
      casesChartActiveSheet.applyFilterAsync("County", county, tableau.FilterUpdateType.REPLACE);
      testingChartActiveSheet.applyFilterAsync("County", county, tableau.FilterUpdateType.REPLACE);
      hospitalChartActiveSheet.applyFilterAsync("County", county, tableau.FilterUpdateType.REPLACE);
    } else {
      setTimeout(resetCounties,500);
    }
  }
  resetCounties();
  showCounties();
}

function displayChart(containerSelector,width,height,url) {
  let chartContainer = document.querySelector(containerSelector);
  let chartActiveSheet = null;
  var chartURL = url;
  let chartOptions = {
    width: width+'px',
    height: height+'px'
  }
  return new tableau.Viz(chartContainer, chartURL, chartOptions);
}

// these are county toggles and state toggles
let casesChartCountyViz = displayChart('#casesChartCounty',1000,547,'https://tableau.cdt.ca.gov/views/Filter/3_1County-Reported?:showAppBanner=false&:display_count=n&:showVizHome=n&:origin=viz_share_link');
let casesChartStateViz = displayChart('#casesChartState',1000,547,'https://tableau.cdt.ca.gov/views/StateDashboard-CleanSources/1_1State-Reported?:origin=card_share_link&:embed=n');

let testingChartCounty = displayChart('#testingChartCounty',1000,620,'https://tableau.cdt.ca.gov/views/StateDashboard-CleanSources/6_1CountyTesting?:origin=card_share_link&:embed=n')
let testingChartState = displayChart('#testingChartState',1000,620,'https://tableau.cdt.ca.gov/views/StateDashboard-CleanSources/5_1StateTesting?:origin=card_share_link&:embed=n')

let hospitalChartCounty = displayChart('#hospitalChartCounty',1000,520,'https://tableau.cdt.ca.gov/views/StateDashboard-CleanSources/9_1CountyHosp?:origin=card_share_link&:embed=n')
let hospitalChartState = displayChart('#hospitalChartState',1000,520,'https://tableau.cdt.ca.gov/views/StateDashboard-CleanSources/7_1StateHosp?:origin=card_share_link&:embed=n')


// this chart does not toggle
let mapChart = displayChart('#mapChartContainer', 700,747, 'https://tableau.cdt.ca.gov/views/StateDashboard-CleanSources/11_1TierAssignmentMap?:origin=card_share_link&:embed=n');

// these are their own toggle sets
let ethnicityGroupChart = displayChart('#ethnicityGroupChartContainer', 1000, 327, 'https://tableau.cdt.ca.gov/views/StateDashboard-CleanSources/12_1Ethnicity?:origin=card_share_link&:embed=n')
let genderGroupChart = displayChart('#genderGroupChartContainer', 1000, 327, 'https://tableau.cdt.ca.gov/views/StateDashboard-CleanSources/12_2Gender?:origin=card_share_link&:embed=n')
let ageGroupChart = displayChart('#ageGroupChartContainer', 1000, 327, 'https://tableau.cdt.ca.gov/views/StateDashboard-CleanSources/12_3Age?:origin=card_share_link&:embed=n')

function resetGroupToggles() {
  groupTogglers.forEach(toggle => {
    toggle.classList.remove('toggle-active')  
  });
  document.getElementById('gender-graph').style.display = 'none';
  document.getElementById('ethnicity-graph').style.display = 'none';
  document.getElementById('age-graph').style.display = 'none';
}

let groupTogglers = document.querySelectorAll('.js-toggle-group');
document.getElementById('ethnicity-graph').style.display = 'block';
groupTogglers.forEach(toggle => {
  toggle.addEventListener('click',function(event) {
    event.preventDefault();
    resetGroupToggles();
    if(this.classList.contains('gender')) {
      document.getElementById('gender-graph').style.display = 'block';
    }
    if(this.classList.contains('age')) {
      document.getElementById('age-graph').style.display = 'block';
    }
    if(this.classList.contains('ethnicity')) {
      document.getElementById('ethnicity-graph').style.display = 'block';
    }
    this.classList.add('toggle-active');
  })
})


function resetCountyToggles() {
  countyTogglers.forEach(toggle => {
    toggle.classList.remove('toggle-active')
  });
  document.getElementById('cases-state-graph').style.display = 'none';
  document.getElementById('cases-county-graph').style.display = 'none';
  document.getElementById('testing-state-graph').style.display = 'none';
  document.getElementById('testing-county-graph').style.display = 'none';
  document.getElementById('hospital-state-graph').style.display = 'none';
  document.getElementById('hospital-county-graph').style.display = 'none';
}

let countyTogglers = document.querySelectorAll('.js-toggle-county');
document.getElementById('cases-state-graph').style.display = 'block';
countyTogglers.forEach(toggle => {
  toggle.addEventListener('click',function(event) {
    event.preventDefault();
    resetCountyToggles();
    if(this.classList.contains('statewide')) {
      document.getElementById('cases-state-graph').style.display = 'block';
      document.getElementById('testing-state-graph').style.display = 'block';
      document.getElementById('hospital-state-graph').style.display = 'block';
    }
    if(this.classList.contains('county')) {
      document.getElementById('cases-county-graph').style.display = 'block';
      document.getElementById('testing-county-graph').style.display = 'block';
      document.getElementById('hospital-county-graph').style.display = 'block';
    }
    this.classList.add('toggle-active');
  })
})

function showStateWides() {
  resetCountyToggles();
  document.querySelector('.js-toggle-county.statewide').classList.add('toggle-active');

  document.getElementById('cases-state-graph').style.display = 'block';
  document.getElementById('testing-state-graph').style.display = 'block';
  document.getElementById('hospital-state-graph').style.display = 'block';
}

function showCounties() {
  resetCountyToggles();
  document.querySelector('.js-toggle-county.county').classList.add('toggle-active');

  document.getElementById('cases-county-graph').style.display = 'block';
  document.getElementById('testing-county-graph').style.display = 'block';
  document.getElementById('hospital-county-graph').style.display = 'block';
}

showStateWides();

