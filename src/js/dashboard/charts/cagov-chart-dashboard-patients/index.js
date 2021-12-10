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

}

window.customElements.define(
  "cagov-chart-dashboard-patients",
  CAGovDashboardPatients
);
