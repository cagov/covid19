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
import testChartData from './boosted_12p_2022-01-26.json';

class CAGovDashboardPostvaxChart extends window.HTMLElement {
  connectedCallback() {
    // this.chart_mode = getURLSearchParam('mode','daily'); // no longer used
    // this.pending_mode = getURLSearchParam('pending','gray');

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
    this.dataUrl = config.chartsStateDashTablesLocPostvax + this.chartOptions.dataUrl;

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
      WEEKDATE:   reformatReadableDate(drec.DATE),
      BCOUNT:   formatValue(drec[this.chartOptions.series_fields[0]],{format:'number'}),
      VCOUNT:   formatValue(drec[this.chartOptions.series_fields[1]],{format:'number'}),
      UCOUNT:   formatValue(drec[this.chartOptions.series_fields[2]],{format:'number'}),
    };
    let caption = applySubstitutions(this.translationsObj.tooltipContent, repDict);
    return caption;
  }


  renderComponent() {
    console.log("Rendering Post Vax Chart");
    // let sumvax = 0;
    // let sumunvax = 0;
    // let tempData = [...this.chartdata];
    // let sample_days = this.chartOptions.sample_days;
    let last_day = this.chartdata.length-1;
    let last_ratio = this.chartdata[last_day][this.chartOptions.series_fields[2]] / this.chartdata[last_day][this.chartOptions.series_fields[0]];
    let end_impact_date = this.chartdata[last_day].DATE;
    let begin_impact_date = this.chartdata[last_day-6].DATE;
    // tempData.splice(tempData.length-sample_days,sample_days);
    // tempData.forEach(r => {
    //   sumvax += r[this.chartOptions.series_fields[0]];
    //   sumunvax += r[this.chartOptions.series_fields[1]];
    // });
    // const repDict = {
    //   RATE_PERCENT:(Math.round(100*sumunvax / sumvax))+'%',
    // };
    const repDict = {
      BEGIN_IMPACT_DATE: reformatReadableDate(begin_impact_date),
      END_IMPACT_DATE: reformatReadableDate(end_impact_date),
      RATE_RATIO:formatValue(last_ratio,{format:'number'}),
      RATE_PERCENT:formatValue(last_ratio,{format:'number'}), // (Math.round(100*last_ratio))+'%',
    };

    this.translationsObj.post_chartTitle = applySubstitutions(this.translationsObj.chartTitleState, repDict);
    this.translationsObj.post_chartImpactStatement = applySubstitutions(this.translationsObj.chartImpactStatement, repDict);
    this.translationsObj.post_xaxis_legend = applySubstitutions(this.translationsObj.xaxis_legend, repDict);
    this.translationsObj.post_yaxis_legend = applySubstitutions(this.translationsObj.yaxis_legend_daily, repDict);
    this.translationsObj.post_series1_legend = applySubstitutions(this.translationsObj.series1_legend, repDict);
    this.translationsObj.post_series2_legend = applySubstitutions(this.translationsObj.series2_legend, repDict);
    this.translationsObj.post_series3_legend = applySubstitutions(this.translationsObj.series3_legend, repDict);
    this.translationsObj.post_pending_legend = applySubstitutions(this.translationsObj.pending_legend, repDict);
    this.translationsObj.pending_mode = this.pending_mode;
    this.innerHTML = template.call(this, this.chartOptions, this.translationsObj);
    let series_fields = this.chartOptions.series_fields;
    let series_colors = this.chartOptions.series_colors;

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
                          // 'chart_mode':this.chart_mode,
                          // 'pending_mode':this.pending_mode,
                          // 'pending_weeks':this.chartOptions.pending_weeks,
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

          // TEST OVERRIDE
          alldata = JSON.parse(JSON.stringify(testChartData));

          this.metadata = alldata.meta;
          this.chartdata = alldata.data;

          if ('earliest_date' in this.chartOptions) {
            let number_to_clip = 0;
            for (let i = 0; i < this.chartdata.length; i++) {
              if (this.chartdata[i].DATE != this.chartOptions.earliest_date) {
                number_to_clip += 1;
              } else {
                break;
              }
            }
            if (number_to_clip > 0) {
              this.chartdata.splice(0, number_to_clip); 
            }
          }

          let days_to_show = parseInt(getURLSearchParam('days', ''+this.chartOptions.days_to_show));
          console.log("days to show",days_to_show);

          let pending_days = this.chartOptions.pending_days;
          this.chartdata.splice(this.chartdata.length-pending_days,pending_days);

          if (this.chartdata.length > days_to_show) {
            this.chartdata.splice(0, this.chartdata.length-days_to_show); 
          }

          // Premult
          this.chartdata.forEach(rec => {
            rec[this.chartOptions.series_fields[0]] *= this.chartOptions.pre_mult;
            rec[this.chartOptions.series_fields[1]] *= this.chartOptions.pre_mult;
            rec[this.chartOptions.series_fields[2]] *= this.chartOptions.pre_mult;
          });

          this.renderComponent();

        }.bind(this)
      );
  }

}

window.customElements.define(
  "cagov-chart-dashboard-postvax-chart",
  CAGovDashboardPostvaxChart
);

