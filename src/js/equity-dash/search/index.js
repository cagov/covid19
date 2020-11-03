import Awesomplete from 'awesomplete-es6';
import templatize from './template.js';

class CAGovCountySearch extends window.HTMLElement {
  connectedCallback () {
    let countyLabel = 'County';
    if(this.dataset.countyLabel) {
      countyLabel = this.dataset.countyLabel;
    }
    let countyPlaceholder = 'Enter county'
    this.state = {};

    this.innerHTML = templatize(countyLabel, countyPlaceholder);

    window.fetch('/countystatus.json')
    .then(response => response.json())
    .then(function(data) {
      this.countyStatuses = data;
      let aList = [];
      this.countyStatuses.forEach(c => { aList.push(c.county) })
      this.setupAutoComp('#location-query', 'county', aList);
      document.querySelector('#county-form').addEventListener('submit',function(event) {
        event.preventDefault();
        document.querySelector('#county-query-error').style.display = 'none';
        // do I have a full county typed in here?
        let typedInValue = document.querySelector('#location-query').value;
        let foundCounty = '';
        if(typedInValue == '') {
          this.state['county'] = null;
        }
        aList.forEach(county => {
          if(county.toLowerCase() == typedInValue.toLowerCase()) {
            foundCounty = county;
          }
        })
        if(foundCounty) {
          this.state['county'] = foundCounty;
          document.querySelector('#location-query').value = foundCounty;
          this.emitCounty();
        } else {
          document.querySelector('#county-query-error').style.display = 'block';
        }
      }.bind(this))  
    }.bind(this));
    
  }

  setupAutoComp(fieldSelector, fieldName, aList) {
    let component = this;
    const awesompleteSettings = {
      autoFirst: true,
      filter: function (text, input) {
        return Awesomplete.FILTER_CONTAINS(text, input.match(/[^,]*$/)[0]);
      },
      item: function (text, input) {
        return Awesomplete.ITEM(text, input.match(/[^,]*$/)[0]);
      },
      replace: function (text) {
        let before = this.input.value.match(/^.+,\s*|/)[0];
        let finalval = before + text;
        this.input.value = finalval;
        component.state[fieldName] = finalval;
        component.emitCounty();
      },
      list: aList
    };

    const aplete = new Awesomplete(fieldSelector, awesompleteSettings)
  }

  emitCounty() {
    // Dispatch custom event so we can pick up and track this usage elsewhere.
    const event = new window.CustomEvent('county-selected', {
      detail: {
        county: this.state.county,
        statewide: false
      }
    });
    this.dispatchEvent(event);    
  }

}
window.customElements.define('cagov-county-search', CAGovCountySearch);
