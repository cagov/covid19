import alerts from './alerts/rollup.config';
import es5 from './rollup.config.es5';
import esm from './rollup.config';
import plasma from './plasma/rollup.config';
import reopening from './roadmap/rollup.config';
import telehealth from './telehealth/rollup.config';
import video from './video/rollup.config';

// Combines all the Rollup files into one.
export default [
  alerts,
  esm,
  plasma,
  reopening,
  telehealth,
  video,
  // Only include these rollups in development mode.
  ...((process.env.NODE_ENV === 'development') ? [] : [es5])
];
