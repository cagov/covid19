import data from './hpi-data.json';
import data2 from './hpi-data2.json';
import Tooltip from './tooltip.js';

class CAGOVChartD3Lines extends window.HTMLElement {
  connectedCallback () {

    const svg = d3.create("svg").attr("viewBox", [0, 0, 200, 100]);

    let x = d3.scaleTime()
      .domain([new Date(2020, 8, 6), new Date(2020, 9, 7)])
      .range([0,200]);

    let y = d3.scaleLinear()
      .domain([0, 9]) // need the highest value x 2 or something here
      .range([100, 0])

    let dims = [{
      width: 200,
      height: 100
    }]

    let xAxis = g => g
      .attr("transform", `translate(5,80)`)
      .call(d3.axisBottom(x)
        .ticks(d3.timeWeek.every(1))
        .tickFormat(d3.timeFormat('%b %d'))  
        .tickSize(1,1))
      .call(g => g.select(".domain").remove())

    let line = d3.line()
      .x((d, i) => {
        return x(new Date(d.date));
      })
      .y(d => {
        return y(d.value)
      })
    
    //call line chart county_positivity_all_nopris
    svg
      .append("path")
      .datum(data.sort(function(a,b) {
        return a.date > b.date
      }))
      .attr("fill","none")
      .attr("stroke", "#ffcf45")
      .attr("stroke-width", .5)
      .attr("d", line)
    
    //call line chart county_positivity_low_hpi
    svg
      .append("path")
      .datum(data2.sort(function(a,b) {
        return a.date > b.date
      }))
      .attr("fill","none")
      .attr("stroke", "#0F368E")
      .attr("stroke-width", .5)
      .attr("d", line);
    
    svg.append("g").call(xAxis);
    
    //tooltip
    const tooltip = new Tooltip();
    const tooltip2 = new Tooltip();
    
    svg
      .append("g")
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .selectAll("rect")
      .data(d3.pairs(data))
      .join("rect")
      .attr("x", ([a, b]) => x(new Date(a.date)))
      .attr("height", 100)
      .attr("width", ([a, b]) => x(new Date(b.date)) - x(new Date(a.date)))
      .on("mouseover", (event, [a]) => {
        tooltip.show(a,1,x,y, data2)
        tooltip2.show(a,2,x,y, data2)
      })
      .on("mouseout", () => {
        tooltip.hide()
        tooltip2.hide()
      });

    svg.append(() => tooltip.node);
    svg.append(() => tooltip2.node);
    
    let legendLabels = ["Statewide test positivity", "Health equity metric (HPI quartile positivity rate)"];
    let legendColors = ["#ffcf45","#0F368E"]
    let legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(0,6)`);

    legend.selectAll('rect')
      .data(legendLabels)
      .enter()
      .append('rect')
      .attr('x', 10)
      .attr('y', function(d, i){
        return i * 6;
      })
      .attr('width', 12)
      .attr('height', .5)
      .attr('fill', function(d, i){
        return legendColors[i];
      });

    legend.selectAll('text')
      .data(legendLabels)
      .enter()
      .append('text')
      .text(function(d){
        return d;
      })
      .attr('x', 25)
      .attr('y', function(d, i){
        return i * 6 - 2;
      })
      .attr('text-anchor', 'start')
      .attr('alignment-baseline', 'hanging');

    this.innerHTML = `<div class="svg-holder"></div>`;
    document.querySelector('.svg-holder').appendChild(svg.node());

  }
}
window.customElements.define('cagov-chart-d3-lines', CAGOVChartD3Lines);
