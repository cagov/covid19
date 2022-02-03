import template from "./sparkline-template.js";
import getTranslations from "../../../common/get-strings-list.js";
import getScreenResizeCharts from "../../../common/get-window-size.js";
import rtlOverride from "../../../common/rtl-override.js";
import chartConfig from './sparkline-config.json';
import renderChart from "./sparkline.js";
import { getSnowflakeStyleDate } from "../../../common/readable-date.js";

// cagov-chart-dashboard-positivity-rate
class CAGovDashboardSparkline extends window.HTMLElement {
  connectedCallback() {
    this.translationsObj = getTranslations(this);
    this.chartConfigFilter = this.dataset.chartConfigFilter;
    this.chartConfigKey = this.dataset.chartConfigKey;
    this.chartOptions = chartConfig[this.chartConfigKey][this.chartConfigFilter];

    console.log("Loading CAGovDashboardSparkline", this.chartConfigFilter, this.chartConfigKey);

    getScreenResizeCharts(this);

    this.screenDisplayType = window.charts
      ? window.charts.displayType
      : "desktop";

    this.chartBreakpointValues = chartConfig[this.screenDisplayType];
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
    // console.log("Reading data file",this.chartOptions.dataPathVar, config);

    this.dataUrl = config[this.chartOptions.dataPathVar] + this.chartOptions.dataUrl;
    // console.log("Loading sparkline json",this.dataset.chartConfigKey,this.dataUrl);
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

  // Unused callback, just in case
  renderExtras(svg, data, x, y) {
  }

  renderComponent() {
    this.innerHTML = template.call(this, this.chartOptions, this.translationsObj);
    let display_weeks = this.chartOptions.display_weeks;
    let uncertainty_days = this.chartOptions.uncertainty_days_override;

    // WORK OUT HOW MUCH RECENT DATA TO CHOP OFF (typically 7 days, but not always)
    //
    if (uncertainty_days == -1 && this.chartOptions.uncertainty_latest_field != "") {
      const pending_date = this.chartdata.latest[this.chartOptions.uncertainty_latest_field][this.chartOptions.uncertainty_date_field];
      const data_to_walk = this.chartdata.time_series[this.chartOptions.seriesField].VALUES;
      uncertainty_days = 0;
      for (let i = 0; i < data_to_walk.length; ++i) {
        uncertainty_days += 1
        if (data_to_walk[i].DATE == pending_date) {
          break;
        }
      }
      // sanity check
      if (uncertainty_days > 28) {
        console.log("Problem calcuating uncertainty period",this.dataset.chartConfigKey,this.chartdata)
        uncertainty_days = 7;
      }
      console.log(`Uncertainty days for for ${this.dataset.chartConfigKey} is ${uncertainty_days} ${pending_date}`);
    } else {
      console.log("Overriding uncertainty_days",uncertainty_days,this.dataset.chartConfigKey,this.chartdata);
    }
    uncertainty_days = Math.max(0, uncertainty_days);

    let bar_series = this.chartdata.time_series[this.chartOptions.seriesField].VALUES;
    // clone in case they are the same
    bar_series = JSON.parse(JSON.stringify(bar_series));

    // COMPUTE MANUAL AVERAGE
    let line_series = [];
    if (('no_average' in this.chartOptions) && this.chartOptions.no_average) {
      console.log("Skipping averaging for ",this.dataset.chartConfigKey);
      line_series = JSON.parse(JSON.stringify(bar_series));
    } else {
      bar_series.forEach((rec,i) => {
          let sum = 0;
          for (let j = i; j < i+7; ++j) {
            sum += j < bar_series.length? bar_series[j].VALUE : 0;
          }
          line_series.push({DATE:rec.DATE,VALUE:sum/7.0});
      });
    }
  
    bar_series = bar_series.splice(uncertainty_days, display_weeks*7);
    line_series = line_series.splice(uncertainty_days, display_weeks*7);

    let renderOptions = {
                          'chart_style':this.chartOptions.chart_style,
                          'extras_func':this.renderExtras,
                          'time_series_bars':bar_series,
                          'time_series_line':line_series,
                          'left_y_fmt':'pct',
                          'root_id':this.chartOptions.rootId,
                          'right_y_fmt':'integer',
                          'published_date': this.metadata.PUBLISHED_DATE,
                          'render_date': getSnowflakeStyleDate(0),
                          'last_date': bar_series[0].DATE,
                          'first_date': bar_series[bar_series.length-1].DATE,
                          'chart_options': this.chartOptions,
                        };
      console.log("RENDERING CHART",this.chartConfigFilter, this.chartConfigKey);
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
