import template from "./template.js";
import getTranslations from "./../../../common/get-strings-list.js";
import getScreenResizeCharts from "./../../../common/get-window-size.js";
import rtlOverride from "./../../../common/rtl-override.js";
import formatValue from "./../../../common/value-formatters.js";

class CAGovVaccinesHPIDose extends window.HTMLElement {
  connectedCallback() {
    console.log("Loading CAGovVaccinationGroupsAge");
    this.translationsObj = getTranslations(this);
    console.log("Translations",this.translationsObj);
    this.innerHTML = template(this.translationsObj);
    // Settings and initial values
    this.barColor = '#013d9c';

    this.nbr_bars = 4;
    this.chartOptions = {
      // Data
      dataUrl:
        // https://files.covid19.ca.gov/data/vaccine-hpi/vaccine-hpi.json
        config.chartsVHPIDataLoc + "vaccine-hpi.json", // Overwritten by county.
      // Breakpoints
      desktop: {
        bar_hspace: 120,
        fontSize: 14,
        height: 400,
        width: this.nbr_bars * 120,
        margin: {
          top: 70,
          right: 10,
          bottom: 52,
          left: 10,
        },
      },
      tablet: {
        bar_hspace: 120,
        fontSize: 14,
        height: 400,
        width: this.nbr_bars * 120,
        margin: {
          top: 70,
          right: 10,
          bottom: 52,
          left: 10,
        },
      },
      mobile: {
        bar_hspace: 90,
        fontSize: 12,
        height: 400,
        width: this.nbr_bars * 90,
        margin: {
          top: 70,
          right: 10,
          bottom: 52,
          left: 10,
        },
      },
      retina: {
        bar_hspace: 90,
        fontSize: 12,
        height: 400,
        width: this.nbr_bars * 90,
        margin: {
          top: 70,
          right: 10,
          bottom: 52,
          left: 10,
        },
      },
    };

    getScreenResizeCharts(this);

    this.screenDisplayType = window.charts
      ? window.charts.displayType
      : "desktop";

    this.chartBreakpointValues = this.chartOptions[
      this.screenDisplayType ? this.screenDisplayType : "desktop"
    ];
    this.dimensions = this.chartBreakpointValues;

    const handleChartResize = () => {
      getScreenResizeCharts(this);
      this.screenDisplayType = window.charts
        ? window.charts.displayType
        : "desktop";
      this.chartBreakpointValues = this.chartOptions[
        this.screenDisplayType ? this.screenDisplayType : "desktop"
      ];
    };

    window.addEventListener("resize", handleChartResize);

    this.svg = d3
      .select(this.querySelector(".svg-holder"))
      .append("svg")
      .attr("viewBox", [
        0,
        0,
        this.chartBreakpointValues.width,
        this.chartBreakpointValues.height,
      ])
      .append("g")
      .attr("transform", "translate(0,0)");

    // Set default values for data and labels
    this.dataUrl = this.chartOptions.dataUrl;

    this.retrieveData(this.dataUrl);
    // this.listenForLocations();

    rtlOverride(this); // quick fix for arabic
  }

  getLegendText() {
    return [
      this.translationsObj.legendLabel1,
    ];
  }

  getChartTitle({
    chartTitle = "Temp Title",
  }) {
    return chartTitle;
  }

  ariaLabel(d) {
    let label = "ARIA BAR LABEL";
    return label;
  }

  writeBars(svg, data, yScale, xScale) {
    let groups = svg.append("g")
      .selectAll("g")
      .data(data)
      .join("g");

    groups
        .append("rect")
            .attr("class","main-bar")
            .attr("fill", d=>this.barColor)
            .attr("x", (d,i) => xScale(i))
            .attr("y", d => yScale(d.COMBINED_DOSES_RATIO))
            .attr("width", d => xScale.bandwidth())
            .attr("height", d => (yScale(0)-yScale(d.COMBINED_DOSES_RATIO)));

    groups
        .append("text")
        .attr("class", "bar-upper-label-1")
        .attr("y", (d, i) => yScale(d.COMBINED_DOSES_RATIO) - 18)
        .attr("x", (d, i) => xScale(i)+xScale.bandwidth()/2)
        .text(d => formatValue(d.COMBINED_DOSES_RATIO,{format:'percent'}))
        .attr('text-anchor','middle');

    groups
        .append("text")
        .attr("class", "bar-upper-label-2")
        .attr("y", (d, i) => yScale(d.COMBINED_DOSES_RATIO) - 4)
        .attr("x", (d, i) => xScale(i)+xScale.bandwidth()/2)
        .text((d,i) => formatValue(d.COMBINED_DOSES,{format:'integer'}))
        .attr('text-anchor','middle');

    
    // bottom caption
    groups
      .append("text")
      .attr("class", "bar-lower-label")
      .attr("y", (d, i) => yScale(0) + 20)
      .attr("x", (d, i) => xScale(i)+xScale.bandwidth()/2)
      // .attr("width", x.bandwidth() / 4)
      .text(d =>  this.translationsObj.barLabel.replace('{N}',d.HPIQUARTILE))
      .attr('text-anchor','middle')
  }

