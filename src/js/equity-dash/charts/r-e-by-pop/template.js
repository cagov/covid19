import css from './index.scss';

export default function template(title, description) {
  return /*html*/`<div class="py-2">
    <div class="container">
      <div class="col-lg-12 bg-white px-3 py-4">
        <div class="row">
          <div class="col-10 mx-auto">
            <div class="chart-title">${title}</div>
            <p class="small-text">${description}</p>
            <div class="svg-holder"></div>
          </div>
        </div>
      </div><!--END col-12-->
    </div><!--END CONTAINER-->
  </div><!--END BG lightblue-->`;
}