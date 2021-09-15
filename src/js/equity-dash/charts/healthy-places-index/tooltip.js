import { parseSnowflakeDate } from "../../../common/readable-date.js";

export default class Tooltip {
  constructor(needs_anno, yScale) {
    let yRange = yScale.range();
    // console.log("Range",yRange);
    this.needs_anno = needs_anno;
    // this.legend = legend; // no longer using this param
    this.node = document.createElementNS("http://www.w3.org/2000/svg","g")
    this.node.setAttribute("pointer-events","none")
    this.node.setAttribute("text-anchor","left")
    this.node.innerHTML = 
    (needs_anno? 
       `<rect x="0" width=0.25 y=${yRange[1]} height=${(yRange[0] - yRange[1])} fill="#003D9D" stroke=none opacity=0.5></rect>
        <rect x="-5.5" width="10" y="89.5" height="3.5" fill="white" opacity=0.5></rect>
        <text class="date" y="62", x="0"></text>`
      : '') + 
    `<g class="tooltip-container">
       <!-- <rect x="2" width="28" y="-5.5" height="3.5" fill="white" opacity=0.5></rect> -->
       <text class="label1" y="-1", x="2"></text>
       <circle r="3" dx="3" fill="#0F368E"></circle>
     </g>`;
  } // <!-- <text class="label2" y="3", x="2"></text> -->
  show(d,x,y, lineIsOnTop, label) {
    let yVal = d.METRIC_VALUE;
    // console.log("Showing: ",d);
    this.node.removeAttribute("display");
    let tranX = x(parseSnowflakeDate(d.DATE));
    let tranY = y(yVal) + 4;
    let xRange = x.range();
    let midPoint = (xRange[0]+xRange[1])/2;
    
    // The dynamic number that shows in the tip.
    let tipNumber = (yVal * 100).toFixed(1);
    // Change the y position of the tool tip based on its relative value.
    let adjustY =  (lineIsOnTop) ? -30 : 30;
    
    // console.log("Tran X: ",tranX);
    // 70 is halfway point of svg...
    if (tranX > midPoint) {
      this.node.querySelector('text.label1').setAttribute('text-anchor','end')
      this.node.querySelector('text.label1').setAttribute('x','-4')
    } else {
      this.node.querySelector('text.label1').setAttribute('text-anchor','start')
      this.node.querySelector('text.label1').setAttribute('x','4')
    }
  
    this.node.setAttribute("transform", `translate(${tranX},${adjustY})`);
    this.node.setAttribute("aria-label", tipNumber);
    this.node.querySelector(".tooltip-container").setAttribute("transform", `translate(0,${tranY - 4 })`);
    this.node.querySelector(".tooltip-container").setAttribute("style", "visibility: visible;");
    this.node.querySelector('text.label1').innerHTML = `<tspan font-weight="bold">${tipNumber}%</tspan><tspan>${label.toLowerCase()}</tspan>`;

    /***** 
    // date alignment debugging
    if (this.needs_anno) {
      let tfmt = d3.timeFormat('%b. %d');
      let tstr = tfmt(parseSnowflakeDate(d.DATE));
      this.node.querySelector('text.date').innerHTML = `<tspan>${tstr}</tspan>`;
    }
    *******/
  }

  hide() {
    this.node.setAttribute("display", "none");
  }
}