export default function template(title, countyLabel, countyPlaceholder, activityLabel, activityPlaceholder) {
  return `
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
            <ul hidden="" role="listbox" id="awesomplete_list_2"></ul>
          </div>
          <ul hidden="" id="awesomplete-list-2" role="listbox"></ul>
        </div>
      </div>

      <button type="submit" class="btn btn-primary">Get latest status</button>
    </form>
    <div class="card-holder"></div>
  </div>`
}