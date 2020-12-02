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
      chartColors: ["#92C5DE", "#FFCF44", "#F2F5FC"],
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
          width: 440,
          margin: {
            top: 0,
            right: 30,
            bottom: 1,
            left: 10,
          },
        },
        chartSectionTwo: {
          height: 212,
          width: 440,
          margin: {
            top: 1,
            right: 30,
            bottom: 20,
            left: 10,
          },
        },
      },
      retina: {
        chartSectionOne: {
          height: 700,
          width: 320,
          margin: {
            top: 0,
            right: 30,
            bottom: 1,
            left: 10,
          },
        },
        chartSectionTwo: {
          height: 212,
          width: 320,
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
    this.state = this.chartOptions.state;
    this.selectedMetric = this.chartOptions.selectedMetric;
    this.selectedMetricDescription = this.chartOptions.selectedMetricDescription;
    this.innerHTML = template(this.translationsObj);
    this.updateTranslatedTextStrings();

    // Layout
    // Remap prior variables to translated variable, can remove if connect prior variables directly to these ones.
    this.dimensions = this.chartBreakpointValues.chartSectionOne;
    this.dimensionsSecond = this.chartBreakpointValues.chartSectionTwo;

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
      .range([
        this.chartOptions.chartColors[0],
        this.chartOptions.chartColors[2],
      ]);

    this.color2 = d3
      .scaleOrdinal()
      .domain(this.chartOptions.subgroups2)
      .range([
        this.chartOptions.chartColors[1],
        this.chartOptions.chartColors[2],
      ]);
    // .range(this.chartOptions.chartColors);

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
      let countyLabel = this.translationsObj["county-label"];
      return this.county + " " + countyLabel; // @TODO this pattern probably won't translate well
    }
  }

  getTitle() {
    let title = this.translationsObj[
      "chartTitle--" + this.selectedMetric.toLowerCase()
    ];
    if (title !== undefined) {
      title = title.replace(
        "placeholderForDynamicLocation",
        this.getLocation()
      );
    }
    return title;
  }

  getDescription() {
    let description = this.translationsObj[
      "chartDescription--" + this.selectedMetric.toLowerCase()
    ];
    description = description.replace(
      "placeholderForDynamicLocation",
      this.getLocation()
    );
    return description;
  }

  // getLegendString() {
  //   let relativePercentage = null;
  //   if (this.county === "California") {
  //     relativePercentage = this.translationsObj[
  //       "relative-percentage-statewide"
  //     ];
  //     return relativePercentage;
  //   }
  //   relativePercentage = this.translationsObj["relative-percentage-county"];
  //   return relativePercentage;
  // }

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

  legendStrings() {
    let isStatewide = this.county === 'California';
    let key1 = 'chartLegend1' + (isStatewide? 'State' : "County") + '--'+this.selectedMetric;
    let key2 = 'chartLegend2' + (isStatewide? 'State' : "County");
    console
    return [this.translationsObj[key1], this.translationsObj[key2]];
  }

  getToolTipCaption1(d, legendString) {
    let templateStr = this.translationsObj['chartToolTip1-caption'];
    let caption = templateStr
                    .replace('placeholder_DEMOGRAPHIC_SET_CATEGORY',d.data.DEMOGRAPHIC_SET_CATEGORY)
                    .replace('placeholder_METRIC_TOTAL_PERCENTAGE',d.data.METRIC_TOTAL_PERCENTAGE? parseFloat(d.data.METRIC_TOTAL_PERCENTAGE).toFixed(1) + "%" : 0)
                    .replace('placeholder_LegendString',legendString)
                    .replace('placeholder_POPULATION_PERCENTAGE',d.data.POPULATION_PERCENTAGE ? parseFloat(d.data.POPULATION_PERCENTAGE).toFixed(1) + "%" : 0);
    return caption;
  }

  getToolTipCaption2(d, selectedMetric) {
    let templateStr = this.translationsObj['chartToolTip2-caption'];
    let caption = templateStr
                    .replace('placeholder_DEMOGRAPHIC_SET_CATEGORY',d.data.DEMOGRAPHIC_SET_CATEGORY)
                    .replace('placeholder_METRIC_TOTAL_PERCENTAGE',d.data.METRIC_TOTAL_PERCENTAGE? parseFloat(d.data.METRIC_TOTAL_PERCENTAGE).toFixed(1) + "%" : 0)
                    .replace('placeholder_SelectedMetric',selectedMetric)
                    .replace('placeholder_POPULATION_PERCENTAGE',d.data.POPULATION_PERCENTAGE ? parseFloat(d.data.POPULATION_PERCENTAGE).toFixed(1) + "%" : 0);
    return caption;
  }
