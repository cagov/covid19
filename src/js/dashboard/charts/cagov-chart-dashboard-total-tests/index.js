import { reformatReadableDate, parseSnowflakeDate } from "../../../common/readable-date.js";
import applySubstitutions from "./../../../common/apply-substitutions.js";
import formatValue from "./../../../common/value-formatters.js";
import CAGovDashboardChart from '../common/cagov-dashboard-chart.js';

// cagov-chart-dashboard-total-tests
class CAGovDashboardTotalTests extends CAGovDashboardChart {
  
  getTooltipContent(di) {
    const barSeries = this.chartdata.time_series[this.chartOptions.seriesField].VALUES;
    const lineSeries = this.chartdata.time_series[this.chartOptions.seriesFieldAvg].VALUES;
    const repDict = {
      DATE:   reformatReadableDate(lineSeries[di].DATE),
      '7DAY_AVERAGE':formatValue(lineSeries[di].VALUE,{format:'number',min_decimals:1}),
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

  setupPostTranslations(regionName) {
    let latestRec = this.chartdata.latest[this.chartOptions.latestField];

    const repDict = {
      total_tests_performed:formatValue(latestRec.total_tests_performed,{format:'integer'}),
      new_tests_reported:formatValue(Math.abs(latestRec.new_tests_reported),{format:'integer'}),
      new_tests_reported_delta_1_day:formatValue(Math.abs(latestRec.new_tests_reported_delta_1_day),{format:'percent'}),
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
    this.translationsObj.post_chartLegend2 = applySubstitutions(latestRec.new_tests_reported_delta_1_day >= 0? this.translationsObj.chartLegend2Increase : this.translationsObj.chartLegend2Decrease, repDict);
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
      renderOptions.pending_date = this.chartdata.latest[this.chartOptions.latestField].TESTING_UNCERTAINTY_PERIOD;
      renderOptions.pending_legend = this.translationsObj.pending;
    }
    if (this.addStateLine) {
      renderOptions.time_series_state_line = this.statedata.time_series[this.chartOptions.seriesFieldAvg].VALUES;
    }  
    return renderOptions;
  }

}

window.customElements.define(
  "cagov-chart-dashboard-total-tests",
  CAGovDashboardTotalTests
);
