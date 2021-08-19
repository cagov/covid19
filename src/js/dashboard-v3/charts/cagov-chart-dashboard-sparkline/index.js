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
    console.log("Loading sparkline json",this.dataset.chartConfigKey,this.dataUrl);
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

  renderComponent() {
    let addStateLine = false;
    this.statedata = this.chartdata;

    console.log("Loading sparkline chart",this.dataset.chartConfigKey,this.chartdata);

    this.innerHTML = template.call(this, this.chartOptions, this.translationsObj);
    let display_weeks = this.chartOptions.display_weeks;
    let uncertainty_weeks = this.chartOptions.uncertainty_weeks;
    let bar_series = this.chartdata.time_series[this.chartOptions.seriesField].VALUES;
    // clone in case they are the same
    bar_series = JSON.parse(JSON.stringify(bar_series));
    let line_series = this.chartdata.time_series[this.chartOptions.seriesFieldAvg].VALUES;
    // clone in case they are the same
    line_series = JSON.parse(JSON.stringify(line_series));
    // Produce 7 day averages
    if (this.dataset.chartConfigKey == 'vaccines') {
      let avg_records = [];
      line_series.forEach((rec,i) => {
          let sum = 0;
          for (let j = i; j < i+7; ++j) {
            sum += j < line_series.length? line_series[j].VALUE : 0;
          }
          avg_records.push({DATE:rec.DATE,VALUE:sum/7.0});
      });
      line_series = avg_records;
      console.log("AVERAGE RECORDS: ",line_series);
    }

    bar_series = bar_series.splice(uncertainty_weeks*7, display_weeks*7);
    line_series = line_series.splice(uncertainty_weeks*7, display_weeks*7);
    console.log("Bar Series",this.dataset.chartConfigFilter,bar_series);
    console.log("Line Series",this.dataset.chartConfigFilter,line_series);
    let renderOptions = {
                          'extras_func':this.renderExtras,
                          'time_series_bars':bar_series,
                          'time_series_line':line_series,
                          'left_y_fmt':'pct',
                          'root_id':'pos-rate',
                          'right_y_fmt':'integer',
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
