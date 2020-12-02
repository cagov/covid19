import template from './template.js';
import {writeXAxis, rewriteLegend, writeLegend, writeBars, rewriteBars, writeBarLabels, writeSparklines, rewriteBarLabels, redrawYLine} from './draw.js';
import getTranslations from '../../get-strings-list.js';
import getScreenResizeCharts from './../../get-window-size.js';
import reportGA from '../../../tracking-you';
class CAGOVChartD3Bar extends window.HTMLElement {
  connectedCallback () {
    // console.log("Setting up CAGOVChartD3Bar");
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
      retina: {
        width: 320,
        height: 300,
        margin: {
          top: 40, right: 0, bottom: 30, left: 10
        },
        sparkline: {
          width: 10,
          height: 23
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
      this.tooltip = this.querySelector('.tooltip-container'); // @TODO: Q: where did the class go? tooltip is coming back null.
      writeBars(this, this.svg, dataincome, x, y, this.chartBreakpointValues.width, this.tooltip);
      writeBarLabels(this.svg, dataincome, x, y, this.chartBreakpointValues.sparkline);
      let xAxis = writeXAxis(dataincome, this.chartBreakpointValues.height, this.chartBreakpointValues.margin, x);
  
      this.svg.append("g")
        .attr("class", "xaxis")
        .call(xAxis);

      let yDValue = dataincome[0].STATE_CASE_RATE_PER_100K
      this.yDValue = yDValue;

      redrawYLine(this, y);

      // let yDottedLinePos = y(yDValue); // this.chartBreakpointValues.height/2
      // let yXAnchor = this.chartBreakpointValues.width - 18;

      // this.svg.append("path")
      //   .attr("d", d3.line()([[20, yDottedLinePos], 
      //                         [this.chartBreakpointValues.width - 20, yDottedLinePos]]))
      //   .attr("stroke", "#1F2574")
      //   .attr("opacity", 0.5)
      //   .style("stroke-dasharray", ("5, 5"))
      //   .attr('class','label bar-chart-yline');
      
      // this.svg.append("text")
      //   .text(`${this.translationsObj.statewideCaseRate} ${parseFloat(dataincome[0].STATE_CASE_RATE_PER_100K).toFixed(1)}`)
      //   .attr("y", yDottedLinePos - 15)
      //   // .attr("x", 38)
      //   // .attr('text-anchor','start')
      //   .attr("x", yXAnchor)
      //   .attr('text-anchor','end')
      //   .attr('fill', '#1F2574')
      //   .attr('class','label bar-chart-label');

      writeLegend(this.svg, [this.translationsObj.casesPer100KPeople], this.chartBreakpointValues.width - 5, this.chartBreakpointValues.legend);

      this.querySelector('.svg-holder').appendChild(this.svg.node());
      this.applyListeners(this.svg, x, y, this.chartBreakpointValues.height, this.chartBreakpointValues.margin, xAxis, dataincome, datacrowding, datahealthcare, this.chartBreakpointValues)
      this.classList.remove('d-none')
    }.bind(this));

  }

  ariaLabel(d) {
      // this is currently the same as the tooltip with span tags removed...
      // placeholderCaseRate cases per 100K people. placeholderRateDiff30 change since previous week
      // ${parseFloat(d.CASE_RATE_PER_100K).toFixed(1)} cases per 100K people. ${parseFloat(d.RATE_DIFF_30_DAYS).toFixed(1)}% change since previous week
      let templateStr = this.translationsObj['ariaBarLabel']
      let label = templateStr
                    .replace('placeholderCaseRate',parseFloat(d.CASE_RATE_PER_100K).toFixed(1))
                    .replace('placeholderRateDiff30',parseFloat(d.RATE_DIFF_30_DAYS).toFixed(1) + '%');
      return label;
  }
  tooltipCaption(d) {
      // <span class="highlight-data">placeholderCaseRate</span> cases per 100K people. placeholderRateDiff30 change since previous week
      // <span class="highlight-data">${parseFloat(d.CASE_RATE_PER_100K).toFixed(1)}</span> cases per 100K people. ${parseFloat(d.RATE_DIFF_30_DAYS).toFixed(1)}% change since previous week
      let templateStr = this.translationsObj['tooltipCaption']
      let caption = templateStr
                    .replace('placeholderCaseRate',parseFloat(d.CASE_RATE_PER_100K).toFixed(1))
                    .replace('placeholderRateDiff30',parseFloat(d.RATE_DIFF_30_DAYS).toFixed(1) + '%');
      return caption;
  }

  applyListeners(svg, x, y, height, margin, xAxis, dataincome, datacrowding, datahealthcare, chartBreakpointValues) {
    let toggles = this.querySelectorAll('.js-toggle-group');
    let component = this;
    let tab_recs = [{nom:'healthcare',data:datahealthcare, tranHTML:component.translationsObj.chartTitleHealthcare},
                    {nom:'housing',data:datacrowding, tranHTML:component.translationsObj.chartTitleHousing},
                    {nom:'healthcare',data:dataincome, tranHTML:component.translationsObj.chartTitleIncome},
                   ];

    toggles.forEach(tog => {
      tog.addEventListener('click',function(event) {

        console.log("Got Social Toggle: ",this.classList);
        event.preventDefault();
        tab_recs.forEach(tRec => {
          // console.log("Checking ",tRec.nom,this.classList);
          if(this.classList.contains(tRec.nom)) {
           // console.log("Hit on ",tRec.nom);
           const event = new window.CustomEvent('tab-select',{detail:{tab_selected: tRec.nom}});
            window.dispatchEvent(event);    
            rewriteBar(component, tRec.data)
            component.querySelector('.chart-title').innerHTML = tRec.tranHTML;
          }
        });
        /* if(this.classList.contains('healthcare')) {
          gen_tab_event('healthcare');
          rewriteBar(component, datahealthcare)
          component.querySelector('.chart-title').innerHTML = component.translationsObj.chartTitleHealthcare;
        }
        if(this.classList.contains('housing')) {
          gen_tab_event('healthcare');
          rewriteBar(component, datacrowding)
          component.querySelector('.chart-title').innerHTML = component.translationsObj.chartTitleHousing;
        }
        if(this.classList.contains('income')) {
          rewriteBar(component, dataincome)
          component.querySelector('.chart-title').innerHTML = component.translationsObj.chartTitleIncome;
        } */
        resetToggles();
        tog.classList.add('toggle-active')
      })
    })

    function resetToggles() {
      toggles.forEach(toggle => {
        toggle.classList.remove('toggle-active')
      });
    }

    function rewriteBar(component, dataset) {
      // console.log("Redraw Bar");
      y = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d.CASE_RATE_PER_100K)]).nice()
        .range([chartBreakpointValues.height - chartBreakpointValues.margin.bottom, chartBreakpointValues.margin.top])

      rewriteBars(component, svg, dataset, x, y);
      rewriteBarLabels(svg, dataset, x, y, chartBreakpointValues.sparkline);
      xAxis = writeXAxis(dataset, chartBreakpointValues.height, chartBreakpointValues.margin, x);
      svg.selectAll(".xaxis")
        .call(xAxis);
      redrawYLine(component, y);
    }


  }
}
window.customElements.define('cagov-chart-d3-bar', CAGOVChartD3Bar);