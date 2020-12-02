import template from "./template.js";
import drawBars from "./draw-chart.js";
import termCheck from "../race-ethnicity-config.js";
import getTranslations from "../../get-strings-list.js";
import getScreenResizeCharts from "./../../get-window-size.js";

class CAGOVEquityRE100K extends window.HTMLElement {
  connectedCallback() {
    // Settings and initial values
    this.chartOptions = {
      // Data
      subgroups: ["METRIC_VALUE_PER_100K", "WORST_VALUE_DELTA"],
      // subgroups1: ["METRIC_TOTAL_PERCENTAGE", "METRIC_TOTAL_DELTA"],
      // subgroups2: ["POPULATION_PERCENTAGE", "POPULATION_PERCENTAGE_DELTA"],
      dataUrl:
        config.equityChartsDataLoc + "/equitydash/cumulative-california.json", // Overwritten by county.
      dataStatewideRateUrl:
        config.equityChartsDataLoc + "/equitydash/cumulative-combined.json", // Overwritten by county?
      state: "California",
      county: "California",
      // Style
      chartColors: ["#FFCF44", "#F2F5FC"], // ["#92C5DE", "#FFCF44", "#F2F5FC"],
      selectedMetric: "cases",
      selectedMetricDescription: "Cases",
      // Breakpoints
      desktop: {
        height: 642,
        width: 450,
        margin: {
          top: 20,
          right: 30,
          bottom: 20,
          left: 10,
        },
      },
      tablet: {
        height: 642,
        width: 450,
        margin: {
          top: 20,
          right: 30,
          bottom: 20,
          left: 10,
        },
      },
      mobile: {
        height: 642,
        width: 450,
        margin: {
          top: 20,
          right: 30,
          bottom: 20,
          left: 10,
        },
      },
      retina: {
        height: 642,
        width: 450,
        margin: {
          top: 20,
          right: 30,
          bottom: 20,
          left: 10,
        },
      },
    };

    // Resizing
    getScreenResizeCharts(this);
    this.screenDisplayType = window.charts
      ? window.charts.displayType
      : "desktop";
    this.chartBreakpointValues = this.chartOptions[
      this.screenDisplayType ? this.screenDisplayType : "desktop"
    ];

    // Choose settings for current screen display.
    // Display content & layout dimensions
    const handleChartResize = () => {
      getScreenResizeCharts(this);
      this.screenDisplayType = window.charts
        ? window.charts.displayType
        : "desktop";
      this.chartBreakpointValues = this.chartOptions[
        this.screenDisplayType ? this.screenDisplayType : "desktop"
      ];
    };

    // @TODO connect a debouncer
    window.addEventListener("resize", handleChartResize);

    // this.dimensions = {
    //   height: 642,
    //   width: 450,
    //   margin: {
    //     top: 20,
    //     right: 30,
    //     bottom: 20,
    //     left: 10,
    //   },
    // };

    this.dimensions = this.chartBreakpointValues;

    this.translationsObj = getTranslations(this);
    this.selectedMetric = "cases";
    this.selectedMetricDescription = "Cases";
    this.county = "California";
    this.drawBars = drawBars;
    this.chartTitle = function () {
      let isStatewide = this.county === "California";
      // console.log("Getting chart title 100k metric=", this.selectedMetric);
      return this.translationsObj["chartTitle--" + this.selectedMetric].replace(
        "placeholderForDynamicLocation",
        isStatewide ? this.county : this.county + " County "
      );
    };
    this.description = function (selectedMetricDescription) {
      return this.translationsObj["chartDescription--" + this.selectedMetric];
    };
    this.legendString = function () {
      return this.translationsObj["chartLegend" + "--" + this.selectedMetric];
    };
    this.filterString = function (statewideRatePer100k) {
      let isStatewide = this.county === "California";
      let key =
        "chartFilterLegendPfx" +
        (isStatewide ? "State" : "County") +
        "--" +
        this.selectedMetric;
      let filterTxt =
        this.translationsObj[key] + parseFloat(statewideRatePer100k).toFixed(1);
      // console.log("Filter key",key);
      // console.log("Filter text",filterTxt);
      filterTxt = filterTxt.replace(
        "placeholderForDynamicLocation",
        isStatewide ? this.county : this.county + " County "
      );
      return filterTxt;
    };

    this.toolTipCaption = function (a, b, c) {
      let templateStr = this.translationsObj["chartToolTip-caption"];
      let caption = templateStr
        .replace("placeholderDEMO_CAT", a)
        .replace("placeholderMETRIC_100K", b)
        .replace("placeholderFilterScope", c);
      return caption;
    };
    // `Statewide ${filterScope.toLowerCase()} per 100K: ${parseFloat(statewideRatePer100k).toFixed(1)}`

    this.innerHTML = template(
      this.chartTitle(),
      this.description(this.selectedMetricDescription)
    );

    this.classList.remove("d-none");

    this.tooltip = d3
      .select("cagov-chart-re-100k")
      .append("div")
      .attr("class", "tooltip-container tooltip-container--re100k")
      .text("an empty tooltip");

    this.svg = d3
      .select(this.querySelector(".svg-holder"))
      .append("svg")
      .attr("viewBox", [0, 0, this.dimensions.width, this.dimensions.height])
      .append("g")
      .attr(
        "transform",
        "translate(" +
          this.dimensions.margin.left +
          "," +
          this.dimensions.margin.top +
          ")"
      );

    // @TODO Connect to chartOptions
    this.subgroups = ["METRIC_VALUE_PER_100K", "WORST_VALUE_DELTA"];
    this.color = d3
      .scaleOrdinal()
      .domain(this.subgroups)
      .range(["#FFCF44", "#F2F5FC"]);

    this.dataUrl =
      config.equityChartsDataLoc + "/equitydash/cumulative-california.json";
    this.dataStatewideRateUrl =
      config.equityChartsDataLoc + "/equitydash/cumulative-combined.json";

    this.retrieveData(this.dataUrl, this.dataStatewideRateUrl);
    this.listenForLocations();
    this.county = "California";
    this.resetTitle();
  }

