/**
 * Render bar chart for vaccinations group.
 * 
 * @param {string} translationsObj.chartTitle - Label for the chart
 * @param {string} translationsObj.chartDataLabel - Chart description
 */
export default function template({
  chartTitle = "chart title",
  post_chartLegend1 = "Chart Legend 1",
  post_chartLegend2 = "Chart Legend 2",
  post_chartLegend3 = "Chart Legend 3",
  chartDataLabel = null,
  currentLocation = 'location'
}) {

  return /*html*/ `
    <div class="py-2">
      <div class="bg-white pt-2 pb-1">
        <div class="mx-auto">
            <div class="chart-title">${chartTitle} ${currentLocation}</div>
            <!-- tabs go here -->
            <div class="chart-header">
            <div class="header-line header-line1">${post_chartLegend1}</div>
            <div class="header-line">${post_chartLegend2}</div>
            <div class="header-line">${post_chartLegend3}</div>
            </div>
            <div class="svg-holder"></div>
        </div>
      </div>
    </div>
    <!-- <div class="tooltip-container"></div> -->
    `;
}
