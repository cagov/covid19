import template from "./template.js";
import getTranslations from "../../../common/get-strings-list.js";
import getScreenResizeCharts from "../../../common/get-window-size.js";
import rtlOverride from "../../../common/rtl-override.js";
import renderChart from "../../../common/charts/simple-barchart.js";

// cagov-chart-dashboard-groups-age-deaths

class CAGovDashboardGroupsAgeDeaths extends window.HTMLElement {
  connectedCallback() {
    console.log("Loading CAGovDashboardGroupsAgeDeaths");
    this.translationsObj = getTranslations(this);
    this.innerHTML = template(this.translationsObj);
    // Settings and initial values
    this.nbr_bars = 8;
    this.bar_vspace = 60;

    this.chartOptions = {
      // Data
      dataUrl: config.chartsDataFile,
      desktop: {
        fontSize: 14,
        height: 60 + this.nbr_bars * this.bar_vspace,
        width: 400,
        margin: {
          top: 60,
          right: 80,
          bottom: 0, // 20 added for divider
          left: 0,
        },
      },
      tablet: {
        fontSize: 14,
        height: 60 + this.nbr_bars * this.bar_vspace,
        width: 350,
        margin: {
          top: 60,
          right: 80,
          bottom: 0, // 20 added for divider
          left: 0,
        },
      },
      mobile: {
        fontSize: 12,
        height: 60 + this.nbr_bars * (this.bar_vspace - 2),
        width: 440,
        margin: {
          top: 60,
          right: 80,
          bottom: 0,
          left: 0,
        },
      },
      retina: {
        fontSize: 12,
        height: 60 + this.nbr_bars * (this.bar_vspace - 2),
        width: 320,
        margin: {
          top: 60,
          right: 80,
          bottom: 0,
          left: 0,
        },
      },
    };

    this.intFormatter = new Intl.NumberFormat(
      "us", // forcing US to avoid mixed styles on translated pages
      { style: "decimal", minimumFractionDigits: 0, maximumFractionDigits: 0 }
    );
    this.pctFormatter = new Intl.NumberFormat(
      "us", // forcing US to avoid mixed styles on translated pages
      { style: "percent", minimumFractionDigits: 0, maximumFractionDigits: 1 }
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
      .select("cagov-chart-dashboard-groups-age-deaths")
      .append("div")
      .attr("class", "tooltip-container")
      .text("Empty Tooltip");


    // Set default values for data and labels
    this.dataUrl = this.chartOptions.dataUrl;

    this.retrieveData(this.dataUrl);

    rtlOverride(this); // quick fix for arabic
  }

  getTooltip(d,baselineData) {
    let tooltipText = this.translationsObj.chartBarCaption;
    let bd = baselineData.filter(bd => bd.CATEGORY == d.CATEGORY);
    // !! replacements here for category, metric-value, metric-baseline-value
    tooltipText = tooltipText.replace('{category}', `<span class='highlight-data'>${d.CATEGORY}</span>`);
    tooltipText = tooltipText.replace('{metric-value}', `<span class='highlight-data'>${this.pctFormatter.format(d.METRIC_VALUE)}</span>`);
    tooltipText = tooltipText.replace('{metric-baseline-value}', `<span class='highlight-data'>${this.pctFormatter.format(bd[0].METRIC_VALUE)}</span>`);
    return `<div class="chart-tooltip"><div>${tooltipText}</div></div>`;
  }

  ariaLabel(d, baselineData) {
    let caption = this.translationsObj.chartBarCaption;
    let bd = baselineData.filter(bd => bd.CATEGORY == d.CATEGORY);
    caption = caption.replace('{category}', d.CATEGORY);
    caption = caption.replace('{metric-value}', this.pctFormatter.format(d.METRIC_VALUE));
    caption = caption.replace('{metric-baseline-value}', this.pctFormatter.format(bd[0].METRIC_VALUE));
    // console.log("Aria Label",caption);
    return caption;
  }

  getLegendText() {
    return [
      this.translationsObj.chartLegend1,
      this.translationsObj.chartLegend2,
    ];
  }

  renderExtras(svg, data, x, y) {
    // Not using this separator line that divides groups from unknown information
    // let group = svg.append("g");
    // group
    //   .append("rect")
    //   .attr("fill", "#000000")
    //   .attr("class", "divider")
    //   .attr("y", y(6) + (this.bar_vspace * 7) / 12)
    //   .attr("x", 0)
    //   .attr("width", this.dimensions.width)
    //   .attr("height", 0.75);
  }

  retrieveData(url) {
    window
      .fetch(url)
      .then((response) => response.json())
      .then(
        function (alldata) {
          // console.log("Race/Eth data data", alldata.data);
          this.alldata = alldata.data.by_age.deaths;
          this.popdata = alldata.data.by_age.population;
          this.alldata.forEach(rec => {
            rec.METRIC_VALUE /= 100.0;
          });
          this.popdata.forEach(rec => {
            rec.METRIC_VALUE /= 100.0;
          });

          // "Unknown"
          // let croppedData = alldata.data.filter(function(a){return a.CATEGORY !== 'Unknown'});
          // this.alldata = croppedData;

          renderChart.call(this, this.renderExtras, this.popdata, this.tooltip, 'g-age-deaths');
          // this.resetTitle({
          //   region: regionName, 
          //   chartTitle: this.translationsObj.chartTitle,
          //   chartTitleCounty: this.translationsObj.chartCounty,
          // });
        }.bind(this)
      );
  }
}

window.customElements.define(
  "cagov-chart-dashboard-groups-age-deaths",
  CAGovDashboardGroupsAgeDeaths
);
