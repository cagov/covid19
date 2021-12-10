import { reformatReadableDate, parseSnowflakeDate } from "../../../common/readable-date.js";
import applySubstitutions from "./../../../common/apply-substitutions.js";
import formatValue from "./../../../common/value-formatters.js";
import CAGovDashboardChart from '../common/cagov-dashboard-chart.js';

// cagov-chart-dashboard-confirmed-deaths
class CAGovDashboardConfirmedDeaths extends CAGovDashboardChart {
 

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

  setupPostTranslations(regionName) {
    let latestRec = this.chartdata.latest[this.chartOptions.latestField];
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
    return repDict;
  }

  setupRenderOptions() {
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
    if (this.addStateLine) {
      renderOptions.time_series_state_line = this.statedata.time_series[this.chartOptions.seriesFieldAvg].VALUES;
    }
    return renderOptions;
  }

  listenForLocations() {
    CAGovDashboardChart.prototype.listenForLocations.call(this);
    // insures cases/deaths stay in sync
    window.addEventListener('cases-chart-filter-select', this.chartFilterSelectHandler.bind(this), false);
  }

}

window.customElements.define(
  "cagov-chart-dashboard-confirmed-deaths",
  CAGovDashboardConfirmedDeaths
);
