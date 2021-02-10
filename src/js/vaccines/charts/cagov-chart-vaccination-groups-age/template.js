import css from "./index.scss";

/**
 * Render bar chart for vaccinations group.
 * 
 * @param {string} translationsObj.chartTitle - Label for the chart
 * @param {string} translationsObj.chartDescription - Chart description
 * @param {string} translationsObj.chartDataLabel - Chart description
 * @example - 

    <li data-label="chartTitle">% administered (people with at least 1 dose) by age in California</li>
    <li data-label="chartDescription">Lorem ipsum dolar sit amet, consectetur adipiscing elit.</li>
    <li data-label="chartDataLabel">Note: Data shown is a cumulative total, updated daily. To protect patient privacy, values are not shown if there are less than 20,000 in a group.</li>

 */
export default function template({
  chartTitle = "% administered (people with at least 1 dose) by age in California",
  chartDescription = "Lorem ipsum dolar sit amet, consectetur adipiscing elit.",
  chartDataLabel = "Note: Data shown is a cumulative total, updated daily. To protect patient privacy, values are not shown if there are less than 20,000 in a group."
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

        <div class="row">
          <div class="col-lg-9 col-md-9 col-sm-12 mx-auto px-0">
            <p class="chart-data-label col-lg-10 mx-auto">${chartDataLabel}</p>
          </div>
        </div>
      </div><!--END col-12-->
    </div><!--END CONTAINER-->
  </div>`;
}


