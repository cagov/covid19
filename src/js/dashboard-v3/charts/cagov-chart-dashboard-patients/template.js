/**
 * Render bar chart for vaccinations group.
 * 
 * @param {string} translationsObj.chartTitle - Label for the chart
 * @param {string} translationsObj.chartDataLabel - Chart description
 */
export default function template({
  post_chartTitle = "Chart Title",
  post_chartLegend1 = 'Legend 1',
  post_chartLegend2 = 'Legend 2',
  currentLocation = 'location'
}) {
  return /*html*/ `
    <div class="py-2">
      <div class="bg-white pt-2 pb-1">
        <div class="mx-auto">
            <div class="chart-title">${post_chartTitle} ${currentLocation}</div>
            <div class="chart-header">
            <div class="header-line header-line1">${post_chartLegend1}</div>
            <div class="header-line">${post_chartLegend2}</div>
            </div>
            <div class="svg-holder"></div>
        </div>
      </div>
    </div>`;
}
