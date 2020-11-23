import css from './index.scss';

export default function template(translationsObj) {
  return /*html*/`<div class="py-2">
    <div class="container">
      <div class="col-lg-12 bg-white py-4">
        <div class="row">
          <div class="col-lg-9 col-md-9 col-sm-12 mx-auto">
            <div class="chart-title">${translationsObj["title"]}</div>
            <div class="svg-holder">
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-lg-9 col-md-9 col-sm-12 mx-auto">
            <p class="chart-data-label col-lg-10 px-0">${translationsObj["footnote"]}</p>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-9 col-md-9 col-sm-12 mx-auto">
            <div class="special-note mt-1 mb-1"><p>${translationsObj["special-note"]}</p></div>
          </div>
        </div>
      </div><!--END col-12-->
    </div><!--END CONTAINER-->
  </div><!--END BG lightblue-->`;
}
