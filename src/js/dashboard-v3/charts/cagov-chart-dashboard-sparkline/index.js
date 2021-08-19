import template from "./sparkline-template.js";
import getTranslations from "../../../common/get-strings-list.js";
import getScreenResizeCharts from "../../../common/get-window-size.js";
import rtlOverride from "../../../common/rtl-override.js";
import chartConfig from './sparkline-config.json';
import renderChart from "./sparkline.js";
// import { reformatReadableDate, parseSnowflakeDate } from "../../../common/readable-date.js";
// import applySubstitutions from "./../../../common/apply-substitutions.js";
// import formatValue from "./../../../common/value-formatters.js";

// cagov-chart-dashboard-positivity-rate
class CAGovDashboardSparkline extends window.HTMLElement {
  connectedCallback() {
    this.translationsObj = getTranslations(this);
    this.chartConfigFilter = this.dataset.chartConfigFilter;
    this.chartConfigKey = this.dataset.chartConfigKey;
    this.chartOptions = chartConfig[this.chartConfigKey][this.chartConfigFilter];
    this.stateData = null;

    console.log("Loading CAGovDashboardSparkline", this.chartConfigFilter, this.chartConfigKey);

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

    this.retrieveData(this.dataUrl);

    rtlOverride(this); // quick fix for arabic

  }

  ariaLabel(d, baselineData) {
    let caption = ''; // !!!
    return caption;
  }

  getLegendText() {
    return [];
  }

  renderExtras(svg, data, x, y) {
  }

//   getTooltipContent(di) {    
//     const barSeries = this.chartdata.time_series[this.chartOptions.seriesField].VALUES;
//     const lineSeries = this.chartdata.time_series[this.chartOptions.seriesFieldAvg].VALUES;
//     // console.log("getTooltipContent",di,lineSeries);
//     const repDict = {
//       DATE:   reformatReadableDate(lineSeries[di].DATE),
//       '7DAY_POSRATE':formatValue(lineSeries[di].VALUE,{format:'percent'}),
//       TOTAL_TESTS:formatValue(barSeries[di].VALUE,{format:'integer'}),
//     };
//     let caption = applySubstitutions(this.translationsObj.tooltipContent, repDict);
//     let datumDate = parseSnowflakeDate(lineSeries[di].DATE);
//     let pendingDate = parseSnowflakeDate(this.chartdata.latest[this.chartOptions.latestField].TESTING_UNCERTAINTY_PERIOD);
//     if (+datumDate >= +pendingDate) {
//       caption += `<br><span class="pending-caveat">${this.translationsObj.pending_caveat}</span>`;
//     }
//     return caption;
//   }

  renderComponent() {
    let addStateLine = false;
    this.statedata = this.chartdata;
    let latestRec = this.chartdata.latest[this.chartOptions.latestField];

    this.innerHTML = template.call(this, this.chartOptions, this.translationsObj);
    let display_weeks = this.chartOptions.display_weeks;
    let uncertainty_weeks = this.chartOptions.uncertainty_weeks;
    let bar_series = this.chartdata.time_series[this.chartOptions.seriesField].VALUES;
    let line_series = this.chartdata.time_series[this.chartOptions.seriesFieldAvg].VALUES;
    bar_series = bar_series.splice(uncertainty_weeks*7, display_weeks*7);
    line_series = line_series.splice(uncertainty_weeks*7, display_weeks*7);

    let renderOptions = {
                          'extras_func':this.renderExtras,
                          'time_series_bars':bar_series,
                          'time_series_line':line_series,
                          'left_y_fmt':'pct',
                          'root_id':'pos-rate',
                          'right_y_fmt':'integer',
                          'pending_date':this.chartdata.latest[this.chartOptions.latestField].TESTING_UNCERTAINTY_PERIOD,
                        };
      if (addStateLine) {
        renderOptions.time_series_state_line = this.statedata.time_series[this.chartOptions.seriesFieldAvg].VALUES;
      }
      renderChart.call(this, renderOptions);
  }

  retrieveData(url) {
    window
      .fetch(url)
      .then((response) => response.json())
      .then(
        function (alldata) {
          // console.log("Race/Eth data data", alldata.data);
          this.metadata = alldata.meta;
          this.chartdata = alldata.data;
          this.renderComponent();
        }.bind(this)
      );
  }
  
}

window.customElements.define(
  "cagov-chart-dashboard-sparkline",
  CAGovDashboardSparkline
);
