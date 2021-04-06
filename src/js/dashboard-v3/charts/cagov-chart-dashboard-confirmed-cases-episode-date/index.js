import template from "./template.js";
import chartConfig from './line-chart-config.json';
import getTranslations from "../../../common/get-strings-list.js";
import getScreenResizeCharts from "../../../common/get-window-size.js";
import rtlOverride from "../../../common/rtl-override.js";
import renderChart from "../common/histogram.js";
import { reformatReadableDate } from "../../../common/readable-date.js";
import applySubstitutions from "./../../../common/apply-substitutions.js";
import formatValue from "./../../../common/value-formatters.js";

class CAGovDashboardConfirmedCasesEpisodeDate extends window.HTMLElement {
  connectedCallback() {
    console.log("Loading CAGovDashboardConfirmedCasesEpisodeDate");
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
    this.dataUrl = config.chartsStateDashTablesLoc + this.chartOptions.dataUrl;

    this.retrieveData(this.dataUrl, 'California');

    rtlOverride(this); // quick fix for arabic

    this.listenForLocations();
  }

  ariaLabel(d, baselineData) {
    let caption = ''; // !!!
    return caption;
  }

  getLegendText() {
    return [];
    //   this.translationsObj.chartLegend1,
    //   this.translationsObj.chartLegend2,
    // ];
  }

  renderExtras(svg, data, x, y) {
  }

  getTooltipContent(di) {
    const barSeries = this.chartdata.time_series[this.chartOptions.seriesField];
    const lineSeries = this.chartdata.time_series[this.chartOptions.seriesFieldAvg];
    // console.log("getTooltipContent",di,lineSeries);
    const repDict = {
      DATE:   reformatReadableDate(lineSeries[di].DATE),
      '7DAY_AVERAGE':formatValue(lineSeries[di].VALUE,{format:'number',min_decimals:1}),
      CASES:formatValue(barSeries[di].VALUE,{format:'integer'}),
    };
    return applySubstitutions(this.translationsObj.tooltipContent, repDict);
  }

  retrieveData(url, regionName) {
    window
      .fetch(url)
      .then((response) => response.json())
      .then(
        function (alldata) {
          // console.log("Race/Eth data data", alldata.data);
          this.metadata = alldata.meta;
          this.chartdata = alldata.data;
          const repDict = {
            total_confirmed_cases:formatValue(this.chartdata.latest[this.chartOptions.seriesField].total_confirmed_cases,{format:'integer'}),
            new_cases:formatValue(this.chartdata.latest[this.chartOptions.seriesField].new_cases,{format:'integer'}),
            new_cases_delta_1_day:formatValue(Math.abs(this.chartdata.latest[this.chartOptions.seriesField].new_cases_delta_1_day),{format:'percent'}),
            cases_per_100k_7_days:formatValue(this.chartdata.latest[this.chartOptions.seriesField].cases_per_100k_7_days,{format:'number',min_decimals:1}),
          };

          this.translationsObj.post_chartLegend1 = applySubstitutions(this.translationsObj.chartLegend1, repDict);
          this.translationsObj.post_chartLegend2 = applySubstitutions(this.chartdata.latest[this.chartOptions.seriesField].new_cases_delta_1_day >= 0? this.translationsObj.chartLegend2Increase : this.translationsObj.chartLegend2Decrease, repDict);
          this.translationsObj.post_chartLegend3 = applySubstitutions(this.translationsObj.chartLegend3, repDict);
          this.translationsObj.currentLocation = regionName;

          this.innerHTML = template(this.translationsObj);

          this.svg = d3
          .select(this.querySelector(".svg-holder"))
          .append("svg")
          .attr("viewBox", [
            0,
            0,
            this.chartBreakpointValues.width,
            this.chartBreakpointValues.height,
          ])
          .append("g")
          .attr("transform", "translate(0,0)");
    
        this.tooltip = d3
          .select(this.chartOptions.chartName)
          .append("div")
          .attr("class", "tooltip-container")
          .text("Empty Tooltip");

        renderChart.call(this, this.chartdata, {'tooltip_func':this.tooltip,
                                                'extras_func':this.renderExtras,
                                                'time_series_key_bars':this.chartOptions.seriesField,
                                                'time_series_key_line':this.chartOptions.seriesFieldAvg,
                                                'left_y_div':20,
                                                'right_y_div':10000,
                                                'root_id':this.chartOptions.rootId,
                                                'left_y_axis_legend':this.translationsObj[this.chartConfigKey+'_leftYAxisLegend'],
                                                'right_y_axis_legend':this.translationsObj[this.chartConfigKey+'_rightYAxisLegend'],
                                                'x_axis_legend':this.translationsObj[this.chartConfigKey+'_'+this.chartConfigFilter+'_xAxisLegend'],
                                                'line_legend':this.translationsObj.dayAverage,
                                                'pending_date':this.chartdata.latest[this.chartOptions.seriesField].EPISODE_UNCERTAINTY_PERIOD,
                                                'pending_legend':'Pending',
                                              });


        }.bind(this)
      );
  }

  listenForLocations() {
    let searchElement = document.querySelector("cagov-county-search");
    searchElement.addEventListener(
      "county-selected",
      function (e) {
        this.county = e.detail.county;
        let searchURL = config.chartsStateDashTablesLoc + this.chartOptions.dataUrlCounty.replace(
          "<county>",
          this.county.toLowerCase().replace(/ /g, "")
        );
        this.retrieveData(searchURL, e.detail.county);
      }.bind(this),
      false
    );
    let myFilter = document.querySelector("cagov-chart-filter-buttons.js-filter-cases");
    myFilter.addEventListener(
      "filter-selected",
      function (e) {
        this.chartConfigFilter = e.detail.filterKey;
        this.chartOptions = chartConfig[this.chartConfigKey][this.chartConfigFilter];
        // if I am in a county have to do county url replacement
        let searchURL = config.chartsStateDashTablesLoc + this.chartOptions.dataUrl;
        if(this.county && this.county !== 'California') {
          searchURL = config.chartsStateDashTablesLoc + this.chartOptions.dataUrlCounty.replace(
            "<county>",
            this.county.toLowerCase().replace(/ /g, "")
          );
        }
        this.retrieveData(searchURL, e.detail.county);
      }.bind(this),
      false
    );
  }

  /*
  still need some args passed to renderChart
  */

}

window.customElements.define(
  "cagov-chart-dashboard-confirmed-cases-episode-date",
  CAGovDashboardConfirmedCasesEpisodeDate
);
