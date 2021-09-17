import css from "./sparkline.scss";
/**
 * Generic template for mixed line/bar charts on State Dashboard
 * 
 */
export default function template(chartOptions, {
  post_chartTitle = "chart title",
}) {

  return /*html*/ `
            <div class="svg-holder"></div>
    `;
}
