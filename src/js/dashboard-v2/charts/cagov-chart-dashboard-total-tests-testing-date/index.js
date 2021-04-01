import template from "./template.js";
import getTranslations from "../../../common/get-strings-list.js";
import getScreenResizeCharts from "../../../common/get-window-size.js";
import rtlOverride from "../../../common/rtl-override.js";
import renderChart from "../common/histogram.js";
import { parseSnowflakeDate, reformatJSDate } from "../../../common/readable-date.js";
import applySubstitutions from "./../../../common/apply-substitutions.js";

// cagov-chart-dashboard-total-tests-testing-date
class CAGovDashboardTotalTestsTestingDate extends window.HTMLElement {
  connectedCallback() {
    console.log("Loading CAGovDashboardTotalTestsTestingDate");
    this.translationsObj = getTranslations(this);

    // Settings and initial values
    this.chartOptions = {
      chartName: 'cagov-chart-dashboard-total-tests-testing-date',
      // Data
      dataUrl:
        config.chartsStateDashTablesLoc + "total-tests-testing-date/california.json", // Overwritten by county.
      dataUrlCounty:
        config.chartsStateDashTablesLoc + "total-tests-testing-date/<county>.json",

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

    this.intFormatter = new Intl.NumberFormat(
      "us", // forcing US to avoid mixed styles on translated pages
      { style: "decimal", minimumFractionDigits: 0, maximumFractionDigits: 0 }
    );
    this.pctFormatter = new Intl.NumberFormat(
      "us", // forcing US to avoid mixed styles on translated pages
      { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 }
    );

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

  getTooltip(d,baselineData) {
    let tooltipText = this.translationsObj.tooltipLegend1 + '<br/>' +
                      this.translationsObj.tooltipLegend2 + '<br/>' +
                      this.translationsObj.tooltipLegend3;
                      
    let bd = baselineData.filter(bd => bd.CATEGORY == d.CATEGORY);
    // !! replacements here for category, metric-value, metric-baseline-value
    // tooltipText = tooltipText.replace('{category}', `<span class='highlight-data'>${d.CATEGORY}</span>`);
    // tooltipText = tooltipText.replace('{metric-value}', `<span class='highlight-data'>${this.pctFormatter.format(d.METRIC_VALUE)}</span>`);
    // tooltipText = tooltipText.replace('{metric-baseline-value}', `<span class='highlight-data'>${this.pctFormatter.format(bd[0].METRIC_VALUE)}</span>`);
    return `<div class="chart-tooltip"><div>${tooltipText}</div></div>`;
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

  retrieveData(url) {
    window
      .fetch(url)
      .then((response) => response.json())
      .then(
        function (alldata) {
          // console.log("Race/Eth data data", alldata.data);
          this.metadata = alldata.meta;
          this.chartdata = alldata.data;

          const repDict = {
            total_tests_performed:this.intFormatter.format(this.chartdata.latest.TOTAL_TESTS_TESTING_DATE.total_tests_performed),
            new_tests_reported:this.intFormatter.format(Math.abs(this.chartdata.latest.TOTAL_TESTS_TESTING_DATE.new_tests_reported)),
            new_tests_reported_delta_1_day:this.pctFormatter.format(Math.abs(this.chartdata.latest.TOTAL_TESTS_TESTING_DATE.new_tests_reported_delta_1_day)),
          };

          this.translationsObj.post_chartLegend1 = applySubstitutions(this.translationsObj.chartLegend1, repDict);
          this.translationsObj.post_chartLegend2 = applySubstitutions(this.chartdata.latest.TOTAL_TESTS_TESTING_DATE.new_tests_reported_delta_1_day >= 0? this.translationsObj.chartLegend2Increase : this.translationsObj.chartLegend2Decrease, repDict);

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
            .select(this.chartName)
            .append("div")
            .attr("class", "tooltip-container")
            .text("Empty Tooltip");
            



        renderChart.call(this, this.chartdata, {'tooltip_func':this.tooltip,
                                                'extras_func':this.renderExtras,
                                                'time_series_key_bars':'TOTAL_TESTS',
                                                'time_series_key_line':'AVG_TEST_RATE_PER_100K_7_DAYS',
                                                'line_date_offset':0,
                                                'left_y_div':200,
                                                'right_y_div':100000,
                                                'root_id':'tests-t',
                                                'left_y_axis_legend':'Tests per 100K',
                                                'right_y_axis_legend':'Tests',
                                                'x_axis_legend':'Testing date',
                                                'line_legend':'7-day average',
                                                'pending_date':this.chartdata.latest.TOTAL_TESTS_TESTING_DATE.TESTING_UNCERTAINTY_PERIOD,
                                                'pending_legend':'Pending',
                                              });
        }.bind(this)
      );
  }
}

window.customElements.define(
  "cagov-chart-dashboard-total-tests-testing-date",
  CAGovDashboardTotalTestsTestingDate
);
