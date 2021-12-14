import css from "./histogram.scss";
/**
 * Generic template for mixed line/bar charts on State Dashboard
 * 
 */
export default function template(chartOptions, {
  post_chartTitle = "chart title",
  post_chartLegend1 = "Chart Legend 1", // expected
  post_chartLegend2 = "Chart Legend 2", // expected
  post_chartLegend3 = null, // only used if provided
  filterTabLabel1 = 'Tab Label 1',
  filterTabLabel2 = 'Tab Label 2',
  timeTabLabel1 = 'Tab Label 1',
  timeTabLabel2 = 'Tab Label 2',
  timeTabLabel3 = 'Tab Label 3',
}) {
  let tabMarkup = '';
  if ('filterKeys' in chartOptions) {
    let active1 = this.chartConfigFilter == chartOptions.filterKeys[0]? "active" : "";
    let active2 = this.chartConfigFilter == chartOptions.filterKeys[1]? "active" : "";
    tabMarkup = `<cagov-chart-filter-buttons class="filter-buttons--statedash js-re-smalls js-filter-${this.chartConfigKey}">
            <div class="d-flex justify-content-center">
              <button class="small-tab ${active1}" data-key="${chartOptions.filterKeys[0]}">${filterTabLabel1}</button>
              <button class="small-tab ${active2}" data-key="${chartOptions.filterKeys[1]}">${filterTabLabel2}</button>
            </div>
          </cagov-chart-filter-buttons>`;
        
  }
  let timeMarkup = '';
  if ('timeKeys' in chartOptions) {
    const configTimeRange = this.chartConfigTimerange == undefined? 'all-time' : this.chartConfigTimerange;
    let active1 = configTimeRange == chartOptions.timeKeys[0]? "active" : "";
    let active2 = configTimeRange == chartOptions.timeKeys[1]? "active" : "";
    let active3 = configTimeRange == chartOptions.timeKeys[2]? "active" : "";
    timeMarkup = `<cagov-timerange-buttons class="time-buttons--statedash js-re-smalls js-filter-${this.chartConfigKey}">
            <div class="d-flex justify-content-center">
              <button class="small-tab ${active1}" data-key="${chartOptions.timeKeys[0]}">${timeTabLabel1}</button>
              <button class="small-tab ${active2}" data-key="${chartOptions.timeKeys[1]}">${timeTabLabel2}</button>
              <button class="small-tab ${active3}" data-key="${chartOptions.timeKeys[2]}">${timeTabLabel3}</button>
            </div>
          </cagov-chart-filter-buttons>`;
  }

  // Create select and options.
  // console.log('%c BEGIN SELECT', 'color: purple');

  // Collect values in arrays.
  const timeValues = [timeTabLabel1, timeTabLabel2, timeTabLabel3];
  const optionsValues = [filterTabLabel1, filterTabLabel2];

  // Set empty strings.
  let allSelectMarkup = '';
  let select = '';

  // Loop through options to create select tag.
  for (const optionLabel of optionsValues) {
    let optionsMarkup = '';
    const allOptions = [optionLabel, ...timeValues];
    for (const option of allOptions) {
      optionsMarkup += `<option value>${option}</option>`;
    }
    select += `<select>
        ${optionsMarkup}
      </select>`;
  }

  // Final select markup.
  allSelectMarkup = select + allSelectMarkup;
  // console.log('%c END SELECT', 'color: purple');

  // Return template.
  return /* html */ `
    <div class="py-2">
      <div class="bg-white pt-2 pb-1">
        <div class="mx-auto chart-histogram">
            <div class="chart-title">${post_chartTitle}</div>
            ${allSelectMarkup}
            ${tabMarkup}
            ${timeMarkup}
            <div class="chart-header">
            <div class="header-line header-line1">${post_chartLegend1}</div>
            <div class="header-line">${post_chartLegend2}</div>
` +
(post_chartLegend3?
`            <div class="header-line">${post_chartLegend3}</div>
` : '') +
`            </div>
            <div class="svg-holder"></div>
            <!-- <a class="dl-button" role="button">download</a> -->
        </div>
      </div>
    </div>
    `;
}
