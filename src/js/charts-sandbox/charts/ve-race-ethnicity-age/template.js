import css from './index.scss';

export default function template(translationsObj) {
    return /*html*/`<div class="py-2">
    <div class="container">
      <div class="col-lg-12 bg-white py-4">

        <div class="row">
          <div class="col-lg-9 col-md-9 col-sm-12 mx-auto px-0">
            <div class="chart-title">TITLE</div>
            <div class="svg-holder">
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-lg-9 col-md-9 col-sm-12 mx-auto px-0">
            <p class="chart-data-label col-lg-10 mx-auto">FOOTNOTE</p>
          </div>
        </div>
      </div><!--END col-12-->
    </div><!--END CONTAINER-->
  </div>`;
}
