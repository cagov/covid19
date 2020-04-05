import getCounties from './counties.js';
import Awesomplete from 'awesomplete-es6';
import templateHTML from './template.js';

if (document.querySelector('.js-alert-lookup')) {
  const counties = getCounties();

  const fieldSelector = 'input[data-multiple]';
  const awesompleteSettings = {
    autoFirst: true,
    filter: function (text, input) {
      return Awesomplete.FILTER_CONTAINS(text, input.match(/[^,]*$/)[0]);
    },

    item: function (text, input) {
      document.querySelector('.invalid-feedback').style.display = 'none';
      document.querySelector('.city-search').classList.remove('is-invalid');
      return Awesomplete.ITEM(text, input.match(/[^,]*$/)[0]);
    },

    replace: function (text) {
      let before = this.input.value.match(/^.+,\s*|/)[0];
      let finalval = before + text;
      this.input.value = finalval;
      templateHTML(finalval, counties);
    }
  };

  const aplete = new Awesomplete(fieldSelector, awesompleteSettings)

  document.querySelector(fieldSelector).addEventListener('keyup', event => {
    const skipKeys = [13, 9, 27, 38, 40]; // do not reset suggestion list if using arrow keys, enter, tab
    if (event.target.value.length >= 2) {
      if (skipKeys.indexOf(event.keyCode) === -1) {
        queryLoc(event.target.value,aplete);
      }
    }
  });

  document
    .querySelector('.js-alert-lookup')
    .addEventListener('submit', function (event) {
      event.preventDefault();
      document.querySelector('.invalid-feedback').style.display = 'none';
      document.querySelector('.city-search').classList.remove('is-invalid');
      let finalval = this.querySelector('input').value;
      templateHTML(finalval, counties);
    });
}

function queryLoc (q,aplete) {
  window.lookup = q;
  const url = `https://api.alpha.ca.gov/CaZipCityCountyTypeAhead?citymode=false&countymode=true&q=${q}`;
  window.fetch(url)
    .then(response => response.json())
    .then(data => {
        aplete.list = data.match.map(x=>x);
    })
    .catch(() => {
      //resetForm();
    });
}