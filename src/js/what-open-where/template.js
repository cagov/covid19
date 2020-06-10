import getCounties from './counties.js';
import activityList from './activities.json';
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

    if(inputCounty.toLowerCase().indexOf('county') === -1) {
      inputCounty += ' County';
    }
    let resultDescription = ` ${chosenCounty.name} County`;
    if(isZip) {
      resultDescription = `${inputval} is in ${chosenCounty.name} County`
    }

    let currentStage = chosenCounty.stage;

    let allowedActivities = [];
    let nonAllowedActivities = [];
    activityList.forEach(ac => {
      if(ac.Stage <= currentStage) {
        allowedActivities.push(ac)
      } else {
        nonAllowedActivities.push(ac)
      }
    })
    let html = `
    <style>
    @media (min-width: 570px) {
      .open-results {
        display: flex;
      }
    }
    .open-results-set {
      margin-right: 20px;
    }
    .open-results-set ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    </style>
      <h3>${resultDescription}</h3>
      <div class="open-results">
        <span class="open-results-set">
          <h4>What's open:</h4>
          <ul>
            ${allowedActivities.sort().map( (item) => {
              return `
                <li>${item.Activity}</li>
              `
            }).join(' ')}
          </ul>
        </span>
        <span class="open-results-set">
          <h4>What's closed:</h4>
          <ul>
            ${nonAllowedActivities.sort().map( (item) => {
              return `
                <li>${item.Activity} ${(item.Stage == '2c' && chosenCounty.stage == '2b') ? '(opening June 12)' : ''}</li>
              `
            }).join(' ')}
          </ul>
        </span>
      </div>
    `;
    document.querySelector('.js-alameda-haircut').innerHTML = html;
  }
}

function lookupFail () {
  document.querySelector('.invalid-feedback').style.display = 'block';
}
