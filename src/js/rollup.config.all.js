import alerts from './alerts/rollup.config';
import esm from './rollup.config';
import es5 from './rollup.config.es5';
import plasma from './plasma/rollup.config';
import survey from './survey/rollup.config';
import telehealth from './telehealth/rollup.config';

// Combines all the Rollup files into one.
export default [
  alerts,
  esm,
  es5,
  plasma,
  survey,
  telehealth
];
