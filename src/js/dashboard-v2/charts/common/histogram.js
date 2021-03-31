// generic histogram chart, as used on top of state dashboard

/**
 * Primary chart rendering function
 * @param {object} svg 
 * @param {object} data 
 * @param {number} x 
 * @param {number} y 
 */
 function writeLegend(svg, data, x, y) {
    // Build legend.
    // const legendText = this.getLegendText();
    // if (legendText.length == 0) {
    //   return;
    // }
    // const legendW = y.bandwidth()*1.2;
    // const legendY =  this.dimensions.margin.top/2;
    // const legend2X = this.dimensions.width/2;

    // let group = svg.append("g");


    // group
    //   .append("rect")
    //     .attr("fill", "#92C5DE")
    //     .attr("class", "legend-block")
    //     .attr("y", legendY)
    //     .attr("x", 0)
    //     .attr("width", legendW)
    //     .attr("height", legendW);

    // group
    //   .append("text")
    //   .text(legendText[0]) // Legend label 
    //   .attr("class", "legend-caption")
    //   .attr("y", legendY+legendW/2.0 + 1)
    //   .attr("x", legendW*2)
    //   .attr('dominant-baseline','middle')
    //   .attr('text-anchor','start');

    // // Baseline indicator
    // if (baselineData && legendText.length > 1) {
    //   group
    //     .append("rect")
    //     .attr("fill", "#1f2574")
    //     .attr("y", legendY-y.bandwidth()/2)
    //     .attr("x", legend2X)
    //     .attr("width", d => 4)
    //     .attr("height", y.bandwidth()*2)

    //   group
    //     .append("text")
    //     .text(legendText[1])
    //     .attr("class", "legend-caption")
    //     .attr("y", legendY+legendW/2.0)
    //     .attr("x", legend2X+15)
    //     .attr('dominant-baseline','middle')
    //     .attr('text-anchor','start');
    // }
}

function writeLine(svg, data, x, y, rootID='barid') {
  let max_y_domain = y.domain()[1];
  let max_x_domain = x.domain()[1];
  let component = this;

  // console.log("Write bars data=",data);
  // console.log("First Data",data[0]);
  // console.log("x(0)",x(0));
  // console.log("x(max)",x(max_x_domain-1));
  // console.log("y(0)",y(0));
  // console.log("y(max)",y(max_y_domain-1));

      // svg.append("path")
      // .datum(data)
      // .attr("fill", "none")
      // .attr("stroke", "steelblue")
      // .attr("stroke-width", 1.5)
      // .attr("d", d3.line()
      //   .x(function(d) { return x(d.date) })
      //   .y(function(d) { return y(d.value) })
      //   )


  let groups = svg.append("g")
    .attr('style','fill:#000000;stroke:')
    .attr("class","fg-bars")
    .append('path')
    .attr("fill","none")
    .attr("stroke", "black")
    .attr("stroke-width", 1.5)
    .datum(data)
      .attr("d", d3.line()
        .x(function(d,i) { return x(i) })
        .y(function(d) { return y(d.VALUE) })
        );
}

/**
 * Build data bars
 * @param {object} svg 
 * @param {object} data 
 * @param {number} x 
 * @param {number} y 
 */
function writeBars(svg, data, x, y, rootID='barid') {
    let max_y_domain = y.domain()[1];
    let max_x_domain = x.domain()[1];
    let component = this;

    // console.log("Write bars data=",data);
    // console.log("First Data",data[0]);
    // console.log("x(0)",x(0));
    // console.log("x(max)",x(max_x_domain-1));
    // console.log("y(0)",y(0));
    // console.log("y(max)",y(max_y_domain-1));



    let groups = svg.append("g")
      .attr('style','fill:#deeaf6')
      .attr("class","fg-bars")
      .selectAll("g")
      .data(data)
      .enter()
        .append("g");
    

    groups
        .append("rect")
        .attr("x", (d,i) => x(i))
        .attr("y", d => y(d.VALUE))
        .attr("width", 2)
        .attr("height", d => (y(0) - y(d.VALUE)))
        .attr("id", (d, i) => rootID+'-'+i);
    
    // // transparent hot bar (different if tooltip)
    // groups
    //     .append("rect")
    //     .attr("class","hot-bar")
    //     .attr("fill", "#00ff00")
    //     .attr("fill-opacity",0)
    //     .attr("y", (d, i) => y(d.CATEGORY))
    //     .attr("x", d => x(0))
    //     .attr("width", d => x(max_x_domain))
    //     .attr("height", y.bandwidth())
    //     .attr("tabindex", "0")
    //     .attr("aria-label", (d, i) => `${this.ariaLabel(d, baselineData)}`)
    //     .on("mouseover focus", function(event, d, i) {
    //       d3.select(this.parentNode).select('.fg-bar')
    //       .transition().duration(200)
    //       .style("fill", "#003D9D");
    //       if (tooltip) {
    //           // set appropriate tooltip text, reveal tooltip at correct location
    //           tooltip.html(component.getTooltip(d,baselineData))
    //           tooltip.style("left",'20px');
    //           // console.log("Tool top L, O, y",event.layerY, event.offsetY, event.y);
    //           // tooltip.style("top",`${event.layerY+60}px`)
    //           tooltip.style("top",`${event.offsetY+120}px`)
    //           tooltip.style("visibility", "visible");
    //       }
    //     })
    //     .on("mouseout blur", function(d) {
    //       d3.select(this.parentNode).select('.fg-bar')
    //         .transition().duration(200)
    //         .style("fill", "#92C5DE");
    //       if (tooltip) {
    //         d3.select(this).transition();
    //         tooltip.style("visibility", "hidden");
    //       }
    //     });
    

    // // Baseline indicator
    // if (baselineData) {
    // groups
    //     .append("rect")
    //     .attr("fill", "#1f2574")
    //     .attr("y", (d, i) => y(d.CATEGORY)-y.bandwidth()/2)
    //     .attr("x", (d,i) => x(baselineData[i].METRIC_VALUE)-2)
    //     .attr("width", d => 4)
    //     .attr("height", y.bandwidth()*2);
    // }

    // // Bar Label
    // groups
    //   .append("text")
    //   .attr("class", "bar-label")
    //   .attr("y", (d, i) => y(d.CATEGORY) + (y.bandwidth() / 2))
    //   .attr("x", d => x(max_x_domain)+12)
    //   // .attr("width", x.bandwidth() / 4)
    //   .text(d => this.pctFormatter.format(d.METRIC_VALUE))
    //   // .html(d => {
    //   //   return `<tspan dx="1.5em">${this.pctFormatter.format(d.METRIC_VALUE)}</tspan>`
    //   // })
    //   .attr('dominant-baseline','middle')
    //   .attr('text-anchor','start')

    // // Bar Category
    // groups
    //   .append("text")
    //   .attr("class", "bar-cat")
    //   .attr("y", (d, i) => y(d.CATEGORY)-8) // +this.getYOffset(i)
    //   .attr("x", d => x(0))
    //   .text(d => d.CATEGORY)
    //   // .attr("width", x.bandwidth() / 4)
    //   // .html(d => {
    //   // return `<tspan dx="0em" dy="-0.5em">${d.CATEGORY}</tspan>`
    //   // })
    //   .attr('text-anchor','start')
}