  listenForLocations() {
    let searchElement = document.querySelector("cagov-county-search");
    searchElement.addEventListener(
      "county-selected",
      function (e) {
        this.county = e.detail.county;
        if (this.selectedMetric === "deaths") {
          this.selectedMetric = "cases";
        }
        this.dataUrl =
          config.equityChartsDataLoc +
          "/equitydash/cumulative-" +
          this.county.toLowerCase().replace(/ /g, "") +
          ".json";
        this.retrieveData(this.dataUrl, this.dataStatewideRateUrl);
        this.resetTitle(this.county);
      }.bind(this),
      false
    );

    let metricFilter = document.querySelector(
      "cagov-chart-filter-buttons.js-re-smalls"
    );
    metricFilter.addEventListener(
      "filter-selected",
      function (e) {
        this.selectedMetricDescription = e.detail.clickedFilterText;
        this.selectedMetric = e.detail.filterKey;
        this.retrieveData(this.dataUrl, this.dataStatewideRateUrl);
        this.resetDescription();
        this.resetTitle();
      }.bind(this),
      false
    );
  }

  resetTitle() {
    this.querySelector(".chart-title").innerHTML = this.chartTitle();
  }

  resetDescription() {
    this.querySelector(".chart-description").innerHTML = this.description(
      this.selectedMetricDescription
    );
  }

  getMissingDataBox(appliedSuppressionType) {
    console.log("this", this);
    let type = "appliedSuppressionTotal"; // @TODO connect to logic

    // let messagesByType = {
    //   appliedSuppressionNone: null,
    //   appliedSuppressionTotal: this.translationsObj["applied-suppression-total"],
    //   appliedSuppressionPopulation: this.translationsObj["applied-suppression-population"],
    // };

    // let message = messagesByType[type];
    // if (message !== null) {

    // // Break message into individual lines, split lines out by br tag
    // let missingTextLines = message.split(
    //   this.translationsObj["missing-data-caption-line-delimiter"]
    // );

    // let messageBox = (g) =>
    // g
    //   // .append("text")
    //   .attr("class", "informative-box")
    //   .call((g) =>
    //     g
    //       .append("rect")
    //       .attr("x", 0)
    //       .attr("y", 0)
    //       .attr("width", this.chartBreakpointValues.width)
    //       .attr("height", this.chartBreakpointValues.height)
    //       .attr("fill", "white")
    //       .attr("stroke", "none")
    //       .attr("opacity", "0.1")
    //   )
    //   .call((g) =>
    //     g
    //       .append("rect")
    //       .attr("class", "shadow")
    //       .attr("x", this.chartBreakpointValues.width * 0.25)
    //       .attr("y", this.chartBreakpointValues.height * 0.3)
    //       .attr("width", this.chartBreakpointValues.width * 0.5)
    //       .attr("height", this.chartBreakpointValues.height * 0.3)
    //       .attr("fill", "white")
    //       .attr("stroke", "currentColor")
    //       .attr("stroke-width", "2")
    //   )

    //   .each(function (d) {
    //     let gg = this;
    //     missingTextLines.forEach(function (textLine, yIdx) {
    //       d3.select(gg)
    //         .append("text")
    //         // .attr(
    //         //   "transform",
    //         //   "translate(" +
    //         //     component.dims.width / 2 +
    //         //     " ," +
    //         //     (component.dims.height * 0.39 + yIdx * 5) +
    //         //     ")"
    //         // )

    //         .attr(
    //           "transform",
    //           "translate(" +
    //             613 / 2 +
    //             " ," +
    //             (500 * 0.39 + yIdx * 5) +
    //             ")"
    //         )
    //         .style("text-anchor", "middle")
    //         .text(textLine);
    //     });
    //   });

    // let messageBox = ()
    // return messageBox;
    // return null;
    // }
    return null;
  }

