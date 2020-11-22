import template from './template.js';
import drawBars from './draw-chart.js';
import termCheck from '../race-ethnicity-config.js';
import getTranslations from '../../get-strings-list.js';

class CAGOVEquityRE100K extends window.HTMLElement {
  connectedCallback () {

    this.dimensions = ({
      height: 642,
      width: 450,
      margin: {
        top: 20,
        right: 30,
        bottom: 20,
        left: 10
      }
    })

    this.translationsObj = getTranslations(this);
    this.selectedMetric = 'cases';
    this.selectedMetricDescription = 'Cases';
    this.chartTitle = function() {
      return `${this.selectedMetricDescription} rate per 100K by race and ethnicity group in ${this.county}`;
    }
    this.description = function (selectedMetricDescription) {
      return `Compare ${selectedMetricDescription.toLowerCase()} adjusted by population size across each race and ethnicity.`;
    }
    this.county = 'California';
    this.innerHTML = template(this.chartTitle(), this.description(this.selectedMetricDescription));

    this.tooltip = d3
      .select("cagov-chart-re-100k")
      .append("div")
      .attr("class", "equity-tooltip equity-tooltip--re100k")
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

    this.subgroups = ["METRIC_VALUE_PER_100K", "WORST_VALUE_DELTA"]
    this.color = d3
      .scaleOrdinal()
      .domain(this.subgroups)
      .range(['#FFCF44', '#F2F5FC'])

    this.dataUrl = 'https://files.covid19.ca.gov/data/to-review/equitydash/cumulative-california.json';
    this.dataStatewideRateUrl = 'https://files.covid19.ca.gov/data/to-review/equitydash/cumulative-combined.json';
    this.retrieveData(this.dataUrl, this.dataStatewideRateUrl);
    this.listenForLocations();
    this.county = 'California'
    this.resetTitle()
  }

  listenForLocations() {
    let searchElement = document.querySelector('cagov-county-search');
    searchElement.addEventListener('county-selected', function (e) {
      this.county = e.detail.county;
      if(this.selectedMetric === "deaths") {
        this.selectedMetric = "cases";
      }
      this.dataUrl = 'https://files.covid19.ca.gov/data/to-review/equitydash/cumulative-'+this.county.toLowerCase().replace(/ /g,'')+'.json';
      this.retrieveData(this.dataUrl, this.dataStatewideRateUrl);
      this.resetTitle(this.county)
    }.bind(this), false);

    let metricFilter = document.querySelector('cagov-chart-filter-buttons.js-re-smalls')
    metricFilter.addEventListener('filter-selected', function (e) {
      this.selectedMetricDescription = e.detail.clickedFilterText;
      this.selectedMetric = e.detail.filterKey;
      this.retrieveData(this.dataUrl, this.dataStatewideRateUrl);
      this.resetDescription()
      this.resetTitle()
    }.bind(this), false);
  }

  resetTitle() {
    this.querySelector('.chart-title').innerHTML = this.chartTitle();
  }

  resetDescription() {
    this.querySelector('.chart-description').innerHTML = this.description(this.selectedMetricDescription);
  }

  render() {
    let data = this.alldata.filter(item => (item.METRIC === this.selectedMetric && item.DEMOGRAPHIC_SET_CATEGORY !== "Other" && item.DEMOGRAPHIC_SET_CATEGORY !== "Unknown"))
    let displayDemoMap = termCheck();

    data.forEach(d => {
      d.METRIC_VALUE_PER_100K_CHANGE_30_DAYS_AGO = 0;
      if(d.METRIC_VALUE_PER_100K_30_DAYS_AGO) {
        d.METRIC_VALUE_PER_100K_CHANGE_30_DAYS_AGO = d.METRIC_VALUE_PER_100K_DELTA_FROM_30_DAYS_AGO / d.METRIC_VALUE_PER_100K_30_DAYS_AGO;
      }
      // we map the race/ethnicities in the db to the desired display values here
      if(displayDemoMap.get(d.DEMOGRAPHIC_SET_CATEGORY)) {
        d.DEMOGRAPHIC_SET_CATEGORY = displayDemoMap.get(d.DEMOGRAPHIC_SET_CATEGORY);
      }
    })

    data.sort(function(a, b) {
      return d3.descending(a.METRIC_VALUE_PER_100K, b.METRIC_VALUE_PER_100K);
    })
    // ordering this array by the order they are in in data
    // need to inherit this as a mapping of all possible values to desired display values becuase these differ in some tables
    let groups = data.map(item => item.DEMOGRAPHIC_SET_CATEGORY);
    
    let stackedData = d3.stack().keys(this.subgroups)(data)

    this.y = d3
      .scaleBand()
      .domain(groups)
      .range([this.dimensions.margin.top, this.dimensions.height - this.dimensions.margin.bottom])
      .padding([.6])      

    let yAxis = g =>
      g
        .attr("class", "bar-label")
        .attr("transform", "translate(5," + -32 + ")")
        .call(d3.axisLeft(this.y).tickSize(0))
        .call(g => g.selectAll(".domain").remove())  

    let x = d3
      .scaleLinear()
      .domain([0, d3.max(stackedData, d => d3.max(d, d => d[1]))])
      .range([0, this.dimensions.width - this.dimensions.margin.right - 50])

    let xAxis = g =>
      g
        .attr("transform", "translate(0," + this.dimensions.width + ")")
        .call(d3.axisBottom(x).ticks(width / 50, "s"))
        .remove()      

    let statewideRatePer100k = this.combinedData[this.selectedMetric] ? this.combinedData[this.selectedMetric].METRIC_VALUE_PER_100K : null;
    drawBars(this.svg, x, this.y, yAxis, stackedData, this.color, data, this.tooltip, this.selectedMetricDescription, statewideRatePer100k);
  }

  retrieveData(url, statewideUrl) {
    Promise.all([
      window.fetch(url),
      window.fetch(statewideUrl)
    ]).then(function (responses) {
      return Promise.all(responses.map(function (response) {
        return response.json();
      }));
    }).then(function (requestData) {
      this.alldata = requestData[0];
      this.combinedData = requestData[1];
      this.render();
    }.bind(this));
  }
}
window.customElements.define('cagov-chart-re-100k', CAGOVEquityRE100K);