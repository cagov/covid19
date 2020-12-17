import { chartOverlayFade, chartOverlayBoxClear } from "../../chart-overlay-box.js";

export default function drawSecondBars({
  svg,
  x1,
  x2,
  y,
  yAxis,
  stackedData1,
  stackedData2,
  color1,
  color2,
  data,
  tooltip,
  selectedMetric,
  translationsObj,
  legendScope = ``,
  legendScopeStatewide = ``,
  appliedSuppressionStatus,
  chartBreakpointValues
}) {
  
  svg.selectAll("g").remove();
  svg.selectAll("rect").remove();
  svg.selectAll("text").remove();

  let is_debugging_infobox = false;
  let boxClass = "chartOverlay-svg-holder-second";

  if ( appliedSuppressionStatus !== null || is_debugging_infobox) {
    chartOverlayFade(svg,                      
                    "cagov-chart-re-pop",       // class of chart
                    boxClass,                   // class of box
                    chartBreakpointValues,      // dimensions dict (contains width,height)
                    )
    } else {
      chartOverlayBoxClear(svg, boxClass);
    }  

  // End of bar labels, METRIC total (yellow)
  svg
    .append("g")
    .selectAll("g")
    .data(stackedData1)
    .enter()
    .append("g")
    .attr("fill", (d) => color2(d.key))
    .selectAll("rect")

    // enter a second time = loop subgroup per subgroup to add yellow bars
    .data((d) => d)
    .enter()
    .append("rect")
    .attr("x", (d) => x1(d[0]))
    .attr("y", (d) => y(d.data.DEMOGRAPHIC_SET_CATEGORY))
    .attr("width", (d) => x1(d[1]) - x1(d[0]))
    .attr("height", "10px")

    .attr("tabindex", "0")
    // .attr("aria-label", (d, i) => `<div class="chart-tooltip">
    // <div>unused_caption2</div>`)

     // jbum: event handlers appear to be unused
    .on("mouseover focus", function (event, d) {
      console.log("Got focus");
      d3.select(this).transition();

      // Rephrase as "X people make up XX% of cases statewide and XX% of California's population"
      // @TODO Commented out so that we do not launch with incomplete code.
      // tooltip.html(`<div class="chart-tooltip">
      //     <div>unused_caption1 </div>`);
      // tooltip.style("visibility", "visible");
      // tooltip.style("left", "90px");
      // tooltip.style("top", `${event.offsetY + 100}px`);
    })
    .on("mouseout", function (d) {
      d3.select(this).transition();
      //.attr("fill", d => color(d.key));
      //.style("fill", "skyblue");
      tooltip.style("visibility", "hidden");
    });

  // svg.append("g").call(xAxis);

  svg.append("g").call(yAxis);

  // End of bar labels, METRIC total (yellow)
  svg
    .append("g")
    .attr("class", "bars")
    .selectAll(".bars")
    .data(data)
    .join((enter) => {
      enter
        .append("text")
        .attr("class", "bars")
        .attr("y", (d) => y(d.DEMOGRAPHIC_SET_CATEGORY) + 8)
        .attr("x", (d) => x1(100) + 5)
        .attr("height", y.bandwidth())
        .text((d) =>
          d.METRIC_TOTAL_PERCENTAGE
            ? parseFloat(d.METRIC_TOTAL_PERCENTAGE).toFixed(1) + "%"
            : 0 + "%"
        )
        .attr("text-anchor", "end");
    });

  // % Change since previous month labels
  svg
    .append("g")
    .attr("class", "change-from-month-labels")
    .selectAll(".change-from-month-labels")
    .data(data)
    .join((enter) => {
      enter
        .append("text")
        .attr("class", "change-from-month-labels")
        .attr("y", (d) => y(d.DEMOGRAPHIC_SET_CATEGORY) + 27)
        .attr("x", (d) => {
          if (d.APPLIED_SUPPRESSION === "Population" || d.APPLIED_SUPPRESSION === "Total")  {
            return x2(1);
          } else {
            return x2(1) + 20
          }
        })
        .attr("height", y.bandwidth())

        .html((d) => {
          if (d.APPLIED_SUPPRESSION === "Population")  {
            return `${translationsObj['data-missing-applied-suppression-total'] || ''}`;
          } else if (d.APPLIED_SUPPRESSION === "Total")  {
            return `${translationsObj['data-missing-applied-suppression-population'] || ''}`;
          }

          if (!d.METRIC_VALUE_PERCENTAGE_DELTA_FROM_30_DAYS_AGO) {
            return `<tspan class="highlight-data">0%</tspan> ${translationsObj.chartLineDiff}`;
          } else {
            return `<tspan class="highlight-data">${parseFloat(
              d.METRIC_VALUE_PERCENTAGE_DELTA_FROM_30_DAYS_AGO
            ).toFixed(1)}%</tspan> ${translationsObj.chartLineDiff}`;
          }
        })
        .attr("text-anchor", "end");
    });

  // % Change from month arrows
  svg
    .append("g")
    .attr("class", "change-from-month-labels")
    .selectAll(".change-from-month-labels")
    .data(data)
    .join((enter) => {
      enter
        .append("svg")

        .attr("y", (d) => y(d.DEMOGRAPHIC_SET_CATEGORY) + 15)
        .attr("x", (d) => x2(1))
        .html((d) => {
          if (d.APPLIED_SUPPRESSION === "Population" || d.APPLIED_SUPPRESSION === "Total")  {
            return ``;
          }
          
          if (
            !d.METRIC_VALUE_PERCENTAGE_DELTA_FROM_30_DAYS_AGO ||
            Math.abs(d.METRIC_VALUE_PERCENTAGE_DELTA_FROM_30_DAYS_AGO) < 0.05
          ) {
            return `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M16.4155 8.8403L13.0689 12.013C12.8394 12.2306 12.4721 12.2234 12.2554 11.9949C12.0388 11.7663 12.0483 11.4018 12.2807 11.1815L14.5958 8.98667L1.0023 8.9417L0.784831 8.9417C0.629791 8.93708 0.495915 8.90016 0.388909 8.7873C0.284502 8.67717 0.227827 8.53225 0.231476 8.37719C0.2349 8.22757 0.297533 8.095 0.410888 7.98753C0.563911 7.84246 0.720296 7.81444 0.823716 7.81572L1.0023 7.816L14.6338 7.79526L12.449 5.49078C12.2324 5.26226 12.2419 4.89773 12.4743 4.67745C12.7038 4.45985 13.0712 4.46706 13.2878 4.69558L16.4409 8.02148C16.6573 8.25543 16.6478 8.62 16.4155 8.8403Z" fill="#1F2574"/>
  </svg>`;
          } else if (
            parseFloat(d.METRIC_VALUE_PERCENTAGE_DELTA_FROM_30_DAYS_AGO) > 0
          ) {
            return `<svg width="15" height="10" viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 0.581819V5.19326C17 5.50954 16.742 5.77116 16.4271 5.77116C16.1122 5.77116 15.8543 5.51344 15.8543 5.19326V2.00308L10.1901 7.93042C10.0839 8.03975 9.93972 8.09832 9.78419 8.09832C9.63244 8.09832 9.48828 8.03975 9.37826 7.93042L6.11944 4.64647L0.971201 9.8321C0.86118 9.94143 0.720802 10 0.565271 10C0.413518 10 0.26936 9.94143 0.15934 9.8321C0.0531121 9.72667 0 9.59001 0 9.43381C0 9.22295 0.0872582 9.09018 0.15934 9.01601L5.70966 3.42434C5.81968 3.315 5.96006 3.25643 6.11559 3.25643C6.26734 3.25643 6.4115 3.315 6.52152 3.42434L9.78035 6.70829L15.0158 1.1558H11.8403C11.5254 1.1558 11.2674 0.898078 11.2674 0.5779C11.2674 0.26162 11.5254 0 11.8403 0H16.4233C16.742 0.00390471 17 0.261621 17 0.581819H17Z" fill="#FF8000"/>
    </svg>`;
          } else {
            return `<svg width="15" height=10 viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 9.41818V4.80674C17 4.49046 16.742 4.22884 16.4271 4.22884C16.1122 4.22884 15.8543 4.48656 15.8543 4.80674V7.99692L10.1901 2.06958C10.0839 1.96025 9.93972 1.90168 9.78419 1.90168C9.63244 1.90168 9.48828 1.96025 9.37826 2.06958L6.11944 5.35353L0.971201 0.167904C0.86118 0.0585697 0.720802 0 0.565271 0C0.413518 0 0.26936 0.0585717 0.15934 0.167904C0.0531121 0.273332 0 0.409992 0 0.566192C0 0.777052 0.0872582 0.909822 0.15934 0.983993L5.70966 6.57566C5.81968 6.685 5.96006 6.74357 6.11559 6.74357C6.26734 6.74357 6.4115 6.685 6.52152 6.57566L9.78035 3.29171L15.0158 8.8442H11.8403C11.5254 8.8442 11.2674 9.10192 11.2674 9.4221C11.2674 9.73838 11.5254 10 11.8403 10H16.4233C16.742 9.9961 17 9.73838 17 9.41818H17Z" fill="#003D9D"/>
    </svg>`;
          }
        });
    });
}
