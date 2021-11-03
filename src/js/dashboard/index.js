import '../common/search/index.js';
import '../common/county-buttons/buttons.js'

// import css from "../common/chart.scss";
import './charts/cagov-chart-dashboard-groups-race-ethnicity-cases/index.js';
import './charts/cagov-chart-dashboard-groups-race-ethnicity-deaths/index.js';
import './charts/cagov-chart-dashboard-groups-gender-cases/index.js';
import './charts/cagov-chart-dashboard-groups-gender-deaths/index.js';
import './charts/cagov-chart-dashboard-groups-age-cases/index.js';
import './charts/cagov-chart-dashboard-groups-age-deaths/index.js';

// small tab filter buttons
import '../common/search/filters.js'

// new top section charts
import "./charts/cagov-chart-dashboard-confirmed-cases/index.js"
import "./charts/cagov-chart-dashboard-confirmed-deaths/index.js"
import "./charts/cagov-chart-dashboard-total-tests/index.js"
import "./charts/cagov-chart-dashboard-positivity-rate/index.js"
import "./charts/cagov-chart-dashboard-patients/index.js"
import "./charts/cagov-chart-dashboard-icu-beds/index.js"

// sparklines - no longer rendered dynamically
// import "./charts/cagov-chart-dashboard-sparkline/index.js"

// new postvax charts
import "./charts/cagov-chart-dashboard-postvax-chart/index.js"

// load sparklines
let svg_path = 'https://data.covid19.ca.gov/img/generated/sparklines/';
function getSVG(file,selector) {
  fetch(svg_path + file).then(function(response) {
    return response.text().then(function(text) {
      let targetEl = document.querySelector(selector);
      if(targetEl) {
        targetEl.innerHTML = text;
      }
    });
  });
}
getSVG('sparkline-cases.svg','.sparkline-cases');
getSVG('sparkline-tests.svg','.sparkline-tests');
getSVG('sparkline-deaths.svg','.sparkline-deaths');
getSVG('sparkline-vaccines.svg','.sparkline-vax');

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
});


function resetPostvaxToggles() {
  console.log("Reset Group Toggles");
  groupTogglers2.forEach(toggle => {
    toggle.classList.remove('toggle-active')
  });
  document.getElementById('postvax-cases-chart').style.display = 'none';
  document.getElementById('postvax-hospitalizations-chart').style.display = 'none';
  document.getElementById('postvax-deaths-chart').style.display = 'none';
}

let groupTogglers2 = document.querySelectorAll('.js-toggle-group-postvax');
groupTogglers2.forEach(toggle => {
  toggle.addEventListener('click',function(event) {
    event.preventDefault();
    resetPostvaxToggles();
    if(this.classList.contains('cases')) {
      document.getElementById('postvax-cases-chart').style.display = 'block';
      this.classList.add('toggle-active');
    }
    if(this.classList.contains('hospitalizations')) {
      document.getElementById('postvax-hospitalizations-chart').style.display = 'block'; 
      this.classList.add('toggle-active');
    }
    if(this.classList.contains('deaths')) {
      document.getElementById('postvax-deaths-chart').style.display = 'block';      
    }
    this.classList.add('toggle-active');
  })
});

