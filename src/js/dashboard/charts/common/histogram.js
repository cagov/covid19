// generic histogram chart, as used on top of state dashboard

function writeLine(svg, data, x, y, { root_id='barid', is_second_line=false, crop_floor=true }) {
  let max_y_domain = y.domain()[1];
  let max_x_domain = x.domain()[1];
  let component = this;

  let groups = svg.append("g")
    .attr("class","fg-line "+root_id+(is_second_line?" second-line":""))
    .attr("id",'line-'+root_id)
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
      .attr("id",'bars-'+root_id)
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
    pending_legend=null,
    root_id='barid'} ) {
    let xgroup = svg.append("g")
      .attr("class",'pending-block')
      .attr("id",'pending-block-'+root_id);

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
    xgroup.append('text')
      // .attr('style','font-family:sans-serif; fill:black; font-weight:300; font-size: 0.8rem; text-anchor: end; dominant-baseline:auto;')
      .text(pending_legend)
      .attr("x",x(0))
      .attr("y",y(max_y_domain)-4);
}

function writeCountyStateLegend(svg,x,y, {
  county_legend = 'County',
  state_legend = 'State',
  root_id='barid'
})
{
  let y_pos = this.dimensions.height - 6;
  let x_pos = this.dimensions.margin.left;


  let g = svg.append("g")
    .attr("class","county-legend")
    .attr("id",'county-legend-'+root_id)
    .attr("aria-flowto",'left-axis-'+root_id)
    ;

  g.append('rect')
    // .attr('style','fill:black;')
    .attr('x',x_pos)
    .attr('y',y_pos)
    .attr('width',24)
    .attr('height',1);

  g.append('text')
    .text(county_legend)
    // .attr('style','font-family:sans-serif; fill:black;font-weight:300; font-size: 0.75rem;text-anchor: left;dominant-baseline:middle;');
    .attr("x",x_pos + 36)
    .attr("y",y_pos);

  g = svg.append("g")
    .attr("class","state-legend")
    .attr("id",'state-legend-'+root_id)
    .attr("aria-flowto",'left-axis-'+root_id)
    ;

  g.append('rect')
    // .attr('style','fill:gray;')
    .attr('x',x_pos+85)
    .attr('y',y_pos)
    .attr('width',24)
    .attr('height',1);

  g.append('text')
    .text(state_legend)
    // .attr('style','font-family:sans-serif; fill:black;font-weight:300; font-size: 0.75rem;text-anchor: left;dominant-baseline:middle;');
    .attr("x",x_pos+85 + 36)
    .attr("y",y_pos);
}


function writeDateAxis(svg, data, x, y, 
  { x_axis_legend=null,
    month_modulo=3,
    root_id='barid'} ) {
  const tick_height = 4;
  const tick_upper_gap = 1;
  const tick_lower_gap = 2;
  const axisY = this.dimensions.height - this.dimensions.margin.bottom;

  let xgroup = svg.append("g")
      .attr("class",'date-axis')
      .attr("id",'date-axis-'+root_id)
      .attr("aria-flowto",'pending-block-'+root_id)
      ;
      // .attr('style','stroke-width: 0.5px; stroke:black;');

  data.forEach((d,i) => {
    const ymd = d.DATE.split('-');
    const mon_idx = parseInt(ymd[1]);
    if (mon_idx % month_modulo == 0) {
      const day_idx = parseInt(ymd[2]);
      if (day_idx == 1) {
        const date_caption = mon_idx+'/1'; // ?? localize
        let subg = xgroup.append("g")
              .attr('class','x-tick');
        subg.append('line')
        .attr('x1', x(i))
        .attr('y1', axisY+tick_upper_gap)
        .attr('x2', x(i))
        .attr('y2',axisY+tick_upper_gap+tick_height);
        subg.append('text')
         .text(date_caption)
         // .attr('style','font-family:sans-serif; font-weight:300; font-size: 0.75rem; fill:black;text-anchor: middle; dominant-baseline:hanging;')
         .attr("x", x(i))
         .attr("y", axisY+tick_upper_gap+tick_height+tick_lower_gap) // +this.getYOffset(i)
      }
    }
  });
  if (x_axis_legend) {
    xgroup.append('text')
    .attr('class','x-axis-legend')
    .attr('style','font-family:sans-serif; font-weight:300; font-size: 0.75rem; fill:black;text-anchor: end; dominant-baseline:middle;')
    .text(x_axis_legend)
    .attr("x", x(0))
    .attr("y", this.dimensions.height-6) // +this.getYOffset(i)
  }
}

