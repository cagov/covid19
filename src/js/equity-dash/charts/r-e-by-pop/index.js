import template from './template.js';

class CAGOVEquityREPop extends window.HTMLElement {
  connectedCallback () {
    this.dimensions = ({
      height: 700,
      width: 600,
      margin: {
        top: 20,
        right: 30,
        bottom: 20,
        left: 30
      }
    })

    let description = "Compare the percentage of each race and ethnicity’s share of statewide cases to their percentage of California’s population."
    this.chartTitle = "Cases relative to percentage of population in California"

    this.innerHTML = template(this.chartTitle, description);

    this.svg = d3
      .select(this.querySelector('.svg-holder'))
      .append("svg")
      .attr("width", this.dimensions.width)
      .attr("height", this.dimensions.height)
      .append("g")
      .attr(
        "transform",
        "translate(" + this.dimensions.margin.left + "," + this.dimensions.margin.top + ")"
      );

    this.tooltip = d3
      .select("cagov-chart-re-pop")
      .append("div")
      .attr("class", "equity-tooltip equity-tooltip--re100k")
      .text("an empty tooltip");

      this.subgroups1 = ["METRIC_TOTAL_PERCENTAGE", "METRIC_TOTAL_DELTA"]
    this.subgroups2 = ["POPULATION_PERCENTAGE", "POPULATION_PERCENTAGE_DELTA"]
    
    this.color2 = d3
      .scaleOrdinal()
      .domain(this.subgroups2)
      .range(['#92C5DE', '#F2F5FC'])

    this.color1 = d3
      .scaleOrdinal()
      .domain(this.subgroups1)
      .range(['#FFCF44', '#F2F5FC'])

    this.render('https://files.covid19.ca.gov/data/to-review/equitydash/cumulative-california.json');
    this.listenForLocations();
    this.resetTitle('California')
  }

  listenForLocations() {
    let searchElement = document.querySelector('cagov-county-search');
    searchElement.addEventListener('county-selected', function (e) {
      this.county = e.detail.county;

      this.render('https://files.covid19.ca.gov/data/to-review/equitydash/cumulative-'+this.county.toLowerCase().replace(/ /g,'')+'.json')
      this.resetTitle(this.county)
    }.bind(this), false);
  }

  resetTitle(county) {
    this.querySelector('.chart-title').innerHTML = this.chartTitle.replace('California', county);
  }

  render(url) {
    
    window.fetch(url)
    .then(response => response.json())
    .then(function(alldata) {
      let data = alldata.filter(item => (item.METRIC === "cases" && item.DEMOGRAPHIC_SET_CATEGORY !== "Other" && item.DEMOGRAPHIC_SET_CATEGORY !== "Unknown"))
      data.forEach(d => {
        d.METRIC_VALUE_PER_100K_CHANGE_30_DAYS_AGO = d.METRIC_VALUE_PER_100K_DELTA_FROM_30_DAYS_AGO / d.METRIC_VALUE_PER_100K_30_DAYS_AGO;
      })

      data.sort(function(a, b) {
        return d3.descending(a.SORT_METRIC, b.SORT_METRIC);
      })
      // let groups = d3.map(dataSorted, d => d.DEMOGRAPHIC_SET_CATEGORY).keys()
      // don't know why the above never works, so keep hardcoding it
      // need to inherit this as a mapping of all possible values to desired display values becuase these differ in some tables
      let groups = ["Latino", "Native Hawaiian and other Pacific Islander", "American Indian", "African American", "Multi-Race", "White", "Asian American"]
  
      let stackedData1 = d3.stack().keys(this.subgroups1)(data)
      let stackedData2 = d3.stack().keys(this.subgroups2)(data);
  
      this.y = d3
        .scaleBand()
        .domain(groups)
        .range([this.dimensions.margin.top, this.dimensions.height - this.dimensions.margin.bottom])
        .padding([.5])     
  
      let yAxis = g =>
        g
          .attr("class", "bar-label")
          .attr("transform", "translate(4," + -30 + ")")
          .call(d3.axisLeft(this.y).tickSize(0))
          .call(g => g.selectAll(".domain").remove())
  
      let x2 = d3
        .scaleLinear()
        .domain([0, d3.max(stackedData2, d => d3.max(d, d => d[1]))])
        .range([0, this.dimensions.width - this.dimensions.margin.right - 40])
  
      let x1 = d3
        .scaleLinear()
        .domain([0, d3.max(stackedData1, d => d3.max(d, d => d[1]))])
        .range([0, this.dimensions.width - this.dimensions.margin.right - 40])
  
      let xAxis = g =>
        g
          .attr("transform", "translate(0," + this.dimensions.width + ")")
          .call(d3.axisBottom(x1).ticks(width / 50, "s"))
          .remove()    
  
      drawBars(this.svg, x1, x2, this.y, yAxis, stackedData1, stackedData2, this.color1, this.color2, data, this.tooltip)        
    }.bind(this));

  }
}
window.customElements.define('cagov-chart-re-pop', CAGOVEquityREPop);

