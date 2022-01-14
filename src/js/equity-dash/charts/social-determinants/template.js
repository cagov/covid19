// import chartCss from './../chart.scss';
import css from './index.scss';

export default function template(translationsObj) {
  let dataSrc = ('data-source' in translationsObj)? translationsObj["data-source"] : "";
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

          <p class="chart-data-label small-text mt-4 mb-2">${translationsObj.post_footerText}</p>
  

            <div class="mt-4">
              ${dataSrc}
            </div>
  
            <div class="wp-block-cgb-block-chart-drawer js-qa-exclude"><cagov-accordion class="chart-drawer">
            <div class="card"><button class="card-header accordion-alpha" type="button" aria-expanded="false"><div class="plus-munus"><cagov-plus></cagov-plus><cagov-minus></cagov-minus></div>
            <div class="accordion-title js-qa-exclude">Chart information</div></button><div class="card-container" aria-hidden="true"><div class="card-body">
          
              <p class="small-text">${translationsObj.footnote}</p>
  
            </div></div></div>
            </cagov-accordion></div>
                
          </div>
        </div>
    </div><!--END col-12-->
  </div><!--END CONTAINER-->
  </div> <!-- row -->
  </div> <!-- container -->
</div><!--END BG lightblue-->`;
}
