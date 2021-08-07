import template from "./../common/postvax-template.js";
import getTranslations from "../../../common/get-strings-list.js";
import getScreenResizeCharts from "../../../common/get-window-size.js";
import rtlOverride from "../../../common/rtl-override.js";
import chartConfig from '../common/postvax-chart-config.json';
import renderChart from "../common/postvax-chart.js";
import applySubstitutions from "./../../../common/apply-substitutions.js";
import { parseSnowflakeDate, reformatJSDate } from "../../../common/readable-date.js";

class CAGovDashboardPostvaxCases extends window.HTMLElement {
  connectedCallback() {
    console.log("Loading CAGovDashboardPostvaxCases");
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
                          'root_id':'postvax-cases'
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
          // parseSnowflakeDate(publishedDateStr)
          let sumvax = 0;
          let sumunvax = 0;
          this.chartdata.forEach(r => {
            sumvax += r.vcases;
            sumunvax += r.ucases;
          });
          let last_record_idx = this.chartdata.length-1;
          let headerReplacementDict = {
            'POSTVAX_START_DATE' : reformatJSDate(parseSnowflakeDate(this.chartdata[0].start_date)),
            'POSTVAX_END_DATE' : reformatJSDate(parseSnowflakeDate(this.chartdata[last_record_idx].end_date)),
            'POSTVAX_UNVAX_RATIO' : Math.round(sumunvax / sumvax),
          };
          console.log("header replacement text",headerReplacementDict);
          let headerDisplayText = document.querySelector('#postvax-chart-intro').innerHTML;
          console.log("text to modify",headerDisplayText);
          headerDisplayText = applySubstitutions(headerDisplayText, headerReplacementDict);
          d3.select(document.querySelector("#postvax-chart-intro")).text(headerDisplayText);

          this.renderComponent();

        }.bind(this)
      );
  }

}

window.customElements.define(
  "cagov-chart-dashboard-postvax-cases",
  CAGovDashboardPostvaxCases
);

