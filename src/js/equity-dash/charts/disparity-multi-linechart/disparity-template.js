import css from "./disparity-chart.scss";


const createSelect = (
  labels,
  optionValues,
  configKey,
  configFilter,
  timerange,
  selectType,
) => {
  // Set initial string.
  let optionsMarkup = '';

  // Loop through options to populate select element.
  let i = 0;
  labels.forEach((label) => {
    // Set 'selected' attribute based on current chart config.
    const optionAttribute = (optionValues[i] === configFilter || optionValues[i] === timerange) ? 'selected = "selected"' : '';
    // Contatenate options.
    optionsMarkup += `<option aria-label="${label}" ${optionAttribute} value="${optionValues[i]}">${label}</option>`;
    i += 1;
  });

  // @todo a11y: Each select should have a label with a for="" attribute.
  return `
    <cagov-chart-filter-select class="js-filter-${configKey}">
      <select aria-label="pull down menu" data-type="${selectType}">
        ${optionsMarkup}
      </select>
    </cagov-chart-filter-select>
`;
};

/**
 * Generic template for mixed line/bar charts on State Dashboard
 * 
 */
export default function template(chartOptions, {
  post_chartTitle = "chart title",
  timeTabLabel1 = 'Tab Label 1',
  timeTabLabel2 = 'Tab Label 2',
  timeTabLabel3 = 'Tab Label 3',
  timeTabLabel4 = 'Tab Label 4',
}) {
  const timeLabels = 'timeKeys' in chartOptions ? [timeTabLabel1, timeTabLabel2, timeTabLabel3, timeTabLabel4] : [];
  const filters = {timeLabels};
  const filterValues = Object.values(filters);

  let select = '';
  let allSelectMarkup = '';

  console.log("timeLabels",timeLabels);

  // Loop through options to create select tag.
  filterValues.forEach((labels, filtersIndex) => {
    let optionValues = '';
    let renderSelect = false;

    // Only render the select if the associated keys exist.
    if (filtersIndex === 0 && 'timeKeys' in chartOptions) {
      console.log("time option",chartOptions.timeKeys);

      optionValues = chartOptions.timeKeys;
      renderSelect = [true, 'time'];
    }

    // Unused, but if we add a drop down for chart type, it will get used
    if (filtersIndex === 1 && 'filterKeys' in chartOptions) {
      optionValues = chartOptions.filterKeys;
      renderSelect = [true, 'filter'];
    }

    // Send values to the createSelect() function.
    if (renderSelect[0] === true) {
      console.log("Calling createSelect");
      select += createSelect(
        labels,
        optionValues,
        this.chartConfigKey,
        this.chartConfigFilter,
        this.chartConfigTimerange,
        renderSelect[1],
      );
    }
  });

  // Final select markup.
  allSelectMarkup = select + allSelectMarkup;

  return /*html*/ `
    <div class="py-2">
      <div class="container">
        <div class="col-lg-12 bg-white py-4">
          <div class="row">
            <div class="col-lg-12 mx-auto px-0 disparity-chart">
              <div class="chart-title noborder">${post_chartTitle}</div>
              ${allSelectMarkup}
              <div class="svg-holder"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
}
