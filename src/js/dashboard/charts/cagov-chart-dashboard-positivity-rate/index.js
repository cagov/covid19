import { reformatReadableDate, parseSnowflakeDate } from "../../../common/readable-date.js";
import applySubstitutions from "./../../../common/apply-substitutions.js";
import formatValue from "./../../../common/value-formatters.js";
import CAGovDashboardChart from '../common/cagov-dashboard-chart.js';

// cagov-chart-dashboard-positivity-rate
class CAGovDashboardPositivityRate extends CAGovDashboardChart {

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

  setupPostTranslations(regionName) {
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

    return repDict;
  }

  setupRenderOptions() {
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
    if (this.addStateLine) {
      renderOptions.time_series_state_line = this.statedata.time_series[this.chartOptions.seriesFieldAvg].VALUES;
    }
    return renderOptions;
  }

}


window.customElements.define(
  "cagov-chart-dashboard-positivity-rate",
  CAGovDashboardPositivityRate
);
