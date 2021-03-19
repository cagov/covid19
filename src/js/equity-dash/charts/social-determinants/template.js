// import chartCss from './../chart.scss';
import css from './index.scss';

export default function template(translationsObj) {
  return /*html*/`<div class="py-2 bg-lightblue full-bleed px-4">
    <div class="container">
    <div class="row">
    <div class="container col-lg-10 mx-auto">
    <h2 class="text-center" id="factors">${translationsObj.sectionTitle}</h2>
    <p>${translationsObj.sectionDescription}</p>
    <div class="col-lg-12 bg-white px-3 py-4">
        <div class="d-flex flex-column flex-md-row justify-content-center mt-3">
          <div class="large-tabs">
              <button class="large-tab active js-toggle-group income">${translationsObj.chartButtonIncome}</button>
              <button class="large-tab js-toggle-group housing">${translationsObj.chartButtonHousing}</button>
              <button class="large-tab js-toggle-group healthcare">${translationsObj.chartButtonHealthcare}</button>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-9 col-md-9 col-sm-12 mx-auto px-0">
              <div class="chart-title">${translationsObj.chartTitleIncome}</div>
              <div class="svg-holder">
                <div class="tooltip-container">an empty tooltip</div>
              </div>
            </div>
        </div>
        <div class="row d-flex justify-content-md-center">
          <div class="col-lg-9 col-md-9 col-sm-12 mx-auto">
            <p class="chart-data-label col-lg-10 py-4 mx-auto">${translationsObj.footnote}</p>
          </div>
        </div>
    </div><!--END col-12-->
  </div><!--END CONTAINER-->
  </div> <!-- row -->
  </div> <!-- container -->
</div><!--END BG lightblue-->`;
}