  writeLegend(svg, data, yScale, xScale) {
    const legendW = 12;
    const legendY =  this.dimensions.margin.top/3;
    const legendText = this.getLegendText();
    const legend2X = this.dimensions.width*0.4;

    let group = svg.append("g")

    group
      .append("rect")
        .attr("fill", this.barColor)
        .attr("class", "legend-block")
        .attr("y", legendY)
        .attr("x", 0)
        .attr("width", legendW)
        .attr("height", legendW);

    group
      .append("text")
      .text(legendText[0]) // Legend label 
      .attr("class", "legend-caption")
      .attr("y", legendY+legendW/2.0 + 1)
      .attr("x", legendW*1.5)
      .attr('dominant-baseline','middle')
      .attr('text-anchor','start');
  }

  writeExtras(svg, data, yScale, xScale) {
    const bottomAnnotationY = this.dimensions.height-this.dimensions.margin.bottom*3.0/7.0;
    const legendY =  this.dimensions.margin.top/3;
    const legendText = this.getLegendText();
    const legend2X = this.dimensions.width*0.4;

    let group = svg.append("g")
    let arrowSize = 3;

    group
        .append('line')
        .attr("stroke", "#000000")
        .attr("x1", 0)
        .attr("y1", bottomAnnotationY)
        .attr("y2", bottomAnnotationY)
        .attr("x2", this.dimensions.width)
        .attr("stroke-width",1);


    group
        .append('line')
        .attr("stroke", "#000000")
        .attr("x1", this.dimensions.width)
        .attr("y1", bottomAnnotationY)
        .attr("x2", this.dimensions.width-arrowSize)
        .attr("y2", bottomAnnotationY-arrowSize)
        .attr("stroke-width",1);
    group
        .append('line')
        .attr("stroke", "#000000")
        .attr("x1", this.dimensions.width)
        .attr("y1", bottomAnnotationY)
        .attr("x2", this.dimensions.width-arrowSize)
        .attr("y2", bottomAnnotationY+arrowSize)
        .attr("stroke-width",1);


    group
      .append("text")
      .text(this.translationsObj.annotationLeast) // Legend label 
      .attr("class", "bottom-annotation")
      .attr("y", bottomAnnotationY+16)
      .attr("x", 0)
      .attr('text-anchor','start');

    group
      .append("text")
      .text(this.translationsObj.annotationMost) // Legend label 
      .attr("class", "bottom-annotation")
      .attr("y", bottomAnnotationY+16)
      .attr("x", this.dimensions.width)
      .attr('text-anchor','end');



  }

  renderChart() {
      console.log("Render Chart",this.dimensions);
      let data = this.alldata;
      let categories = data.map(rec => (rec.HPIQUARTILE-1));
      this.dimensions.width = this.dimensions.margin.left+this.dimensions.bar_hspace*categories.length + this.dimensions.margin.right;
      let max_y = d3.max(data, d => d.COMBINED_DOSES_RATIO)
      console.log("Max Y",max_y);
      d3.select(this.querySelector("svg"))
      .attr("viewBox", [
                        0,
                        0,
                        this.dimensions.width,
                        this.dimensions.height,
                        ]);

        this.yScale = d3
            .scaleLinear()
            .domain([0, max_y]).nice()
            .range([this.dimensions.height-this.dimensions.margin.bottom,
                    this.dimensions.margin.top]);
        
        this.xScale = d3
            .scaleBand()
            .domain(categories)
            .range([this.dimensions.margin.left,
                    this.dimensions.width-this.dimensions.margin.right])
            .paddingInner(7/60.0)
            .paddingOuter(0);

        this.svg.selectAll("g").remove();

        // console.log("yscale test",this.yScale(0.5))

        this.writeBars.call(this, this.svg, data, this.yScale, this.xScale);
        this.writeLegend.call(this, this.svg, data, this.yScale, this.xScale);
        this.writeExtras.call(this, this.svg, data, this.yScale, this.xScale);
    }

  retrieveData(url) {
    let component = this;
    window
      .fetch(url)
      .then((response) => response.json())
      .then(
        function (alldata) {
          console.log("Chart meta", alldata);
          this.alldata = alldata.data;

          this.renderChart.call(component);
        }.bind(this)
      );
  }
}

window.customElements.define(
  "cagov-chart-vaccines-hpi-by-dose",
  CAGovVaccinesHPIDose
);
