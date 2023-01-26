import { reformatReadableDate, parseSnowflakeDate } from "../../../common/readable-date.js";
import applySubstitutions from "./../../../common/apply-substitutions.js";
import formatValue from "./../../../common/value-formatters.js";
import CAGovDashboardChart from '../common/cagov-dashboard-chart.js';

// cagov-chart-dashboard-confirmed-deaths
class CAGovDashboardConfirmedDeaths extends CAGovDashboardChart {
 
  getTooltipContent(di) {
    const barSeries = this.chartData.time_series[this.chartOptions.seriesField].VALUES;
    const lineSeries = this.chartData.time_series[this.chartOptions.seriesFieldAvg].VALUES;
    let caption = undefined;
    // console.log("getTooltipContent",di,lineSeries);
    if ('seriesSubFields' in this.chartOptions) {
      const barSeries_prob = this.chartData.time_series[this.chartOptions.seriesSubFields[0]].VALUES;
      const barSeries_conf = this.chartData.time_series[this.chartOptions.seriesSubFields[1]].VALUES;

      const repDict = {
        DATE:             reformatReadableDate(lineSeries[di].DATE),
        '7DAY_AVERAGE':   formatValue(lineSeries[di].VALUE,{format:'number',min_decimals:1}),
        CONFIRMED_DEATHS: formatValue(barSeries_conf[di].VALUE,{format:'integer'}),
        PROBABLE_DEATHS:  formatValue(barSeries_prob[di].VALUE,{format:'integer'}),
        COMBINED_DEATHS:  formatValue(barSeries[di].VALUE,{format:'integer'})
      };
      caption = applySubstitutions(this.translationsObj.tooltipCombinedContent, repDict);

    } else {
      const repDict = {
        DATE:   reformatReadableDate(lineSeries[di].DATE),
        '7DAY_AVERAGE':formatValue(lineSeries[di].VALUE,{format:'number',min_decimals:1}),
        DEATHS:formatValue(barSeries[di].VALUE,{format:'integer'}),
      };
      caption = applySubstitutions(this.translationsObj.tooltipContent, repDict);
    }
    let datumDate = parseSnowflakeDate(lineSeries[di].DATE);
    let pendingDate = parseSnowflakeDate(this.chartData.latest[this.chartOptions.latestField].DEATH_UNCERTAINTY_PERIOD);
    if (+datumDate >= +pendingDate) {
      caption += `<br><span class="pending-caveat">${this.translationsObj.pending_caveat}</span>`;
    }
    return caption;
  }

  setupPostTranslations(regionName) {
    let latestRec = this.chartData.latest[this.chartOptions.latestField];
    let totalKey = 'common_total_' + this.chartConfigFilter + '_deaths';
    let avgKey = this.chartConfigFilter.toUpperCase() + '_DEATHS_DAILY_AVERAGE';
    let capitaKey = this.chartConfigFilter + '_deaths_per_100k_7_days';
    //let total_deaths_type = 'total ' + this.chartConfigFilter;
    let total_deaths_type = 'deaths among ' + this.chartConfigFilter + ' cases';

    /* NOTE: the chart displays "total" deaths but we use "combined" internally */
    if (this.chartConfigFilter === 'combined') {
      total_deaths_type = 'total deaths';
      totalKey = totalKey.replace('common_', '');
    }

    const repDict = {
      total_deaths:           formatValue(latestRec[totalKey],{format:'integer'}),
      avg_deaths:             formatValue(latestRec[avgKey],{format:'integer'}),
      deaths_per_100k_7_days: formatValue(latestRec[capitaKey],{format:'number',min_decimals:1}),
      new_deaths:             formatValue(latestRec.new_deaths,{format:'integer'}),
      total_deaths_type:      total_deaths_type,
      REGION:                 regionName
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
    this.translationsObj.post_chartLegend2 = applySubstitutions(this.translationsObj.chartLegend2, repDict);
    this.translationsObj.post_chartLegend3 = applySubstitutions(this.translationsObj.chartLegend3, repDict);
    this.translationsObj.currentLocation = regionName;
    return repDict;
  }

  setupRenderOptions() {
    let renderOptions = {'tooltip_func':this.tooltip,
                        'extras_func':this.renderExtras,
                        'time_series_bars':this.chartData.time_series[this.chartOptions.seriesField].VALUES,
                        'time_series_line':this.chartData.time_series[this.chartOptions.seriesFieldAvg].VALUES,
                        'root_id':this.chartOptions.rootId,
                        'left_y_axis_legend':this.translationsObj[this.chartConfigKey+'_leftYAxisLegend'],
                        'right_y_axis_legend':this.translationsObj[this.chartConfigKey+'_rightYAxisLegend'],
                        'right_y_fmt':'integer',
                        'x_axis_legend':this.translationsObj[this.chartConfigKey+'_xAxisLegend'],
                        'line_legend':this.regionName == 'California'? this.translationsObj.dayAverage : null,
                        };
    if (this.chartConfigFilter != 'reported') {
      renderOptions.pending_date = this.chartData.latest[this.chartOptions.latestField].DEATH_UNCERTAINTY_PERIOD;
      renderOptions.pending_legend = this.translationsObj.pending;
    }
    if (this.addStateLine) {
      renderOptions.time_series_state_line = this.stateData.time_series[this.chartOptions.seriesFieldAvg].VALUES;
    }
    if ('seriesSubFields' in this.chartOptions) {
      renderOptions.time_series_stacked_bars = [];
      this.chartOptions.seriesSubFields.forEach(field => {
        renderOptions.time_series_stacked_bars.push(this.chartData.time_series[field].VALUES);
      });
    }
    return renderOptions;
  }
}

window.customElements.define(
  "cagov-chart-dashboard-confirmed-deaths",
  CAGovDashboardConfirmedDeaths
);
