import template from "./template.js";
import drawBars from "./draw.js";
import getTranslations from './../../get-strings-list.js';
import getScreenResizeCharts from './../../get-window-size.js';
import rtlOverride from "./../../rtl-override.js";

class CAGOVEquityMissingness extends window.HTMLElement {
  connectedCallback() {
    // console.log("Setting up CAGOVEquityMissingness");
    // Get translations.
    // Use component function, which loads getTranslations and then appends that function with additional translation functions.
    this.translationsObj = this.getTranslations(this);
    // console.log("trans objs",this.translationsObj);

    this.updateDate = "YY";

    this.innerHTML = template(this.translationsObj);



    // Settings and initial values
    this.chartOptions = {
      // Data
      subgroups: ["NOT_MISSING", "MISSING"],
      selectedMetric: "race_ethnicity",
      dataUrl: config.equityChartsDataLoc+"/equitydash/missingness-california.json", // Overwritten by county.
      state: 'California',
      county: 'California',
      displayOrder: ["tests", "cases", "deaths"],
      // Style
      backgroundFill: '#F2F5FC',
      chartColors: ["#92C5DE", "#FFCF44"],
      // Breakpoints
      desktop: {
        fontSize: 14,
        height: 214,
        width: 613,
        margin: {
          top: 40,
          right: 0,
          bottom: 20,
          left: 0,
        },
        heightMultiplier: 100,
        labelOffsets: [-52, -52, -57],
      },
      tablet: {
        fontSize: 14,
        height: 214,
        width: 440,
        margin: {
          top: 40,
          right: 0,
          bottom: 20,
          left: 0,
        },
        heightMultiplier: 100,
        labelOffsets: [-52, -52, -57],
      },
      mobile: {
        fontSize: 12,
        height: 600,
        width: 440,
        margin: {
          top: 40,
          right: 0,
          bottom: 20,
          left: 0,
        },
        heightMultiplier: 100,
        labelOffsets: [-52, -52, -57],
      },
      retina: {
        fontSize: 12,
        height: 600,
        width: 320,
        margin: {
          top: 40,
          right: 0,
          bottom: 20,
          left: 0,
        },
        heightMultiplier: 100,
        labelOffsets: [-52, -52, -57],
      },
    };

    getScreenResizeCharts(this);
    this.screenDisplayType = window.charts ? window.charts.displayType : 'desktop';
    this.chartBreakpointValues = this.chartOptions[this.screenDisplayType ? this.screenDisplayType : 'desktop'];

    // Choose settings for current screen display.
    // Display content & layout dimensions
    const handleChartResize = () => {
      getScreenResizeCharts(this);
      this.screenDisplayType = window.charts ? window.charts.displayType : 'desktop';
      this.chartBreakpointValues = this.chartOptions[this.screenDisplayType ? this.screenDisplayType : 'desktop'];
    };

    // @TODO connect a debouncer
    window.addEventListener('resize', handleChartResize);

    this.metricFilter = document.querySelector(
      "cagov-chart-filter-buttons.js-missingness-smalls"
    );

    // Build chart.
    this.svg = d3
      .select(this.querySelector(".svg-holder"))
      .append("svg")
      .attr("viewBox", [0, 0, this.chartBreakpointValues.width, this.chartBreakpointValues.height])
      .append("g")
      .attr(
        "transform",
        "translate(" +
          this.chartBreakpointValues.margin.left +
          "," +
          this.chartBreakpointValues.margin.top +
          ")"
      );

    this.color = d3
      .scaleOrdinal()
      .domain(this.chartOptions.subgroups)
      .range(this.chartOptions.chartColors);

    // Set default values for data and labels
    this.dataUrl = this.chartOptions.dataUrl;
    this.county = this.chartOptions.county;
    this.state = this.chartOptions.state;
    this.selectedMetric = this.chartOptions.selectedMetric;

    this.retrieveData(this.dataUrl);
    this.listenForLocations();
    this.classList.remove("d-none"); // this works
    if (this.querySelector('.d-none') !== null) { // this didn't seem to be working...
      this.querySelector('.d-none').classList.remove("d-none");
    }

    rtlOverride(this); // quick fix for arabic
  }

  listenForLocations() {
    let searchElement = document.querySelector("cagov-county-search");
    searchElement.addEventListener(
      "county-selected",
      function (e) {
        this.county = e.detail.county;
        this.dataUrl =
        config.equityChartsDataLoc+"/equitydash/missingness-" +
          this.county.toLowerCase().replace(/ /g, "") +
          ".json";
        this.retrieveData(this.dataUrl);
        this.resetTitle();
      }.bind(this),
      false
    );

    this.metricFilter.addEventListener(
      "filter-selected",
      function (e) {
        this.selectedMetricDescription = e.detail.clickedFilterText;
        this.selectedMetric = e.detail.filterKey;
        this.retrieveData(this.dataUrl);
        this.resetDescription();
        this.resetTitle();
      }.bind(this),
      false
    );
  }

