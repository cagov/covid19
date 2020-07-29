// npx csvtojson activities.csv > activities.json

import '@cagov/lookup';
// the @cagov/lookup web component on the page will handle form with autocomplete

import activityResults from './template.js';
// listen for custom event, then
if(document.querySelector("cwds-lookup")) {
  document.querySelector("cwds-lookup").addEventListener("showResults", (evt) => {
    activityResults(evt.detail);
    // put the event.detail on the url
    history.pushState(null, `What is open where: ${evt.detail}`, `${window.location.pathname}?county=${evt.detail}`);
  });  
}


// see if there is something on the url, if so load those results
window.addEventListener('popstate', function(e) {
  resetPage()
});

function resetPage() {
  let county = '';
  document.querySelector('.invalid-feedback').style.display = 'none';
  if(window.location.search) {
    county = decodeURIComponent(window.location.search.replace('?county=',''));
  }
  if(county) {
    activityResults(county);
    document.querySelector('.city-search').value = county;
  } else {
    document.querySelector('.js-alameda-haircut').innerHTML = '';
    document.querySelector('.city-search').value = '';
  }
}
resetPage();

if(document.querySelector('.calimap')) {
  document.querySelector('.calimap').addEventListener("showResults", (evt) => {
    activityResults(evt.detail);
  });
}
