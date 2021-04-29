import "awesomplete";
// https://projects.verou.me/awesomplete/#download
import templatize from "./template.js";

class CAGovReopeningTierLevel extends window.HTMLElement {
  connectedCallback() {
    this.json = JSON.parse(this.dataset.json);
    this.countyTiers = JSON.parse(this.dataset.countyTiers);

    this.schoolsText = this.dataset.schools
      ? JSON.parse(this.dataset.schools)
      : {};

    this.state = {};

    this.innerHTML = templatize(this.json);
    let theMatrix = document.querySelector(".the-matrix");
    if (theMatrix) {
      document.querySelector(".matrix-holder").innerHTML = theMatrix.innerHTML;
    }

    let theMatrixDescriptions = document.querySelector(
      ".the-matrix-descriptions"
    );

    if (theMatrixDescriptions) {
      document.querySelector(".matrix-county-risk-levels").innerHTML =
        theMatrixDescriptions.innerHTML;
    }

    window
      .fetch("/countystatus.json")
      .then((response) => response.json())
      .then(
        function (data) {
          this.countyStatuses = data;
          let countyTierAutocompleteList = [];
          let countyAutocompleteList = [];

          if (this.countyTiers !== undefined) {
            this.countyTiers.forEach((c) => {
              countyTierAutocompleteList.push(c);
            });
          }

          this.countyStatuses.forEach((c) => {
            countyAutocompleteList.push(c.county);
          });

          this.setupAutoComplete(
            "#location-query",
            "county",
            countyTierAutocompleteList.concat(countyAutocompleteList)
          );
        }.bind(this)
      );

    window
      .fetch("/countyregions.json")
      .then((response) => response.json())
      .then(
        function (data) {
          this.countyRegions = data;
        }.bind(this)
      );

    window
      .fetch("/regionsclosed.json")
      .then((response) => response.json())
      .then(
        function (data) {
          this.regionsclosed = data;
        }.bind(this)
      );

    window
      .fetch("/statusdescriptors.json")
      .then((response) => response.json())
      .then(
        function (data) {
          this.statusdesc = data;
        }.bind(this)
      );

    window
      .fetch("/schools-may-reopen.json")
      .then((response) => response.json())
      .then(
        function (data) {
          this.schoolOKList = data;
        }.bind(this)
      );

    window
      .fetch("/reopening-activities.json")
      .then((response) => response.json())
      .then(
        function (data) {
          this.allActivities = data.Table1.map((item) => {
            // Remap data structure to the new data structure we want but did not switch over to yet. This will help when we need to coordinate that crossover (at which point, we can remove this code.)
            return {
              activity_search_autocomplete: item[0],
              "1 – Purple": item[4],
              "2 – Red": item[3],
              "3 – Orange": item[2],
              "4 – Yellow": item[1],
              "5 – RSHO": item[5],
              Guidance: item[6],
            };
          });

          let activityAutocompleteList = [];

          this.allActivities.forEach((item) => {
            activityAutocompleteList.push(item["activity_search_autocomplete"]);
          });

          this.setupAutoCompleteActivity(
            "#activity-query",
            "activity",
            activityAutocompleteList
          );

          document.querySelector(
            ".reopening-tableau-embed"
          ).innerHTML = `<div class='tableauPlaceholder' id='viz1598633253507' style='position: relative'><noscript><a href='#'><img alt=' ' src='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;Pl&#47;Planforreducingcovid-19&#47;planforreducingcovid-19&#47;1_rss.png' style='border: none' /></a></noscript><object class='tableauViz'  style='display:none;'><param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' /> <param name='embed_code_version' value='3' /> <param name='site_root' value='' /><param name='name' value='Planforreducingcovid-19&#47;planforreducingcovid-19' /><param name='tabs' value='no' /><param name='toolbar' value='no' /><param name='static_image' value='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;Pl&#47;Planforreducingcovid-19&#47;planforreducingcovid-19&#47;1.png' /> <param name='animate_transition' value='yes' /><param name='display_static_image' value='yes' /><param name='display_spinner' value='yes' /><param name='display_overlay' value='yes' /><param name='display_count' value='yes' /><param name='language' value='en' /></object></div>`;
          this.tableauStuff();
        }.bind(this)
      )
      .catch(() => {
        //resetForm();
      });

    document.getElementById("location-query").addEventListener(
      "input",
      function (event) {
        this.changeLocationInput(event.target.value);
      }.bind(this)
    );

    document.getElementById("clearLocation").addEventListener(
      "click",
      function () {
        this.changeLocationInput("");
      }.bind(this)
    );

    document.getElementById("activity-query").addEventListener(
      "input",
      function (event) {
        this.changeActivityInput(event.target.value);
      }.bind(this)
    );

    document.getElementById("clearActivity").addEventListener(
      "click",
      function () {
        this.changeActivityInput("");
      }.bind(this)
    );

    document.querySelector(".reopening-activities").addEventListener(
      "submit",
      function (event) {
        event.preventDefault();
        if (document.querySelector("#location-query").value == "") {
          this.state["county"] = null;
        }
        if (document.querySelector("#activity-query").value == "") {
          this.state["activity"] = null;
        }

        if (!this.state["activity"] && !this.state["county"]) {
          this.querySelector(".card-holder").innerHTML = "";
          document.getElementById("reopening-error").style.visibility =
            "visible";
        } else {
          this.layoutCards();
        }
      }.bind(this)
    );
  }

