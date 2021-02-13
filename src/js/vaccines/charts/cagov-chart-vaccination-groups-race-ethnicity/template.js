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
    <div class="py-2">
    <div class="container">
      <div class="col-lg-12 bg-white py-4">
        <div class="row">
          <div class="col-lg-9 col-md-9 col-sm-12 mx-auto px-0">
            <div class="chart-title">${chartDisplayTitle}</div>
            <!--<div class="small-text">${chartDescription}</div> -->
            <div class="svg-holder"></div>
          </div>
        </div>
        ${chartDataLabel !== null ? `<div class="row">
        <div class="col-lg-9 col-md-9 col-sm-12 mx-auto px-0">
          <p class="chart-data-label small-text col-lg-10 mx-auto">${chartDataLabel}</p>
        </div>
      </div>` : ""}
      </div><!--END col-12-->
    </div><!--END CONTAINER-->
  </div>`;
}
