import template from "./../common/histogram-template.js";
import getTranslations from "../../../common/get-strings-list.js";
import getScreenResizeCharts from "../../../common/get-window-size.js";
import rtlOverride from "../../../common/rtl-override.js";
import chartConfig from '../common/line-chart-config.json';
import renderChart from "../common/histogram.js";
import { reformatReadableDate, parseSnowflakeDate } from "../../../common/readable-date.js";
import applySubstitutions from "./../../../common/apply-substitutions.js";
import formatValue from "./../../../common/value-formatters.js";

// cagov-chart-dashboard-positivity-rate
class CAGovDashboardPositivityRate extends window.HTMLElement {
  connectedCallback() {
    console.log("Loading CAGovDashboardPositivityRate");
    this.translationsObj = getTranslations(this);
    this.chartConfigFilter = this.dataset.chartConfigFilter;
    this.chartConfigKey = this.dataset.chartConfigKey;
    this.chartOptions = chartConfig[this.chartConfigKey][this.chartConfigFilter];
    this.stateData = null;
    this.county = 'California';

    // Settings and initial values
    // this.chartOptions = {
    //   chartName: 'cagov-chart-dashboard-positivity-rate',
    //   // Data
    //   dataUrl:
    //     config.chartsStateDashTablesLoc + "positivity-rate/california.json", // Overwritten by county.
    //   dataUrlCounty:
    //     config.chartsStateDashTablesLoc + "positivity-rate/<county>.json",

    //   desktop: {
    //     fontSize: 14,
    //     width: 400,     height: 300,
    //     margin: {   left: 50,   top: 30,  right: 60,  bottom: 45 },
    //   },
    //   tablet: {
    //     fontSize: 14,
    //     width: 400,     height: 300,
    //     margin: {   left: 50,   top: 30,  right: 60,  bottom: 45 },
    //   },
    //   mobile: {
    //     fontSize: 12,
    //     width: 400,     height: 300,
    //     margin: {   left: 50,   top: 30,  right: 60,  bottom: 45 },
    //   },
    //   retina: {
    //     fontSize: 12,
    //     width: 400,     height: 300,
    //     margin: {   left: 50,   top: 30,  right: 60,  bottom: 45 },
    //   },
    // };

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
    this.listenForTimeRange();
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
      '7DAY_POSRATE':formatValue(lineSeries[di].VALUE,{format:'percent'}),
      TOTAL_TESTS:formatValue(barSeries[di].VALUE,{format:'integer'}),
    };
    let caption = applySubstitutions(this.translationsObj.tooltipContent, repDict);
    let datumDate = parseSnowflakeDate(lineSeries[di].DATE);
    let pendingDate = parseSnowflakeDate(this.chartdata.latest[this.chartOptions.latestField].TESTING_UNCERTAINTY_PERIOD);
    if (+datumDate >= +pendingDate) {
      caption += `<br><span class="pending-caveat">${this.translationsObj.pending_caveat}</span>`;
    }
    return caption;
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
      test_positivity_7_days:formatValue(latestRec.test_positivity_7_days,{format:'percent'}),
      test_positivity_7_days_delta_7_days:formatValue(Math.abs(latestRec.test_positivity_7_days_delta_7_days),{format:'percent'}),
      REGION:regionName,
    };
    
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
    this.translationsObj.post_chartLegend2 = applySubstitutions(latestRec.test_positivity_7_days_delta_7_days >= 0? this.translationsObj.chartLegend2Increase : this.translationsObj.chartLegend2Decrease, repDict);
    this.translationsObj.currentLocation = regionName;

    this.innerHTML = template.call(this, this.chartOptions, this.translationsObj);
      
    let renderOptions = {'tooltip_func':this.tooltip,
                          'extras_func':this.renderExtras,
                          'time_series_bars':this.chartdata.time_series[this.chartOptions.seriesField].VALUES,
                          'time_series_line':this.chartdata.time_series[this.chartOptions.seriesFieldAvg].VALUES,
                          'left_y_fmt':'pct',
                          'root_id':'pos-rate',
                          'left_y_axis_legend':this.translationsObj.leftYAxisLegend,
                          'right_y_axis_legend':this.translationsObj.rightYAxisLegend,
                          'right_y_fmt':'integer',
                          'x_axis_legend':this.translationsObj.xAxisLegend,
                          'line_legend':this.regionName == 'California'? this.translationsObj.dayRate : null,
                          'pending_date':this.chartdata.latest[this.chartOptions.latestField].TESTING_UNCERTAINTY_PERIOD,
                          'pending_legend':this.translationsObj.pending,
                        };
      if (addStateLine) {
        renderOptions.time_series_state_line = this.statedata.time_series[this.chartOptions.seriesFieldAvg].VALUES;
      }
      renderChart.call(this, renderOptions);
  }

  cropData(timeRange) {
    console.log("Cropping test-positivity data",timeRange);
    const keys = [this.chartOptions.seriesField, this.chartOptions.seriesFieldAvg];
    const daysToKeepAry = [-1,31*6,90];
    const daysToKeep = daysToKeepAry[timeRange];
    if (daysToKeep > 0) {
      keys.forEach( (key) => {
        const chartSeries = this.chartdata.time_series[key];
        chartSeries.VALUES = chartSeries.VALUES.splice(0,daysToKeep);
        const lastValue = chartSeries.VALUES[chartSeries.VALUES.length-1];
        chartSeries.DATE_RANGE.MINIMUM = lastValue.DATE;
      });
    }
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
          this.cropData(this.timerange);
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
  }

  listenForTimeRange() {
    let timeElement = document.querySelector("cagov-timerange-buttons");
    timeElement.addEventListener(
      "timerange-selected",
      function (e) {
        this.timerange = e.detail.timerange;
        let countyEncoded = this.county.toLowerCase().replace(/ /g, "_");
        let searchURL = config.chartsStateDashTablesLoc + this.chartOptions.dataUrlCounty.replace(
          "<county>",
          countyEncoded
        );
        this.retrieveData(searchURL, this.county);
      }.bind(this),
      false
    );
  }

}


window.customElements.define(
  "cagov-chart-dashboard-positivity-rate",
  CAGovDashboardPositivityRate
);