// Formatter Factory
// supported formats: num/number, pct, integer
function getFormatter(max_v,{hint='num',digits=0})
{
  if (hint == 'pct') {
    const digits = max_v < .01? 2 : max_v < .1? 1 : 0;
    const fmtr = new Intl.NumberFormat(
        "us",  { style: "percent", minimumFractionDigits: digits, maximumFractionDigits: digits }    );
        return fmtr.format;
  } else {
    // assume num/number
    if (max_v < 4000) {
      const digits = (hint == 'integer')? 0 : max_v < .3? 2 : max_v < 10? 1 : 0;
      const fmtr = new Intl.NumberFormat( "us", { style: "decimal", minimumFractionDigits: digits, maximumFractionDigits: digits } );
      return fmtr.format;
    } else if (max_v < 1000000) {
      const digits = max_v < 4000? 1 : 0;
      const fmtr = new Intl.NumberFormat( "us", { style: "decimal", minimumFractionDigits: digits, maximumFractionDigits: digits } );
      return function(v) {
        return fmtr.format(v/1000)+"K";
      };
    } else if (max_v < 1000000000) {
      const digits = max_v < 4000000? 1 : 0;
      const fmtr = new Intl.NumberFormat( "us", { style: "decimal", minimumFractionDigits: digits, maximumFractionDigits: digits } );
      return function(v) {
        return fmtr.format(v/1000000)+"M";
      };
      
    } else {
      const digits = max_v < 4000000000? 1 : 0;
      const fmtr = new Intl.NumberFormat( "us", { style: "decimal", minimumFractionDigits: digits, maximumFractionDigits: digits } );
      return function(v) {
        return fmtr.format(v/1000)+"M";
      };
    }
  }
}

function writeLeftYAxis(svg, data, x, y, 
                        { y_axis_legend=null,
                          left_y_fmt='num',
                          root_id='barid' }) {
  const y_div = getAxisDiv(y,{'hint':left_y_fmt});
  let ygroup = svg.append("g")
      .attr("class",'left-y-axis')
      .attr("id",'left-axis-'+root_id)
      .attr("aria-flowto",'right-axis-'+root_id)
      ;

  const max_y_domain = y.domain()[1];
  const min_x_domain = x.domain()[0];
  const max_x_domain = x.domain()[1];
  // console.log("Left Axis",max_y_domain, root_id, left_y_fmt);
  const tick_left_gap = 10;
  let myFormatter = getFormatter(max_y_domain, { hint:left_y_fmt });
  for (let yi = 0; yi <= max_y_domain; yi += y_div) {
    let y_caption = myFormatter(yi);
    let subg = ygroup.append("g")
      .attr('class','y-tick');

    subg.append('line')
      .attr('style','stroke-width: 0.5px; stroke:black; opacity:0.15;')
      .attr('x1', x(max_x_domain))
      .attr('y1', y(yi))
      .attr('x2', x(min_x_domain))
      .attr('y2', y(yi));

    subg.append('text')
      .text(y_caption)
      .attr('style','font-family:sans-serif; font-weight:400; font-size: 0.75rem; fill:black;text-anchor: end; dominant-baseline:middle;')
      .attr("x", x(max_x_domain)-tick_left_gap)
      .attr("y", y(yi)) // +this.getYOffset(i)
  }
  if (y_axis_legend) {
    ygroup.append('text')
    .attr('class','left-y-axis-legend')
    .attr('style','font-family:sans-serif; font-weight:700; font-size: 0.75rem; fill:black;text-anchor: start; dominant-baseline:hanging;')
    .text(y_axis_legend)
    .attr("x", 0)
    .attr("y", 4) // +this.getYOffset(i)
  }
}

function writeRightYAxis(svg, data, x, y, 
                        { y_axis_legend=null,
                          right_y_fmt='num',
                          root_id='barid' }) {
  const y_div = getAxisDiv(y,{'hint':right_y_fmt});
  let ygroup = svg.append("g")
      .attr("class",'right-y-axis')
      .attr("id",'right-axis-'+root_id)
      .attr("aria-flowto",'date-axis-'+root_id)
      .attr('style','stroke-width: 0.5px; stroke:#608cbd;');



  const max_y_domain = y.domain()[1];
  const min_x_domain = x.domain()[0];
  const tick_left_gap = 10;
  const tick_right_gap = 24;

  // console.log("Drawing Right Axis  max_y_domain",max_y_domain,root_id);
  let myFormatter = getFormatter(max_y_domain, { hint:right_y_fmt });

  for (let yi = 0; yi <= max_y_domain; yi += y_div) {
    let y_caption = myFormatter(yi);

    let subg = ygroup.append("g")
      .attr('class','y-tick');

    // subg.append('line')
    //   .attr('x1', x(min_x_domain)+tick_left_gap)
    //   .attr('y1', y(yi))
    //   .attr('x2', x(min_x_domain)+tick_right_gap)
    //   .attr('y2', y(yi));

    subg.append('text')
      .text(y_caption)
      .attr('style','font-family:sans-serif; font-weight:400; font-size: 0.75rem; fill:#1f2574; text-anchor:start; dominant-baseline:middle; ')
      .attr("x", x(min_x_domain)+tick_right_gap)
      .attr("y", y(yi)) // +this.getYOffset(i)
  }
  if (y_axis_legend) {
    ygroup.append('text')
    .attr('class','right-y-axis-legend')
    .text(y_axis_legend)
    .attr('style','font-family:sans-serif; font-weight:700; font-size: 0.75rem; fill:#1f2574; text-anchor:end; dominant-baseline:hanging; ')
    .attr("x", this.dimensions.width)
    .attr("y", 4) // +this.getYOffset(i)
  }
}

