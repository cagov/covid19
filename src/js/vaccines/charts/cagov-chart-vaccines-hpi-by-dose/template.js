import css from "./index.scss";

/**
 * Render bar chart for vaccinations group.
 * 
 * @param {string} translationsObj.chartTitle - Label for the chart
 * @param {string} translationsObj.chartDescription - Chart description
 * @param {string} translationsObj.chartDataLabel - Chart data label
 * @param {string} translationsObj.chartDescriptionCounty - Chart data label, for counties
 */
export default function template({
  chartTitle = "Vaccines by doses administered",
  chartDescription = "",
  footerDisplayText = "Updated {PUBLISHED_DATE} with data from {LATEST_ADMINISTERED_DATE}"
}) {
  return /*html*/ `
    <div class="row py-4">
      <div class="col-lg-9 col-md-9 col-sm-12 mx-auto">
        <div class="chart-title">${chartTitle}</div>
        <div class="small-text">${chartDescription}</div>
        <div class="svg-holder"></div>
      </div>
    </div>
    ${footerDisplayText !== null ? `<div class="row">
    <div class="col-lg-9 col-md-9 col-sm-12 mx-auto pt-2">
      <p class="chart-data-label small-text">${footerDisplayText}</p>
    </div>
  </div>` : ""}`;
}


