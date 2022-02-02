import css from "./postvax-chart.scss";
/**
 * Generic template for mixed line/bar charts on State Dashboard
 * 
 */
export default function template(chartOptions, {
  post_chartTitle = "chart title",
  post_chartImpactStatement = "chart title",
  post_yaxis_legend = "y axis title",
  post_series1_legend = "Vaccinated", // expected
  post_series2_legend = "Unvaccinated", // expected
  post_series3_legend = "All cases", // expected
  mode_3lines = false,
}) {
  let legend_extra = '';

  return /*html*/ `
    <div class="py-2">
      <div class="bg-white pt-2 pb-1">
      <div class="chart-title noborder">${post_chartImpactStatement}</div>
      <div class="mx-auto postvax-chart">
            <div class="y-axis-title">${post_yaxis_legend}
              <span class="chart-legend">
                <svg class="series3-legend-line legend-line" data-name="legend-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 15"><path d="M0,6L24,6Z" /></svg>
                 ${post_series3_legend}<br>
                <svg class="series2-legend-line legend-line" data-name="legend-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 15"><path d="M0,6L24,6Z" /></svg>
                 ${post_series2_legend}<br>
               <svg class="series1-legend-line legend-line" data-name="legend-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 15"><path d="M0,6L24,6Z" /></svg>
                 ${post_series1_legend}
               </span>
            </div>
            <div class="svg-holder"></div>
        </div>
      </div>
    </div>
    `;
}
