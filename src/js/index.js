import '@cagov/step-list';
import '@cagov/accordion';
import './pagerating/index.js';
import './survey/index.js';
import './survey-vaccine/index.js';
import './feature-detect/webp.js';
import './arrow/index.js';
import './arrow/arrow-icon.js';
import './menu/index.js';
import './search/index.js';
import './dark-accordion/extras.js';
import setupAnalytics from './tracking-you/index.js';

window.onload = (event) => {
  setupAnalytics();
};



