import template from './template.js';
import drawBars from './draw-chart.js';
import drawSecondBars from './draw-chart-second.js';
import termCheck from '../race-ethnicity-config.js';
import getTranslations from '../../get-strings-list.js';

class CAGOVEquityREPop extends window.HTMLElement {
  connectedCallback () {
    this.dimensions = ({
      height: 700,
      width: 450,
      margin: {
        top: 20,
        right: 30,
        bottom: 1,
        left: 10
      }
    })

    this.dimensionsSecond = ({
      height: 212,
      width: 450,
      margin: {
        top: 1,
        right: 30,
        bottom: 20,
        left: 10
      }
    })

    this.translationsObj = getTranslations(this);
    this.selectedMetric = 'cases';
    this.selectedMetricDescription = 'Cases';
    this.county = 'California';

    this.chartTitle = function() {
      console.log("Getting chart title pop metric=",this.selectedMetric);
      let title = this.translationsObj['chartTitle--'+this.selectedMetric].replace('placeholderForDynamicLocation', this.county);
      return title;
    }

    this.description = function () {
      return this.translationsObj['chartDescription--'+this.selectedMetric].replace('placeholderForDynamicLocation', this.county);
    }
    this.legendString = function() {
      if(this.county === 'California') {
        return `of ${this.selectedMetricDescription.toLowerCase()} statewide`;
      } 
      return `of ${this.selectedMetricDescription.toLowerCase()} in county`;
    }

    this.legendStrings = function() {
      return [this.legendString(), this.translationsObj['chartLegend2--'+this.selectedMetric]];
    }
    
    this.innerHTML = template(this.chartTitle(), this.description());
    this.classList.remove('d-none')

    this.svg = d3
      .select(this.querySelector('.svg-holder'))
      .append("svg")
      .attr("viewBox", [0, 0, this.dimensions.width, this.dimensions.height])
      .append("g")
      .attr(
        "transform",
        "translate(" + this.dimensions.margin.left + "," + this.dimensions.margin.top + ")"
      );

    this.svgSecond = d3
      .select(this.querySelector('.svg-holder-second'))
      .append("svg")
      .attr("viewBox", [0, 0, this.dimensionsSecond.width, this.dimensionsSecond.height])
      .append("g")
      .attr(
        "transform",
        "translate(" + this.dimensionsSecond.margin.left + "," + this.dimensionsSecond.margin.top + ")"
      );  

    this.tooltip = d3
      .select("cagov-chart-re-pop")
      .append("div")
      .attr("class", "chart-tooltip chart-tooltip--re100k")
      .text("an empty tooltip");

    this.subgroups1 = ["METRIC_TOTAL_PERCENTAGE", "METRIC_TOTAL_DELTA"]
    this.subgroups2 = ["POPULATION_PERCENTAGE", "POPULATION_PERCENTAGE_DELTA"]
    
    this.color1 = d3
    .scaleOrdinal()
    .domain(this.subgroups1)
    .range(['#FFCF44', '#F2F5FC'])

    this.color2 = d3
      .scaleOrdinal()
      .domain(this.subgroups2)
      .range(['#92C5DE', '#F2F5FC'])

    this.retrieveData(config.equityChartsDataLoc+'/equitydash/cumulative-california.json');
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
      this.retrieveData(config.equityChartsDataLoc+'/equitydash/cumulative-'+this.county.toLowerCase().replace(/ /g,'')+'.json')
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
    let data = this.alldata.filter(item => (item.METRIC === this.selectedMetric && item.DEMOGRAPHIC_SET_CATEGORY !== "Other" && item.DEMOGRAPHIC_SET_CATEGORY !== "Unknown"));
    let secondData = this.alldata.filter(item => (item.METRIC === this.selectedMetric && (item.DEMOGRAPHIC_SET_CATEGORY === "Other" || item.DEMOGRAPHIC_SET_CATEGORY === "Unknown")));

    // we map the race/ethnicities in the db to the desired display values here
    let displayDemoMap = termCheck();
    data.forEach(d => {
      if(displayDemoMap.get(d.DEMOGRAPHIC_SET_CATEGORY)) {
        d.DEMOGRAPHIC_SET_CATEGORY = displayDemoMap.get(d.DEMOGRAPHIC_SET_CATEGORY);
      }
    })

    secondData.forEach(d => {
      if(displayDemoMap.get(d.DEMOGRAPHIC_SET_CATEGORY)) {
        d.DEMOGRAPHIC_SET_CATEGORY = displayDemoMap.get(d.DEMOGRAPHIC_SET_CATEGORY);
      }
    })

    data.sort(function(a, b) {
      return d3.descending(a.METRIC_TOTAL_PERCENTAGE, b.METRIC_TOTAL_PERCENTAGE);
    })

    secondData.sort(function(a, b) {
      return d3.descending(a.METRIC_TOTAL_PERCENTAGE, b.METRIC_TOTAL_PERCENTAGE);
    })
    // need to inherit this as a mapping of all possible values to desired display values becuase these differ in some tables
    // let groups = ["Latino", "Native Hawaiian and other Pacific Islander", "American Indian", "African American", "Multi-Race", "White", "Asian American"]
    let groups = data.map(item => item.DEMOGRAPHIC_SET_CATEGORY); // ["Native Hawaiian and other Pacific Islander", "Latino", "American Indian", "African American", "Multi-Race", "White", "Asian American"]
    // Push second section data to end of data array.
    let groupsSecond = secondData.map(item => item.DEMOGRAPHIC_SET_CATEGORY); // ["Other", "Unknown"]

    let stackedData1 = d3.stack().keys(this.subgroups1)(data);
    let stackedData2 = d3.stack().keys(this.subgroups2)(data);
    let stackedData1Second = d3.stack().keys(this.subgroups1)(secondData);

    this.y = d3
      .scaleBand()
      .domain(groups)
      .range([this.dimensions.margin.top, this.dimensions.height - this.dimensions.margin.bottom])
      .padding([.6])

    this.ySecond = d3
      .scaleBand()
      .domain(groupsSecond)
      .range([this.dimensionsSecond.margin.top, this.dimensionsSecond.height - this.dimensionsSecond.margin.bottom])
      .padding([.2])     

    let yAxis = g =>
      g
        .attr("class", "bar-label")
        .attr("transform", "translate(4," + -32 + ")")
        .call(d3.axisLeft(this.y).tickSize(0))
        .call(g => g.selectAll(".domain").remove())

    let yAxisSecond = g =>
    g
      .attr("class", "bar-label")
      .attr("transform", "translate(4," + -44 + ")")
      .call(d3.axisLeft(this.ySecond).tickSize(0))
      .call(g => g.selectAll(".domain").remove())

    let x1 = d3
      .scaleLinear()
      .domain([0, d3.max(stackedData1, d => d3.max(d, d => d[1]))])
      .range([0, this.dimensions.width - this.dimensions.margin.right - 40])

    let x2 = d3
      .scaleLinear()
      .domain([0, d3.max(stackedData2, d => d3.max(d, d => d[1]))])
      .range([0, this.dimensions.width - this.dimensions.margin.right - 40])

    let xAxis = g =>
      g
        .attr("transform", "translate(0," + this.dimensions.width + ")")
        .call(d3.axisBottom(x1).ticks(width / 50, "s"))
        .remove()

    drawBars(this.svg, x1, x2, this.y, yAxis, stackedData1, stackedData2, this.color1, this.color2, data, this.tooltip, this.legendStrings(), this.selectedMetric, this.translationsObj)
    drawSecondBars(this.svgSecond, x1, x2, this.ySecond, yAxisSecond, stackedData1Second, this.color1, secondData, this.tooltip, this.legendString(), this.selectedMetric, this.translationsObj)
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