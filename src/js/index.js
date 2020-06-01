import '@cagov/step-list';
import '@cagov/accordion';
import applyAccordionListeners from './tracking-you/index.js';
window.onload = (event) => {
  applyAccordionListeners();
}
import './feature-detect/webp.js';