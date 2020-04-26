import '@cagov/lookup';
// the @cagov/lookup web component on the page will handle form with autocomplete

import telehealthResults from './template.js';
// listen for custom event, then
const searchEl = document.querySelector("cwds-lookup");
searchEl.addEventListener("showResults", (evt) => {
  telehealthResults(evt.detail);
});