  // Data samples:
  /*
None type suppression:
COUNTY": "San Diego",
"DEMOGRAPHIC_SET": "race_ethnicity",
"DEMOGRAPHIC_SET_CATEGORY": "Latino",
"METRIC": "deaths",
"METRIC_VALUE": 49, // This is.... ?
"METRIC_VALUE_PER_100K": 4.433715055087, // This is.... ?
"APPLIED_SUPPRESSION": "None",
"POPULATION_PERCENTAGE": 32.790235513815, // This is.... ?
"METRIC_TOTAL_PERCENTAGE": 51.041666666667,
"METRIC_VALUE_30_DAYS_AGO": 48,
"METRIC_VALUE_PER_100K_30_DAYS_AGO": 4.343231074371,
"METRIC_VALUE_PER_100K_DELTA_FROM_30_DAYS_AGO": 0.090483980716,
"METRIC_TOTAL_PERCENTAGE_30_DAYS_AGO": 54.545454545455,
"METRIC_VALUE_PERCENTAGE_DELTA_FROM_30_DAYS_AGO": -3.503787878788,
"SORT_METRIC": 1.5566117738057237,
"METRIC_TOTAL_DELTA": 48.958333333333,
"POPULATION_PERCENTAGE_DELTA": 67.20976448618501,
"WORST_VALUE": 4.433715055087,
"WORST_VALUE_DELTA": 0,
"LOWEST_VALUE": 1.9892500925,
"PCT_FROM_LOWEST_VALUE": 2.22883742562249


// Decision is to make order based on ratio of rates to % of population.
// Ratio is % of population divided by % of cases. The list will be ordered from lowest to highest (or vice versa)
d.POPULATION_PERCENTAGE / d.METRIC_TOTAL_PERCENTAGE
// This should disregard R&Es that have missing or null data.


  Total type suppression
"COUNTY": "Nevada",
"DEMOGRAPHIC_SET": "race_ethnicity",
"DEMOGRAPHIC_SET_CATEGORY": "African American",
"METRIC": "deaths",
"METRIC_VALUE": null,
"METRIC_VALUE_PER_100K": null,
"APPLIED_SUPPRESSION": "Total",
"POPULATION_PERCENTAGE": 1.718164319724,
"METRIC_TOTAL_PERCENTAGE": null,
"METRIC_VALUE_30_DAYS_AGO": null,
"METRIC_VALUE_PER_100K_30_DAYS_AGO": null,
"METRIC_VALUE_PER_100K_DELTA_FROM_30_DAYS_AGO": null,
"METRIC_TOTAL_PERCENTAGE_30_DAYS_AGO": null,
"METRIC_VALUE_PERCENTAGE_DELTA_FROM_30_DAYS_AGO": null,
"SORT_METRIC": 0,
"METRIC_TOTAL_DELTA": 100,
"POPULATION_PERCENTAGE_DELTA": 98.281835680276,
"WORST_VALUE": null,
"WORST_VALUE_DELTA": 0,
"LOWEST_VALUE": null,
"PCT_FROM_LOWEST_VALUE": null




"SORT_METRIC": 1.5566117738057237,
"METRIC_TOTAL_DELTA": 48.958333333333,
"POPULATION_PERCENTAGE_DELTA": 67.20976448618501,
"WORST_VALUE": 4.433715055087,
"WORST_VALUE_DELTA": 0,
"LOWEST_VALUE": 1.9892500925,
"PCT_FROM_LOWEST_VALUE": 2.22883742562249

perc_diff_rate_per_100k_30_Prev	% change between rate_per_100k and rate_per_100k_30_day_previous



// Definitions
COUNTY	County of counts/rates.  "California" value for statewide (race/ethnicity demog_cat only currently)
DEMOGRAPHIC_SET	Demographic category associated with counts/rates.  Race/ethnicity, age group, or gender
DEMOGRAPHIC_SET_CATEGORY	Value for demographic category, dependent on demog_cat value
METRIC	Type of count/rate.  Deaths, cases, or tests
METRIC_VALUE	Total over the previous 30 days
METRIC_VALUE_PER_100K	Rate per 100,000 persons, based on total and associated demographic population for a given county
APPLIED_SUPPRESSION	Indicates if the numeric values (counts/rates) are missing due to suppression, and what type.
POPULATION_PERCENTAGE	Percent of population for a given demographic in specified region
POPULATION_PERCENTAGE_DELTA Difference from POPULATION_PERCENTAGE
METRIC_TOTAL_PERCENTAGE	Percent of total cases, deaths, or tests for a specified region
METRIC_TOTAL_DELTA	Difference from METRIC_TOTAL_PERCENTAGE
METRIC_VALUE_30_DAYS_AGO  Total over previous 30 day period (31-60 days from present)
METRIC_VALUE_PER_100K_30_DAYS_AGO   Rate per 100,000 persons, for previous 30 day period
METRIC_VALUE_PER_100K_DELTA_FROM_30_DAYS_AGO  Raw difference between rate_per_100k and rate_per_100k_30_day_previous
METRIC_TOTAL_PERCENTAGE_30_DAYS_AGO	Percent of total cases, deaths, or tests for a specified region, over previous 30 day period (31-60 days)
METRIC_VALUE_PER_100K_DELTA_FROM_30_DAYS_AGO  Raw difference between per_total and perc_total_30_day_prev
METRIC_VALUE_PERCENTAGE_DELTA_FROM_30_DAYS_AGO	% change between perc_total and perc_total_30_day_prev

"SORT_METRIC": 1.5566117738057237,
"WORST_VALUE": 4.433715055087,
"WORST_VALUE_DELTA": 0,
"LOWEST_VALUE": 1.9892500925,
"PCT_FROM_LOWEST_VALUE": 2.22883742562249

perc_diff_rate_per_100k_30_Prev	% change between rate_per_100k and rate_per_100k_30_day_previous




  */

