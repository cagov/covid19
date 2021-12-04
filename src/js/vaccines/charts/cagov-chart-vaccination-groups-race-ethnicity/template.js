import css from "./index.scss";

/**
 * Render bar chart for vaccinations group.
 * 
 * @param {string} translationsObj.chartTitle - Label for the chart
 * @param {string} translationsObj.chartDescription - Chart description
 * @param {string} translationsObj.chartDataLabel - Chart description
 * @param {string} translationsObj.chartDescriptionCountyFormatted - Chart data label, for counties, with strings replaced
 */
export default function template({
  chartDisplayTitle = "People with at least one dose of vaccine administered by race and ethnicity in [REGION]",
  chartDescription = null,
  chartDataLabel = null,
}) {
  return /*html*/ `
    <div class="col-lg-10 mx-auto pt-2">
      <div class="bg-white pt-4">
        <div class="chart-title">${chartDisplayTitle}</div>
        <!--<div class="small-text">${chartDescription}</div> -->
        <div class="svg-holder"></div>
      </div>
      ${chartDataLabel !== null ? `
        <p class="chart-data-label small-text mb-2">${chartDataLabel}</p>
      ` : ""}
    </div>`;
}
