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
    this.seeGuidanceText = 'See guidance for';
    if(this.dataset.seeGuidanceText) {
      this.seeGuidanceText = this.dataset.seeGuidanceText;
    }
    let countyLabel = 'County';
    if(this.dataset.countyLabel) {
      countyLabel = this.dataset.countyLabel;
    }
    let activityPlaceholder = 'Enter a business or activity';
    let countyPlaceholder = 'Enter county' // a ZIP code or 
    this.countyRestrictionsAdvice = 'Check your county website for local restrictions';
    if(this.dataset.countyRestrictionsAdvice) {
      this.countyRestrictionsAdvice = this.dataset.countyRestrictionsAdvice;
    }
    this.industryGuidanceLinkText = 'View industry guidance';
    if(this.dataset.industryGuidance) {
      this.industryGuidanceLinkText = this.dataset.industryGuidance;
    }
    this.viewall = 'View all';
    if(this.dataset.viewAll) {
      this.viewall = this.dataset.viewAll;
    }
    this.state = {};

    this.innerHTML = templatize(title, countyLabel, countyPlaceholder, activityLabel, activityPlaceholder);
    let theMatrix = document.querySelector('.the-matrix');
    if(theMatrix) {
      this.querySelector('.matrix-holder').innerHTML = theMatrix.innerHTML;
    }

    window.fetch('/countystatus.json')
    .then(response => response.json())
    .then(function(data) {
      this.countyStatuses = data;
      let aList = [];
      this.countyStatuses.forEach(c => { aList.push(c.county) })
      this.setupAutoComp('#location-query', 'county', aList);
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
      aList.push(this.viewall);
      data.Table1.forEach(item => {
        aList.push(item['0'])
      })
      this.setupAutoCompActivity('#activity-query', 'activity', aList)
      document.querySelector('.reopening-tableau-embed').innerHTML = `<div class='tableauPlaceholder' id='viz1598633253507' style='position: relative'><noscript><a href='#'><img alt=' ' src='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;Pl&#47;Planforreducingcovid-19&#47;planforreducingcovid-19&#47;1_rss.png' style='border: none' /></a></noscript><object class='tableauViz'  style='display:none;'><param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' /> <param name='embed_code_version' value='3' /> <param name='site_root' value='' /><param name='name' value='Planforreducingcovid-19&#47;planforreducingcovid-19' /><param name='tabs' value='no' /><param name='toolbar' value='no' /><param name='static_image' value='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;Pl&#47;Planforreducingcovid-19&#47;planforreducingcovid-19&#47;1.png' /> <param name='animate_transition' value='yes' /><param name='display_static_image' value='yes' /><param name='display_spinner' value='yes' /><param name='display_overlay' value='yes' /><param name='display_count' value='yes' /><param name='language' value='en' /></object></div>`;
      this.tableauStuff()
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
        component.layoutCards();
      },
      list: aList
    };
    

    const aplete = new Awesomplete(fieldSelector, awesompleteSettings)
  }

  tableauStuff() {
    var divElement = document.getElementById('viz1598633253507');
    var vizElement = divElement.getElementsByTagName('object')[0];
    if ( divElement.offsetWidth > 800 ) { vizElement.style.width='700px';vizElement.style.height='547px';} else if ( divElement.offsetWidth > 500 ) { vizElement.style.width='700px';vizElement.style.height='547px';} else { vizElement.style.width='100%';vizElement.style.height='627px';}
    var scriptElement = document.createElement('script');
    scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
    vizElement.parentNode.insertBefore(scriptElement, vizElement);
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
        document.querySelector(fieldSelector).blur();
      },
      list: aList
    };

    window.aplete2 = new Awesomplete(fieldSelector, awesompleteSettings);
    document.querySelector(fieldSelector).addEventListener('focus', function() {
      this.value = '';
      window.aplete2.evaluate();
    })
  }

  layoutCards() {
    let replaceAllInMap = function(str){
      let mapObj = {
        '&lt;': '<',
        '&gt;': '>',
        '’': '"',
        '”': '"'
      }
      var re = new RegExp(Object.keys(mapObj).join("|"),"gi");
      return str.replace(re, function(matched){
        return mapObj[matched.toLowerCase()];
      });
    }
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
        <div class="pill">${this.statusdesc.Table1[parseInt(item['Overall Status']) - 1]['County tier']}</div>
        <p>${this.statusdesc.Table1[parseInt(item['Overall Status']) - 1].description} <a href="#reopening-data">Understand the data.</a></p>
        <p>${this.countyRestrictionsAdvice}</p>
      </div>`
      if(this.state['activity']) {
        selectedActivities = [];
        this.allActivities.forEach(ac => {
          if(ac["0"] == this.state['activity'] || this.state['activity'] == this.viewall) {
            selectedActivities.push(ac);
          }
        })
      }
      selectedActivities.forEach(ac => {
        this.cardHTML += `<div class="card-activity">
          <h4>${ac["0"]}</h4>
          <p>${ac[item['Overall Status']]}</p>
          <p>${ac["5"].indexOf('href') > -1 ? `${this.seeGuidanceText} ${replaceAllInMap(ac["5"])}` : ""}</p>
        </div>`
      })
    })
    // These classes are used but created with variables so the purge cannot find them, they are carefully placed here where they will be noticed
    this.cardHTML += `<div style="display:none">
      <div class="county-color-1 county-color-2 county-color-3 county-color-4"></div>
    </div>`
    this.querySelector('.card-holder').innerHTML = `<div class="card-content">${this.cardHTML}</div>`;
    this.querySelector('.card-holder').classList.remove('inactive');

    // Dispatch custom event so we can pick up and track this usage elsewhere.
    const event = new window.CustomEvent('safer-economy-page-submission', {
      detail: {
        county: this.state.county,
        activity: this.state.activity
      }
    });
    window.dispatchEvent(event);
  }
}
window.customElements.define('cagov-reopening', CAGovReopening);