    // Formula notes.

    // OPEN QUESTION: Tooltip... could it use this value & what would the label be?

    // Decision is to make order based on ratio of rates to % of population.

    // Ratio is % of population divided by % of cases. The list will be ordered from lowest to highest (or vice versa)
    // Correc: Ratio is % of (KNOWN) population divided by % of cases. The list will be ordered from lowest to highest (or vice versa)

    /*
    It looks like this chart is sorting by % of cases/deaths/testing. 
    
    The intention was to sort by the ratio of % of cases to % of population so that the most disproportionaly impacted R&Es appeared at the top of the list. 
    
    This is one of the primary reasons that we dynmacially sort the chart 
    (the only way to visualize this was through order of list). 
    
    This is also reflected in the Figma design that we showed to stakeholders. 
    
    To make this more clear, we had also discussed showing the ratio as a metric in the tooltip but were unable to come up with a good label for it (the best we came up with was "disproportionality ratio"). 
    
    I realize this is not a perfect solution but I don't want to lose sight of the purpose of this chart which is to show disproportionate impact, not highest rates. 
    
    ...
    
    There's a little nuance to the METRIC_TOTAL_PERCENTAGE
    It's % total among known race/ethnicity for non-unknown ones, 
    and then % total for all cases/deaths/tests for the unknown category. 
    
    We did that to better align with the population references

    % of non unknown.
    --- EXAMPLE ---
    820 cases per 100k NHPI
    0.6% of state population
    0.3% of cases

    Ratio:
    Total of KNOWN cases = 
    Total Percentage Cases [Latino, White, Asian American, Black, Multi-Race, NHPI, AI/AN] - should equal 100 - Unknown cases %, Other cases %
    (statewide example)
    
    % of state population
    Latino 49.9%
    White 24.1%
    Asian American 6.4%
    Black 3.9%
    Multi-Race 1.4%
    NHPI 0.6%
    AI/AN 0.4%

    Total percentage = Cases / (Total cases - Unknown/Other cases) 
    
    100% - (28.8 + 13.4) = 57.8

    0.6% / 57.8 = 0.01038062283737 NHPI
    49.9% / 57.8 = 0.863321799307958  LATINO

    @TODO - (understand) 
    The last part is that we know that Latinos are 86.3% of total known r/e cases, 
    but 38.9% of the state population, so then do the ratio of those two quantites

    I think that ratio shows how disparate the cases/deaths/tests are.  
    If it's %total known cases / % pop, then the higher the more disparate, so higher on the sort
    */
   
