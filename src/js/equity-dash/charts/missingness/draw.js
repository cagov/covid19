export default
function drawBars(svg, x, y, yAxis, stackedData, color, data, tooltip, translations) {

  svg.selectAll("g").remove();
  svg.selectAll("rect").remove();
  svg.selectAll("text").remove();

  svg
    .append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter()
    .append("g")
    .attr("fill", d => color(d.key))
    .selectAll("rect")
    .attr("width", "40px")


    // enter a second time = loop subgroup per subgroup to add all rectangles
    .data(d => {
      return d;
    })
    .enter()
    .append("rect")
    .attr("x", d => x(d[0]))
    .attr("y", d => y(d.data.METRIC))
    .attr("width", d => x(d[1]) - x(d[0]))
    .attr("height", "10px")

    // enter a third time, add background fill
    .data(d => {
      console.log('d', d);
      return d;
    })
    .enter()
    .append("rect")
    .attr("fill", d => color('#000000'))
    .attr("x", d => x(d[0]))
    .attr("y", d => y(d.data.METRIC))
    .attr("width", d => x(1))
    .attr("height", "12px")

    .on("mouseover", function(event, d) {
      console.log('moused');
      d3.select(this).transition();
      tooltip.html(() => {
        let percentNotMissing = d.data.NOT_MISSING
          ? parseFloat(d.data.NOT_MISSING * 100).toFixed(1) + "%"
          : 0;
        let percentMissing = d.data.MISSING
          ? parseFloat(d.data.MISSING * 100).toFixed(1) + "%"
          : 0;

        let metric = d.data.METRIC;
        return translations.chartTooltip({
          metric: 'cases',
          highlightData: '10%',
        });



        // if (d[0] == 0) {
        //   return translations.chartTooltip({
        //     metric: d.data.METRIC,
        //     highlightData: d.data.NOT_MISSING
        //       ? parseFloat(d.data.NOT_MISSING * 100).toFixed(1) + "%"
        //       : 0
        //   });
        // } else {
        //
        //   return translations.chartTooltip({
        //     metric: d.data.METRIC,
        //     highlightData: d.data.NOT_MISSING
        //       ? parseFloat(d.data.NOT_MISSING * 100).toFixed(1) + "%"
        //       : 0
        //   });
        // }
      });
      tooltip.style("visibility", "visible");
      tooltip.style("left",'90px');
      tooltip.style("top",`${event.offsetY + 100}px`)
    })
    .on("mouseout", function(d) {
      d3.select(this).transition();
      tooltip.style("visibility", "hidden");
    });

  //% change since previous month labels
  svg
    .append("g")
    .attr("class", "more-than-labels")
    .selectAll(".more-than-labels")
    .data(data)
    .join(enter => {
      enter
        .append("text")
        .attr("class", "more-than-labels")
        .attr("y", d => {
          return y(d.METRIC) + 25
        })
        .attr("x", d => x(0) + 255)
        .attr("height", y.bandwidth())
        .html(d => {
          if (
            parseFloat(
              (d.PERCENT_COMPLETE_30_DAYS_DIFF /
                d.PERCENT_COMPLETE_30_DAYS_PRIOR) *
                100
            ).toFixed(1) == 0.0
          ) {
            return `<tspan class="highlight-data">0%</tspan>  ${translations['percent-change-previous-month']}`;
          } else {
            return `<tspan class="highlight-data">${(d.PERCENT_COMPLETE_30_DAYS_PRIOR != 0) ? parseFloat(
              (d.PERCENT_COMPLETE_30_DAYS_DIFF) *
                100
            ).toFixed(1) : "0"}%</tspan> ${translations['percent-change-previous-month']}`;
          }
        })
        .attr('text-anchor', 'end');
    });

  svg.append("g").call(yAxis);

  //arrows
  svg
    .append("g")
    .attr("class", "more-than-labels")
    .selectAll(".more-than-labels")
    .data(data)
    .join(enter => {
      enter
        .append("svg")
        .attr("y", d => y(d.METRIC) + 15)
        .attr("x", d => x(0))
        .html(d => {
          if (
            parseFloat(
              (d.PERCENT_COMPLETE_30_DAYS_DIFF /
                d.PERCENT_COMPLETE_30_DAYS_PRIOR) *
                100
            ) > 0
          ) {
            return `<svg width="15" height="10" viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M17 0.581819V5.19326C17 5.50954 16.742 5.77116 16.4271 5.77116C16.1122 5.77116 15.8543 5.51344 15.8543 5.19326V2.00308L10.1901 7.93042C10.0839 8.03975 9.93972 8.09832 9.78419 8.09832C9.63244 8.09832 9.48828 8.03975 9.37826 7.93042L6.11944 4.64647L0.971201 9.8321C0.86118 9.94143 0.720802 10 0.565271 10C0.413518 10 0.26936 9.94143 0.15934 9.8321C0.0531121 9.72667 0 9.59001 0 9.43381C0 9.22295 0.0872582 9.09018 0.15934 9.01601L5.70966 3.42434C5.81968 3.315 5.96006 3.25643 6.11559 3.25643C6.26734 3.25643 6.4115 3.315 6.52152 3.42434L9.78035 6.70829L15.0158 1.1558H11.8403C11.5254 1.1558 11.2674 0.898078 11.2674 0.5779C11.2674 0.26162 11.5254 0 11.8403 0H16.4233C16.742 0.00390471 17 0.261621 17 0.581819H17Z" fill="#003D9D"/>
  </svg>`;
          } else if (
            parseFloat(
              (d.perc_total_diff_30_day_prev /
                d.PERCENT_COMPLETE_30_DAYS_PRIOR) *
                100
            ).toFixed(1) == 0
          ) {
            return `<svg width="15" height=10 viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M17 9.41818V4.80674C17 4.49046 16.742 4.22884 16.4271 4.22884C16.1122 4.22884 15.8543 4.48656 15.8543 4.80674V7.99692L10.1901 2.06958C10.0839 1.96025 9.93972 1.90168 9.78419 1.90168C9.63244 1.90168 9.48828 1.96025 9.37826 2.06958L6.11944 5.35353L0.971201 0.167904C0.86118 0.0585697 0.720802 0 0.565271 0C0.413518 0 0.26936 0.0585717 0.15934 0.167904C0.0531121 0.273332 0 0.409992 0 0.566192C0 0.777052 0.0872582 0.909822 0.15934 0.983993L5.70966 6.57566C5.81968 6.685 5.96006 6.74357 6.11559 6.74357C6.26734 6.74357 6.4115 6.685 6.52152 6.57566L9.78035 3.29171L15.0158 8.8442H11.8403C11.5254 8.8442 11.2674 9.10192 11.2674 9.4221C11.2674 9.73838 11.5254 10 11.8403 10H16.4233C16.742 9.9961 17 9.73838 17 9.41818H17Z" fill="none"/>
  </svg>`;
          } else {
            return `<svg width="15" height=10 viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M17 9.41818V4.80674C17 4.49046 16.742 4.22884 16.4271 4.22884C16.1122 4.22884 15.8543 4.48656 15.8543 4.80674V7.99692L10.1901 2.06958C10.0839 1.96025 9.93972 1.90168 9.78419 1.90168C9.63244 1.90168 9.48828 1.96025 9.37826 2.06958L6.11944 5.35353L0.971201 0.167904C0.86118 0.0585697 0.720802 0 0.565271 0C0.413518 0 0.26936 0.0585717 0.15934 0.167904C0.0531121 0.273332 0 0.409992 0 0.566192C0 0.777052 0.0872582 0.909822 0.15934 0.983993L5.70966 6.57566C5.81968 6.685 5.96006 6.74357 6.11559 6.74357C6.26734 6.74357 6.4115 6.685 6.52152 6.57566L9.78035 3.29171L15.0158 8.8442H11.8403C11.5254 8.8442 11.2674 9.10192 11.2674 9.4221C11.2674 9.73838 11.5254 10 11.8403 10H16.4233C16.742 9.9961 17 9.73838 17 9.41818H17Z" fill="#FF8000"/>
  </svg>`;
          }
        });
    });

  //% reported labels
  svg
    .append("g")
    .attr("class", "change-from-month-labels")
    .selectAll(".change-from-month-labels")
    .data(data)
    .join(enter => {
      enter
        .append("text")
        .attr("y", d => y(d.METRIC) - 12)
        .attr("x", d => x(1))
        .attr("height", y.bandwidth())
        .html(
          (d) => {
            let notMissing = parseFloat(d.NOT_MISSING * 100).toFixed(1);
            let missing = parseFloat(d.MISSING * 100).toFixed(1);
            return `<tspan class="highlight-data">${notMissing}%</tspan> ${translations['reported']} (<tspan class="highlight-data">${missing}%</tspan> ${translations['missing']})`
        })
        .attr('text-anchor', 'end');
    });

  //legend
  svg
    .append("rect")
    .attr("x", 0)
    .attr("y", -20)
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", "#92C5DE");
  svg
    .append("rect")
    .attr("x", 115)
    .attr("y", -20)
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", "#FFCF44");

  svg
    .append("text")
    .attr("x", 20)
    .attr("y", -12)
    .style("font-family", "arial")
    .style("font-size", "12px")
    .attr("dy", "0.35em")
    .text(translations['data-reported']);
  svg
    .append("text")
    .attr("x", 135)
    .attr("y", -12)
    .style("font-family", "arial")
    .style("font-size", "12px")
    .attr("dy", "0.35em")
    .text(translations['data-missing']);
}
