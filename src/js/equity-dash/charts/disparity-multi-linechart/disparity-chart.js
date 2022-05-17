// disparity multi-line chart for equity page

import { parseSnowflakeDate} from "../../../common/readable-date.js";

function writeLine(svg, data, fld, x, y, { root_id='barid', line_id='line_s0',line_idx=1, color='black', crop_floor=true,chart_options=null }) {
  let groups = svg.append("g")
    .attr("class","vc-fg-line "+root_id+" "+line_id)
    .attr("stroke",color)
    .attr("stroke-width",chart_options.stroke_width+"px")
    .attr("stroke-linecap","round")
    .attr("stroke-linejoin","round")
    .attr("fill","none");
  // if (line_id == "line_s3") {
  //   groups.attr("stroke-dasharray","1 3");
  // }

  let nbr_zeros = 0;
  let nbr_tail_zeros = 0;
  if (chart_options['skip_zeros']) {
    for (let i = 0; i < data.length && data[i][fld] == 0; ++i) {
      nbr_zeros += 1;
    }
  }
  const dataslice = data.slice(nbr_zeros, data.length - nbr_tail_zeros);

  groups.append('path')
    .datum(dataslice)
      .attr("d", d3.line()
        .x(function(d,i) { return x(i+nbr_zeros) })
        .y(function(d) { return y(crop_floor? Math.max(0,d[fld]) : d[fld]) })
        );
}

