import alerts from './alerts/rollup.config';
import es5 from './rollup.config.es5';
import esm from './rollup.config';
import plasma from './plasma/rollup.config';
import reopening from './roadmap/rollup.config';
import telehealth from './telehealth/rollup.config';
import video from './video/rollup.config';

import fs from 'fs';
import path from 'path';
const getFileUpdatedDate = (path) => {
  const stats = fs.statSync(path)
  return stats.mtime
}
const getLastUpdatedFile = (directoryPath) => {
  let files = fs.readdirSync(directoryPath);
  let latestFileTime = new Date('01/01/2020');
  files.forEach(function (file) {
    let thisFileUpdate = getFileUpdatedDate(directoryPath + file);
    if(thisFileUpdate > latestFileTime) {
      latestFileTime = thisFileUpdate;
    }
  });
  return latestFileTime;
}

// Combines all the Rollup files into one.
export default [
  ...((process.env.NODE_ENV === 'development' && getLastUpdatedFile(__dirname + '/alerts/') > getFileUpdatedDate(path.join(__dirname, '../../docs/js/alerts.js'))) ? [alerts] : []),
  ...((process.env.NODE_ENV === 'development' && getLastUpdatedFile(__dirname + '/plasma/') > getFileUpdatedDate(path.join(__dirname, '../../docs/js/plasma.js'))) ? [plasma] : []),
  ...((process.env.NODE_ENV === 'development' && getLastUpdatedFile(__dirname + '/roadmap/') > getFileUpdatedDate(path.join(__dirname, '../../docs/js/roadmap.js'))) ? [reopening] : []),
  ...((process.env.NODE_ENV === 'development' && getLastUpdatedFile(__dirname + '/telehealth/') > getFileUpdatedDate(path.join(__dirname, '../../docs/js/telehealth.js'))) ? [telehealth] : []),
  ...((process.env.NODE_ENV === 'development' && getLastUpdatedFile(__dirname + '/video/') > getFileUpdatedDate(path.join(__dirname, '../../docs/js/video.js'))) ? [video] : []),
  esm,
  // Don't include ES5 file in dev mode.
  ...((process.env.NODE_ENV === 'development') ? [] : [es5])
];
