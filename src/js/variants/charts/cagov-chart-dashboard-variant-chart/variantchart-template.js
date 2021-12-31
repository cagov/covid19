import css from "./variantchart.scss";
/**
 * Generic template for mixed line/bar charts on State Dashboard
 * 
 */
export default function template(chartOptions, {
  post_chartTitle = "chart title",   /* Unused, but left in for future use */
  post_chart_update_statement = ""
}) {

  return /*html*/ `
  <p>${post_chart_update_statement}</p>
  <div class="svg-holder"></div>
    `;
}