// Date Axis
function writeXAxis(svg, data, date_fld, x, y, 
  { root_id='barid', unit='days'} ) {
  // console.log("writeXAxis A");
  const tick_height = 4;
  const tick_upper_gap = 1;
  const tick_lower_gap = 12;
  const axisY = this.dimensions.height - this.dimensions.margin.bottom;

  let xgroup = svg.append("g")
      .attr("class",'date-axis')
      .attr('style','stroke-width: 0.5px; stroke:black;');

  // console.log("writeXAxis B",data);
  const show_days = true;
  data.forEach((d,i) => {
    const ymd = d[date_fld].split('-');
    const year_idx = parseInt(ymd[0]);
    const mon_idx = parseInt(ymd[1]);
    const day_idx = parseInt(ymd[2]);
    if ((unit == 'days' && day_idx == 1) || 
        (unit == 'weeks' && (day_idx <= 7 || data.length < 12))) {
      let subj = xgroup.append("g")
        .append('line')
        .attr('style','stroke-width: 1.0px; stroke:black; opacity:1.0;')
        .attr('x1', x(i))
        .attr('y1', y(0))
        .attr('x2', x(i))
        .attr('y2', y(0)+10);

        if (x(i) < this.dimensions.width-40)
        {
          const sdate = parseSnowflakeDate(d[date_fld]);
          const monthDayStr = sdate.toLocaleString('default', { month: 'short', day: 'numeric' });
          let subg = xgroup.append("g")
            .attr('class','x-tick');
          let text_anchor = 'middle';
          subg.append('text')
            .text(monthDayStr)
            .attr('style','font-family:sans-serif; font-weight:300; font-size: 0.85rem; fill:black;text-anchor:start; dominant-baseline:hanging;')
            .attr("x", x(i))
            .attr("y", axisY+tick_upper_gap+tick_height+tick_lower_gap); // +this.getYOffset(i)
        }
  
    } else if (show_days) {
        let subj = xgroup.append("g")
        .append('line')
        .attr('style','stroke-width: 1.0px; stroke:gray; opacity:1.0;')
        .attr('x1', x(i))
        .attr('y1', y(0))
        .attr('x2', x(i))
        .attr('y2', y(0)+5);
    }
  });
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
      const digits = (hint == 'integer')? 0 : max_v < .1? 2 : max_v < 10? 1 : 0;
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

// https://stackoverflow.com/questions/68918152/svg-legend-for-multi-line-chart-d3-v6

function writeLegend(svg, x, y, { colors=[], labels=[], chart_options={}})
{
  let legend = svg.append("g")
          .attr('id','variant-lgend')
          .attr('style','stroke-width: ' + chart_options.stroke_width+"px;" + 'font-family:sans-serif; font-weight:300; font-size: 0.85rem; fill:black;text-anchor: start; dominant-baseline:middle;');

  let cells = [];
  let xPos = 0;
  let lineWidth = 10;
  let lineMargin = 6;
  let legendGap = 12;
  let twoline_mode = true; // this.dimensions.width < 700;
  // console.log("drawing legend, width =",this.dimensions.width);
  const legendTop  = 12;
  const lineOfst = -2;
  if (twoline_mode) {
    const cutIndex = 4; // chart_options.omit_other? 4 : 5;
    const labels2 = labels.slice(cutIndex);
    const labels1 = labels.slice(0,cutIndex);
    // console.log("LABELS",labels1,labels2);
    labels1.forEach((label, i) => {
      // console.log("Drawing label", label);
      let lg = legend.append("g")
                  .attr('id', 'legend_'+i)
                  .attr('transform', `translate(${xPos})`);
      let line = lg.append('line')
        .attr('style',`stroke:${colors[i]};`)  // 
        .attr('x1', 0)
        .attr('y1', legendTop+lineOfst)
        .attr('x2', lineWidth)
        .attr('y2', legendTop+lineOfst);

      let txt = lg.append('text')
        .text(label)
        .attr("y", legendTop)
        .attr("x", lineWidth+lineMargin)
        ;

      let box = document.querySelector('#variant-lgend #legend_'+i);
      xPos += box.getBBox().width + legendGap;
    });
    let yOffset = 12;
    xPos = 0;
    labels2.forEach((label, i) => {
      // console.log("Drawing label", label);
      let lg = legend.append("g")
                  .attr('id', 'legend_'+(i+cutIndex))
                  .attr('transform', `translate(${xPos})`);
      let line = lg.append('line')
        .attr('style',`stroke:${colors[i+cutIndex]};`)  // 
        .attr('x1', 0)
        .attr('y1', legendTop+lineOfst+yOffset)
        .attr('x2', lineWidth)
        .attr('y2', legendTop+lineOfst+yOffset);

      let txt = lg.append('text')
        .text(label)
        .attr("y", legendTop+yOffset)
        .attr("x", lineWidth+lineMargin)
        ;

      let box = document.querySelector('#variant-lgend #legend_'+(i+cutIndex));
      xPos += box.getBBox().width + legendGap;
    });
  } else {
    labels.forEach((label, i) => {
      // console.log("Drawing label", label);
      let lg = legend.append("g")
                  .attr('id', 'legend_'+i)
                  .attr('transform', `translate(${xPos})`);
      let line = lg.append('line')
        .attr('style',`stroke:${colors[i]};`)  // 
        .attr('x1', 0)
        .attr('y1', legendTop+lineOfst)
        .attr('x2', lineWidth)
        .attr('y2', legendTop+lineOfst);

      let txt = lg.append('text')
        .text(label)
        .attr("y", legendTop)
        .attr("x", lineWidth+lineMargin)
        ;

      let box = document.querySelector('#variant-lgend #legend_'+i);
      xPos += box.getBBox().width + legendGap;

    });
  }
  // Right-justify the whole thing...
  let legEl = document.querySelector('#variant-lgend');
  let legWidth = legEl.getBBox().width;
  legend.attr('transform',`translate(${this.dimensions.width - this.dimensions.margin.right - legWidth})`);
}

function writeYAxis(svg, x, y, 
                        { y_fmt='num',
                          root_id='barid',
                          y_axis_legend='' }) {
  const y_div = getAxisDiv(y,{'hint':y_fmt});
  let ygroup = svg.append("g")
      .attr("class",'left-y-axis');

  const max_y_domain = y.domain()[1];
  const min_x_domain = x.domain()[0];
  const max_x_domain = x.domain()[1];
  // console.log("Left Axis",max_y_domain, root_id, y_fmt);
  const tick_gap = 10;
  let myFormatter = getFormatter(max_y_domain, { hint:y_fmt });
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
      .attr('style','font-family:sans-serif; font-weight:300; font-size: 0.85rem; fill:black;text-anchor: end; dominant-baseline:middle;')
      .attr("x", x(min_x_domain)-tick_gap)
      .attr("y", y(yi)) // +this.getYOffset(i)
  }
  // y-axis-legend
  let yLegendG = svg.append("g");
  y_axis_legend.split('<br>').forEach((legend_line, yi) => {
  legend_line = legend_line.replace("cases","Cases");
  yLegendG.append('text')
      .text(legend_line)
      .attr('transform','translate(10,250)rotate(-90)')
      .attr('style','font-family:sans-serif; font-weight:300; font-size: 0.85rem; fill:black;text-anchor: start; dominant-baseline:middle;')
      .attr("y",0)
      .attr("x",0);
  });

}

