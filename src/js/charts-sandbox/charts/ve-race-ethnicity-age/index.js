import template from "./template.js";
import getTranslations from './../../get-strings-list.js';
import getScreenResizeCharts from './../../get-window-size.js';
import rtlOverride from "./../../rtl-override.js";
import { reformatReadableDate } from "../../readable-date.js";

class CAGOVEquityVaccinesRaceEthnicityAge extends window.HTMLElement {
  connectedCallback() {
    console.log("Loading x CAGOVEquityVaccinesRaceEthnicityAge");
    this.translationsObj = getTranslations(this);
    this.innerHTML = template(this.translationsObj);
    // Settings and initial values
    let bars = 8;
    let groupHeight = 160;
    this.chartOptions = {
      // Data
      dataUrl: config.equityChartsSampleDataLoc+"vaccines_by_race_ethnicity_and_age_california.json", // Overwritten by county.
      state: 'California',
      // Style
      backgroundFill: '#F2F5FC',
      chartColors: ["#92C5DE", "#FFCF44"],
      // Breakpoints
      desktop: {
        fontSize: 14,
        height: 60+bars*groupHeight,
        width: 555,
        margin: {
          top: 100,
          right: 80,
          bottom: 80,
          left: 80,
        },
        // heightMultiplier: 100,
        // labelOffsets: [-52, -52, -57],
      },
      tablet: {
        fontSize: 14,
        height: 60+bars*groupHeight,
        width: 555,
        margin: {
          top: 100,
          right: 80,
          bottom: 80,
          left: 80,
        },
        // heightMultiplier: 100,
        // labelOffsets: [-52, -52, -57],
      },
      mobile: {
        fontSize: 12,
        height: 60+bars*(groupHeight-10),
        width: 440,
        margin: {
          top: 100,
          right: 80,
          bottom: 20,
          left: 80,
        },
        // heightMultiplier: 100,
        // labelOffsets: [-52, -52, -57],
      },
      retina: {
        fontSize: 12,
        height: 60+bars*(groupHeight-10),
        width: 320,
        margin: {
          top: 100,
          right: 80,
          bottom: 20,
          left: 80,
        },
        // heightMultiplier: 100,
        // labelOffsets: [-52, -52, -57],
      },
    };

    this.intFormatter = new Intl.NumberFormat('us', // forcing US to avoid mixed styles on translated pages
                  {style:'decimal', 
                   minimumFractionDigits:0,
                   maximumFractionDigits:0});


    getScreenResizeCharts(this);

    this.screenDisplayType = window.charts ? window.charts.displayType : 'desktop';

    this.chartBreakpointValues = this.chartOptions[this.screenDisplayType ? this.screenDisplayType : 'desktop'];
    this.dimensions = this.chartBreakpointValues;


    const handleChartResize = () => {
        getScreenResizeCharts(this);
        this.screenDisplayType = window.charts ? window.charts.displayType : 'desktop';
        this.chartBreakpointValues = this.chartOptions[this.screenDisplayType ? this.screenDisplayType : 'desktop'];
      };
  
    window.addEventListener('resize', handleChartResize);

    this.svg = d3
      .select(this.querySelector(".svg-holder"))
      .append("svg")
      .attr("viewBox", [0, 0, this.chartBreakpointValues.width, this.chartBreakpointValues.height])
      .append("g")
      .attr(
        "transform",
        "translate(0,0)"
      );

    this.color = d3
      .scaleOrdinal()
      .domain(["MIN","MAX"])
      .range(this.chartOptions.chartColors);



    // Set default values for data and labels
    this.dataUrl = this.chartOptions.dataUrl;
    this.county = this.chartOptions.county;
    this.state = this.chartOptions.state;
    this.selectedMetric = this.chartOptions.selectedMetric;


    this.retrieveData(this.dataUrl);
    // this.listenForLocations();
    this.classList.remove("d-none"); // this works
    if (this.querySelector('.d-none') !== null) { // this didn't seem to be working...
      this.querySelector('.d-none').classList.remove("d-none");
    }

    rtlOverride(this); // quick fix for arabic
  }

