import template from "./template.js";
import getTranslations from './../../get-strings-list.js';
import getScreenResizeCharts from './../../get-window-size.js';
import rtlOverride from "./../../rtl-override.js";
import { reformatReadableDate } from "../../readable-date.js";

class CAGOVEquityVaccinesRaceEthnicityAge extends window.HTMLElement {
  connectedCallback() {
    this.translationsObj = this.getTranslations(this);
    this.innerHTML = template(this.translationsObj);
    // Settings and initial values
    this.chartOptions = {
      // Data
      dataUrl: config.equityChartsSampleDataLoc+"vaccines_by_race_ethnicity_and_age_california.json", // Overwritten by county.
      state: 'California',
      // Style
      backgroundFill: '#F2F5FC',
      chartColors: ["#92C5DE", "#FFCF44"],
      // Breakpoints
      desktop: {
        fontSize: 14,
        height: 214,
        width: 613,
        margin: {
          top: 40,
          right: 0,
          bottom: 20,
          left: 0,
        },
        heightMultiplier: 100,
        labelOffsets: [-52, -52, -57],
      },
      tablet: {
        fontSize: 14,
        height: 214,
        width: 440,
        margin: {
          top: 40,
          right: 0,
          bottom: 20,
          left: 0,
        },
        heightMultiplier: 100,
        labelOffsets: [-52, -52, -57],
      },
      mobile: {
        fontSize: 12,
        height: 600,
        width: 440,
        margin: {
          top: 40,
          right: 0,
          bottom: 20,
          left: 0,
        },
        heightMultiplier: 100,
        labelOffsets: [-52, -52, -57],
      },
      retina: {
        fontSize: 12,
        height: 600,
        width: 320,
        margin: {
          top: 40,
          right: 0,
          bottom: 20,
          left: 0,
        },
        heightMultiplier: 100,
        labelOffsets: [-52, -52, -57],
      },
    };

    