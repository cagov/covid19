import template from "../cagov-chart-dashboard-confirmed-cases-episode-date/template.js";
import getTranslations from "../../../common/get-strings-list.js";
import getScreenResizeCharts from "../../../common/get-window-size.js";
import rtlOverride from "../../../common/rtl-override.js";
import renderChart from "../common/histogram.js";
import { reformatReadableDate } from "../../../common/readable-date.js";
import applySubstitutions from "./../../../common/apply-substitutions.js";
import formatValue from "./../../../common/value-formatters.js";

// cagov-chart-dashboard-confirmed-cases-reported-date
class CAGovDashboardConfirmedCasesReportedDate extends window.HTMLElement {
  connectedCallback() {
    console.log("Loading CAGovDashboardConfirmedCasesReportedDate");
    this.translationsObj = getTranslations(this);
    // console.log("Translations obj",this.translationsObj);
    // Settings and initial values

    this.chartOptions = {
      chartName: 'cagov-chart-dashboard-confirmed-cases-reported-date',
      // Data
      dataUrl:
        config.chartsStateDashTablesLoc + "confirmed-cases-reported-date/california.json", // Overwritten by county.
      dataUrlCounty:
        config.chartsStateDashTablesLoc + "confirmed-cases-reported-date/<county>.json",

      desktop: {
        fontSize: 14,
        width: 400,     height: 300,
        margin: {   left: 50,   top: 30,  right: 60,  bottom: 45 },
      },
      tablet: {
        fontSize: 14,
        width: 400,     height: 300,
        margin: {   left: 50,   top: 30,  right: 60,  bottom: 45 },
      },
      mobile: {
        fontSize: 12,
        width: 400,     height: 300,
        margin: {   left: 50,   top: 30,  right: 60,  bottom: 45 },
      },
      retina: {
        fontSize: 12,
        width: 400,     height: 300,
        margin: {   left: 50,   top: 30,  right: 60,  bottom: 45 },
      },
    };

    getScreenResizeCharts(this);

    this.screenDisplayType = window.charts
      ? window.charts.displayType
      : "desktop";

    this.chartBreakpointValues = this.chartOptions[
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
    this.dataUrl = this.chartOptions.dataUrl;

    this.retrieveData(this.dataUrl);

    rtlOverride(this); // quick fix for arabic
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
    const barSeries = this.chartdata.time_series.CONFIRMED_CASES_REPORTED_DATE;
    const lineSeries = this.chartdata.time_series.AVG_CASE_RATE_PER_100K_7_DAYS;
    // console.log("getTooltipContent",di,lineSeries);
    const repDict = {
      DATE:   reformatReadableDate(lineSeries[di].DATE),
      '7DAY_AVERAGE':formatValue(lineSeries[di].VALUE,{format:'number',min_decimals:1}),
      CASES:formatValue(barSeries[di].VALUE,{format:'integer'}),
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
            total_confirmed_cases:formatValue(this.chartdata.latest.CONFIRMED_CASES_REPORTED_DATE.total_confirmed_cases,{format:'integer'}),
            new_cases:formatValue(this.chartdata.latest.CONFIRMED_CASES_REPORTED_DATE.new_cases,{format:'integer'}),
            new_cases_delta_1_day:formatValue(Math.abs(this.chartdata.latest.CONFIRMED_CASES_REPORTED_DATE.new_cases_delta_1_day),{format:'percent'}),
            cases_per_100k_7_days:formatValue(this.chartdata.latest.CONFIRMED_CASES_REPORTED_DATE.cases_per_100k_7_days,{format:'number',min_decimals:1}),
          };

          this.translationsObj.post_chartLegend1 = applySubstitutions(this.translationsObj.chartLegend1, repDict);
          this.translationsObj.post_chartLegend2 = applySubstitutions(this.chartdata.latest.CONFIRMED_CASES_REPORTED_DATE.new_cases_delta_1_day >= 0? this.translationsObj.chartLegend2Increase : this.translationsObj.chartLegend2Decrease, repDict);
          this.translationsObj.post_chartLegend3 = applySubstitutions(this.translationsObj.chartLegend3, repDict);
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

        // console.log("Testing selection",d3.select(this.chartName));

        renderChart.call(this, this.chartdata, {'tooltip_func':this.tooltip,
                                                'extras_func':this.renderExtras,
                                                'time_series_key_bars':'CONFIRMED_CASES_REPORTED_DATE',
                                                'time_series_key_line':'AVG_CASE_REPORT_RATE_PER_100K_7_DAYS',
                                                'root_id':'cases-rep',
                                                'left_y_axis_legend':'Cases per 100K',
                                                'right_y_axis_legend':'Cases',
                                                'x_axis_legend':'Reported date',
                                                'line_legend':'7-day average',
                                                'pending_date':this.chartdata.latest.CONFIRMED_CASES_REPORTED_DATE.EPISODE_UNCERTAINTY_PERIOD,
                                                'pending_legend':'Pending',
                                              });


        }.bind(this)
      );
  }
}

window.customElements.define(
  "cagov-chart-dashboard-confirmed-cases-reported-date",
  CAGovDashboardConfirmedCasesReportedDate
);
