import template from "./template.js";
import getTranslations from './../../get-strings-list.js';
import getScreenResizeCharts from './../../get-window-size.js';
import rtlOverride from "./../../rtl-override.js";
import { reformatReadableDate } from "../../readable-date.js";
import renderChart from "../../simple-chart.js";

class CAGOVEquityVaccinesAge extends window.HTMLElement {
  connectedCallback() {
    console.log("Loading x CAGOVEquityVaccinesAge");
    this.translationsObj = getTranslations(this);
    this.innerHTML = template(this.translationsObj);
    // Settings and initial values
    let bars = 5;
    this.chartOptions = {
      // Data
      subgroups: ["NOT_MISSING", "MISSING"],
      dataUrl: config.equityChartsSampleDataLoc+"vaccines_by_age_california.json", // Overwritten by county.
      state: 'California',
      // Style
      backgroundFill: '#F2F5FC',
      chartColors: ["#92C5DE", "#FFCF44"],
      // Breakpoints
      desktop: {
        fontSize: 14,
        height: 60+bars*60,
        width: 555,
        margin: {
          top: 60,
          right: 80,
          bottom: 0,
          left: 0,
        },
        // heightMultiplier: 100,
        // labelOffsets: [-52, -52, -57],
      },
      tablet: {
        fontSize: 14,
        height: 60+bars*60,
        width: 555,
        margin: {
          top: 60,
          right: 80,
          bottom: 0,
          left: 0,
        },
        // heightMultiplier: 100,
        // labelOffsets: [-52, -52, -57],
      },
      mobile: {
        fontSize: 12,
        height: 60+bars*56,
        width: 440,
        margin: {
          top: 20,
          right: 80,
          bottom: 20,
          left: 0,
        },
        // heightMultiplier: 100,
        // labelOffsets: [-52, -52, -57],
      },
      retina: {
        fontSize: 12,
        height: 60+bars*50,
        width: 320,
        margin: {
          top: 20,
          right: 80,
          bottom: 20,
          left: 0,
        },
        // heightMultiplier: 100,
        // labelOffsets: [-52, -52, -57],
      },
    };

    this.intFormatter = new Intl.NumberFormat('us', // forcing US to avoid mixed styles on translated pages
                  {style:'decimal', 
                   minimumFractionDigits:0,
                   maximumFractionDigits:0});


    getScreenResizeCharts(this);

    this.screenDisplayType = window.charts ? window.charts.displayType : 'desktop';

    this.chartBreakpointValues = this.chartOptions[this.screenDisplayType ? this.screenDisplayType : 'desktop'];
    this.dimensions = this.chartBreakpointValues;


    const handleChartResize = () => {
        getScreenResizeCharts(this);
        this.screenDisplayType = window.charts ? window.charts.displayType : 'desktop';
        this.chartBreakpointValues = this.chartOptions[this.screenDisplayType ? this.screenDisplayType : 'desktop'];
      };
  
    window.addEventListener('resize', handleChartResize);

    this.svg = d3
      .select(this.querySelector(".svg-holder"))
      .append("svg")
      .attr("viewBox", [0, 0, this.chartBreakpointValues.width, this.chartBreakpointValues.height])
      .append("g")
      .attr(
        "transform",
        "translate(0,0)"
      );

    this.color = d3
      .scaleOrdinal()
      .domain(["MIN","MAX"])
      .range(this.chartOptions.chartColors);



    // Set default values for data and labels
    this.dataUrl = this.chartOptions.dataUrl;
    this.county = this.chartOptions.county;
    this.state = this.chartOptions.state;
    this.selectedMetric = this.chartOptions.selectedMetric;

    this.retrieveData(this.dataUrl);
    // this.listenForLocations();
    this.classList.remove("d-none"); // this works
    if (this.querySelector('.d-none') !== null) { // this didn't seem to be working...
      this.querySelector('.d-none').classList.remove("d-none");
    }

    rtlOverride(this); // quick fix for arabic
  }

  getLegendText() {
    return "Number of people who have received vaccinations"
  }

  ariaLabel(d) {
    // this is currently the same as the tooltip with span tags removed...
    // placeholderCaseRate cases per 100K people. placeholderRateDiff30 change since previous week
    // ${parseFloat(d.CASE_RATE_PER_100K).toFixed(1)} cases per 100K people. ${parseFloat(d.RATE_DIFF_30_DAYS).toFixed(1)}% change since previous week
    let label = 'ARIA BAR LABEL';
    // let templateStr = this.translationsObj['ariaBarLabel']
    // let label = templateStr
    //               .replace('placeholderCaseRate', this.intFormatter.format(d.CASE_RATE_PER_100K))
    //               .replace('placeholderRateDiff30', parseFloat(d.RATE_DIFF_30_DAYS).toFixed(1) + '%');
    return label;
  }


  retrieveData(url) {
    window
      .fetch(url)
      .then((response) => response.json())
      .then(
        function (alldata) {
          this.alldata = alldata;
          renderChart.call(this);
        }.bind(this)
      );
  }


}

window.customElements.define(
  "cagov-chart-ve-age",
  CAGOVEquityVaccinesAge
);
