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


/*
// This is example chart switching code Avra demonstrated:

var containerDiv = document.getElementById("tableauViz");
var url = "https://public.tableau.com/views/Refugees_test/Dashboard2?:language=en&:display_count=y&publish=yes&:toolbar=n&:origin=viz_share_link";
var options = {
  width: "1200px",
  height: "900px",
  "Continent": "",
  onFirstInteractive: function () {
    activeSheet = viz.getWorkbook().getActiveSheet().getWorksheets()[1];
  }
}
var viz = new tableau.Viz(containerDiv, url, options);
activeSheet.applyFilterAsync("Continent", continent, tableau.FilterUpdateType.REPLACE);

These are parameters for the county charts:


County

Cases and Deaths

<param name='host_url' value='https%3A%2F%2Ftableau.cdt.ca.gov%2F' />  
<param name='name' value='StateDashboard-CleanSources&#47;3_1County-Reported' />

Hospitals

<param name='host_url' value='https%3A%2F%2Ftableau.cdt.ca.gov%2F' />  
<param name='name' value='StateDashboard-CleanSources&#47;9_1CountyHosp' />

Testing

<param name='host_url' value='https%3A%2F%2Ftableau.cdt.ca.gov%2F' />  
<param name='name' value='StateDashboard-CleanSources&#47;6_1CountyTesting' />

*/