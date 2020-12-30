import { chartOverlayBox, chartOverlayBoxClear } from "../../chart-overlay-box.js";

export default function drawBars(stackedData, data, statewideRatePer100k) {
  // console.log("Draw bars this.dimensions",this.dimensions);
  // using object context for most of the params

  // jbum cutting down on explicit params by using component as scope
  // otherwise we are going to end up with a zillion params for a method that really only applies to this one object
  let component = this;
  let svg = this.svg;
  let x = this.x;
  let y = this.y;
  let yAxis = this.yAxis;
  let color = this.color;
  let tooltip = this.tooltip;
  let filterScope = this.selectedMetricDescription;
  let filterString = this.filterString(statewideRatePer100k);
  let legendString = this.legendString();
  let translationsObj = this.translationsObj;
  let chartBreakpointValues = this.chartBreakpointValues;
  let appliedSuppressionStatus = this.appliedSuppressionStatus;
  let selectedMetric = this.selectedMetric;

  // console.log('100k', translationsObj, chartBreakpointValues, appliedSuppressionStatus);

  // console.log('selected', selectedMetric);
  
  svg.selectAll("g").remove();
  svg.selectAll("rect").remove();
  svg.selectAll("text").remove();
  svg.selectAll("path").remove();

  let bar = svg
    .append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter()
    .append("g")
    .attr("fill", (d) => color(d.key))
    .selectAll("rect")

    // enter a second time = loop subgroup per subgroup to add all rectangles
    .data((d) => d)
    .enter();
  
  bar.append("rect")
    .attr("x", (d) => x(d[0]))
    .attr("y", (d) => y(d.data.DEMOGRAPHIC_SET_CATEGORY))
    .attr("width", (d) => x(d[1]) - x(d[0]))
    .attr("height", "10px");


  // large transparent area for tooltip hover area
  bar.append("rect")
    .attr("x", (d) => x(d[0]))
    .attr("y", (d) => y(d.data.DEMOGRAPHIC_SET_CATEGORY)-10)
    .attr("width", (d) => x(d[1]) - x(d[0]))
    .attr("height", "30px")
    .attr("fill", "transparent")  // use rgb(255,0,0,0.5) for debugging
    .attr("tabindex", "0")
    .attr("aria-label", (d, i) => {
      let caption = component.toolTipCaption(
        d.data.DEMOGRAPHIC_SET_CATEGORY,
        d.data.METRIC_VALUE_PER_100K
          ? parseFloat(d.data.METRIC_VALUE_PER_100K).toFixed(0)
          : 0,
        filterScope,
        d // .toLowerCase()
      );

      if (d.data.APPLIED_SUPPRESSION === "Total") {
        caption = translationsObj['data-missing-applied-suppression-total' + "--" + selectedMetric.toLowerCase()] || '';
      } else if (d.data.APPLIED_SUPPRESSION === "Population") {
        caption = translationsObj['data-missing-applied-suppression-population'+ "--" + selectedMetric.toLowerCase()] || '';
      }

      return `<div class="chart-tooltip"><div>${caption}</div></div>`;
    })
    .on("mouseover focus", function (event, d) {
      d3.select(this).transition();

      let caption = component.toolTipCaption(
        d.data.DEMOGRAPHIC_SET_CATEGORY,
        d.data.METRIC_VALUE_PER_100K
          ? parseFloat(d.data.METRIC_VALUE_PER_100K).toFixed(0)
          : 0,
        filterScope,
        d // .toLowerCase()
      );
      if (d.APPLIED_SUPPRESSION === "Population") {
        caption = ``
      } else if (d.APPLIED_SUPPRESSION === "Total") {
        caption = ``
      }
      // console.log("Caption",caption);
      // <span class="highlight-data">placeholderDEMO_CAT</span> people have <span class="highlight-data">placeholderMETRIC_100K</span> placeholderFilterScope for 100k people of the same race and ethnicity'
      tooltip.html(`<div class="chart-tooltip"><div >${caption}</div></div>`);
      tooltip.style("visibility", "visible");
      tooltip.style("left", "90px");
      tooltip.style("top", `${event.layerY+10}px`);
    })
    .on("mouseout", function (d) {
      d3.select(this).transition();
      //.attr("fill", d => color(d.key));
      //.style("fill", "skyblue");
      tooltip.style("visibility", "hidden");
    });

  // svg.append("g").call(xAxis);

  let is_debugging_infobox = false;
  let boxClass = "chartOverlay-cagov-chart-re-100k";
  if (appliedSuppressionStatus !== null || is_debugging_infobox) {
    chartOverlayBox(svg,                      
                  "cagov-chart-re-100k",      // class of chart
                  boxClass,                   // class of box
                  chartBreakpointValues,      // dimensions dict (contains width,height)
                  translationsObj[appliedSuppressionStatus] ? translationsObj[appliedSuppressionStatus] : '' // caption
                  )
  } else {
    chartOverlayBoxClear(svg, boxClass);
  }

  // Bar labels.
  svg
    .append("g")
    .call(yAxis);

    // @TODO we need to change the classes for the bar labels in order to make them lighter color,
    // Syntax issue here:
    // d3.selectAll(".bar-label")
    // .data(data, (d) => {
    //   console.log("DD", d)
    // })
    // .enter((e) => console.log("E", e))
    // .each((enter) => {
    //   console.log('enter', enter);
    // NOPE
    //     // .attr("class", (d) => {
    //     //   console.log("DDD", d)
    //     //   if (d.APPLIED_SUPPRESSION === "Population") {
    //     //     return "bar-label bars-label-unknown";
    //     //   } else {
    //     //     return "bar-label bars-label-unknown";
    //     //   }
    //     // });
    // });

  // End of bar labels
  svg
    .append("g")
    .attr("class", "bars")
    .selectAll(".bars")
    .data(data)
    .join((enter) => {
      enter
        .append("text")
        .attr("class", (d) => {
          if (d.APPLIED_SUPPRESSION === "Population") {
            return "bars bars-unknown";
          } else {
            return "bars";
          }
        })
        .attr("y", (d) => y(d.DEMOGRAPHIC_SET_CATEGORY) + 9)
        .attr("x", (d) => 380)
        .attr("height", y.bandwidth())
        .text((d) => {
          // @TODO ADD COMMA HANDLER HERE
          if (
            d.APPLIED_SUPPRESSION === "None" &&
            d.METRIC_VALUE_PER_100K !== null
          ) {
            return d.METRIC_VALUE_PER_100K
              ? parseFloat(d.METRIC_VALUE_PER_100K).toFixed(1)
              : 0;
          } else {
            if (d.APPLIED_SUPPRESSION === "Total") {
              // return "Total";
              return "";
            } else if (d.APPLIED_SUPPRESSION === "Population") {
              // return "Population";
              return "";
            }
          }
        })
        .attr("text-anchor", "end");
    });

  // Times the lowest rate labels
  svg
    .append("g")
    .attr("class", "more-than-labels")
    .selectAll(".more-than-labels")
    .data(data)
    .join((enter) => {
      enter
        .append("text")
        .attr("class", "more-than-labels")
        .attr("y", (d) => y(d.DEMOGRAPHIC_SET_CATEGORY) + 25)
        .attr("x", (d) => 415)
        .attr("height", y.bandwidth())

        .html((d) => {
          if (d.APPLIED_SUPPRESSION === "None") {
            if (parseFloat(d.PCT_FROM_LOWEST_VALUE).toFixed(1) > 1) {
              return `<tspan class="highlight-data">${parseFloat(
                d.PCT_FROM_LOWEST_VALUE
              ).toFixed(1)}</tspan> times the lowest rate`;
            } else {
              return `Lowest rate`;
            }
          } else {
            return ``;
          }
        })
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
        .attr("y", (d) => y(d.DEMOGRAPHIC_SET_CATEGORY) + 25)
        .attr("x", (d) => {
          return d.APPLIED_SUPPRESSION == "None"? 250 : 0;
        })
        .attr("height", y.bandwidth())
        .html((d) => {
          if (d.APPLIED_SUPPRESSION === "Population") {
            return `<tspan class="withheld-label">${translationsObj['data-missing-applied-suppression-population' + "--" + selectedMetric.toLowerCase()] || ''}</tspan>`;
          } else if (d.APPLIED_SUPPRESSION === "Total") {
            return `<tspan class="withheld-label">${translationsObj['data-missing-applied-suppression-total' + "--" + selectedMetric.toLowerCase()] || ''}</tspan>`;
          } else if (d.APPLIED_SUPPRESSION === "None") {
            return `<tspan class="highlight-data">
            ${parseFloat(
              d.METRIC_VALUE_PER_100K_CHANGE_30_DAYS_AGO * 100
            ).toFixed(1)}%</tspan>
            ${translationsObj.chartLineDiff}`;
          } else {
            console.log("unexpected applied suppression",d.APPLIED_SUPPRESSION);
            return ``;
          }
        })
        .attr("text-anchor", (d) => d.APPLIED_SUPPRESSION == "None"? "end" : "start");
        // .attr("inline-size", chartBreakpointValues.width);
    });

  // Change from month arrows
  svg
    .append("g")
    .attr("class", "change-from-month-labels")
    .selectAll(".change-from-month-labels")
    .data(data)
    .join((enter) => {
      enter
        .append("svg")
        .attr("y", (d) => y(d.DEMOGRAPHIC_SET_CATEGORY) + 15)
        .attr("x", (d) => {
          return 3;
        })
        .html((d) => {
          if (d.APPLIED_SUPPRESSION === "None") {
            if (
              !d.METRIC_VALUE_PER_100K_CHANGE_30_DAYS_AGO ||
              Math.abs(d.METRIC_VALUE_PER_100K_CHANGE_30_DAYS_AGO) < 0.0005
            ) {
              return `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.4155 8.8403L13.0689 12.013C12.8394 12.2306 12.4721 12.2234 12.2554 11.9949C12.0388 11.7663 12.0483 11.4018 12.2807 11.1815L14.5958 8.98667L1.0023 8.9417L0.784831 8.9417C0.629791 8.93708 0.495915 8.90016 0.388909 8.7873C0.284502 8.67717 0.227827 8.53225 0.231476 8.37719C0.2349 8.22757 0.297533 8.095 0.410888 7.98753C0.563911 7.84246 0.720296 7.81444 0.823716 7.81572L1.0023 7.816L14.6338 7.79526L12.449 5.49078C12.2324 5.26226 12.2419 4.89773 12.4743 4.67745C12.7038 4.45985 13.0712 4.46706 13.2878 4.69558L16.4409 8.02148C16.6573 8.25543 16.6478 8.62 16.4155 8.8403Z" fill="#1F2574"/>
</svg>`;
            } else if (
              parseFloat(d.METRIC_VALUE_PER_100K_CHANGE_30_DAYS_AGO) > 0
            ) {
              return `<svg width="15" height="10" viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M17 0.581819V5.19326C17 5.50954 16.742 5.77116 16.4271 5.77116C16.1122 5.77116 15.8543 5.51344 15.8543 5.19326V2.00308L10.1901 7.93042C10.0839 8.03975 9.93972 8.09832 9.78419 8.09832C9.63244 8.09832 9.48828 8.03975 9.37826 7.93042L6.11944 4.64647L0.971201 9.8321C0.86118 9.94143 0.720802 10 0.565271 10C0.413518 10 0.26936 9.94143 0.15934 9.8321C0.0531121 9.72667 0 9.59001 0 9.43381C0 9.22295 0.0872582 9.09018 0.15934 9.01601L5.70966 3.42434C5.81968 3.315 5.96006 3.25643 6.11559 3.25643C6.26734 3.25643 6.4115 3.315 6.52152 3.42434L9.78035 6.70829L15.0158 1.1558H11.8403C11.5254 1.1558 11.2674 0.898078 11.2674 0.5779C11.2674 0.26162 11.5254 0 11.8403 0H16.4233C16.742 0.00390471 17 0.261621 17 0.581819H17Z" fill="#FF8000"/>
  </svg>`;
            } else {
              return `<svg width="15" height=10 viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M17 9.41818V4.80674C17 4.49046 16.742 4.22884 16.4271 4.22884C16.1122 4.22884 15.8543 4.48656 15.8543 4.80674V7.99692L10.1901 2.06958C10.0839 1.96025 9.93972 1.90168 9.78419 1.90168C9.63244 1.90168 9.48828 1.96025 9.37826 2.06958L6.11944 5.35353L0.971201 0.167904C0.86118 0.0585697 0.720802 0 0.565271 0C0.413518 0 0.26936 0.0585717 0.15934 0.167904C0.0531121 0.273332 0 0.409992 0 0.566192C0 0.777052 0.0872582 0.909822 0.15934 0.983993L5.70966 6.57566C5.81968 6.685 5.96006 6.74357 6.11559 6.74357C6.26734 6.74357 6.4115 6.685 6.52152 6.57566L9.78035 3.29171L15.0158 8.8442H11.8403C11.5254 8.8442 11.2674 9.10192 11.2674 9.4221C11.2674 9.73838 11.5254 10 11.8403 10H16.4233C16.742 9.9961 17 9.73838 17 9.41818H17Z" fill="#003D9D"/>
  </svg>`;
            }
          } else {
            return ``;
          }
        });
    });

  // Reference line for statewide rate
  svg
    .append("path")
    .attr(
      "d",
      d3.line()([
        [x(statewideRatePer100k), 30],
        [x(statewideRatePer100k), 650],
      ])
    )
    .attr("stroke", "#1F2574")
    .attr("opacity", "0.25")
    .style("stroke-dasharray", "5, 5")
    .style("stroke", "#1F2574");

  let xpos = x(statewideRatePer100k);
  let xalign = "middle";
  if (xpos < this.dimensions.width * 0.3) {
    xalign = "start";
  } else if (xpos >= this.dimensions.width * 0.66) {
    xalign = "end";
  }
  // console.log("Filter string",filterString,"align",xalign);
  // Label for statewide line
  svg
    .append("g")
    .append("text")
    .text(filterString) // `Statewide ${filterScope.toLowerCase()} per 100K: ${parseFloat(statewideRatePer100k).toFixed(1)}`)
    .attr("x", x(statewideRatePer100k))
    .attr("y", 25)
    .attr("text-anchor", xalign)
    .attr("fill", "#1F2574")
    .attr("class", "label bar-chart-label");

  // Chart legend
  // Box
  svg
    .append("rect")
    .attr("x", 0)
    .attr("y", -20)
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", "#FFCF44");

  // Label
  svg
    .append("text")
    .attr("x", 25)
    .attr("y", -12)
    .attr("class", "legend-label")
    .attr("dy", "0.35em")
    .text(legendString);

}
