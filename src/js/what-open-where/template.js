import getCounties from './counties.js';
import activityList from 'activities.json';
// npx csvtojson activities.csv > activities.json

export default function template(inputval) {
  // make API call for results based on zip or county string
  let isZip = false;
  if (inputval.match(/^\d+$/)) {
    // we are dealing with a zip code
    isZip = true;
    let url = `https://api.alpha.ca.gov/countyfromzip/${inputval}`;
    window.fetch(url)
      .then(response => {
        return response.json();
      })
      .then(myzip => {
        lookupSuccess(myzip[0].county, inputval, isZip);
      })
      .catch(() => {
        lookupFail();
      });
  } else {
    lookupSuccess(inputval, inputval, isZip);
  }
}

function lookupSuccess(inputCounty, inputval, isZip) {
  if(inputCounty.toLowerCase().indexOf('county') === -1) {
    inputCounty += ' County';
  }
  let resultDescription = ` ${inputCounty}`;
  if(isZip) {
    resultDescription = `${inputval} is in ${inputCounty}`
  }

  let chosenCounty;
  const counties = getCounties();
  counties.forEach(county => {
    if (county.name.toLowerCase() === inputCounty.toLowerCase()) {
      chosenCounty = county;
    }
  });
  if (!chosenCounty) {
    lookupFail();
  } else {
    let currentStage = chosenCounty.stage;

    let allowedActivities = [];
    let nonAllowedActivities = [];
    activityList.forEach(ac => {
      if(ac.Stage <= currentStage) {
        allowedActivities.push(ac.Activity)
      } else {
        nonAllowedActivities.push(ac.Activity)
      }
    })
    let html = `
      <h3>${resultDescription}</h3>

      <h4>What's open:</h4>
      <ul class="list-group">
        ${allowedActivities.sort().map( (item) => {
          return `
            <li class="list-group-item">${item}</li>
          `
        }).join(' ')}
      </ul>
      <h4>What's closed:</h4>
      <ul class="list-group">
        ${nonAllowedActivities.sort().map( (item) => {
          return `
            <li class="list-group-item">${item}</li>
          `
        }).join(' ')}
      </ul>
    `;
    document.querySelector('.js-alameda-haircut').innerHTML = html;
  }
}

function lookupFail () {
  document.querySelector('.invalid-feedback').style.display = 'block';
}
