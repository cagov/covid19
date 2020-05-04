export default function templateHTML (inputval, counties) {
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
        if(Array.isArray(myzip)) {
          lookupSuccessZip(myzip, inputval, isZip, counties);
        } else {
          lookupSuccessCounty(myzip.county, inputval, isZip, counties);
        }
      })
      .catch((e) => {
        lookupFail();
      });
  } else {
    lookupSuccessCounty(inputval, inputval, isZip, counties);
  }
}

function lookupSuccessCounty(inputCounty, inputval, isZip, counties) {
  let chosenCounty;
  counties.forEach(county => {
    if (county.name.toLowerCase() === inputCounty.toLowerCase()) {
      chosenCounty = county;
    }
  });
  if (!chosenCounty) {
    lookupFail();
  } else {
    const county = chosenCounty.name;
    const url = chosenCounty.url;
    document.querySelector(
      '.js-county-alert'
    ).innerHTML = htmlTemplate(inputval, isZip, county, url);
  }
}

function lookupSuccessZip(zips, inputval, isZip, counties) {
  let chosenCounties = [];
  counties.forEach(county => {
    zips.forEach( zip => {
      if (county.name.toLowerCase() === zip.county.toLowerCase()) {
        chosenCounties.push(county);
      }  
    })
  });
  if (chosenCounties.length === 0) {
    lookupFail();
  } else {
    let html = '';
    chosenCounties.forEach((chCounty) => {
      let countyName = chCounty.name;
      let url = chCounty.url;
      html += htmlTemplate(inputval, isZip, countyName, url);
    })
    document.querySelector(
      '.js-county-alert'
    ).innerHTML = html;
  }
}

function htmlTemplate(inputval, isZip, county, url) {
  return `<li class="card mb-20  border-0">
  <h2>Alerts for ${inputval}</h2>
  ${(function () {
    if (isZip) {
      return `<p>Your zip code, ${inputval}, is in ${
        county.toLowerCase().indexOf('county') > -1
          ? county
          : county + ' County'
      }.</p>`;
    } else {
      return '';
    }
  })()}
    <div class="card-body">
      <a class="action-link" href="${url}">
        Sign up for ${
          county.toLowerCase().indexOf('county') > -1
            ? county
            : county + ' County'
        } alerts
      </a>
    </div>
  </li>`
}

function lookupFail () {
  document.querySelector('.invalid-feedback').style.display = 'block';
}
