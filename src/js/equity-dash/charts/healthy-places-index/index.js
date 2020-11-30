// import { stackOffsetNone } from 'd3';
// we are not yet importing d3 because we ran into some circular dependency issues and we can't get latest version to transpile properly so there are major IE problems. Importing it has to be tested against IE
// import Toolline from './tooltip.js'; // Not used, delete?
import Tooltip from "./tooltip.js";
import template from "./template.js";
import getTranslations from "./../../get-strings-list.js";
import getScreenResizeCharts from "./../../get-window-size.js";

class CAGOVChartD3Lines extends window.HTMLElement {
  connectedCallback() {
    this.translationsObj = this.getTranslations(this);
    // this.innerHTML = this.translationsObj; // not currently using a template.
    this.innerHTML = template(this.translationsObj);
    
    // Settings and initial values
    this.chartOptions = {
      // Data
      dataUrl: config.equityChartsDataLoc + "/equitydash/healthequity-california.json",  // Overwritten by county.
      // state: "California",
      // county: "California",
      // Style
      chartColors: ["#92C5DE", "#FFCF44"],
      // Breakpoints
      desktop: {
        width: 613,
        height: 355,
        margin: { top: 30, right: 1.5, bottom: 40, left: 30 },
        legendPosition: {
          x: 150,
          y: 18
        }
      },
      tablet: {
        width: 440,
        height: 355,
        margin: { top: 30, right: 1.5, bottom: 40, left: 30 },
        legendPosition: {
          x: 150,
          y: 18
        }
      },
      mobile: {
        width: 440,
        height: 355,
        margin: { top: 30, right: 1.5, bottom: 40, left: 30 },
        legendPosition: {
          x: 150,
          y: 18
        }
      },
    };

    getScreenResizeCharts(this);
    this.screenDisplayType = window.charts
      ? window.charts.displayType
      : "desktop";
    this.chartBreakpointValues = this.chartOptions[
      this.screenDisplayType ? this.screenDisplayType : "desktop"
    ];

    // Choose settings for current screen display.
    // Display content & layout dimensions
    const handleChartResize = () => {
      getScreenResizeCharts(this);
      this.screenDisplayType = window.charts
        ? window.charts.displayType
        : "desktop";
      this.chartBreakpointValues = this.chartOptions[
        this.screenDisplayType ? this.screenDisplayType : "desktop"
      ];
    };

    // @TODO connect a debouncer
    window.addEventListener("resize", handleChartResize);

    // jbum: all text for line chart collected here...
    this.textLabels = {
      yAxisLabel: this.translationsObj["y-axis-label"], // Test positivity
      data1Legend: this.translationsObj["data1-legend"], // Statewide positivity
      data1LegendLocal: this.translationsObj["data1-legend-local"], // 'placeholderForDynamicLocation test positivity', // appended to county name
      data2Legend: this.translationsObj["data2-legend"], // 'Health equity quartile positivity',
      missingDataCaption: this.translationsObj["missing-data-caption"], // 'The health equity metric is not<br>applied to counties with a population<br>less than 106,000.',
      missingDataCaptionLineDelimiter: this.translationsObj[
        "missing-data-caption-line-delimiter"
      ], // '<br>',
    };

    this.svg = d3
      .create("svg")
      .attr("viewBox", [0, 0, this.chartBreakpointValues.width, this.chartBreakpointValues.height]);

    window
      .fetch(
        this.chartOptions.dataUrl
      )
      .then((response) => response.json())
      .then((alldata) => {
        this.writeChart(alldata, this.svg, this.textLabels.data1Legend);
        // this.innerHTML = `<div class="svg-holder"></div>`;
        this.querySelector(".svg-holder").appendChild(this.svg.node());
      });

    let legendLabels = [
      this.textLabels.data1Legend,
      this.textLabels.data2Legend,
    ];

    this.legend = this.svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${this.chartBreakpointValues.legendPosition.x},${this.chartBreakpointValues.legendPosition.y})`);

    this.writeLegendColors(this.chartOptions.chartColors, this.legend);
    this.writeLegendLabels(legendLabels, this.legend);
    this.listenForLocations();
    if (this.querySelector('.d-none') !== null) {
      this.querySelector('.d-none').classList.remove("d-none");
    }
  }

  listenForLocations() {
    let searchElement = document.querySelector("cagov-county-search");
    searchElement.addEventListener(
      "county-selected",
      function (e) {
        this.county = e.detail.county;
        // console.log("Got County: " + this.county);
        let legendText = this.textLabels.data1LegendLocal.replace(
          "placeholderForDynamicLocation",
          this.county
        );

        window
          .fetch(
            config.equityChartsDataLoc +
              "/equitydash/healthequity-" +
              this.county.toLowerCase().replace(/ /g, "") +
              ".json"
          )
          .then((response) => response.json())
          .then((alldata) => {
            this.writeChart(alldata, this.svg, legendText);
          });
      }.bind(this),
      false
    );
  }

  // Related to the line that appears on hover
  bisect(data, date) {
    const bisectDate = d3.bisector((d) => new Date(d.DATE)).left;
    // this is consistently failing and returning the default==1
    const i = Math.min(data.length - 1, bisectDate(data, date, 1));
    const a = data[i - 1],
      b = data[i];
    // console.log("date = " + date+ " i= " + i);
    return date - new Date(a.DATE) > new Date(b.DATE) - date ? b : a;
  }

  writeChart(alldata, svg, data1Legend) {
    let component = this;
    let data = alldata.county_positivity_all_nopris;
    let data2 = alldata.county_positivity_low_hpi;
    console.log("Overall Data ", data);
    console.log("Equity Data2 ", data2);
    let missing_eq_data =
      data2.filter((d) => null == d.METRIC_VALUE).length > 0;

    let legendLabels = [data1Legend, this.textLabels.data2Legend];
    this.rewriteLegend(this.svg, legendLabels);
    svg
      .selectAll(".legend")
      .attr("visibility", missing_eq_data ? "hidden" : "visible");
    // console.log("dims",this.chartBreakpointValues);

    let xbounds = {
      min: d3.min(missing_eq_data ? data : data2, (d) => new Date(d.DATE)),
      max: d3.max(data, (d) => new Date(d.DATE)),
    };

    let x = d3
      .scaleTime()
      .domain([xbounds.min, xbounds.max])
      .range([this.chartBreakpointValues.margin.left, this.chartBreakpointValues.width - this.chartBreakpointValues.margin.right]);

    // don't allow max_y to exceed 100%, since that would be silly
    let max_y = Math.min(
      1,
      d3.max(missing_eq_data ? data : data2, (d) => d.METRIC_VALUE) * 1.4
    );

    let y = d3
      .scaleLinear()
      .domain([0, max_y]) // using county_positivity_low_hpi because that has higher numbers
      .range([
        this.chartBreakpointValues.height - this.chartBreakpointValues.margin.bottom,
        this.chartBreakpointValues.margin.top,
      ]);
    let xRange = x.range();
    let yRange = y.range();
    let chartWidth = xRange[1] - xRange[0]; // 128.5
    let chartHeight = yRange[1] - yRange[0]; // -52
    // console.log("Chart width", chartWidth, "height", chartHeight);

    let xAxis = (g) =>
      g
        .attr("transform", "translate(2.75," + this.chartBreakpointValues.margin.bottom + ")")
        .call(
          d3
            .axisBottom(x)
            .ticks(d3.timeWeek.every(1))
            .tickFormat(d3.timeFormat("%b. %d"))
            .tickSize(-chartHeight)
        )
        // .call(g => g)
        .call((g) => g.select(".domain").remove());

    let nbr_ticks = Math.min(10, 1 + Math.floor(max_y * 100));
    let y_tick_fmt = d3.format(".0%");

    let yAxis = (g) =>
      g
        .attr("transform", "translate(" + this.chartBreakpointValues.margin.left + ", 0)")
        .call(
          d3
            .axisLeft(y)
            .ticks(nbr_ticks)
            .tickFormat(y_tick_fmt)
            .tickSize(-chartWidth)
        )
        // .call(g => g)
        .call((g) => g.select(".domain").remove());

    let yAxisLabel = (g) =>
      g
        .append("text")
        .attr(
          "transform",
          "translate(" + 0 + " ," + (this.chartBreakpointValues.margin.top - 1) + ")"
        )
        .style("text-anchor", "left")
        .text(component.textLabels.yAxisLabel)
        .attr("class", "y-label");
    let missingLabelText = this.textLabels.missingDataCaption;
    let missingTextLines = missingLabelText.split(
      this.textLabels.missingDataCaptionLineDelimiter
    );

    // console.log("Text lines",missingTextLines);
    let informativeBox = (g) =>
      g
        // .append("text")
        .attr("class", "informative-box")
        .call((g) =>
          g
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", this.chartBreakpointValues.width)
            .attr("height", this.chartBreakpointValues.height)
            .attr("fill", "white")
            .attr("stroke", "none")
            .attr("opacity", "0.1")
        )
        .call((g) =>
          g
            .append("rect")
            .attr("class", "shadow")
            .attr("x", this.chartBreakpointValues.width * 0.25)
            .attr("y", this.chartBreakpointValues.height * 0.3)
            .attr("width", this.chartBreakpointValues.width * 0.5)
            .attr("height", this.chartBreakpointValues.height * 0.3)
            .attr("fill", "white")
            .attr("stroke", "currentColor")
            .attr("stroke-width", "2")
        )

        .each(function (d) {
          let gg = this;
          missingTextLines.forEach(function (textLine, yIdx) {
            d3.select(gg)
              .append("text")
              .attr(
                "transform",
                "translate(" +
                  component.dims.width / 2 +
                  " ," +
                  (component.dims.height * 0.39 + yIdx * 5) +
                  ")"
              )
              .style("text-anchor", "middle")
              .text(textLine);
          });
        });
    let line = d3
      .line()
      .x((d, i) => {
        return x(new Date(d.DATE));
      })
      .y((d) => {
        return y(d.METRIC_VALUE);
      });

    //call line chart county_positivity_all_nopris
    svg.selectAll(".county_positivity_all_nopris").remove();
    svg.selectAll(".tick").remove(); // remove previous axes annotations
    svg.selectAll(".y-label").remove();
    svg.selectAll(".informative-box").remove();

    if (!missing_eq_data) {
      svg
        .append("path")
        .datum(
          data.sort(function (a, b) {
            return a.DATE > b.DATE;
          })
        )
        .attr("fill", "none")
        .attr("stroke", this.chartOptions.chartColors[0])
        .attr("stroke-width", 3)
        .attr("class", "county_positivity_all_nopris")
        .attr("d", line);
    }

    //call line chart county_positivity_low_hpi
    svg.selectAll(".county_positivity_low_hpi").remove();

    if (!missing_eq_data) {
      svg
        .append("path")
        .datum(
          data2.sort(function (a, b) {
            return a.DATE > b.DATE;
          })
        )
        .attr("fill", "none")
        .attr("stroke", this.chartOptions.chartColors[1])
        .attr("stroke-width", 3)
        .attr("class", "county_positivity_low_hpi")
        .attr("d", line);
    }

    let xg = svg.append("g").call(xAxis);
    let yg = svg.append("g").call(yAxis);
    // debug ticks
    // xg.selectAll("line").style("stroke", "red");
    // yg.selectAll("line").style("stroke", "green");
    svg.append("g").call(yAxisLabel);

    let is_debugging_infobox = false;
    if (missing_eq_data || is_debugging_infobox) {
      svg.append("g").call(informativeBox);
    }

    //tooltip
    svg.on("mousemove", null);
    svg.on("mouseleave touchend", null);

    if (!missing_eq_data) {
      const tooltip = new Tooltip(true);
      const tooltip2 = new Tooltip(false);

      svg
        .on("mousemove", (event) => {
          // console.log("move: " + event.offsetX);
          // coords are container screen-coords, and need to be scaled/translated
          // to x display bounds before passed to x.invert
          var xy = d3.pointer(event);
          // console.log("event: ",xy);
          tooltip.show(this.bisect(data, x.invert(xy[0])), x, y);
          if (!missing_eq_data) {
            tooltip2.show(this.bisect(data2, x.invert(xy[0])), x, y);
          }
        })
        .on("mouseleave touchend", (event) => {
          // console.log("leave");
          tooltip.hide();
          if (!missing_eq_data) {
            tooltip2.hide();
          }
        });

      svg.append(() => tooltip.node);
      if (!missing_eq_data) {
        svg.append(() => tooltip2.node);
      }
    }
  }

  rewriteLines(svg, data, x, y) {
    svg
      .selectAll(".barshere rect")
      .data(data)
      .transition()
      .duration(300)
      .attr("x", (d, i) => x(i))
      .attr("y", (d) => y(d.CASE_RATE_PER_100K))
      .attr("height", (d) => y(0) - y(d.CASE_RATE_PER_100K));
  }

  writeLegendColors(legendColors, legend) {
    legend
      .selectAll("rect")
      .data(legendColors)
      .enter()
      .append("rect")
      .attr("x", function (d, i) {
        return i * 200 + 0;
      })
      .attr("y", function (d, i) {
        return 2; // i * 6;
      })
      .attr("width", 20)
      .attr("height", 3)
      .attr("fill", function (d, i) {
        return d;
      });
  }

  writeLegendLabels(legendLabels, legend) {
    legend
      .selectAll("text")
      .data(legendLabels)
      .enter()
      .append("text")
      .text(function (d) {
        return d;
      })
      .attr("x", function (d, i) {
        return i * 200 + 25;
      })
      .attr("y", function (d, i) {
        return -1; // i * 6 - 2;
      })
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "hanging");
  }

  rewriteLegend(svg, legendLabels) {
    svg
      .selectAll(".legend text")
      .data(legendLabels)
      .text((d) => d);
  }

  getTranslations() {
    let translations = getTranslations(this);

    return translations;
  }
}
window.customElements.define("cagov-chart-d3-lines", CAGOVChartD3Lines);
