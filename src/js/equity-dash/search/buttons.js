class CAGovCountyButtons extends window.HTMLElement {
  connectedCallback () {
    this.resetText = 'Statewide';
    this.county = '';
    
    let searchElement = document.querySelector('cagov-county-search');

    searchElement.addEventListener('county-selected', function (e) {
      if(e.detail.statewide) {
        this.innerHTML = this.template(true);
      } else {
        this.county = e.detail.county;
        this.innerHTML = this.template(false);
      }
     }.bind(this), false);

    this.addEventListener('click',function(event) {
      event.preventDefault();
      let clickedCounty = event.target.textContent;

      if(!event.target.classList.contains('toggle-active')) {
        let emissionEvent = new window.CustomEvent('county-selected', {
          detail: {
            county: clickedCounty,
            statewide: false
          }
        });
        if(event.target.classList.contains('statewide')) {
          emissionEvent = new window.CustomEvent('county-selected', {
            detail: {
              county: 'California',
              statewide: true
            }
          });
        }
        searchElement.dispatchEvent(emissionEvent);
      }
    })

  }

  template(isStatewide) {
    return /*html*/`<div class="row d-flex justify-content-md-center">
      <div class="toggle-link-container js-toggle-county-container">
        <div class="grid-layout-hd toggle-links bg-darkblue bd-darkblue">
          <a href="#" class="js-toggle-county county ${!isStatewide ? 'toggle-active' : ''}">${this.county}</a>
          <a href="#" class="js-toggle-county statewide ${isStatewide ? 'toggle-active' : ''}">${this.resetText}</a>
        </div>
      </div>
    </div>`
  }
}
window.customElements.define('cagov-county-toggle-buttons', CAGovCountyButtons);
