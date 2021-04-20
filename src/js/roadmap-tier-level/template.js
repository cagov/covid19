export default function template(json) {
  return /*html*/ `

  <div class="reopening-fields">
    <div class="container py-2">
      <div class="row">
        <div class="col-lg-10 mx-auto">

  <h2 class="subtitle-color mt-3">${json.title}</h2>
    <form action="#" class="reopening-activities ">
      <div class="form-row">
        <div class="form-group col-md-6 reopening-form-group">
          <label for="location-query">${json.countyLabel}</label>
          <div class="awesomplete">
            <input
              aria-expanded="false"
              aria-owns="awesomplete_list_1"
              aria-controls="awesomplete_list_1"
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
            <span
              class="visually-hidden"
              role="status"
              aria-live="assertive"
              aria-atomic="true"
              >${json.countyTierPrompt}</span
            >
            <div id="location-error" style="visibility: hidden" class="reopening-field-error text-danger text-small text-left">${json.countyNotFound}</div>

          </div>
        </div>
        <div class="form-group col-md-6 reopening-form-group">
          <label for="activity-query">${json.activityLabel}</label>
          <div class="awesomplete">
            <input
              id="activity-query"
              class="form-control"
              type="text"
              placeholder="${json.activityPlaceholder}"
              autocomplete="off"
              role="combobox"
              aria-expanded="false"
              aria-owns="awesomplete_list_2"
              aria-controls="awesomplete_list_2"
              aria-autocomplete="list"
              data-list=""
              data-multiple=""
            />
            <button type="button" class="clear d-none" id="clearActivity"><span class="ca-gov-icon-close-line" aria-hidden="true"></span> <span class="underline">${json.clearText}</span></button>
            <span
              class="visually-hidden"
              role="status"
              aria-live="assertive"
              aria-atomic="true"
              >${json.activityTierPrompt}</span
            >
            <div id="activity-error" style="visibility: hidden" class="reopening-field-error text-danger text-small text-left">${json.activityNotFound}</div>
          </div>
        </div>
      </div>
      <div id="reopening-error" style="visibility: hidden" class="reopening-form-error mb-1 text-danger text-small text-center">${json.emptySearchError}</div>
      <button type="submit" id="reopening-submit" class="btn btn-primary">${json.buttonText}</button>
    </form>
    <div class="card-holder"></div>
  </div></div></div></div>`;
}
