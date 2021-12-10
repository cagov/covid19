class CAGovTimeRangeButtons extends window.HTMLElement {
  connectedCallback () {
    // this.innerHTML = this.template(0);

    // this.addEventListener('timerange-selected', function (e) {
    //   console.log("Timerange event: " , e.detail);
    //   this.innerHTML = this.template(e.detail.timerange);
    //  }.bind(this), false);

    this.addEventListener('click',function(event) {
      let clickedTimeText = event.target.textContent;
      let clickedTimeKey = event.target.dataset.key;
      console.log("Process timerange click",clickedTimeText, clickedTimeKey);
      if (clickedTimeKey != undefined && !event.target.classList.contains('active')) {
            console.log("  preparing timerange-selected event");
            let emissionEvent = new window.CustomEvent('timerange-selected', {
              detail: {
                reset: false,
                timerangeKey: clickedTimeKey,
                how: 'tab'
              }
            });
            this.resetActive();
            event.target.classList.add('active')
            this.dispatchEvent(emissionEvent);
      }
    });
  }

  resetActive() {
    let buttons = this.querySelectorAll('.small-tab');
    buttons.forEach(b => {
      if(b.classList.contains('active')) {
        b.classList.remove('active')
      }
    })
  }



  // template(timeState) {
  //   console.log("Template TimeRange=",timeState);
  //   return /*html*/`

  //   <div class="chart-date-picker">
  //     <button class="small-tab js-toggle-time ${timeState == 0 ? 'active' : ''}" data-timerange=0>All Time</button>
  //     <button class="small-tab js-toggle-time ${timeState == 1 ? 'active' : ''}" data-timerange=1>6 Months</button>
  //     <button class="small-tab js-toggle-time ${timeState == 2 ? 'active' : ''}" data-timerange=2>90 Days</button>
  //   </div>`
  // }
}
window.customElements.define('cagov-timerange-buttons', CAGovTimeRangeButtons);
