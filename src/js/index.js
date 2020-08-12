import '@cagov/step-list';
import '@cagov/accordion';
import './feature-detect/webp.js';
import applyAccordionListeners from './tracking-you/index.js';
import loadTwitterFeed from './twitter/index.js';
window.onload = (event) => {
  applyAccordionListeners();
  loadTwitterFeed();
}
import '@cagov/pagerating';
import './arrow/index.js';
import './search/index.js';
import './menu/index.js';
