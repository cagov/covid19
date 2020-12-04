function chartOverlayBox(svg,        // svg to change to 50% opacity
                         chartClass, // chart's class
                         boxClass,   // custom class name for this box
                         chartDims,  // dict that contains width and height
                         caption)    // caption text
{                         

      // 250 is current width of chart-overlaybox-container
      let boxWidth = 250;
      let boxHeight = boxWidth/2;

      d3.selectAll("." + boxClass).remove();
      svg.style("opacity",.5);
      // append informative box
      d3
      .select(chartClass)
      .append("div")
      .attr("class", "chart-overlaybox-container " + boxClass)
      .style("visibility", "visible")
      .style("left", (chartDims.width - boxWidth)/2 + "px")
      .style("top", (chartDims.height - boxHeight)/2 + "px")
      .append("div")
      .attr("class", "chart-overlaybox")
      .text(caption)
}

function chartOverlayFade(svg,        // svg to change to 50% opacity
                          chartClass, // chart's class
                          boxClass,   // custom class name for this box
                          chartDims  // dict that contains width and height
                          ) {
      // 250 is current width of chart-overlaybox-container
      let boxWidth = 250;
      let boxHeight = boxWidth/2;

      d3.selectAll("." + boxClass).remove();
      svg.style("opacity",.5);
}

function chartOverlayBoxClear(svg, boxClass) {
    // clears previous box, if any and resets opacity of svg
    d3.selectAll("." + boxClass).remove();
    svg.style("opacity",1);
}
export {chartOverlayBox, chartOverlayFade, chartOverlayBoxClear};