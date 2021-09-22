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
  return /*html*/ `
   <div class="postvax-chart">
      <div class="svg-holder"></div>
   </div>
    `;
}
