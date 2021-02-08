import template from "./template.js";
import getTranslations from './../../get-strings-list.js';
import getScreenResizeCharts from './../../get-window-size.js';
import rtlOverride from "./../../rtl-override.js";
import renderChart from "../../simple-chart.js";

class CAGOVEquityVaccinesGender extends window.HTMLElement {
  connectedCallback() {
    console.log("Loading x CAGOVEquityVaccinesGender");
    this.translationsObj = getTranslations(this);
    this.innerHTML = template(this.translationsObj);
    // Settings and initial values
    let bars = 3;
    this.chartOptions = {
      // Data
      dataUrl: config.equityChartsSampleDataLoc+"vaccines_by_gender_california.json", // Overwritten by county.
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
      },
      mobile: {
        fontSize: 12,
        height: 60+bars*50,
        width: 440,
        margin: {
          top: 20,
          right: 80,
          bottom: 20,
          left: 0,
        },
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
      },
    };

    this.intFormatter = new Intl.NumberFormat('us', // forcing US to avoid mixed styles on translated pages
                  {style:'decimal', 
                   minimumFractionDigits:0,
                   maximumFractionDigits:0});
    this.pctFormatter = new Intl.NumberFormat('us', // forcing US to avoid mixed styles on translated pages
                  {style:'percent', 
                   minimumFractionDigits:0,
                   maximumFractionDigits:1});


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


    // Set default values for data and labels
    this.dataUrl = this.chartOptions.dataUrl;

    this.retrieveData(this.dataUrl);
    // this.listenForLocations();
    // this.classList.remove("d-none"); // this works
    // if (this.querySelector('.d-none') !== null) { // this didn't seem to be working...
    //   this.querySelector('.d-none').classList.remove("d-none");
    // }

    rtlOverride(this); // quick fix for arabic
  }

  getLegendText() {
    return ["% of vaccines administered", "% of state population"]
  }

  ariaLabel(d) {
    let label = 'ARIA BAR LABEL';
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
  "cagov-chart-ve-gender",
  CAGOVEquityVaccinesGender
);
