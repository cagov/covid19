import template from "./template.js";
import drawBars from "./draw-chart.js";
import termCheck from "../race-ethnicity-config.js";
import getTranslations from "../../get-strings-list.js";
import getScreenResizeCharts from "./../../get-window-size.js";
import { chartOverlayBox, chartOverlayBoxClear } from "../../chart-overlay-box.js";
import rtlOverride from "./../../rtl-override.js";

class CAGOVEquityRE100K extends window.HTMLElement {
  connectedCallback() {
    // Settings and initial values
    this.chartOptions = {
      // Data
      subgroups: ["METRIC_VALUE_PER_100K", "WORST_VALUE_DELTA"],
      dataUrl:
        config.equityChartsDataLoc + "/equitydash/cumulative-california.json", // Overwritten by county.
      dataStatewideRateUrl:
        config.equityChartsDataLoc + "/equitydash/cumulative-combined.json", // Overwritten by county?
      state: "California",
      county: "California",
      // Style
      chartColors: ["#FFCF44", "#F2F5FC"],
      selectedMetric: "cases",
      selectedMetricDescription: "cases",
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
        height: 700,
        width: 320,
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

    this.dimensions = this.chartBreakpointValues;

    this.translationsObj = getTranslations(this);
    this.selectedMetric = "cases";
    this.selectedMetricDescription = "cases";
    this.county = "California";
    this.drawBars = drawBars;
    this.chartTitle = function () {
      let isStatewide = this.county === "California";
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
        (isStatewide ? "State" : "State") + // change right-most one to County after we fix it...
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
    this.subgroups = this.chartOptions.subgroups;
    this.color = d3
      .scaleOrdinal()
      .domain(this.subgroups)
      .range(this.chartOptions.chartColors);

    this.dataUrl = this.chartOptions.dataUrl;
    this.dataStatewideRateUrl = this.chartOptions.dataStatewideRateUrl;

    this.retrieveData(this.dataUrl, this.dataStatewideRateUrl);
    this.listenForLocations();
    this.county = this.chartOptions.state;
    this.resetTitle();
    rtlOverride(this);

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
        if (e.detail.filterKey != undefined) {
          // console.log("filter selected",e.detail.filterKey);
          this.selectedMetricDescription = e.detail.clickedFilterText.toLowerCase();
          let metricKey = "chartMetricName--" + e.detail.filterKey;
          if (metricKey in this.translationsObj) {
            this.selectedMetricDescription = this.translationsObj[metricKey];
          }
          this.selectedMetric = e.detail.filterKey;
          this.retrieveData(this.dataUrl, this.dataStatewideRateUrl);
          this.resetDescription();
          this.resetTitle();
        }
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

  checkAppliedDataSuppression(data) {
    let appliedSuppressionStatus = null;
    let groups = data.map((item) => item.DEMOGRAPHIC_SET_CATEGORY);

    let suppressionAllocations = {
      None: 0,
      Total: 0,
      Population: 0,
      CountySuppressed: false,
      TotalSuppression: 0,
    };

    data.map((item) => {
      suppressionAllocations[item.APPLIED_SUPPRESSION] = suppressionAllocations[item.APPLIED_SUPPRESSION] + 1;
      if (item.APPLIED_SUPPRESSION !== "None") {      
        suppressionAllocations['TotalSuppression'] = suppressionAllocations['TotalSuppression'] + 1;
      }
    });

    if (groups.length === suppressionAllocations.TotalSuppression) {
      suppressionAllocations.CountySuppressed = true;
      appliedSuppressionStatus = 'applied-suppression-total';
    }
    // console.log(suppressionAllocations);
    return appliedSuppressionStatus;
  }

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
      return d3.descending(a.METRIC_VALUE_PER_100K, b.METRIC_VALUE_PER_100K);
    });

    // Push null data values to the end or the sorted array (@TODO double check order)
    // Remap data object
    data = sortableData.concat(nullSortData); 
    

    this.appliedSuppressionStatus = this.checkAppliedDataSuppression(data);
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

    let statewideRatePer100k = this.combinedData[this.selectedMetric]
      ? this.combinedData[this.selectedMetric].METRIC_VALUE_PER_100K
      : null;
    let max_xdomain = d3.max(stackedData, (d) => d3.max(d, (d) => d[1]));
    if (statewideRatePer100k !== null) {
      // console.log("max xd",max_xdomain, statewideRatePer100k);
      max_xdomain = Math.max(max_xdomain, statewideRatePer100k)
    }
    this.x = d3
      .scaleLinear()
      .domain([0, max_xdomain])
      .range([0, this.dimensions.width - this.dimensions.margin.right - 50]);

    // ?
    this.xAxis = (g) =>
      g
        .attr("transform", "translate(0," + this.dimensions.width + ")")
        .call(d3.axisBottom(this.x).ticks(width / 50, "s"))
        .remove();
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
