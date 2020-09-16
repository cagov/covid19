import '@cagov/step-list';
import '@cagov/accordion';
import '@cagov/pagerating';
import './survey/index.js';
import './feature-detect/webp.js';
import './arrow/index.js';
import './menu/index.js';
import './search/index.js';
import applyAccordionListeners from './tracking-you/index.js';
window.onload = (event) => {
  applyAccordionListeners();
};
