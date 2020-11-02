class CAGovCountyButtons extends window.HTMLElement {
  connectedCallback () {
    this.resetText = 'Statewide';
    this.county = '';
    
    let searchElement = document.querySelector('cagov-county-search');

    searchElement.addEventListener('county-selected', function (e) {
      this.county = e.detail.county;
      console.log('chosen county: '+e.detail.county)
      this.innerHTML = this.template();
      // after writing template apply event listeners
      // send event on searchElement when you toggle
     }.bind(this), false);

  }

  template() {
    return /*html*/`<div class="row d-flex justify-content-md-center">
      <div class="toggle-link-container js-toggle-county-container">
        <div class="grid-layout-hd toggle-links bg-darkblue bd-darkblue">
          <a href="#" class="js-toggle-county county toggle-active">${this.county}</a>
          <a href="#" class="js-toggle-county statewide">${this.resetText}</a>
        </div>
      </div>
    </div>`
  }
}
window.customElements.define('cagov-county-toggle-buttons', CAGovCountyButtons);
