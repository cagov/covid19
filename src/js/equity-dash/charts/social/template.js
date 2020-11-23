export default function template(translationsObj) {
  return /*html*/`<div class="bg-lightblue py-2 full-bleed">
    <div class="container">
    <h2 class="text-center">${translationsObj.sectionTitle}</h2>
    <p>${translationsObj.sectionDescription}</p>
    <div class="col-lg-12 bg-white px-3 py-4">
        <div class="row d-flex justify-content-md-center">

            <div class="inline-toggle-link-container">
                <div class="toggle-links bg-darkblue bd-darkblue">
                  <a href="#" class="toggle-active js-toggle-group income">${translationsObj.chartButtonIncome}</a><a href="#" class="js-toggle-group  housing">${translationsObj.chartButtonHousing}</a><a href="#" class="js-toggle-group healthcare">${translationsObj.chartButtonHousing}</a>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-10 mx-auto">
              <div class="chart-title">${translationsObj.chartTitleIncome}</div>
              <div class="svg-holder">
                <div class="bar-overlay">an empty tooltip</div>
              </div>
            </div>
        </div>
        <div class="row d-flex justify-content-md-center">
          <p class="chart-data-label">${translationsObj.footnote}</p>
        </div>
    </div><!--END col-12-->
  </div><!--END CONTAINER-->
</div><!--END BG lightblue-->`;
}
