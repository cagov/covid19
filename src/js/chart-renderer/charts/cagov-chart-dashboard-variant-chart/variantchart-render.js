// generic histogram chart, as used on top of state dashboard

function writeLine(svg, data, fld, x, y, { root_id='barid', line_id='line_s0',line_idx=1, color='black', crop_floor=true,chart_options=null }) {
  let max_y_domain = y.domain()[1];
  let max_x_domain = x.domain()[1];
  let component = this;

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
  groups.append('path')
    .datum(data)
      .attr("d", d3.line()
        .x(function(d,i) { return x(i) })
        .y(function(d) { return y(crop_floor? Math.max(0,d[fld]) : d[fld]) })
        );
}

// Date Axis
function writeXAxis(svg, data, date_fld, x, y, 
  { root_id='barid'} ) {
  console.log("writeXAxis A");
  const tick_height = 4;
  const tick_upper_gap = 1;
  const tick_lower_gap = 12;
  const axisY = this.dimensions.height - this.dimensions.margin.bottom;

  let xgroup = svg.append("g")
      .attr("class",'date-axis')
      .attr('style','stroke-width: 0.5px; stroke:black;');

  console.log("writeXAxis B",data);
  data.forEach((d,i) => {
    const ymd = d[date_fld].split('-');
    const year_idx = parseInt(ymd[0]);
    const mon_idx = parseInt(ymd[1]);
    const day_idx = parseInt(ymd[2]);
      
    if (i == 0 || i == data.length-1) {
      let subg = xgroup.append("g")
        .attr('class','x-tick');
      console.log("WRITING DATES");
      const date_caption = mon_idx+'/'+day_idx + '/'+year_idx; // ?? localize
      let text_anchor = (i == 0)? 'start' : 'end';
      subg.append('text')
        .text(date_caption)
        .attr('style','font-family:sans-serif; font-weight:300; font-size: 0.85rem; fill:black;text-anchor: '+text_anchor+'; dominant-baseline:hanging;')
        .attr("x", x(i))
        .attr("y", axisY+tick_upper_gap+tick_height+tick_lower_gap); // +this.getYOffset(i)
    }
  });
  console.log("writeXAxis C");

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

function writeYAxis(svg, x, y, 
                        { y_fmt='num',
                          root_id='barid' }) {
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
  tooltip.style("left",`${Math.min(this.dimensions.width-280,event.offsetX)}px`);
  // console.log("Tool top L, O, y",event.layerY, event.offsetY, event.y);
  // tooltip.style("top",`${event.layerY+60}px`)
  tooltip.style("top",`${(event.offsetY+120)}px`);
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
    chart_labels = [],
    y_fmt = 'number',
    x_axis_field = null,
    extras_func = null,
    published_date = "YYYY-MM-DD",
    render_date = "YYYY-MM-DD",
    root_id = "variantchart",
    //              alpha      beta      delta     lambda     gamma mu other
    series_colors = ['#4173b3','#b6423f','#8eb04a','#715696','#3ea0bd','#f48737','#d8d8d8'],
    chart_options = {},
   } )  {

    console.log("renderChart",root_id);
    // d3.select(this.querySelector("svg g"))
    //   .attr('style','font-family:sans-serif;font-size:16px;');

    this.svg = d3
      .select(this.querySelector(".svg-holder"))
      .append("svg");

    this.svg.attr("about","DATA_PUBLISHED_DATE:" + published_date + ",RENDER_DATE:" + render_date)
            .attr('xmlns','http://www.w3.org/2000/svg');


    // this.svg.selectAll("g").remove();
    this.svg
      .attr("viewBox", [
        0,
        0,
        this.chartBreakpointValues.width,
        this.chartBreakpointValues.height,
      ]);


  // const patternSuffixes = ['1'];
  //     this.svg.append("defs")
  //       .selectAll("pattern")
  //       .data(patternSuffixes)
  //       .join("pattern")
  //        .attr("id",d => root_id+'hatch'+d)
  //        .attr("patternUnits","userSpaceOnUse")
  //        .attr("style","stroke:#0AF; stroke-width:2")
  //        .attr("x",0)
  //        .attr("x",0)
  //        .attr("width",3.75)
  //        .attr("height",3.75)
  //        .attr('patternTransform',"rotate(45 0 0)")
  //        .append('line')
  //         .attr('x1',0)
  //         .attr('y1',0)
  //         .attr('x2',0)
  //         .attr('y2',10);
  //     ;
          

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
    let max_y_domain = 100;
    let min_y_domain = 0;
    this.yline = d3
    .scaleLinear()
    .domain([min_y_domain, max_y_domain]).nice()  // d3.max(data, d => d.METRIC_VALUE)]).nice()
    .range([this.dimensions.height - this.dimensions.margin.bottom, this.dimensions.margin.top]);

    const LINE_OFFSET_X = 0;
    this.xline = d3
    .scaleLinear()
    .domain([LINE_OFFSET_X+0,LINE_OFFSET_X+line_series_array[0].length-1])
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

    
    // if (pending_weeks > 0) {
    //   let pending_units = pending_weeks * (chart_mode == 'weekly'? 1 : 7);
    //   if (pending_mode != 'dotted' && pending_mode != 'dots') {
    //     writePendingBlock.call(this, this.svg, this.xline, this.yline,
    //           { root_id:root_id, pending_units:pending_units, pending_legend:pending_legend});
    //   }
    // }



    // Write Y Axis, favoring line on left, bars on right
    console.log("Writing Y Axis");
    writeYAxis.call(this, this.svg, this.xline, this.yline,
         {y_fmt:y_fmt, root_id:root_id});

    console.log("Writing X Axis");
    writeXAxis.call(this, this.svg, line_series_array[0], x_axis_field, this.xline, this.yline,
      {week_modulo: 1, root_id:root_id} );

    // writeLegends.call(this, this.svg, chartdata, series_legends, series_colors, this.xline, this.yline);

    if (extras_func) {
      extras_func.call(this, this.svg);
    }

    // this.svg
    // .on("mousemove focus", (event) => {
    //   let xy = d3.pointer(event);
    //   let dIndex = getDataIndexByX(this.xline, this.yline, xy);
    //   if (dIndex != null) {
    //     showTooltip.call(this, event, xy, dIndex, this.xline, this.yline);
    //   } else {
    //     hideTooltip.call(this);
    //   }
    // })
    // .on("mouseleave touchend blur", (event) => {
    //   hideTooltip.call(this);
    // });


  }