function drawBars(svg, x1, x2, y, yAxis, stackedData1, stackedData2, color1, color2, data, tooltip) {
  svg.selectAll("g").remove();

  //yellow  bars
  svg
    .append("g")
    .selectAll("g")
    .data(stackedData1)
    .enter()
    .append("g")
    .attr("fill", d => color1(d.key))
    .selectAll("rect")

    // enter a second time = loop subgroup per subgroup to add yellow bars
    .data(d => d)
    .enter()
    .append("rect")
    .attr("x", d => x1(d[0]))
    .attr("y", d => y(d.data.DEMOGRAPHIC_SET_CATEGORY))
    .attr("width", d => x1(d[1]) - x1(d[0]))
    .attr("height", "10px")

    .on("mouseover", function(event, d) {
      d3.select(this).transition();
      //.style("fill", "steelblue");

      tooltip.html(`<div class="chart-tooltip">
        <div >${d.data.DEMOGRAPHIC_SET_CATEGORY +
          " people make up"}<span class="highlight-data"> ${d.data.POPULATION_PERCENTAGE ? parseFloat(d.data.POPULATION_PERCENTAGE).toFixed(1) + "%" : 0}</span> of California's population and 
<span class="highlight-data"> ${
        d.data.METRIC_TOTAL_PERCENTAGE
          ? parseFloat(d.data.METRIC_TOTAL_PERCENTAGE).toFixed(1) + "%"
          : 0
      }</span> of cases statewide</div>
      </div>`);
      tooltip.style("visibility", "visible");
    })
    .on("mousemove", function() {
      return tooltip
        .style("top", parseInt(this.getBoundingClientRect().y) - 10 + "px")
        .style("left", parseInt(this.getBoundingClientRect().x) + 10 + "px");
    })
    .on("mouseout", function(d) {
      d3.select(this).transition();
      //.attr("fill", d => color(d.key));
      //.style("fill", "skyblue");
      tooltip.style("visibility", "hidden");
    });

  //blue bars
  svg
    .append("g")
    .selectAll("g")
    .data(stackedData2)
    .enter()
    .append("g")
    .attr("fill", d => color2(d.key))
    .selectAll("rect")

    // enter a second time = loop subgroup per subgroup to add blue bars
    .data(d => d)
    .enter()
    .append("rect")
    .attr("x", d => x2(d[0]))
    .attr("y", d => y(d.data.DEMOGRAPHIC_SET_CATEGORY) + 20)
    .attr("width", d => x2(d[1]) - x2(d[0]))
    .attr("height", "10px")

    .on("mouseover", function(event, d) {
      d3.select(this).transition();
      tooltip.html(`<div class="chart-tooltip">
        <div >${d.data.DEMOGRAPHIC_SET_CATEGORY +
          " people make up"}<span class="highlight-data"> ${d.data.POPULATION_PERCENTAGE ? parseFloat(d.data.POPULATION_PERCENTAGE).toFixed(1) + "%" : 0}</span> of California's population and 
<span class="highlight-data"> ${
        d.data.METRIC_TOTAL_PERCENTAGE
          ? parseFloat(d.data.METRIC_TOTAL_PERCENTAGE).toFixed(1) + "%"
          : 0
      }</span> of cases statewide</div>
      </div>`);
      tooltip.style("visibility", "visible");
    })
    .on("mousemove", function() {
      return tooltip
        .style("top", parseInt(this.getBoundingClientRect().y) - 10 + "px")
        .style("left", parseInt(this.getBoundingClientRect().x) + 10 + "px");
    })
    .on("mouseout", function(d) {
      d3.select(this).transition();
      //.attr("fill", d => color(d.key));
      //.style("fill", "skyblue");
      tooltip.style("visibility", "hidden");
    });

  // svg.append("g").call(xAxis);

  svg.append("g").call(yAxis);

  //end of bar labels yellow
  svg
    .append("g")
    .attr("class", "bars")
    .selectAll(".bars")
    .data(data)
    .join(enter => {
      enter
        .append("text")
        .attr("class", "bars")
        .attr("y", d => y(d.DEMOGRAPHIC_SET_CATEGORY) + 8)
        .attr("x", d => x1(100) + 5)
        .attr("height", y.bandwidth())
        .text(d =>
          d.METRIC_TOTAL_PERCENTAGE
            ? parseFloat(d.METRIC_TOTAL_PERCENTAGE).toFixed(1) + "%"
            : 0 + "%"
        )
        .attr('text-anchor', 'end');
    });

  //end of bar labels blue
  svg
    .append("g")
    .attr("class", "bars")
    .selectAll(".bars")
    .data(data)
    .join(enter => {
      enter
        .append("text")
        .attr("class", "bars")
        .attr("y", d => y(d.DEMOGRAPHIC_SET_CATEGORY) + 28)
        .attr("x", d => x2(100) + 5)
        .attr("height", y.bandwidth())
        .text(d =>
          d.POPULATION_PERCENTAGE
            ? parseFloat(d.POPULATION_PERCENTAGE).toFixed(1) + "%"
            : 0 + "%"
        )
        .attr('text-anchor', 'end');
    });

  //% change since previous month labels
  svg
    .append("g")
    .attr("class", "change-from-month-labels")
    .selectAll(".change-from-month-labels")
    .data(data)
    .join(enter => {
      enter
        .append("text")
        .attr("class", "change-from-month-labels")
        .attr("y", d => y(d.DEMOGRAPHIC_SET_CATEGORY) + 47)
        .attr("x", d => x2(1) + 20)
        .attr("height", y.bandwidth())

        .html(d => {
          if (
            parseFloat(
              d.METRIC_VALUE_PERCENTAGE_DELTA_FROM_30_DAYS_AGO
            ).toFixed(1) == 0.0
          ) {
            return `<tspan class="highlight-data">0%</tspan>  change in cases sinice previous month`;
          } else {
            return `<tspan class="highlight-data">${parseFloat(
              d.METRIC_VALUE_PERCENTAGE_DELTA_FROM_30_DAYS_AGO
            ).toFixed(1)}%</tspan> change in cases since previous month`;
          }
        })
        .attr('text-anchor', 'end');
    });

  //arrows
  svg
    .append("g")
    .attr("class", "change-from-month-labels")
    .selectAll(".change-from-month-labels")
    .data(data)
    .join(enter => {
      enter
        .append("svg")

        .attr("y", d => y(d.DEMOGRAPHIC_SET_CATEGORY) + 35)
        .attr("x", d => x2(1))
        .html(d => {
          if (
            parseFloat(d.METRIC_VALUE_PERCENTAGE_DELTA_FROM_30_DAYS_AGO) > 0
          ) {
            return `<svg width="15" height="10" viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M17 0.581819V5.19326C17 5.50954 16.742 5.77116 16.4271 5.77116C16.1122 5.77116 15.8543 5.51344 15.8543 5.19326V2.00308L10.1901 7.93042C10.0839 8.03975 9.93972 8.09832 9.78419 8.09832C9.63244 8.09832 9.48828 8.03975 9.37826 7.93042L6.11944 4.64647L0.971201 9.8321C0.86118 9.94143 0.720802 10 0.565271 10C0.413518 10 0.26936 9.94143 0.15934 9.8321C0.0531121 9.72667 0 9.59001 0 9.43381C0 9.22295 0.0872582 9.09018 0.15934 9.01601L5.70966 3.42434C5.81968 3.315 5.96006 3.25643 6.11559 3.25643C6.26734 3.25643 6.4115 3.315 6.52152 3.42434L9.78035 6.70829L15.0158 1.1558H11.8403C11.5254 1.1558 11.2674 0.898078 11.2674 0.5779C11.2674 0.26162 11.5254 0 11.8403 0H16.4233C16.742 0.00390471 17 0.261621 17 0.581819H17Z" fill="#FF8000"/>
  </svg>`;
          } else if (
            parseFloat(
              d.METRIC_VALUE_PERCENTAGE_DELTA_FROM_30_DAYS_AGO
            ).toFixed(1) == 0
          ) {
            return `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.4155 8.8403L13.0689 12.013C12.8394 12.2306 12.4721 12.2234 12.2554 11.9949C12.0388 11.7663 12.0483 11.4018 12.2807 11.1815L14.5958 8.98667L1.0023 8.9417L0.784831 8.9417C0.629791 8.93708 0.495915 8.90016 0.388909 8.7873C0.284502 8.67717 0.227827 8.53225 0.231476 8.37719C0.2349 8.22757 0.297533 8.095 0.410888 7.98753C0.563911 7.84246 0.720296 7.81444 0.823716 7.81572L1.0023 7.816L14.6338 7.79526L12.449 5.49078C12.2324 5.26226 12.2419 4.89773 12.4743 4.67745C12.7038 4.45985 13.0712 4.46706 13.2878 4.69558L16.4409 8.02148C16.6573 8.25543 16.6478 8.62 16.4155 8.8403Z" fill="#1F2574"/>
</svg>`;
          } else {
            return `<svg width="15" height=10 viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M17 9.41818V4.80674C17 4.49046 16.742 4.22884 16.4271 4.22884C16.1122 4.22884 15.8543 4.48656 15.8543 4.80674V7.99692L10.1901 2.06958C10.0839 1.96025 9.93972 1.90168 9.78419 1.90168C9.63244 1.90168 9.48828 1.96025 9.37826 2.06958L6.11944 5.35353L0.971201 0.167904C0.86118 0.0585697 0.720802 0 0.565271 0C0.413518 0 0.26936 0.0585717 0.15934 0.167904C0.0531121 0.273332 0 0.409992 0 0.566192C0 0.777052 0.0872582 0.909822 0.15934 0.983993L5.70966 6.57566C5.81968 6.685 5.96006 6.74357 6.11559 6.74357C6.26734 6.74357 6.4115 6.685 6.52152 6.57566L9.78035 3.29171L15.0158 8.8442H11.8403C11.5254 8.8442 11.2674 9.10192 11.2674 9.4221C11.2674 9.73838 11.5254 10 11.8403 10H16.4233C16.742 9.9961 17 9.73838 17 9.41818H17Z" fill="#003D9D"/>
  </svg>`;
          }
        });
    });

  //legend
  svg
    .append("rect")
    .attr("x", 0)
    .attr("y", -20)
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", "#FFCF44");
  svg
    .append("rect")
    .attr("x", 170)
    .attr("y", -20)
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", "#92C5DE");

  svg
    .append("text")
    .attr("x", 20)
    .attr("y", -12)
    .style("font-family", "arial")
    .style("font-size", "12px")
    .attr("dy", "0.35em")
    .text("% of cases statewide");
  svg
    .append("text")
    .attr("x", 190)
    .attr("y", -12)
    .style("font-family", "arial")
    .style("font-size", "12px")
    .attr("dy", "0.35em")
    .text("% of state population");
}