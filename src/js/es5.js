import './config/staging.js';
import '@webcomponents/webcomponentsjs';
import 'whatwg-fetch';
import './polyfills/endswith.js';
// import '@cagov/accordion'; accordion indicator svgs are broken, disable accordions in IE until fixed
import '@cagov/step-list';
import './dashboard/async-polyfill.js';
import './alerts/index.js';
import './feature-detect/webp.js';
import './menu/index.js';
import './equity-dash/index.js';
import './equity-dash/charts/ie11.scss';
import './vaccines/index.js';
import './vaccines/charts/ie11.scss';
import './variants/index.js';
import './dashboard/charts/ie11.scss';
import './dashboard/index.js';
import './dashboard/charts/ie11.scss';

// import applyAccordionListeners from './tracking-you/index.js';
// // twitter widget doesn't support IE11 so not including here
// window.onload = (event) => {
//   applyAccordionListeners();
// };

// This is an IE polyfill for CustomEvent.
// Thank you, MDN. https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
(function () {
  if (typeof window.CustomEvent === 'function') return false;
  function CustomEvent (event, params) {
    params = params || { bubbles: false, cancelable: false, detail: null };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }
  window.CustomEvent = CustomEvent;
})();

/* log10 polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log10 */
Math.log10 = Math.log10 || function(x) {
  return Math.log(x) * Math.LOG10E;
};
