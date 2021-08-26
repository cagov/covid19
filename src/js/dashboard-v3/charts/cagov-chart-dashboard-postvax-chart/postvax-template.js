import css from "./postvax-chart.scss";
/**
 * Generic template for mixed line/bar charts on State Dashboard
 * 
 */
export default function template(chartOptions, {
  post_chartTitle = "chart title",
  post_chartHeaderText = "chart title",
  post_yaxis_legend = "y axis title",
  post_series1_legend = "Vaccinated", // expected
  post_series2_legend = "Unvaccinated", // expected
  post_series3_legend = "All cases", // expected
  mode_3lines = false,
}) {
  let legend_extra = '';
  if (mode_3lines) {
    legend_extra += "&nbsp;&nbsp;&nbsp;<span class=\"series3-legend-line\">⎯⎯⎯⎯</span> " + post_series3_legend;    
  }

  return /*html*/ `
    <div class="py-2">
      <div class="bg-white pt-2 pb-1">
      <div class="chart-title noborder">${post_chartHeaderText}</div>
      <div class="mx-auto postvax-chart">
            <div class="y-axis-title">${post_yaxis_legend}
              <span class="chart-legend"><span class="series1-legend-line">⎯⎯⎯⎯</span> ${post_series1_legend}&nbsp;&nbsp;&nbsp;<span class="series2-legend-line">⎯⎯⎯⎯</span> ${post_series2_legend}${legend_extra}</span>
            </div>
            <div class="svg-holder"></div>
        </div>
      </div>
    </div>
    `;
}
