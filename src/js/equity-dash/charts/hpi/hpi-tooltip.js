export default class Tooltip {
  constructor(needs_anno, legend) {
    this.needs_anno = needs_anno;
    this.legend = legend;
    this.node = document.createElementNS("http://www.w3.org/2000/svg","g")
    this.node.setAttribute("pointer-events","none")
    this.node.setAttribute("text-anchor","left")
    this.node.innerHTML = 
    (needs_anno? 
       `<rect x="0" width=0.25 y=0 height=200 fill="#003D9D" stroke=none opacity=0.5></rect>
        <rect x="-5.5" width="10" y="89.5" height="3.5" fill="white" opacity=0.5></rect>
        <text class="date" y="92", x="-5.5"></text>` 
      : '') + 
    `<g class="lineanno">
       <rect x="2" width="28" y="-5.5" height="3.5" fill="white" opacity=0.5></rect>
       <text class="label" y="-3", x="2"></text>
       <circle r="1" dx="3" fill="#0F368E"></circle>
     </g>`;
  }
  show(d,x,y) {
    let yVal = d.METRIC_VALUE;
    // console.log("Showing: ",d);
    this.node.removeAttribute("display");
    this.node.setAttribute("transform", `translate(${x(new Date(d.DATE))+0.7},0)`);
    this.node.querySelector(".lineanno").setAttribute("transform", `translate(0,${y(yVal)})`);
    this.node.querySelector('text.label').innerHTML = `<tspan font-weight="bold">${(yVal * 100).toFixed(1)}%</tspan> ${this.legend}`;
    if (this.needs_anno) {
      let tfmt = d3.timeFormat('%b. %d');
      let tstr = tfmt(new Date(d.DATE));
      this.node.querySelector('text.date').innerHTML = `<tspan>${tstr}</tspan>`;
    }
  }
  
  show2(d, set, x, y, data2) {
    let yVal = d.METRIC_VALUE;
    if(set == 2) {
      data2.forEach(item => {
        if(item.DATE == d.DATE) {
          yVal = item.METRIC_VALUE;
        }
      })
    }
  
    this.node.removeAttribute("display");
    this.node.setAttribute("transform", `translate(${x(new Date(d.DATE))+0.7},${y(yVal)})`);
    this.node.querySelector('text').innerHTML = `<tspan font-weight="bold">${(yVal * 100).toFixed(1)}%</tspan> test positivity`;
  }
  hide() {
    this.node.setAttribute("display", "none");
  }
}