import template from "./../common/histogram-template.js";
import chartConfig from '../common/line-chart-config.json';
import getTranslations from "../../../common/get-strings-list.js";
import getScreenResizeCharts from "../../../common/get-window-size.js";
import rtlOverride from "../../../common/rtl-override.js";
import renderChart from "../common/histogram.js";
import { reformatReadableDate, getSnowflakeStyleDate, getSnowflakeStyleDateJS, parseSnowflakeDate } from "../../../common/readable-date.js";
import applySubstitutions from "./../../../common/apply-substitutions.js";
import formatValue from "./../../../common/value-formatters.js";
import CAGovDashboardChart from '../common/cagov-dashboard-chart.js';

// cagov-chart-dashboard-patients
class CAGovDashboardPatients extends CAGovDashboardChart {
  connectedCallback() {
    console.log("Loading CAGovDashboardPatients");
    this.translationsObj = getTranslations(this);
    this.chartConfigFilter = this.dataset.chartConfigFilter;
    this.chartConfigKey = this.dataset.chartConfigKey;
    this.chartConfigTimerange = this.dataset.chartConfigTimerange;
    this.county = 'California';

    // Settings and initial values
    this.chartOptions = chartConfig[this.chartConfigKey][this.chartConfigFilter];

    getScreenResizeCharts(this);

    this.screenDisplayType = window.charts
      ? window.charts.displayType
      : "desktop";
    // console.log("this.screenDisplayType",this.screenDisplayType);

    this.chartBreakpointValues = chartConfig[
      this.screenDisplayType ? this.screenDisplayType : "desktop"
    ];
    this.chartBreakpointValues = JSON.parse(JSON.stringify(this.chartBreakpointValues));
    this.dimensions = this.chartBreakpointValues;
    this.dimensions.margin.right = 20;

    window.addEventListener("resize", this.handleChartResize);

    // Set default values for data and labels
    this.dataUrl = config.chartsStateDashTablesLoc + this.chartOptions.dataUrl;

    this.retrieveData(this.dataUrl, 'California');

    rtlOverride(this); // quick fix for arabic

    this.listenForLocations();
  }

  getTooltipContent(di) {
    const barSeries = this.chartdata.time_series[this.chartOptions.seriesField].VALUES;
    const lineSeries = this.chartdata.time_series[this.chartOptions.seriesFieldAvg].VALUES;
    // console.log("getTooltipContent",di,lineSeries);
    const repDict = {
      DATE:   reformatReadableDate(barSeries[di].DATE),
      '14DAY_AVERAGE':formatValue(lineSeries[di].VALUE,{format:'number',min_decimals:1}),
      TOTAL_HOSPITALIZED:formatValue(barSeries[di].VALUE,{format:'integer'}),
    };
    return applySubstitutions(this.translationsObj.tooltipContent, repDict);
  }

  renderComponent(regionName) {
    console.log("RENDER component patients");

    this.cropData(this.chartConfigTimerange);

    var latestRec = this.chartdata.latest[this.chartOptions.latestField];

    const repDict = {
      TOTAL:formatValue(latestRec.TOTAL,{format:'integer'}),
      CHANGE:formatValue(Math.abs(latestRec.CHANGE),{format:'integer'}),
      CHANGE_FACTOR:formatValue(Math.abs(latestRec.CHANGE_FACTOR),{format:'percent'}),
      REGION:regionName,
    };
    console.log("RENDER component patients A");

    if (this.chartConfigFilter == 'icu') {
      if (!('chartTitleStateICU' in this.translationsObj)) {
        this.translationsObj.post_chartTitle = applySubstitutions(this.translationsObj.chartTitleICU, repDict) + " " + regionName;
      } 
      else if (regionName == 'California') {
        this.translationsObj.post_chartTitle = applySubstitutions(this.translationsObj.chartTitleStateICU, repDict);
      } else {
        this.translationsObj.post_chartTitle = applySubstitutions(this.translationsObj.chartTitleCountyICU, repDict);
      }
      // this.translationsObj.post_chartTitle = applySubstitutions(this.translationsObj.chartTitleICU, repDict);
      this.translationsObj.post_chartLegend1 = applySubstitutions(this.translationsObj.chartLegend1ICU, repDict);
      this.translationsObj.post_chartLegend2 = applySubstitutions(latestRec.CHANGE_FACTOR >= 0? this.translationsObj.chartLegend2IncreaseICU : this.translationsObj.chartLegend2DecreaseICU, repDict);
      this.translationsObj.currentLocation = regionName;
    } else {
      if (!('chartTitleState' in this.translationsObj)) {
        this.translationsObj.post_chartTitle = applySubstitutions(this.translationsObj.chartTitle, repDict) + " " + regionName;
      } 
      else if (regionName == 'California') {
        this.translationsObj.post_chartTitle = applySubstitutions(this.translationsObj.chartTitleState, repDict);
      } else {
        this.translationsObj.post_chartTitle = applySubstitutions(this.translationsObj.chartTitleCounty, repDict);
      }
      // this.translationsObj.post_chartTitle = applySubstitutions(this.translationsObj.chartTitle, repDict);
      this.translationsObj.post_chartLegend1 = applySubstitutions(this.translationsObj.chartLegend1, repDict);
      this.translationsObj.post_chartLegend2 = applySubstitutions(latestRec.CHANGE_FACTOR >= 0? this.translationsObj.chartLegend2Increase : this.translationsObj.chartLegend2Decrease, repDict);
      this.translationsObj.currentLocation = regionName;
    }
    console.log("RENDER component patients B");

    this.innerHTML = template.call(this, this.chartOptions, this.translationsObj);

    console.log("RENDER component patients C");

    this.setupTabFilters();

    let renderOptions = {'tooltip_func':this.tooltip,
                      'extras_func':this.renderExtras,
                      'time_series_bars':this.chartdata.time_series[this.chartOptions.seriesField].VALUES,
                      'time_series_line':this.chartdata.time_series[this.chartOptions.seriesFieldAvg].VALUES,
                      'root_id':this.chartOptions.rootId,
                      'x_axis_legend':this.translationsObj.xAxisLegend,
                      'line_legend':this.translationsObj.dayAverage,
                      'month_modulo':2,
                    };
    renderChart.call(this, renderOptions);
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
  }


}

window.customElements.define(
  "cagov-chart-dashboard-patients",
  CAGovDashboardPatients
);
