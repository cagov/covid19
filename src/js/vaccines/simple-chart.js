/**
 * Primary chart rendering function
 * @param {object} svg 
 * @param {object} data 
 * @param {number} x 
 * @param {number} y 
 */
function writeLegend(svg, data, x, y) {
    // Build legend.
    const legendW = y.bandwidth()*1.2;
    const legendY =  this.dimensions.margin.top/2;
    const legendText = this.getLegendText();
    const legend2X = this.dimensions.width/3;

    let group = svg.append("g")

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
      .attr("y", legendY+legendW/2.0)
      .attr("x", legendW*2)
      .attr('dominant-baseline','middle')
      .attr('text-anchor','start');

    // Baseline indicator
    // group
    //   .append("rect")
    //   .attr("fill", "#1f2574")
    //   .attr("y", legendY-y.bandwidth()/2)
    //   .attr("x", legend2X)
    //   .attr("width", d => 4)
    //   .attr("height", y.bandwidth()*2)

    // group
    //   .append("text")
    //   .text(legendText[1])
    //   .attr("class", "legend-caption")
    //   .attr("y", legendY+legendW/2.0)
    //   .attr("x", legend2X+15)
    //   .attr('dominant-baseline','middle')
    //   .attr('text-anchor','start');
}

/**
 * Build data bars
 * @param {object} svg 
 * @param {object} data 
 * @param {number} x 
 * @param {number} y 
 */
function writeBars(svg, data, x, y) {
    let max_x_domain = x.domain()[1];

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
        .attr("y", (d, i) => y(i)+this.getYOffset(i))
        .attr("x", d => x(0))
        .attr("width", d => x(max_x_domain))
        .attr("height", y.bandwidth());
    
    // dark bg bar
    groups
        .append("rect")
        .attr("class","fg-bar")
        .attr("fill", "#92C5DE")
        .attr("y", (d, i) => y(i)+this.getYOffset(i))
        .attr("x", d => x(0))
        .attr("width", d => x(d.METRIC_VALUE))
        .attr("height", y.bandwidth())
        .attr("id", (d, i) => "barid-"+i);

    // transparent hot bar
    groups
        .append("rect")
        .attr("class","hot-bar")
        .attr("fill", "#00ff00")
        .attr("fill-opacity",0)
        .attr("y", (d, i) => y(i)+this.getYOffset(i))
        .attr("x", d => x(0))
        .attr("width", d => x(max_x_domain))
        .attr("height", y.bandwidth())
        .attr("tabindex", "0")
        .attr("aria-label", (d, i) => `${this.ariaLabel(d)}`)
        .on("mouseover focus", function(event, d, i) {
          d3.select(this.parentNode).select('.fg-bar')
          .transition().duration(200)
          .style("fill", "#003D9D");
          // problem the svg is not the width in px in page as the viewbox width
        })
        .on("mouseout blur", function(d) {
          d3.select(this.parentNode).select('.fg-bar')
          .transition().duration(200)
          .style("fill", "#92C5DE");
          // if (tooltip !== null) { // @TODO Q: why is tooltip coming null
          //   tooltip.style.visibility = "hidden";
          // }
        });

    // Baseline indicator
    // groups
    //     .append("rect")
    //     .attr("fill", "#1f2574")
    //     .attr("y", (d, i) => y(i)-y.bandwidth()/2)
    //     .attr("x", d => x(d.BASELINE_VALUE)-2)
    //     .attr("width", d => 4)
    //     .attr("height", y.bandwidth()*2)

    // Bar Label
    groups
      .append("text")
      .attr("class", "bar-label")
      .attr("y", (d, i) => y(i)+this.getYOffset(i) + (y.bandwidth() / 2))
      .attr("x", d => x(max_x_domain))
      // .attr("width", x.bandwidth() / 4)
      .html(d => {
        return `<tspan dx="1.5em">${this.pctFormatter.format(d.METRIC_VALUE)}</tspan>`
      })
      .attr('dominant-baseline','middle')
      .attr('text-anchor','start')

    // Bar Category
    groups
      .append("text")
      .attr("class", "bar-cat")
      .attr("y", (d, i) => y(i)+this.getYOffset(i))
      .attr("x", d => x(0))
      // .attr("width", x.bandwidth() / 4)
      .html(d => {
      return `<tspan dx="0em" dy="-0.5em">${d.CATEGORY}</tspan>`
      })
      .attr('text-anchor','start')
}

/**
 * Render categories.
 * @param {*} extrasFunc @TODO what are the inputs?
 */
export default function renderChart(extrasFunc = null) {
    // Exclude Other & Unknown categories from displaying for this chart.
    let data = this.alldata;
    let categories = d3.map(data, function(d){return(d.CATEGORY)}).keys()

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

    writeBars.call(this, this.svg, data, this.x, this.y);
    writeLegend.call(this, this.svg, data, this.x, this.y);

    if (extrasFunc) {
      extrasFunc.call(this, this.svg, data, this.x, this.y);
    }

        // Write remaining stuff...
    // this.classList.remove('d-none')
  }

