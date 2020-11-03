import template from './template.js';

class CAGOVEquityRE100K extends window.HTMLElement {
  connectedCallback () {

    this.dimensions = ({
      height: 600,
      width: 600,
      margin: {
        top: 20,
        right: 30,
        bottom: 20,
        left: 30
      }
    })

    this.innerHTML = template('this is the chart title');

    this.tooltip = d3
      .select("cagov-chart-re-100k")
      .append("div")
      .attr("class", "equity-tooltip equity-tooltip--re100k")
      .text("an empty tooltip");

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

    this.subgroups = ["METRIC_VALUE_PER_100K", "WORST_VALUE_DELTA"]
    this.color = d3
      .scaleOrdinal()
      .domain(this.subgroups)
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
    this.querySelector('.chart-title').innerHTML = 'reporting by race and ethnicity in '+county
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
        return d3.descending(a.METRIC_VALUE_PER_100K, b.METRIC_VALUE_PER_100K);
      })
      // let groups = d3.map(dataSorted, d => d.DEMOGRAPHIC_SET_CATEGORY).keys()
      // don't know why the above never works, so keep hardcoding it
      // need to inherit this as a mapping of all possible values to desired display values becuase these differ in some tables
      let groups = ["Native Hawaiian and other Pacific Islander", "Latino", "American Indian", "African American", "Multi-Race", "White", "Asian American"]


      let stackedData = d3.stack().keys(this.subgroups)(data)

      this.y = d3
        .scaleBand()
        .domain(groups)
        .range([this.dimensions.margin.top, this.dimensions.height - this.dimensions.margin.bottom])
        .padding([.6])      

      let yAxis = g =>
        g
          .attr("class", "bar-label")
          .attr("transform", "translate(5," + -25 + ")")
          .call(d3.axisLeft(this.y).tickSize(0))
          .call(g => g.selectAll(".domain").remove())  


      let x = d3
        .scaleLinear()
        .domain([0, d3.max(stackedData, d => d3.max(d, d => d[1]))])
        .range([0, this.dimensions.width - this.dimensions.margin.right - 50])


      let xAxis = g =>
        g
          .attr("transform", "translate(0," + this.dimensions.width + ")")
          .call(d3.axisBottom(x).ticks(width / 50, "s"))
          .remove()      


      drawBars(this.svg, x, this.y, yAxis, stackedData, this.color, data, this.tooltip)  
    }.bind(this));

  }
}
window.customElements.define('cagov-chart-re-100k', CAGOVEquityRE100K);

