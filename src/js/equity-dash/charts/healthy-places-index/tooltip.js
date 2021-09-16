import { parseSnowflakeDate } from "../../../common/readable-date.js";

export default class Tooltip {
  constructor(needs_anno, yScale) {
    let yRange = yScale.range();
    // console.log("Range",yRange);
    this.needs_anno = needs_anno;
    // this.legend = legend; // no longer using this param
    this.node = document.createElementNS("http://www.w3.org/2000/svg","g")
    this.node.setAttribute("pointer-events","none")
    this.node.innerHTML = 
    
    // Pale, vertical line.
    (needs_anno? 
       `<rect x="0" width=0.25 y=${yRange[1]} height=${(yRange[0] - yRange[1])} fill="#003D9D" stroke=none opacity=0.5></rect>
        <rect x="-5.5" width="10" y="89.5" height="3.5" fill="white" opacity=0.5></rect>
        <text class="date" y="62", x="0"></text>`
      : '') + 

    // Tip.
    `<g class="tip">
      <rect height="38" y="-25"></rect> 
      <text class="label1" x="0"></text>
      <circle r="3" dx="3" x="-4" transform=translate(-5,130)></circle>
    </g>
    `;
  } 
  show(d,x,y, lineIsOnTop, label) {
    let yVal = d.METRIC_VALUE;
    // console.log("Showing: ",d);
    let tranX = x(parseSnowflakeDate(d.DATE));
    // console.log("Tran X: ",tranX);
    let tranY = y(yVal) + 4;
    let xRange = x.range();

    // 70 is halfway point of svg...
    let midPoint = (xRange[0]+xRange[1])/2;
    
    // The dynamic number that shows in the tip.
    let tipNumber = (yVal * 100).toFixed(1);
    // Change the y position of the tool tip based on its relative value.
    let adjustY =  (lineIsOnTop) ? 45 : -45;

    // .tip
    const tip = this.node;
    tip.removeAttribute("display");
    tip.setAttribute('text-anchor',(tranX > midPoint) ? 'end' :'start')
    tip.setAttribute("transform", `translate(${tranX}, 0)`);
    tip.setAttribute("aria-label", tipNumber);

    // .tip text
    const text = this.node.querySelector('text.label1');
    text.setAttribute('x', (tranX > midPoint) ? 0  : 10);
    text.innerHTML = `<tspan font-weight="bold">${tipNumber}%</tspan>&nbsp;<tspan>${label}</tspan>`;
    text.setAttribute("transform", `translate(0,${tranY + adjustY })`);

    // .tip rect
    const rectangle = this.node.querySelector(".tip rect");
    // Get rectangle width dynamically from text width.
    const rectangleWidth = text.getBBox().width + 20;
    rectangle.setAttribute("width", rectangleWidth);
    rectangle.setAttribute('x',(tranX > midPoint) ? -(rectangleWidth) + 10 : 0 );
    rectangle.setAttribute("transform", `translate(0,${tranY + adjustY})`);

    // .tip circle
    const circle = this.node.querySelector(".tip circle");
    circle.setAttribute("transform", `translate(0,${tranY - 4})`);

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