    /*
     [1,2,3].reduce(function(acc, val) { return acc + val; }, 0)
    */
   
   getSortRatio(d, data) {
    // data is all data without Other or Unknown values.
    let notKnownData = this.alldata.filter(
      (item) =>
        item.METRIC === this.selectedMetric &&
        (item.DEMOGRAPHIC_SET_CATEGORY === "Other" ||
        item.DEMOGRAPHIC_SET_CATEGORY === "Unknown")
    );

    let type = d.METRIC;

    // Add up the totals for the demographic sets (i.e. not "Unknown" or "Other")
    let totalPercentage = data.map((d) => {
      // Check if total percentage isn't null, if it is, return zero
      return d.METRIC_TOTAL_PERCENTAGE !== null ? d.METRIC_TOTAL_PERCENTAGE : 0
      })
      .reduce(function(acc, val) { return acc + val; }, 0);
  
    let totalNotKnownPercentage = notKnownData.map((d) => {
      // Check if total percentage isn't null, if it is, return zero
      return d.METRIC_TOTAL_PERCENTAGE !== null ? d.METRIC_TOTAL_PERCENTAGE : 0;
    })
      .reduce(function(acc, val) { return acc + val; }, 0);

    // @TODO Check isNan or Infinity.
    // @TODO And Math.round or decimal point fixing for display.
    let totalKnownPercentage = 100 - totalNotKnownPercentage;

    // console.log('totalPercentage', totalPercentage);
    // console.log('totalKnownPercentage', totalKnownPercentage);
    // console.log('notKnownData', totalNotKnownPercentage, notKnownData );

    // if (type === 'Cases') {

    // } else {
      
    // }

    
    // Dataset conditional

    let ratio = null;
    if (d.POPULATION_PERCENTAGE !== null && 
        d.METRIC_TOTAL_PERCENTAGE) {

      // ratio = d.POPULATION_PERCENTAGE / d.METRIC_TOTAL_PERCENTAGE;
      
      // Total percentage = Cases / (Total cases - Unknown/Other cases) * 100

      // ratio = d.POPULATION_PERCENTAGE / totalNotKnownPercentage;
      // if (d.DEMOGRAPHIC_SET_CATEGORY === 'Unknown' || 
      //     d.DEMOGRAPHIC_SET_CATEGORY === 'Other') {
      //   ratio = d.POPULATION_PERCENTAGE / totalPercentage;
      // } else {
        ratio = d.POPULATION_PERCENTAGE / totalKnownPercentage;
      // }
      // @TODO Check isNan
      // @TODO Check Infinity

      console.log(
        "DISPROPORTIONALITY_RATIO:",
        ratio,
        d.DEMOGRAPHIC_SET_CATEGORY
      );
    }
    return ratio;
  };

