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
      VALUE_AVG:formatValue(lineSeries[di].VALUE,{format:'number',min_decimals:1}),
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
    // do this upon data retrieval (so 90-days etc is unaffected)

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
    this.is_averaged = false;
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

  renderComponent(regionName) {
    // Average uncroppedData here...
    if (!this.is_averaged) {
      let time_series_bars = JSON.parse(JSON.stringify(this.uncroppedChartData.time_series[this.chartOptions.seriesField].VALUES));
      let time_series_line = JSON.parse(JSON.stringify(time_series_bars));

      // compute 14-day average
      const avg_days = 14;
      for (let i = avg_days-1; i < time_series_bars.length; ++i) {
        let sum = 0;
        for (let j = 0; j < avg_days; ++j) {
          sum += time_series_bars[i-j].VALUE;
        }
        time_series_line[i].VALUE = sum / avg_days;
      }
      time_series_bars.splice(0,avg_days-1);
      time_series_line.splice(0,avg_days-1);
      let new_date_range = {
        MAXIMUM:time_series_bars[0].DATE,
        MINIMUM:time_series_bars[time_series_bars.length-1].DATE,
      };
      this.uncroppedChartData.time_series[this.chartOptions.seriesField].VALUES = time_series_bars;
      this.uncroppedChartData.time_series[this.chartOptions.seriesField].DATE_RANGE = new_date_range;
      this.uncroppedChartData.time_series[this.chartOptions.seriesFieldAvg] = {DATE_RANGE: new_date_range, VALUES:time_series_line};
      this.is_averaged = true;
    }
    CAGovDashboardChart.prototype.renderComponent.call(this, regionName);
  }
}


window.customElements.define(
  "cagov-chart-dashboard-icu-beds",
  CAGovDashboardICUBeds
);
