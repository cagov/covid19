export default function template(json) {
  return /*html*/`
  <div class="reopening-fields">
  <h2 class="subtitle-color">${json.title}</h2>
    <form action="#" class="reopening-activities">
      <div class="form-row">
        <div class="form-group col-md-6 reopening-form-group">
          <label for="location-query">${json.countyLabel}</label>
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
              placeholder="${json.countyPlaceholder}"
            />
            <button type="button" class="clear d-none" id="clearLocation"><span class="ca-gov-icon-close-line" aria-hidden="true"></span> <span class="underline">${json.clearText}</span></button>
            <ul hidden="" role="listbox" id="awesomplete_list_1"></ul>
            <span
              class="visually-hidden"
              role="status"
              aria-live="assertive"
              aria-atomic="true"
              >Type 2 or more characters for results.</span
            >
            <div id="location-error" style="visibility: hidden" class="reopening-field-error text-danger text-small text-left">County not found. Search by county name.</div>
          </div>
          <ul hidden="" id="awesomplete-list-1" role="listbox"></ul>
        </div>
        <div class="form-group col-md-6 reopening-form-group">
          <label for="activity">${json.activityLabel}</label>
          <div class="awesomplete">
            <input
              aria-expanded="false"
              aria-owns="awesomplete_list_2"
              autocomplete="off"
              class="form-control"
              data-list=""
              data-multiple=""
              id="activity-query"
              role="combobox"
              type="text"
              placeholder="${json.activityPlaceholder}"
            />
            <button type="button" class="clear d-none" id="clearActivity"><span class="ca-gov-icon-close-line" aria-hidden="true"></span> <span class="underline">${json.clearText}</span></button>
            <ul hidden="" role="listbox" id="awesomplete_list_2"></ul>
            <div id="activity-error" style="visibility: hidden" class="reopening-field-error text-danger text-small text-left">Activity not found. Search a different term.</div>
          </div>
          <ul hidden="" id="awesomplete-list-2" role="listbox"></ul>
        </div>
      </div>
      <div id="reopening-error" style="visibility: hidden" class="reopening-form-error mb-1 text-danger text-small text-center">Please enter a county or an activity</div>
      <button type="submit" id="reopening-submit" class="btn btn-primary">${json.buttonText}</button>
    </form>
    <div class="card-holder"></div>
  </div>`
}