  render() {
    // NOTE subgroups: "METRIC_VALUE_PER_100K", "WORST_VALUE_DELTA"

    // Exclude Other & Unknown categories from displaying for this chart.
    let data = this.alldata.filter(
      (item) =>
        item.METRIC === this.selectedMetric &&
        item.DEMOGRAPHIC_SET_CATEGORY !== "Other" &&
        item.DEMOGRAPHIC_SET_CATEGORY !== "Unknown"
    );

    // Update term display strings
    let displayDemoMap = termCheck();

    // Format data
    data.forEach((d) => {
      // Set default value of 0 for per 100k change.
      d.METRIC_VALUE_PER_100K_CHANGE_30_DAYS_AGO = 0;

      // If value found for metric rate 30 days ago
      if (d.METRIC_VALUE_PER_100K_30_DAYS_AGO) {
        // Create new value that calculates the difference of change.
        d.METRIC_VALUE_PER_100K_CHANGE_30_DAYS_AGO =
          d.METRIC_VALUE_PER_100K_DELTA_FROM_30_DAYS_AGO /
          d.METRIC_VALUE_PER_100K_30_DAYS_AGO;
      }

      // Run the sort ratio calculating logic. 
      // If not valid, will return null.
      d.DISPROPORTIONALITY_RATIO = this.getSortRatio(d, data);

      // Map the race/ethnicities in the db to the desired display values here.
      if (displayDemoMap.get(d.DEMOGRAPHIC_SET_CATEGORY)) {
        d.DEMOGRAPHIC_SET_CATEGORY = displayDemoMap.get(
          d.DEMOGRAPHIC_SET_CATEGORY
        );
      }
    });

    let sortableData = data.filter((d) => d.DISPROPORTIONALITY_RATIO !== null);
    let nullSortData = data.filter((d) => d.DISPROPORTIONALITY_RATIO === null);

    // Sort data with non-null 'disproportionality ratio' 
    sortableData.sort(function (a, b) {
      
      // DISPROPORTIONALITY_RATIO: 0.005854295416384384 Native Hawaiian and other Pacific Islander
      // DISPROPORTIONALITY_RATIO: 0.008893787657945705 American Indian
      // DISPROPORTIONALITY_RATIO: 0.03824773843841755 Multi-Race
      // DISPROPORTIONALITY_RATIO: 0.10325008270638272 Black
      // DISPROPORTIONALITY_RATIO: 0.26699018039115974 Asian American
      // DISPROPORTIONALITY_RATIO: 0.6337516235173645 White
      // DISPROPORTIONALITY_RATIO: 0.6739747623204189 Latino
      
      return d3.ascending(a.DISPROPORTIONALITY_RATIO, b.DISPROPORTIONALITY_RATIO);
    });

    // Push null data values to the end or the sorted array (@TODO double check order)
    // Remap data object
    data = sortableData.concat(nullSortData); 
    
    // ordering this array by the order they are in in data
    // need to inherit this as a mapping of all possible values to desired display values becuase these differ in some tables

    // Get list of groups (?)
    let groups = data.map((item) => item.DEMOGRAPHIC_SET_CATEGORY);

    // Keys of data to use in chart.
    let stackedData = d3.stack().keys(this.subgroups)(data);

    // Y position of bars.
    this.y = d3
      .scaleBand()
      .domain(groups)
      .range([
        this.dimensions.margin.top,
        this.dimensions.height - this.dimensions.margin.bottom,
      ])
      .padding([0.6]);

    // Position for labels.
    this.yAxis = (g) =>
      g
        .attr("class", "bar-label")
        .attr("transform", "translate(5," + -32 + ")")
        .call(d3.axisLeft(this.y).tickSize(0))
        .call((g) => g.selectAll(".domain").remove());

    // Calculate x margin (?)
    this.x = d3
      .scaleLinear()
      .domain([0, d3.max(stackedData, (d) => d3.max(d, (d) => d[1]))])
      .range([0, this.dimensions.width - this.dimensions.margin.right - 50]);

    // ?
    this.xAxis = (g) =>
      g
        .attr("transform", "translate(0," + this.dimensions.width + ")")
        .call(d3.axisBottom(this.x).ticks(width / 50, "s"))
        .remove();
    
    // Is this for the line (is this the number value or the label?)
    let statewideRatePer100k = this.combinedData[this.selectedMetric]
      ? this.combinedData[this.selectedMetric].METRIC_VALUE_PER_100K
      : null;
    
    // Render the chart
    this.drawBars(stackedData, data, statewideRatePer100k);
  }

  retrieveData(url, statewideUrl) {
    Promise.all([window.fetch(url), window.fetch(statewideUrl)])
      .then(function (responses) {
        return Promise.all(
          responses.map(function (response) {
            return response.json();
          })
        );
      })
      .then(
        function (requestData) {
          this.alldata = requestData[0];
          this.combinedData = requestData[1];
          this.render();
        }.bind(this)
      );
  }
}
window.customElements.define("cagov-chart-re-100k", CAGOVEquityRE100K);
