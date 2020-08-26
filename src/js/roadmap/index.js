class CAGovReopening extends window.HTMLElement {
  connectedCallback () {
    let counties = this.dataset.counties;
    let activities = this.dataset.status;

    this.innerHTML = `
      <div class="reopening-fields">
      <h2>Find the status for activities in your county</h2>
        <form>
          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="county">County</label>
              <input type="text" class="form-control" id="county" name="county">
            </div>
            <div class="form-group col-md-6">
              <label for="activity">Activity</label>
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

