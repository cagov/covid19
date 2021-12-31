import { reformatReadableDate, getSnowflakeStyleDate, getSnowflakeStyleDateJS, parseSnowflakeDate } from "../../../common/readable-date.js";
import applySubstitutions from "./../../../common/apply-substitutions.js";
import formatValue from "./../../../common/value-formatters.js";
import CAGovDashboardChart from '../common/cagov-dashboard-chart.js';

// cagov-chart-dashboard-icu-beds
class CAGovDashboardICUBeds extends CAGovDashboardChart {
  
  getTooltipContent(di) {
    const barSeries = this.chartData.time_series[this.chartOptions.seriesField].VALUES;
    const lineSeries = this.chartData.time_series[this.chartOptions.seriesFieldAvg].VALUES;
    // console.log("getTooltipContent",di,lineSeries);
    const repDict = {
      DATE:   reformatReadableDate(barSeries[di].DATE),
      VALUE:formatValue(barSeries[di].VALUE,{format:'integer'}),
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
    return repDict;
  }

  setupRenderOptions() {
    let renderOptions = { 'tooltip_func':this.tooltip,
                      'extras_func':this.renderExtras,
                      'time_series_bars':this.chartData.time_series[this.chartOptions.seriesField].VALUES,
                      'time_series_line':this.chartData.time_series[this.chartOptions.seriesFieldAvg].VALUES,
                      'root_id':this.chartOptions.rootId,
                      'x_axis_legend':this.translationsObj.xAxisLegend,
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
              "ICU_BEDS": {
                "TOTAL": 0,
                "CHANGE": 0,
                "CHANGE_FACTOR": 0,
                "POPULATION": 13354
              },
            },
            "time_series": {
              "ICU_BEDS": {
                "DATE_RANGE": {
                  "MINIMUM": "2020-03-30",
                  "MAXIMUM": getSnowflakeStyleDate(-1)
                },
               "VALUES": []
              },
            }
          }
        };
        let sdate = parseSnowflakeDate(alldata.data.time_series.ICU_BEDS.DATE_RANGE.MINIMUM);
        let today = new Date();
        while (+sdate < +today) {
          alldata.data.time_series.ICU_BEDS.VALUES.push({DATE:getSnowflakeStyleDateJS(sdate),VALUE:0});
          sdate.setDate(sdate.getDate() + 1);
        }
        alldata.data.time_series.ICU_BEDS.VALUES.reverse();
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
  "cagov-chart-dashboard-icu-beds",
  CAGovDashboardICUBeds
);
