import '@cagov/step-list';
import './feature-detect/webp.js';
import '@cagov/pagerating';
import '@cagov/accordion';
import './arrow/index.js';
import './search/index.js';
import applyAccordionListeners from './tracking-you/index.js';
window.onload = (event) => {
  applyAccordionListeners();
};
