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
    });

    let metricFilter = document.querySelector(
        "cagov-chart-filter-buttons-vaccines.js-re-smalls"
      );
      metricFilter.addEventListener(
        "filter-selected",
        function (e) {
          if (e.detail.filterKey != undefined) {
            let tabs = [ 'race-ethnicity','gender','age'];
            tabs.forEach(key => 
                d3.selectAll('cagov-chart-vaccination-groups-'+key).attr('class','chart' + (key == e.detail.filterKey? '' : ' d-hide'))
            );

          }
        }
      );
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
