class CAGovChartFilterButtons extends window.HTMLElement {
  connectedCallback () {
    
    this.addEventListener('click',function(event) {
      event.preventDefault();
      let clickedFilterText = event.target.textContent;
      let clickedFilterKey = event.target.dataset.key;

      if(!event.target.classList.contains('active')) {
        let emissionEvent = new window.CustomEvent('filter-selected', {
          detail: {
            filterKey: clickedFilterKey,
            clickedFilterText: clickedFilterText
          }
        });
        this.dispatchEvent(emissionEvent);
        this.resetActive();
        event.target.classList.add('active')
      }
    })

    // listen for county events, hide deaths
    let statewideOnlyButton = this.querySelector("button[data-key='deaths']");
    let searchElement = document.querySelector('cagov-county-search');
    searchElement.addEventListener('county-selected', function (e) {
      if(e.detail.statewide) {
        statewideOnlyButton.style.display = 'block';
      } else {
        statewideOnlyButton.style.display = 'none';
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
window.customElements.define('cagov-chart-filter-buttons', CAGovChartFilterButtons);
