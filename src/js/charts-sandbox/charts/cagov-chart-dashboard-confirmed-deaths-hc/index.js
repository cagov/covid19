import template from "./../common/histogram-template.js";
import getTranslations from "../../../common/get-strings-list.js";
import getScreenResizeCharts from "../../../common/get-window-size.js";
import rtlOverride from "../../../common/rtl-override.js";
import chartConfig from '../common/line-chart-config.json';
import renderChart from "../common/histogram.js";
import { reformatReadableDate,parseSnowflakeDate } from "../../../common/readable-date.js";
import applySubstitutions from "./../../../common/apply-substitutions.js";
import formatValue from "./../../../common/value-formatters.js";
// import { false } from "tap";

// cagov-chart-dashboard-confirmed-deaths
class CAGovDashboardConfirmedDeathsHC extends window.HTMLElement {
  connectedCallback() {
    console.log("Loading CAGovDashboardConfirmedDeathsHC");
    this.translationsObj = getTranslations(this);
    this.chartConfigFilter = this.dataset.chartConfigFilter;
    this.chartConfigKey = this.dataset.chartConfigKey;
    // console.log("!!?",this.chartConfigFilter, this.chartConfigKey);
    // Settings and initial values
    this.chartOptions = chartConfig[this.chartConfigKey][this.chartConfigFilter];

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
    return applySubstitutions(this.translationsObj.tooltipContent, repDict);
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

    const repDict = {
      total_confirmed_deaths:formatValue(latestRec.total_confirmed_deaths,{format:'integer'}),
      new_deaths:formatValue(latestRec.new_deaths,{format:'integer'}),
      new_deaths_delta_1_day:formatValue(Math.abs(latestRec.new_deaths_delta_1_day),{format:'percent'}),
      deaths_per_100k_7_days:formatValue(latestRec.deaths_per_100k_7_days,{format:'number',min_decimals:1}),
    };

    this.translationsObj.post_chartTitle = applySubstitutions(this.translationsObj.chartTitle, repDict);
    this.translationsObj.post_chartLegend1 = applySubstitutions(this.translationsObj.chartLegend1, repDict);
    this.translationsObj.post_chartLegend2 = applySubstitutions(latestRec.new_deaths_delta_1_day >= 0? this.translationsObj.chartLegend2Increase : this.translationsObj.chartLegend2Decrease, repDict);
    this.translationsObj.post_chartLegend3 = applySubstitutions(this.translationsObj.chartLegend3, repDict);
    this.translationsObj.currentLocation = regionName;

    // console.log("Translations obj",this.translationsObj);
    let chartID = this.chartOptions.chartName;
    this.translationsObj.chartID = chartID;
    this.innerHTML = template(this.translationsObj);

    // let renderOptions = {'tooltip_func':this.tooltip,
    //                     'extras_func':this.renderExtras,
    //                     'time_series_bars':this.chartdata.time_series[this.chartOptions.seriesField].VALUES,
    //                     'time_series_line':this.chartdata.time_series[this.chartOptions.seriesFieldAvg].VALUES,
    //                     'root_id':this.chartOptions.rootId,
    //                     'left_y_axis_legend':this.translationsObj[this.chartConfigKey+'_leftYAxisLegend'],
    //                     'right_y_axis_legend':this.translationsObj[this.chartConfigKey+'_rightYAxisLegend'],
    //                     'right_y_fmt':'integer',
    //                     'x_axis_legend':this.translationsObj[this.chartConfigKey+'_'+this.chartConfigFilter+'_xAxisLegend'],
    //                     'line_legend':this.translationsObj.dayAverage,
    //                     'pending_date':this.chartdata.latest[this.chartOptions.latestField].DEATH_UNCERTAINTY_PERIOD,
    //                     'pending_legend':this.translationsObj.pending,
    //                     };
    // if (addStateLine) {
    //   renderOptions.time_series_state_line = this.statedata.time_series[this.chartOptions.seriesFieldAvg].VALUES;
    // }
    // renderChart.call(this, renderOptions);

    let series1Data = this.chartdata.time_series[this.chartOptions.seriesFieldAvg].VALUES.map(d => ({'x':parseSnowflakeDate(d.DATE),'y':d.VALUE}));
    let series2Data = this.chartdata.time_series[this.chartOptions.seriesField].VALUES.map(d => ({'x':parseSnowflakeDate(d.DATE),'y':d.VALUE}));

    // HighCharts
    const chart = Highcharts.chart(chartID, {
        chart: {
          height:312,
          width:400,
        },
        title: {
            text: 'Deaths',
            style:{color:'#FFFFFF'},
          },
        xAxis: {
          type:'datetime',
        },
        yAxis: [{
              title: {
                  text: 'Deaths per 100k',
                  align:'high',
                  rotation:0,
                  offset:-100,
                  y:-12,
                  style:{color:'black','font-weight':700,'font-size':'0.95rem'},
                }
              },
              {
                tickColor:'#608cbd',
                color:'#608cbd',
                title: {
                    text: 'Deaths',
                    align:'high',
                    rotation:0,
                    offset:0,
                    y:-12,
                    style:{color:'#608cbd','font-weight':700,'font-size':'0.95rem'},
                  },
                 opposite:true,
                }],
       series: [
          {
              yAxis: 1,
              color:'#deeaf6',
              type: 'column',
              name: 'deaths',
              data: series2Data.reverse(),
          },
          {
            yAxis: 0,
            color:'#000000',
            type: 'line',
            name: '100k',
            data: series1Data.reverse(),
        }],
        //   credits: {
        //     enabled: false
        //  },    
        legend: {
          enabled: false
      },    
    });    
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
          this.renderComponent(regionName);
        }.bind(this)
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

    let tabFilterHandler = function(e) {
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
    };

    let myFilter = document.querySelector("cagov-chart-filter-buttons.js-filter-deaths");
    myFilter.addEventListener(
      "filter-selected",
      tabFilterHandler.bind(this),
      false
    );
    let myFilter2 = document.querySelector("cagov-chart-filter-buttons.js-filter-cases");
    myFilter2.addEventListener(
      "filter-selected",
      tabFilterHandler.bind(this),
      false
    );
  }
}

window.customElements.define(
  "cagov-chart-dashboard-confirmed-deaths-hc",
  CAGovDashboardConfirmedDeathsHC
);
