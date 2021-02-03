import template from "./template.js";
import getTranslations from './../../get-strings-list.js';
import getScreenResizeCharts from './../../get-window-size.js';
import rtlOverride from "./../../rtl-override.js";
import { reformatReadableDate } from "../../readable-date.js";


class CAGOVEquityVaccinesAge extends window.HTMLElement {
  connectedCallback() {
    console.log("Loading CAGOVEquityVaccinesAge");
    this.translationsObj = this.getTranslations(this);
    this.innerHTML = template(this.translationsObj);
    // Settings and initial values
    this.chartOptions = {
      // Data
      dataUrl: config.equityChartsSampleDataLoc+"vaccines_by_age_california.json", // Overwritten by county.
      state: 'California',
      // Style
      backgroundFill: '#F2F5FC',
      chartColors: ["#92C5DE", "#FFCF44"],
      // Breakpoints
      desktop: {
        fontSize: 14,
        height: 214,
        width: 613,
        margin: {
          top: 40,
          right: 0,
          bottom: 20,
          left: 0,
        },
        heightMultiplier: 100,
        labelOffsets: [-52, -52, -57],
      },
      tablet: {
        fontSize: 14,
        height: 214,
        width: 440,
        margin: {
          top: 40,
          right: 0,
          bottom: 20,
          left: 0,
        },
        heightMultiplier: 100,
        labelOffsets: [-52, -52, -57],
      },
      mobile: {
        fontSize: 12,
        height: 600,
        width: 440,
        margin: {
          top: 40,
          right: 0,
          bottom: 20,
          left: 0,
        },
        heightMultiplier: 100,
        labelOffsets: [-52, -52, -57],
      },
      retina: {
        fontSize: 12,
        height: 600,
        width: 320,
        margin: {
          top: 40,
          right: 0,
          bottom: 20,
          left: 0,
        },
        heightMultiplier: 100,
        labelOffsets: [-52, -52, -57],
      },
    };

    getScreenResizeCharts(this);

    this.screenDisplayType = window.charts ? window.charts.displayType : 'desktop';

    this.chartBreakpointValues = this.chartOptions[this.screenDisplayType ? this.screenDisplayType : 'desktop'];

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
        "translate(" +
          this.chartBreakpointValues.margin.left +
          "," +
          this.chartBreakpointValues.margin.top +
          ")"
      );

    this.color = d3
      .scaleOrdinal()
      .domain(this.chartOptions.subgroups)
      .range(this.chartOptions.chartColors);

    // Set default values for data and labels
    this.dataUrl = this.chartOptions.dataUrl;
    this.county = this.chartOptions.county;
    this.state = this.chartOptions.state;
    this.selectedMetric = this.chartOptions.selectedMetric;

    this.retrieveData(this.dataUrl);
    this.listenForLocations();
    this.classList.remove("d-none"); // this works
    if (this.querySelector('.d-none') !== null) { // this didn't seem to be working...
      this.querySelector('.d-none').classList.remove("d-none");
    }

    rtlOverride(this); // quick fix for arabic
  }


}

window.customElements.define(
  "cagov-chart-ev-age",
  CAGOVEquityVaccinesAge
);
