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
  let resultDescription = `Showing plasma donation locations in ${inputCounty}.`;
  if(isZip) {
    resultDescription = `${inputval} is in ${inputCounty}, showing plasma donation locations in ${inputCounty}.`
  }
  window.fetch('https://api.alpha.ca.gov/PlasmaDonate/'+inputCounty.replace(' County',''))
  .then(response => {
    return response.json();
  })
  .then(locations => {
    let html = `There does not appear to be a donation center in this county. You could either type in a neighboring county into the search or view more current listings at <a href="http://www.aabb.org/tm/donation/Pages/Blood-Bank-Locator.aspx">http://www.aabb.org/tm/donation/Pages/Blood-Bank-Locator.aspx</a>.`
    if(locations.length > 0 && locations[0].Name) {
      html = `
        <h3>${resultDescription}</h3>
        <div class="pt-5 js-provider-list">
          ${locations.map( (item) => {
            return `
              <div class="card">
                <div class="card-header card-header-multi">
                  <span class="bold">${ item['Name'] }</span>
                </div>
                <div class="card-body">
                  <div class="card-text">

                    <p>
                      ${ (item['Address1'] != '') ? `${ item['Address1'] }<br>` : '' }
                      ${ (item['Address2']) ? `${ item['Address2'] }<br>` : '' }
                      ${ (item['CityStateZip'] != '') ? `${ item['CityStateZip'] }` : '' }
                    </p>
                    ${ (item['Contact']) ? `<p><a href="tel:${ item['Contact'] }">${ item['Contact'] }</a></p>` : '' }                   
                    ${ (item['Website']) ? `<p><a href="${ item['Website'] }" class="action-link mr-3">Visit website</a></p>` : ''}
                  </div>
                </div>
              </div>
            `
          }).join(' ')}
        </div>
      `;
    }
    document.querySelector('.js-plasma-providers').innerHTML = html;
  })
  .catch((err) => {
    lookupFail();
  });
}

function lookupFail () {
  document.querySelector('.invalid-feedback').style.display = 'block';
}


