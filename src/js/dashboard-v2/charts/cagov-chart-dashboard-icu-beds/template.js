import css from "../common/chart.scss";
/**
 * Render bar chart for vaccinations group.
 * 
 * @param {string} translationsObj.chartTitle - Label for the chart
 * @param {string} translationsObj.chartDataLabel - Chart description
 */
export default function template({
  chartTitle = "Placeholder title",
  chartDataLabel = null,
}) {
  return /*html*/ `
    <div class="py-2">
      <div class="bg-white pt-2 pb-1">
        <div class="mx-auto">
            <div class="chart-title">${chartTitle}</div>
            <div class="chart-header">
            <div class="header-line"><span class="big-num">X,XXX</span> ICU beds available </div>
            <div class="header-line"><span class="med-num">XX</span> decrease from the prior day total </div>
            </div>
            <div class="svg-holder"></div>
        </div>
      </div>
    </div>`;
}
