import template from "./../common/histogram-template.js";
import getTranslations from "../../../common/get-strings-list.js";
import getScreenResizeCharts from "../../../common/get-window-size.js";
import rtlOverride from "../../../common/rtl-override.js";
import chartConfig from '../common/line-chart-config.json';
import renderChart from "../common/histogram.js";
import { reformatReadableDate } from "../../../common/readable-date.js";
import applySubstitutions from "./../../../common/apply-substitutions.js";
import formatValue from "./../../../common/value-formatters.js";

// cagov-chart-dashboard-confirmed-deaths
class CAGovDashboardConfirmedDeaths extends window.HTMLElement {
  connectedCallback() {
    console.log("Loading CAGovDashboardConfirmedDeaths");
    this.translationsObj = getTranslations(this);
    this.chartConfigFilter = this.dataset.chartConfigFilter;
    this.chartConfigKey = this.dataset.chartConfigKey;
    // console.log("!!?",this.chartConfigFilter, this.chartConfigKey);
    // Settings and initial values
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
    const barSeries = this.chartdata.time_series[this.chartOptions.seriesField].VALUES;
    const lineSeries = this.chartdata.time_series[this.chartOptions.seriesFieldAvg].VALUES;
    // console.log("getTooltipContent",di,lineSeries);
    const repDict = {
      DATE:   reformatReadableDate(lineSeries[di].DATE),
      '7DAY_AVERAGE':formatValue(lineSeries[di].VALUE,{format:'number',min_decimals:1}),
      DEATHS:formatValue(barSeries[di].VALUE,{format:'integer'}),
    };
    return applySubstitutions(this.translationsObj.tooltipContent, repDict);
  }

  renderComponent(regionName) {
    let addStateLine = false;
    if (regionName == 'California') {
      this.statedata = this.chartdata;
    } else if (this.statedata) {
      addStateLine = true;
    }

    let latestRec = this.chartdata.latest[this.chartOptions.latestField];

    const repDict = {
      total_confirmed_deaths:formatValue(latestRec.total_confirmed_deaths,{format:'integer'}),
      new_deaths:formatValue(latestRec.new_deaths,{format:'integer'}),
      new_deaths_delta_1_day:formatValue(Math.abs(latestRec.new_deaths_delta_1_day),{format:'percent'}),
      deaths_per_100k_7_days:formatValue(latestRec.deaths_per_100k_7_days,{format:'number',min_decimals:1}),
    };

    this.translationsObj.post_chartTitle = applySubstitutions(this.translationsObj.chartTitle, repDict);
    this.translationsObj.post_chartLegend1 = applySubstitutions(this.translationsObj.chartLegend1, repDict);
    this.translationsObj.post_chartLegend2 = applySubstitutions(latestRec.new_deaths_delta_1_day >= 0? this.translationsObj.chartLegend2Increase : this.translationsObj.chartLegend2Decrease, repDict);
    this.translationsObj.post_chartLegend3 = applySubstitutions(this.translationsObj.chartLegend3, repDict);
    this.translationsObj.currentLocation = regionName;

    // console.log("Translations obj",this.translationsObj);
    this.innerHTML = template(this.translationsObj);
    try {
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
    } catch (e) {
      console.log("Error",e,this.chartBreakpointValues,this.screenDisplayType);
    }

    this.tooltip = d3
      .select(this.chartOptions.chartName)
      .append("div")
      .attr("class", "tooltip-container")
      .text("Empty Tooltip");

    let renderOptions = {'tooltip_func':this.tooltip,
                        'extras_func':this.renderExtras,
                        'time_series_bars':this.chartdata.time_series[this.chartOptions.seriesField].VALUES,
                        'time_series_line':this.chartdata.time_series[this.chartOptions.seriesFieldAvg].VALUES,
                        'root_id':this.chartOptions.rootId,
                        'left_y_axis_legend':this.translationsObj[this.chartConfigKey+'_leftYAxisLegend'],
                        'right_y_axis_legend':this.translationsObj[this.chartConfigKey+'_rightYAxisLegend'],
                        'x_axis_legend':this.translationsObj[this.chartConfigKey+'_'+this.chartConfigFilter+'_xAxisLegend'],
                        'line_legend':this.translationsObj.dayAverage,
                        'pending_date':this.chartdata.latest[this.chartOptions.latestField].DEATH_UNCERTAINTY_PERIOD,
                        'pending_legend':this.translationsObj.pending,
                        };
    if (addStateLine) {
      renderOptions.time_series_state_line = this.statedata.time_series[this.chartOptions.seriesFieldAvg].VALUES;
    }

    renderChart.call(this, renderOptions);
  }

  retrieveData(url, regionName) {
    window
      .fetch(url)
      .then((response) => response.json())
      .then(
        function (alldata) {
          // console.log("Race/Eth data data", alldata.data);
          this.regionName = regionName;
          this.metadata = alldata.meta;
          this.chartdata = alldata.data;
          this.renderComponent(regionName);
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
          this.county.toLowerCase().replace(/ /g, "_")
        );
        this.retrieveData(searchURL, e.detail.county);
      }.bind(this),
      false
    );
    let myFilter = document.querySelector("cagov-chart-filter-buttons.js-filter-deaths");
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
            this.county.toLowerCase().replace(/ /g, "_")
          );
        }
        this.renderComponent(this.regionName);
      }.bind(this),
      false
    );
  }
}

window.customElements.define(
  "cagov-chart-dashboard-confirmed-deaths",
  CAGovDashboardConfirmedDeaths
);
