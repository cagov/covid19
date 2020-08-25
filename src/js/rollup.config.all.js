import alerts from './alerts/rollup.config';
import es5 from './rollup.config.es5';
import esm from './rollup.config';
import plasma from './plasma/rollup.config';
import survey from './survey/rollup.config';
import telehealth from './telehealth/rollup.config';
import whatopen from './what-open-where/rollup.config';

// Combines all the Rollup files into one.
export default [
  alerts,
  es5,
  esm,
  plasma,
  survey,
  telehealth,
  whatopen
];
