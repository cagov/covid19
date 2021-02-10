import template from "./template.js";
import getTranslations from "./../../get-strings-list.js";
import getScreenResizeCharts from "./../../get-window-size.js";
import rtlOverride from "./../../rtl-override.js";

class CAGovVaccinationGroupsRaceEthnicityAge extends window.HTMLElement {
  connectedCallback() {
    console.log("Loading CAGOVEquityVaccinesRaceEthnicityAge");
    this.translationsObj = getTranslations(this);
    this.innerHTML = template(this.translationsObj);
    // Settings and initial values
    let bars = 5;
    let barHeight = 16;
    this.chartOptions = {
      // Data
      dataUrl:
        config.equityChartsSampleDataLoc +
        "vaccines_by_race_ethnicity_and_age_california.json", // Overwritten by county.
      // Breakpoints
      desktop: {
        fontSize: 14,
        legendWidth: 800,
        legendHeight: 60,
        height: 60 + bars * barHeight,
        width: 400,
        margin: {
          top: 20,
          right: 100,
          bottom: 20,
          left: 60,
        },
      },
      tablet: {
        fontSize: 14,
        legendWidth: 800,
        legendHeight: 60,
        height: 60 + bars * barHeight,
        width: 400,
        margin: {
          top: 20,
          right: 100,
          bottom: 20,
          left: 60,
        },
      },
      mobile: {
        fontSize: 12,
        legendWidth: 440,
        legendHeight: 60,
        height: 60 + bars * (barHeight - 10),
        width: 440,
        margin: {
          top: 20,
          right: 80,
          bottom: 20,
          left: 60,
        },
      },
      retina: {
        fontSize: 12,
        legendWidth: 440,
        legendHeight: 60,
        height: 60 + bars * (barHeight - 10),
        width: 320,
        margin: {
          top: 20,
          right: 80,
          bottom: 20,
          left: 60,
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

    // Set default values for data and labels
    this.dataUrl = this.chartOptions.dataUrl;

    this.retrieveData(this.dataUrl);

    rtlOverride(this); // quick fix for arabic
  }

  getLegendText() {
    return ["Number of people who have received a vaccination"];
  }

  ariaLabel(d) {
    let label = "ARIA BAR LABEL";
    return label;
  }

  writeLegend() {
    const legendBoxW = 16;
    const legendY = 16;
    const legendText = this.getLegendText();

    let svg = d3
      .select(this.querySelector(".svg-legend-holder"))
      .append("svg")
      .attr("viewBox", [
        0,
        0,
        this.chartBreakpointValues.legendWidth,
        this.chartBreakpointValues.legendHeight,
      ]);

    let group = svg.append("g");

    group
      .append("g")
      .append("rect")
      .attr("fill", "#92C5DE")
      .attr("class", "legend-block")
      .attr("y", legendY)
      .attr("x", 0)
      .attr("width", legendBoxW)
      .attr("height", legendBoxW);

    group
      .append("g")
      .append("text")
      .text(legendText[0])
      .attr("class", "legend-caption")
      .attr("y", legendY + legendBoxW / 2.0)
      .attr("x", legendBoxW * 2)
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "start");
  }

  writeBars(svg, data, x, y) {
    let max_x_domain = x.domain()[1];

    let groups = svg.append("g").selectAll("g").data(data).enter().append("g");

    // light-colored background bar
    let g = groups.append("g");
    g.append("rect")
      .attr("class", "bg-bar")
      .attr("fill", "#f2f5fc")
      .attr("y", (d) => y(d.CATEGORY))
      .attr("x", (d) => x(0))
      .attr("width", (d) => x(max_x_domain) - x(0))
      .attr("height", y.bandwidth());

    // dark-colored background bar
    g.append("rect")
      .attr("class", "fg-bar")
      .attr("fill", "#92C5DE")
      .attr("y", (d) => y(d.CATEGORY))
      .attr("x", (d) => x(0))
      .attr("width", (d) => x(d.METRIC_VALUE) - x(0))
      .attr("height", y.bandwidth())
      .attr("id", (d, i) => "barid-" + i)
      .attr("tabindex", "0")
      .attr("aria-label", (d, i) => `${this.ariaLabel(d)}`);

    // transparent bar for selections
    g.append("rect")
      .attr("class", "select-bar")
      .attr("fill", "#00FF00")
      .attr("fill-opacity", 0.0)
      .attr("y", (d) => y(d.CATEGORY))
      .attr("x", (d) => x(0))
      .attr("width", (d) => x(max_x_domain) - x(0))
      .attr("height", y.bandwidth())
      .on("mouseover focus", function (event, d, i) {
        d3.select(this.parentNode)
          .select(".fg-bar")
          .transition()
          .duration(200)
          .style("fill", "#003D9D");
        // problem the svg is not the width in px in page as the viewbox width
      })
      .on("mouseout blur", function (d) {
        d3.select(this.parentNode)
          .select(".fg-bar")
          .transition()
          .duration(200)
          .style("fill", "#92C5DE");
        // if (tooltip !== null) { // @TODO Q: why is tooltip coming null
        //   tooltip.style.visibility = "hidden";
        // }
      });

    // value label at end of bar
    groups
      .append("text")
      .attr("class", "bar-value-text")
      .attr("y", (d, i) => y(d.CATEGORY) + y.bandwidth() / 2)
      .attr("x", (d) => x(max_x_domain))
      // .attr("width", x.bandwidth() / 4)
      .html((d) => {
        return `<tspan dx="1.0em">${this.intFormatter.format(
          d.METRIC_VALUE
        )}</tspan>`;
      })
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "start");

    // age class label in front of bar
    groups
      .append("text")
      .attr("class", "bar-label-text")
      .attr("y", (d, i) => y(d.CATEGORY) + y.bandwidth() / 2)
      .attr("x", (d) => 0)
      // .attr("width", x.bandwidth() / 4)
      .html((d) => {
        return `<tspan>${d.CATEGORY}</tspan>`;
      })
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "start");
  }

