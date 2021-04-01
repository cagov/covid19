import template from "./template.js";
import getTranslations from "../../../common/get-strings-list.js";
import getScreenResizeCharts from "../../../common/get-window-size.js";
import rtlOverride from "../../../common/rtl-override.js";
import renderChart from "../common/histogram.js";
import { parseSnowflakeDate, reformatJSDate } from "../../../common/readable-date.js";
import applySubstitutions from "./../../../common/apply-substitutions.js";

// cagov-chart-dashboard-confirmed-deaths-death-date
class CAGovDashboardConfirmedDeathsDeathDate extends window.HTMLElement {
  connectedCallback() {
    console.log("Loading CAGovDashboardConfirmedDeathsDeathDate");
    this.translationsObj = getTranslations(this);

    // Settings and initial values
    this.chartOptions = {
      chartName: 'cagov-chart-dashboard-confirmed-deaths-death-date',
      // Data
      dataUrl:
        config.chartsStateDashTablesLoc + "confirmed-deaths-death-date/california.json", // Overwritten by county.
      dataUrlCounty:
        config.chartsStateDashTablesLoc + "confirmed-deaths-death-date/<county>.json",

      desktop: {
        fontSize: 14,
        width: 400,        height: 300,
        margin: { left: 50, top: 30,  right: 60,  bottom: 45  },
      },
      tablet: {
        fontSize: 14,
        width: 400,        height: 300,
        margin: { left: 50, top: 30,  right: 60,  bottom: 45  },
      },
      mobile: {
        fontSize: 12,
        width: 400,        height: 300,
        margin: { left: 50, top: 30,  right: 60,  bottom: 45  },
      },
      retina: {
        fontSize: 12,
        width: 400,        height: 300,
        margin: { left: 50, top: 30,  right: 60,  bottom: 45  },
      },
    };

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
            total_confirmed_deaths:this.intFormatter.format(this.chartdata.latest.CONFIRMED_DEATHS_DEATH_DATE.total_confirmed_deaths),
            new_deaths:this.intFormatter.format(this.chartdata.latest.CONFIRMED_DEATHS_DEATH_DATE.new_deaths),
            new_deaths_delta_1_day:this.pctFormatter.format(Math.abs(this.chartdata.latest.CONFIRMED_DEATHS_DEATH_DATE.new_deaths_delta_1_day)),
            deaths_per_100k_7_days:this.float2Formatter.format(this.chartdata.latest.CONFIRMED_DEATHS_DEATH_DATE.deaths_per_100k_7_days),
          };

          this.translationsObj.post_chartLegend1 = applySubstitutions(this.translationsObj.chartLegend1, repDict);
          this.translationsObj.post_chartLegend2 = applySubstitutions(this.chartdata.latest.CONFIRMED_DEATHS_DEATH_DATE.new_deaths_delta_1_day >= 0? this.translationsObj.chartLegend2Increase : this.translationsObj.chartLegend2Decrease, repDict);
          this.translationsObj.post_chartLegend3 = applySubstitutions(this.translationsObj.chartLegend3, repDict);

          // console.log("Translations obj",this.translationsObj);
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
                                                'time_series_key_bars':'CONFIRMED_DEATHS_DEATH_DATE',
                                                'time_series_key_line':'AVG_DEATH_RATE_PER_100K_7_DAYS',
                                                'left_y_div':0.5,
                                                'right_y_div':200,
                                                'root_id':'death-date',
                                                'left_y_axis_legend':'Deaths per 100K',
                                                'right_y_axis_legend':'Deaths',
                                                'x_axis_legend':'Death date',
                                                'line_legend':'7-day average',
                                                'pending_date':this.chartdata.latest.CONFIRMED_DEATHS_DEATH_DATE.DEATH_UNCERTAINTY_PERIOD,
                                                'pending_legend':'Pending',
                                              });
        }.bind(this)
      );
  }
}

window.customElements.define(
  "cagov-chart-dashboard-confirmed-deaths-death-date",
  CAGovDashboardConfirmedDeathsDeathDate
);
