import '@webcomponents/webcomponentsjs';
import 'whatwg-fetch';
import './polyfills/endswith.js';
import '@cagov/accordion';
import '@cagov/step-list';
import './alerts/index.js';
import './telehealth/index.js';
import './plasma/index.js';
import './feature-detect/webp.js';
import applyAccordionListeners from './tracking-you/index.js';
window.onload = (event) => {
  applyAccordionListeners();
};