  changeLocationInput(value) {
    const $locationQuery = document.getElementById("location-query");
    $locationQuery.value = value;
    $locationQuery.setAttribute("aria-invalid", false);
    this.state["county"] = value;
    if (value) {
      document.getElementById("clearLocation").classList.remove("d-none");
    } else {
      document.getElementById("clearLocation").classList.add("d-none");
    }
    document.getElementById("location-error").style.visibility = "hidden";
    document.getElementById("reopening-error").style.visibility = "hidden";
  }

  changeActivityInput(value) {
    const $activityQuery = document.getElementById("activity-query");
    $activityQuery.value = value;
    $activityQuery.setAttribute("aria-invalid", false);
    this.state["activity"] = value;
    if (value) {
      document.getElementById("clearActivity").classList.remove("d-none");
    } else {
      document.getElementById("clearActivity").classList.add("d-none");
    }
    document.getElementById("activity-error").style.visibility = "hidden";
    document.getElementById("reopening-error").style.visibility = "hidden";
  }

  setupAutoComplete(fieldSelector, fieldName, countyAutocompleteList) {
    let component = this;
    const awesompleteSettings = {
      autoFirst: true,
      minChars: 0,
      maxItems: 20,
      filter: function (text, input) {
        return Awesomplete.FILTER_CONTAINS(text, input.match(/[^,]*$/)[0]);
      },
      item: function (text, input) {
        return Awesomplete.ITEM(text, input.match(/[^,]*$/)[0]);
      },
      data: function (item, input) {
        // console.log(item);
        if (item.value !== undefined) {
          return { label: item.label, value: item.id };
        } else {
          return item;
        }
      },
      replace: function (text) {
        let before = this.input.value.match(/^.+,\s*|/)[0];
        let finalval = before + text;
        component.changeLocationInput(finalval);
        // component.layoutCards();
      },
      sort: (a, b) => {
        return countyAutocompleteList.indexOf(a.label) <
          countyAutocompleteList.indexOf(b.label)
          ? -1
          : 1;
      },
      list: countyAutocompleteList,
    };

    const autocompleteCounty = new Awesomplete(
      fieldSelector,
      awesompleteSettings
    );
    document
    .querySelector('#awesomplete_list_1').setAttribute('aria-label', this.json.countyLabel);
   
    let addAutocompleteSectionSeparator = this.addAutocompleteSectionSeparator;
    let countyTiers = this.countyTiers;
    document
      .querySelector(fieldSelector)
      .addEventListener("focus", function () {
        // this.value = "";      
        window.autocompleteCounty.evaluate();
        addAutocompleteSectionSeparator("#awesomplete_list_1 li", countyTiers);
      });

    document.querySelector(fieldSelector).addEventListener("input", (event) => {
      const inputText = event.target.value;
      window.autocompleteCounty.evaluate();
      addAutocompleteSectionSeparator("#awesomplete_list_1 li", countyTiers);
    });

    window.autocompleteCounty = autocompleteCounty;
  }

  addAutocompleteSectionSeparator(selector, countyTiers, separatorClass = "separator") {
    let allListItems = document.querySelectorAll(selector);
    let countyTierList = countyTiers.map((tier) => tier.label);
    if (allListItems) {
      let reverseSortedList = Object.assign([], allListItems).reverse();
      let separated = false;
      reverseSortedList.map((item) => {
        item.classList.remove(separatorClass);

        if (!Array.prototype.includes) {
          Object.defineProperty(Array.prototype, "includes", {
            enumerable: false,
            value: function(obj) {
                var newArr = this.filter(function(el) {
                  return el == obj;
                });
                return newArr.length > 0;
              }
          });
        }

        if (countyTierList.includes(item.innerText) && separated === false) {
          if (item !== null && reverseSortedList.length > 1) {
            item.classList.add(separatorClass);
            separated = true;
          }
        }
        
      });
    }
  }

