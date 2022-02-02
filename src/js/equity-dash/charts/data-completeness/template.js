import css from './index.scss';

export default function template(translationsObj) {
  // inhibit special note if it is missing (as it currently is for some translations)
  const inhibitNote = ('special-note' in translationsObj)? 
                      '' : 'style="display:none;"' ;
  const dataSrc = ('data-source' in translationsObj)? translationsObj["data-source"] : "";

  return /*html*/`<div class="py-2">
    <div class="container">
      <div class="col-lg-12 bg-white py-4">

        <div class="row">
          <div class="col-lg-9 col-md-9 col-sm-12 mx-auto px-0">
            <div class="chart-title">${translationsObj["title"]}</div>
            <div class="svg-holder">
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-lg-9 col-md-9 col-sm-12 mx-auto px-0">

          <p class="chart-data-label small-text mt-2 mb-2">${translationsObj.footerText}</p>

          <div class="mt-2">
            ${dataSrc}
          </div>

            <div class="wp-block-cgb-block-chart-drawer js-qa-exclude"><cagov-accordion class="chart-drawer">
            <div class="card"><button class="card-header accordion-alpha" type="button" aria-expanded="false"><div class="plus-munus"><cagov-plus></cagov-plus><cagov-minus></cagov-minus></div>
            <div class="accordion-title js-qa-exclude">Chart information</div></button><div class="card-container" aria-hidden="true"><div class="card-body">

              <p class="small-text">${translationsObj["footnote"]}</p>

            </div></div></div></cagov-accordion></div>
  
          </div>
        </div>


        <div class="row" ${inhibitNote}>
          <div class="col-lg-9 col-md-9 col-sm-12 mx-auto px-0">
            <div class="special-note mt-1 mb-1"><p>${translationsObj["special-note"]}</p></div>
          </div>
        </div>
      </div><!--END col-12-->
    </div><!--END CONTAINER-->
  </div>`;
}
