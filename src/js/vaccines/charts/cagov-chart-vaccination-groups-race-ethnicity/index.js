import template from "./template.js";
import getTranslations from "./../../../common/get-strings-list.js";
import getScreenResizeCharts from "./../../../common/get-window-size.js";
import rtlOverride from "./../../../common/rtl-override.js";
import renderChart from "../../../common/charts/simple-barchart.js";
import applySubstitutions from "./../../../common/apply-substitutions.js";
import { parseSnowflakeDate, reformatJSDate } from "./../../../common/readable-date.js";
import formatValue from "./../../../common/value-formatters.js";

class CAGovVaccinationGroupsRaceEthnicity extends window.HTMLElement {
  connectedCallback() {
    console.log("Loading CAGovVaccinationGroupsRaceEthnicity");
    this.translationsObj = getTranslations(this);
    this.innerHTML = template(this.translationsObj);
    // Settings and initial values
    this.nbr_bars = 10;
    this.bar_vspace = 60;

    this.chartOptions = {
      // Data
      dataUrl:
        config.equityChartsVEDataLoc +
        "race-ethnicity/vaccines_by_race_ethnicity_california.json",
      dataUrlCounty:
        config.equityChartsVEDataLoc +
        "race-ethnicity/vaccines_by_race_ethnicity_<county>.json",
      state: "California",
      // Breakpoints
      desktop: {
        fontSize: 14,
        height: 60 + this.nbr_bars * this.bar_vspace,
        width: 555,
        margin: {
          top: 60,
          right: 80,
          bottom: 20, // 20 added for divider
          left: 4,
        },
      },
      tablet: {
        fontSize: 14,
        height: 60 + this.nbr_bars * this.bar_vspace,
        width: 555,
        margin: {
          top: 60,
          right: 80,
          bottom: 20, // 20 added for divider
          left: 4,
        },
      },
      mobile: {
        fontSize: 12,
        height: 60 + this.nbr_bars * (this.bar_vspace - 2),
        width: 440,
        margin: {
          top: 60,
          right: 80,
          bottom: 20,
          left: 4,
        },
      },
      retina: {
        fontSize: 12,
        height: 60 + this.nbr_bars * (this.bar_vspace - 2),
        width: 320,
        margin: {
          top: 60,
          right: 80,
          bottom: 20,
          left: 4,
        },
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
      .select("cagov-chart-vaccination-groups-race-ethnicity")
      .append("div")
      .attr("class", "tooltip-container")
      .text("Empty Tooltip");


    // Set default values for data and labels
    this.dataUrl = this.chartOptions.dataUrl;

    this.retrieveData(this.dataUrl, "California");
    this.listenForLocations();

    // this.listenForLocations();
    // this.classList.remove("d-none"); // this works
    // if (this.querySelector('.d-none') !== null) { // this didn't seem to be working...
    //   this.querySelector('.d-none').classList.remove("d-none");
    // }

    rtlOverride(this); // quick fix for arabic
  }

  getLegendText() {
    return [this.translationsObj.legendLabelVaccines, this.translationsObj.legendLabelPopulation];
  }

  getChartTitle({
    region = "California",
    chartTitle = "People with at least one dose of vaccine administered by race and ethnicity in California",
    chartTitleCounty = "People with at least one dose of vaccine administered by race and ethnicity in [REGION]",
  }) {

    let isCounty = region === "California" ? false : true;

    let replacedChartTitle = isCounty === false ? chartTitle : chartTitleCounty.replace("[REGION]", region + " County");

    this.translationsObj.chartDisplayTitle = replacedChartTitle;

    return replacedChartTitle;
  }

  resetTitle({
    region = "California",
    chartTitle = "People with at least one dose of vaccine administered by race and ethnicity in California",
    chartTitleCounty = "People with at least one dose of vaccine administered by race and ethnicity in [REGION]",
  }) {

    this.translationsObj.chartDisplayTitle = this.getChartTitle({
      region,
      chartTitle: this.translationsObj.chartTitle,
      chartTitleCounty: this.translationsObj.chartTitleCounty,
    });

    this.querySelector(".chart-title").innerHTML = this.translationsObj.chartDisplayTitle;
  }

  ariaLabel(d) {
    let label = "ARIA BAR LABEL";
    return label;
  }

  getTooltip(d,baselineData) {
    let tooltipText = this.translationsObj.chartBarCaption;
    if (d.CATEGORY == "Other") {
      tooltipText = this.translationsObj.chartBarCaptionOther;
    } else if (d.CATEGORY == "Unknown") {
      tooltipText = this.translationsObj.chartBarCaptionUnknown;
    }
    let bd = baselineData.filter(bd => bd.CATEGORY == d.CATEGORY);
    // !! replacements here for category, metric-value, metric-baseline-value
    tooltipText = tooltipText.replace('{category}', `<span class='highlight-data'>${d.CATEGORY}</span>`);
    tooltipText = tooltipText.replace('{metric-value}', `<span class='highlight-data'>${formatValue(d.METRIC_VALUE,{format:'percent'})}</span>`);
    tooltipText = tooltipText.replace('{metric-baseline-value}', `<span class='highlight-data'>${formatValue(bd[0].METRIC_VALUE,{format:'percent'})}</span>`);
    return tooltipText;
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

  listenForLocations() {
    let searchElement = document.querySelector("cagov-county-search");
    searchElement.addEventListener(
      "county-selected",
      function (e) {
        console.log("Region selected", e.detail.filterKey);
        this.county = e.detail.county;
        let searchURL = this.chartOptions.dataUrlCounty.replace(
          "<county>",
          this.county.toLowerCase().replace(/ /g, "")
        );
        this.retrieveData(searchURL, e.detail.county);
      }.bind(this),
      false
    );
  }

  retrieveData(url, regionName) {
    window
      .fetch(url)
      .then((response) => response.json())
      .then(
        function (alldata) {
          // console.log("Race/Eth data meta", alldata.meta);
          // console.log("Race/Eth data data", alldata.data);
          this.metadata = alldata.meta;
          this.alldata = alldata.data;
          this.popdata = null;
          if ('POP_METRIC_VALUE' in this.alldata[0]) {
            console.log("Pop data found for eth chart");
            this.popdata = this.alldata.map(row => {
              return {CATEGORY: row.CATEGORY, METRIC_VALUE: (row.CATEGORY == "Other" || row.CATEGORY == "Unknown"? -1 : row.POP_METRIC_VALUE)};
            });
          }

          let publishedDate = parseSnowflakeDate(this.metadata['PUBLISHED_DATE']);
          let collectedDate = parseSnowflakeDate(this.metadata['LATEST_ADMIN_DATE']);
          if (publishedDate.getTime() == collectedDate.getTime()) {
            collectedDate.setDate(collectedDate.getDate() - 1);            
          }
          let footerReplacementDict = {
            'PUBLISHED_DATE' : reformatJSDate( publishedDate ),
            'LATEST_ADMINISTERED_DATE' : reformatJSDate( collectedDate ),
          };

          let footerDisplayText = applySubstitutions(this.translationsObj.chartDataLabel, footerReplacementDict);
          d3.select(this.querySelector(".chart-data-label")).text(footerDisplayText);

          renderChart.call(this, this.renderExtras, this.popdata, this.tooltip, 've-race-eth');
          this.resetTitle({
            region: regionName, 
            chartTitle: this.translationsObj.chartTitle,
            chartTitleCounty: this.translationsObj.chartCounty,
          });
        }.bind(this)
      );
  }
}

window.customElements.define(
  "cagov-chart-vaccination-groups-race-ethnicity",
  CAGovVaccinationGroupsRaceEthnicity
);
