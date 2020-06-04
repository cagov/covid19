/*
new alameda haircut
  build search input
  find my map
    https://docs.google.com/document/d/1s0y-Hyd96fccaI1seeXiSN6VJybloNGcFx3nFwShDGo/edit#
    Peggy's activity data: https://github.com/thepegisin/API/blob/master/OpennessStateActivities/activities.csv
    my map: https://covid19.ca.gov/calicounties/
    https://www.cdph.ca.gov/Programs/CID/DCDC/Pages/COVID-19/County_Variance_Attestation_Form.aspx


listen for search input selection event
create county plus stage dataset
  require it
lookup stage
call the activity list api...
show some activities
*/

import '@cagov/lookup';
// the @cagov/lookup web component on the page will handle form with autocomplete

import activityResults from './template.js';
// listen for custom event, then
if(document.querySelector("cwds-lookup")) {
  document.querySelector("cwds-lookup").addEventListener("showResults", (evt) => {
    activityResults(evt.detail);
  });  
}

