import data from './social-income.json';
// import datacrowding from './test.json';
import datacrowding from './social-crowding.json';
import datahealthcare from './social-healthcare.json';
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
    data.sort(sortedOrder)
    datacrowding.sort(sortedOrder)
    datahealthcare.sort(sortedOrder)

    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.CASE_RATE_PER_100K)]).nice()
        .range([height - margin.bottom, margin.top])
    
    let x = d3.scaleBand()
      .domain(d3.range(data.length))
      .range([margin.left, width - margin.right])
      .padding(0.1)

    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("class","equity-bar-chart");
    
    writeBars(svg, data, x, y, width);
    writeBarLabels(svg, data, x, y);
    let xAxis = writeXAxis(data, height, margin, x);

    svg.append("g")
      .attr("class", "xaxis")
      .call(xAxis);
  
    svg.append("path")
      .attr("d", d3.line()([[0, height/2], [width, height/2]]))
      .attr("stroke", "black")
      .style("stroke-dasharray", ("3, 3"));
    
    svg.append("text")
      .text(`state wide case rate ${parseFloat(data[0].STATE_CASE_RATE_PER_100K).toFixed(2)}%`)
      .attr("y", height / 2 - 5)
      .attr("x", width - 5)
      .attr('text-anchor','end')
      .attr('class','label');
    
    writeLegend(svg, ["Cases per 100,000 people"]);

    // where tf did tooltip reference go?
    // initial average bar is faked

    this.innerHTML = template();
    document.querySelector('.svg-holder').appendChild(svg.node());
    window.tooltip = this.querySelector('.bar-overlay')

    this.applyListeners(svg, x, y, height, margin, xAxis)

    /*
    this.menuContentFile = this.dataset.json;
    window.fetch(this.menuContentFile)
      .then(response => response.json())
      .then(data => {
        this.innerHTML = navTemplate(data, this.dataset);
        this.querySelector('.open-menu').addEventListener('click', this.toggleMainMenu.bind(this));
        this.querySelector('.expanded-menu-close-mobile').addEventListener('click', this.toggleMainMenu.bind(this));
        if (window.innerWidth < 1024) {
          this.expansionListeners(); // everything is expanded by default on big screens
        }
      });
      */
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

function writeXAxis(data, height, margin, x) {
  let xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickFormat(i => data[i].SOCIAL_TIER).tickSizeOuter(0))
    .style('font-weight','bold')
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
        d3.select(this).style("fill", "steelblue");
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
          <div class="chart-tooltip-desc"><span class="highlight-data">${parseFloat(d.CASE_RATE_PER_100K).toFixed(2)}</span> cases per 100,000 people</div>
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
        .attr("width", x.bandwidth())
        .text(d => parseFloat(d.CASE_RATE_PER_100K).toFixed(2))
        .attr('text-anchor','middle')
    }
  )
}
function rewriteBarLabels(svg, data, x, y) {
  svg.selectAll("text.bar-label")
  .data(data)
  .attr("x", (d, i) => x(i) + (x.bandwidth() / 2))
  .attr("y", d => y(d.CASE_RATE_PER_100K) - 5)
  .attr("width", x.bandwidth())
  .text(d => parseFloat(d.CASE_RATE_PER_100K).toFixed(2))
}