import template from "./template.js";
import getTranslations from './../../get-strings-list.js';
import getScreenResizeCharts from './../../get-window-size.js';
import rtlOverride from "./../../rtl-override.js";
import { reformatReadableDate } from "../../readable-date.js";


class CAGOVEquityVaccinesAge extends window.HTMLElement {
  connectedCallback() {
    console.log("Loading CAGOVEquityVaccinesAge");
    this.translationsObj = getTranslations(this);
    this.innerHTML = template(this.translationsObj);
    // Settings and initial values
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
        "translate(" +
          this.chartBreakpointValues.margin.left +
          "," +
          this.chartBreakpointValues.margin.top +
          ")"
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

  drawBars(data) {
    let component = this;
    let svg = this.svg;
    let x = this.x;
    let y = this.y;
    svg.selectAll("g").remove();
    svg.selectAll("rect").remove();
    svg.selectAll("text").remove();
    svg.selectAll("path").remove();

    let bar = svg
    .append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter()
    .append("g")
    .attr("fill", (d) => color(d.key))
    .selectAll("rect")

    // enter a second time = loop subgroup per subgroup to add all rectangles
    .data((d) => d)
    .enter();
    

  }

  render() {
    // NOTE subgroups: "METRIC_VALUE_PER_100K", "WORST_VALUE_DELTA"

    // Exclude Other & Unknown categories from displaying for this chart.
    let data = this.alldata;

    // Filter and sort here...
  
    // Get list of groups (?)
    let groups = data.map((item) => item.CATEGORY);

    console.log("Groups",groups);
    console.log("Data",data);
  
    // Y position of bars.
    this.y = d3
    .scaleBand()
    .domain(groups)
    .range([
        this.dimensions.margin.top,
        this.dimensions.height - this.dimensions.margin.bottom,
    ])
    .padding([0.6]);
  
      // Position for labels.
      this.yAxis = (g) =>
        g
          .attr("class", "bar-label")
          .attr("transform", "translate(5," + -32 + ")")
          .call(d3.axisLeft(this.y).tickSize(0))
          .call((g) => g.selectAll(".domain").remove());
  
      // let max_xdomain = d3.max(data, (d) => d3.max(d, (d) => d.METRIC_VALUE));
      this.x = d3
        .scaleLinear()
        // .domain([0, max_xdomain])
        .range([0, this.dimensions.width - this.dimensions.margin.right - 50]);
  
      // ?
      this.xAxis = (g) =>
        g
          .attr("transform", "translate(0," + this.dimensions.width + ")")
          .call(d3.axisBottom(this.x).ticks(width / 50, "s"))
          .remove();
      // this.drawBars(data);
    }

  retrieveData(url) {
    window
      .fetch(url)
      .then((response) => response.json())
      .then(
        function (alldata) {
          this.alldata = alldata;
          this.render();
        }.bind(this)
      );
  }


}

window.customElements.define(
  "cagov-chart-ve-age",
  CAGOVEquityVaccinesAge
);
