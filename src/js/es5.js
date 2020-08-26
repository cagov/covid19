import '@webcomponents/webcomponentsjs';
import 'whatwg-fetch';
import './polyfills/endswith.js';
import 'element-closest-polyfill';
import '@cagov/accordion';
import '@cagov/step-list';
import './alerts/index.js';
import './telehealth/index.js';
import './plasma/index.js';
import './feature-detect/webp.js';
import './menu/index.js';
import applyAccordionListeners from './tracking-you/index.js';
// twitter widget doesn't support IE11 so not including here
window.onload = (event) => {
  applyAccordionListeners();
};
