import Awesomplete from 'awesomplete-es6';

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
    this.state = {};

    this.innerHTML = `
      <div class="reopening-fields">
      <h2>${title}</h2>
        <form action="#" class="reopening-activities">
          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="location-query">${countyLabel}</label>
              <div class="awesomplete">
                <input
                  aria-expanded="false"
                  aria-owns="awesomplete_list_1"
                  autocomplete="off"
                  class="form-control"
                  data-list=""
                  data-multiple=""
                  id="location-query"
                  role="combobox"
                  type="text"
                />
                <ul hidden="" role="listbox" id="awesomplete_list_1"></ul>
                <span
                  class="visually-hidden"
                  role="status"
                  aria-live="assertive"
                  aria-atomic="true"
                  >Type 2 or more characters for results.</span
                >
              </div>
              <ul hidden="" id="awesomplete-list-1" role="listbox"></ul>
              <span
                class="visually-hidden"
                aria-atomic="true"
                aria-live="assertive"
                role="status"
                >Type 2 or more characters for results.</span
              >
            </div>
            <div class="form-group col-md-6">
              <label for="activity">${activityLabel}</label>
              <div class="awesomplete">
                <input
                  aria-expanded="false"
                  aria-owns="awesomplete_list_2"
                  autocomplete="off"
                  class="form-control"
                  data-list=""
                  data-multiple=""
                  id="activity-query"
                  role="combobox"
                  type="text"
                />
                <ul hidden="" role="listbox" id="awesomplete_list_2"></ul>
              </div>
              <ul hidden="" id="awesomplete-list-2" role="listbox"></ul>
            </div>
          </div>

          <button type="submit" class="btn btn-primary">Get latest status</button>
        </form>
        <div class="card-holder"></div>
      </div>
    `;
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
        // document.querySelector('.invalid-feedback').style.display = 'none';
        // document.querySelector('.reopening-fields').classList.remove('is-invalid');
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
          window.lookup = q;
          // todo: what is this for ^^^???
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
      replace: function (text) {
        let before = this.input.value.match(/^.+,\s*|/)[0];
        let finalval = before + text;
        this.input.value = finalval;
        component.state[fieldName] = finalval;
        component.layoutCards();
      },
      list: aList
    };

    const aplete2 = new Awesomplete(fieldSelector, awesompleteSettings);
  }

  layoutCards() {
    this.cardHTML = '';
    let selectedCounties = this.countyStatuses;
    if(this.state['county']) {
      selectedCounties = [];
      this.countyStatuses.forEach(item => {
        if(item.County == this.state['county']) {
          selectedCounties.push(item)
        }
      })
    }
    let selectedActivities = this.allActivities;
    selectedCounties.forEach(item => {
      this.cardHTML += `<div class="card-county county-color-${item['Overall Status']}">
        <h2>${item.County}</h2>
        <div class="pill">${this.statusdesc.Table1[parseInt(item['Overall Status']) - 1].Status}</div>
        <p>${this.statusdesc.Table1[parseInt(item['Overall Status']) - 1].description}</p>
      </div>`
      if(this.state['activity']) {
        selectedActivities = [];
      }
      this.allActivities.forEach(ac => {
        if(ac["0"] == this.state['activity']) {
          selectedActivities.push(ac);
        }
      })
      selectedActivities.forEach(ac => {
        this.cardHTML += `<div class="card-activity">
          <h3>${ac["0"]} in ${item.County} are ${ac[item['Overall Status']] == "Closed" ? "Closed" : "Open"}</h3>
          <p>${ac[item['Overall Status']]}</p>
          <p class="mt-20">Last Updated ${new Date().toLocaleDateString()}</p>
        </div>`
      })
    })
    // These classes are used but created with variables so the purge cannot find them, they are carefully placed here where they will be noticed
    this.cardHTML += `<div style="display:none">
      <div class="county-color-1 county-color-2 county-color-3 county-color-4"></div>
    </div>`
    this.querySelector('.card-holder').innerHTML = this.cardHTML;
  }
}
window.customElements.define('cagov-reopening', CAGovReopening);
