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
  counties.forEach(county => {
    if (county.name.toLowerCase() === inputCounty.toLowerCase()) {
      chosenCounty = county;
    }
  });
  if (!chosenCounty && countyMap.get(county)) {
    lookupFail();
  } else {

    let activityDetails = countyMap.get(chosenCounty);
    if(inputCounty.toLowerCase().indexOf('county') === -1) {
      inputCounty += ' County';
    }
    let resultDescription = ` ${chosenCounty.name} County`;
    if(isZip) {
      resultDescription = `${inputval} is in ${chosenCounty.name} County`
    }

    

    let allowedActivities = [];
    let nonAllowedActivities = [];
    let outdoorActivities = [];
    activityDetails.forEach(ac => {
      if(ac.status == "N") {
        nonAllowedActivities.push(ac)
      } else {
        allowedActivities.push(ac)
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
    </style>
      <h3>${resultDescription}</h3>
      <div class="open-results">
        <span class="open-results-set">
          <h4>What's open:</h4>
          <ul>
            ${allowedActivities.sort(sortByActivity).map( (item) => {
              return `
                <li>${item.activity}  ${(item.status.toLowerCase().indexOf('outdoor') > -1) ? ' - outdoor operations only' : ''}</li>
              `
            }).join(' ')}
          </ul>
        </span>
        <span class="open-results-set">
          <h4>What's closed:</h4>
          <ul>
            ${nonAllowedActivities.sort(sortByActivity).map( (item) => {
              return `
                <li>${item.activity}</li>
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

const counties = getCounties();
let countyMap = new Map();
activityList.forEach(ac => {
  counties.forEach(county => {
    let currentCountyActivities = countyMap.get(county);
    if(!currentCountyActivities) {
      currentCountyActivities = [];
    }
    let newObj = {};
    newObj.activity = ac.activity;
    newObj.status = ac[county.name];
    currentCountyActivities.push(newObj);
    countyMap.set(county,currentCountyActivities);
  })
})

function sortByActivity(a,b) {
  if(a.activity.toUpperCase() < b.activity.toUpperCase()) {
    return -1;
  } else {
    return 1;
  }
}