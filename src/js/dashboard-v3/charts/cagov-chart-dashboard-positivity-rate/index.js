import template from "../cagov-chart-dashboard-icu-beds/template.js";
import getTranslations from "../../../common/get-strings-list.js";
import getScreenResizeCharts from "../../../common/get-window-size.js";
import rtlOverride from "../../../common/rtl-override.js";
import chartConfig from '../common/line-chart-config.json';
import renderChart from "../common/histogram.js";
import { reformatReadableDate } from "../../../common/readable-date.js";
import applySubstitutions from "./../../../common/apply-substitutions.js";
import formatValue from "./../../../common/value-formatters.js";

// cagov-chart-dashboard-positivity-rate
class CAGovDashboardPositivityRate extends window.HTMLElement {
  connectedCallback() {
    console.log("Loading CAGovDashboardPositivityRate");
    this.translationsObj = getTranslations(this);
    this.chartConfigFilter = this.dataset.chartConfigFilter;
    this.chartConfigKey = this.dataset.chartConfigKey;
    this.chartOptions = chartConfig[this.chartConfigKey][this.chartConfigFilter];
    this.stateData = null;

    // Settings and initial values
    // this.chartOptions = {
    //   chartName: 'cagov-chart-dashboard-positivity-rate',
    //   // Data
    //   dataUrl:
    //     config.chartsStateDashTablesLoc + "positivity-rate/california.json", // Overwritten by county.
    //   dataUrlCounty:
    //     config.chartsStateDashTablesLoc + "positivity-rate/<county>.json",

    //   desktop: {
    //     fontSize: 14,
    //     width: 400,     height: 300,
    //     margin: {   left: 50,   top: 30,  right: 60,  bottom: 45 },
    //   },
    //   tablet: {
    //     fontSize: 14,
    //     width: 400,     height: 300,
    //     margin: {   left: 50,   top: 30,  right: 60,  bottom: 45 },
    //   },
    //   mobile: {
    //     fontSize: 12,
    //     width: 400,     height: 300,
    //     margin: {   left: 50,   top: 30,  right: 60,  bottom: 45 },
    //   },
    //   retina: {
    //     fontSize: 12,
    //     width: 400,     height: 300,
    //     margin: {   left: 50,   top: 30,  right: 60,  bottom: 45 },
    //   },
    // };

    getScreenResizeCharts(this);

    this.screenDisplayType = window.charts
      ? window.charts.displayType
      : "desktop";

    this.chartBreakpointValues = chartConfig[
      this.screenDisplayType ? this.screenDisplayType : "desktop"
    ];
    this.dimensions = this.chartBreakpointValues;

    const handleChartResize = () => {
      getScreenResizeCharts(this);
      this.screenDisplayType = window.charts
        ? window.charts.displayType
        : "desktop";
      this.chartBreakpointValues = chartConfig[
        this.screenDisplayType ? this.screenDisplayType : "desktop"
      ];
    };

    window.addEventListener("resize", handleChartResize);


    // Set default values for data and labels
    this.dataUrl = config.chartsStateDashTablesLoc + this.chartOptions.dataUrl;

    this.retrieveData(this.dataUrl, 'California');

    rtlOverride(this); // quick fix for arabic

    this.listenForLocations();
  }

  ariaLabel(d, baselineData) {
    let caption = ''; // !!!
    return caption;
  }

  getLegendText() {
    return [];
    //   this.translationsObj.chartLegend1,
    //   this.translationsObj.chartLegend2,
    // ];
  }

  renderExtras(svg, data, x, y) {
  }

  getTooltipContent(di) {    
    const barSeries = this.chartdata.time_series[this.chartOptions.seriesField];
    const lineSeries = this.chartdata.time_series[this.chartOptions.seriesFieldAvg];
    // console.log("getTooltipContent",di,lineSeries);
    const repDict = {
      DATE:   reformatReadableDate(lineSeries[di].DATE),
      '7DAY_POSRATE':formatValue(lineSeries[di].VALUE,{format:'percent'}),
      TOTAL_TESTS:formatValue(barSeries[di].VALUE,{format:'integer'}),
    };
    return applySubstitutions(this.translationsObj.tooltipContent, repDict);
  }

  retrieveData(url, regionName) {
    window
      .fetch(url)
      .then((response) => response.json())
      .then(
        function (alldata) {
          // console.log("Race/Eth data data", alldata.data);
          this.metadata = alldata.meta;
          this.chartdata = alldata.data;

          let addStateLine = false;
          if (regionName == 'California') {
            this.statedata = alldata.data;
          } else if (this.statedata) {
            addStateLine = true;
          }

          let latestRec = this.chartdata.latest[this.chartOptions.latestField];
          const repDict = {
            test_positivity_7_days:formatValue(latestRec.test_positivity_7_days,{format:'percent'}),
            test_positivity_7_days_delta_7_days:formatValue(Math.abs(latestRec.test_positivity_7_days_delta_7_days),{format:'percent'}),
          };

          this.translationsObj.post_chartLegend1 = applySubstitutions(this.translationsObj.chartLegend1, repDict);
          this.translationsObj.post_chartLegend2 = applySubstitutions(latestRec.test_positivity_7_days_delta_7_days >= 0? this.translationsObj.chartLegend2Increase : this.translationsObj.chartLegend2Decrease, repDict);
          this.translationsObj.currentLocation = regionName;

          this.innerHTML = template(this.translationsObj);
          this.svg = d3
            .select(this.querySelector(".svg-holder"))
            .append("svg")
            .attr("viewBox", [
              0,
              0,
              this.chartBreakpointValues.width,
              this.chartBreakpointValues.height,
            ])
            .append("g")
            .attr("transform", "translate(0,0)");
      
          this.tooltip = d3
            .select(this.chartOptions.chartName)
            .append("div")
            .attr("class", "tooltip-container")
            .text("Empty Tooltip");
      

          renderChart.call(this, {'tooltip_func':this.tooltip,
                                  'extras_func':this.renderExtras,
                                  'time_series_bars':this.chartdata.time_series[this.chartOptions.seriesField],
                                  'time_series_line':this.chartdata.time_series[this.chartOptions.seriesFieldAvg],
                                  'left_y_fmt':'pct',
                                  'root_id':'pos-rate',
                                  'left_y_axis_legend':'Positivity Rate',
                                  'right_y_axis_legend':'Tests',
                                  'x_axis_legend':'Testing date',
                                  'line_legend':'7-day average',
                                  'pending_date':this.chartdata.latest[this.chartOptions.latestField].TESTING_UNCERTAINTY_PERIOD,
                                  'pending_legend':this.translationsObj.pending,
                                  ...(addStateLine) && {'time_series_state_line':this.statedata.time_series[this.chartOptions.seriesFieldAvg]}
                                });
        }.bind(this)
      );
  }

  listenForLocations() {
    let searchElement = document.querySelector("cagov-county-search");
    searchElement.addEventListener(
      "county-selected",
      function (e) {
        this.county = e.detail.county;
        let searchURL = config.chartsStateDashTablesLoc + this.chartOptions.dataUrlCounty.replace(
          "<county>",
          this.county.toLowerCase().replace(/ /g, "")
        );
        this.retrieveData(searchURL, e.detail.county);
      }.bind(this),
      false
    );
  }
}

window.customElements.define(
  "cagov-chart-dashboard-positivity-rate",
  CAGovDashboardPositivityRate
);
