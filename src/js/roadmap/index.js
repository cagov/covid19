import Awesomplete from 'awesomplete-es6';
import templatize from './template.js';

class CAGovReopening extends window.HTMLElement {
  connectedCallback () {
    this.json = JSON.parse(this.dataset.json);
    this.state = {};

    this.innerHTML = templatize(this.json);
    let theMatrix = document.querySelector('.the-matrix');
    if(theMatrix) {
      document.querySelector('.matrix-holder').innerHTML = theMatrix.innerHTML;
    }

    window.fetch('/countystatus.json')
    .then(response => response.json())
    .then(function(data) {
      this.countyStatuses = data;
      let aList = [];
      this.countyStatuses.forEach(c => { aList.push(c.county) })
      this.setupAutoComp('#location-query', 'county', aList);
    }.bind(this));

    window.fetch('/countyregions.json')
    .then(response => response.json())
    .then(function(data) {
      this.countyRegions = data;
    }.bind(this));

    window.fetch('/regionsclosed.json')
    .then(response => response.json())
    .then(function(data) {
      this.regionsclosed = data;
    }.bind(this));

    window.fetch('/statusdescriptors.json')
    .then(response => response.json())
    .then(function(data) {
      this.statusdesc = data;
    }.bind(this));

    window.fetch('/schools-may-reopen.json')
    .then(response => response.json())
    .then(function(data) {
      this.schoolOKList = data;
    }.bind(this));

    window.fetch('/reopening-activities.json')
    .then(response => response.json())
    .then(function(data) {
      this.allActivities = data.Table1;
      let aList = []
      // aList.push(this.viewall);
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

    document.getElementById("location-query").addEventListener("input", function (event) {
      this.changeLocationInput(event.target.value);
    }.bind(this));

    document.getElementById("clearLocation").addEventListener("click", function() {
      this.changeLocationInput("");
    }.bind(this));

    document.getElementById("activity-query").addEventListener("input", function (event) {
      this.changeActivityInput(event.target.value);
    }.bind(this));

    document.getElementById("clearActivity").addEventListener("click", function() {
      this.changeActivityInput("");
    }.bind(this));

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
        document.getElementById("reopening-error").style.visibility = "visible";
      } else {
        this.layoutCards();
      }
    }.bind(this))
  }

  changeLocationInput(value) {
    const $locationQuery = document.getElementById("location-query");
    $locationQuery.value = value;
    $locationQuery.setAttribute("aria-invalid", false);
    this.state['county'] = value;
    if (value) {
      document.getElementById("clearLocation").classList.remove('d-none');
    } else {
      document.getElementById("clearLocation").classList.add('d-none');
    }
    document.getElementById("location-error").style.visibility = "hidden";
    document.getElementById("reopening-error").style.visibility = "hidden";
  }

  changeActivityInput(value) {
    const $activityQuery = document.getElementById("activity-query");
    $activityQuery.value = value;
    $activityQuery.setAttribute("aria-invalid", false);
    this.state['activity'] = value;
    if (value) {
      document.getElementById("clearActivity").classList.remove('d-none');
    } else {
      document.getElementById("clearActivity").classList.add('d-none');
    }
    document.getElementById("activity-error").style.visibility = "hidden";
    document.getElementById("reopening-error").style.visibility = "hidden";
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
        component.changeLocationInput(finalval);
        // component.layoutCards();
      },
      list: aList
    };


    const aplete = new Awesomplete(fieldSelector, awesompleteSettings)
  }

  tableauStuff() {
    var divElement = document.getElementById('viz1598633253507');
    var vizElement = divElement.getElementsByTagName('object')[0];
    if ( divElement.offsetWidth > 921 ) { vizElement.style.width='920px';vizElement.style.height='547px';} 
    else if ( (divElement.offsetWidth > 910) && (divElement.offsetWidth < 920)) { vizElement.style.width='900px';vizElement.style.height='547px';} 
    else if ( (divElement.offsetWidth > 700) && (divElement.offsetWidth < 899) ) { vizElement.style.width='700px';vizElement.style.height='547px';} 
    else { vizElement.style.width='100%';vizElement.style.height='627px';}
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
        component.changeActivityInput(finalval);
        // component.layoutCards();
        // document.querySelector(fieldSelector).blur();
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
    // Dispatch custom event so we can pick up and track this usage elsewhere.
    const event = new window.CustomEvent('safer-economy-page-submission', {
      detail: {
        county: this.state.county,
        activity: this.state.activity
      }
    });
    window.dispatchEvent(event);

    let isError = false;

    let selectedCounties = this.countyStatuses;
    if(this.state['county']) {
      selectedCounties = [];
      this.countyStatuses.forEach(item => {
        if(item.county == this.state['county']) {
          selectedCounties.push(item)
        }
      })
      if (selectedCounties.length === 0) {
        document.getElementById("location-query").setAttribute("aria-invalid", true);
        document.getElementById("location-error").style.visibility = "visible";
        isError = true;
      }
    }
    
    let selectedActivities = this.allActivities;
    if(this.state['activity']) {
      selectedActivities = [];
      this.allActivities.forEach(ac => {
        if(ac["0"] == this.state['activity'] || this.state['activity'] == this.viewall) {
          selectedActivities.push(ac);
        }
      })
      if (selectedActivities.length === 0) {
        document.getElementById("activity-query").setAttribute("aria-invalid", true);
        document.getElementById("activity-error").style.visibility = "visible";
        isError = true;
      }
    }

    if (isError) {
      this.querySelector('.card-holder').innerHTML = '';
      return;
    }

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

    // if we are in one of these counties schools can reopen:
    const schoolOKList = this.schoolOKList;
    let schoolShenanigans = function(county) {
      const schoolFooter = `<p>See <a href="https://covid19.ca.gov/industry-guidance/#schools-guidance">schools guidance</a>, <a href="https://www.cdph.ca.gov/Programs/CID/DCDC/Pages/COVID-19/Schools-FAQ.aspx">schools FAQ</a>, and <a href="https://files.covid19.ca.gov/pdf/guidance-schools-cohort-FAQ.pdf">cohorting FAQs</a>.`;

      if(schoolOKList.indexOf(county) > -1) {
        return 'Schools may reopen fully for in-person instruction. Local school officials will decide whether and when that will occur.'
        + schoolFooter;
      }
      return /*html*/`Schools may not reopen fully for in-person instruction until the county has been in the Substantial (Red) Tier for two weeks. Local school and health officials <a href="https://www.cdph.ca.gov/Programs/CID/DCDC/Pages/COVID-19/In-Person-Elementary-Waiver-Process.aspx">may decide to open elementary schools</a>, and school officials <a href="https://www.cdph.ca.gov/Programs/CID/DCDC/Pages/COVID-19/Schools-FAQ.aspx">may decide to conduct in-person instruction</a> for a limited set of students in small cohorts.</p>
      <p>Note on exception: Schools that have already re-opened if the county was in a less restrictive tier do not have to close. However, if a school had not already reopened for in-person instruction, it may not reopen until the county moves back to the Substantial (Red) Tier for 14 days.</p>
      `
      + schoolFooter;
    }
    selectedCounties.forEach(item => {
      this.cardHTML += `<div class="card-county county-color-${item['Overall Status']}">
        <h2>${item.county}</h2>
        ${(this.countyRegions) ? '<h3>'+this.json.regionLabel+' '+this.countyRegions[item.county]+'</h3>' : ''}
        ${(this.regionsclosed && this.countyRegions && this.regionsclosed.Table1.filter(r => r.region === this.countyRegions[item.county]).length > 0) ? '<p>Under <a href="/stay-home-except-for-essential-needs/#regional-stay-home-order">Regional Stay Home Order</a></p>' : ''}
        <div class="pill">${this.statusdesc.Table1[parseInt(item['Overall Status']) - 1]['County tier']}</div>
        <p>${this.statusdesc.Table1[parseInt(item['Overall Status']) - 1].description}. <a href="#county-status">${this.json.understandTheData}</a></p>
        <p>${this.json.countyRestrictionsAdvice} <a href="../get-local-information">${this.json.countyRestrictionsCountyWebsite}</a>.</p>
      </div>`
      selectedActivities.forEach(ac => {
        if(this.regionsclosed && this.countyRegions && this.regionsclosed.Table1.filter(r => r.region === this.countyRegions[item.county]).length > 0) { // if this county is in a region which is closed we will show them the RSHO column values
          this.cardHTML += `<div class="card-activity">
            <h4>${ac["0"]}</h4>
            <p>${ac["0"] === "Schools" ? schoolShenanigans(item.county) : ac["6"]}</p>
            <p>${ac["0"] === "Schools" ? "" : ac["5"].indexOf('href') > -1 ? `${this.json.seeGuidanceText} ${replaceAllInMap(ac["5"])}` : ""}</p>
          </div>`
        } else {
          this.cardHTML += `<div class="card-activity">
            <h4>${ac["0"]}</h4>
            <p>${ac["0"] === "Schools" ? schoolShenanigans(item.county) : ac[item['Overall Status']]}</p>
            <p>${ac["0"] === "Schools" ? "" : ac["5"].indexOf('href') > -1 ? `${this.json.seeGuidanceText} ${replaceAllInMap(ac["5"])}` : ""}</p>
          </div>`
        }
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