  renderChart() {
    // Exclude Other & Unknown categories from displaying for this chart.
    let data = this.alldata;
    let categories = [];
    let subcategories = [];

    // Produce list of ordered Categories and Subcats
    data.forEach((d) => {
      if (!subcategories.includes(d.SUBCAT)) {
        subcategories.push(d.SUBCAT);
      }
      if (!categories.includes(d.CATEGORY)) {
        categories.push(d.CATEGORY);
      }
    });
    this.databreakout = categories.map((cat) =>
      data
        .filter((rec) => rec.CATEGORY == cat)
        .map((rec) => ({
          CATEGORY: rec.SUBCAT,
          METRIC_VALUE: rec.METRIC_VALUE,
        }))
    );

    // produce container markup for each SVG in a col-6 w a label
    d3.select(".re-race-ethnicity-age-chart-list")
      .selectAll("div")
      .data(categories)
      .enter()
      // col-6 div for two column display
      .append("div")
      .attr("class", "col-lg-6 col-md-6 col-sm-12 mx-auto px-0")
      .attr("id", (cat, ci) => "svg-container-" + ci)
      .append("div")
      .attr("class", "chart-subtitle")
      .text((cat) => cat)
      .each((cat, ci) => {
        // charts inside the divs
        let svg = d3
          .select(this.querySelector("#svg-container-" + ci))
          .append("svg")
          .attr("viewBox", [
            0,
            0,
            this.chartBreakpointValues.width,
            this.chartBreakpointValues.height,
          ])
          .append("g")
          .attr("transform", "translate(0,0)");

        let y = d3
          .scaleBand()
          .domain(subcategories)
          .range([
            this.dimensions.margin.top,
            this.dimensions.height - this.dimensions.margin.bottom,
          ])
          .paddingInner(4 / 10)
          .paddingOuter(0);

        let x = d3
          .scaleLinear()
          .domain([0, d3.max(data, (d) => d.METRIC_VALUE)])
          .nice()
          .range([
            this.dimensions.margin.left,
            this.dimensions.width - this.dimensions.margin.right,
          ]);

        this.writeBars(svg, this.databreakout[ci], x, y);
      });

    this.writeLegend();
  }

  retrieveData(url) {
    window
      .fetch(url)
      .then((response) => response.json())
      .then(
        function (alldata) {
          this.alldata = alldata;
          this.renderChart();
        }.bind(this)
      );
  }
}

window.customElements.define(
  "cagov-chart-vaccination-groups-race-ethnicity-age",
  CAGovVaccinationGroupsRaceEthnicityAge
);
