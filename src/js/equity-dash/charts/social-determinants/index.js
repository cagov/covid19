import template from './template.js';
import {writeXAxis, writeXAxisLabel, rewriteLegend, writeLegend, writeBars, rewriteBars, writeBarLabels, writeSparklines, rewriteBarLabels, redrawYLine} from './draw.js';
import getTranslations from '../../get-strings-list.js';
import getScreenResizeCharts from './../../get-window-size.js';
import rtlOverride from "./../../rtl-override.js";
import { reformatReadableDate } from "../../readable-date.js";

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
          top: 88, right: 0, bottom: 50, left: 10
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
        width: 500, // 440 x 400
        height: 450,
        margin: {
          top: 88, right: 0, bottom: 40, left: 10
        },
        sparkline: {
          width: 15,
          height: 20
        },
        legend: {
          y: 2
        }
      },
      mobile: { // 440x400
        width: 440,
        height: 400,
        margin: {
          top: 88, right: 0, bottom: 40, left: 10
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
        width: 330,
        height: 300,
        margin: {
          top: 40, right: 0, bottom: 40, left: 10
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

      let updateDate = reformatReadableDate( dataincome[0].DATE ); // localized readable date

      let y = d3.scaleLinear()
        .domain([0, d3.max(dataincome, d => d.CASE_RATE_PER_100K)]).nice()
        .range([this.chartBreakpointValues.height - this.chartBreakpointValues.margin.bottom, this.chartBreakpointValues.margin.top])
  
      let x = d3.scaleBand()
        .domain(d3.range(dataincome.length))
        .range([this.chartBreakpointValues.margin.left, this.chartBreakpointValues.width - this.chartBreakpointValues.margin.right])
        .padding(0.1)
      this.innerHTML = template(this.translationsObj);
      // console.log("ran template", this.innerHTML);
      this.querySelectorAll('span[data-replacement="d3-bar-report-date"]').forEach(elem => {
        // console.log("Got date span");
        elem.innerHTML = updateDate;
      });

      this.tooltip = this.querySelector('.tooltip-container'); // @TODO: Q: where did the class go? tooltip is coming back null.
      writeBars(this, this.svg, dataincome, x, y, this.chartBreakpointValues.width, this.tooltip);
      writeBarLabels(this.svg, dataincome, x, y, this.chartBreakpointValues.sparkline);
      let xAxis = writeXAxis(dataincome, this.chartBreakpointValues.height, this.chartBreakpointValues.margin, x);
      writeXAxisLabel(this, this.svg, this.translationsObj.xAxisTitleIncome);
  
      this.svg.append("g")
        .attr("class", "xaxis")
        .call(xAxis);

      let yDValue = dataincome[0].STATE_CASE_RATE_PER_100K
      this.yDValue = yDValue;

      redrawYLine(this, y);

      writeLegend(this.svg, [this.translationsObj.casesPer100KPeople], this.chartBreakpointValues.width - 5, this.chartBreakpointValues.legend);

      this.querySelector('.svg-holder').appendChild(this.svg.node());
      this.applyListeners(this.svg, x, y, this.chartBreakpointValues.height, this.chartBreakpointValues.margin, xAxis, dataincome, datacrowding, datahealthcare, this.chartBreakpointValues)
      this.classList.remove('d-none')

      document.dispatchEvent(new window.CustomEvent('setup-sd-tab-tracking'));

      rtlOverride(this);

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
    let tab_recs = [{nom:'income',data:dataincome, tranHTML:component.translationsObj.chartTitleIncome, xAxisLabel:component.translationsObj.xAxisTitleIncome},
                    {nom:'healthcare',data:datahealthcare, tranHTML:component.translationsObj.chartTitleHealthcare, xAxisLabel:component.translationsObj.xAxisTitleHealthcare},
                    {nom:'housing',data:datacrowding, tranHTML:component.translationsObj.chartTitleHousing, xAxisLabel:component.translationsObj.xAxisTitleHousing},
                   ];

    toggles.forEach(tog => {
      tog.addEventListener('click',function(event) {

        // console.log("Got Social Toggle: ",this.classList);
        event.preventDefault();
        tab_recs.forEach(tRec => {
          // console.log("Checking ",tRec.nom,this.classList);
          if(this.classList.contains(tRec.nom)) {
           // console.log("Hit on ",tRec.nom);
            const event = new window.CustomEvent('tab-select',{detail:{tab_selected: tRec.nom}});
            window.dispatchEvent(event);    
            rewriteBar(component, tRec.data)
            component.querySelector('.chart-title').innerHTML = tRec.tranHTML;
            writeXAxisLabel(component, component.svg, tRec.xAxisLabel);
          }
        });
        resetToggles();
        tog.classList.add('active')
      })
    })

    function resetToggles() {
      toggles.forEach(toggle => {
        toggle.classList.remove('active')
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