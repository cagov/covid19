import css from "./index.scss";
/**
 * Render bar chart for vaccinations group.
 * 
 * @param {string} translationsObj.chartTitle - Label for the chart
 * @param {string} translationsObj.chartDataLabel - Chart description
 */
export default function template({
  chartTitle = "Confirmed deaths by age in California",
  chartDataLabel = null,
}) {
  return /*html*/ `
  <div class="py-2">
    <div class="bg-white py-4">
      <div class="mx-auto">
        <div class="chart-title">${chartTitle}</div>
        <div class="svg-holder"></div>
      </div>
    </div>
  </div>`;
}