/** saved for future reference 
function writeDownloadButton({root_id='untitled'}) {
  const xmlns = "http://www.w3.org/2000/xmlns/";
  const xlinkns = "http://www.w3.org/1999/xlink";
  const svgns = "http://www.w3.org/2000/svg";

  function serialize(svg) {
    svg = svg.cloneNode(true);   
    const fragment = window.location.href + "#";
    const walker = document.createTreeWalker(svg, NodeFilter.SHOW_ELEMENT);
    while (walker.nextNode()) {
      for (const attr of walker.currentNode.attributes) {
        if (attr.value.includes(fragment)) {
          attr.value = attr.value.replace(fragment, "#");
        }
      }
    }
    svg.setAttributeNS(xmlns, "xmlns", svgns);
    svg.setAttributeNS(xmlns, "xmlns:xlink", xlinkns);
    const serializer = new window.XMLSerializer;
    const string = serializer.serializeToString(svg);
    return new Blob([string] , {type: "image/svg+xml"});
  };

  let svgNode = d3.select(this.chartOptions.chartName+" svg").node();
  d3.select(this.chartOptions.chartName + " a.dl-button")
    .attr('download',root_id+".svg")
    .attr('href',URL.createObjectURL(serialize(svgNode)));
}
*/

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

function showTooltip(event, dataIndex, xy, dIndex, dRecord, xscale, yscale)
{
  let tooltip = this.tooltip;
  let content = this.getTooltipContent(dataIndex); 
  tooltip.html(content);
  // console.log("X",event.offsetX);
  tooltip.style("left",`${Math.min(this.dimensions.width-280,event.offsetX)}px`);
  // console.log("Tool top L, O, y",event.layerY, event.offsetY, event.y);
  // tooltip.style("top",`${event.layerY+60}px`)
  tooltip.style("top",`${(event.offsetY+220)}px`);
  // d3.select(this).transition();
  tooltip.style("visibility", "visible");
  // console.log("TOOLTIP",content,this.tooltip);

  this.svg.selectAll('g.tt-marker').remove();
  this.svg
    .append('g')
    .attr('class','tt-marker')
    .append('rect')
    .attr("x",xscale(dIndex)-1)
    .attr("y",yscale(dRecord.VALUE))
    .attr("width",3)
    .attr("height",Math.max(0,yscale(0)-yscale(dRecord.VALUE)));
}

