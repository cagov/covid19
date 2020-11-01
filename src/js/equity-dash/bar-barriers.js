import data from './social-data-income.json';
import template from './template.js';

class CAGOVChartD3Bar extends window.HTMLElement {
  connectedCallback () {
    // stuff from observables: https://observablehq.com/@aaronhans/covid-19-case-rate-by-income-bracket-in-california
    let height = 500;
    let width = 842;
    let margin = ({top: 30, right: 0, bottom: 30, left: 10})

    function sortedOrder(a,b) {
      return parseInt(a.SORT) - parseInt(b.SORT)
    }

    this.svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("class","equity-bar-chart");
    
    /*
     for env specific switches get data location from dataset attributes

     window.fetch("https://files.covid19.ca.gov/data/to-review/equitydash/social-data-income.json"),
    */
    Promise.all([
      window.fetch("https://files.covid19.ca.gov/data/to-review/equitydash/social-data-crowding.json"),
      window.fetch("https://files.covid19.ca.gov/data/to-review/equitydash/social-data-crowding.json"),
      window.fetch("https://files.covid19.ca.gov/data/to-review/equitydash/social-data-insurance.json")
    ]).then(function (responses) {
      return Promise.all(responses.map(function (response) {
        return response.json();
      }));
    }).then(function (alldata) {
      //let data = alldata[0];
      let datacrowding = alldata[1];
      let datahealthcare = alldata[2];

      data.sort(sortedOrder).reverse()
      datacrowding.sort(sortedOrder)
      datahealthcare.sort(sortedOrder)
  
      let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.CASE_RATE_PER_100K)]).nice()
        .range([height - margin.bottom, margin.top])
  
      let x = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([margin.left, width - margin.right])
        .padding(0.1)

      writeBars(this.svg, data, x, y, width);
      writeBarLabels(this.svg, data, x, y);
      let xAxis = writeXAxis(data, height, margin, x);
  
      this.svg.append("g")
        .attr("class", "xaxis")
        .call(xAxis);
    
      this.svg.append("path")
        .attr("d", d3.line()([[0, height/2], [width, height/2]]))
        .attr("stroke", "#1F2574")
        .style("stroke-dasharray", ("3, 3"));
      
      this.svg.append("text")
        .text(`Statewide case rate ${parseFloat(data[0].STATE_CASE_RATE_PER_100K).toFixed(1)}`)
        .attr("y", height / 2 - 5)
        .attr("x", width - 5)
        .attr('text-anchor','end')
        .attr('class','label');
        
      writeLegend(this.svg, ["Cases per 100K people"]);
  
      this.innerHTML = template();
      this.querySelector('.svg-holder').appendChild(this.svg.node());
      window.tooltip = this.querySelector('.bar-overlay')
  
      this.applyListeners(this.svg, x, y, height, margin, xAxis)
    }.bind(this));
      
  }

  applyListeners(svg, x, y, height, margin, xAxis) {
    let toggles = this.querySelectorAll('.js-toggle-group');
    toggles.forEach(tog => {
      tog.addEventListener('click',function(event) {
        event.preventDefault();
        if(this.classList.contains('healthcare')) {
          rewriteBar(datahealthcare, 'Case rate by access to healthcare')
        }
        if(this.classList.contains('housing')) {
          rewriteBar(datacrowding, 'Case rate by crowding housing')
        }
        if(this.classList.contains('income')) {
          rewriteBar(data, 'Case rate by median annual household income bracket')
        }
        resetToggles();
        tog.classList.add('toggle-active')
      })
    })

    function resetToggles() {
      toggles.forEach(toggle => {
        toggle.classList.remove('toggle-active')
      });
    }

    function rewriteBar(dataset, title) {
      y = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d.CASE_RATE_PER_100K)]).nice()
        .range([height - margin.bottom, margin.top])

      rewriteBars(svg, dataset, x, y);
      rewriteBarLabels(svg, dataset, x, y);
      xAxis = writeXAxis(dataset, height, margin, x);
      svg.selectAll(".xaxis")
        .call(xAxis);
      
      document.querySelector('.chart-title').innerHTML = title;
    }

  }
}
window.customElements.define('cagov-chart-d3-bar', CAGOVChartD3Bar);

