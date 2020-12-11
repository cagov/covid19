import Awesomplete from 'awesomplete-es6';
import templatize from './template.js';
import rtlOverride from "./../rtl-override.js";

class CAGovCountySearch extends window.HTMLElement {

  processCountySearchInput(typedInValue) {
        let foundCounty = '';
        // console.log("Search Input: ",typedInValue);
        if(typedInValue == '') {
          this.state['county'] = 'California';
          this.state.statewide = true;
        }
        // console.log("Searching for ",typedInValue,"in",component.countyList);
        this.countyList.forEach(county => {
          if(county.toLowerCase() == typedInValue.toLowerCase()) {
            foundCounty = county;
          }
        })
        if(foundCounty) {
          this.state['county'] = foundCounty;
          this.state.statewide = false;
          document.querySelector('#location-query').value = foundCounty;
          console.log("emitCounty via search:",foundCounty);
          this.emitCounty();
          document.querySelector('#county-query-error').style.display = 'none';
        } else {
          // generate failed search event...
          // console.log("county not found: ",typedInValue);
          // console.log("emitCounty via typo",typedInValue);
          // this.emitCountyTypo(typedInValue);
          document.querySelector('#county-query-error').style.display = 'block';
        }
  }

  connectedCallback () {
    let countyLabel = 'County';
    if(this.dataset.countyLabel) {
      countyLabel = this.dataset.countyLabel;
    }
    let countyPlaceholder = 'Enter county'
    this.state = {};
    this.state.statewide = false;

    this.innerHTML = templatize(countyLabel, countyPlaceholder);
    this.addListeners();

    window.fetch('/countystatus.json')
    .then(response => response.json())
    .then(function(data) {
      this.countyStatuses = data;
      let aList = [];
      this.countyStatuses.forEach(c => { aList.push(c.county) })
      this.countyList = aList;
      this.setupAutoComp('#location-query', 'county', aList);
      document.querySelector('#county-form').addEventListener('submit',function(event) {
        event.preventDefault();
        document.querySelector('#county-query-error').style.display = 'none';
        // do I have a full county typed in here?
        let typedInValue = document.querySelector('#location-query').value.trim();
        this.processCountySearchInput(typedInValue);
      }.bind(this))  
    }.bind(this));

    rtlOverride(this, 'div', 'ltr');

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
      replace: function (selectedSuggestion) {
        let typedInValue = selectedSuggestion.value;
        component.processCountySearchInput(typedInValue);
      },
      list: aList
    };

    const aplete = new Awesomplete(fieldSelector, awesompleteSettings)
  }

  emitCounty() {
    // jbum: If we get statewide: true, reset the dialog to as it appears on refresh
    // console.log("Emit County",this.state);
    // Dispatch custom event so we can pick up and track this usage elsewhere.
    const event = new window.CustomEvent('county-selected', {
      detail: {
        county: this.state.county,
        statewide: this.state.statewide,
        reset: this.state.statewide,
        how: 'emitCounty'
      }
    });
    // console.log("Emitting county-select",event.detail);
    this.dispatchEvent(event);    
  }

  /*
  emitCountyTypo(misspelling) {
    // Dispatch custom event so we can pick up and track this usage elsewhere.
   // console.log("Emit County Typo");
   const event = new window.CustomEvent('county-search-typo', {
      detail: {
        county: misspelling,
      }
    });
    this.dispatchEvent(event);    
  }
  */


  addListeners() {
    let countyInput = this.querySelector("#location-query");
    let clearBtn = this.querySelector("#clearCounty");
    countyInput.addEventListener("focus", inputValue);    
    countyInput.addEventListener("input", inputValue);
    countyInput.addEventListener("blur", inputValue);
    
    function inputValue() {
      if (countyInput && countyInput.value) {
        clearBtn.classList.remove('d-none');
      } else {
        clearBtn.classList.add('d-none');
      }
    }

    clearBtn.addEventListener("blur", inputValue);    
    clearBtn.addEventListener("click", function(e) {
      // console.log("Clear Button Clicked");
      e.preventDefault();
      countyInput.value = '';
      this.state['county'] = 'California';
      this.state.statewide = true;
      // console.log("C emitting county",this.state);
      console.log("Emit county via clearbutton");
      this.emitCounty();
      clearBtn.classList.add('d-none');
      document.querySelector('#county-query-error').style.display = 'none';
    }.bind(this));
  }

}
window.customElements.define('cagov-county-search', CAGovCountySearch);