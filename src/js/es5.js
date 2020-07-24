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
//import './what-open-where/index.js'
import applyAccordionListeners from './tracking-you/index.js';
window.onload = (event) => {
  applyAccordionListeners();
}
import './video/index.js';