import css from "./variantchart.scss";
/**
 * Generic template for mixed line/bar charts on State Dashboard
 * 
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

export default function template(chartOptions, {
  post_chartTitle = "chart title",   /* Unused, but left in for future use */
  post_chart_update_statement = "",
  filterTabLabel1 = 'Tab Label 1',
  filterTabLabel2 = 'Tab Label 2',
  timeTabLabel1 = 'Tab Label 1',
  timeTabLabel2 = 'Tab Label 2',
  timeTabLabel3 = 'Tab Label 3',
}) {

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

  return /*html*/ `
  <p>${post_chart_update_statement}</p>

  ${allSelectMarkup}

  <div class="svg-holder"></div>
    `;
}
