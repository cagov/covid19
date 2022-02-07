// Generic histogram chart, as used on top of state dashboard

/**
 * Write Line element
 * @param {*} svg     the svg
 * @param {*} data    the data
 * @param {*} x       the x scale
 * @param {*} y       the y scale
 * @param {*} options  rendering options 
 */
function writeLine(svg, data, x, y, { root_id='barid', is_second_line=false, crop_floor=true,chart_options=null }) {
    let max_y_domain = y.domain()[1];
    let max_x_domain = x.domain()[1];
    let component = this;
  
    let groups = svg.append("g")
      .attr("class","fg-line "+root_id+(is_second_line?" second-line":""))
      .attr('fill',"none")
      .attr('stroke',chart_options.line_color)
      .attr('stroke-width',chart_options.stroke_width)
      .attr('stroke-linecap','round')
      // .attr('style','fill:none; stroke:#555555; stroke-width: 2.0px;'+(is_second_line? 'opacity:0.5;' : ''))
      .append('path')
      .datum(data)
        .attr("d", d3.line()
          .x(function(d,i) { return x(i) })
          .y(function(d) { return y(crop_floor? Math.max(0,d.VALUE) : d.VALUE) })
          );
}

/**
 * Write Region element (same as line, but fills the area underneath)
 * @param {*} svg     the svg
 * @param {*} data    the data
 * @param {*} x       the x scale
 * @param {*} y       the y scale
 * @param {*} options  rendering options 
 */
function writeRegion(svg, data, x, y, { root_id='barid', is_second_line=false, crop_floor=true, chart_options=null }) {
  let max_y_domain = y.domain()[1];
  let max_x_domain = x.domain()[1];
  let component = this;

  let groups = svg.append("g")
    .attr("class","fg-region")
    // .attr('style','fill:none; stroke:#555555; stroke-width: 2.0px;'+(is_second_line? 'opacity:0.5;' : ''))
    .attr('stroke',"none")
    .append('path')
    .datum(data)
      .attr("class","area")
      .attr("d", d3.area()
        .x(function(d,i) { return x(i) })
        .y0(y(0))
        .y1(function(d) { return y(crop_floor? Math.max(0,d.VALUE) : d.VALUE) })
      );
      
}

/**
 * Write bars
 * @param {*} svg     the svg
 * @param {*} data    the data
 * @param {*} x       the x scale
 * @param {*} y       the y scale
 * @param {*} options  rendering options 
 */
function writeBars(svg, data, x, y, { root_id='barid', crop_floor=true,chart_style="normal", chart_options=null }) {
  let bar_width = chart_style=="solid"? 4 : 2;
    if (!crop_floor) {
      console.log("NOT CROP FLOOR");
    }
    let groups = svg.append("g")
      .attr("class","fg-bars "+root_id)
      .attr('fill',chart_options.bar_color)
      .attr('stroke',"none")
      // .attr('style','fill:#deeaf6;')
      .selectAll("g")
      .data(data)
      .enter()
        .append("g")
        ;
    
    if (crop_floor) { // positive only
      groups
          .append("rect")
          .attr("x", (d,i) => x(i)-bar_width/2)
          .attr("y", d => y(d.VALUE))
          .attr("width", bar_width)
          .attr("height", d => Math.max(y(0) - y(d.VALUE),0))
          .attr("id", (d, i) => root_id+'-'+i);
    } else { // positive and negative rects
      groups
          .append("rect")
          .attr("x", (d,i) => x(i))
          .attr("y", d => Math.min(y(0),y(d.VALUE)))
          .attr("width", 2)
          .attr("height", d => Math.abs(y(0) - y(d.VALUE)))
          .attr("id", (d, i) => root_id+'-'+i);
    }
}
  
/**
 * Chart renderer
 * Accepts a dictionary containing rendering options
 */
export default function renderChart({
  chart_style = "normal",
  extras_func = null,
  time_series_bars = null,
  time_series_line = null,
  time_series_state_line = null,
  line_date_offset = 0,
  crop_floor = true,
  published_date = "YYYY-MM-DD",
  render_date = "YYYY-MM-DD",
  first_date = "YYYY-MM-DD",
  last_date = "YYYY-MM-DD",
  root_id = "barid",
  chart_options = {bar_color:'#FF0000',line_color:'#00FF00',stroke_width:10},
 } )  
{

  this.svg = d3
    .select(this.querySelector(".svg-holder"))
    .append("svg");
  
  const meta = {
    DATA_PUBLISHED_DATE:published_date, 
    RENDER_DATE: render_date,
    FIRST_DATE: first_date,
    LAST_DATE: last_date
  };

  this.svg.attr("meta",JSON.stringify(meta))
          .attr('xmlns','http://www.w3.org/2000/svg');

  // this.svg.selectAll("g").remove();
  this.svg
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

  if (time_series_bars) {
    this.xbars = d3
    .scaleLinear()
    .domain([0,time_series_bars.length-1])
    .range([
        // reversed because data presents as reverse-chrono
        this.dimensions.width - this.dimensions.margin.right, 
        this.dimensions.margin.left]);
    let min_y_domain = crop_floor? 0 : d3.min(time_series_bars, d=> d.VALUE);
    if (min_y_domain > 0)
      min_y_domain = 0;
    let max_y_domain = d3.max(time_series_bars, d=> d.VALUE);
    if (max_y_domain == 0) {
      max_y_domain = 1;
    }

    this.ybars = d3
      .scaleLinear()
      .domain([min_y_domain, max_y_domain]).nice() 
      .range([this.dimensions.height - this.dimensions.margin.bottom, this.dimensions.margin.top]);
  
  }
  if (time_series_line) {
    const LINE_OFFSET_X = line_date_offset;
    this.xline = d3
    .scaleLinear()
    .domain([LINE_OFFSET_X+0,LINE_OFFSET_X+time_series_line.length-1])
    .range([
        // reversed because data presents as reverse-chrono
        this.dimensions.width - this.dimensions.margin.right, 
        this.dimensions.margin.left]);
    let min_y_domain = crop_floor? 0 : d3.min(time_series_line, d=> d.VALUE);
    if (min_y_domain > 0)
      min_y_domain = 0;
    let max_y_domain = d3.max(time_series_line, d=> d.VALUE);
    if (max_y_domain == 0) {
      max_y_domain = 1;
    }
    if (time_series_state_line) {
      max_y_domain = Math.max(max_y_domain, d3.max(time_series_state_line, d=> d.VALUE));
    }
  }

  if (time_series_bars && chart_style != "no-bars" && chart_style != "solid-region") {
    writeBars.call(this, this.svg, time_series_bars, this.xbars, this.ybars, 
      { root_id:root_id, crop_floot:crop_floor, chart_style:chart_style, chart_options:chart_options});
  }
  if (time_series_line) {
    if (chart_style == "solid-region") {
      writeRegion.call(this, this.svg, time_series_line, this.xline, this.ybars, 
        { root_id:root_id, crop_floot:crop_floor, chart_options:chart_options});
    }

    writeLine.call(this, this.svg, time_series_line, this.xline, this.ybars, 
      { root_id:root_id, crop_floot:crop_floor, chart_options:chart_options});
  }

  if (extras_func) {
    extras_func.call(this, this.svg);
  }

}
