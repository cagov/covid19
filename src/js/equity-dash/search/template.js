export default function template(countyLabel, countyPlaceholder) {
  return /*html*/`
    <div class="row d-flex justify-content-md-center">
      <form class="form-inline" id="county-form">
        <div class="form-group mx-sm-3 mb-2 pos-rel autocomplete-inline">
          <label for="location-query" class="sr-only">County</label>
          <div class="awesomplete">
            <input aria-expanded="false" aria-owns="awesomplete_list_1" aria-controls="awesomplete_list_1"  autocomplete="off" class="form-control form-control-lg" data-list="" data-multiple="" id="location-query" role="combobox" type="text" placeholder="Enter a county">
            <button class="clear d-none" id="clearCounty"><span class="ca-gov-icon-close-line" aria-hidden="true"></span> <span class="underline">Clear</span></button>
            <span class="visually-hidden" role="status" aria-live="assertive" aria-atomic="true">Type 2 or more characters for results.</span>
          </div>
        </div>
      <button type="submit" class="btn btn-lightbg btn-bigger mb-2">Get county data</button>
      </form>
    </div>
    <div class="row d-flex justify-content-md-center">
      <span id="county-query-error" class="error-text d-none">County not found</span>
    </div>`
}