/**
 * Render categories.
 * @param {*} extrasFunc @TODO what are the inputs?
 */

 export default function renderChart(chartData, {
    tooltip_func = null,
    extras_func = null,
    time_series_key_bars = null,
    time_series_key_line = null,
    line_date_offset = 0,
    root_id = "barid" } )  {
    // // this statement produces an array of strings in IE11 and an array of numbers in modern browsers
    // let categories = data.map((group) => group.CATEGORY);

    // // Dynamically adjust chart height based on available bars
    // this.dimensions.height = this.dimensions.margin.top + 60 * categories.length;
    // // console.log("New height",this.chartBreakpointValues.height);

    d3.select(this.querySelector("svg"))
      .attr("viewBox", [
      0,
      0,
      this.dimensions.width,
      this.dimensions.height,
    ]);
    console.log("Render Chart",time_series_key_bars, time_series_key_line, root_id);

    // Filter and sort here...
    // console.log("Categories",categories);
    // Y position of bars.
    // console.log("max_x_domain", chartData.time_series[time_series_key].length);
    if (time_series_key_bars) {
      this.xbars = d3
      .scaleLinear()
      .domain([0,chartData.time_series[time_series_key_bars].length-1])
      .range([
          // reversed because data presents as reverse-chrono
          this.dimensions.width - this.dimensions.margin.right, 
          this.dimensions.margin.left]);
      let max_y_domain = d3.max(chartData.time_series[time_series_key_bars], d=> d.VALUE);
      // console.log("max_y_domain", max_y_domain);
      this.ybars = d3
        .scaleLinear()
        .domain([0, max_y_domain])  // d3.max(data, d => d.METRIC_VALUE)]).nice()
        .range([this.dimensions.height - this.dimensions.margin.bottom, this.dimensions.margin.top]);
   
    }
    if (time_series_key_line) {


      const LINE_OFFSET_X = line_date_offset;
      this.xline = d3
      .scaleLinear()
      .domain([LINE_OFFSET_X+0,LINE_OFFSET_X+chartData.time_series[time_series_key_line].length-1])
      .range([
          // reversed because data presents as reverse-chrono
          this.dimensions.width - this.dimensions.margin.right, 
          this.dimensions.margin.left]);
      let max_y_domain = d3.max(chartData.time_series[time_series_key_line], d=> d.VALUE);
      // console.log("max_y_domain", max_y_domain);
      this.yline = d3
        .scaleLinear()
        .domain([0, max_y_domain])  // d3.max(data, d => d.METRIC_VALUE)]).nice()
        .range([this.dimensions.height - this.dimensions.margin.bottom, this.dimensions.margin.top]);
      }

    // console.log("this.y",this.y);
  
    // Position for labels.
    // this.yAxis = (g) =>
    //   g
    //     .attr("class", "bar-label")
    //     .attr("transform", "translate(5," + -32 + ")")
    //     .call(d3.axisLeft(this.y).tickSize(0))
    //     .call((g) => g.selectAll(".domain").remove());
       

    // let max_xdomain = d3.max(data, (d) => d3.max(d, (d) => d.METRIC_VALUE));
    this.svg.selectAll("g").remove();

    if (time_series_key_bars) {
      writeBars.call(this, this.svg, chartData.time_series[time_series_key_bars], this.xbars, this.ybars, root_id);
      // bar legend on left
    }
    if (time_series_key_line) {
      writeLine.call(this, this.svg, chartData.time_series[time_series_key_line], this.xline, this.yline, root_id);
      // line legend on right or left, depending on whether bar is provided
    }

    // writeLegend.call(this, this.svg, data, this.xbars, this.y, baselineData);

    if (extras_func) {
      extras_func.call(this, this.svg, chartData);
    }
  }

