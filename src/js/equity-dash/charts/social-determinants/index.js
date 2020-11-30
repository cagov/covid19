import template from './template.js';
import {writeXAxis, rewriteLegend, writeLegend, writeBars, rewriteBars, writeBarLabels, writeSparklines, rewriteBarLabels} from './draw.js';
import getTranslations from '../../get-strings-list.js';

class CAGOVChartD3Bar extends window.HTMLElement {
  connectedCallback () {
    // stuff from observables: https://observablehq.com/@aaronhans/covid-19-case-rate-by-income-bracket-in-california
    let height = 500;
    let width = 842;
    let margin = ({top: 88, right: 0, bottom: 30, left: 10})

    this.translationsObj = getTranslations(this);
    function sortedOrder(a,b) {
      return parseInt(a.SORT) - parseInt(b.SORT)
    }

    this.svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
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
        .range([height - margin.bottom, margin.top])
  
      let x = d3.scaleBand()
        .domain(d3.range(dataincome.length))
        .range([margin.left, width - margin.right])
        .padding(0.1)

      writeBars(this.svg, dataincome, x, y, width);
      writeBarLabels(this.svg, dataincome, x, y);
      let xAxis = writeXAxis(dataincome, height, margin, x);
  
      this.svg.append("g")
        .attr("class", "xaxis")
        .call(xAxis);
    
      this.svg.append("path")
        .attr("d", d3.line()([[20, height/2], [width - 20, height/2]]))
        .attr("stroke", "#1F2574")
        .style("stroke-dasharray", ("5, 5"));
      
      this.svg.append("text")
        .text(`${this.translationsObj.statewideCaseRate} ${parseFloat(dataincome[0].STATE_CASE_RATE_PER_100K).toFixed(1)}`)
        .attr("y", height / 2 - 15)
        .attr("x", 38)
        .attr('text-anchor','start')
        .attr('fill', '#1F2574')
        .attr('class','label bar-chart-label');
        

      this.innerHTML = template(this.translationsObj);
      writeLegend(this.svg, [this.translationsObj.casesPer100KPeople], width - 5);
  
      this.classList.remove('d-none')
      this.querySelector('.svg-holder').appendChild(this.svg.node());
      window.tooltip = this.querySelector('.bar-overlay')
  
      this.applyListeners(this.svg, x, y, height, margin, xAxis, dataincome, datacrowding, datahealthcare)
    }.bind(this));
      
  }

  applyListeners(svg, x, y, height, margin, xAxis, dataincome, datacrowding, datahealthcare) {
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
        .range([height - margin.bottom, margin.top])

      rewriteBars(svg, dataset, x, y);
      rewriteBarLabels(svg, dataset, x, y);
      xAxis = writeXAxis(dataset, height, margin, x);
      svg.selectAll(".xaxis")
        .call(xAxis);
    }

  }
}
window.customElements.define('cagov-chart-d3-bar', CAGOVChartD3Bar);