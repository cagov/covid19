import Awesomplete from 'awesomplete-es6';
import rtlOverride from "./../../common/rtl-override.js";
import templatize from './template.js';

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

  handleURLPayload() {
    // Support URL with #location-countyname
    let curHREF = document.location.href;
    if (curHREF.indexOf('#location-') != -1) {
      let loc = curHREF.split('#location-')[1].replace('_',' ').replace('-',' ');
      let countyInput = document.querySelector("#location-query");
      if (loc != 'california') {
        console.log("Triggering county search",loc,countyInput);
        this.processCountySearchInput(loc);
      }
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

    this.countyList = ["Alameda","Alpine","Amador","Butte","Calaveras","Colusa","Contra Costa","Del Norte","El Dorado","Fresno","Glenn","Humboldt","Imperial","Inyo","Kern","Kings","Lake","Lassen","Los Angeles","Madera","Marin","Mariposa","Mendocino","Merced","Modoc","Mono","Monterey","Napa","Nevada","Orange","Placer","Plumas","Riverside","Sacramento","San Benito","San Bernardino","San Diego","San Francisco","San Joaquin","San Luis Obispo","San Mateo","Santa Barbara","Santa Clara","Santa Cruz","Shasta","Sierra","Siskiyou","Solano","Sonoma","Stanislaus","Sutter","Tehama","Trinity","Tulare","Tuolumne","Ventura","Yolo","Yuba"];
    this.setupAutoComp('#location-query', 'county', this.countyList);
    let myThis = this;
    document.querySelector('#county-form').addEventListener('submit',function(event) {
      event.preventDefault();
      document.querySelector('#county-query-error').style.display = 'none';
      // do I have a full county typed in here?
      let typedInValue = document.querySelector('#location-query').value.trim();
      myThis.processCountySearchInput(typedInValue);
    });
    this.handleURLPayload();

    rtlOverride(this, 'div', 'ltr');
  }

  setupAutoComp(fieldSelector, fieldName, aList) {
    let component = this;
    const awesompleteSettings = {
      autoFirst: true,
      filter: function (text, input) {
        var res = Awesomplete.FILTER_CONTAINS(text, input.match(/[^,]*$/)[0]);
        console.log("filter -->",res);
        return res;
      },
      item: function (text, input) {
        var res = Awesomplete.ITEM(text, input.match(/[^,]*$/)[0]);
        console.log("filter item -->",res);
        return res;
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