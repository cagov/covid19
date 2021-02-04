function writeLegend(svg, data, x, y) {
    const legendW = y.bandwidth()*1.2;
    const legendY =  this.dimensions.margin.top/2;
    const legendText = this.getLegendText();

    svg.append("g")
      .attr("fill", "#92C5DE")
      .attr("class", "legend-block")
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
        .attr("y", legendY)
        .attr("x", 0)
        .attr("width", legendW)
        .attr("height", legendW);

    svg.append("g")
      .append("text")
      .text(legendText)
      .attr("class", "legend-caption")
      .attr("y", legendY+legendW/2.0)
      .attr("x", legendW*2)
      .attr('dominant-baseline','middle')
      .attr('text-anchor','start');
  }

  function writeBarCats(svg, data, x, y) {
    svg.append("g")
    .attr("class", "bar-cat-group")
    .selectAll(".bar-cat")
    .data(data)
    .join(
      enter => {
        enter
          .append("text")
          .attr("class", "bar-label")
          .attr("y", (d, i) => y(i))
          .attr("x", d => x(0))
          // .attr("width", x.bandwidth() / 4)
          .html(d => {
            return `<tspan dx="0em" dy="-0.5em">${d.CATEGORY}</tspan>`
          })
          .attr('text-anchor','start')
      }
    )
  }

  function writeBarValues(svg, data, x, y) {
    let max_x_domain = x.domain()[1];
    svg.append("g")
    .attr("class", "bar-label-group")
    .selectAll(".bar-label")
    .data(data)
    .join(
      enter => {
        enter
          .append("text")
          .attr("class", "bar-label")
          .attr("y", (d, i) => y(i) + (y.bandwidth() / 2))
          .attr("x", d => x(max_x_domain))
          // .attr("width", x.bandwidth() / 4)
          .html(d => {
            return `<tspan dx="1.5em">${this.intFormatter.format(d.METRIC_VALUE)}</tspan>`
          })
          .attr('dominant-baseline','middle')
          .attr('text-anchor','start')
      }
    )
  }

  function writeBars(svg, data, x, y) {
    let max_x_domain = x.domain()[1];
    svg.append("g")
      .attr("fill", "#f2f5fc")
      .attr('class','barshere')
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
        .attr("y", (d, i) => y(i))
        .attr("x", d => x(0))
        .attr("width", d => x(max_x_domain))
        .attr("height", y.bandwidth());
    svg.append("g")
      .attr("fill", "#92C5DE")
      .attr('class','barshere')
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
        .attr("y", (d, i) => y(i))
        .attr("x", d => x(0))
        .attr("width", d => x(d.METRIC_VALUE))
        .attr("height", y.bandwidth())
        .attr("id", (d, i) => "barid-"+i)
        .attr("tabindex", "0")
        .attr("aria-label", (d, i) => `${this.ariaLabel(d)}`)
        .on("mouseover focus", function(event, d, i) {
          d3.select(this).style("fill", "#003D9D");
          // problem the svg is not the width in px in page as the viewbox width
        })
        .on("mouseout blur", function(d) {
          d3.select(this).style("fill", "#92C5DE");
          // if (tooltip !== null) { // @TODO Q: why is tooltip coming null
          //   tooltip.style.visibility = "hidden";
          // }
        });
  }

  function rerenderChart() {
}

export default function renderChart() {
    console.log("Calling render");

    // Exclude Other & Unknown categories from displaying for this chart.
    let data = this.alldata;

    // Filter and sort here...
  
    // Get list of groups (?)
    console.log("Data",data);

    console.log("Dimensions",this.dimensions);

    // Y position of bars.
    this.y = d3
    .scaleBand()
    .domain(d3.range(data.length))
    .range([
        this.dimensions.margin.top,
        this.dimensions.height - (this.dimensions.margin.bottom),
    ])
    .paddingInner(5.0/6.0)
    .paddingOuter(0.5);
  
    // Position for labels.
    this.yAxis = (g) =>
      g
        .attr("class", "bar-label")
        .attr("transform", "translate(5," + -32 + ")")
        .call(d3.axisLeft(this.y).tickSize(0))
        .call((g) => g.selectAll(".domain").remove());
       

    // let max_xdomain = d3.max(data, (d) => d3.max(d, (d) => d.METRIC_VALUE));
    this.max_x_domain = 
    this.x = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.METRIC_VALUE)]).nice()
      .range([this.dimensions.margin.left, this.dimensions.width - (this.dimensions.margin.left+this.dimensions.margin.right)]);

    // ?
    this.xAxis = (g) =>
      g
        .attr("transform", "translate(0," + this.dimensions.width + ")")
        .call(d3.axisBottom(this.x).ticks(width / 50, "s"))
        .remove();
    writeBars.call(this, this.svg, data, this.x, this.y);
    writeBarCats.call(this, this.svg, data, this.x, this.y);
    writeBarValues.call(this, this.svg, data, this.x, this.y);
    writeLegend.call(this, this.svg, data, this.x, this.y);

        // Write remaining stuff...
    this.classList.remove('d-none')

    console.log("Chart Height", this.dimensions.height - (this.dimensions.margin.bottom+this.dimensions.margin.top));
    console.log("Y Domain", data.length);
  }

