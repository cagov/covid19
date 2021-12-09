import getScreenResizeCharts from "../../../common/get-window-size.js";
import chartConfig from '../common/line-chart-config.json';

export default class CAGovDashboardChart extends window.HTMLElement {


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

  cropData(timerangeKey) {
    const keys = [this.chartOptions.seriesField, this.chartOptions.seriesFieldAvg];
    const unitSizeDict = {'months':31,'month':31,'days':1,'day':1};

    let daysToKeep = -1;
    const tokens = timerangeKey.split('-');
    if (tokens[0] in unitSizeDict) {
      daysToKeep = unitSizeDict[tokens[0]] * parseInt(tokens[1]);
    }
    this.chartdata = JSON.parse(JSON.stringify(this.uncroppedChartData)); // deep copy
    if (daysToKeep > 0) {
      keys.forEach( (key) => {
        const chartSeries = this.chartdata.time_series[key];
        chartSeries.VALUES = chartSeries.VALUES.splice(0,daysToKeep);
        const lastValue = chartSeries.VALUES[chartSeries.VALUES.length-1];
        chartSeries.DATE_RANGE.MINIMUM = lastValue.DATE;
      });
    }
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
          this.chartdata = alldata.data;
          this.uncroppedChartData = alldata.data;

          this.renderComponent(regionName);
        }.bind(this)
      );
  }

  chartFilterSelectHandler(e) {
    console.log(this.chartConfigKey,"chartFilterSelectHandler",e.detail.filterKey);
    this.chartConfigFilter = e.detail.filterKey;
    if (!(e.detail.filterKey in chartConfig[this.chartConfigKey])) {
        console.log("resetting to default filter key")
        this.chartConfigFilter = chartConfig[this.chartConfigKey].filterKeys[0];
    }
    console.log(this.chartConfigKey,"set filterKey to",this.chartConfigFilter);
    chartConfig[this.chartConfigKey].filterKeys.forEach( (loopKey) => {
        if (loopKey == this.chartConfigFilter) {
            document.querySelector(`cagov-chart-filter-buttons.js-filter-${this.chartConfigKey} .small-tab[data-key="${loopKey}"]`).classList.add('active');
        } else {
            document.querySelector(`cagov-chart-filter-buttons.js-filter-${this.chartConfigKey} .small-tab[data-key="${loopKey}"]`).classList.remove('active');
        }
    });

    this.chartOptions = chartConfig[this.chartConfigKey][this.chartConfigFilter];
    // if I am in a county have to do county url replacement
    this.renderComponent(this.regionName);
  }


  chartTimerangeSelectHandler(e) {
    console.log(this.chartConfigKey,"charttimerange", e.detail.timerangeKey);
    this.chartConfigTimerange = e.detail.timerangeKey;
    this.chartOptions = chartConfig[this.chartConfigKey][this.chartConfigFilter];
    // if I am in a county have to do county url replacement
    this.renderComponent(this.regionName);
  }

  tabFilterHandler(e) {
    this.chartFilterSelectHandler(e);
    const event = new window.CustomEvent(`${this.chartConfigKey}-chart-filter-select`,{detail:{filterKey: this.chartConfigFilter}});
    window.dispatchEvent(event);    
  }


  timerangeFilterHandler(e) {
    console.log(this.chartConfigKey,"timerangeFilterHandler", e.detail.timerangeKey);
    this.chartTimerangeSelectHandler(e);
  }

  setupTabFilters() {
    console.log("SETTING up setupTabFilters for "+this.chartConfigKey);
    if (chartConfig[this.chartConfigKey].filterKeys.length > 1) {
        let myFilter = document.querySelector(`cagov-chart-filter-buttons.js-filter-${this.chartConfigKey}`);
        myFilter.addEventListener(
        "filter-selected",
        this.tabFilterHandler.bind(this),
        false
        );
    }

    console.log("SETTING up timerangefilterhandler for "+this.chartConfigKey);
    let myTimeFilter = document.querySelector(`cagov-timerange-buttons.js-filter-${this.chartConfigKey}`);
    myTimeFilter.addEventListener(
      "timerange-selected",
      this.timerangeFilterHandler.bind(this),
      false
    );
  }



}


