import { debounce } from 'throttle-debounce';
import template from "./template.js";
import getTranslations from "./../../../common/get-strings-list.js";
import getScreenResizeCharts from "./../../../common/get-window-size.js";
import rtlOverride from "./../../../common/rtl-override.js";
import applySubstitutions from "./../../../common/apply-substitutions.js";
import { parseSnowflakeDate, reformatJSDate } from "./../../../common/readable-date.js";
import formatValue from "./../../../common/value-formatters.js";

class CAGovVaccinesHPIPeople extends window.HTMLElement {
  connectedCallback() {
    console.log("Loading CAGovVaccinationGroupsAge");
    this.translationsObj = getTranslations(this);
    this.innerHTML = template(this.translationsObj);
    // Settings and initial values
    this.nbr_bars = 4;
    this.chartOptions = {
      // Data
      dataUrl:
        // https://data.covid19.ca.gov/data/vaccine-hpi/vaccine-hpi.json
        config.chartsVHPIDataLocPeople + "vaccine-hpi.json", // Overwritten by county.
      // Breakpoints
      desktop: {
        bar_hspace: 120,
        fontSize: 14,
        height: 400,
        width: this.nbr_bars * 120,
        margin: {
          top: 60,
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
          top: 60,
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
          top: 60,
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
          top: 60,
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

    window.addEventListener("resize", debounce(200, false, handleChartResize));

    this.svg = d3
      .select(this.querySelector(".svg-holder"))
      .append("svg")
      .attr("viewBox", [
        0,
        0,
        this.chartBreakpointValues.width,
        this.chartBreakpointValues.height,
      ]);

    const patternSuffixes = ['1','2','3','4','L'];

     this.svg.append("defs")
       .selectAll("pattern")
       .data(patternSuffixes)
       .join("pattern")
        .attr("id",d => 'hatch'+d)
        .attr("x",0)
        .attr("x",0)
        .attr("width",4)
        .attr("height",4)
        .attr("patternUnits","userSpaceOnUse")
        .append('path')
          .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2');
      
     this.svg.append("g")
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
    let label = applySubstitutions(this.translationsObj.barLabel, {'N':d.D.HPIQUARTILE});
    // let label = `${this.translationsObj.barLabel.replace('{N}',d.D.HPIQUARTILE)} `;
    if(d.KEY == "PARTIALLY_VACCINATED_RATIO") {
      label += `${formatValue(d.D.PARTIALLY_VACCINATED_RATIO,{format:'percent'})} ${this.translationsObj.legendLabel1}`;
    } else {
      label += `${formatValue(d.D.FULLY_VACCINATED_RATIO,{format:'percent'})} ${this.translationsObj.legendLabel2}`;
    }
    
    return label;
  }

  writeBars(svg, data, yScale, xScaleOuter, xScaleInner) {
    let groups = svg.append("g")
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("id",(d,i) => 'hpi-bar-group'+(i+1))
      .attr("transform", (d,i) => `translate(${xScaleOuter(i+1)},0)`);

    let bars = groups
        .selectAll("rect")
        .data(d => ['PARTIALLY_VACCINATED_RATIO','FULLY_VACCINATED_RATIO'].map( key => ({'KEY':key,'D':d})))
        .join("rect")
            .attr("class","bg-bar")
            .attr("class",(d,i) => 'hpi-bar-'+(i+1))
            .attr("x", (d,i) => xScaleInner(i))
            .attr("y", d => yScale(d.D[d.KEY]))
            .attr("width", d => xScaleInner.bandwidth())
            .attr("height", d => (yScale(0)-yScale(d.D[d.KEY])))
            .attr("tabindex", "0")
            .attr("aria-label", (d, i) => `${this.ariaLabel(d)}`);

    let barcaps1 = groups
        .selectAll("g")
        .data(d => ['PARTIALLY_VACCINATED_RATIO','FULLY_VACCINATED_RATIO'].map( key => ({'KEY':key,'D':d})))
        .join("text")
        .attr("class", "bar-upper-label-1")
        .attr("y", (d, i) => yScale(d.D[d.KEY]) - 18)
        .attr("x", (d, i) => xScaleInner(i)+xScaleInner.bandwidth()/2)
        .text(d => formatValue(d.D[d.KEY],{format:'percent'}))
        .attr('text-anchor','middle');
    let capFields = ['PARTIALLY_VACCINATED', 'FULLY_VACCINATED'];
    let barcaps2 = groups
        .selectAll("g")
        .data(d => ['PARTIALLY_VACCINATED_RATIO','FULLY_VACCINATED_RATIO'].map( key => ({'KEY':key,'D':d})))
        .join("text")
        .attr("class", "bar-upper-label-2")
        .attr("y", (d, i) => yScale(d.D[d.KEY]) - 4)
        .attr("x", (d, i) => xScaleInner(i)+xScaleInner.bandwidth()/2)
        .text((d,i) => formatValue(d.D[capFields[i]],{format:'integer'}))
        .attr('text-anchor','middle');

    // bottom caption
    groups
      .append("text")
      .attr("class", "bar-lower-label")
      .attr("y", (d, i) => yScale(0) + 20)
      .attr("x", (d, i) => xScaleOuter.bandwidth()/2)
      .text(d =>  applySubstitutions(this.translationsObj.barLabel, {'N':d.HPIQUARTILE}))
      .attr('text-anchor','middle')

  }

  writeLegendTextAt(group, caption, py, px) {
    const longLegend = caption.length >= 40;

    if (longLegend) {
      const words = caption.split(' ');
      const div2 = Math.ceil(words.length / 2) + 1;
      const line1 = words.splice(0,div2).join(' ');
      const line2 = words.join(' ');
      const splitAdjust = 12;
      group
      .append("text")
      .text(line1) // Legend label 
      .attr("class", "legend-caption")
      .attr("y", py)
      .attr("x", px)
      .attr('dominant-baseline','middle')
      .attr('text-anchor','start');
      group
      .append("text")
      .text(line2) // Legend label 
      .attr("class", "legend-caption")
      .attr("y", py+splitAdjust)
      .attr("x", px)
      .attr('dominant-baseline','middle')
      .attr('text-anchor','start');

    }
    else {
      group
      .append("text")
      .text(caption) // Legend label 
      .attr("class", "legend-caption")
      .attr("y", py)
      .attr("x", px)
      .attr('dominant-baseline','middle')
      .attr('text-anchor','start');
    }
  }

  writeLegend(svg, data, yScale, xScaleOuter, xScaleInner) {
    const legendW = 12;
    const legendY =  this.dimensions.margin.top/3;
    const legendText = this.getLegendText();
    const legend2X = this.dimensions.width/2;



    let group = svg.append("g")

    group
      .append("rect")
        .attr('id','legend-box-1')
        .attr("class", "legend-block")
        .attr("y", legendY)
        .attr("x", 0)
        .attr("width", legendW)
        .attr("height", legendW);

    this.writeLegendTextAt(group, legendText[0], legendY+legendW/2.0 + 1, legendW*1.5);

    // group
    //   .append("text")
    //   .text(legendText[0]) // Legend label 
    //   .attr("class", "legend-caption")
    //   .attr("y", legendY+legendW/2.0 + 1)
    //   .attr("x", legendW*1.5)
    //   .attr('dominant-baseline','middle')
    //   .attr('text-anchor','start');

    group
      .append("rect")
        .attr('id','legend-box-2')
        .attr("class", "legend-block")
        .attr("y", legendY)
        .attr("x", legend2X)
        .attr("width", legendW)
        .attr("height", legendW);

    this.writeLegendTextAt(group, legendText[1], legendY+legendW/2.0 + 1, legend2X+legendW*1.5);
    // group
    //   .append("text")
    //   .text(legendText[1]) // Legend label 
    //   .attr("class", "legend-caption")
    //   .attr("y", legendY+legendW/2.0 + 1)
    //   .attr("x", legend2X+legendW*1.5)
    //   .attr('dominant-baseline','middle')
    //   .attr('text-anchor','start');


  }

  writeExtraTextAt(group, caption, px, py, textAnchor) {

    const longLegend = caption.length >= 45;
    if (longLegend) {
      const words = caption.split(' ');
      const div2 = Math.ceil(words.length / 2) + 1;
      const line1 = words.splice(0,div2).join(' ');
      const line2 = words.join(' ');
      const splitAdjust = 5;

      group
      .append("text")
      .text(line1) // Legend label 
      .attr("class", "bottom-annotation")
      .attr("y", py-splitAdjust)
      .attr("x", px)
      .attr('text-anchor',textAnchor);
      group
      .append("text")
      .text(line2) // Legend label 
      .attr("class", "bottom-annotation")
      .attr("y", py+splitAdjust)
      .attr("x", px)
      .attr('text-anchor',textAnchor);

    } else {
      group
      .append("text")
      .text(caption) // Legend label 
      .attr("class", "bottom-annotation")
      .attr("y", py)
      .attr("x", px)
      .attr('text-anchor',textAnchor);
    }
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

    this.writeExtraTextAt(group, this.translationsObj.annotationLeast, 0, bottomAnnotationY+16, 'start');

    // group
    //   .append("text")
    //   .text(this.translationsObj.annotationLeast) // Legend label 
    //   .attr("class", "bottom-annotation")
    //   .attr("y", bottomAnnotationY+16)
    //   .attr("x", 0)
    //   .attr('text-anchor','start');

    this.writeExtraTextAt(group, this.translationsObj.annotationMost, this.dimensions.width, bottomAnnotationY+16, 'end');

    // group
    //   .append("text")
    //   .text(this.translationsObj.annotationMost) // Legend label 
    //   .attr("class", "bottom-annotation")
    //   .attr("y", bottomAnnotationY+16)
    //   .attr("x", this.dimensions.width)
    //   .attr('text-anchor','end');



  }

  renderChart() {
      let data = this.alldata;
      let categories = data.map(rec => (rec.HPIQUARTILE));
      let subcategories = ['PARTIALLY_VACCINATED_RATIO','FULLY_VACCINATED_RATIO'];
      this.dimensions.width = this.dimensions.margin.left+this.dimensions.bar_hspace*categories.length + this.dimensions.margin.right;

      let publishedDate = parseSnowflakeDate(this.metadata['PUBLISHED_DATE']);
      let collectedDate = parseSnowflakeDate(this.metadata['LATEST_ADMINISTERED_DATE']);
      if (publishedDate.getTime() == collectedDate.getTime()) {
        collectedDate.setDate(collectedDate.getDate() - 1);            
      }
      let footerReplacementDict = {
        'PUBLISHED_DATE' : reformatJSDate( publishedDate ),
        'LATEST_ADMINISTERED_DATE' : reformatJSDate( collectedDate ),
      };

      let footerDisplayText = applySubstitutions(this.translationsObj.footerText, footerReplacementDict);

      // update the display date
      // this.translationsObj.footerDisplayDate = footerDisplayText;
      d3.select(this.querySelector(".chart-data-label")).text(footerDisplayText);

      let max_y = d3.max(data, d => Math.max(d.PARTIALLY_VACCINATED_RATIO,d.FULLY_VACCINATED_RATIO))

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
            .paddingInner(1/6.0)
            .paddingOuter(0);

        this.xScaleInner = d3
            .scaleBand()
            .domain([0,1])
            .range([0, this.xScaleOuter.bandwidth()])
            .paddingInner(3/19.0)
            .paddingOuter(0);

        this.svg.selectAll("g").remove();

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
          this.metadata = alldata.meta;
          this.alldata = alldata.data;
          console.log("New HPI People Data",this.alldata);

          this.renderChart.call(component);
        }.bind(this)
      );
  }
}

window.customElements.define(
  "cagov-chart-vaccines-hpi-by-people",
  CAGovVaccinesHPIPeople
);