function writePendingBlock(svg, x, y,
  { pending_units=0,
    pending_legend='',
    padDays=0,
    root_id='barid',
  } ) {

    const min_x_domain = x.domain()[0];
    const max_x_domain = x.domain()[1];
    const min_y_domain = y.domain()[0];
    const max_y_domain = y.domain()[1];
    const left_edge = x(max_x_domain-padDays + 0.5 - pending_units);
    const right_edge = x(max_x_domain-padDays);
    const mid_edge = (left_edge + right_edge) / 2;
    const right_chart_edge = x(max_x_domain);

    let xgroup = svg.append("g")
      .attr("class",'pending-block');

    xgroup.append('rect')
      // .attr('style','fill:black;opacity:0.05;')
      .attr("x",left_edge)
      .attr("y",y(max_y_domain))
      .attr("width",right_edge - left_edge)
      .attr("height",y(min_y_domain)-y(max_y_domain));
    
    xgroup.append('text')
        // .attr('style','font-family:sans-serif; fill:black; font-weight:300; font-size: 0.8rem; text-anchor: end; dominant-baseline:auto;')
        .text(pending_legend)
        .attr("x",mid_edge+22 > right_chart_edge? right_chart_edge : mid_edge+22)
        .attr("y",y(max_y_domain)-4);
}

// Convert 
function getDataIndexByX(xScale, yScale, xy)
{
  let x = xy[0];
  let y = xy[1];
  let xdi = xScale.invert(x);
  if (xdi >= 0 && xdi <= xScale.domain()[1] ) {
    return Math.round(xdi);
  }
  return null;
}

