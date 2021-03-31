/**
 * Render bar chart for vaccinations group.
 * 
 * @param {string} translationsObj.chartTitle - Label for the chart
 * @param {string} translationsObj.chartDataLabel - Chart description
 */
export default function template({
  chartTitle = "Confirmed cases by age in California",
  chartDataLabel = null,
}) {
  return /*html*/ `
    <div class="py-2">
      <div class="bg-white pt-2 pb-1">
        <div class="mx-auto">
            <div class="chart-title">${chartTitle}</div>
            <!-- tabs go here -->
            <div class="chart-header">
            <div class="header-line"><span class="big-num">3,568,426</span> total confirmed cases </div>
            <div class="header-line"><span class="med-num">1,962</span> new cases (0.1% increase) </div>
            <div class="header-line"><span class="med-num">4.6</span> cases per 100K (7-day average) </div>
            </div>
            <div class="svg-holder"></div>
        </div>
      </div>
    </div>`;
}
