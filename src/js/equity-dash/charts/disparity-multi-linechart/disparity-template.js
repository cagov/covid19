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
      <div class="bg-white pt-2 pb-1">
      <div class="chart-title noborder">${post_chartTitle}</div>
      <div class="mx-auto disparity-chart">
            <div class="svg-holder"></div>
        </div>
      </div>
    </div>
    `;
}
