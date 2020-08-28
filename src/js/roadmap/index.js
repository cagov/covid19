import Awesomplete from 'awesomplete-es6';
import templatize from './template.js';

class CAGovReopening extends window.HTMLElement {
  connectedCallback () {
    let counties = this.dataset.counties;
    let activities = this.dataset.status;
    let activityLabel = 'Activity';
    if(this.dataset.activityLabel) {
      activityLabel = this.dataset.activityLabel;
    }
    let title = 'Find the status for activities in your county';
    if(this.dataset.title) {
      title = this.dataset.title;
    }
    let countyLabel = 'County';
    if(this.dataset.countyLabel) {
      countyLabel = this.dataset.countyLabel;
    }
    let activityPlaceholder = 'Enter a business or activity';
    let countyPlaceholder = 'Enter county' // a ZIP code or 
    this.state = {};

    this.innerHTML = templatize(title, countyLabel, countyPlaceholder, activityLabel, activityPlaceholder);
    let theMatrix = document.querySelector('.the-matrix');
    if(theMatrix) {
      this.querySelector('.matrix-holder').innerHTML = theMatrix.innerHTML;
    }
    this.setupAutoComp('#location-query', 'county');

    window.fetch('/countystatus.json')
    .then(response => response.json())
    .then(function(data) {
      this.countyStatuses = data;
    }.bind(this));

    window.fetch('/statusdescriptors.json')
    .then(response => response.json())
    .then(function(data) {
      this.statusdesc = data;
    }.bind(this));

    window.fetch('/reopening-activities.json')
    .then(response => response.json())
    .then(function(data) {
      this.allActivities = data.Table1;
      let aList = []
      aList.push('View all closed')
      aList.push('View all open')
      data.Table1.forEach(item => {
        aList.push(item['0'])
      })
      this.setupAutoCompActivity('#activity-query', 'activity', aList)
    }.bind(this))
    .catch(() => {
      //resetForm();
    });

    document.querySelector('.reopening-activities').addEventListener('submit',function(event) {
      event.preventDefault();
      if(document.querySelector('#location-query').value == '') {
        this.state['county'] = null;
      }
      if(document.querySelector('#activity-query').value == '') {
        this.state['activity'] = null;
      }
      if(!this.state['activity'] && !this.state['county']) {
        this.querySelector('.card-holder').innerHTML = '';
      } else {
        this.layoutCards();
      }
    }.bind(this))
  }

  setupAutoComp(fieldSelector, fieldName) {
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
        component.layoutCards();
      }
    };
  
    const aplete = new Awesomplete(fieldSelector, awesompleteSettings)

    document.querySelector(fieldSelector).addEventListener('keyup', event => {
      const skipKeys = [13, 9, 27, 38, 40]; // do not reset suggestion list if using arrow keys, enter, tab
      if (event.target.value.length >= 2) {
        if (skipKeys.indexOf(event.keyCode) === -1) {
          let q = event.target.value;
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
      }
    });
  }

  setupAutoCompActivity(fieldSelector, fieldName, aList) {
    let component = this;
    const awesompleteSettings = {
      autoFirst: true,
      minChars: 0,
      maxItems: 99,
      sort: function(a,b) {
        if(a['0'] < b['0']) {
          return -1;
        }
        if(a['0'] > b['0']) {
          return 1;
        }
        return 0;
      },
      replace: function (text) {
        let before = this.input.value.match(/^.+,\s*|/)[0];
        let finalval = before + text;
        this.input.value = finalval;
        component.state[fieldName] = finalval;
        component.layoutCards();
      },
      list: aList
    };

    window.aplete2 = new Awesomplete(fieldSelector, awesompleteSettings);
    document.querySelector(fieldSelector).addEventListener('focus', function() {
      window.aplete2.evaluate();
    })
  }

  layoutCards() {
    this.cardHTML = '';
    let selectedCounties = this.countyStatuses;
    if(this.state['county']) {
      selectedCounties = [];
      this.countyStatuses.forEach(item => {
        if(item.county == this.state['county']) {
          selectedCounties.push(item)
        }
      })
    }
    let selectedActivities = this.allActivities;
    selectedCounties.forEach(item => {
      this.cardHTML += `<div class="card-county county-color-${item['Overall Status']}">
        <h2>${item.county}</h2>
        <div class="pill">${this.statusdesc.Table1[parseInt(item['Overall Status']) - 1]['County risk level']}</div>
        <p>${this.statusdesc.Table1[parseInt(item['Overall Status']) - 1].description} <a href="#reopening-data">Understand the data</a></p>
      </div>`
      if(this.state['activity']) {
        selectedActivities = [];
        this.allActivities.forEach(ac => {
          if(ac["0"] == this.state['activity']) {
            selectedActivities.push(ac);
          }
          if(this.state['activity'].toLowerCase() === 'view all open') {
            if(ac[item['Overall Status']] != "Closed") {
              selectedActivities.push(ac);
            }
          }
          if(this.state['activity'].toLowerCase() === 'view all closed') {
            console.log(ac[item['Overall Status']])
            if(ac[item['Overall Status']] == "Closed") {
              selectedActivities.push(ac);
            }
          }
        })
      }
      selectedActivities.forEach(ac => {
        this.cardHTML += `<div class="card-activity">
          <h3>${ac["0"]} in ${item.county} are ${ac[item['Overall Status']] == "Closed" ? "Closed" : "Open"}</h3>
          <p>${ac[item['Overall Status']]}</p>
        </div>`
      })
    })
    // These classes are used but created with variables so the purge cannot find them, they are carefully placed here where they will be noticed
    this.cardHTML += `<div style="display:none">
      <div class="county-color-1 county-color-2 county-color-3 county-color-4"></div>
    </div>`
    this.querySelector('.card-holder').innerHTML = `<div class="card-content">${this.cardHTML}</div>`;
    this.querySelector('.card-holder').classList.remove('inactive');
  }
}
window.customElements.define('cagov-reopening', CAGovReopening);
