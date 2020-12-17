import template from "./template.js";
import drawBars from "./draw-chart.js";
import drawSecondBars from "./draw-chart-second.js";
import termCheck from "../race-ethnicity-config.js";
import getTranslations from "../../get-strings-list.js";
import getScreenResizeCharts from "./../../get-window-size.js";
import getDisproportionateRatioSortValue from './get-disproportionality-ratio-sort-value.js';
import rtlOverride from "./../../rtl-override.js";

class CAGOVEquityREPop extends window.HTMLElement {
  connectedCallback() {
    // Settings and initial values
    this.chartOptions = {
      // Data
      subgroups1: ["POPULATION_PERCENTAGE", "POPULATION_PERCENTAGE_DELTA"],
      subgroups2: ["METRIC_TOTAL_PERCENTAGE", "METRIC_TOTAL_DELTA"],
      dataUrl:
        config.equityChartsDataLoc + "/equitydash/cumulative-california.json", // Overwritten by county.
      state: "California",
      county: "California",
      // Style
      chartColors: ["#92C5DE", "#FFCF44", "#F2F5FC"], // blue yellow gray
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
    
    rtlOverride(this);

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
    // do it twice
    description = description.replace(
      "placeholderForDynamicLocation",
      this.getLocation()
    );
    return description;
  }

  legendStrings() {
    let isStatewide = this.county === 'California';
    let key1 = 'chartLegend1' + (isStatewide? 'State' : "County") + '--'+this.selectedMetric;
    let key2 = 'chartLegend2' + (isStatewide? 'State' : "County");
    console
    return [this.translationsObj[key1], this.translationsObj[key2]];
  }

  getToolTipCaption1(d, selectedMetric) {
    if (d.data.APPLIED_SUPPRESSION === "Total") {
      return this.translationsObj['data-missing-applied-suppression-total' + "--" + this.selectedMetric.toLowerCase()] || '';
    } else if (d.data.APPLIED_SUPPRESSION === "Population") {
      return this.translationsObj['data-missing-applied-suppression-population'+ "--" + this.selectedMetric.toLowerCase()] || '';
    }

    let templateStr = this.translationsObj['chartToolTip1-caption'];
    const nomKey = 'chartMetricName--'+selectedMetric;
    let metricNom = selectedMetric;
    if (nomKey in this.translationsObj) {
        metricNom = this.translationsObj[nomKey];
    }
    let caption = templateStr
                    .replace('placeholderForDynamicLocation',this.getLocation())
                    .replace('placeholderForDynamicLocation',this.getLocation()) // needs a second one
                    .replace('placeholder_DEMOGRAPHIC_SET_CATEGORY',d.data.DEMOGRAPHIC_SET_CATEGORY)
                    .replace('placeholder_METRIC_TOTAL_PERCENTAGE',d.data.METRIC_TOTAL_PERCENTAGE? parseFloat(d.data.METRIC_TOTAL_PERCENTAGE).toFixed(1) + "%" : 0)
                    .replace('placeholder_SelectedMetric',metricNom)
                    .replace('placeholder_LegendString',metricNom) // backward compat
                    .replace('placeholder_POPULATION_PERCENTAGE',d.data.POPULATION_PERCENTAGE ? parseFloat(d.data.POPULATION_PERCENTAGE).toFixed(1) + "%" : 0);
    return caption;
  }

  // @TODO Is this used? Looks like it's not.
  getToolTipCaption2(d, selectedMetric) {
    if (d.APPLIED_SUPPRESSION === "Total") {
      return translationsObj['data-missing-applied-suppression-total'] || '';
    } else if (d.APPLIED_SUPPRESSION === "Population") {
      return translationsObj['data-missing-applied-suppression-population'] || '';
    }

    let templateStr = this.translationsObj['chartToolTip2-caption'];
    let caption = templateStr
                    .replace('placeholderForDynamicLocation',this.getLocation())
                    .replace('placeholderForDynamicLocation',this.getLocation()) // needs a second one
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
    console.log("reset tooltip");
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
        this.resetDescription();
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
          this.selectedMetricDescription = e.detail.clickedFilterText;
          this.selectedMetric = e.detail.filterKey;
          if (this.alldata) {
            this.render();
            this.resetDescription();
            this.resetTitle();
          }
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
      // Run the sort ratio calculating logic. 
      // If not valid, will return null.
      d.DISPROPORTIONALITY_RATIO = getDisproportionateRatioSortValue(d, data, this);
    });