function showTooltip(event, xy, dataIndex, xscale, yscale)
{
  let tooltip = this.tooltip;
  let content = this.getTooltipContent(dataIndex); 
  tooltip.html(content);
  tooltip.style("left",`${Math.min(this.dimensions.width-280,event.offsetX+20)}px`);
  // console.log("Tool top L, O, y",event.layerY, event.offsetY, event.y);
  // tooltip.style("top",`${event.layerY+60}px`)
  tooltip.style("top",`${(event.offsetY+20)}px`);
  // d3.select(this).transition();
  tooltip.style("visibility", "visible");
  // console.log("TOOLTIP",content,this.tooltip);

  this.svg.selectAll('g.tt-marker').remove();
  const line_start = this.dimensions.margin.top;
  const line_height = (this.dimensions.height - this.dimensions.margin.bottom) - line_start;

  this.svg
    .append('g')
    .attr('class','tt-marker')
    .append('rect')
    .attr("x",xscale(dataIndex)-0.5)
    .attr("y",line_start)
    .attr("width",1)
    .attr("height",line_height);
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

/**
 * Render categories.
 * @param {*} extrasFunc @TODO what are the inputs?
 */

 export default function renderChart({
    chart_style = 'normal',
    line_series_array = [],
    y_fmt = 'number',
    x_axis_field = null,
    y_axis_legend = '',
    extras_func = null,
    published_date = null,
    render_date = null,
    root_id = "variantchart",
    series_colors = [], 
    series_labels = [],
    chart_options = {},
    pending_units = 0,
    unit = 'days',
    pending_label = 'Pending',
   } )  {

    // Force padding on dimensions...
    const firstDateSnowflake = line_series_array[0][0].DATE
    const lastDateSnowFlake = line_series_array[0][line_series_array[0].length-1].DATE;
    // as day goes from 1->16, padding goes from 35 -> 0
    // const lastDateJ = parseSnowflakeDate(lastDateSnowFlake);
    // const lastday = lastDateJ.getDate();
    // if (lastday < 16) {
    //   const padding = 35 * 1-(lastday/15.0);
    //   this.dimensions.margin.right = padding;
    // }

    this.svg = d3
      .select(this.querySelector(".svg-holder"))
      .append("svg");

    const meta = {
        DATA_PUBLISHED_DATE: published_date, 
        RENDER_DATE: render_date,
        FIRST_DATE: firstDateSnowflake,
        LAST_DATE: lastDateSnowFlake
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
      ]);

     this.svg.append("g")
           .attr("transform", "translate(0,0)")
           .attr("style", "fill:#CCCCCC;");
     

    this.tooltip = d3
      .select(this.chartOptions.chartName)
      .append("div")
        .attr("class", "tooltip-container")
        .text("Empty Tooltip");

    // Prepare and draw the two lines here... using chartdata, seriesN_field and weeks_to_show
    // console.log("Chart data",chartdata);
    // let max_y_domain = 10;
    let max_y_domain = d3.max(line_series_array, lsa => d3.max(lsa, r => r.VALUE));


    let min_y_domain = 0;
    this.yline = d3
    .scaleLinear()
    .domain([min_y_domain, max_y_domain]).nice()  // d3.max(data, d => d.METRIC_VALUE)]).nice()
    .range([this.dimensions.height - this.dimensions.margin.bottom, this.dimensions.margin.top]);


    // Determine additional days to add...
    // const lastDateSnowFlake = line_series_array[0][line_series_array[0].length-1].DATE;
    // const lastDateJ = parseSnowflakeDate(lastDateSnowFlake);
    // determine width of a day in current projection, in pixels
    // const day_width = (this.dimensions.width - (this.dimensions.margin.left+this.dimensions.margin.right)) / line_series_array[0].length;
    // const necessary_display_width = 32; // space to display Aug in English
    // const min_days = Math.ceil(necessary_display_width / day_width);
    // // pad to extra days to make room for month-name display
    // let padDays = Math.max(0, min_days - lastDateJ.getDate());
    let padDays = 0;
    // console.log("MIN DAYS, pad_days", min_days, padDays);
    console.log("margin right: ",this.dimensions.margin.right);
    this.xline = d3
    .scaleLinear()
    .domain([0,padDays + line_series_array[0].length-1])
    .range([
        this.dimensions.margin.left,
        this.dimensions.width - this.dimensions.margin.right
        ]);

    // let pending_units = pending_weeks * (chart_mode == 'weekly'? 1 : 7);

    line_series_array.forEach((chartdata, i) => {
      writeLine.call(this, this.svg, chartdata, 'VALUE', this.xline, this.yline, 
        { root_id:root_id+"_l"+(i+1), line_id:'line_s'+(i+1), line_idx:(i+1), 
          crop_floor:false, color:series_colors[i], chart_options:chart_options});
    });

    writeLegend.call(this, this.svg, this.xline, this.yline, 
                {colors:series_colors, 
                 labels:series_labels, 
                 chart_options:chart_options,
                 padDays: padDays
                });

    
    if (pending_units > 0) {
      writePendingBlock.call(this, this.svg, this.xline, this.yline, 
            { root_id:root_id, pending_units:pending_units, pending_legend:pending_label,
              padDays: padDays
            });
    }


    // Write Y Axis, favoring line on left, bars on right
    // console.log("Writing Y Axis");
    writeYAxis.call(this, this.svg, this.xline, this.yline,
         {y_fmt:y_fmt, root_id:root_id, y_axis_legend: y_axis_legend});

    // console.log("Writing X Axis");
    writeXAxis.call(this, this.svg, line_series_array[0], x_axis_field, this.xline, this.yline,
      {week_modulo: 1, root_id:root_id, unit:unit} );

    if (extras_func) {
      extras_func.call(this, this.svg);
    }

    this.svg
    .on("mousemove focus", (event) => {
       let xy = d3.pointer(event);
       let dIndex = getDataIndexByX(this.xline, this.yline, xy);
       if (dIndex != null) {
         showTooltip.call(this, event, xy, dIndex, this.xline, this.yline);
       } else {
         hideTooltip.call(this);
       }
     })
     .on("mouseleave touchend blur", (event) => {
       hideTooltip.call(this);
    });


  }

