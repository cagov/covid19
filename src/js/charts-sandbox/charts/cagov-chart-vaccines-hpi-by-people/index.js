import template from "./template.js";
import getTranslations from "./../../../common/get-strings-list.js";
import getScreenResizeCharts from "./../../../common/get-window-size.js";
import rtlOverride from "./../../../common/rtl-override.js";

class CAGovVaccinesHPEPeople extends window.HTMLElement {
  connectedCallback() {
    console.log("Loading CAGovVaccinationGroupsAge");
    this.translationsObj = getTranslations(this);
    console.log("Translations",this.translationsObj);
    this.innerHTML = template(this.translationsObj);
    // Settings and initial values
    this.colors = {'FIRST_DOSE_RATIO':'#92c6df','COMPLETED_DOSE_RATIO':'#013d9c'}

    this.nbr_bars = 4;
    this.bar_hspace = 120;
    this.chartOptions = {
      // Data
      dataUrl:
        // https://files.covid19.ca.gov/data/vaccine-hpi/vaccine-hpi.json
        config.chartsVHPIDataLoc + "vaccine-hpi.json", // Overwritten by county.
      // Breakpoints
      desktop: {
        fontSize: 14,
        height: 400,
        width: this.nbr_bars * this.bar_hspace,
        margin: {
          top: 70,
          right: 10,
          bottom: 52,
          left: 10,
        },
      },
      tablet: {
        fontSize: 14,
        height: 400,
        width: this.nbr_bars * this.bar_hspace,
        margin: {
          top: 70,
          right: 10,
          bottom: 52,
          left: 10,
        },
      },
      mobile: {
        fontSize: 12,
        height: 400,
        width: this.nbr_bars * this.bar_hspace,
        margin: {
          top: 70,
          right: 10,
          bottom: 52,
          left: 10,
        },
      },
      retina: {
        fontSize: 12,
        height: 400,
        width: this.nbr_bars * this.bar_hspace,
        margin: {
          top: 70,
          right: 10,
          bottom: 52,
          left: 10,
        },
      },
    };

    this.intFormatter = new Intl.NumberFormat(
      "us", // forcing US to avoid mixed styles on translated pages
      { style: "decimal", minimumFractionDigits: 0, maximumFractionDigits: 0 }
    );
    this.pctFormatter = new Intl.NumberFormat(
      "us", // forcing US to avoid mixed styles on translated pages
      { style: "percent", minimumFractionDigits: 0, maximumFractionDigits: 1 }
    );

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
      this.translationsObj.legendLabel2,
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

  writeBars(svg, data, yScale, xScaleOuter, xScaleInner) {
    let groups = svg.append("g")
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("transform", (d,i) => `translate(${xScaleOuter(i+1)},0)`);



    // big bar
    console.log("yscale 0",yScale(0));
    console.log("yscale 0.5",yScale(0.5));
    console.log("xscale 1",xScaleOuter(1));
    console.log("xscale 2",xScaleOuter(2));
    console.log("xscale bw",xScaleOuter.bandwidth());

    let colors = {'FIRST_DOSE_RATIO':'#92c6df','COMPLETED_DOSE_RATIO':'#013d9c'}

    let bars = groups
        .selectAll("rect")
        .data(d => ['FIRST_DOSE_RATIO','COMPLETED_DOSE_RATIO'].map( key => ({'KEY':key,'D':d})))
        .join("rect")
            .attr("class","bg-bar")
            .attr("fill", d=>this.colors[d.KEY])
            .attr("x", (d,i) => xScaleInner(i))
            .attr("y", d => yScale(d.D[d.KEY]))
            .attr("width", d => xScaleInner.bandwidth())
            .attr("height", d => (yScale(0)-yScale(d.D[d.KEY])));

            // .append("text")
            // .attr("class", "bar-upper-label-1")
            // .attr("y", (d, i) => yScale(d.D[d.KEY]) - 20)
            // .attr("x", (d, i) => xScaleInner.bandwidth()/2)
            // .text(d => `Upper Caption`)
            // .attr('text-anchor','middle');

    let barcaps1 = groups
        .selectAll("g")
        .data(d => ['FIRST_DOSE_RATIO','COMPLETED_DOSE_RATIO'].map( key => ({'KEY':key,'D':d})))
        .join("text")
        .attr("class", "bar-upper-label-1")
        .attr("y", (d, i) => yScale(d.D[d.KEY]) - 18)
        .attr("x", (d, i) => xScaleInner(i)+xScaleInner.bandwidth()/2)
        .text(d => this.pctFormatter.format(d.D[d.KEY]))
        .attr('text-anchor','middle');
    let capFields = ['FIRST_DOSE', 'COMPLETED_DOSE'];
    let barcaps2 = groups
        .selectAll("g")
        .data(d => ['FIRST_DOSE_RATIO','COMPLETED_DOSE_RATIO'].map( key => ({'KEY':key,'D':d})))
        .join("text")
        .attr("class", "bar-upper-label-2")
        .attr("y", (d, i) => yScale(d.D[d.KEY]) - 4)
        .attr("x", (d, i) => xScaleInner(i)+xScaleInner.bandwidth()/2)
        .text((d,i) => this.intFormatter.format(d.D[capFields[i]]))
        .attr('text-anchor','middle');

    // barcaps.append("text")
    // .attr("class", "bar-upper-label-2")
    // .attr("y", (d, i) => yScale(d.D[d.KEY]) - 10)
    // .attr("x", (d, i) => xScaleInner.bandwidth()/2)
    // .text(d => `Lower Caption`)
    // .attr('text-anchor','middle');


    
    // bottom caption
    groups
      .append("text")
      .attr("class", "bar-lower-label")
      .attr("y", (d, i) => yScale(0) + 20)
      .attr("x", (d, i) => xScaleOuter.bandwidth()/2)
      // .attr("width", x.bandwidth() / 4)
      .text(d => `HPI Quartile ${d.HPIQUARTILE}`)
      // .html(d => {
      //   return `<tspan dx="1.5em">${this.pctFormatter.format(d.METRIC_VALUE)}</tspan>`
      // })
      // .attr('dominant-baseline','text-top')
      .attr('text-anchor','middle')



    // top caption A
    // top caption B



  }

  writeLegend(svg, data, yScale, xScaleOuter, xScaleInner) {
    const legendW = 12;
    const legendY =  this.dimensions.margin.top/3;
    const legendText = this.getLegendText();
    const legend2X = this.dimensions.width*0.4;

    let group = svg.append("g")

    group
      .append("rect")
        .attr("fill", this.colors.FIRST_DOSE_RATIO)
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

    group
      .append("rect")
        .attr("fill", this.colors.COMPLETED_DOSE_RATIO)
        .attr("class", "legend-block")
        .attr("y", legendY)
        .attr("x", legend2X)
        .attr("width", legendW)
        .attr("height", legendW);

    group
      .append("text")
      .text(legendText[1]) // Legend label 
      .attr("class", "legend-caption")
      .attr("y", legendY+legendW/2.0 + 1)
      .attr("x", legend2X+legendW*1.5)
      .attr('dominant-baseline','middle')
      .attr('text-anchor','start');


  }

  writeExtras(svg, data, yScale, xScaleOuter, xScaleInner) {
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
      let categories = data.map(rec => (rec.HPIQUARTILE));
      let subcategories = ['FIRST_DOSE_RATIO','COMPLETED_DOSE_RATIO'];
      this.dimensions.width = this.dimensions.margin.left+this.bar_hspace*categories.length + this.dimensions.margin.right;
      let max_y = d3.max(data, d => d.FIRST_DOSE_RATIO)
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
        
        this.xScaleOuter = d3
            .scaleBand()
            .domain(categories)
            .range([this.dimensions.margin.left,
                    this.dimensions.width-this.dimensions.margin.right])
            .paddingInner(20.0/this.bar_hspace)
            .paddingOuter(0);

        this.xScaleInner = d3
            .scaleBand()
            .domain([0,1])
            .range([0, this.xScaleOuter.bandwidth()])
            .paddingInner(0.172)
            .paddingOuter(0);

        this.svg.selectAll("g").remove();

        console.log("yscale test",this.yScale(0.5))

        this.writeBars.call(this, this.svg, data, this.yScale, this.xScaleOuter, this.xScaleInner);
        this.writeLegend.call(this, this.svg, data, this.yScale, this.xScaleOuter, this.xScaleInner);
        this.writeExtras.call(this, this.svg, data, this.yScale, this.xScaleOuter, this.xScaleInner);
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
  "cagov-chart-vaccines-hpi-by-people",
  CAGovVaccinesHPEPeople
);