  setupAutoCompleteActivity(
    fieldSelector,
    fieldName,
    activityAutocompleteList
  ) {
    let component = this;
    const awesompleteSettings = {
      autoFirst: true,
      minChars: 0,
      maxItems: 20,
      sort: function (a, b) {
        if (
          a["activity_search_autocomplete"] < b["activity_search_autocomplete"]
        ) {
          return -1;
        }
        if (
          a["activity_search_autocomplete"] > b["activity_search_autocomplete"]
        ) {
          return 1;
        }
        return 0;
      },
      replace: function (text) {
        let before = this.input.value.match(/^.+,\s*|/)[0];
        let autocompleteValue = before + text;
        component.changeActivityInput(autocompleteValue);
        // component.state[fieldName] = autocompleteValue;
        // component.layoutCards();
        // document.querySelector(fieldSelector).blur();
      },
      list: activityAutocompleteList,
    };

    window.autocompleteActivity = new Awesomplete(
      fieldSelector,
      awesompleteSettings
    );
    document
      .querySelector(fieldSelector)
      .addEventListener("focus", function () {
        this.value = "";
        window.autocompleteActivity.evaluate();
      });
  }

  layoutCards() {
    let isError = false;

    let selectedCounties = this.countyStatuses;
    let selectedCountyTiers = [];

    if (this.state["county"]) {
      selectedCounties = [];
      this.countyStatuses.forEach((item) => {
        if (item.county == this.state["county"]) {
          selectedCounties.push(item);
        }
      });

      this.countyTiers.forEach((item) => {
        if (item.label == this.state["county"]) {
          selectedCountyTiers.push(item);
        }
      });

      if (selectedCounties.length === 0 && selectedCountyTiers === 0) {
        document
          .getElementById("location-query")
          .setAttribute("aria-invalid", true);
        document.getElementById("location-error").style.visibility = "visible";
        isError = true;
      }
    }

    let selectedActivities = this.allActivities;
    if (this.state["activity"]) {
      selectedActivities = [];
      this.allActivities.forEach((selectedActivity) => {
        // console.log("selectedActivity", selectedActivity);
        if (
          selectedActivity["activity_search_autocomplete"] ==
            this.state["activity"] ||
          this.state["activity"] == this.viewall
        ) {
          selectedActivities.push(selectedActivity);
        }
      });
      if (selectedActivities.length === 0) {
        document
          .getElementById("activity-query")
          .setAttribute("aria-invalid", true);
        document.getElementById("activity-error").style.visibility = "visible";
        isError = true;
      }
    }

    // Dispatch custom event so we can pick up and track this usage elsewhere.
    const event = new window.CustomEvent("safer-economy-page-submission", {
      detail: {
        county: selectedCounties[0] !== undefined && selectedCounties.length === 1 ? selectedCounties[0].county : null,
        activity: this.state["activity"],
        countyTier: selectedCountyTiers[0] !== undefined && selectedCountyTiers.length === 1 ? selectedCountyTiers[0].label : null,
      },
    });

    window.dispatchEvent(event);

    if (isError) {
      this.querySelector(".card-holder").innerHTML = "";
      return;
    }

    let replaceAllInMap = function (str) {
      let mapObj = {
        "&lt;": "<",
        "&gt;": ">",
        "’": '"',
        "”": '"',
      };
      var re = new RegExp(Object.keys(mapObj).join("|"), "gi");
      return str.replace(re, function (matched) {
        return mapObj[matched.toLowerCase()];
      });
    };
    this.cardHTML = "";

    // if we are in one of these counties schools can reopen:
    const schoolOKList = this.schoolOKList;
    const schoolStrings = this.schoolsText;
    let schoolShenanigans = function (county) {
      if (!schoolStrings.schools_may_reopen) {
        return "";
      }
      if (schoolOKList.indexOf(county) > -1) {
        return `<p>${schoolStrings.schools_may_reopen}</p> <p>${schoolStrings.schools_info}`;
      }
      return `<p>${schoolStrings.schools_may_not_reopen}</p> <p>${schoolStrings.schools_info}`;
    };

    selectedCounties.forEach((item) => {
      let tierStatusMap = {
        4: "1 - Purple",
        3: "2 – Red",
        2: "3 – Orange",
        1: "4 – Yellow",
      };

      let localTierStatus = tierStatusMap[item["Overall Status"]];

      this.cardHTML += `<div class="card-county">
        <h2>${item.county} County</h2>
        ${
          this.countyRegions
            ? "<h3>" +
              this.json.regionLabel +
              " " +
              this.countyRegions[item.county] +
              "</h3>"
            : ""
        }
        ${
          this.regionsclosed &&
          this.countyRegions &&
          this.regionsclosed.Table1.filter(
            (r) => r.region === this.countyRegions[item.county]
          ).length > 0
            ? '<p>Under <a href="/stay-home-except-for-essential-needs/#regional-stay-home-order">Regional Stay Home Order</a></p>'
            : ""
        }
        <div class="county-color-${item["Overall Status"]}">
        <div class="pill">${
          this.statusdesc.Table1[parseInt(item["Overall Status"]) - 1][
            "County tier"
          ]
        }</div>
        <p>${
          this.statusdesc.Table1[parseInt(item["Overall Status"]) - 1]
            .description
        }. <a href="#county-status">${this.json.understandTheData}</a></p>
        <p>${
          this.json.countyRestrictionsAdvice
        } <a href="../get-local-information">${
        this.json.countyRestrictionsCountyWebsite
      }</a>.</p>
        </div>
      </div>`;
      selectedActivities.forEach((selectedActivity) => {
        if (
          this.regionsclosed &&
          this.countyRegions &&
          this.regionsclosed.Table1.filter(
            (r) => r.region === this.countyRegions[item.county]
          ).length > 0
        ) {
          // if this county is in a region which is closed we will show them the RSHO column values
          this.cardHTML += `<div class="card-activity">
            <h4>${selectedActivity["activity_search_autocomplete"]}</h4>
            <p>${selectedActivity["Guidance"]}</p>
            <p>${
              selectedActivity["5 – RSHO"].indexOf("href") > -1
                ? `${this.json.seeGuidanceText} ${replaceAllInMap(
                    selectedActivity["5 – RSHO"]
                  )}`
                : ""
            }</p>
          </div>`;
        } else {
          this.cardHTML += `<div class="card-activity">
            <h4>${selectedActivity["activity_search_autocomplete"]}</h4>
            <p>${selectedActivity[localTierStatus]}</p>
            <p>${
              selectedActivity["5 – RSHO"].indexOf("href") > -1
                ? `${this.json.seeGuidanceText} ${replaceAllInMap(
                    selectedActivity["5 – RSHO"]
                  )}`
                : ""
            }</p>
            <span class="card-activity-separator"></span>
          </div>`;
        }
      });
    });

    selectedCountyTiers.forEach((selectedTierItem) => {
      this.cardHTML += `<div class="card-county">
        <h2>${selectedTierItem.label} Tier</h2>
        <div class="county-color-${Number(selectedTierItem.reverseValue)}">
        <div class="pill">${selectedTierItem.coverage}</div>
        <p>
          ${
            this.statusdesc.Table1[Number(selectedTierItem.reverseValue) - 1]
              .description
          }. <a href="#county-status">${this.json.understandTheData}</a></p>
        <p>${
          this.json.countyRestrictionsAdvice
        } <a href="../get-local-information">${
        this.json.countyRestrictionsCountyWebsite
      }</a>.</p>
        </div>
      </div>`;

      selectedActivities.forEach((selectedActivity) => {
        let tierActivity = "";
        for (let key in selectedActivity) {
          if (selectedActivity.hasOwnProperty(key)) {
            var value = selectedActivity[key];
            if (key.charAt(0) === selectedTierItem.id.charAt(0)) {
              tierActivity = value;
            }
          }
        }

        this.cardHTML += `<div class="card-activity">
            <h4>${selectedActivity["activity_search_autocomplete"]}</h4>
            <p>${tierActivity}</p>
            <p>${
              selectedActivity["5 – RSHO"].indexOf("href") > -1
                ? `${this.json.seeGuidanceText} ${replaceAllInMap(
                    selectedActivity["5 – RSHO"]
                  )}`
                : ""
            }</p>
            <span class="card-activity-separator"></span>
          </div>`;
      });
    });

    // These classes are used but created with variables so the purge cannot find them, they are carefully placed here where they will be noticed
    this.cardHTML += `<div style="display:none">
      <div class="county-color-1 county-color-2 county-color-3 county-color-4"></div>
    </div>`;
    this.querySelector(
      ".card-holder"
    ).innerHTML = `<div class="card-content">${this.cardHTML}</div>`;
    this.querySelector(".card-holder").classList.remove("inactive");
  }

  tableauStuff() {
    var divElement = document.getElementById("viz1598633253507");
    var vizElement = divElement.getElementsByTagName("object")[0];
    if (divElement.offsetWidth > 921) {
      vizElement.style.width = "920px";
      vizElement.style.height = "547px";
    } else if (divElement.offsetWidth > 910 && divElement.offsetWidth < 920) {
      vizElement.style.width = "900px";
      vizElement.style.height = "547px";
    } else if (divElement.offsetWidth > 700 && divElement.offsetWidth < 899) {
      vizElement.style.width = "700px";
      vizElement.style.height = "547px";
    } else {
      vizElement.style.width = "100%";
      vizElement.style.height = "627px";
    }
    var scriptElement = document.createElement("script");
    scriptElement.src = "https://public.tableau.com/javascripts/api/viz_v1.js";
    vizElement.parentNode.insertBefore(scriptElement, vizElement);
  }
}

window.customElements.define(
  "cagov-reopening",
  CAGovReopeningTierLevel
);
