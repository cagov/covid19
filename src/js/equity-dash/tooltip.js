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
    let yVal = d.value;
    if(set == 2) {
      data2.forEach(item => {
        if(item.date == d.date) {
          yVal = item.value;
        }
      })
    }
    console.log(yVal)
    this.node.removeAttribute("display");
    this.node.setAttribute("transform", `translate(${x(new Date(d.date))+0.7},${y(yVal)})`);
    this.node.querySelector('text').innerHTML = `<tspan font-weight="bold">${yVal.toFixed(1)}%</tspan> test positivity`;
  }
  hide() {
    this.node.setAttribute("display", "none");
  }
}
/*
function svg(){
  return document.createElementNS("http://www.w3.org/2000/svg","g")
  //var n=document.createElementNS("http://www.w3.org/2000/svg","svg");return n.setAttribute("viewBox",[0,0,e,t]),n.setAttribute("width",e),n.setAttribute("height",t),n
}
*/
function svg(e){
  let t=document.createElementNS("http://www.w3.org/2000/svg","g");
  t.innerHTML=e[0].trim();
  console.log(t)
  return t
}




/*
var Qe=Ie(
  (
    function(e) {
      var t=document.createElementNS("http://www.w3.org/2000/svg","g");
      return t.innerHTML=e.trim(),t
    }
  )
  ,
  (function(){return document.createElementNS("http://www.w3.org/2000/svg","g")}))
*/