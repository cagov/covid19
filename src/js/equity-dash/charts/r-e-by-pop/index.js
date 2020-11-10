import template from './template.js';
import drawBars from './draw-chart.js';

class CAGOVEquityREPop extends window.HTMLElement {
  connectedCallback () {
    this.dimensions = ({
      height: 650,
      width: 450,
      margin: {
        top: 20,
        right: 30,
        bottom: 20,
        left: 10
      }
    })

    this.selectedMetric = 'cases';
    this.selectedMetricDescription = 'Cases';
    this.chartTitle = function() {
      return `${this.selectedMetric} relative to percentage of population in ${this.county}`;
    }
    this.description = function () {
      return `Compare the percentage of each race and ethnicity’s share of statewide ${this.selectedMetricDescription.toLowerCase()} to their percentage of ${this.county}’s population.`;
    }
    this.county = 'California';
    this.legendString = function() {
      console.log('returning ')
      console.log(this.selectedMetricDescription.toLowerCase())
      if(this.county === 'California') {
        return `of ${this.selectedMetricDescription.toLowerCase()} statewide`;
      }
      return `of ${this.selectedMetricDescription.toLowerCase()} in county`;
    }
    
    this.innerHTML = template(this.chartTitle(), this.description());

    this.svg = d3
      .select(this.querySelector('.svg-holder'))
      .append("svg")
      .attr("viewBox", [0, 0, this.dimensions.width, this.dimensions.height])
      .append("g")
      .attr(
        "transform",
        "translate(" + this.dimensions.margin.left + "," + this.dimensions.margin.top + ")"
      );

    this.tooltip = d3
      .select("cagov-chart-re-pop")
      .append("div")
      .attr("class", "equity-tooltip equity-tooltip--re100k")
      .text("an empty tooltip");

    this.subgroups1 = ["METRIC_TOTAL_PERCENTAGE", "METRIC_TOTAL_DELTA"]
    this.subgroups2 = ["POPULATION_PERCENTAGE", "POPULATION_PERCENTAGE_DELTA"]
    
    this.color2 = d3
      .scaleOrdinal()
      .domain(this.subgroups2)
      .range(['#92C5DE', '#F2F5FC'])

    this.color1 = d3
      .scaleOrdinal()
      .domain(this.subgroups1)
      .range(['#FFCF44', '#F2F5FC'])

    this.retrieveData('https://files.covid19.ca.gov/data/to-review/equitydash/cumulative-california.json');
    this.listenForLocations();
    this.county = 'California';
    this.resetTitle()
  }

  listenForLocations() {
    let searchElement = document.querySelector('cagov-county-search');
    searchElement.addEventListener('county-selected', function (e) {
      this.county = e.detail.county;
      if(this.selectedMetric === "deaths") {
        this.selectedMetric = "cases";
      }
      this.retrieveData('https://files.covid19.ca.gov/data/to-review/equitydash/cumulative-'+this.county.toLowerCase().replace(/ /g,'')+'.json')
      this.resetTitle()
    }.bind(this), false);
    
    let metricFilter = document.querySelector('cagov-chart-filter-buttons.js-re-smalls')
    metricFilter.addEventListener('filter-selected', function (e) {
      this.selectedMetricDescription = e.detail.clickedFilterText;
      this.selectedMetric = e.detail.filterKey;
      if(this.alldata) {
        this.render()
        this.resetDescription()
        this.resetTitle()
      }
    }.bind(this), false);
  }

  resetTitle() {
    this.querySelector('.chart-title').innerHTML = this.chartTitle();
  }

  resetDescription() {
    this.querySelector('.chart-description').innerHTML = this.description();
  }

  render() {
    let data = this.alldata.filter(item => (item.METRIC === this.selectedMetric && item.DEMOGRAPHIC_SET_CATEGORY !== "Other" && item.DEMOGRAPHIC_SET_CATEGORY !== "Unknown"))
    data.forEach(d => {
      d.METRIC_VALUE_PER_100K_CHANGE_30_DAYS_AGO = d.METRIC_VALUE_PER_100K_DELTA_FROM_30_DAYS_AGO / d.METRIC_VALUE_PER_100K_30_DAYS_AGO;
    })
    data.sort(function(a, b) {
      return d3.descending(a.SORT_METRIC, b.SORT_METRIC);
    })
    // let groups = d3.map(dataSorted, d => d.DEMOGRAPHIC_SET_CATEGORY).keys()
    // don't know why the above never works, so keep hardcoding it
    // need to inherit this as a mapping of all possible values to desired display values becuase these differ in some tables
    let groups = ["Latino", "Native Hawaiian and other Pacific Islander", "American Indian", "African American", "Multi-Race", "White", "Asian American"]

    let stackedData1 = d3.stack().keys(this.subgroups1)(data)
    let stackedData2 = d3.stack().keys(this.subgroups2)(data);

    this.y = d3
      .scaleBand()
      .domain(groups)
      .range([this.dimensions.margin.top, this.dimensions.height - this.dimensions.margin.bottom])
      .padding([.5])     

    let yAxis = g =>
      g
        .attr("class", "bar-label")
        .attr("transform", "translate(4," + -30 + ")")
        .call(d3.axisLeft(this.y).tickSize(0))
        .call(g => g.selectAll(".domain").remove())

    let x2 = d3
      .scaleLinear()
      .domain([0, d3.max(stackedData2, d => d3.max(d, d => d[1]))])
      .range([0, this.dimensions.width - this.dimensions.margin.right - 40])

    let x1 = d3
      .scaleLinear()
      .domain([0, d3.max(stackedData1, d => d3.max(d, d => d[1]))])
      .range([0, this.dimensions.width - this.dimensions.margin.right - 40])

    let xAxis = g =>
      g
        .attr("transform", "translate(0," + this.dimensions.width + ")")
        .call(d3.axisBottom(x1).ticks(width / 50, "s"))
        .remove()

    drawBars(this.svg, x1, x2, this.y, yAxis, stackedData1, stackedData2, this.color1, this.color2, data, this.tooltip, this.legendString())
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
window.customElements.define('cagov-chart-re-pop', CAGOVEquityREPop);