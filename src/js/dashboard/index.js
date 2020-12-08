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
      // countySelected(finalval);
    },
    list: aList
  };
  const aplete = new Awesomplete('#location-query', awesompleteSettings);
  setupFormSubmitListener(aList);
}.bind(this));

function setupFormSubmitListener(aList) {
  document.querySelector('#county-form').addEventListener('submit',function(event) {
    event.preventDefault();
    document.querySelector('#county-query-error').style.display = 'none';
    // do I have a full county typed in here?
    let typedInValue = document.querySelector('#location-query').value;
    let foundCounty = '';
    aList.forEach(county => {
      if(county.toLowerCase() == typedInValue.toLowerCase()) {
        foundCounty = county;
      }
    })
    if(foundCounty) {
      countySelected(foundCounty);
    } else {
      document.querySelector('#county-query-error').style.display = 'block';
    }
  }.bind(this))  
}

function countySelected(county) {
  document.querySelector('#county-query-error').style.display = 'none';
  //trigger the filter on all the county dashboards
  let casesChartActiveSheet = casesChartCountyViz.getWorkbook().getActiveSheet().getWorksheets()[1];
  let testingChartActiveSheet = testingChartCounty.getWorkbook().getActiveSheet().getWorksheets()[1];
  let hospitalChartActiveSheet = hospitalChartCounty.getWorkbook().getActiveSheet().getWorksheets()[1];

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
  document.querySelectorAll('.js-toggle-county-container').forEach(c => {
    c.classList.remove('d-none');
  })
  document.querySelectorAll('.js-toggle-county.county').forEach(c => {
    c.innerHTML = county;
    c.classList.remove('d-none');
  });
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

let topChartHeights1 = 600;
let chartWidth = 900;
let chartWidth2 = 900;
let chartWidth3 = 800;
let countyMapChartHeight = 660;
// Map responsivness
var divElement = document.querySelector('.col-lg-10');
if ( divElement.offsetWidth > 920 ) { chartWidth2 = 910;countyMapChartHeight = 560;} 
  else if ( (divElement.offsetWidth > 910) && (divElement.offsetWidth < 920)) { chartWidth2 = 900; chartWidth3 = 900; countyMapChartHeight = 560;} 
  else if ( (divElement.offsetWidth > 800) && (divElement.offsetWidth < 910) ) { chartWidth2 = 750; chartWidth3 = 750; countyMapChartHeight = 660;} 
  else if ( (divElement.offsetWidth > 700) && (divElement.offsetWidth < 879) ) { chartWidth2 = 650; countyMapChartHeight = 660;  chartWidth3 = 700;} 
  else if ( (divElement.offsetWidth > 600) && (divElement.offsetWidth < 700) ) { chartWidth2 = 550; countyMapChartHeight = 660; chartWidth3 = 600;} 
  else if ( (divElement.offsetWidth > 500) && (divElement.offsetWidth < 600) ) { chartWidth2 = 450; countyMapChartHeight = 660; chartWidth3 = 450;} 
  else { chartWidth2 = 350; countyMapChartHeight = 660; chartWidth3 = 450;}

/* phone */
if(window.innerWidth < 700) {
  topChartHeights1 = 930;
  //countyMapChartHeight = 560;
  chartWidth = window.innerWidth - 30;
  //chartWidth2 = chartWidth;
}
/* small tablet */
else if (window.innerWidth > 700 && window.innerWidth < 918) {
  topChartHeights1 = 930;
  //countyMapChartHeight = 560;
  chartWidth = 700;
 // chartWidth2 = chartW920idth;
}
/* big tablet */
else if (window.innerWidth > 919 && window.innerWidth < 1200) {
  topChartHeights1 = 600;
  //countyMapChartHeight = 560;
  chartWidth = 800;
 // chartWidth2 = 920;
}


// these are county toggles and state toggles
let casesChartStateViz = displayChart('#casesChartState',chartWidth,topChartHeights1,'https://public.tableau.com/views/StateDashboard_16008816705240/1_1State-Reported?:language=en&:display_count=y&:origin=viz_share_link');
let testingChartState = displayChart('#testingChartState',chartWidth,topChartHeights1,'https://public.tableau.com/views/StateDashboard_16008816705240/5_1StateTesting?:language=en&:display_count=y&:origin=viz_share_link')
let hospitalChartState = displayChart('#hospitalChartState',chartWidth,topChartHeights1,'https://public.tableau.com/views/StateDashboard_16008816705240/7_1StateHosp?:language=en&:display_count=y&:origin=viz_share_link')

let casesChartCountyViz = displayChart('#casesChartCounty',chartWidth,topChartHeights1,'https://public.tableau.com/views/StateDashboard_16008816705240/3_1County-Reported?:language=en&:display_count=y&:origin=viz_share_link');
let testingChartCounty = displayChart('#testingChartCounty',chartWidth,topChartHeights1,'https://public.tableau.com/views/StateDashboard_16008816705240/6_1CountyTesting?:language=en&:display_count=y&:origin=viz_share_link')
let hospitalChartCounty = displayChart('#hospitalChartCounty',chartWidth,topChartHeights1,'https://public.tableau.com/views/StateDashboard_16008816705240/9_1CountyHosp?:language=en&:display_count=y&:origin=viz_share_link')

// this chart does not toggle
let mapChart = displayChart('#mapChartContainer', chartWidth2,countyMapChartHeight, 'https://public.tableau.com/views/COVID-19Planforreducingcovid-19wregionsmap/planforreducingcovid-19?:language=en&:display_count=y&:origin=viz_share_link');

// these are their own toggle sets
let ethnicityGroupChart = displayChart('#ethnicityGroupChartContainer', chartWidth3, 600, 'https://public.tableau.com/views/StateDashboard_16008816705240/12_1Ethnicity?:language=en&:display_count=y&:origin=viz_share_link')
let genderGroupChart = ''; // we aren't loading this until they click
let ageGroupChart = ''; // we aren't loading this until they click

function resetGroupToggles() {
  groupTogglers.forEach(toggle => {
    toggle.classList.remove('toggle-active')
  });
  document.getElementById('gender-graph').style.display = 'none';
  document.getElementById('ethnicity-graph').style.display = 'none';
  document.getElementById('age-graph').style.display = 'none';
}

let groupTogglers = document.querySelectorAll('.js-toggle-group');
groupTogglers.forEach(toggle => {
  toggle.addEventListener('click',function(event) {
    event.preventDefault();
    resetGroupToggles();
    if(this.classList.contains('gender')) {
      document.getElementById('gender-graph').style.display = 'block';
      this.classList.add('toggle-active');
      genderGroupChart = displayChart('#genderGroupChartContainer', chartWidth3, 600, 'https://public.tableau.com/views/StateDashboard_16008816705240/12_2Gender?:language=en&:display_count=y&:origin=viz_share_link')
    }
    if(this.classList.contains('age')) {
      document.getElementById('age-graph').style.display = 'block'; 
      this.classList.add('toggle-active');     
      ageGroupChart = displayChart('#ageGroupChartContainer', chartWidth3, 600, 'https://public.tableau.com/views/StateDashboard_16008816705240/12_3Age?:language=en&:display_count=y&:origin=viz_share_link')
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
      showStateWides();
    }
    if(this.classList.contains('county')) {
      showCounties();
    }
  })
})

function showStateWides() {
  resetCountyToggles();
  document.querySelectorAll('.js-toggle-county.statewide').forEach(c => {
    c.classList.add('toggle-active');
  })
  document.getElementById('cases-state-graph').style.display = 'block';
  document.getElementById('testing-state-graph').style.display = 'block';
  document.getElementById('hospital-state-graph').style.display = 'block';
}

function showCounties() {
  resetCountyToggles();
  document.querySelectorAll('.js-toggle-county.county').forEach(c => {
    c.classList.add('toggle-active');
  });

  document.getElementById('cases-county-graph').style.display = 'block';
  document.getElementById('testing-county-graph').style.display = 'block';
  document.getElementById('hospital-county-graph').style.display = 'block';
}

// normally we would display none stuff we don't want to hide but this wreaks havoc with tableau's internal layout logic and we end up with mobile views even when we specifically pass it dimensions so we are avoiding displaying none on these for now
// showStateWides();