function drawBars(svg, x, y, yAxis, stackedData, color, data, tooltip) {
  svg.selectAll("g").remove();

  svg
    .append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter()
    .append("g")
    .attr("fill", d => color(d.key))
    .selectAll("rect")

    // enter a second time = loop subgroup per subgroup to add all rectangles
    .data(d => d)
    .enter()
    .append("rect")
    .attr("x", d => x(d[0]))
    .attr("y", d => y(d.data.DEMOGRAPHIC_SET_CATEGORY))
    .attr("width", d => x(d[1]) - x(d[0]))
    .attr("height", "10px")

    .on("mouseover", function(event, d) {
      d3.select(this).transition();

      tooltip.html(`<div class="chart-tooltip">
        <div ><span class="highlight-data">${
          d.data.DEMOGRAPHIC_SET_CATEGORY
        }</span> people have <span class="highlight-data">${d.data.METRIC_VALUE_PER_100K ? parseFloat(d.data.METRIC_VALUE_PER_100K).toFixed(0) : 0}</span> cases for 100K people of the same race and enthnicity</div>
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

  //end of bar labels
  svg
    .append("g")
    .attr("class", "bars")
    .selectAll(".bars")
    .data(data)
    .join(enter => {
      enter
        .append("text")
        .attr("class", "bars")
        .attr("y", d => y(d.DEMOGRAPHIC_SET_CATEGORY) + 9)
        .attr("x", d => x(200) + 95)
        .attr("height", y.bandwidth())
        .text(d => parseFloat(d.METRIC_VALUE_PER_100K).toFixed(1))
        .attr('text-anchor', 'end');
    });

  //times the lowest rate labels
  svg
    .append("g")
    .attr("class", "more-than-labels")
    .selectAll(".more-than-labels")
    .data(data)
    .join(enter => {
      enter
        .append("text")
        .attr("class", "more-than-labels")
        .attr("y", d => y(d.DEMOGRAPHIC_SET_CATEGORY) + 25)
        .attr("x", d => x(200) + 50)
        .attr("height", y.bandwidth())

        .html(d => {
          if (parseFloat(d.PCT_FROM_LOWEST_VALUE).toFixed(1) > 1) {
            return `<tspan class="highlight-data">${parseFloat(
              d.PCT_FROM_LOWEST_VALUE
            ).toFixed(1)}</tspan> times the lowest rate`;
          } else {
            return `Lowest rate`;
          }
        })
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
        .attr("y", d => y(d.DEMOGRAPHIC_SET_CATEGORY) + 25)
        .attr("x", d => x(60) + 47)
        .attr("height", y.bandwidth())
        .html(
          d =>
            `<tspan class="highlight-data">
            ${parseFloat(
              d.METRIC_VALUE_PER_100K_CHANGE_30_DAYS_AGO * 100
            ).toFixed(1)}%</tspan>
             change since previous month`
        )
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
        .attr("y", d => y(d.DEMOGRAPHIC_SET_CATEGORY) + 15)
        .attr("x", d => x(1))
        .html(d => {
          if (
            parseFloat(d.METRIC_VALUE_PER_100K_CHANGE_30_DAYS_AGO * 100) > 0
          ) {
            return `<svg width="15" height="10" viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M17 0.581819V5.19326C17 5.50954 16.742 5.77116 16.4271 5.77116C16.1122 5.77116 15.8543 5.51344 15.8543 5.19326V2.00308L10.1901 7.93042C10.0839 8.03975 9.93972 8.09832 9.78419 8.09832C9.63244 8.09832 9.48828 8.03975 9.37826 7.93042L6.11944 4.64647L0.971201 9.8321C0.86118 9.94143 0.720802 10 0.565271 10C0.413518 10 0.26936 9.94143 0.15934 9.8321C0.0531121 9.72667 0 9.59001 0 9.43381C0 9.22295 0.0872582 9.09018 0.15934 9.01601L5.70966 3.42434C5.81968 3.315 5.96006 3.25643 6.11559 3.25643C6.26734 3.25643 6.4115 3.315 6.52152 3.42434L9.78035 6.70829L15.0158 1.1558H11.8403C11.5254 1.1558 11.2674 0.898078 11.2674 0.5779C11.2674 0.26162 11.5254 0 11.8403 0H16.4233C16.742 0.00390471 17 0.261621 17 0.581819H17Z" fill="#FF8000"/>
  </svg>`;
          } else if (
            parseFloat(d.METRIC_VALUE_PER_100K_CHANGE_30_DAYS_AGO * 100) == 0
          ) {
            return `<svg width="15" height=10 viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M17 9.41818V4.80674C17 4.49046 16.742 4.22884 16.4271 4.22884C16.1122 4.22884 15.8543 4.48656 15.8543 4.80674V7.99692L10.1901 2.06958C10.0839 1.96025 9.93972 1.90168 9.78419 1.90168C9.63244 1.90168 9.48828 1.96025 9.37826 2.06958L6.11944 5.35353L0.971201 0.167904C0.86118 0.0585697 0.720802 0 0.565271 0C0.413518 0 0.26936 0.0585717 0.15934 0.167904C0.0531121 0.273332 0 0.409992 0 0.566192C0 0.777052 0.0872582 0.909822 0.15934 0.983993L5.70966 6.57566C5.81968 6.685 5.96006 6.74357 6.11559 6.74357C6.26734 6.74357 6.4115 6.685 6.52152 6.57566L9.78035 3.29171L15.0158 8.8442H11.8403C11.5254 8.8442 11.2674 9.10192 11.2674 9.4221C11.2674 9.73838 11.5254 10 11.8403 10H16.4233C16.742 9.9961 17 9.73838 17 9.41818H17Z" fill="none"/>
  </svg>`;
          } else {
            return `<svg width="15" height=10 viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M17 9.41818V4.80674C17 4.49046 16.742 4.22884 16.4271 4.22884C16.1122 4.22884 15.8543 4.48656 15.8543 4.80674V7.99692L10.1901 2.06958C10.0839 1.96025 9.93972 1.90168 9.78419 1.90168C9.63244 1.90168 9.48828 1.96025 9.37826 2.06958L6.11944 5.35353L0.971201 0.167904C0.86118 0.0585697 0.720802 0 0.565271 0C0.413518 0 0.26936 0.0585717 0.15934 0.167904C0.0531121 0.273332 0 0.409992 0 0.566192C0 0.777052 0.0872582 0.909822 0.15934 0.983993L5.70966 6.57566C5.81968 6.685 5.96006 6.74357 6.11559 6.74357C6.26734 6.74357 6.4115 6.685 6.52152 6.57566L9.78035 3.29171L15.0158 8.8442H11.8403C11.5254 8.8442 11.2674 9.10192 11.2674 9.4221C11.2674 9.73838 11.5254 10 11.8403 10H16.4233C16.742 9.9961 17 9.73838 17 9.41818H17Z" fill="#003D9D"/>
  </svg>`;
          }
        });
    });

  /*reference line for statewide rate
  svg
    .append("path")
    .attr(
      "d",
      d3.line()([
        [x(data[0].STATE_CASE_RATE_PER_100K), 30],
        [x(data[0].STATE_CASE_RATE_PER_100K), 650]
      ])
    )
    .attr("stroke", "black")
    .style("stroke-dasharray", "3, 3")
    .style("stroke", "#1F2574");
*/
  svg
    .append("g")
    .append("text")
    .text(
      "Statewide case rate: " +
        parseFloat(data[0].STATE_CASE_RATE_PER_100K).toFixed(1)
    )
    .attr("x", x(data[0].STATE_CASE_RATE_PER_100K))
    .attr("y", 25)
    .attr('text-anchor', 'middle')
    .attr('class', 'label');

  //legend
  svg
    .append("rect")
    .attr("x", 0)
    .attr("y", -20)
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", "#FFCF44");

  svg
    .append("text")
    .attr("x", 25)
    .attr("y", -12)
    .style("font-family", "arial")
    .style("font-size", "12px")
    .attr("dy", "0.35em")
    .text("Cases per 100k people");
}