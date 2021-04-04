import template from "./template.js";
import getTranslations from "../../../common/get-strings-list.js";
import getScreenResizeCharts from "../../../common/get-window-size.js";
import rtlOverride from "../../../common/rtl-override.js";
import renderChart from "../common/histogram.js";
import { reformatReadableDate } from "../../../common/readable-date.js";
import applySubstitutions from "./../../../common/apply-substitutions.js";

// cagov-chart-dashboard-hospitalized-patients
class CAGovDashboardHospitalizedPatients extends window.HTMLElement {
  connectedCallback() {
    console.log("Loading CAGovDashboardHospitalizedPatients");
    this.translationsObj = getTranslations(this);

    // Settings and initial values
    this.chartOptions = {
      chartName: 'cagov-chart-dashboard-hospitalized-patients',
      // Data
      dataUrl:
        config.chartsStateDashTablesLoc + "hospitalized-patients/california.json", // Overwritten by county.
      dataUrlCounty:
        config.chartsStateDashTablesLoc + "hospitalized-patients/<county>.json",

      desktop: {
        fontSize: 14,
        width: 420, height: 300,
        margin: { left: 50, top: 30,  right: 20, bottom: 45  },
      },
      tablet: {
        fontSize: 14,
        width: 420, height: 300,
        margin: { left: 50, top: 30,  right: 20, bottom: 45  },
      },
      mobile: {
        fontSize: 12,
        width: 420, height: 300,
        margin: { left: 50, top: 30,  right: 20, bottom: 45  },
      },
      retina: {
        fontSize: 12,
        width: 420, height: 300,
        margin: { left: 50, top: 30,  right: 20, bottom: 45  },
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
    const barSeries = this.chartdata.time_series.HOSPITALIZED_PATIENTS;
    const lineSeries = this.chartdata.time_series.HOSPITALIZED_PATIENTS_14_DAY_AVG;
    // console.log("getTooltipContent",di,lineSeries);
    const repDict = {
      DATE:   reformatReadableDate(barSeries[di].DATE),
      '14DAY_AVERAGE':this.float1Formatter.format(lineSeries[di].VALUE),
      TOTAL_HOSPITALIZED:this.intFormatter.format(barSeries[di].VALUE),
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
            TOTAL:this.intFormatter.format(this.chartdata.latest.HOSPITALIZED_PATIENTS.TOTAL),
            CHANGE:this.intFormatter.format(Math.abs(this.chartdata.latest.HOSPITALIZED_PATIENTS.CHANGE)),
            CHANGE_FACTOR:this.pctFormatter.format(Math.abs(this.chartdata.latest.HOSPITALIZED_PATIENTS.CHANGE_FACTOR)),
          };

          this.translationsObj.post_chartLegend1 = applySubstitutions(this.translationsObj.chartLegend1, repDict);
          this.translationsObj.post_chartLegend2 = applySubstitutions(this.chartdata.latest.HOSPITALIZED_PATIENTS.CHANGE_FACTOR >= 0? this.translationsObj.chartLegend2Increase : this.translationsObj.chartLegend2Decrease, repDict);
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
                                                'time_series_key_bars':'HOSPITALIZED_PATIENTS',
                                                'time_series_key_line':'HOSPITALIZED_PATIENTS_14_DAY_AVG',
                                                'line_date_offset':-7,
                                                'left_y_div':5000,
                                                'right_y_div':0,
                                                'root_id':'hosp-p',
                                                'x_axis_legend':'Reported date',
                                                'line_legend':'14-day average',
                                                'month_modulo':2,
                                              });
        }.bind(this)
      );
  }

  listenForLocations() {
    let searchElement = document.querySelector("cagov-county-search");
    searchElement.addEventListener(
      "county-selected",
      function (e) {
        console.log("X County selected", e.detail.filterKey);
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
}

window.customElements.define(
  "cagov-chart-dashboard-hospitalized-patients",
  CAGovDashboardHospitalizedPatients
);
