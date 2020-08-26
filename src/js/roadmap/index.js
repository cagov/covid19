import '@cagov/lookup';

class CAGovReopening extends window.HTMLElement {
  connectedCallback () {
    let counties = this.dataset.counties;
    let activities = this.dataset.status;

    this.innerHTML = `
      <div class="reopening-fields">
        <fieldset>
          <cwds-lookup data-search-api="https://api.alpha.ca.gov/CaZipCityCountyTypeAhead?citymode=false&countymode=true&q="></cwds-lookup>
        </fieldset>
        </div>
    `
  }
}
window.customElements.define('cagov-reopening', CAGovReopening);