  resetTitle() {
    this.querySelector(".chart-title").innerHTML = this.translationsObj['tab-label'] ? this.translationsObj['tab-label'] : null;
    this.querySelector('.chart-title span[data-replace="metric-filter"]').innerHTML = this.getFilterText().toLowerCase();
    this.querySelector('.chart-title span[data-replace="location"]').innerHTML = this.getLocation();
  }

  resetUpdateDate() {
    this.querySelectorAll('span[data-replacement="data-completeness-report-date"]').forEach(elem => {
      // console.log("Got completeness date span");
      elem.innerHTML = this.updateDate;
    });
  }

  getFilterText() {
    return this.metricFilter.querySelector(".active").textContent;
  }

  getLocation() {
    if (this.county === 'California') {
      return this.state;
    } else {
      return this.county;
    }
  }

  resetDescription() {}

  formatDataSet(dataSet) {
    let data = [];
    let casesObj = {};
    if (dataSet.cases !== undefined) {
      casesObj = dataSet.cases;
      casesObj.METRIC = "cases";
      data.push(casesObj);
    }
    let deathsObj = {};
    if (dataSet.deaths !== undefined) {
      deathsObj = dataSet.deaths;
      deathsObj.METRIC = "deaths";
      data.push(deathsObj);
    }
    let testsObj = {};
    if (dataSet.tests !== undefined) {
      testsObj = dataSet.tests;
      testsObj.METRIC = "tests";
      data.push(dataSet.tests);
    }
    data.forEach((d) => {
      this.formatDataObject(d);
    });
    data.sort(function (a, b) {
      return d3.descending(a.MISSING, b.MISSING);
    });
    return data;
  }

  /**
   * Format the data object.
   * Testing strategy:
   * We can pull in this formatData function into a unit test and pass
   * in some variations of mock data to ensure that null, NaN,
   * Infinity and other errors are not returned.
   * This would also allow us to document the expected data object
   * and provide a place to store examples of the data responses,
   * expected value ranges and required values.
   *
     // Complete mock data example.
      {
      "COUNTY": "Alpine",
      "METRIC": "tests",
      "MISSING": 183,
      "NOT_MISSING": 22,
      "TOTAL": 205,
      "PERCENT_COMPLETE": 0.107317073170732,
      "PERCENT_COMPLETE_30_DAYS_PRIOR": 0.21078431372549,
      "PERCENT_COMPLETE_30_DAYS_DIFF": -0.103467240554758,
      "REPORT_DATE": "2020-11-16"
      }

      // Incomplete mock data example.
      {
      "METRIC": "deaths",
      "MISSING": 0,
      "NOT_MISSING": 0,
      "TOTAL": 0,
      "PERCENT_COMPLETE": null,
      "PERCENT_COMPLETE_30_DAYS_DIFF": null,
      "REPORT_DATE": "2020-11-16"
      }
  */
  formatDataObject(d) {
    if (d.TOTAL === 0 && d.MISSING === 0) {
      d.MISSING = 0;
    } else if (d.TOTAL === 1 && d.MISSING === 0) {
      d.MISSING = 0;
    } else if ((d.TOTAL === 0 || d.TOTAL === null) && d.MISSING === 1) {
      d.MISSING = 1;
    } else {
      d.MISSING = d.MISSING / d.TOTAL;
      if (isNaN(d.MISSING)) {
        d.MISSING = 1;
      }
    }

    if (d.TOTAL === 0 && d.NOT_MISSING === 0) {
      d.NOT_MISSING = 0;
    } else if (d.TOTAL === 1 && d.NOT_MISSING === 0) {
      d.NOT_MISSING = 0;
    } else if ((d.TOTAL === 0 || d.TOTAL === null) && d.NOT_MISSING === 1) {
      d.NOT_MISSING = 1;
    } else {
      d.NOT_MISSING = d.NOT_MISSING / d.TOTAL;
      if (isNaN(d.NOT_MISSING)) {
        d.NOT_MISSING = 0;
      }
    }
  }

  /**
   * Sort domains by preferred display order.
   * @param {} data
   */
  getDomains(data) {
    let unsortedDomains = data.map((group) => group.METRIC);
    // Display order
    let displayOrder = this.chartOptions.displayOrder;
    let domains = [];
    displayOrder.map((key) => {
      let position = unsortedDomains.indexOf(key);
      if (position >= 0) {
        domains.push(key);
      }
    });
    return domains;
  }

