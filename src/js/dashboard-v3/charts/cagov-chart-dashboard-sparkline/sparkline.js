// generic histogram chart, as used on top of state dashboard

function writeLine(svg, data, x, y, { root_id='barid', is_second_line=false, crop_floor=true }) {
    let max_y_domain = y.domain()[1];
    let max_x_domain = x.domain()[1];
    let component = this;
  
    let groups = svg.append("g")
      .attr("class","fg-line "+root_id+(is_second_line?" second-line":""))
      // .attr('style','fill:none; stroke:#555555; stroke-width: 2.0px;'+(is_second_line? 'opacity:0.5;' : ''))
      .append('path')
      .datum(data)
        .attr("d", d3.line()
          .x(function(d,i) { return x(i) })
          .y(function(d) { return y(crop_floor? Math.max(0,d.VALUE) : d.VALUE) })
          );
}
  
function writeBars(svg, data, x, y, { root_id='barid', crop_floor=true }) {
    if (!crop_floor) {
      console.log("NOT CROP FLOOR");
    }
    let groups = svg.append("g")
      .attr("class","fg-bars "+root_id)
      // .attr('style','fill:#deeaf6;')
      .selectAll("g")
      .data(data)
      .enter()
        .append("g");
    
    if (crop_floor) { // positive only
      groups
          .append("rect")
          .attr("x", (d,i) => x(i))
          .attr("y", d => y(d.VALUE))
          .attr("width", 2)
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
  
  
function writePendingBlock(svg, data, x, y,
  { pending_date=null,
    root_id='barid'} ) {
    let xgroup = svg.append("g")
      .attr("class",'pending-block');

    const max_x_domain = x.domain()[1];
    const min_y_domain = y.domain()[0];
    const max_y_domain = y.domain()[1];
    let nbr_pending = 0;
    for (let i = 0; i < data.length; ++i) {
      nbr_pending += 1
      if (data[i].DATE == pending_date) {
        break;
      }
    }
    // console.log("PENDING_DATE",pending_date);
    // console.log("Pending",nbr_pending);

    xgroup.append('rect')
      // .attr('style','fill:black;opacity:0.05;')
      .attr("x",x(nbr_pending))
      .attr("y",y(max_y_domain))
      .attr("width",x(0) - x(nbr_pending))
      .attr("height",y(min_y_domain)-y(max_y_domain));
}
  
 
// Convert 
function getDataIndexByX(data, xScale, yScale, bardata, yLine, linedata, xy)
{
  let x = xy[0];
  let y = xy[1];
  let xdi = xScale.invert(x);
  if (xdi >= 0 && xdi <= xScale.domain()[1] ) {
    let ydi = yScale.invert(y);
    if (ydi >= 0 && ydi <= yScale.domain()[1] ) {
      let idi = Math.round(xdi);
      let yp = yScale(bardata[idi].VALUE);
      if (y >= yp-2) {
        return idi;
      }
      let yp2 = yLine(linedata[idi].VALUE);
      let yd = Math.abs(yp2-y);
      if (yd < 6) {
        return idi;
      }
    }
  }
  return null;
}
  
/**
 * This function produces a tick-division (similar to d3.scale.ticks()[1]) which optimizes for about 5 grid lines 
 * (as opposed to D3's 10) with pretty divisions.
 * @param {*} ascale 
 * @returns 
 */
function getAxisDiv(ascale,{hint='num'}) {
  // return ascale.ticks()[1];
  const max_y = ascale.domain()[1];
  const log_y = Math.log10(max_y);
  const floor_log_y = Math.floor(log_y);
  const best_10 = Math.pow(10, floor_log_y);
  const log_diff = (log_y - floor_log_y);
  if (log_diff < 0.176)     var optimal_div = 5; // 150/100
  else if (log_diff < 0.477) var optimal_div = 2; // 300/100
  else if (log_diff < 0.778) var optimal_div = 1; // 600/100
  else                       var optimal_div = 0.5;
  // const optimal_divs = [5,2,1,1/2][bucket];
  let result = best_10/optimal_div;
  if (hint == 'integer' && result < 1) {
    result = 1;
  }
  return result;
}
  
function drawLineLegend(svg, line_legend, line_data, xline, yline) {
  if (line_legend != null) {
    let lsi = Math.floor(line_data.length*2/3);
    let lsample = line_data[lsi];
    let x1 = this.dimensions.width/3;
    let y1 = this.dimensions.height/4;
    let x2 = xline(lsi);
    let y2 = yline(lsample.VALUE);
    let margin = 6;
    // shorten line on each end by margin
    let ang = Math.atan2(y2-y1,x2-x1);
    x1 += Math.cos(ang)*margin;
    y1 += Math.sin(ang)*margin;
    x2 += Math.cos(ang+Math.PI)*margin;
    y2 += Math.sin(ang+Math.PI)*margin;
    let g = this.svg.append('g')
      .attr('class','line-legend');
    g.append('text')
      .text(line_legend)
      .attr("x",this.dimensions.width/3)
      .attr("y",this.dimensions.height/4);
    g.append('line')
      .attr('x1',x1)
      .attr('y1',y1)
      .attr('x2',x2)
      .attr('y2',y2);
  }
}
  
 
export default function renderChart({
  extras_func = null,
  time_series_bars = null,
  time_series_line = null,
  time_series_state_line = null,
  line_date_offset = 0,
  left_y_fmt = 'num',
  right_y_fmt = 'num',
  crop_floor = true,
  pending_date = null,
  month_modulo = 3,
  root_id = "barid" } )  {

  console.log("renderChart",root_id);
  // d3.select(this.querySelector("svg g"))
  //   .attr('style','font-family:sans-serif;font-size:16px;');

  this.svg = d3
    .select(this.querySelector(".svg-holder"))
    .append("svg");

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

    // console.log("bar range", root_id, min_y_domain, max_y_domain);
    this.ybars = d3
      .scaleLinear()
      .domain([min_y_domain, max_y_domain]).nice()  // d3.max(data, d => d.METRIC_VALUE)]).nice()
      .range([this.dimensions.height - this.dimensions.margin.bottom, this.dimensions.margin.top]);
  
  }
  if (time_series_line) {
    // console.log("time_series_line",time_series_line,root_id);
    const LINE_OFFSET_X = line_date_offset;
    this.xline = d3
    .scaleLinear()
    .domain([LINE_OFFSET_X+0,LINE_OFFSET_X+time_series_line.length-1])
    .range([
        // reversed because data presents as reverse-chrono
        this.dimensions.width - this.dimensions.margin.right, 
        this.dimensions.margin.left]);
    // console.log("time_series_line 2",time_series_line,root_id);
    let min_y_domain = crop_floor? 0 : d3.min(time_series_line, d=> d.VALUE);
    if (min_y_domain > 0)
      min_y_domain = 0;
    let max_y_domain = d3.max(time_series_line, d=> d.VALUE);
    if (max_y_domain == 0) {
      max_y_domain = 1;
    }
    // console.log("line range", root_id, min_y_domain, max_y_domain);
    if (time_series_state_line) {
      max_y_domain = Math.max(max_y_domain, d3.max(time_series_state_line, d=> d.VALUE));
    }
  }


  // let max_xdomain = d3.max(data, (d) => d3.max(d, (d) => d.METRIC_VALUE));

  if (time_series_bars) {
    writeBars.call(this, this.svg, time_series_bars, this.xbars, this.ybars, 
      { root_id:root_id, crop_floot:crop_floor});
    // bar legend on left
  }
  if (time_series_line) {
    writeLine.call(this, this.svg, time_series_line, this.xline, this.ybars, 
      { root_id:root_id, crop_floot:crop_floor});
  }

  if (extras_func) {
    extras_func.call(this, this.svg);
  }



}
