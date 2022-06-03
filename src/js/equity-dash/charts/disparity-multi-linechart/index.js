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

// import testChartDataDaysCA from "./disparity_sampledata_days-california.json";
// import testChartDataWeeksCA from "./disparity_sampledata_weeks_v2-CA.json";
// import testChartDataLA from "./disparity_sampledata-losangeles.json";
// import testChartDataSD from "./disparity_sampledata-sandiego.json";
// import testChartDataMono from "./disparity_sampledata-mono.json";
// import testChartDataAlpine from "./disparity_sampledata-alpine.json";


class CAGovDisparityMultiLineChart extends window.HTMLElement {
  connectedCallback() {

    this.translationsObj = getTranslations(this);
    this.metric = this.dataset.chartConfigMetric;
    this.chartConfigTimerange = this.dataset.chartConfigTimerange;
    this.region = 'California';
    this.unit = getURLSearchParam('unit', 'weeks');
    console.log("Loading Disparity Chart");

    this.chartOptions = chartConfig.chart;

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

    this.listenForLocations();

    this.retrieveData(this.dataUrl);

    rtlOverride(this); // quick fix for arabic

  }

  listenForLocations() {
    // <-- county stuff goes here...
    let searchElement = document.querySelector("cagov-county-search");

    searchElement.addEventListener(
        "county-selected",
        function (e) {
          this.region = e.detail.county;
          this.dataUrl = config.equityChartsDataLoc + this.chartOptions.dataUrl;
          this.retrieveData(this.dataUrl);
          // this.resetTitle();
        }.bind(this),
        false
      );

    let metricFilter = document.querySelector(
        "cagov-chart-filter-buttons.js-re-smalls"
      );
      metricFilter.addEventListener(
        "filter-selected",
        function (e) {
          if (e.detail.filterKey != undefined) {
            console.log("disparity filter selected",e.detail.filterKey);
            this.metric = e.detail.filterKey;
            this.renderComponent();
          }
        }.bind(this),
        false
      );      
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

  getTooltipContent(last_date_idx) {    
    if (last_date_idx >= this.line_series_array[0].length) {
        last_date_idx = this.line_series_array[0].length - 1;
    }
    if (last_date_idx < 0) {
        last_date_idx = 0;
    }
  
    let caption = '<table>';
    let date_label = this.translationsObj.tooltip_date_label;
    let date_value = reformatReadableDate(this.line_series_array[0][last_date_idx].DATE);
    caption += `  <tr><td class="tt-label">${date_label}:</td><td class="tt-value">${date_value}</td></tr>`;

    this.tooltiplabels.forEach(  (lab, i) => {      
      let value = formatValue(this.line_series_array[i][last_date_idx].VALUE/100.0,{format:'number'});
      caption += `  <tr><td class="tt-label">${lab}:</td><td class="tt-value">${value}</td></tr>`;
    });
    caption += '</table>';
    if (last_date_idx >= this.line_series_array[0].length - this.chartOptions.pending_units) {
      caption += `<br><span class="pending-caveat">${this.translationsObj.pending_caveat}</span>`;
    }
    return caption;
  }


  renderComponent() {
    console.log("Rendering Disparity Chart");

    const repDict = {
      METRIC: this.metric,
      REGION: this.region,
    };
    console.log("Applying substitutions",repDict);
    this.translationsObj.post_chartTitle = applySubstitutions(this.translationsObj.chartTitle, repDict);
    this.translationsObj.post_y_axis_legend = applySubstitutions(this.translationsObj.y_axis_legend, repDict);
    console.log("post_y_axis_legend",this.translationsObj.post_y_axis_legend);

    this.innerHTML = template.call(this, this.chartOptions, this.translationsObj);

    this.setupSelectFilters();

    let series_fields = this.chartOptions.series_fields;

    // let show_pending = hasURLSearchParam('grayarea') || hasURLSearchParam('pending');

    let line_series_array = [];

    const tokens = this.chartConfigTimerange.split('-');
    var requested_units_to_show = 8;
    if (tokens[0] == 'weeks') {
      requested_units_to_show = parseInt(tokens[1]);
    } else {
      // assume all timerange
      requested_units_to_show = 10000;
    }

    const pending_units = parseInt(getURLSearchParam('pending', ''+this.chartOptions.pending_units)); 
    const units_to_show = parseInt(getURLSearchParam('units', ''+requested_units_to_show));
    console.log("Time Range",this.chartConfigTimerange,"pending units",pending_units,"units_to_show",units_to_show);
    series_fields.forEach((label, i) => {
        let tseries_name = label.replaceAll(' ','_') + '_' + this.metric;
        // console.log("tseries_name =",tseries_name);
        let tseries = JSON.parse(JSON.stringify(this.chartdata.time_series[tseries_name].VALUES));
        tseries.splice(tseries.length-pending_units,pending_units);
        if (tseries.length > units_to_show) {
          // console.log("Clipping",tseries.length-units_to_show,"units > units_to_show")
          tseries.splice(0, tseries.length-units_to_show); 
        }
        line_series_array.push(tseries);
    });
    this.line_series_array = line_series_array;

    const displayDemoMap = termCheck();
    this.chartlabels = [...this.chartOptions.series_fields].map(x => displayDemoMap.get(x)? displayDemoMap.get(x) : x);
    this.tooltiplabels = [...this.chartOptions.series_fields].map(x => displayDemoMap.get(x)? displayDemoMap.get(x) : x);
    this.tooltiplabels[1] = "AI/AN";
    this.tooltiplabels[4] = "NHPI";

    let renderOptions = {
        'chart_options':this.chartOptions,
        'chart_style':this.chartOptions.chart_style,
        'extras_func':this.renderExtras,
        'line_series_array':line_series_array,
        'x_axis_field':this.chartOptions.x_axis_field,
        'y_axis_legend':this.translationsObj.post_y_axis_legend,
        'y_fmt':'number',
        'root_id':this.chartOptions.root_id + '_' + this.metric,
        'series_labels': this.chartlabels,
        'series_colors': this.chartOptions.series_colors,
        'pending_units': 0,
        'pending_label': this.translationsObj.pending_label,
        'unit':this.unit,
        'published_date': getSnowflakeStyleDate(0),
        'render_date': getSnowflakeStyleDate(0),
    };
    console.log("Calling disparity renderer");
    renderChart.call(this, renderOptions);
  }

  chartFilterSelectsHandler(selectFilters, e) {
    selectFilters.forEach((select) => {
      switch (select.dataset.type) {
        case 'time':
          this.chartConfigTimerange = select.value;
          console.log("Time Range",this.chartConfigTimerange);
          break;
        case 'filter':
          this.chartConfigFilter = select.value;
          break;
        default:
      }
    });
    this.renderComponent();
  }


  // Add event listener to select filters.
  setupSelectFilters() {
    const selectFilters = document.querySelectorAll(`cagov-chart-filter-select.js-filter-${this.chartConfigKey} select`);

    selectFilters.forEach((selectFitler) => {
      selectFitler.addEventListener(
        'change',
        this.chartFilterSelectsHandler.bind(this, selectFilters),
        false,
      );
    });
  }


  retrieveData(url) {
    // test test test - retrieve and ignore data...
    const fileregion = this.region.toLowerCase().replace(' ','_');
    console.log("Fetching disparity url",url);
    // url = 'https://data.covid19.ca.gov/data/dashboard/postvax/california.json'
    window
      .fetch(url)
      .then((response) => response.json())
      .then(
        function (alldata) {

          // console.log("Race/Eth data data", alldata.data);

          // TEST OVERRIDE
          // switch (fileregion) {
          //   case 'california':
          //       switch(this.unit) {
          //         case 'days':
          //           alldata = JSON.parse(JSON.stringify(testChartDataDaysCA));
          //           break;
          //         case 'weeks':
          //           alldata = JSON.parse(JSON.stringify(testChartDataWeeksCA));
          //           break;
          //         }
          //       break;
            // case 'losangeles':
            //     alldata = JSON.parse(JSON.stringify(testChartDataLA));
            //     break;
            // case 'sandiego':
            //     alldata = JSON.parse(JSON.stringify(testChartDataSD));
            //     break;
            // case 'mono':
            //     alldata = JSON.parse(JSON.stringify(testChartDataMono));
            //     break;
            // case 'alpine':
            //     alldata = JSON.parse(JSON.stringify(testChartDataAlpine));
            //     break;
          // }

          this.metadata = alldata.meta;
          this.chartdata = alldata.data;



          this.renderComponent();

        }.bind(this)
      );
  }

}

window.customElements.define(
  "cagov-chart-disparity-multi-linechart",
  CAGovDisparityMultiLineChart
);

