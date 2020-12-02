export default class Tooltip {
    constructor() {
      this.node = document.createElementNS("http://www.w3.org/2000/svg","g")
      this.node.setAttribute("pointer-events","none")
      this.node.setAttribute("text-anchor","left")
      this.node.innerHTML = `
        <rect x="2" width="30" y="-3" height="2" fill="white"></rect>
        <text y="-3", x="2"></text>
        <circle r="1" dx="3" fill="#0F368E"></circle>
      </g>`;
    }
    show(d, set, x, y, data2) {
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