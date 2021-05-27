import template from "./map-template.js";

class CalArtsMap extends window.HTMLElement {
    connectedCallback() {
        console.log("Loading CalArtMap");

        this.lastFocused = undefined;
        this.poiHiliteColor = '#ff8000';

        // handle screen size stuff here...

        const handleChartResize = () => {
          console.log("Got Resize");
        };
      
        window.addEventListener("resize", handleChartResize);

        this.innerHTML = template.call(this);

        let svgElement = this.querySelector("svg#cal-arts-map");

        svgElement.querySelectorAll("g.poi-marker").forEach(item => {
           // console.log("Matched item",item);
          item.addEventListener('click', event => {       this.doClick(item);     });
          item.addEventListener('mousemove', event => {   this.doFocus(item);     });
          item.addEventListener('focus', event => {       this.doFocus(item);     });
          item.addEventListener('mouseleave', event => {  this.doUnfocus(item);   });
          item.addEventListener('touchend', event => {    this.doUnfocus(item);   });
          item.addEventListener('vlur', event => {        this.doUnfocus(item);   });
        });
    }
    doClick(item) {
      console.log("Clicked on",item.id);
    }

    doFocus(item) {
      // set fill to #ff8000
      if (this.lastFocused != undefined && this.lastFocused != item) {
        this.lastFocused.style["transition"] = "100ms";
        this.lastFocused.style["fill"] = '#003D9D';
      }
      item.style["transition"] = "300ms";
      item.style["fill"] = '#FF8000';
      this.lastFocused = item;
    }

    doUnfocus(item) {
      // set fill to #003D9D
      item.style["transition"] = "100ms";
      item.style["fill"] = '#003D9D';
      this.lastFocused = undefined;
    }


}

window.customElements.define(
  "cagov-cal-arts-map",
  CalArtsMap
);

      
    
