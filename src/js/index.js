import '@cagov/step-list';
import '@cagov/ds-accordion';
import './pagerating/index.js';
import './feature-detect/webp.js';
import './arrow/index.js';
import './arrow/arrow-icon.js';
import './arrow/plus-icon.js';
import './arrow/minus-icon.js';
import './links/index.js';
import './menu/index.js';
import './search/index.js';
import './dark-accordion/extras.js';
import '@cagov/anchor-events';
import '@cagov/go-to-top';
import setupAnalytics from './tracking-you/index.js';

window.onload = (event) => {
  setupAnalytics();
};
