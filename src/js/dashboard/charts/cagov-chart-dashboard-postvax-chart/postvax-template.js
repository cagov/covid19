import css from "./postvax-chart.scss";
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
    optionsMarkup += `<option role="option" ${optionAttribute} value="${optionValues[i]}">${label}</option>`;
    i += 1;
  });

  // @todo a11y: Each select should have a label with a for="" attribute.
  return `
    <cagov-chart-filter-select class="js-filter-${configKey}">
      <select data-type="${selectType}">
        ${optionsMarkup}
      </select>
    </cagov-chart-filter-select>
`;
};

export default function template(chartOptions, {
  post_chartTitle = "chart title",
  post_chartImpactStatement = "chart title",
  post_yaxis_legend = "y axis title",
  post_series1_legend = "Vaccinated", // expected
  post_series2_legend = "Unvaccinated", // expected
  post_series3_legend = "All cases", // expected
  timeTabLabel1 = 'Tab Label 1',
  timeTabLabel2 = 'Tab Label 2',
  timeTabLabel3 = 'Tab Label 3',
  timeTabLabel4 = 'Tab Label 4',
  mode_3lines = false,
}) {
  const timeLabels = 'timeKeys' in chartOptions ? [timeTabLabel1, timeTabLabel2, timeTabLabel3, timeTabLabel4] : [];
  const filterLabels = 'filterKeys' in chartOptions ? [filterTabLabel1, filterTabLabel2] : [];
  const filters = {
    filterLabels,
    timeLabels,
  };
  const filterValues = Object.values(filters);
  let select = '';
  let allSelectMarkup = '';
  console.log("filterValues: ", filterValues)
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


  let legend_extra = '';
  if (mode_3lines) {
    legend_extra += "&nbsp;&nbsp;&nbsp;<span class=\"series3-legend-line\">⎯⎯⎯⎯</span> " + post_series3_legend;    
  }

  return /*html*/ `
    <div class="py-2">
      <div class="bg-white pt-2 pb-1">
      <div class="chart-title noborder">${post_chartImpactStatement}</div>
      <div class="mx-auto postvax-chart">
            ${allSelectMarkup}
            <div class="y-axis-title">${post_yaxis_legend}
              <span class="chart-legend">
                <svg class="series2-legend-line legend-line" data-name="legend-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 15"><path d="M0,6L24,6Z" /></svg>
                 ${post_series2_legend}&nbsp;&nbsp;&nbsp;
               <svg class="series1-legend-line legend-line" data-name="legend-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 15"><path d="M0,6L24,6Z" /></svg>
                 ${post_series1_legend}${legend_extra}
               </span>
            </div>
            <div class="svg-holder"></div>
        </div>
      </div>
    </div>
    `;
}