  getTranslations() {
    let translations = getTranslations(this);

    // This function is called when the chart title values are changed by user interaction.
    // Intention is to accommodate different placement of values in sentence structure for translated content.
    // Take translated template string, replace values into the span tags.
    translations.chartTitle = ({
      metricFilter = 'race_ethnicity',
      location = 'California'
    }) => {
      let title = translations['tab-label'];
      return title;
    }


    // Generate tooltip text, taking dynamic variable.
    // This takes an HTML text string from the template.
    // @TODO Accommodate different placement of values in sentence structure for translated content.
    // Take translated template string, replace values into the span tags.
    translations.chartTooltip = ({
        metric = 'tests',
        highlightData = 0,
        complete = true,
      }) => {
        let location = this.getLocation();
        let dataType = this.getFilterText().toLowerCase();
        let tooltipHTML = translations['chart-tooltip-complete'];
        if (!complete) {
          tooltipHTML = translations['chart-tooltip-missing'];
        }
        tooltipHTML = tooltipHTML.replace('<span data-replace="metric">tests</span>', `<span data-replace="metric">${metric}</span>`);
        tooltipHTML = tooltipHTML.replace('<span data-replace="highlight-data"></span>', `<span data-replace="highlight-data">${highlightData}</span>`);
        tooltipHTML = tooltipHTML.replace('<span data-replace="location">California</span>', `<span data-replace="location">${location}</span>`);
        tooltipHTML = tooltipHTML.replace('<span data-replace="data-type">race and ethnicity</span>', `<span data-replace="data-type">${dataType}</span>`);
        return `<div class="chart-tooltip"><div>${tooltipHTML}</div></div>`;
      }
    return translations;
  }

  drawSvg(data) {
    // console.log("Chart data",data);
    let stackedData = d3.stack().keys(this.chartOptions.subgroups)(data);
    let domains = this.getDomains(data); // Get list of data domains for this dataset.

    let heightMultiplier = this.chartBreakpointValues.heightMultiplier;
    let svgHeight = heightMultiplier * domains.length;

    d3.select(this.querySelector(".svg-holder svg")).attr("viewBox", [
      0,
      0,
      this.chartBreakpointValues.width,
      svgHeight,
    ]); // Reset height.

    this.x = d3
      .scaleLinear()
      .domain([0, d3.max(stackedData, (d) => d3.max(d, (d) => d[1]))])
      .range([0, this.chartBreakpointValues.width]);

    this.y = d3
      .scaleBand()
      .domain(domains)
      .range([
        this.chartBreakpointValues.margin.top,
        svgHeight - this.chartBreakpointValues.margin.bottom,
      ]); // Spacing between bars.
    // .padding([.4])

    let labelOffsets = this.chartBreakpointValues.labelOffsets;
    let labelOffset = domains.length <= labelOffsets.length ? labelOffsets[domains.length - 1] : this.chartBreakpointValues.labelOffsets[0];

    this.yAxis = (g) =>
      g
        .attr("class", "bar-label")
        .attr("transform", "translate(5," + labelOffset + ")") // Relative positioning of label.
        .call(d3.axisLeft(this.y)
          .tickSize(0)
          .tickFormat(i => this.translationsObj.displayOrder[i]))
        .call((g) => g.selectAll(".domain").remove());

    this.tooltip = d3
      .select("cagov-chart-equity-data-completeness")
      .append("div")
      .attr("class", "tooltip-container tooltip-container--missingness")
      .text(this.translationsObj['empty-tooltip']);

    drawBars(
      this.svg,
      this.x,
      this.y,
      this.yAxis,
      stackedData,
      this.color,
      data,
      this.tooltip,
      this.translationsObj
    );
  }

  render() {
    getScreenResizeCharts(this);
    this.screenDisplayType = window.charts ? window.charts.displayType : 'desktop';
    this.chartBreakpointValues = this.chartOptions[this.screenDisplayType ? this.screenDisplayType : 'desktop'];

    this.resetTitle();
    let data = this.formatDataSet(this.alldata[this.selectedMetric]);
    this.drawSvg(data);

    // fetch date for footnote
    // console.log("rendering",this.selectedMetric,this.alldata);
    if (this.selectedMetric in this.alldata && 'cases' in this.alldata[this.selectedMetric]) {
      this.updateDate = this.alldata[this.selectedMetric].cases.REPORT_DATE; // localize?
    } else {
      this.updateDate = 'Unknown';
    }
    // console.log("Update Date",this.updateDate);
    this.resetUpdateDate();
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
window.customElements.define(
  "cagov-chart-equity-data-completeness",
  CAGOVEquityMissingness
);
