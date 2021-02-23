// import css from "./index.scss";
/**
 * Render bar chart for vaccinations group.
 * 
 * @param {string} translationsObj.chartTitle - Label for the chart
 * @param {string} translationsObj.chartDataLabel - Chart description
 */
export default function template({
  chartDisplayTitle = "Confirmed cases by race and ethnicity in California",
  chartDataLabel = null,
}) {
  return /*html*/ `
    <div class="py-2">
      <div class="bg-white py-4">
        <div class="mx-auto">
            <div class="chart-title">${chartDisplayTitle}</div>
            <div class="svg-holder"></div>
        </div>
      </div>
    </div>`;
}