  getLegendText() {
    return "Number of people who have received vaccinations"
  }

  ariaLabel(d) {
    // this is currently the same as the tooltip with span tags removed...
    // placeholderCaseRate cases per 100K people. placeholderRateDiff30 change since previous week
    // ${parseFloat(d.CASE_RATE_PER_100K).toFixed(1)} cases per 100K people. ${parseFloat(d.RATE_DIFF_30_DAYS).toFixed(1)}% change since previous week
    let label = 'ARIA BAR LABEL';
    // let templateStr = this.translationsObj['ariaBarLabel']
    // let label = templateStr
    //               .replace('placeholderCaseRate', this.intFormatter.format(d.CASE_RATE_PER_100K))
    //               .replace('placeholderRateDiff30', parseFloat(d.RATE_DIFF_30_DAYS).toFixed(1) + '%');
    return label;
  }

  writeLegend(svg, data, x, y, ySubgroup) {
    const legendW = ySubgroup.bandwidth()*1.2;
    const legendY =  this.dimensions.margin.top/3;
    const legendText = this.getLegendText();

    svg.append("g")
      .attr("fill", "#92C5DE")
      .attr("class", "legend-block")
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
        .attr("y", legendY)
        .attr("x", 0)
        .attr("width", legendW)
        .attr("height", legendW);

    svg.append("g")
      .append("text")
      .text(legendText)
      .attr("class", "legend-caption")
      .attr("y", legendY+legendW/2.0)
      .attr("x", legendW*2)
      .attr('dominant-baseline','middle')
      .attr('text-anchor','start');
  }

  writeGroupCats(svg, data, x, y) {
      svg.append("g")
      .attr("class", "bar-cat-group")
      .selectAll(".bar-cat")
      .data(data)
      .enter()
          .append("text")
          .attr("class", "bar-cat")
          .attr("y", (d, i) => y(d))
          .attr("x", d => 0)
          // .attr("width", x.bandwidth() / 4)
          .html(d => {
          return `<tspan dx="0em" dy="-1em">${d}</tspan>`
          })
          .attr('text-anchor','start')
  }

  writeBars(svg, data, subcats, x, y, ySubgroup) {
    let max_x_domain = x.domain()[1];
    console.log("left margin",this.dimensions.margin.left);
    console.log("right margin",this.dimensions.margin.right);
    console.log("width",this.dimensions.width);
    console.log("Range 0 -> ",d3.max(data, d => d.METRIC_VALUE));
    console.log("max_x_domain",max_x_domain);
    console.log("x(0)",x(0));
    console.log("x(max_x_domain)",x(max_x_domain));
      let groups = svg.append("g")
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
          .attr("transform", function(d, i) { return "translate(0, " + y(d[0]) + ")"; })
        .selectAll("g")
        .data(d => subcats.map(  (key, i) => { return {key: key, value: d[i+1]}; } )  )
        // at this point data is an array of key,value pairs
        // .data(function(d, i) { console.log("d is ",d); return d })
        .enter()
          .append("g");

      groups.append("rect")
            .attr("fill", "#f2f5fc")
            .attr('class','barshere')
            .attr("y", (d, i) => ySubgroup(d.key) )
            .attr("x", d => x(0))
            .attr("width", x(max_x_domain)-x(0))
            // .attr("width", function(d) { console.log("D.v",d.value); return x(d.value)}) // max_x_domain
            .attr("height", ySubgroup.bandwidth());
          // .append("g")
          //   .selectAll("rect")
          //   // .data(data)
          //   .enter()
      groups.append("rect")
            .attr("fill", "#92C5DE")
            .attr('class','barshere')
            .attr("y", (d, i) => ySubgroup(d.key))
            .attr("x", d => x(0))
            .attr("width", d => x(d.value)-x(0))
            .attr("height", ySubgroup.bandwidth())
            .attr("id", (d, i) => "barid-"+i)
            .attr("tabindex", "0")
            .attr("aria-label", (d, i) => `${this.ariaLabel(d)}`)
            .on("mouseover focus", function(event, d, i) {
              d3.select(this).style("fill", "#003D9D");
              // problem the svg is not the width in px in page as the viewbox width
            })
            .on("mouseout blur", function(d) {
              d3.select(this).style("fill", "#92C5DE");
              // if (tooltip !== null) { // @TODO Q: why is tooltip coming null
              //   tooltip.style.visibility = "hidden";
              // }
            });
      // bar values
      groups.append("text")
            .attr("class", "bar-value-text")
            .attr("y", (d, i) => ySubgroup(d.key)+ySubgroup.bandwidth()/2)
            .attr("x", d => x(max_x_domain))
            // .attr("width", x.bandwidth() / 4)
            .html(d => {
              return `<tspan dx="1.5em">${this.intFormatter.format(d.value)}</tspan>`
            })
            .attr('dominant-baseline','middle')
            .attr('text-anchor','start')
      // bar labels
      groups.append("text")
            .attr("class", "bar-label-text")
            .attr("y", (d, i) => ySubgroup(d.key)+ySubgroup.bandwidth()/2)
            .attr("x", d => 0)
            // .attr("width", x.bandwidth() / 4)
            .html(d => {
              return `<tspan>${ d.key }</tspan>`
            })
            .attr('dominant-baseline','middle')
            .attr('text-anchor','start')

    }

