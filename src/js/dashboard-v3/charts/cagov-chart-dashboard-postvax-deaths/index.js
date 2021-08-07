import template from "./../common/postvax-template.js";
import getTranslations from "../../../common/get-strings-list.js";
import getScreenResizeCharts from "../../../common/get-window-size.js";
import rtlOverride from "../../../common/rtl-override.js";
import chartConfig from '../common/postvax-chart-config.json';
import renderChart from "../common/postvax-chart.js";
import applySubstitutions from "./../../../common/apply-substitutions.js";

class CAGovDashboardPostvaxDeaths extends window.HTMLElement {
  connectedCallback() {
    console.log("Loading CAGovDashboardPostvaxDeaths");
    this.translationsObj = getTranslations(this);
    this.chartConfigFilter = this.dataset.chartConfigFilter;
    this.chartConfigKey = this.dataset.chartConfigKey;

    this.chartOptions = chartConfig[this.chartConfigKey][this.chartConfigFilter];

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
    this.dataUrl = config.postvaxChartsDataPath + this.chartOptions.dataUrl;

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

  renderExtras(svg) {
  }

  renderComponent() {
    console.log("Rendering Post Vax Chart");
    const repDict = {}; // format numbers from data for substitutions...
    this.translationsObj.post_chartTitle = applySubstitutions(this.translationsObj.chartTitleState, repDict);
    this.translationsObj.post_xaxis_legend = applySubstitutions(this.translationsObj.xaxis_legend, repDict);
    this.translationsObj.post_yaxis_legend = applySubstitutions(this.translationsObj.yaxis_legend, repDict);
    this.translationsObj.post_series1_legend = applySubstitutions(this.translationsObj.series1_legend, repDict);
    this.translationsObj.post_series2_legend = applySubstitutions(this.translationsObj.series2_legend, repDict);

    this.innerHTML = template.call(this, this.chartOptions, this.translationsObj);
    console.log("passing series1_field",this.chartOptions.series1_field);
    let renderOptions = {'tooltip_func':this.tooltip,
                          'extras_func':this.renderExtras,
                          'chartdata':this.chartdata,
                          'series_fields':this.chartOptions.series_fields,
                          'series_colors':this.chartOptions.series_colors,
                          'series_legends':[this.translationsObj.series1_legend, this.translationsObj.series2_legend],
                          'x_axis_field':this.chartOptions.x_axis_field,
                          'weeks_to_show':this.chartOptions.weeks_to_show,
                          'y_fmt':'number',
                          'root_id':'postvax-deaths'
                        };
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

          if (this.chartdata.length > this.chartOptions.weeks_to_show) {
            this.chartdata.splice(0, this.chartdata.length-this.chartOptions.weeks_to_show); 
          }

          this.renderComponent();

        }.bind(this)
      );
  }

}

window.customElements.define(
  "cagov-chart-dashboard-postvax-deaths",
  CAGovDashboardPostvaxDeaths
);

