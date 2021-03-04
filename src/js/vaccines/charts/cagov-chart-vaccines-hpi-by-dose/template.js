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
    <div class="py-2">
    <div class="container">
      <div class="col-lg-12 bg-white py-4">
        <div class="row">
          <div class="col-lg-9 col-md-9 col-sm-12 mx-auto px-0">
            <div class="chart-title">${chartTitle}</div>
            <div class="small-text">${chartDescription}</div>
            <div class="svg-holder"></div>
          </div>
        </div>
        ${footerDisplayText !== null ? `<div class="row">
        <div class="col-lg-9 col-md-9 col-sm-12 mx-auto px-0 pt-2">
          <p class="chart-data-label small-text col-lg-10 mx-auto">${footerDisplayText}</p>
        </div>
      </div>` : ""}
      </div><!--END col-12-->
    </div><!--END CONTAINER-->
  </div>`;
}


