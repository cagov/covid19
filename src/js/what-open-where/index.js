// npx csvtojson activities.csv > activities.json

import '@cagov/lookup';
// the @cagov/lookup web component on the page will handle form with autocomplete

import activityResults from './template.js';
// listen for custom event, then
if(document.querySelector("cwds-lookup")) {
  document.querySelector("cwds-lookup").addEventListener("showResults", (evt) => {
    activityResults(evt.detail);
  });  
}

if(document.querySelector('.calimap')) {
  document.querySelector('.calimap').addEventListener("showResults", (evt) => {
    activityResults(evt.detail);
  });
}
