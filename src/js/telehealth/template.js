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
  let resultDescription = `Showing telehealth services or nurse advice lines offered by health plans in ${inputCounty}.`;
  if(isZip) {
    resultDescription = `${inputval} is in ${inputCounty}, showing telehealth services or nurse advice lines offered by health plans in ${inputCounty}.`
  }
  window.fetch('https://api.alpha.ca.gov/TeleHealth/'+inputCounty.replace(' County',''))
  .then(response => {
    return response.json();
  })
  .then(telehealth => {
    let html = `
      <h3>${resultDescription}</h3>
      <div class="pt-5 js-provider-list">
        ${telehealth.sort(function(a,b) {
          if (a['Health Plan Name'] < b['Health Plan Name']) {
            return -1;
          }
          if (a['Health Plan Name'] > b['Health Plan Name']) {
            return 1;
          }
          return 0;
        }).map( (item) => {
          return `
            <div class="card">
              <div class="card-header card-header-multi">
                <span class="bold">${ item['Health Plan Name'] }</span>
                <span class="">${ (item['Plan Type'].toLowerCase().indexOf('medi-cal') > -1) ? item['Plan Type'] : '' }</span>
              </div>
              <div class="card-body">
                <div class="card-text">
                  <p>Telehealth care offered: ${(item['Telehealth Offered by Health Plan'] == 'Yes') ? '<span class="bold">Yes</span>' : '<span class="bold">No</span>' }

                  ${ (item['Telehealth Services Phone Number'] != '') ? `<p>Telehealth services phone number: <a href="tel:${ item['Telehealth Services Phone Number'] }">${ item['Telehealth Services Phone Number'] }</a></p>` : '' }   

                  <p>Health plan nurse advice line: 
                    ${ (item['Health Plan Nurse Advice Line'] != '' && !item['Health Plan Nurse Advice Line'].match(/[A-Za-z]/)) ? `<a href="${ item['Health Plan Nurse Advice Line'] }">${ item['Health Plan Nurse Advice Line'] }</a>` : 'See insurance card'}
                  </p>
                  
                  ${ (item['Special Note'] != '') ? `<p>${item['Special Note'] }</p>` : '' }

                  ${ (item['Visit Health Plan Website'] != '') ? `<p><a href="${ item['Visit Health Plan Website'] }" class="action-link mr-3">Visit Health Plan website</a></p>` : ''}
                  
                  ${ (item['Visit Telehealth Website'] != '') ? `<p><a href="${ item['Visit Telehealth Website'] }" class="action-link mr-3">Visit Telehealth website</a></p>` : ''}
                </div>
              </div>
            </div>
          `
        }).join(' ')}
      </div>
    `;
    document.querySelector('.js-telehealth-providers').innerHTML = html;
  })
  .catch((err) => {
    lookupFail();
  });
}

function lookupFail () {
  document.querySelector('.invalid-feedback').style.display = 'block';
}