function hideTooltip()
{
  let tooltip = this.tooltip;
  // d3.select(this).transition().duration(200);
  this.tooltip.style("visibility", "hidden");
  this.svg.selectAll('g.tt-marker').remove();
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

function drawLineLegend(svg, line_legend, line_data, xline, yline, { root_id='barid' }) {
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
      .attr('class','line-legend')
      .attr('id', 'line-legend-'+root_id)
      .attr('aria-flowto', 'left-axis-'+root_id);

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

/**
 * Render categories.
 * @param {*} extrasFunc @TODO what are the inputs?
 */

 export default function renderChart({
    extras_func = null,
    time_series_bars = null,
    time_series_line = null,
    time_series_state_line = null,
    line_date_offset = 0,
    left_y_fmt = 'num',
    right_y_fmt = 'num',
    left_y_axis_legend = null,
    right_y_axis_legend = null,
    line_legend = null,
    x_axis_legend = null,
    crop_floor = true,
    pending_date = null,
    pending_legend = null,
    month_modulo = 3,
    lineAndBarsSameScale = false,
    alignAverages = false,
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
      let scale_series = lineAndBarsSameScale? time_series_bars : time_series_line;

      let min_y_domain = crop_floor? 0 : d3.min(scale_series, d=> d.VALUE);
      if (min_y_domain > 0)
        min_y_domain = 0;
      let max_y_domain = d3.max(scale_series, d=> d.VALUE);
      if (max_y_domain == 0) {
        max_y_domain = 1;
      }
      // console.log("line range", root_id, min_y_domain, max_y_domain);
      if (alignAverages) {
        const avgBars = d3.mean(time_series_bars, d=> d.VALUE);
        const avgLines = d3.mean(scale_series, d=> d.VALUE);
        const scale = avgLines / avgBars;
        max_y_domain = this.ybars.domain()[1] * scale;
        console.log("Aligning averages scale=",scale,avgLines,avgBars,max_y_domain);
        this.yline = d3
          .scaleLinear()
          .domain([0, max_y_domain])  // d3.max(data, d => d.METRIC_VALUE)]).nice()
          .range([this.dimensions.height - this.dimensions.margin.bottom, this.dimensions.margin.top]);
      } else {
        if (time_series_state_line && !lineAndBarsSameScale) {
          max_y_domain = Math.max(max_y_domain, d3.max(time_series_state_line, d=> d.VALUE));
        }
        // console.log("max_y_domain", max_y_domain);
        this.yline = d3
          .scaleLinear()
          .domain([min_y_domain, max_y_domain]).nice()  // d3.max(data, d => d.METRIC_VALUE)]).nice()
          .range([this.dimensions.height - this.dimensions.margin.bottom, this.dimensions.margin.top]);
      }
    }


    // let max_xdomain = d3.max(data, (d) => d3.max(d, (d) => d.METRIC_VALUE));

    if (time_series_bars) {
      writeBars.call(this, this.svg, time_series_bars, this.xbars, this.ybars, 
        { root_id:root_id, crop_floot:crop_floor});
      // bar legend on left
    }
    if (time_series_line) {
      writeLine.call(this, this.svg, time_series_line, this.xline, this.yline, 
        { line_legend:line_legend, root_id:root_id, crop_floot:crop_floor});
      if (line_legend != null) {
          drawLineLegend.call(this, this.svg, line_legend, time_series_line, this.xline, this.yline, {root_id:root_id});
      }
    }
    if (time_series_state_line) {
      writeLine.call(this, this.svg, time_series_state_line, this.xline, this.yline, 
        { root_id:'state-'+root_id, is_second_line:true, crop_floot:crop_floor});
      writeCountyStateLegend.call(this, this.svg, this.xline, this.yline, {root_id:root_id});
    }

    if (pending_date && pending_legend) {
      writePendingBlock.call(this, this.svg, time_series_bars, this.xbars, this.ybars, 
            { root_id:root_id, pending_date:pending_date, pending_legend:pending_legend});
    }

    if (time_series_bars) {
      writeDateAxis.call(this, this.svg, time_series_bars, this.xbars, this.ybars,
          {x_axis_legend:x_axis_legend, month_modulo: month_modulo, root_id:root_id} );
    } else if (time_series_line) {
      writeDateAxis.call(this, this.svg, time_series_line, this.xline, this.yline,
        {x_axis_legend:x_axis_legend, month_modulo: month_modulo, root_id:root_id} );
    }
    // Write Y Axis, favoring line on left, bars on right
    if (time_series_line) {
      writeLeftYAxis.call(this, this.svg, time_series_line, this.xline, this.yline,
         {y_axis_legend: left_y_axis_legend, left_y_fmt:left_y_fmt, root_id:root_id});
      if (time_series_bars) {
        if (right_y_axis_legend) {
          writeRightYAxis.call(this, this.svg, time_series_bars, this.xbars, this.ybars, 
              { y_axis_legend: right_y_axis_legend, right_y_fmt:right_y_fmt, root_id:root_id});
        }
      }
    } else if (time_series_bars) {
      writeLeftYAxis.call(this, this.svg, time_series_bars, this.xbars, this.ybars, 
          { y_axis_legend: left_y_axis_legend, left_y_fmt:left_y_fmt, root_id:root_id});
    }

    // writeLegend.call(this, this.svg, data, this.xbars, this.y, baselineData);

    if (extras_func) {
      extras_func.call(this, this.svg);
    }

    // writeDownloadButton.call(this,{root_id:root_id});

    this.svg
    .on("mousemove focus", (event) => {
      let xy = d3.pointer(event);
      let dIndex = getDataIndexByX(time_series_bars, this.xbars, this.ybars, time_series_bars, this.yline, time_series_line, xy);
      if (dIndex != null) {
        showTooltip.call(this, event, dIndex, xy, dIndex, time_series_bars[dIndex], this.xbars, this.ybars);
      } else {
        hideTooltip.call(this);
      }
    })
    .on("mouseleave touchend blur", (event) => {
      hideTooltip.call(this);
    });


  }