    secondData.forEach((d) => {
      if (displayDemoMap.get(d.DEMOGRAPHIC_SET_CATEGORY)) {
        d.DEMOGRAPHIC_SET_CATEGORY = displayDemoMap.get(
          d.DEMOGRAPHIC_SET_CATEGORY
        );
      }
      // Run the sort ratio calculating logic. 
      // If not valid, will return null.
      d.DISPROPORTIONALITY_RATIO = getDisproportionateRatioSortValue(d, data, this);
    });

    let sortableData = data.filter((d) => d.DISPROPORTIONALITY_RATIO !== null);
    let nullSortData = data.filter((d) => d.DISPROPORTIONALITY_RATIO === null);

    // Sort data with non-null 'disproportionality ratio' 
    sortableData.sort(function (a, b) {
      return d3.descending(a.DISPROPORTIONALITY_RATIO, b.DISPROPORTIONALITY_RATIO);
    });

    // Push null data values to the end or the sorted array (@TODO double check order)
    // Remap data object
    data = sortableData.concat(nullSortData); 
    
    // data.sort(function (a, b) {
    //   return d3.descending(
    //     a.METRIC_TOTAL_PERCENTAGE, // @TODO can abstract
    //     b.METRIC_TOTAL_PERCENTAGE // @TODO can abstract
    //   );
    // });
    let sortableSecondData = secondData.filter((d) => d.DISPROPORTIONALITY_RATIO !== null);
    let nullSortSecondData = secondData.filter((d) => d.DISPROPORTIONALITY_RATIO === null);

    // Sort data with non-null 'disproportionality ratio' 
    sortableSecondData.sort(function (a, b) {
      return d3.ascending(a.DISPROPORTIONALITY_RATIO, b.DISPROPORTIONALITY_RATIO);
    });

    // Push null data values to the end or the sorted array (@TODO double check order)
    // Remap data object
    secondData = sortableSecondData.concat(nullSortSecondData); 

    // secondData.sort(function (a, b) {
    //   return d3.descending(
    //     a.METRIC_TOTAL_PERCENTAGE, // @TODO can abstract
    //     b.METRIC_TOTAL_PERCENTAGE // @TODO can abstract
    //   );
    // });

    this.appliedSuppressionStatus = this.checkAppliedDataSuppression(data);

    // @TODO Pull into a data formatting method
    // need to inherit this as a mapping of all possible values to desired display values becuase these differ in some tables
    // let groups = ["Latino", "Native Hawaiian and other Pacific Islander", "American Indian", "African American", "Multi-Race", "White", "Asian American"]
    let groups = data.map((item) => item.DEMOGRAPHIC_SET_CATEGORY); // ["Native Hawaiian and other Pacific Islander", "Latino", "American Indian", "African American", "Multi-Race", "White", "Asian American"]
    // Push second section data to end of data array.
    let groupsSecond = secondData.map((item) => item.DEMOGRAPHIC_SET_CATEGORY); // ["Other", "Unknown"]


    let stackedData1 = d3.stack().keys(this.chartOptions.subgroups1)(data);
    let stackedData2 = d3.stack().keys(this.chartOptions.subgroups2)(data);
    let stackedData1Second = d3.stack().keys(this.chartOptions.subgroups2)(
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

    // console.log( 'appliedSuppressionStatus',   this.appliedSuppressionStatus)
    
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
      appliedSuppressionStatus: this.appliedSuppressionStatus,
      chartBreakpointValues: this.chartBreakpointValues,
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
      appliedSuppressionStatus: this.appliedSuppressionStatus,
      chartBreakpointValues: this.chartBreakpointValues,
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
