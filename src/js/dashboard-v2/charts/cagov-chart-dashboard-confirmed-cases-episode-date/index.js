import template from "./template.js";
import getTranslations from "../../../common/get-strings-list.js";
import getScreenResizeCharts from "../../../common/get-window-size.js";
import rtlOverride from "../../../common/rtl-override.js";
import renderChart from "../common/histogram.js";
import { parseSnowflakeDate, reformatJSDate } from "../../../common/readable-date.js";
import applySubstitutions from "./../../../common/apply-substitutions.js";

// cagov-chart-dashboard-confirmed-cases-episode-date
class CAGovDashboardConfirmedCasesEpisodeDate extends window.HTMLElement {
  connectedCallback() {
    console.log("Loading CAGovDashboardConfirmedCasesEpisodeDate");
    this.translationsObj = getTranslations(this);
    // console.log("Translations obj",this.translationsObj);
    this.innerHTML = template(this.translationsObj);
    // Settings and initial values

    this.chartOptions = {
      chartName: 'cagov-chart-dashboard-confirmed-cases-episode-date',
      // Data
      dataUrl:
        config.chartsStateDashTablesLoc + "confirmed-cases-episode-date/california.json", // Overwritten by county.
      dataUrlCounty:
        config.chartsStateDashTablesLoc + "confirmed-cases-episode-date/<county>.json",

      desktop: {
        fontSize: 14,
        width: 400,
        height: 300,
        margin: {
          left: 50,
          top: 60,
          right: 0,
          bottom: 20, // 20 added for divider
        },
      },
      tablet: {
        fontSize: 14,
        width: 400,
        height: 300,
        margin: {
          left: 50,
          top: 60,
          right: 0,
          bottom: 20, // 20 added for divider
        },
      },
      mobile: {
        fontSize: 12,
        width: 400,
        height: 300,
        margin: {
          left: 50,
          top: 60,
          right: 0,
          bottom: 20,
        },
      },
      retina: {
        fontSize: 12,
        width: 400,
        height: 300,
        margin: {
          left: 50,
          top: 60,
          right: 0,
          bottom: 20,
        },
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

        //   this.alldata.forEach(rec => {
        //     rec.METRIC_VALUE /= 100.0;
        //   });
        //   this.popdata.forEach(rec => {
        //     rec.METRIC_VALUE /= 100.0;
        //   });

        //   let publishedDateStr = this.metadata['PUBLISHED_DATE'];
        //   let publishedDate = parseSnowflakeDate(publishedDateStr);
        //   let collectedDate = parseSnowflakeDate(publishedDateStr);
        //   collectedDate.setDate(collectedDate.getDate() - 1);

        //   let footerReplacementDict = {
        //     'PUBLISHED_DATE' : reformatJSDate(publishedDate),
        //     'MINUS_ONE_DATE' : reformatJSDate(collectedDate),
        //   };
        //   let footerDisplayText = applySubstitutions(this.translationsObj.footerText, footerReplacementDict);
        //   d3.select(document.querySelector("#ageGroupChartContainer .chart-footer-caption")).text(footerDisplayText);


        renderChart.call(this, this.chartdata, {'tooltip_func':this.tooltip,
                                                'extras_func':this.renderExtras,
                                                'time_series_key_bars':'CONFIRMED_CASES_EPISODE_DATE',
                                                'time_series_key_line':'AVG_CASE_RATE_PER_100K_7_DAYS',
                                              });
        }.bind(this)
      );
  }
}

window.customElements.define(
  "cagov-chart-dashboard-confirmed-cases-episode-date",
  CAGovDashboardConfirmedCasesEpisodeDate
);
