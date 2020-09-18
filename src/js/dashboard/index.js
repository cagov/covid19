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
/*
onFirstInteractive: function () {
  casesChartActiveSheet = viz.getWorkbook().getActiveSheet().getWorksheets()[1];
}
This is a working way to switch counties: activeSheet.applyFilterAsync("County", "Yolo", tableau.FilterUpdateType.REPLACE);
*/

// these are county toggles and state toggles
let casesChart = displayChart('#casesChart',1000,547,"https://tableau.cdt.ca.gov/views/StateDashboard-CleanSources/1_1State-Reported?:origin=card_share_link&:embed=n");
// "https://tableau.cdt.ca.gov/views/Filter/3_1County-Reported?:showAppBanner=false&:display_count=n&:showVizHome=n&:origin=viz_share_link";

let testingChart = displayChart('#testingChart',1000,620,"https://tableau.cdt.ca.gov/views/StateDashboard-CleanSources/5_1StateTesting?:origin=card_share_link&:embed=n")
// https://tableau.cdt.ca.gov/views/StateDashboard-CleanSources/6_1CountyTesting?:origin=card_share_link&:embed=n

let hospitalChart = displayChart('#hospitalChart',1000,520,"https://tableau.cdt.ca.gov/views/StateDashboard-CleanSources/7_1StateHosp?:origin=card_share_link&:embed=n")
// https://tableau.cdt.ca.gov/views/StateDashboard-CleanSources/9_1CountyHosp?:origin=card_share_link&:embed=n


// this chart does not toggle
let mapChart = displayChart('#mapChartContainer', 700,747, 'https://tableau.cdt.ca.gov/views/StateDashboard-CleanSources/11_1TierAssignmentMap?:origin=card_share_link&:embed=n');

// these are their own toggle sets
let ethnicityGroupChart = displayChart('#ethnicityGroupChartContainer', 1000, 327, 'https://tableau.cdt.ca.gov/views/StateDashboard-CleanSources/12_1Ethnicity?:origin=card_share_link&:embed=n')
let genderGroupChart = displayChart('#genderGroupChartContainer', 1000, 327, 'https://tableau.cdt.ca.gov/views/StateDashboard-CleanSources/12_2Gender?:origin=card_share_link&:embed=n')
let ageGroupChart = displayChart('#ageGroupChartContainer', 1000, 327, 'https://tableau.cdt.ca.gov/views/StateDashboard-CleanSources/12_3Age?:origin=card_share_link&:embed=n')

function resetToggles() {
  togglers.forEach(toggle => {
    toggle.classList.remove('toggle-active')  
  });
  document.getElementById('gender-graph').style.display = 'none';
  document.getElementById('ethnicity-graph').style.display = 'none';
  document.getElementById('age-graph').style.display = 'none';
}

let togglers = document.querySelectorAll('.js-toggle-group');
document.getElementById('ethnicity-graph').style.display = 'block';
togglers.forEach(toggle => {
  toggle.addEventListener('click',function(event) {
    event.preventDefault();
    resetToggles();
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