let labelMap = new Map();
labelMap.set("$80k - $100k","$80k - $100k");
labelMap.set("$100k - $120k","$100k - $120k");
labelMap.set("$60k - $80k","$60k - $80k");
labelMap.set("below $40K","0 - $40K");
labelMap.set("$40k - $60k","$40k - $60k");
labelMap.set("above $120K","$120K+");

function writeXAxis(data, height, margin, x) {
  let xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom + 5})`)
    .call(d3.axisBottom(x).tickFormat(i => labelMap.get(data[i].SOCIAL_TIER)).tickSize(0))
    .style('font-weight','bold')
    .call(g => g.select(".domain").remove())
  return xAxis;
}
function rewriteLegend(svg, legendLabels) {
  svg.selectAll('.legend text')
    .data(legendLabels)
    .text(legendLabels[0])
}
function writeLegend(svg, legendLabels) {
  let legend = svg.append('g')
    .attr('class', 'legend');
  
  legend.selectAll('rect')
    .data(legendLabels)
    .enter()
    .append('rect')
    .attr('x', 20)
    .attr('y', 20)
    .attr('width', 12)
    .attr('height', 12)
    .attr('fill', "skyblue");

  legend.selectAll('text')
    .data(legendLabels)
    .enter()
    .append('text')
    .text(legendLabels[0])
    .attr('x', 40)
    .attr('y', 20)
    .attr('text-anchor', 'start')
    .attr('alignment-baseline', 'hanging');
}
function writeBars(svg, data, x, y, width) {
  svg.append("g")
    .attr("fill", "skyblue")
    .attr('class','barshere')
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", (d, i) => x(i))
      .attr("y", d => y(d.CASE_RATE_PER_100K))
      .attr("height", d => y(0) - y(d.CASE_RATE_PER_100K))
      .attr("width", x.bandwidth())
      .attr("id", (d, i) => "barid-"+i)
      .on("mouseover", function(event, d, i) {
        d3.select(this).style("fill", "#003D9D");
        // problem the svg is not the width in px in page as the viewbox width
        window.tooltip.style.top = "50%";
        let barIdInt = this.id.replace('barid-','');
        let svgLeft = x(barIdInt)
        let percentLeft = svgLeft / width;
        let elWidth = document.querySelector('.svg-holder .equity-bar-chart').getBoundingClientRect().width; 
        let actualLeft = parseInt(percentLeft * elWidth) - 70;
        // 70 is quick approximation, could actually be subtract half width of tooltip - half width of bar
        window.tooltip.style.left = parseInt(actualLeft)+"px";
        window.tooltip.innerHTML = `<div class="chart-tooltip">
          <div class="chart-tooltip-desc"><span class="highlight-data">${parseFloat(d.CASE_RATE_PER_100K).toFixed(1)}</span> cases per 100K people. ${parseFloat(d.RATE_DIFF_30_DAYS).toFixed(1)}% change since previous week</div>
        </div>`;
        window.tooltip.style.visibility = "visible";
      })
      .on("mouseout", function(d) {
        d3.select(this).style("fill", "skyblue");
        window.tooltip.style.visibility = "hidden";
      });
}
function rewriteBars(svg, data, x, y) {
  svg.selectAll(".barshere rect")
    .data(data)
    .transition().duration(300)
    .attr("x", (d, i) => x(i))
    .attr("y", d => y(d.CASE_RATE_PER_100K))
    .attr("height", d => y(0) - y(d.CASE_RATE_PER_100K))
}

function writeBarLabels(svg, data, x, y) {
  svg.append("g")
  .attr("class", "bar-label-group")
  .selectAll(".bar-label")
  .data(data)
  .join(
    enter => {
      enter
        .append("text")
        .attr("class", "bar-label")
        .attr("x", (d, i) => x(i) + (x.bandwidth() / 2))
        .attr("y", d => y(d.CASE_RATE_PER_100K) - 5)
        .attr("width", x.bandwidth() / 4)
        .html(d => {
          return `<tspan class="bold" dx="0em" dy="-1.2em">${parseFloat(d.CASE_RATE_PER_100K).toFixed(1)}</tspan>
          <tspan dx="-1em" dy="1.2em">${parseFloat(d.RATE_DIFF_30_DAYS).toFixed(1)}%</tspan>`
        })
        .attr('text-anchor','middle')
    }
  )

  writeSparklines(svg, data, x, y);
}
function writeSparklines(svg, data, x, y) {
  svg.append("g")
    .selectAll(".bar-label")
    .data(data)
    .join(
      enter => {
        enter
          .append("svg")
          .attr("x", (d, i) => x(i) + (x.bandwidth() / 10))
          .attr("y", d => y(d.CASE_RATE_PER_100K) - 20)
          .html(d => {
            if(parseFloat(d.RATE_DIFF_30_DAYS) > 0) {
              return `<svg class="sparkline" width="25" height="15" viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 0.581819V5.19326C17 5.50954 16.742 5.77116 16.4271 5.77116C16.1122 5.77116 15.8543 5.51344 15.8543 5.19326V2.00308L10.1901 7.93042C10.0839 8.03975 9.93972 8.09832 9.78419 8.09832C9.63244 8.09832 9.48828 8.03975 9.37826 7.93042L6.11944 4.64647L0.971201 9.8321C0.86118 9.94143 0.720802 10 0.565271 10C0.413518 10 0.26936 9.94143 0.15934 9.8321C0.0531121 9.72667 0 9.59001 0 9.43381C0 9.22295 0.0872582 9.09018 0.15934 9.01601L5.70966 3.42434C5.81968 3.315 5.96006 3.25643 6.11559 3.25643C6.26734 3.25643 6.4115 3.315 6.52152 3.42434L9.78035 6.70829L15.0158 1.1558H11.8403C11.5254 1.1558 11.2674 0.898078 11.2674 0.5779C11.2674 0.26162 11.5254 0 11.8403 0H16.4233C16.742 0.00390471 17 0.261621 17 0.581819H17Z" fill="#003D9D"/>
              </svg>`
            } else {
              return `<svg class="sparkline" width="25" height=15 viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 9.41818V4.80674C17 4.49046 16.742 4.22884 16.4271 4.22884C16.1122 4.22884 15.8543 4.48656 15.8543 4.80674V7.99692L10.1901 2.06958C10.0839 1.96025 9.93972 1.90168 9.78419 1.90168C9.63244 1.90168 9.48828 1.96025 9.37826 2.06958L6.11944 5.35353L0.971201 0.167904C0.86118 0.0585697 0.720802 0 0.565271 0C0.413518 0 0.26936 0.0585717 0.15934 0.167904C0.0531121 0.273332 0 0.409992 0 0.566192C0 0.777052 0.0872582 0.909822 0.15934 0.983993L5.70966 6.57566C5.81968 6.685 5.96006 6.74357 6.11559 6.74357C6.26734 6.74357 6.4115 6.685 6.52152 6.57566L9.78035 3.29171L15.0158 8.8442H11.8403C11.5254 8.8442 11.2674 9.10192 11.2674 9.4221C11.2674 9.73838 11.5254 10 11.8403 10H16.4233C16.742 9.9961 17 9.73838 17 9.41818H17Z" fill="#FF8000"/>
              </svg>`  
            }
          })
      }
    )
}
function rewriteBarLabels(svg, data, x, y) {
  svg.selectAll("text.bar-label")
    .data(data)
    .attr("x", (d, i) => x(i) + (x.bandwidth() / 2))
    .attr("y", d => y(d.CASE_RATE_PER_100K) - 5)
    .attr("width", x.bandwidth() / 4)
    .html(d => {
      return `<tspan class="bold" dx="0em" dy="-1.2em">${parseFloat(d.CASE_RATE_PER_100K).toFixed(1)}</tspan>
      <tspan dx="-1em" dy="1.2em">${parseFloat(d.RATE_DIFF_30_DAYS).toFixed(1)}%</tspan>`
    })
    .attr('text-anchor','middle')

  svg.selectAll(".sparkline").remove()

  writeSparklines(svg, data, x, y);

}