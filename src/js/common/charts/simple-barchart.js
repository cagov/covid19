/**
 * Primary chart rendering function
 * @param {object} svg 
 * @param {object} data 
 * @param {number} x 
 * @param {number} y 
 */
function writeLegend(svg, data, x, y, baselineData) {
    // Build legend.
    const legendText = this.getLegendText();
    if (legendText.length == 0) {
      return;
    }
    const legendW = y.bandwidth()*1.2;
    const legendY =  this.dimensions.margin.top/2;
    const legend2X = this.dimensions.width/2;

    let group = svg.append("g");


    group
      .append("rect")
        .attr("fill", "#92C5DE")
        .attr("class", "legend-block")
        .attr("y", legendY)
        .attr("x", 0)
        .attr("width", legendW)
        .attr("height", legendW);

    group
      .append("text")
      .text(legendText[0]) // Legend label 
      .attr("class", "legend-caption")
      .attr("y", legendY+legendW/2.0 + 1)
      .attr("x", legendW*2)
      .attr('dominant-baseline','middle')
      .attr('text-anchor','start');

    // Baseline indicator
    if (baselineData && legendText.length > 1) {
      group
        .append("rect")
        .attr("fill", "#1f2574")
        .attr("y", legendY-y.bandwidth()/2)
        .attr("x", legend2X)
        .attr("width", d => 4)
        .attr("height", y.bandwidth()*2)

      group
        .append("text")
        .text(legendText[1])
        .attr("class", "legend-caption")
        .attr("y", legendY+legendW/2.0)
        .attr("x", legend2X+15)
        .attr('dominant-baseline','middle')
        .attr('text-anchor','start');
    }
}

/**
 * Build data bars
 * @param {object} svg 
 * @param {object} data 
 * @param {number} x 
 * @param {number} y 
 */
function writeBars(svg, data, x, y, baselineData, tooltip, rootID='barid') {
    let max_x_domain = x.domain()[1];
    let component = this;

    // console.log("Write bars data=",data);

    let groups = svg.append("g")
      .selectAll("g")
      .data(data)
      .enter()
        .append("g");

    // light bg bar
    groups
        .append("rect")
        .attr("class","bg-bar")
        .attr("fill", "#f2f5fc")
        .attr("y", (d, i) => y(d.CATEGORY))
        .attr("x", d => x(0))
        .attr("width", d => x(max_x_domain))
        .attr("height", y.bandwidth());
    
    // dark bg bar
    groups
        .append("rect")
        .attr("class","fg-bar")
        .attr("fill", "#92C5DE")
        .attr("y", (d, i) => y(d.CATEGORY))
        .attr("x", d => x(0))
        .attr("width", d => x(d.METRIC_VALUE))
        .attr("height", y.bandwidth())
        .attr("id", (d, i) => rootID+'-'+i);

    // transparent hot bar (different if tooltip)
    groups
        .append("rect")
        .attr("class","hot-bar")
        .attr("fill", "#00ff00")
        .attr("fill-opacity",0)
        .attr("y", (d, i) => y(d.CATEGORY))
        .attr("x", d => x(0))
        .attr("width", d => x(max_x_domain))
        .attr("height", y.bandwidth())
        .attr("tabindex", "0")
        .attr("aria-label", (d, i) => `${this.ariaLabel(d, baselineData)}`)
        .on("mouseover focus", function(event, d, i) {
          d3.select(this.parentNode).select('.fg-bar')
          .transition().duration(200)
          .style("fill", "#003D9D");
          if (tooltip) {
              // set appropriate tooltip text, reveal tooltip at correct location
              tooltip.html(component.getTooltip(d,baselineData))
              tooltip.style("left",'20px');
              // console.log("Tool top L, O, y",event.layerY, event.offsetY, event.y);
              // tooltip.style("top",`${event.layerY+60}px`)
              tooltip.style("top",`${event.offsetY+120}px`)
              tooltip.style("visibility", "visible");
          }
        })
        .on("mouseout blur", function(d) {
          d3.select(this.parentNode).select('.fg-bar')
            .transition().duration(200)
            .style("fill", "#92C5DE");
          if (tooltip) {
            d3.select(this).transition();
            tooltip.style("visibility", "hidden");
          }
        });
    


    // Baseline indicator
    if (baselineData) {
    groups
        .append("rect")
        .attr("fill", "#1f2574")
        .attr("y", (d, i) => y(d.CATEGORY)-y.bandwidth()/2)
        .attr("x", (d,i) => x(baselineData[i].METRIC_VALUE)-2)
        .attr("width", d => 4)
        .attr("height", y.bandwidth()*2);
    }

    // Bar Label
    groups
      .append("text")
      .attr("class", "bar-label")
      .attr("y", (d, i) => y(d.CATEGORY) + (y.bandwidth() / 2))
      .attr("x", d => x(max_x_domain)+12)
      // .attr("width", x.bandwidth() / 4)
      .text(d => this.pctFormatter.format(d.METRIC_VALUE))
      // .html(d => {
      //   return `<tspan dx="1.5em">${this.pctFormatter.format(d.METRIC_VALUE)}</tspan>`
      // })
      .attr('dominant-baseline','middle')
      .attr('text-anchor','start')

    // Bar Category
    groups
      .append("text")
      .attr("class", "bar-cat")
      .attr("y", (d, i) => y(d.CATEGORY)-8) // +this.getYOffset(i)
      .attr("x", d => x(0))
      .text(d => d.CATEGORY)
      // .attr("width", x.bandwidth() / 4)
      // .html(d => {
      // return `<tspan dx="0em" dy="-0.5em">${d.CATEGORY}</tspan>`
      // })
      .attr('text-anchor','start')
}

