import template from './template.js';
import {writeXAxis, rewriteLegend, writeLegend, writeBars, rewriteBars, writeBarLabels, writeSparklines, rewriteBarLabels} from './draw.js';
import getTranslations from '../../get-strings-list.js';
import getScreenResizeCharts from './../../get-window-size.js';

class CAGOVChartD3Bar extends window.HTMLElement {
  connectedCallback () {
    // stuff from observables: https://observablehq.com/@aaronhans/covid-19-case-rate-by-income-bracket-in-california
    // let height = 500;
    // let width = 842;
    // let margin = ({top: 88, right: 0, bottom: 30, left: 10})

    this.chartOptions = {
      // Data
      // subgroups: ["NOT_MISSING", "MISSING"],
      // selectedMetric: "race_ethnicity",
      // dataUrl: config.equityChartsDataLoc+"/equitydash/missingness-california.json", // Overwritten by county.
      // state: 'California',
      // county: 'California',
      // displayOrder: ["tests", "cases", "deaths"],
      // // Style
      // backgroundFill: '#F2F5FC',
      // chartColors: ["#92C5DE", "#FFCF44"],
      // Breakpoints
      desktop: {
        width: 613,
        height: 500,
        margin: {
          top: 88, right: 0, bottom: 30, left: 10
        },
        sparkline: {
          width: 15,
          height: 20
        },
        legend: {
          y: 2
        }
      },
      tablet: {
        width: 440,
        height: 400,
        margin: {
          top: 88, right: 0, bottom: 30, left: 10
        },
        sparkline: {
          width: 15,
          height: 20
        },
        legend: {
          y: 0
        }
      },
      mobile: {
        width: 440,
        height: 400,
        margin: {
          top: 88, right: 0, bottom: 30, left: 10
        },
        sparkline: {
          width: 15,
          height: 20
        },
        legend: {
          y: 2
        }
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

    window.addEventListener('resize', handleChartResize);

    this.translationsObj = getTranslations(this);
    function sortedOrder(a,b) {
      return parseInt(a.SORT) - parseInt(b.SORT)
    }

    this.svg = d3.create("svg")
      .attr("viewBox", [0, 0, this.chartBreakpointValues.width, this.chartBreakpointValues.height])
      .attr("class","equity-bar-chart");
    
    Promise.all([
      window.fetch(config.equityChartsDataLoc+"/equitydash/social-data-income.json"),
      window.fetch(config.equityChartsDataLoc+"/equitydash/social-data-crowding.json"),
      window.fetch(config.equityChartsDataLoc+"/equitydash/social-data-insurance.json")
    ]).then(function (responses) {
      return Promise.all(responses.map(function (response) {
        return response.json();
      }));
    }).then(function (alldata) {
      let dataincome = alldata[0];
      let datacrowding = alldata[1];
      let datahealthcare = alldata[2];

      dataincome.sort(sortedOrder).reverse()
      datacrowding.sort(sortedOrder).reverse()
      datahealthcare.sort(sortedOrder).reverse()
  
      let y = d3.scaleLinear()
        .domain([0, d3.max(dataincome, d => d.CASE_RATE_PER_100K)]).nice()
        .range([this.chartBreakpointValues.height - this.chartBreakpointValues.margin.bottom, this.chartBreakpointValues.margin.top])
  
      let x = d3.scaleBand()
        .domain(d3.range(dataincome.length))
        .range([this.chartBreakpointValues.margin.left, this.chartBreakpointValues.width - this.chartBreakpointValues.margin.right])
        .padding(0.1)

      this.innerHTML = template(this.translationsObj);
      this.tooltip = this.querySelector('.chart-tooltip')  
      writeBars(this.svg, dataincome, x, y, this.chartBreakpointValues.width, this.tooltip);
      writeBarLabels(this.svg, dataincome, x, y, this.chartBreakpointValues.sparkline);
      let xAxis = writeXAxis(dataincome, this.chartBreakpointValues.height, this.chartBreakpointValues.margin, x);
  
      this.svg.append("g")
        .attr("class", "xaxis")
        .call(xAxis);
    
      this.svg.append("path")
        .attr("d", d3.line()([[20, this.chartBreakpointValues.height/2], [this.chartBreakpointValues.width - 20, this.chartBreakpointValues.height/2]]))
        .attr("stroke", "#1F2574")
        .style("stroke-dasharray", ("5, 5"));
      
      this.svg.append("text")
        .text(`${this.translationsObj.statewideCaseRate} ${parseFloat(dataincome[0].STATE_CASE_RATE_PER_100K).toFixed(1)}`)
        .attr("y", this.chartBreakpointValues.height / 2 - 15)
        .attr("x", 38)
        .attr('text-anchor','start')
        .attr('fill', '#1F2574')
        .attr('class','label bar-chart-label');

      writeLegend(this.svg, [this.translationsObj.casesPer100KPeople], this.chartBreakpointValues.width - 5, this.chartBreakpointValues.legend);

      this.querySelector('.svg-holder').appendChild(this.svg.node());
      this.applyListeners(this.svg, x, y, this.chartBreakpointValues.height, this.chartBreakpointValues.margin, xAxis, dataincome, datacrowding, datahealthcare, this.chartBreakpointValues)
      this.classList.remove('d-none')
    }.bind(this));

  }

  applyListeners(svg, x, y, height, margin, xAxis, dataincome, datacrowding, datahealthcare, chartBreakpointValues) {
    let toggles = this.querySelectorAll('.js-toggle-group');
    let component = this;
    toggles.forEach(tog => {
      tog.addEventListener('click',function(event) {
        event.preventDefault();
        if(this.classList.contains('healthcare')) {
          rewriteBar(datahealthcare)
          component.querySelector('.chart-title').innerHTML = component.translationsObj.chartTitleHealthcare;
        }
        if(this.classList.contains('housing')) {
          rewriteBar(datacrowding)
          component.querySelector('.chart-title').innerHTML = component.translationsObj.chartTitleHousing;
        }
        if(this.classList.contains('income')) {
          rewriteBar(dataincome)
          component.querySelector('.chart-title').innerHTML = component.translationsObj.chartTitleIncome;
        }
        resetToggles();
        tog.classList.add('toggle-active')
      })
    })

    function resetToggles() {
      toggles.forEach(toggle => {
        toggle.classList.remove('toggle-active')
      });
    }

    function rewriteBar(dataset) {
      y = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d.CASE_RATE_PER_100K)]).nice()
        .range([chartBreakpointValues.height - chartBreakpointValues.margin.bottom, chartBreakpointValues.margin.top])

      rewriteBars(svg, dataset, x, y);
      rewriteBarLabels(svg, dataset, x, y, chartBreakpointValues.sparkline);
      xAxis = writeXAxis(dataset, chartBreakpointValues.height, chartBreakpointValues.margin, x);
      svg.selectAll(".xaxis")
        .call(xAxis);
    }

  }
}
window.customElements.define('cagov-chart-d3-bar', CAGOVChartD3Bar);