import template from './template.js';
import drawBars from './draw.js';

class CAGOVEquityMissingness extends window.HTMLElement {
  connectedCallback () {

    this.dimensions = {
      height: 214,
      width: 613,
      margin: {
        top: 40,
        right: 0,
        bottom: 20,
        left: 0
      }
    }

    this.chartTitle = function() {
      let filterText = this.getFilterText();
      if (this.county !== 'California') {
        return `Reporting by ${filterText.toLowerCase()} in ${this.county}`;
      } else {
        return `Reporting by ${filterText.toLowerCase()} in ${this.state}`;
      }
    }

    this.innerHTML = template();
    this.selectedMetric = 'race_ethnicity';
    this.metricFilter = document.querySelector('cagov-chart-filter-buttons.js-missingness-smalls');

    this.tooltip = d3
      .select("cagov-chart-equity-missingness")
      .append("div")
      .attr("class", "equity-tooltip equity-tooltip--missingness")
      .text("an empty tooltip");
    
    this.svg = d3
    .select(this.querySelector('.svg-holder'))
    .append("svg")
    .attr("viewBox", [0, 0, this.dimensions.width, this.dimensions.height])
    .append("g")
    .attr(
      "transform",
      "translate(" + this.dimensions.margin.left + "," + this.dimensions.margin.top + ")"
    )
  
    this.subgroups = ["NOT_MISSING", "MISSING"];
    this.color = d3
      .scaleOrdinal()
      .domain(this.subgroups)
      .range(['#92C5DE', '#FFCF44'])

    this.dataUrl = 'https://files.covid19.ca.gov/data/to-review/equitydash/missingness-california.json';
    this.retrieveData(this.dataUrl);
    this.listenForLocations();
    this.county = 'California';
    this.state = 'California';
    this.resetTitle()
  }

  listenForLocations() {
    let searchElement = document.querySelector('cagov-county-search');
    searchElement.addEventListener('county-selected', function (e) {
      this.county = e.detail.county;
      this.dataUrl ='https://files.covid19.ca.gov/data/to-review/equitydash/missingness-'+this.county.toLowerCase().replace(/ /g,'')+'.json'
      this.retrieveData(this.dataUrl);
      this.resetTitle()
    }.bind(this), false);

    this.metricFilter.addEventListener('filter-selected', function (e) {
      this.selectedMetricDescription = e.detail.clickedFilterText;
      this.selectedMetric = e.detail.filterKey;
      this.retrieveData(this.dataUrl);
      this.resetDescription()
      this.resetTitle()
    }.bind(this), false);
  }

  resetTitle() {
    this.querySelector('.chart-title').innerHTML = this.chartTitle()
  }

  getFilterText() {
    return this.metricFilter.querySelector('.active').textContent;
  }

  resetDescription() {}

  formatDataSet(dataSet) {
    let data = [];
    let casesObj = {};
    if (dataSet.cases !== undefined) {
      casesObj = dataSet.cases;
      casesObj.METRIC = 'cases';
      data.push(casesObj);
    }
    let deathsObj = {};
    if (dataSet.deaths !== undefined) {
      deathsObj = dataSet.deaths;
      deathsObj.METRIC = 'deaths';
      data.push(deathsObj);
    }
    let testsObj = {};
    if (dataSet.tests !== undefined) {
      testsObj = dataSet.tests;
      testsObj.METRIC = 'tests';
      data.push(dataSet.tests);
    }
    data.forEach(d => {
      this.formatDataObject(d);
    });
    data.sort(function(a, b) {
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
      if (isNaN(d.MISSING)){
        d.MISSING = 1
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
      if (isNaN(d.NOT_MISSING)){
        d.NOT_MISSING = 0
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
    let displayOrder = ['tests', 'cases', 'deaths'];
    let domains = [];
    displayOrder.map(key => {
      let position = unsortedDomains.indexOf(key);
      if (position >= 0) {
        domains.push(key);
      }
    })
    return domains;
  }

  render() {
    let data = this.formatDataSet(this.alldata[this.selectedMetric]);
    let stackedData = d3.stack().keys(this.subgroups)(data);

    let domains = this.getDomains(data); // Get list of data domains for this dataset.
    
    let heightMultiplier = 100;
    let svgHeight = heightMultiplier * domains.length;

    d3
      .select(this.querySelector('.svg-holder svg'))
      .attr("viewBox", [0, 0, this.dimensions.width, svgHeight]) // Reset height.

    this.x = d3
      .scaleLinear()
      .domain([0, d3.max(stackedData, d => d3.max(d, d => d[1]))])
      .range([0, this.dimensions.width])
    
    this.y = d3
      .scaleBand()
      .domain(domains)
      .range([this.dimensions.margin.top, svgHeight - this.dimensions.margin.bottom]) // Spacing between bars.
      // .padding([.4])

    let labelOffsets = [-52, -52, -57];
    let labelOffset = domains.length <= 3 ? labelOffsets[domains.length - 1] : -57;
    this.yAxis = g => g
      .attr("class", "bar-label")
      .attr("transform", "translate(5," + labelOffset + ")") // Relative positioning of label.
      .call(d3.axisLeft(this.y).tickSize(0))
      .call(g => g.selectAll(".domain").remove())

    drawBars(this.svg, this.x, this.y, this.yAxis, stackedData, this.color, data, this.tooltip)  
  }

  retrieveData(url) {
    window.fetch(url)
    .then(response => response.json())
    .then(function(alldata) {
      this.alldata = alldata;
      this.render();
    }.bind(this));
  }
}
window.customElements.define('cagov-chart-equity-missingness', CAGOVEquityMissingness);
