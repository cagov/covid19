import css from './histogram.scss';

/**
 * Build each select.
 *
 * @return  string  Temlate markup.
 */
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
    optionsMarkup += `<option role="option" ${optionAttribute} value="${optionValues[i]}">${label}</option>`;
    i += 1;
  });

  // @todo a11y: Each select should have a label with a for="" attribute.
  return `
    <cagov-chart-filter-select class="js-filter-${configKey}">
      <select role="listbox" data-type="${selectType}">
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
  post_chartLegend1 = "Chart Legend 1", // expected
  post_chartLegend2 = "Chart Legend 2", // expected
  post_chartLegend3 = null, // only used if provided
  filterTabLabel1 = 'Tab Label 1',
  filterTabLabel2 = 'Tab Label 2',
  timeTabLabel1 = 'Tab Label 1',
  timeTabLabel2 = 'Tab Label 2',
  timeTabLabel3 = 'Tab Label 3',
}) {
  // console.log('%c BEGIN SELECT', 'color: purple');
  // Group values into arrays.
  const timeLabels = 'timeKeys' in chartOptions ? [timeTabLabel1, timeTabLabel2, timeTabLabel3] : [];
  const filterLabels = 'filterKeys' in chartOptions ? [filterTabLabel1, filterTabLabel2] : [];
  const filters = {
    filterLabels,
    timeLabels,
  };
  const filterValues = Object.values(filters);

  // Set empty strings.
  let select = '';
  let allSelectMarkup = '';

  // Loop through options to create select tag.
  filterValues.forEach((labels, filtersIndex) => {
    let optionValues = '';
    let renderSelect = false;

    // Only render the select if the associated keys exist.
    if (filtersIndex === 1 && 'timeKeys' in chartOptions) {
      optionValues = chartOptions.timeKeys;
      renderSelect = [true, 'time'];
    }

    if (filtersIndex === 0 && 'filterKeys' in chartOptions) {
      optionValues = chartOptions.filterKeys;
      renderSelect = [true, 'filter'];
    }

    // Send values to the createSelect() function.
    if (renderSelect[0] === true) {
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
  // console.log('%c END SELECT', 'color: purple');

  // Return template.
  return /* html */ `
    <div class="py-2">
      <div class="bg-white pt-2 pb-1">
        <div class="mx-auto chart-histogram">
            <div class="chart-title"><span>${post_chartTitle}</span></div> 
            ${allSelectMarkup}
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
