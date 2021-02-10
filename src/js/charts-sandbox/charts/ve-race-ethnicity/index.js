import template from "./template.js";
import getTranslations from './../../get-strings-list.js';
import getScreenResizeCharts from './../../get-window-size.js';
import rtlOverride from "./../../rtl-override.js";
import renderChart from "../../simple-chart.js";

class CAGOVEquityVaccinesRaceEthnicity extends window.HTMLElement {
  connectedCallback() {
    console.log("Loading CAGOVEquityVaccinesRaceEthnicity");
    this.translationsObj = getTranslations(this);
    this.innerHTML = template(this.translationsObj);
    // Settings and initial values
    this.nbr_bars = 9;
    this.bar_vspace = 60;
    
    this.chartOptions = {
      // Data
      dataUrl: config.equityChartsVEDataLoc+"race-ethnicity/vaccines_by_race_ethnicity_california.json",
      dataUrlCounty: config.equityChartsVEDataLoc+"race-ethnicity/vaccines_by_race_ethnicity_<county>.json",
      state: 'California',
      // Breakpoints
      desktop: {
        fontSize: 14,
        height: 60+this.nbr_bars*this.bar_vspace,
        width: 555,
        margin: {
          top: 60,
          right: 80,
          bottom: 20, // 20 added for divider
          left: 0,
        },
      },
      tablet: {
        fontSize: 14,
        height: 60+this.nbr_bars*this.bar_vspace,
        width: 555,
        margin: {
          top: 60,
          right: 80,
          bottom: 20, // 20 added for divider
          left: 0,
        },
      },
      mobile: {
        fontSize: 12,
        height: 60+this.nbr_bars*(this.bar_vspace-2),
        width: 440,
        margin: {
          top: 60,
          right: 80,
          bottom: 20,
          left: 0,
        },
      },
      retina: {
        fontSize: 12,
        height: 60+this.nbr_bars*(this.bar_vspace-2),
        width: 320,
        margin: {
          top: 60,
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

    this.retrieveData(this.dataUrl,"California");
    this.listenForLocations();

    // this.listenForLocations();
    // this.classList.remove("d-none"); // this works
    // if (this.querySelector('.d-none') !== null) { // this didn't seem to be working...
    //   this.querySelector('.d-none').classList.remove("d-none");
    // }

    rtlOverride(this); // quick fix for arabic
  }

  // offset bottom two bars so we can add divider
  getYOffset(ci) {
    return ci < 7? 0 : 20;
  }

  getLegendText() {
    return ["% of vaccines administered", "% of state population"]
  }

  getChartTitle(region) {
    return `% administered (people with at least 1 dose) by race and ethnicity in ${region}`;
  }

  resetTitle(region) {
    this.querySelector(".chart-title").innerHTML = this.getChartTitle(region);
  }

  ariaLabel(d) {
    let label = 'ARIA BAR LABEL';
    return label;
  }

  renderExtras(svg, data, x, y) {
    let group = svg.append("g")
    group
      .append("rect")
        .attr("fill", "#000000")
        .attr("class", "divider")
        .attr("y", y(6)+this.bar_vspace*7/12)
        .attr("x", 0)
        .attr("width", this.dimensions.width)
        .attr("height", 0.75);
  }

  listenForLocations() {
    let searchElement = document.querySelector("cagov-county-search");
    searchElement.addEventListener(
      "county-selected",
      function (e) {
        console.log("Region selected",e.detail.filterKey);
        this.county = e.detail.county;
        let searchURL = this.chartOptions.dataUrlCounty.replace("<county>",this.county.toLowerCase().replace(/ /g, "_"));
        this.retrieveData(searchURL,e.detail.county);
      }.bind(this),
      false
    );
  }

  retrieveData(url,regionName) {
    window
      .fetch(url)
      .then((response) => response.json())
      .then(
        function (alldata) {
          console.log("Race/Eth data meta",alldata.meta);
          this.alldata = alldata.data;
          renderChart.call(this, this.renderExtras);
          this.resetTitle(regionName);
        }.bind(this)
      );
  }


}

window.customElements.define(
  "cagov-chart-ve-race-ethnicity",
  CAGOVEquityVaccinesRaceEthnicity
);
