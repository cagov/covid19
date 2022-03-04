import getScreenResizeCharts from "../../../common/get-window-size.js";
import chartConfig from '../common/line-chart-config.json';
import getTranslations from "../../../common/get-strings-list.js";
import rtlOverride from "../../../common/rtl-override.js";
import template from "./../common/histogram-template.js";
import renderChart from "../common/histogram.js";

export default class CAGovDashboardChart extends window.HTMLElement {

    connectedCallback() {
        console.log("Loading ",this.dataset.chartConfigKey,this.dataset.chartConfigFilter);
        this.translationsObj = getTranslations(this);
        this.chartConfigFilter = this.dataset.chartConfigFilter;
        this.chartConfigKey = this.dataset.chartConfigKey;
        this.chartConfigTimerange = this.dataset.chartConfigTimerange;
        this.county = 'California';
    
        this.chartOptions = chartConfig[this.chartConfigKey][this.chartConfigFilter];
        this.stateData = null;
        this.uncroppedStateData = null;
    
        getScreenResizeCharts(this);
    
        this.screenDisplayType = window.charts
          ? window.charts.displayType
          : "desktop";
    
        this.chartBreakpointValues = chartConfig[
          this.screenDisplayType ? this.screenDisplayType : "desktop"
        ];
        this.dimensions = JSON.parse(JSON.stringify(this.chartBreakpointValues));
        if ('rightMarginOverride' in this.chartOptions) {
             this.dimensions.margin.right = this.chartOptions.rightMarginOverride;
        }
        // console.log(this.dataset.chartConfigKey,"Dimensions",this.dimensions);
        window.addEventListener("resize", this.handleChartResize);
    
        // Set default values for data and labels
        this.dataUrl = config.chartsStateDashTablesLoc + this.chartOptions.dataUrl;
    
        this.retrieveData(this.dataUrl, 'California');
    
        rtlOverride(this); // quick fix for arabic
    
        this.listenForLocations();
    }

  ariaLabel(d, baselineData) {
    let caption = ''; // !!!
    return caption;
  }

  getLegendText() {
    return [];
    //   this.translationsObj.chartLegend1,
    //   this.translationsObj.chartLegend2,
    // ];
  }

  renderExtras(svg) {
    if (this.regionName == 'California') {
    }
  }

  handleChartResize() {
    getScreenResizeCharts(this);
    this.screenDisplayType = window.charts
      ? window.charts.displayType
      : "desktop";
    this.chartBreakpointValues = chartConfig[
      this.screenDisplayType ? this.screenDisplayType : "desktop"
    ];
  }

  retrieveData(url, regionName) {
    // console.log("Retrieving " + this.chartConfigKey);
    window
      .fetch(url)
      .then((response) => response.json())
      .then(
        function (alldata) {
            this.regionName = regionName;
            this.metadata = alldata.meta;
            this.chartData = alldata.data;
            this.uncroppedChartData = alldata.data;
            if ('usesStateData' in this.chartOptions) {
                if (regionName == 'California') {
                    this.uncroppedStateData = alldata.data;
                }
            }
            this.renderComponent(regionName);
        }.bind(this)
      );
  }

  /**
   * Get select values and send them to the chart for rendering.
   *
   * @param   {NodeList}  selectFilters  List of select tags on the chart.
   * @param   {Event}  e  Event. (function breaks without it even though it isn't used.)
   *
   */
  chartFilterSelectsHandler(selectFilters, e) {
    selectFilters.forEach((select) => {
      switch (select.dataset.type) {
        case 'time':
          this.chartConfigTimerange = select.value;
          break;
        case 'filter':
          this.chartConfigFilter = select.value;
          this.chartOptions = chartConfig[this.chartConfigKey][this.chartConfigFilter];
          break;
        default:
      }
    });
    this.renderComponent(this.regionName);
  }

  // Add event listener to select filters.
  setupSelectFilters() {
    const selectFilters = document.querySelectorAll(`cagov-chart-filter-select.js-filter-${this.chartConfigKey} select`);

    selectFilters.forEach((selectFilter) => {
      selectFilter.addEventListener(
        'change',
        this.chartFilterSelectsHandler.bind(this, selectFilters),
        false,
      );
    });
  }

  locationHandler(e) {
    this.county = e.detail.county;
    let countyEncoded = this.county.toLowerCase().replace(/ /g, "_");
    let searchURL = config.chartsStateDashTablesLoc + this.chartOptions.dataUrlCounty.replace(
      "<county>",
      countyEncoded
    );
    this.retrieveData(searchURL, e.detail.county, this.timerange);
  }

  listenForLocations() {
    let searchElement = document.querySelector("cagov-county-search");
    searchElement.addEventListener(
      "county-selected",
      this.locationHandler.bind(this),
      false
    );
  }

  cropData(timerangeKey, uncroppedChartData) {
    const keys = [this.chartOptions.seriesField, this.chartOptions.seriesFieldAvg];
    const unitSizeDict = {'months':31,'month':31,'days':1,'day':1};

    let daysToKeep = -1;
    const tokens = timerangeKey.split('-');
    if (tokens[0] in unitSizeDict) {
      daysToKeep = unitSizeDict[tokens[0]] * parseInt(tokens[1]);
    }
    let chartData = JSON.parse(JSON.stringify(uncroppedChartData)); // deep copy
    if (daysToKeep > 0) {
      keys.forEach( (key) => {
        const chartSeries = chartData.time_series[key];
        chartSeries.VALUES = chartSeries.VALUES.splice(0,daysToKeep);
        const lastValue = chartSeries.VALUES[chartSeries.VALUES.length-1];
        chartSeries.DATE_RANGE.MINIMUM = lastValue.DATE;
      });
    }
    return chartData;
  }  

  renderComponent(regionName) {
    // console.log("Render component",this.chartConfigKey);

    this.chartData = this.cropData(this.chartConfigTimerange, this.uncroppedChartData);

    this.addStateLine = false;
    if ('usesStateData' in this.chartOptions) {
        if (regionName != 'California') {
            this.stateData = this.cropData(this.chartConfigTimerange, this.uncroppedStateData);
            this.addStateLine = true;
        }
    }

    const repDict = this.setupPostTranslations(regionName);

    this.innerHTML = template.call(this, this.chartOptions, this.translationsObj);

    // Create dropdown filters.
    this.setupSelectFilters();

    const renderOptions = this.setupRenderOptions();
    renderOptions.lineAndBarsSameScale = this.chartOptions.lineAndBarsSameScale;
    renderOptions.alignAverages = this.chartOptions.alignAverages;
    renderOptions.month_modulo = this.chartConfigTimerange == 'all-time'? 3 : 1;

    renderChart.call(this, renderOptions);
  }

}