// placeholderDEMOGRAPHIC_SET_CATEGORY people make up<span class="highlight-data"> placeholder_POPULATION_PERCENTAGE</span> of California's population and <span class="highlight-data"> placeholderMETRIC_TOTAL_PERCENTAGE</span> of placeholder_selectedMetric statewide
// d.data.DEMOGRAPHIC_SET_CATEGORY + " people make up"
//        }<span class="highlight-data"> ${d.data.POPULATION_PERCENTAGE ? parseFloat(d.data.POPULATION_PERCENTAGE).toFixed(1) + "%" : 0}</span> of California's population and 
//<span class="highlight-data"> ${
//        d.data.METRIC_TOTAL_PERCENTAGE
//          ? parseFloat(d.data.METRIC_TOTAL_PERCENTAGE).toFixed(1) + "%"
//          : 0
//      }</span> of ${selectedMetric} statewide

  setupTooltip() {
    return d3
      .select("cagov-chart-re-pop")
      .append("div")
      .attr("class", "tooltip-container tooltip-container--re100k")
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

  checkAppliedDataSuppression(data) {
    // console.log(data);
    let suppressionAllocations = {
      None: 0,
      Total: 0,
      Population: 0,
    };

    data.map((item) => {
      suppressionAllocations[item.APPLIED_SUPPRESSION] =
        suppressionAllocations[item.APPLIED_SUPPRESSION] + 1;
    });

    if (suppressionAllocations["Population"] === data.length) {
    }

    // console.log("suppressionAllocations", suppressionAllocations);
    // APPLIED_SUPPRESSION: "None"
    // COUNTY: "California"
    // DEMOGRAPHIC_SET: "race_ethnicity"
    // DEMOGRAPHIC_SET_CATEGORY: "Latino"
    // LOWEST_VALUE: 196.440102732406
    // METRIC: "cases"
    // METRIC_TOTAL_DELTA: 50.257727920786
    // METRIC_TOTAL_PERCENTAGE: 49.742272079214
    // METRIC_TOTAL_PERCENTAGE_30_DAYS_AGO: 58.436053257361
    // METRIC_VALUE: 95247
    // METRIC_VALUE_30_DAYS_AGO: 50868
    // METRIC_VALUE_PERCENTAGE_DELTA_FROM_30_DAYS_AGO: -8.693781178147
    // METRIC_VALUE_PER_100K: 609.58637893454
    // METRIC_VALUE_PER_100K_30_DAYS_AGO: 325.558179508459
    // METRIC_VALUE_PER_100K_DELTA_FROM_30_DAYS_AGO: 284.028199426081
    // PCT_FROM_LOWEST_VALUE: 3.1031666673730505
    // POPULATION_PERCENTAGE: 38.93641681012
    // POPULATION_PERCENTAGE_DELTA: 61.06358318988
    // SORT_METRIC: 1.27752567273436
    // WORST_VALUE: 797.223716300351
    // WORST_VALUE_DELTA: 187.63733736581105

    // APPLIED_SUPPRESSION: "Population"
    // COUNTY: "Nevada"
    // DEMOGRAPHIC_SET: "race_ethnicity"
    // DEMOGRAPHIC_SET_CATEGORY: "Latino"
    // LOWEST_VALUE: 427.697810237235
    // METRIC: "cases"
    // METRIC_TOTAL_DELTA: 100
    // METRIC_TOTAL_PERCENTAGE: null
    // METRIC_TOTAL_PERCENTAGE_30_DAYS_AGO: null
    // METRIC_VALUE: null
    // METRIC_VALUE_30_DAYS_AGO: null
    // METRIC_VALUE_PERCENTAGE_DELTA_FROM_30_DAYS_AGO: null
    // METRIC_VALUE_PER_100K: null
    // METRIC_VALUE_PER_100K_30_DAYS_AGO: null
    // METRIC_VALUE_PER_100K_DELTA_FROM_30_DAYS_AGO: null
    // PCT_FROM_LOWEST_VALUE: 0
    // POPULATION_PERCENTAGE: 12.098065039003
    // POPULATION_PERCENTAGE_DELTA: 87.901934960997
    // SORT_METRIC: 0
    // WORST_VALUE: 427.697810237235
    // WORST_VALUE_DELTA: 427.697810237235

    return data;
  }

  getMissingDataBox(appliedSuppressionType) {
    // console.log("this", this);
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

    let appliedSuppressionType = this.checkAppliedDataSuppression(data);
    let messageBox = this.getMissingDataBox(appliedSuppressionType);

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
        .remove();
    let legendStrings = this.legendStrings();

    // drawBars({this.svg, x1, x2, this.y, yAxis, stackedData1, stackedData2, this.color1, this.color2, data, this.tooltip, legendStrings, this.selectedMetric, this.translationsObj)
    // drawSecondBars(this.svgSecond, x1, x2, this.ySecond, yAxisSecond, stackedData1Second, this.color1, secondData, this.tooltip, legendStrings[0], this.selectedMetric, this.translationsObj)


    // placeholderDEMO_CAT people make up <span class="highlight-data"> placeholderMETRIC_Percentage</span> placeholder_Legend0 and <span class="highlight-data"> placeholder_PopPct </span> of California's population

    // ${d.data.DEMOGRAPHIC_SET_CATEGORY} people make up <span class="highlight-data"> ${
    //      d.data.METRIC_TOTAL_PERCENTAGE
    //        ? parseFloat(d.data.METRIC_TOTAL_PERCENTAGE).toFixed(1) + "%"
    //        : 0
    //      }</span> ${legendStrings[0]} and <span class="highlight-data"> ${d.data.POPULATION_PERCENTAGE ? parseFloat(d.data.POPULATION_PERCENTAGE).toFixed(1) + "%" : 0}</span> of California's population

    
    drawBars({
      component: this,
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
      tooltip: this.setupTooltip(),
      selectedMetric: this.selectedMetric,
      translationsObj: this.translationsObj,
      legendStrings: legendStrings,
      messageBox,
    });
    drawSecondBars({
      svg: this.svgSecond,
      x1,
      x2,
      y: this.ySecond,
      yAxis: yAxisSecond,
      stackedData1: stackedData1Second,
      stackedData2: null,
      color1: this.color1,
      color2: this.color2,
      data: secondData,
      tooltip: this.setupTooltip(),
      selectedMetric: this.selectedMetric,
      translationsObj: this.translationsObj,
      legendStrings: legendStrings,
    });
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
}
window.customElements.define("cagov-chart-re-pop", CAGOVEquityREPop);
