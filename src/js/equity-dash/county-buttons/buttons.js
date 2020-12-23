class CAGovCountyButtons extends window.HTMLElement {
  connectedCallback () {
    this.resetText = 'Statewide';
    this.county = '';
    
    let searchElement = document.querySelector('cagov-county-search');
    searchElement.addEventListener('county-selected', function (e) {
      console.log("County-selected event: " , e.detail);
      if (e.detail.reset) {
        this.innerHTML = '';
      }
      else if(e.detail.statewide) {
        this.innerHTML = this.template(true);
      } else {
        this.county = e.detail.county;
        // console.log("Inner HTML: " , this.template(false));
        this.innerHTML = this.template(false);
      }
     }.bind(this), false);

    this.addEventListener('click',function(event) {
      event.preventDefault();
      if(event.target.classList.contains('js-toggle-county')) {
        let clickedCounty = event.target.textContent;
        // console.log("Issuing county-selected for button");

        if(!event.target.classList.contains('active')) {
          let emissionEvent = new window.CustomEvent('county-selected', {
            detail: {
              county: clickedCounty,
              statewide: false,
              reset: false,
              how: 'tab'
            }
          });
          if(event.target.classList.contains('statewide')) {
            emissionEvent = new window.CustomEvent('county-selected', {
              detail: {
                county: 'California',
                statewide: true,
                reset: false,
                how: 'tab'
              }
            });
          }
          // const event2 = new window.CustomEvent('tab-select',{detail:{tab_selected: emissionEvent.detail.county}});
          // window.dispatchEvent(event2);    
          searchElement.dispatchEvent(emissionEvent);
        }
      }
    })

  }




  template(isStatewide) {
    // console.log("Template isStatewide=",isStatewide);
    return /*html*/`<div class="d-flex flex-column flex-md-row justify-content-center my-3">
    <div class="text-center large-tabs">
          <button class="large-tab js-toggle-county county ${!isStatewide ? 'active' : ''}">${this.county}</button>
          <button class="large-tab js-toggle-county statewide ${isStatewide ? 'active' : ''}">${this.resetText}</button>
        </div>
    </div>`
  }
}
window.customElements.define('cagov-county-toggle-buttons', CAGovCountyButtons);
