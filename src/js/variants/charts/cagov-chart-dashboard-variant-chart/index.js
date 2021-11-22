// variant chart
import template from "./variantchart-template.js";
import getTranslations from "../../../common/get-strings-list.js";
import getScreenResizeCharts from "../../../common/get-window-size.js";
import rtlOverride from "../../../common/rtl-override.js";
import chartConfig from './variantchart-config.json';
import renderChart from "./variantchart-render.js";
import { getSnowflakeStyleDate } from "../../../common/readable-date.js";
import { vchart_variants, vchart_vdata } from "./variantchart-data.js";

// cagov-chart-dashboard-positivity-rate
class CAGovDashboardVariantChart extends window.HTMLElement {
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

    let line_series_array = [];

    this.chartlabels.forEach((label, i) => {
        console.log("Compute Line Series for ",label, i);
        let line_series = [];
        this.chartdata.forEach((rec, j) => {
            if (j >= 6) {
                let sum = 0;
                for (let k = 0; k < 7; ++k) {
                  sum += this.chartdata[j-k][1+i];
                }
                line_series.push({DATE:rec[0],VALUE:sum/7.0})
            }
        });
        line_series_array.push(line_series);
    });

    let renderOptions = {
                          'chart_style':this.chartOptions.chart_style,
                          'extras_func':this.renderExtras,
                          'chart_labels':this.chartlabels,
                          'line_series_array':line_series_array,
                          'x_axis_field':this.chartOptions.x_axis_field,
                          'y_fmt':'number',
                          'root_id':this.chartOptions.rootId,
                          'published_date': getSnowflakeStyleDate(0),
                          'render_date': getSnowflakeStyleDate(0),
                          'chart_options': this.chartOptions,
                        };
      console.log("RENDERING CHART",this.chartConfigFilter, this.chartConfigKey);
      renderChart.call(this, renderOptions);
  }

  retrieveData(url) {
      this.chartdata = vchart_vdata;
      this.chartlabels = vchart_variants;
      this.renderComponent();

//     window
//       .fetch(url)
//       .then((response) => response.json())
//       .then(
//         function (alldata) {
//           // console.log("Race/Eth data data", alldata.data);
//           this.metadata = alldata.meta;
//           this.chartdata = alldata.data;
//           this.renderComponent();
//         }.bind(this)
//       );
//   }
  
  }
}

window.customElements.define(
  "cagov-chart-dashboard-variant-chart",
  CAGovDashboardVariantChart
);
