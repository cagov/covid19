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
  chartDisplayTitle = "People with at least one dose of vaccine administered by gender in [REGION]",
  chartDescription = null,
  chartDataLabel = null,
}) {
  return /*html*/ `
    <div class="pt-2">
    <div class="container">
      <div class="col-lg-12 bg-white pt-4">
        <div class="row">
          <div class="col-lg-9 col-md-9 col-sm-12 mx-auto px-0">
            <div class="chart-title">${chartDisplayTitle}</div>
            <!--<div class="small-text">${chartDescription}</div> -->
            <div class="svg-holder"></div>
          </div>
        </div>
        ${chartDataLabel !== null ? `<div class="row">
        <div class="col-lg-9 col-md-9 col-sm-12 mx-auto px-0">
          <p class="chart-data-label small-text mx-auto mb-2">${chartDataLabel}</p>
        </div>
      </div>` : ""}
      </div><!--END col-12-->
    </div><!--END CONTAINER-->
  </div>`;
}