  renderChart() {
    // Exclude Other & Unknown categories from displaying for this chart.
    let data = this.alldata;
    let categories = [];
    let subcategories = [];
    let dlines = [];
    data.forEach(d => {
      if (!subcategories.includes(d.SUBCAT)) {
        subcategories.push(d.SUBCAT);
      }
      if (!categories.includes(d.CATEGORY)) {
        categories.push(d.CATEGORY);
        dlines.push([d.CATEGORY]);
      }
      dlines[dlines.length-1].push(d.METRIC_VALUE);
    });
    // Filter and sort here...
    // console.log("Categories",categories);
    // console.log("Sub Categories",subcategories);
    // console.log("dLines",dlines);
    // Y position of bars.
    this.y = d3
    .scaleBand()
    .domain(categories)
    .range([
        this.dimensions.margin.top,
        this.dimensions.height - (this.dimensions.margin.bottom),
    ])
    .paddingInner(.37)
    .paddingOuter(0);

    this.ySubgroup = d3
    .scaleBand()
    .domain(subcategories)
    .range([0, this.y.bandwidth()])
    .paddingInner(4.5/10.0)
  
    // Position for labels.
    this.yAxis = (g) =>
      g
        .attr("class", "bar-label")
        .attr("transform", "translate(5," + -32 + ")")
        .call(d3.axisLeft(this.y).tickSize(0))
        .call((g) => g.selectAll(".domain").remove());
       

    // let max_xdomain = d3.max(data, (d) => d3.max(d, (d) => d.METRIC_VALUE));
    this.max_x_domain = 
    this.x = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.METRIC_VALUE)]).nice()
      .range([this.dimensions.margin.left, this.dimensions.width - this.dimensions.margin.right]);

    // // ?
    // this.xAxis = (g) =>
    //   g
    //     .attr("transform", "translate(0," + this.dimensions.width + ")")
    //     .call(d3.axisBottom(this.x).ticks(width / 50, "s"))
    //     .remove();
    this.writeBars(this.svg, dlines, subcategories, this.x, this.y, this.ySubgroup);
    this.writeGroupCats(this.svg, categories, this.x, this.y);
    this.writeLegend(this.svg, dlines, this.x, this.y, this.ySubgroup);

        // Write remaining stuff...
    this.classList.remove('d-none')
  }


  retrieveData(url) {
    window
      .fetch(url)
      .then((response) => response.json())
      .then(
        function (alldata) {
          this.alldata = alldata;
          this.renderChart();
        }.bind(this)
      );
  }


}

window.customElements.define(
  "cagov-chart-ve-race-ethnicity-age",
  CAGOVEquityVaccinesRaceEthnicityAge
);
