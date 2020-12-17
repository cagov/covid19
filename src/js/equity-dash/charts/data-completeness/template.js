import css from './index.scss';

export default function template(translationsObj) {
  // inhibit special note if it is missing (as it currently is for some translations)
  const inhibitNote = ('special-note' in translationsObj)? 
                      '' : 'style="display:none;"' ;
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
            <p class="chart-data-label col-lg-10 mx-auto">${translationsObj["footnote"]}</p>
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
