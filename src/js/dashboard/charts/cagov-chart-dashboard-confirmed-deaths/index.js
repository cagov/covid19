import template from "./../common/histogram-template.js";
import getTranslations from "../../../common/get-strings-list.js";
import getScreenResizeCharts from "../../../common/get-window-size.js";
import rtlOverride from "../../../common/rtl-override.js";
import chartConfig from '../common/line-chart-config.json';
import renderChart from "../common/histogram.js";
import { reformatReadableDate, parseSnowflakeDate } from "../../../common/readable-date.js";
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
    this.county = 'California';

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
      '7DAY_AVERAGE':formatValue(lineSeries[di].VALUE,{format:'number',min_decimals:1}),
      DEATHS:formatValue(barSeries[di].VALUE,{format:'integer'}),
    };
    let caption = applySubstitutions(this.translationsObj.tooltipContent, repDict);
    let datumDate = parseSnowflakeDate(lineSeries[di].DATE);
    let pendingDate = parseSnowflakeDate(this.chartdata.latest[this.chartOptions.latestField].DEATH_UNCERTAINTY_PERIOD);
    if (+datumDate >= +pendingDate) {
      caption += `<br><span class="pending-caveat">${this.translationsObj.pending_caveat}</span>`;
    }
    return caption;
  }

  renderComponent(regionName) {
    console.log("Render component deaths",this);
    let addStateLine = false;
    if (regionName == 'California') {
      this.statedata = this.chartdata;
    } else if (this.statedata) {
      addStateLine = true;
    }

    let latestRec = this.chartdata.latest[this.chartOptions.latestField];
    // console.log("Deaths Increase",Math.abs(latestRec.new_deaths_delta_1_day),latestRec.new_deaths_delta_1_day);
    const repDict = {
      total_confirmed_deaths:formatValue(latestRec.total_confirmed_deaths,{format:'integer'}),
      new_deaths:formatValue(latestRec.new_deaths,{format:'integer'}),
      new_deaths_delta_1_day:formatValue(Math.abs(latestRec.new_deaths_delta_1_day),{format:'percent'}),
      deaths_per_100k_7_days:formatValue(latestRec.deaths_per_100k_7_days,{format:'number',min_decimals:1}),
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
    this.translationsObj.post_chartLegend1 = applySubstitutions(this.translationsObj.chartLegend1, repDict);
    this.translationsObj.post_chartLegend2 = applySubstitutions(latestRec.new_deaths_delta_1_day >= 0? this.translationsObj.chartLegend2Increase : this.translationsObj.chartLegend2Decrease, repDict);
    this.translationsObj.post_chartLegend3 = applySubstitutions(this.translationsObj.chartLegend3, repDict);
    this.translationsObj.currentLocation = regionName;

    // console.log("Translations obj",this.translationsObj);
    this.innerHTML = template.call(this,this.chartOptions, this.translationsObj);

    this.setupTabFilters();

    let renderOptions = {'tooltip_func':this.tooltip,
                        'extras_func':this.renderExtras,
                        'time_series_bars':this.chartdata.time_series[this.chartOptions.seriesField].VALUES,
                        'time_series_line':this.chartdata.time_series[this.chartOptions.seriesFieldAvg].VALUES,
                        'root_id':this.chartOptions.rootId,
                        'left_y_axis_legend':this.translationsObj[this.chartConfigKey+'_leftYAxisLegend'],
                        'right_y_axis_legend':this.translationsObj[this.chartConfigKey+'_rightYAxisLegend'],
                        'right_y_fmt':'integer',
                        'x_axis_legend':this.translationsObj[this.chartConfigKey+'_'+this.chartConfigFilter+'_xAxisLegend'],
                        'line_legend':this.regionName == 'California'? this.translationsObj.dayAverage : null,
                        };
    if (this.chartConfigFilter != 'reported') {
      renderOptions.pending_date = this.chartdata.latest[this.chartOptions.latestField].DEATH_UNCERTAINTY_PERIOD;
      renderOptions.pending_legend = this.translationsObj.pending;
    }
    if (addStateLine) {
      renderOptions.time_series_state_line = this.statedata.time_series[this.chartOptions.seriesFieldAvg].VALUES;
    }

    renderChart.call(this, renderOptions);
  }


  cropData(timeRange) {
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

  chartFilterSelectHandler(e) {
    console.log("deaths chartfilter");
    this.chartConfigFilter = e.detail.filterKey;
    if (this.chartConfigFilter != 'reported') {
      this.chartConfigFilter = 'death';
      document.querySelector('cagov-chart-filter-buttons.js-filter-deaths .small-tab[data-key="death"]').classList.add('active');
      document.querySelector('cagov-chart-filter-buttons.js-filter-deaths .small-tab[data-key="reported"]').classList.remove('active');
    } else {
      document.querySelector('cagov-chart-filter-buttons.js-filter-deaths .small-tab[data-key="death"]').classList.remove('active');
      document.querySelector('cagov-chart-filter-buttons.js-filter-deaths .small-tab[data-key="reported"]').classList.add('active');
    }
    this.chartOptions = chartConfig[this.chartConfigKey][this.chartConfigFilter];
    this.renderComponent(this.regionName);
  }

  tabFilterHandler(e) {
    this.chartFilterSelectHandler(e);
    const event = new window.CustomEvent('deaths-chart-filter-select',{detail:{filterKey: this.chartConfigFilter}});
    window.dispatchEvent(event);    
  }

  setupTabFilters() {

    let myFilter = document.querySelector("cagov-chart-filter-buttons.js-filter-deaths");
    myFilter.addEventListener(
      "filter-selected",
      this.tabFilterHandler.bind(this),
      false
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
    window.addEventListener('cases-chart-filter-select', this.chartFilterSelectHandler.bind(this), false);
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
  "cagov-chart-dashboard-confirmed-deaths",
  CAGovDashboardConfirmedDeaths
);
