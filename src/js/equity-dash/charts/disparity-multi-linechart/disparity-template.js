import css from "./disparity-chart.scss";
/**
 * Generic template for mixed line/bar charts on State Dashboard
 * 
 */
export default function template(chartOptions, {
  post_chartTitle = "chart title",
}) {
  let legend_extra = '';

  return /*html*/ `
    <div class="py-2">
      <div class="container">
        <div class="col-lg-12 bg-white py-4">
          <div class="row">
            <div class="col-lg-12 mx-auto px-0 disparity-chart">
              <div class="chart-title noborder">${post_chartTitle}</div>
              <div class="svg-holder"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
}
