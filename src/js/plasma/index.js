import '@cagov/lookup';
// the @cagov/lookup web component on the page will handle form with autocomplete

import plasmaResults from './template.js';
// listen for custom event, then
if(document.querySelector("cwds-lookup")) {
  document.querySelector("cwds-lookup").addEventListener("showResults", (evt) => {
    plasmaResults(evt.detail);
  });  
}

