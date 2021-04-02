// generic histogram chart, as used on top of state dashboard

function writeLine(svg, data, x, y, { root_id='barid' }) {
  let max_y_domain = y.domain()[1];
  let max_x_domain = x.domain()[1];
  let component = this;

  let groups = svg.append("g")
    .attr("class","fg-line")
    .append('path')
    .datum(data)
      .attr("d", d3.line()
        .x(function(d,i) { return x(i) })
        .y(function(d) { return y(d.VALUE) })
        );
}

 function writeBars(svg, data, x, y, { root_id='barid' }) {
    let groups = svg.append("g")
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
        .attr("id", (d, i) => root_id+'-'+i);
}


function writePendingBlock(svg, data, x, y,
  { pending_date=null,
    pending_legend=null,
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
      .attr("x",x(nbr_pending))
      .attr("y",y(max_y_domain))
      .attr("width",x(0) - x(nbr_pending))
      .attr("height",y(min_y_domain)-y(max_y_domain));
    xgroup.append('text')
      .text(pending_legend)
      .attr("x",x(0))
      .attr("y",y(max_y_domain)-4);
}

function writeDateAxis(svg, data, x, y, 
  { x_axis_legend=null,
    month_modulo=3,
    root_id='barid'} ) {
  const tick_height = 4;
  const tick_upper_gap = 1;
  const tick_lower_gap = 2;
  let xgroup = svg.append("g")
      .attr("class",'date-axis');

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
        .attr('y1', y(0)+tick_upper_gap)
        .attr('x2', x(i))
        .attr('y2',y(0)+tick_upper_gap+tick_height);
        subg.append('text')
         .text(date_caption)
         .attr("x", x(i))
         .attr("y", y(0)+tick_upper_gap+tick_height+tick_lower_gap) // +this.getYOffset(i)
      }
    }
  });
  if (x_axis_legend) {
    xgroup.append('text')
    .attr('class','x-axis-legend')
    .text(x_axis_legend)
    .attr("x", this.dimensions.width)
    .attr("y", this.dimensions.height-4) // +this.getYOffset(i)
  }
}

