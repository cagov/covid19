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
  subgroups1: ["METRIC_TOTAL_PERCENTAGE", "METRIC_TOTAL_DELTA"],
  subgroups2: ["POPULATION_PERCENTAGE", "POPULATION_PERCENTAGE_DELTA"],
  dataUrl:
    config.equityChartsDataLoc + "/equitydash/cumulative-california.json", // Overwritten by county.
  state: "California",
  county: "California",
  // Style
  chartColors: ["#92C5DE", "#FFCF44", "#F2F5FC"],
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
      // console.log("Getting chart title 100k metric=", this.selectedMetric);
      return this.translationsObj["chartTitle--" + this.selectedMetric].replace(
        "placeholderForDynamicLocation",
        this.county
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
        this.county
      );
      return filterTxt;
    };

    this.toolTipCaption = function(a,b,c) {
      let templateStr = this.translationsObj['chartToolTip-caption'];
      let caption = templateStr
                        .replace('placeholderDEMO_CAT', a)
                        .replace('placeholderMETRIC_100K', b)
                        .replace('placeholderFilterScope', c);
      return caption;
    }
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

  render() {
    let data = this.alldata.filter(
      (item) =>
        item.METRIC === this.selectedMetric &&
        item.DEMOGRAPHIC_SET_CATEGORY !== "Other" &&
        item.DEMOGRAPHIC_SET_CATEGORY !== "Unknown"
    );
    let displayDemoMap = termCheck();

    data.forEach((d) => {
      d.METRIC_VALUE_PER_100K_CHANGE_30_DAYS_AGO = 0;
      if (d.METRIC_VALUE_PER_100K_30_DAYS_AGO) {
        d.METRIC_VALUE_PER_100K_CHANGE_30_DAYS_AGO =
          d.METRIC_VALUE_PER_100K_DELTA_FROM_30_DAYS_AGO /
          d.METRIC_VALUE_PER_100K_30_DAYS_AGO;
      }
      // we map the race/ethnicities in the db to the desired display values here
      if (displayDemoMap.get(d.DEMOGRAPHIC_SET_CATEGORY)) {
        d.DEMOGRAPHIC_SET_CATEGORY = displayDemoMap.get(
          d.DEMOGRAPHIC_SET_CATEGORY
        );
      }
    });

    data.sort(function (a, b) {
      return d3.descending(a.METRIC_VALUE_PER_100K, b.METRIC_VALUE_PER_100K);
    });
    // ordering this array by the order they are in in data
    // need to inherit this as a mapping of all possible values to desired display values becuase these differ in some tables
    let groups = data.map((item) => item.DEMOGRAPHIC_SET_CATEGORY);

    let stackedData = d3.stack().keys(this.subgroups)(data);

    this.y = d3
      .scaleBand()
      .domain(groups)
      .range([
        this.dimensions.margin.top,
        this.dimensions.height - this.dimensions.margin.bottom,
      ])
      .padding([0.6]);

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
      console.log("max xd",max_xdomain, statewideRatePer100k);
      max_xdomain = Math.max(max_xdomain, statewideRatePer100k)
    }
    this.x = d3
      .scaleLinear()
      .domain([0, max_xdomain])
      .range([0, this.dimensions.width - this.dimensions.margin.right - 50]);

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
