import { reformatReadableDate, getSnowflakeStyleDate, getSnowflakeStyleDateJS, parseSnowflakeDate } from "../../../common/readable-date.js";
import applySubstitutions from "./../../../common/apply-substitutions.js";
import formatValue from "./../../../common/value-formatters.js";
import CAGovDashboardChart from '../common/cagov-dashboard-chart.js';

// cagov-chart-dashboard-patients
class CAGovDashboardPatients extends CAGovDashboardChart {

  getTooltipContent(di) {
    const barSeries = this.chartData.time_series[this.chartOptions.seriesField].VALUES;
    const lineSeries = this.chartData.time_series[this.chartOptions.seriesFieldAvg].VALUES;
    // console.log("getTooltipContent",di,lineSeries);
    const repDict = {
      DATE:   reformatReadableDate(barSeries[di].DATE),
      '14DAY_AVERAGE':formatValue(lineSeries[di].VALUE,{format:'number',min_decimals:1}),
      TOTAL_HOSPITALIZED:formatValue(barSeries[di].VALUE,{format:'integer'}),
    };
    return applySubstitutions(this.translationsObj.tooltipContent, repDict);
  }

  setupPostTranslations(regionName) {
    let latestRec = this.chartData.latest[this.chartOptions.latestField];
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
    return repDict;
  }

  setupRenderOptions() {
    const renderOptions = {'tooltip_func':this.tooltip,
                      'extras_func':this.renderExtras,
                      'time_series_bars':this.chartData.time_series[this.chartOptions.seriesField].VALUES,
                      'time_series_line':this.chartData.time_series[this.chartOptions.seriesFieldAvg].VALUES,
                      'root_id':this.chartOptions.rootId,
                      'x_axis_legend':this.translationsObj.xAxisLegend,
                      'line_legend':this.translationsObj.dayAverage,
                      'month_modulo':2,
                    };

    return renderOptions;
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
      alldata.data.time_series.HOSPITALIZED_PATIENTS.VALUES.reverse();
      alldata.data.time_series.ICU_PATIENTS.VALUES.reverse();
      alldata.data.time_series.HOSPITALIZED_PATIENTS_14_DAY_AVG.VALUES.reverse();
      alldata.data.time_series.ICU_PATIENTS_14_DAY_AVG.VALUES.reverse();
      this.regionName = regionName;
      this.metadata = alldata.meta;
      this.chartdata = alldata.data;
      this.uncroppedChartData = alldata.data;
      this.renderComponent(regionName);
    }
    else {
      CAGovDashboardChart.prototype.retrieveData.call(this, url, regionName);
    }
  }
}

window.customElements.define(
  "cagov-chart-dashboard-patients",
  CAGovDashboardPatients
);