/**
 * Render categories.
 * @param {*} extrasFunc @TODO what are the inputs?
 */

 export default function renderChart(extrasFunc = null, baselineData = null, tooltip = null, rootID='barid') {
    // Exclude Other & Unknown categories from displaying for this chart.
    let data = this.alldata;
    // this statement produces an array of strings in IE11 and an array of numbers in modern browsers
    let categories = data.map((group) => group.CATEGORY);

    // Dynamically adjust chart height based on available bars
    this.dimensions.height = this.dimensions.margin.top + 60 * categories.length;
    // console.log("New height",this.chartBreakpointValues.height);

    d3.select(this.querySelector("svg"))
      .attr("viewBox", [
      0,
      0,
      this.dimensions.width,
      this.dimensions.height,
    ]);


    // let categories = d3.map(data, function(d){return(d.CATEGORY)}).keys();

    // Filter and sort here...
    // console.log("Categories",categories);
    // Y position of bars.
    this.y = d3
    .scaleBand()
    .domain(categories)
    .range([
        this.dimensions.margin.top,
        this.dimensions.height - (this.dimensions.margin.bottom),
    ])
    .paddingInner(5.0/6.0)
    .paddingOuter(0.5);

    // console.log("this.y",this.y);
  
    // Position for labels.
    // this.yAxis = (g) =>
    //   g
    //     .attr("class", "bar-label")
    //     .attr("transform", "translate(5," + -32 + ")")
    //     .call(d3.axisLeft(this.y).tickSize(0))
    //     .call((g) => g.selectAll(".domain").remove());
       

    // let max_xdomain = d3.max(data, (d) => d3.max(d, (d) => d.METRIC_VALUE));
    this.max_x_domain = 
    this.x = d3
      .scaleLinear()
      .domain([0, 1])  // d3.max(data, d => d.METRIC_VALUE)]).nice()
      .range([this.dimensions.margin.left, this.dimensions.width - (this.dimensions.margin.left+this.dimensions.margin.right)]);

    this.svg.selectAll("g").remove();

    writeBars.call(this, this.svg, data, this.x, this.y, baselineData, tooltip, rootID);
    writeLegend.call(this, this.svg, data, this.x, this.y, baselineData);

    if (extrasFunc) {
      extrasFunc.call(this, this.svg, data, this.x, this.y);
    }

        // Write remaining stuff...
    // this.classList.remove('d-none')
  }

