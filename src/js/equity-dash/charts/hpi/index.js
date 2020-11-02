import Tooltip from './hpi-tooltip.js';

class CAGOVChartD3Lines extends window.HTMLElement {
  connectedCallback () {

    this.svg = d3.create("svg").attr("viewBox", [0, 0, 200, 100]);

    let dims = [{
      width: 200,
      height: 100
    }]
    
    window.fetch('https://files.covid19.ca.gov/data/to-review/equitydash/healthequity-california.json')
    .then(response => response.json())
    .then(alldata => {
      this.writeChart(alldata, this.svg);

      this.innerHTML = `<div class="svg-holder"></div>`;
      document.querySelector('.svg-holder').appendChild(this.svg.node());
    })
    
    let legendLabels = ["Statewide test positivity", "Health equity quartile positivity"];
    this.legendColors = ["#92C5DE","#FFCF44"]
    this.legend = this.svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(0,6)`);

    this.writeLegendColors(this.legendColors, this.legend)
    this.writeLegendLabels(legendLabels, this.legend)
    this.listenForLocations();
  }

  listenForLocations() {
    let searchElement = document.querySelector('cagov-county-search');
    searchElement.addEventListener('county-selected', function (e) {
      this.county = e.detail.county;
      console.log('hpi chart sees chosen county: '+e.detail.county)



      window.fetch('https://files.covid19.ca.gov/data/to-review/equitydash/healthequity-'+this.county.toLowerCase().replace(/ /g,'')+'.json')
      .then(response => response.json())
      .then(alldata => {
        this.writeChart(alldata, this.svg);
      })
        
      let legendLabels = [this.county+" test positivity", "Health equity quartile positivity"];
      //this.writeLegendLabels(legendLabels, this.legend)
      this.rewriteLegend(this.svg, legendLabels)
  
    }.bind(this), false);
  }

  writeChart(alldata, svg) {
    let data = alldata.county_positivity_all_nopris;
    let data2 = alldata.county_positivity_low_hpi;

    let x = d3.scaleTime()
      .domain([d3.min(data, d => new Date(d.DATE)), d3.max(data, d => new Date(d.DATE))])
      .range([0,200]);

    let y = d3.scaleLinear()
      .domain([0, d3.max(data2, d => d.METRIC_VALUE) * 1.5]) // using county_positivity_low_hpi because that has higher numbers
      .range([100, 0])

    let xAxis = g => g
      .attr("transform", `translate(5,-90)`)
      .call(d3.axisBottom(x)
        .ticks(d3.timeWeek.every(1))
        .tickFormat(d3.timeFormat('%b. %d'))  
        .tickSize(180,0))
      .call(g => g.select(".domain").remove())

    let line = d3.line()
      .x((d, i) => {
        return x(new Date(d.DATE));
      })
      .y(d => {
        return y(d.METRIC_VALUE)
      })

    //call line chart county_positivity_all_nopris
    svg.selectAll(".county_positivity_all_nopris").remove();

    svg
      .append("path")
      .datum(data.sort(function(a,b) {
        return a.DATA > b.DATE
      }))
      .attr("fill","none")
      .attr("stroke", "#92C5DE")
      .attr("stroke-width", .5)
      .attr("class","county_positivity_all_nopris")
      .attr("d", line)

    //call line chart county_positivity_low_hpi
    svg.selectAll(".county_positivity_low_hpi").remove();

    svg
      .append("path")
      .datum(data2.sort(function(a,b) {
        return a.DATE > b.DATE
      }))
      .attr("fill","none")
      .attr("stroke", "#FFCF44")
      .attr("stroke-width", .5)
      .attr("class","county_positivity_low_hpi")
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
      .attr("x", ([a, b]) => {
        let val = x(new Date(a.DATE)) + 0.5
        return val;
      })
      .attr("height", 100)
      .attr("width", 0.5)
      .attr("style","stroke-width:0.5;")
      .on("mouseover", (event, [a]) => {
        tooltip.show(a,1,x,y, data2)
        tooltip2.show(a,2,x,y, data2)
        event.target.setAttribute("fill","#003D9D")
      })
      .on("mouseout", (event) => {
        tooltip.hide()
        tooltip2.hide()
        event.target.setAttribute("fill","none")
      });

    svg.append(() => tooltip.node);
    svg.append(() => tooltip2.node);

  }

  rewriteLines(svg, data, x, y) {
    svg.selectAll(".barshere rect")
      .data(data)
      .transition().duration(300)
      .attr("x", (d, i) => x(i))
      .attr("y", d => y(d.CASE_RATE_PER_100K))
      .attr("height", d => y(0) - y(d.CASE_RATE_PER_100K))
  }

  writeLegendColors(legendColors, legend) {
    legend.selectAll('rect')
      .data(legendColors)
      .enter()
      .append('rect')
      .attr('x', 10)
      .attr('y', function(d, i){
        return i * 6;
      })
      .attr('width', 12)
      .attr('height', .5)
      .attr('fill', function(d, i){
        return d;
      });

  }
  writeLegendLabels(legendLabels, legend) {
    legend.selectAll('text')
      .data(legendLabels)
      .enter()
      .append('text')
      .text(function(d){
        console.log(d)
        return d;
      })
      .attr('x', 25)
      .attr('y', function(d, i){
        return i * 6 - 2;
      })
      .attr('text-anchor', 'start')
      .attr('alignment-baseline', 'hanging');
  }

  rewriteLegend(svg, legendLabels) {
    svg.selectAll('.legend text')
      .data(legendLabels)
      .text((d) => d)
  }
}
window.customElements.define('cagov-chart-d3-lines', CAGOVChartD3Lines);
