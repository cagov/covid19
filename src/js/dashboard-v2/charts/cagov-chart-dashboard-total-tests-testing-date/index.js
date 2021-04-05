import template from "../cagov-chart-dashboard-icu-beds/template.js";
import chartConfig from '../cagov-chart-dashboard-confirmed-cases-episode-date/line-chart-config.json';
import getTranslations from "../../../common/get-strings-list.js";
import getScreenResizeCharts from "../../../common/get-window-size.js";
import rtlOverride from "../../../common/rtl-override.js";
import renderChart from "../common/histogram.js";
import { reformatReadableDate } from "../../../common/readable-date.js";
import applySubstitutions from "./../../../common/apply-substitutions.js";

// cagov-chart-dashboard-total-tests-testing-date
class CAGovDashboardTotalTestsTestingDate extends window.HTMLElement {
  connectedCallback() {
    console.log("Loading CAGovDashboardTotalTestsTestingDate");
    this.translationsObj = getTranslations(this);
    this.chartConfigFilter = this.dataset.chartConfigFilter;
    this.chartConfigKey = this.dataset.chartConfigKey;

    this.chartOptions = chartConfig[this.chartConfigKey][this.chartConfigFilter];

    this.intFormatter = new Intl.NumberFormat(
      "us", // forcing US to avoid mixed styles on translated pages
      { style: "decimal", minimumFractionDigits: 0, maximumFractionDigits: 0 }
    );
    this.float1Formatter = new Intl.NumberFormat(
      "us", // forcing US to avoid mixed styles on translated pages
      { style: "decimal", minimumFractionDigits: 1, maximumFractionDigits: 1 }
    );
    this.float2Formatter = new Intl.NumberFormat(
      "us", // forcing US to avoid mixed styles on translated pages
      { style: "decimal", minimumFractionDigits: 2, maximumFractionDigits: 2 }
    );
    this.pctFormatter = new Intl.NumberFormat(
      "us", // forcing US to avoid mixed styles on translated pages
      { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 }
    );

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
      this.chartBreakpointValues = this.chartOptions[
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
    const barSeries = this.chartdata.time_series[this.chartOptions.seriesField];
    const lineSeries = this.chartdata.time_series[this.chartOptions.seriesFieldAvg];
    // console.log("getTooltipContent",di,lineSeries);
    const repDict = {
      DATE:   reformatReadableDate(lineSeries[di].DATE),
      '7DAY_AVERAGE':this.float1Formatter.format(lineSeries[di].VALUE),
      TOTAL_TESTS:this.intFormatter.format(barSeries[di].VALUE),
    };
    return applySubstitutions(this.translationsObj.tooltipContent, repDict);
  }

  retrieveData(url, regionName) {
    window
      .fetch(url)
      .then((response) => response.json())
      .then(
        function (alldata) {
          // console.log("Race/Eth data data", alldata.data);
          this.metadata = alldata.meta;
          this.chartdata = alldata.data;

          const repDict = {
            total_tests_performed:this.intFormatter.format(this.chartdata.latest[this.chartOptions.seriesField].total_tests_performed),
            new_tests_reported:this.intFormatter.format(Math.abs(this.chartdata.latest[this.chartOptions.seriesField].new_tests_reported)),
            new_tests_reported_delta_1_day:this.pctFormatter.format(Math.abs(this.chartdata.latest[this.chartOptions.seriesField].new_tests_reported_delta_1_day)),
          };

          this.translationsObj.post_chartLegend1 = applySubstitutions(this.translationsObj.chartLegend1, repDict);
          this.translationsObj.post_chartLegend2 = applySubstitutions(this.chartdata.latest[this.chartOptions.seriesField].new_tests_reported_delta_1_day >= 0? this.translationsObj.chartLegend2Increase : this.translationsObj.chartLegend2Decrease, repDict);
          this.translationsObj.currentLocation = regionName;

          this.innerHTML = template(this.translationsObj);
          this.svg = d3
            .select(this.querySelector(".svg-holder"))
            .append("svg")
            .attr("viewBox", [
              0,
              0,
              this.chartBreakpointValues.width,
              this.chartBreakpointValues.height,
            ])
            .append("g")
            .attr("transform", "translate(0,0)");
      
          this.tooltip = d3
            .select(this.chartOptions.chartName)
            .append("div")
            .attr("class", "tooltip-container")
            .text("Empty Tooltip");
            



        renderChart.call(this, this.chartdata, {'tooltip_func':this.tooltip,
                                                'extras_func':this.renderExtras,
                                                'time_series_key_bars':this.chartOptions.barsField,
                                                'time_series_key_line':this.chartOptions.seriesFieldAvg,
                                                'line_date_offset':0,
                                                'root_id':this.chartOptions.rootId,
                                                'left_y_axis_legend':this.translationsObj[this.chartConfigKey+'_leftYAxisLegend'],
                                                'right_y_axis_legend':this.translationsObj[this.chartConfigKey+'_rightYAxisLegend'],
                                                'x_axis_legend':this.translationsObj[this.chartConfigKey+'_'+this.chartConfigFilter+'_xAxisLegend'],
                                                'line_legend':this.translationsObj.dayAverage,
                                                'pending_date':this.chartdata.latest[this.chartOptions.seriesField].EPISODE_UNCERTAINTY_PERIOD,
                                                'pending_date':this.chartdata.latest[this.chartOptions.seriesField].TESTING_UNCERTAINTY_PERIOD,
                                                'pending_legend':this.translationsObj.pending
                                              });
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
          this.county.toLowerCase().replace(/ /g, "")
        );
        this.retrieveData(searchURL, e.detail.county);
      }.bind(this),
      false
    );
    let myFilter = document.querySelector("cagov-chart-filter-buttons.js-filter-tests");
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
            this.county.toLowerCase().replace(/ /g, "")
          );
        }
        this.retrieveData(searchURL, e.detail.county);
      }.bind(this),
      false
    );
  }
}

window.customElements.define(
  "cagov-chart-dashboard-total-tests-testing-date",
  CAGovDashboardTotalTestsTestingDate
);
