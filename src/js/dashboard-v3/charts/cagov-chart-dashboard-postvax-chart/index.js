import template from "./postvax-template.js";
import getTranslations from "../../../common/get-strings-list.js";
import getScreenResizeCharts from "../../../common/get-window-size.js";
import rtlOverride from "../../../common/rtl-override.js";
import chartConfig from './postvax-chart-config.json';
import renderChart from "./postvax-chart.js";
import applySubstitutions from "./../../../common/apply-substitutions.js";
import { parseSnowflakeDate, reformatJSDate, reformatReadableDate } from "../../../common/readable-date.js";
import formatValue from "./../../../common/value-formatters.js";
import { hasURLSearchParam, getURLSearchParam}  from "../common/geturlparams.js";

class CAGovDashboardPostvaxChart extends window.HTMLElement {
  connectedCallback() {
    this.chartMode = getURLSearchParam('mode','weekly');
    this.translationsObj = getTranslations(this);
    this.chartConfigFilter = this.dataset.chartConfigFilter;
    this.chartConfigKey = this.dataset.chartConfigKey;
    console.log("Loading Postvax Chart",this.chartConfigKey,this.chartConfigFilter);

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
    this.dataUrl = config.postvaxChartsDataPath + (this.chartMode == 'weekly'? this.chartOptions.dataUrlWeekly : this.chartOptions.dataUrlDaily);

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

  getTooltipContent(di) {    
    const drec = this.chartdata[di];
    const repDict = {
      WEEKDATES:   reformatReadableDate(drec.start_date) + ' – ' + reformatReadableDate(drec.end_date),
      VCOUNT:   formatValue(drec[this.chartOptions.series_fields[0]],{format:'number'}),
      UCOUNT:   formatValue(drec[this.chartOptions.series_fields[1]],{format:'number'}),
    };
    let caption = applySubstitutions(this.translationsObj.tooltipContent, repDict);
    return caption;
  }


  renderComponent() {
    console.log("Rendering Post Vax Chart");
    const repDict = {}; // format numbers from data for substitutions...
    this.translationsObj.post_chartTitle = applySubstitutions(this.translationsObj.chartTitleState, repDict);
    this.translationsObj.post_xaxis_legend = applySubstitutions(this.translationsObj.xaxis_legend, repDict);
    this.translationsObj.post_yaxis_legend = applySubstitutions(this.chartMode == 'weekly'? this.translationsObj.yaxis_legend : this.translationsObj.yaxis_legend_daily, repDict);
    this.translationsObj.post_series1_legend = applySubstitutions(this.translationsObj.series1_legend, repDict);
    this.translationsObj.post_series2_legend = applySubstitutions(this.translationsObj.series2_legend, repDict);

    this.innerHTML = template.call(this, this.chartOptions, this.translationsObj);
    let series_fields = this.chartOptions.series_fields;
    let series_colors = this.chartOptions.series_colors;
    if (!hasURLSearchParam('3lines')) {
      series_fields.splice(2,1);
      series_colors.splice(2,1);
    }

    let renderOptions = {'tooltip_func':this.tooltip,
                          'extras_func':this.renderExtras,
                          'chartdata':this.chartdata,
                          'series_fields':series_fields,
                          'series_colors':series_colors,
                          // 'series_legends':[this.translationsObj.series1_legend, this.translationsObj.series2_legend],
                          'pending_legend':this.translationsObj.pending_legend,
                          'x_axis_field':this.chartOptions.x_axis_field,
                          'y_fmt':'number',
                          'root_id':this.chartOptions.root_id,
                          'chart_mode':this.chartMode,
                          'pending_weeks':this.chartOptions.pending_weeks,
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

          let weeks_to_show = parseInt(getURLSearchParam('weeks', ''+this.chartOptions.weeks_to_show));
          console.log("dynamic weeks to show",weeks_to_show);
      
          if (this.chartMode == 'weekly') {
            if (this.chartdata.length > weeks_to_show) {
              this.chartdata.splice(0, this.chartdata.length-weeks_to_show); 
            }
          } else {
            let days_to_show = weeks_to_show * 7;
            if (this.chartdata.length > days_to_show) {
              this.chartdata.splice(0, this.chartdata.length-days_to_show); 
            }
          }
          // parseSnowflakeDate(publishedDateStr)
          if (this.chartConfigKey == 'cases') {
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
            let headerDisplayText = document.querySelector('#postvax-chart-intro').innerHTML;
            headerDisplayText = applySubstitutions(headerDisplayText, headerReplacementDict);
            d3.select(document.querySelector("#postvax-chart-intro")).text(headerDisplayText);
          }

          this.renderComponent();

        }.bind(this)
      );
  }

}

window.customElements.define(
  "cagov-chart-dashboard-postvax-chart",
  CAGovDashboardPostvaxChart
);

