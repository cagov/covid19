/**
 * Render bar chart for vaccinations group.
 * 
 * @param {string} translationsObj.chartTitle - Label for the chart
 * @param {string} translationsObj.chartDataLabel - Chart description
 */
export default function template({
  chartTitle = "Confirmed cases by age in California",
  chartDataLabel = null,
  chartLegend1 = null,
  chartLegend2Increase = null,
}) {
  return /*html*/ `
    <div class="py-2">
      <div class="bg-white pt-2 pb-1">
        <div class="mx-auto">
            <div class="chart-title">${chartTitle}</div>
            <div class="chart-header">
            <div class="header-line"><span class="big-num">X,XXX</span> COVID-19 hospitalized patients </div>
            <div class="header-line"><span class="med-num">+XX</span> more patients (X.X% increase) </div>
            </div>
            <div class="svg-holder"></div>
        </div>
      </div>
    </div>`;
}
