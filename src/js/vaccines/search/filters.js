class CAGovChartFilterButtonsVaccines extends window.HTMLElement {
  connectedCallback () {
    
    this.addEventListener('click',function(event) {
      event.preventDefault();
      let clickedFilterText = event.target.textContent;
      let clickedFilterKey = event.target.dataset.key;
      if (clickedFilterKey != undefined) {
        if(!event.target.classList.contains('active')) {
          let emissionEvent = new window.CustomEvent('filter-selected', {
            detail: {
              filterKey: clickedFilterKey,
              clickedFilterText: clickedFilterText
            }
          });
          this.resetActive();
          event.target.classList.add('active')
          this.dispatchEvent(emissionEvent); // this event fire is last because charts look at active class on filter to get new text
        }
      }
    })

    // listen for county events, hide deaths
    let statewideOnlyButton = this.querySelector("button[data-key='deaths']");
    let searchElement = document.querySelector('cagov-county-search-vaccines');
    searchElement.addEventListener('county-selected', function (e) {
      if(statewideOnlyButton) {
        if(e.detail.statewide) {
          statewideOnlyButton.style.display = 'block';
        } else {
          statewideOnlyButton.style.display = 'none';
        }
        // we were on the filter we are now hiding, reset to first
        if(statewideOnlyButton.classList.contains('active')) {
          statewideOnlyButton.classList.remove('active');
          this.querySelector('button').classList.add('active'); // make ifrst one active instead
        }
      }
    }.bind(this), false);

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
window.customElements.define('cagov-chart-filter-buttons-vaccines', CAGovChartFilterButtonsVaccines);
