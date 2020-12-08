export default function template(title, countyLabel, countyPlaceholder, activityLabel, activityPlaceholder) {
  return /*html*/`
  <div class="reopening-fields">
  <h2 class="subtitle-color">${title}</h2>
    <form action="#" class="reopening-activities">
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="location-query">${countyLabel}</label>
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
              placeholder="${countyPlaceholder}"
            />
            <button class="clear d-none" id="clearLocation"><span class="ca-gov-icon-close-line" aria-hidden="true"></span> <span class="underline">Clear</span></button>
            <ul hidden="" role="listbox" id="awesomplete_list_1"></ul>
            <span
              class="visually-hidden"
              role="status"
              aria-live="assertive"
              aria-atomic="true"
              >Type 2 or more characters for results.</span
            >
            <div id="location-error" style="visibility: hidden" class="mt-1 text-danger text-small text-left">County not found. Search by county name.</div>
          </div>
          <ul hidden="" id="awesomplete-list-1" role="listbox"></ul>
          <span
            class="sr-only"
            aria-atomic="true"
            aria-live="assertive"
            role="status"
            >Type 2 or more characters for results.</span
          >
        </div>
        <div class="form-group col-md-6">
          <label for="activity">${activityLabel}</label>
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
              placeholder="${activityPlaceholder}"
            />
            <button class="clear d-none" id="clearActivity"><span class="ca-gov-icon-close-line" aria-hidden="true"></span> <span class="underline">Clear</span></button>
            <ul hidden="" role="listbox" id="awesomplete_list_2"></ul>
            <div id="activity-error" style="visibility: hidden" class="mt-1 text-danger text-small text-left">Activity not found. Search a different term.</div>
          </div>
          <ul hidden="" id="awesomplete-list-2" role="listbox"></ul>
        </div>
      </div>

      <button type="submit" class="btn btn-primary">Get latest risk levels</button>
    </form>
    <div class="card-holder"></div>
  </div>`
}