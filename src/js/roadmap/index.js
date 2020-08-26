import Awesomplete from 'awesomplete-es6';

class CAGovReopening extends window.HTMLElement {
  connectedCallback () {
    let counties = this.dataset.counties;
    let activities = this.dataset.status;
    let activityLabel = 'Activity';
    if(this.dataset.activityLabel) {
      activityLabel = this.dataset.activityLabel;
    }
    let title = 'Find the status for activities in your county';
    if(this.dataset.title) {
      title = this.dataset.title;
    }
    let countyLabel = 'County';
    if(this.dataset.countyLabel) {
      countyLabel = this.dataset.countyLabel;
    }

    this.innerHTML = `
      <div class="reopening-fields">
      <h2>${title}</h2>
        <form>
          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="location-query">${countyLabel}</label>
              <div class="awesomplete">
                <div class="awesomplete">
                  <input
                    aria-expanded="false"
                    aria-owns="awesomplete_list_1"
                    autocomplete="off"
                    class="form-control"
                    data-list=""
                    data-multiple=""
                    id="location-query"
                    role="combobox"
                    type="text"
                  />
                  <ul hidden="" role="listbox" id="awesomplete_list_1"></ul>
                  <span
                    class="visually-hidden"
                    role="status"
                    aria-live="assertive"
                    aria-atomic="true"
                    >Type 2 or more characters for results.</span
                  >
                </div>
                <ul hidden="" id="awesomplete-list-1" role="listbox"></ul>
                <span
                  class="visually-hidden"
                  aria-atomic="true"
                  aria-live="assertive"
                  role="status"
                  >Type 2 or more characters for results.</span
                >
              </div>
            </div>
            <div class="form-group col-md-6">
              <label for="activity">${activityLabel}</label>
              <input type="text" class="form-control" id="activity" name="activity">
            </div>
          </div>

          <button type="submit" class="btn btn-primary">Get latest status</button>
        </form>
      </div>
    `
  }

  // going to want to call autocomplete similar to cagov/lookup at: https://api.alpha.ca.gov/CaZipCityCountyTypeAhead?citymode=false&countymode=true&q= but can't directly use that module because it has submit button and please enter
  // new activities will call their own api endpoint?
}
window.customElements.define('cagov-reopening', CAGovReopening);

