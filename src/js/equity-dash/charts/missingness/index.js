import template from "./template.js";
import drawBars from "./draw.js";
import getTranslations from '../../get-strings-list.js';
import getScreenDisplayType from '../../get-window-size.js';

class CAGOVEquityMissingness extends window.HTMLElement {
  connectedCallback() {
    // Set window object and resize event listener (ideally set at a higher level, can move up once this is working.)
    getScreenDisplayType();

    const handleResize = () => {
      this.screenDisplayType = window.equitydash.displayType;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    // Settings and initial values
    this.chartDisplayOptions = {
      desktop: {
        fontSize: 14, // Pass in as a calculation.
        height: 214,
        width: 613,
        margin: {
          top: 40,
          right: 0,
          bottom: 20,
          left: 0,
        },
        labelOffsets: [-52, -52, -57],
        backgroundFill: '#F2F5FC',
        chartColors: ["#92C5DE", "#FFCF44"],
        subgroups: ["NOT_MISSING", "MISSING"],
        selectedMetric: "race_ethnicity",
        dataUrl: "https://files.covid19.ca.gov/data/to-review/equitydash/missingness-california.json", // Overwritten by county.
        state: 'California',
        county: 'California',
        heightMultiplier: 100,
        displayOrder: ["tests", "cases", "deaths"],
      },
      tablet: {
        fontSize: 14, // Pass in as a calculation.
        height: 214,
        width: 613,
        margin: {
          top: 40,
          right: 0,
          bottom: 20,
          left: 0,
        },
        labelOffsets: [-52, -52, -57],
        backgroundFill: '#F2F5FC',
        chartColors: ["#92C5DE", "#FFCF44"],
        subgroups: ["NOT_MISSING", "MISSING"],
        selectedMetric: "race_ethnicity",
        dataUrl: "https://files.covid19.ca.gov/data/to-review/equitydash/missingness-california.json",
        state: 'California',
        county: 'California',
        heightMultiplier: 100,
        displayOrder: ["tests", "cases", "deaths"],
      },
      mobile: {
        fontSize: 14, // Pass in as a calculation.
        height: 600,
        width: 400,
        margin: {
          top: 40,
          right: 0,
          bottom: 20,
          left: 0,
        },
        labelOffsets: [-52, -52, -57],
        backgroundFill: '#F2F5FC',
        chartColors: ["#92C5DE", "#FFCF44"],
        subgroups: ["NOT_MISSING", "MISSING"],
        selectedMetric: "race_ethnicity",
        dataUrl: "https://files.covid19.ca.gov/data/to-review/equitydash/missingness-california.json",
        state: 'California',
        county: 'California',
        heightMultiplier: 100,
        displayOrder: ["tests", "cases", "deaths"],
      },
    };

    // Choose settings for current screen display.
    // Display content & layout dimensions
    this.chartSettings = this.chartDisplayOptions[this.screenDisplayType ? this.screenDisplayType : 'desktop'];

    this.innerHTML = template();

    this.metricFilter = document.querySelector(
      "cagov-chart-filter-buttons.js-missingness-smalls"
    );

    this.svg = d3
      .select(this.querySelector(".svg-holder"))
      .append("svg")
      .attr("viewBox", [0, 0, this.chartSettings.width, this.chartSettings.height])
      .append("g")
      .attr(
        "transform",
        "translate(" +
          this.chartSettings.margin.left +
          "," +
          this.chartSettings.margin.top +
          ")"
      );

    this.color = d3
      .scaleOrdinal()
      .domain(this.chartSettings.subgroups)
      .range(this.chartSettings.chartColors);

    // Set default values for data and labels
    this.dataUrl = this.chartSettings.dataUrl;
    this.county = this.chartSettings.county;
    this.state = this.chartSettings.state;
    this.selectedMetric = this.chartSettings.selectedMetric;

    this.retrieveData(this.dataUrl);
    this.listenForLocations();

  }

  listenForLocations() {
    let searchElement = document.querySelector("cagov-county-search");
    searchElement.addEventListener(
      "county-selected",
      function (e) {
        this.county = e.detail.county;
        this.dataUrl =
          "https://files.covid19.ca.gov/data/to-review/equitydash/missingness-" +
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
    let displayOrder = this.chartSettings.displayOrder;
    let domains = [];
    displayOrder.map((key) => {
      let position = unsortedDomains.indexOf(key);
      if (position >= 0) {
        domains.push(key);
      }
    });
    return domains;
  }

  render() {
    let data = this.formatDataSet(this.alldata[this.selectedMetric]);
    let stackedData = d3.stack().keys(this.chartSettings.subgroups)(data);
    let domains = this.getDomains(data); // Get list of data domains for this dataset.

    this.translationsObj = this.getTranslations();
    this.resetTitle();

    let heightMultiplier = this.chartSettings.heightMultiplier;
    let svgHeight = heightMultiplier * domains.length;

    d3.select(this.querySelector(".svg-holder svg")).attr("viewBox", [
      0,
      0,
      this.chartSettings.width,
      svgHeight,
    ]); // Reset height.

    this.x = d3
      .scaleLinear()
      .domain([0, d3.max(stackedData, (d) => d3.max(d, (d) => d[1]))])
      .range([0, this.chartSettings.width]);

    this.y = d3
      .scaleBand()
      .domain(domains)
      .range([
        this.chartSettings.margin.top,
        svgHeight - this.chartSettings.margin.bottom,
      ]); // Spacing between bars.
    // .padding([.4])

    let labelOffsets = this.chartSettings.labelOffsets;
    let labelOffset = domains.length <= labelOffsets.length ? labelOffsets[domains.length - 1] : this.chartSettings.labelOffsets[0];

    this.yAxis = (g) =>
      g
        .attr("class", "bar-label")
        .attr("transform", "translate(5," + labelOffset + ")") // Relative positioning of label.
        .call(d3.axisLeft(this.y).tickSize(0))
        .call((g) => g.selectAll(".domain").remove());


    this.tooltip = d3
      .select("cagov-chart-equity-missingness")
      .append("div")
      .attr("class", "equity-tooltip equity-tooltip--missingness")
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
        return tooltipHTML;
      }
    return translations;
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
  "cagov-chart-equity-missingness",
  CAGOVEquityMissingness
);
