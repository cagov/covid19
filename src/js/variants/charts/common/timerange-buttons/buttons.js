class CAGovTimeRangeButtons extends window.HTMLElement {
    connectedCallback () {
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
  }
  window.customElements.define('cagov-timerange-buttons', CAGovTimeRangeButtons);
  