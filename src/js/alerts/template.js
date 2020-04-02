export default function templateHTML (inputval, counties) {
  let isZip = false;
  if (inputval.match(/^\d+$/)) {
    // we are dealing with a zip code
    isZip = true;
    window.fetch('https://api.alpha.ca.gov/countyfromzip/' + inputval)
      .then(response => {
        return response.json();
      })
      .then(myzip => {
        lookupSuccess(myzip.county, inputval, isZip, counties);
      })
      .catch(() => {
        lookupFail();
      });
  } else {
    lookupSuccess(inputval, inputval, isZip, counties);
  }
}

function lookupSuccess (inputCounty, inputval, isZip, counties) {
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
    ).innerHTML = `<li class="card mb-20  border-0">
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
  </li>`;
  }
}

function lookupFail () {
  document.querySelector('.invalid-feedback').style.display = 'block';
}
