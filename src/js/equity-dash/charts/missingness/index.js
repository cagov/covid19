import template from './template.js';
import drawBars from './draw.js';

class CAGOVEquityMissingness extends window.HTMLElement {
  connectedCallback () {

    this.dimensions = {
      height: 400,
      width: 600,
      margin: {
        top: 20,
        right: 30,
        bottom: 20,
        left: 30
      }
    }

    this.chartTitle = function() {
      let filterText = this.getFilterText();
      return `reporting by ${filterText.toLowerCase()} in ${this.county}`;
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
      );  

    this.subgroups = ["NOT_MISSING", "MISSING"];
    this.color = d3
      .scaleOrdinal()
      .domain(this.subgroups)
      .range(['#92C5DE', '#FFCF44'])

    this.y = d3
      .scaleBand()
      .domain(["tests", "cases", "deaths"])
      .range([this.dimensions.margin.top, this.dimensions.height - this.dimensions.margin.bottom])
      .padding([.6])

    this.yAxis = g => g
      .attr("class", "bar-label")
      .attr("transform", "translate(5," + -30 + ")")
      .call(d3.axisLeft(this.y).tickSize(0))
      .call(g => g.selectAll(".domain").remove())

    this.dataUrl = 'https://files.covid19.ca.gov/data/to-review/equitydash/missingness-california.json';
    this.retrieveData(this.dataUrl);
    this.listenForLocations();
    this.county = 'California';
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

  render() {
    let data = [];
    let casesObj = this.alldata[this.selectedMetric].cases;
    casesObj.METRIC = 'cases';
    data.push(casesObj);
    let deathsObj = this.alldata[this.selectedMetric].deaths;
    deathsObj.METRIC = 'deaths'
    data.push(deathsObj);
    if(this.alldata[this.selectedMetric].tests) {
      data.push(this.alldata[this.selectedMetric].tests);
    } else {
      let testsObj = {}
      testsObj.METRIC = "tests";
      testsObj.MISSING = 100;
      testsObj.NOT_MISSING = 0;
      testsObj.TOTAL = 100;
      testsObj.PERCENT_COMPLETE = 0.0;
      testsObj.PERCENT_COMPLETE_30_DAYS_PRIOR = 0.0;
      testsObj.PERCENT_COMPLETE_30_DAYS_DIFF = 0.0;
      data.push(testsObj);
    }

    data.forEach(d => {
      d.MISSING = d.MISSING / d.TOTAL;
      d.NOT_MISSING = d.NOT_MISSING / d.TOTAL;
    })
    data.sort(function(a, b) {
      return d3.descending(a.MISSING, b.MISSING);
    })
    let stackedData = d3.stack().keys(this.subgroups)(data)

    this.x = d3
      .scaleLinear()
      .domain([0, d3.max(stackedData, d => d3.max(d, d => d[1]))])
      .range([0, this.dimensions.width - this.dimensions.margin.right - 40])

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
