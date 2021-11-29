class CAGovTimeRangeButtons extends window.HTMLElement {
  connectedCallback () {
    this.innerHTML = this.template(0);

    this.addEventListener('timerange-selected', function (e) {
      console.log("Timerange event: " , e.detail);
      this.innerHTML = this.template(e.detail.timerange);
     }.bind(this), false);

    this.addEventListener('click',function(event) {
      console.log("Proces timerange click",event);
      event.preventDefault();
      if(event.target.classList.contains('js-toggle-time')) {
        if(!event.target.classList.contains('active')) {
          let emissionEvent = new window.CustomEvent('timerange-selected', {
            detail: {
              reset: false,
              timerange: event.target.dataset.timerange,
              how: 'tab'
            }
          });
          // const event2 = new window.CustomEvent('tab-select',{detail:{tab_selected: emissionEvent.detail.county}});
          // window.dispatchEvent(event2);    
          this.dispatchEvent(emissionEvent);
        }
      }
    });


  }




  template(timeState) {
    console.log("Template TimeRange=",timeState);
    return /*html*/`

    <div class="chart-date-picker">
      <button class="small-tab js-toggle-time ${timeState == 0 ? 'active' : ''}" data-timerange=0>All Time</button>
      <button class="small-tab js-toggle-time ${timeState == 1 ? 'active' : ''}" data-timerange=1>6 Months</button>
      <button class="small-tab js-toggle-time ${timeState == 2 ? 'active' : ''}" data-timerange=2>90 Days</button>
    </div>`
  }
}
window.customElements.define('cagov-timerange-buttons', CAGovTimeRangeButtons);
