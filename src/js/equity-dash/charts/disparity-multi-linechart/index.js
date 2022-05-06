import template from "./disparity-template.js";
import getTranslations from "../../../common/get-strings-list.js";
import getScreenResizeCharts from "../../../common/get-window-size.js";
import rtlOverride from "../../../common/rtl-override.js";
import chartConfig from './disparity-chart-config.json';
import renderChart from "./disparity-chart.js";
import termCheck from "../race-ethnicity-config.js";
import applySubstitutions from "./../../../common/apply-substitutions.js";
import { getSnowflakeStyleDate, reformatReadableDate } from "../../../common/readable-date.js";
import formatValue from "./../../../common/value-formatters.js";
import { hasURLSearchParam, getURLSearchParam}  from "./geturlparams.js";

import testChartData from "./disparity_sampledata-CA.json";


class CAGovDisparityMultiLineChart extends window.HTMLElement {
  connectedCallback() {

    this.translationsObj = getTranslations(this);
    this.chartConfigFilter = this.dataset.chartConfigFilter;
    this.chartConfigKey = this.dataset.chartConfigKey;
    console.log("Loading Disparity Chart",this.chartConfigKey,this.chartConfigFilter);

    this.chartOptions = chartConfig[this.chartConfigKey][this.chartConfigFilter];

    for (const [key, value] of Object.entries(chartConfig.common)) {
        if (!(key in this.chartOptions)) // override not in use?
        {
            this.chartOptions[key] = value;
        }
    }


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
    this.dataUrl = config.equityChartsDataLoc + this.chartOptions.dataUrl;

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
    return 'TOOLTIP CONTENT';
    // const drec = this.chartdata[di];
    // const repDict = {
    //   WEEKDATE:   reformatReadableDate(drec.DATE),
    //   BCOUNT:   formatValue(drec[this.chartOptions.series_fields[0]],{format:'number'}),
    //   VCOUNT:   formatValue(drec[this.chartOptions.series_fields[1]],{format:'number'}),
    //   UCOUNT:   formatValue(drec[this.chartOptions.series_fields[2]],{format:'number'}),
    // };
    // let caption = applySubstitutions(this.translationsObj.tooltipContent, repDict);
    // return caption;
  }


  renderComponent() {
    console.log("Rendering Disparity Chart A");

    const repDict = {
      REGION: 'California',
    };

    this.translationsObj.post_chartTitle = applySubstitutions(this.translationsObj.chartTitle, repDict);

    this.innerHTML = template.call(this, this.chartOptions, this.translationsObj);
    let series_fields = this.chartOptions.series_fields;

    let show_pending = hasURLSearchParam('grayarea') || hasURLSearchParam('pending');

    console.log("Rendering Disparity Chart B", this.chartdata);


    let line_series_array = [];

    series_fields.forEach((label, i) => {
        let tseries_name = label.replaceAll(' ','_') + this.chartOptions.tseries_suffix;
        console.log("tseries_name =",tseries_name);
        line_series_array.push(this.chartdata.time_series[tseries_name].VALUES);
    });
    this.line_series_array = line_series_array;

    const displayDemoMap = termCheck();
    var series_labels = [...this.chartOptions.series_fields].map(x => displayDemoMap.get(x)? displayDemoMap.get(x) : x);
    console.log("Series labels",series_labels);


    let renderOptions = {
        'chart_options':this.chartOptions,
        'chart_style':this.chartOptions.chart_style,
        'extras_func':this.renderExtras,
        'line_series_array':line_series_array,
        'x_axis_field':this.chartOptions.x_axis_field,
        'y_axis_legend':this.translationsObj.y_axis_legend,
        'y_fmt':'number',
        'root_id':this.chartOptions.root_id,
        'series_labels': series_labels,
        'series_fields': this.chartOptions.series_fields,
        'series_colors': this.chartOptions.series_colors,
        'pending_days': this.chartOptions.pending_days,
        'pending_label': this.translationsObj.pending_label,
        'published_date': getSnowflakeStyleDate(0),
        'render_date': getSnowflakeStyleDate(0),
    };
    console.log("Calling disparity renderer");
      renderChart.call(this, renderOptions);
  }

  retrieveData(url) {
    // test test test - retrieve and ignore data...
    url = 'https://data.covid19.ca.gov/data/dashboard/postvax/california.json'

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

        //   let days_to_show = parseInt(getURLSearchParam('days', ''+this.chartOptions.days_to_show));
        //   console.log("days to show",days_to_show);

        //   let pending_days = this.chartOptions.pending_days;
        //   this.chartdata.splice(this.chartdata.length-pending_days,pending_days);

        //   if (this.chartdata.length > days_to_show) {
        //     console.log("Clipping",this.chartdata.length-days_to_show,"days > days_to_show")
        //     this.chartdata.splice(0, this.chartdata.length-days_to_show); 
        //   }

        //   // Premult
        //   this.chartdata.forEach(rec => {
        //     rec[this.chartOptions.series_fields[0]] *= this.chartOptions.pre_mult;
        //     rec[this.chartOptions.series_fields[1]] *= this.chartOptions.pre_mult;
        //     rec[this.chartOptions.series_fields[2]] *= this.chartOptions.pre_mult;
        //   });

          this.renderComponent();

        }.bind(this)
      );
  }

}

window.customElements.define(
  "cagov-chart-disparity-multi-linechart",
  CAGovDisparityMultiLineChart
);

