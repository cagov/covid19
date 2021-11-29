import template from "./../common/histogram-template.js";
import chartConfig from '../common/line-chart-config.json';
import getTranslations from "../../../common/get-strings-list.js";
import getScreenResizeCharts from "../../../common/get-window-size.js";
import rtlOverride from "../../../common/rtl-override.js";
import renderChart from "./histogram.js";
import { reformatReadableDate, getSnowflakeStyleDate, getSnowflakeStyleDateJS, parseSnowflakeDate } from "../../../common/readable-date.js";
import applySubstitutions from "./../../../common/apply-substitutions.js";
import formatValue from "./../../../common/value-formatters.js";

// cagov-chart-dashboard-patients
class CAGovDashboardPatients extends window.HTMLElement {
  connectedCallback() {
    console.log("Loading CAGovDashboardPatients");
    this.translationsObj = getTranslations(this);
    this.chartConfigFilter = this.dataset.chartConfigFilter;
    this.chartConfigKey = this.dataset.chartConfigKey;
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
      DATE:   reformatReadableDate(barSeries[di].DATE),
      '14DAY_AVERAGE':formatValue(lineSeries[di].VALUE,{format:'number',min_decimals:1}),
      TOTAL_HOSPITALIZED:formatValue(barSeries[di].VALUE,{format:'integer'}),
    };
    return applySubstitutions(this.translationsObj.tooltipContent, repDict);
  }

  renderComponent(regionName) {
    console.log("Setting up patients replacements",this.chartConfigFilter,this.chartConfigKey,regionName);

    var latestRec = this.chartdata.latest[this.chartOptions.latestField];

    const repDict = {
      TOTAL:formatValue(latestRec.TOTAL,{format:'integer'}),
      CHANGE:formatValue(Math.abs(latestRec.CHANGE),{format:'integer'}),
      CHANGE_FACTOR:formatValue(Math.abs(latestRec.CHANGE_FACTOR),{format:'percent'}),
      REGION:regionName,
    };

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
    
    this.innerHTML = template.call(this, this.chartOptions, this.translationsObj);
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

  cropData(timeRange) {
    console.log("Cropping patients data",timeRange);
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
    if (regionName == 'Alpine') {
      let alldata = {
        "meta": {
          "PUBLISHED_DATE": getSnowflakeStyleDate(0),
          "coverage": regionName,
        },
        "data": {
          "latest": {
            "HOSPITALIZED_PATIENTS": {
              "TOTAL": 0,
              "CHANGE": 0,
              "CHANGE_FACTOR": 0,
              "POPULATION": 13354
            },
            "ICU_PATIENTS": {
              "TOTAL": 0,
              "CHANGE": 0,
              "CHANGE_FACTOR": 0,
              "POPULATION": 13354
            }
          },
          "time_series": {
            "HOSPITALIZED_PATIENTS": {
              "DATE_RANGE": {
                "MINIMUM": "2020-03-30",
                "MAXIMUM": getSnowflakeStyleDate(-1)
              },
             "VALUES": []
            },
            "ICU_PATIENTS": {
              "DATE_RANGE": {
                "MINIMUM": "2020-03-30",
                "MAXIMUM": getSnowflakeStyleDate(-1)
              },
             "VALUES": []
            },
            "HOSPITALIZED_PATIENTS_14_DAY_AVG": {
              "DATE_RANGE": {
                "MINIMUM": "2020-03-30",
                "MAXIMUM": getSnowflakeStyleDate(-1)
              },
             "VALUES": []
            },
            "ICU_PATIENTS_14_DAY_AVG": {
              "DATE_RANGE": {
                "MINIMUM": "2020-03-30",
                "MAXIMUM": getSnowflakeStyleDate(-1)
              },
             "VALUES": []
            },
          }
        }
      };

      let sdate = parseSnowflakeDate(alldata.data.time_series.HOSPITALIZED_PATIENTS.DATE_RANGE.MINIMUM);
      let today = new Date();
      while (+sdate < +today) {
        alldata.data.time_series.HOSPITALIZED_PATIENTS.VALUES.push({DATE:getSnowflakeStyleDateJS(sdate),VALUE:0});
        alldata.data.time_series.ICU_PATIENTS.VALUES.push({DATE:getSnowflakeStyleDateJS(sdate),VALUE:0});
        alldata.data.time_series.HOSPITALIZED_PATIENTS_14_DAY_AVG.VALUES.push({DATE:getSnowflakeStyleDateJS(sdate),VALUE:0});
        alldata.data.time_series.ICU_PATIENTS_14_DAY_AVG.VALUES.push({DATE:getSnowflakeStyleDateJS(sdate),VALUE:0});
        sdate.setDate(sdate.getDate() + 1);
      }

      this.metadata = alldata.meta;
      this.chartdata = alldata.data;
      this.regionName = regionName;
      this.cropData(this.timerange);
      this.renderComponent(regionName);
    } else {
      window
        .fetch(url)
        .then((response) => response.json() )
        .then(
          function (alldata) {
            // console.log("Race/Eth data data", alldata.data);
            this.metadata = alldata.meta;
            this.chartdata = alldata.data;
            this.regionName = regionName;
            this.renderComponent(regionName);
          }.bind(this)
        );
    }
  }

  setupTabFilters() {
    let myFilter = document.querySelector("cagov-chart-filter-buttons.js-filter-patients");
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
        // this.retrieveData(searchURL, this.regionName);
      }.bind(this),
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
  "cagov-chart-dashboard-patients",
  CAGovDashboardPatients
);