// Formatter Factory
function getFormatter(max_v,{hint='num',digits=0})
{
  if (hint == 'pct') {
    const digits = max_v < .01? 2 : max_v < .1? 1 : 0;
    const fmtr = new Intl.NumberFormat(
        "us",  { style: "percent", minimumFractionDigits: digits, maximumFractionDigits: digits }    );
        return fmtr.format;
  } else {
    // assume num
    if (max_v < 1000) {
      const digits = max_v < .1? 2 : max_v < 10? 1 : 0;
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
                        { y_div=20, 
                          y_axis_legend=null,
                          left_y_fmt='num',
                          root_id='barid' }) {
  let ygroup = svg.append("g")
      .attr("class",'left-y-axis');
  const max_y_domain = y.domain()[1];
  const min_x_domain = x.domain()[0];
  const max_x_domain = x.domain()[1];
  // console.log("Left Axis",max_y_domain, root_id, left_y_fmt);
  const tick_left_gap = 10;
  let myFormatter = getFormatter(max_y_domain, { hint:left_y_fmt });
  for (let yi = 0; yi < max_y_domain; yi += y_div) {
    let y_caption = myFormatter(yi);
    let subg = ygroup.append("g")
      .attr('class','y-tick');

    subg.append('line')
      .attr('x1', x(max_x_domain))
      .attr('y1', y(yi))
      .attr('x2', x(min_x_domain))
      .attr('y2', y(yi));

    subg.append('text')
      .text(y_caption)
      .attr("x", x(max_x_domain)-tick_left_gap)
      .attr("y", y(yi)) // +this.getYOffset(i)
  }
  if (y_axis_legend) {
    ygroup.append('text')
    .attr('class','left-y-axis-legend')
    .text(y_axis_legend)
    .attr("x", 0)
    .attr("y", 0) // +this.getYOffset(i)
  }
}

function writeRightYAxis(svg, data, x, y, 
                        { y_div=20, 
                          y_axis_legend=null,
                          right_y_fmt='num',
                          root_id='barid' }) {
  let ygroup = svg.append("g")
      .attr("class",'right-y-axis');
  const max_y_domain = y.domain()[1];
  const min_x_domain = x.domain()[0];
  const tick_left_gap = 10;
  const tick_right_gap = 24;

  // console.log("Drawing Right Axis  max_y_domain",max_y_domain,root_id);
  let myFormatter = getFormatter(max_y_domain, { hint:right_y_fmt });

  for (let yi = 0; yi < max_y_domain; yi += y_div) {
    let y_caption = myFormatter(yi);

    let subg = ygroup.append("g")
      .attr('class','y-tick');

    subg.append('line')
      .attr('x1', x(min_x_domain)+tick_left_gap)
      .attr('y1', y(yi))
      .attr('x2', x(min_x_domain)+tick_right_gap)
      .attr('y2', y(yi));

    subg.append('text')
      .text(y_caption)
      .attr("x", x(min_x_domain)+tick_right_gap)
      .attr("y", y(yi)) // +this.getYOffset(i)
  }
  if (y_axis_legend) {
    ygroup.append('text')
    .attr('class','right-y-axis-legend')
    .text(y_axis_legend)
    .attr("x", this.dimensions.width)
    .attr("y", 0) // +this.getYOffset(i)
  }
}

// Convert 
function getDataIndexByX(data, xScale, xy)
{
  let x = xy[0];
  let xdi = xScale.invert(x);
  if (xdi >= 0 && xdi <= xScale.domain()[1] ) {
    return Math.round(xdi);
  }
  return null;
}

/**
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
          */


function showTooltip(dataIndex, xy, dIndex, dRecord, xscale, yscale)
{
  let tooltip = this.tooltip;
  let content = this.getTooltipContent(dataIndex); 
  tooltip.html(content);
  tooltip.style("left",'20px');
  // console.log("Tool top L, O, y",event.layerY, event.offsetY, event.y);
  // tooltip.style("top",`${event.layerY+60}px`)
  tooltip.style("top",`${(this.dimensions.height+100)}px`);
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
    .attr("height",yscale(0)-yscale(dRecord.VALUE));
}

function hideTooltip()
{
  let tooltip = this.tooltip;
  // d3.select(this).transition().duration(200);
  this.tooltip.style("visibility", "hidden");
  this.svg.selectAll('g.tt-marker').remove();
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
    left_y_div = 1000,
    left_y_fmt = 'num',
    right_y_div = 0,
    right_y_fmt = 'num',
    left_y_axis_legend = null,
    right_y_axis_legend = null,
    line_legend = null,
    x_axis_legend = null,
    pending_date = null,
    pending_legend = null,
    month_modulo = 3,
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
    // console.log("Render Chart",time_series_key_bars, time_series_key_line, root_id);

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
      writeBars.call(this, this.svg, chartData.time_series[time_series_key_bars], this.xbars, this.ybars, 
        { root_id:root_id});
      // bar legend on left
    }
    if (time_series_key_line) {
      writeLine.call(this, this.svg, chartData.time_series[time_series_key_line], this.xline, this.yline, 
        { line_legend:line_legend, root_id:root_id});
      // line legend on right or left, depending on whether bar is provided
    }

    if (pending_date && pending_legend) {
      writePendingBlock.call(this, this.svg, chartData.time_series[time_series_key_bars], this.xbars, this.ybars, 
            { root_id:root_id, pending_date:pending_date, pending_legend:pending_legend});
    }

    if (time_series_key_bars) {
      writeDateAxis.call(this, this.svg, chartData.time_series[time_series_key_bars], this.xbars, this.ybars,
          {x_axis_legend:x_axis_legend, month_modulo: month_modulo, root_id:root_id} );
    } else if (time_series_key_line) {
      writeDateAxis.call(this, this.svg, chartData.time_series[time_series_key_line], this.xline, this.yline,
        {x_axis_legend:x_axis_legend, month_modulo: month_modulo, root_id:root_id} );
    }
    // Write Y Axis, favoring line on left, bars on right
    if (time_series_key_line) {
      writeLeftYAxis.call(this, this.svg, chartData.time_series[time_series_key_line], this.xline, this.yline,
         {y_div:left_y_div, y_axis_legend: left_y_axis_legend, left_y_fmt:left_y_fmt, root_id:root_id});
      if (time_series_key_bars) {
        if (right_y_div) {
          writeRightYAxis.call(this, this.svg, chartData.time_series[time_series_key_bars], this.xbars, this.ybars, 
              {y_div:right_y_div, y_axis_legend: right_y_axis_legend, right_y_fmt:right_y_fmt, root_id:root_id});
        }
      }
    } else if (time_series_key_bars) {
      writeLeftYAxis.call(this, this.svg, chartData.time_series[time_series_key_bars], this.xbars, this.ybars, 
          { y_div:left_y_div, y_axis_legend: left_y_axis_legend, left_y_fmt:left_y_fmt, root_id:root_id});
    }

    // writeLegend.call(this, this.svg, data, this.xbars, this.y, baselineData);

    if (extras_func) {
      extras_func.call(this, this.svg, chartData);
    }

    this.svg
    .on("mousemove focus", (event) => {
      let xy = d3.pointer(event);
      let dIndex = getDataIndexByX(chartData.time_series[time_series_key_bars], this.xbars, xy);
      if (dIndex != null) {
        showTooltip.call(this, dIndex, xy, dIndex, chartData.time_series[time_series_key_bars][dIndex], this.xbars, this.ybars);
      }
    })
    .on("mouseleave touchend blur", (event) => {
      hideTooltip.call(this);
    });


  }

