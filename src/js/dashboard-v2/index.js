import '../equity-dash/search/index.js';
import '../equity-dash/county-buttons/buttons.js'

// import css from "../common/chart.scss";
import './charts/cagov-chart-dashboard-groups-race-ethnicity-cases/index.js';
import './charts/cagov-chart-dashboard-groups-race-ethnicity-deaths/index.js';
import './charts/cagov-chart-dashboard-groups-gender-cases/index.js';
import './charts/cagov-chart-dashboard-groups-gender-deaths/index.js';
import './charts/cagov-chart-dashboard-groups-age-cases/index.js';
import './charts/cagov-chart-dashboard-groups-age-deaths/index.js';

// new top section charts
import "./charts/cagov-chart-dashboard-confirmed-cases-episode-date/index.js"
import "./charts/cagov-chart-dashboard-confirmed-deaths-death-date/index.js"

import "./charts/cagov-chart-dashboard-confirmed-cases-reported-date/index.js"
import "./charts/cagov-chart-dashboard-confirmed-deaths-reported-date/index.js"

import "./charts/cagov-chart-dashboard-total-tests-testing-date/index.js"
import "./charts/cagov-chart-dashboard-positivity-rate/index.js"
import "./charts/cagov-chart-dashboard-total-tests-reported-date/index.js"

import "./charts/cagov-chart-dashboard-hospitalized-patients/index.js"
import "./charts/cagov-chart-dashboard-icu-beds/index.js"
import "./charts/cagov-chart-dashboard-icu-patients/index.js"

var countyInput = document.getElementById("location-query");
var clearBtn = document.getElementById("clearCounty");

let chartWidth2 = 900;
let countyMapChartHeight = 660;

// Map responsivness
var divElement = document.querySelector('.col-lg-10');
if ( divElement.offsetWidth > 920 ) { chartWidth2 = 910;countyMapChartHeight = 560;} 
  else if ( (divElement.offsetWidth > 910) && (divElement.offsetWidth < 920)) { chartWidth2 = 900; countyMapChartHeight = 560;} 
  else if ( (divElement.offsetWidth > 800) && (divElement.offsetWidth < 910) ) { chartWidth2 = 750; countyMapChartHeight = 660;} 
  else if ( (divElement.offsetWidth > 700) && (divElement.offsetWidth < 879) ) { chartWidth2 = 650; countyMapChartHeight = 660; } 
  else if ( (divElement.offsetWidth > 600) && (divElement.offsetWidth < 700) ) { chartWidth2 = 550; countyMapChartHeight = 660; } 
  else if ( (divElement.offsetWidth > 500) && (divElement.offsetWidth < 600) ) { chartWidth2 = 450; countyMapChartHeight = 660; } 
  else { chartWidth2 = 350; countyMapChartHeight = 660; }

async function setupTableauChart() {
  if(document.getElementById('mapChartContainer')) {
    let containerSelector = '#mapChartContainer';

    let chartContainer = document.querySelector(containerSelector);
    var chartURL = 'https://public.tableau.com/views/COVID-19Planforreducingcovid-19wregionsmap/planforreducingcovid-19?:language=en&:display_count=y&:origin=viz_share_link';
    let chartOptions = {
      width: chartWidth2+'px',
      height: countyMapChartHeight+'px'
    }
  
    let chartViz = await new tableau.Viz(chartContainer, chartURL, chartOptions);
    return chartViz;
  
  }
}

window.onload = function() {
  let s = document.createElement('script');
  s.src = 'https://public.tableau.com/javascripts/api/tableau-2.min.js';
  document.getElementsByTagName('head')[0].appendChild(s);
  // I don't think IE supports click to interact so check for IE, then load this file
  // https://public.tableau.com/javascripts/api/tableau-2.min.js
  // setupTableauChart();
}

function resetGroupToggles() {
  console.log("Reset Group Toggles");
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
    }
    if(this.classList.contains('age')) {
      document.getElementById('age-graph').style.display = 'block'; 
      this.classList.add('toggle-active');
    }
    if(this.classList.contains('ethnicity')) {
      document.getElementById('ethnicity-graph').style.display = 'block';      
    }
    this.classList.add('toggle-active');
  })
})
