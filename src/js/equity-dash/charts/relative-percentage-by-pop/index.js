import template from "./template.js";
import drawBars from "./draw-chart.js";
import drawSecondBars from "./draw-chart-second.js";
import termCheck from "../race-ethnicity-config.js";
import getTranslations from "../../get-strings-list.js";
import getScreenResizeCharts from "./../../get-window-size.js";

class CAGOVEquityREPop extends window.HTMLElement {
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
      chartColors: ["#92C5DE", "#FFCF44"],
      selectedMetric: "cases",
      selectedMetricDescription: "Cases",
      // Breakpoints
      desktop: {
        chartSectionOne: {
          height: 700,
          width: 450,
          margin: {
            top: 20,
            right: 30,
            bottom: 1,
            left: 10,
          },
        },
        chartSectionTwo: {
          height: 212,
          width: 450,
          margin: {
            top: 1,
            right: 30,
            bottom: 20,
            left: 10,
          },
        },
      },
      tablet: {
        chartSectionOne: {
          height: 700,
          width: 450,
          margin: {
            top: 20,
            right: 30,
            bottom: 1,
            left: 10,
          },
        },
        chartSectionTwo: {
          height: 212,
          width: 450,
          margin: {
            top: 1,
            right: 30,
            bottom: 20,
            left: 10,
          },
        },
      },
      mobile: {
        chartSectionOne: {
          height: 700,
          width: 450,
          margin: {
            top: 20,
            right: 30,
            bottom: 1,
            left: 10,
          },
        },
        chartSectionTwo: {
          height: 212,
          width: 450,
          margin: {
            top: 1,
            right: 30,
            bottom: 20,
            left: 10,
          },
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

    // Get data
    this.retrieveData(this.chartOptions.dataUrl);

    // Text strings
    this.translationsObj = getTranslations(this);
    this.county = this.chartOptions.state; // Initial default county
    this.selectedMetric = this.chartOptions.selectedMetric;
    this.selectedMetricDescription = this.chartOptions.selectedMetricDescription;
    this.innerHTML = template(this.translationsObj);
    this.updateTranslatedTextStrings();

    // Layout
    // Remap prior variables to translated variable, can remove if connect prior variables directly to these ones.
    this.dimensions = this.chartBreakpointValues.chartSectionOne;
    this.dimensionsSecond = this.chartBreakpointValues.chartSectionTwo;

    console.log("this.chartBreakpointValues", this.chartBreakpointValues);
    // SVG
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

    this.svgSecond = d3
      .select(this.querySelector(".svg-holder-second"))
      .append("svg")
      .attr("viewBox", [
        0,
        0,
        this.dimensionsSecond.width,
        this.dimensionsSecond.height,
      ])
      .append("g")
      .attr(
        "transform",
        "translate(" +
          this.dimensionsSecond.margin.left +
          "," +
          this.dimensionsSecond.margin.top +
          ")"
      );

    this.color1 = d3
      .scaleOrdinal()
      .domain(this.chartOptions.subgroups1)
      .range(this.chartOptions.chartColors);

    this.color2 = d3
      .scaleOrdinal()
      .domain(this.chartOptions.subgroups2)
      .range(this.chartOptions.chartColors);

    this.listenForLocations();

    this.classList.remove("d-none");
  }

  updateTranslatedTextStrings() {
    this.resetTitle();
    this.resetDescription();
    this.resetTooltip();
    this.resetLegend();
  }

  getLocation() {
    if (this.county === "California") {
      return this.state;
    } else {
      return this.county;
    }
  }

  getTitle() {
    let title = this.translationsObj[
      "chartTitle--" + this.selectedMetric
    ];
    console.log('title', title, this.getLocation());
    title.replace('placeholderForDynamicLocation', this.getLocation());
    return title;
  }

  getDescription() {
    let description = this.translationsObj[
      "chartDescription--" + this.selectedMetric
    ];
    console.log('description', description, this.getLocation());
    description.replace('placeholderForDynamicLocation', this.getLocation());
    return description;
  }

  getLegendString() {
    let relativePercentage = null;
    if (this.county === "California") {
      relativePercentage = this.translationsObj["relative-percentage-statewide"];
      return relativePercentage.replace("", this.selectedMetricDescription.toLowerCase())
    }
    return this.translationsObj["relative-percentage-county"];
  }

  // Jim's changes from merge to double check
  // this.description = function () {
  //   return this.translationsObj['chartDescription--'+this.selectedMetric].replace('placeholderForDynamicLocation', this.county);
  // }
  // this.legendString = function() {
  //   if(this.county === 'California') {
  //     return `of ${this.selectedMetricDescription.toLowerCase()} statewide`;
  //   }
  //   return `of ${this.selectedMetricDescription.toLowerCase()} in county`;
  // }
  // this.legendStrings = function() {
  //   let isStatewide = this.county === 'California';
  //   let key1 = 'chartLegend1' + (isStatewide? 'State' : "County") + '--'+this.selectedMetric;
  //   let key2 = 'chartLegend2' + '--'+this.selectedMetric;
  //   return [this.translationsObj[key1], this.translationsObj[key2]];
  // }

  getTooltipText() {
    this.tooltip = d3
      .select("cagov-chart-re-pop")
      .append("div")
      .attr("class", "chart-tooltip chart-tooltip--re100k")
      .text("an empty tooltip");
  }

  getFilterText() {
    return document
      .querySelector("cagov-chart-filter-buttons.js-re-smalls")
      .querySelector(".active").textContent;
  }

  resetTitle() {
    this.querySelector(".chart-title").innerHTML = this.getTitle();
  }

  resetDescription() {
    this.querySelector(".chart-description").innerHTML = this.getDescription();
  }

  resetTooltip() {
    // this.querySelector(".tooltip-***").innerHTML = this.getDescription();
  }

  resetLegend() {
    // Where does this go?
  }

  // Tab events for county or state.
  listenForLocations() {
    let searchElement = document.querySelector("cagov-county-search");
    searchElement.addEventListener(
      "county-selected",
      function (e) {
        this.county = e.detail.county;
        if (this.selectedMetric === "deaths") {
          this.selectedMetric = "cases";
        }
        this.retrieveData(
          config.equityChartsDataLoc +
            "/equitydash/cumulative-" +
            this.county.toLowerCase().replace(/ /g, "") +
            ".json"
        );
        this.resetTitle();
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
        if (this.alldata) {
          this.render();
          this.resetDescription();
          this.resetTitle();
        }
      }.bind(this),
      false
    );
  }

  retrieveData(url) {
    window
      .fetch(url)
      .then((response) => response.json())
      .then(
        function (alldata) {
          this.alldata = alldata;
          this.render();
        }.bind(this)
      );
  }

  render() {
    let data = this.alldata.filter(
      (item) =>
        item.METRIC === this.selectedMetric &&
        item.DEMOGRAPHIC_SET_CATEGORY !== "Other" &&
        item.DEMOGRAPHIC_SET_CATEGORY !== "Unknown"
    );
    let secondData = this.alldata.filter(
      (item) =>
        item.METRIC === this.selectedMetric &&
        (item.DEMOGRAPHIC_SET_CATEGORY === "Other" ||
          item.DEMOGRAPHIC_SET_CATEGORY === "Unknown")
    );

    // we map the race/ethnicities in the db to the desired display values here
    let displayDemoMap = termCheck();
    data.forEach((d) => {
      if (displayDemoMap.get(d.DEMOGRAPHIC_SET_CATEGORY)) {
        d.DEMOGRAPHIC_SET_CATEGORY = displayDemoMap.get(
          d.DEMOGRAPHIC_SET_CATEGORY
        );
      }
    });

    secondData.forEach((d) => {
      if (displayDemoMap.get(d.DEMOGRAPHIC_SET_CATEGORY)) {
        d.DEMOGRAPHIC_SET_CATEGORY = displayDemoMap.get(
          d.DEMOGRAPHIC_SET_CATEGORY
        );
      }
    });

    data.sort(function (a, b) {
      return d3.descending(
        a.METRIC_TOTAL_PERCENTAGE, // @TODO can abstract
        b.METRIC_TOTAL_PERCENTAGE // @TODO can abstract
      );
    });

    secondData.sort(function (a, b) {
      return d3.descending(
        a.METRIC_TOTAL_PERCENTAGE, // @TODO can abstract
        b.METRIC_TOTAL_PERCENTAGE // @TODO can abstract
      );
    });

    // @TODO Pull into a data formatting method
    // need to inherit this as a mapping of all possible values to desired display values becuase these differ in some tables
    // let groups = ["Latino", "Native Hawaiian and other Pacific Islander", "American Indian", "African American", "Multi-Race", "White", "Asian American"]
    let groups = data.map((item) => item.DEMOGRAPHIC_SET_CATEGORY); // ["Native Hawaiian and other Pacific Islander", "Latino", "American Indian", "African American", "Multi-Race", "White", "Asian American"]
    // Push second section data to end of data array.
    let groupsSecond = secondData.map((item) => item.DEMOGRAPHIC_SET_CATEGORY); // ["Other", "Unknown"]

    let stackedData1 = d3.stack().keys(this.chartOptions.subgroups1)(data);
    let stackedData2 = d3.stack().keys(this.chartOptions.subgroups2)(data);
    let stackedData1Second = d3.stack().keys(this.chartOptions.subgroups1)(
      secondData
    );

    this.y = d3
      .scaleBand()
      .domain(groups)
      .range([
        this.dimensions.margin.top,
        this.dimensions.height - this.dimensions.margin.bottom,
      ])
      .padding([0.6]);

    this.ySecond = d3
      .scaleBand()
      .domain(groupsSecond)
      .range([
        this.dimensionsSecond.margin.top,
        this.dimensionsSecond.height - this.dimensionsSecond.margin.bottom,
      ])
      .padding([0.2]);

    let yAxis = (g) =>
      g
        .attr("class", "bar-label")
        .attr("transform", "translate(4," + -32 + ")")
        .call(d3.axisLeft(this.y).tickSize(0))
        .call((g) => g.selectAll(".domain").remove());

    let yAxisSecond = (g) =>
      g
        .attr("class", "bar-label")
        .attr("transform", "translate(4," + -44 + ")")
        .call(d3.axisLeft(this.ySecond).tickSize(0))
        .call((g) => g.selectAll(".domain").remove());

    let x1 = d3
      .scaleLinear()
      .domain([0, d3.max(stackedData1, (d) => d3.max(d, (d) => d[1]))])
      .range([0, this.dimensions.width - this.dimensions.margin.right - 40]);

    let x2 = d3
      .scaleLinear()
      .domain([0, d3.max(stackedData2, (d) => d3.max(d, (d) => d[1]))])
      .range([0, this.dimensions.width - this.dimensions.margin.right - 40]);

    let xAxis = (g) =>
      g
        .attr("transform", "translate(0," + this.dimensions.width + ")")
        .call(d3.axisBottom(x1).ticks(width / 50, "s"))
        .remove()
    let legendStrings = this.legendStrings();
    drawBars(this.svg, x1, x2, this.y, yAxis, stackedData1, stackedData2, this.color1, this.color2, data, this.tooltip, legendStrings, this.selectedMetric, this.translationsObj)
    drawSecondBars(this.svgSecond, x1, x2, this.ySecond, yAxisSecond, stackedData1Second, this.color1, secondData, this.tooltip, legendStrings[0], this.selectedMetric, this.translationsObj)
  }

  retrieveData(url) {
    window.fetch(url)
    .then(response => response.json())
    .then(function(alldata) {
      this.alldata = alldata;
      this.render();     
    }.bind(this));

    drawBars({
      svg: this.svg,
      x1,
      x2,
      y: this.y,
      yAxis,
      stackedData1,
      stackedData2,
      color1: this.color1,
      color2: this.color2,
      data,
      tooltip: this.tooltip,
      selectedMetric: this.selectedMetric,
      legendScope: this.getLegendString(),
      translationsObj: this.translationsObj,
      legendScopeStatewide: '% of statewide'
    });
    drawSecondBars({
      svg: this.svg,
      x1,
      x2,
      y: this.y,
      yAxis,
      stackedData1,
      stackedData2,
      color1: this.color1,
      color2: this.color2,
      data,
      tooltip: this.tooltip,
      selectedMetric: this.selectedMetric,
      translationsObj: this.translationsObj,
      legendScope: this.getLegendString(),
      legendScopeStatewide: '% of statewide'
    });
  }
}
window.customElements.define("cagov-chart-re-pop", CAGOVEquityREPop);
