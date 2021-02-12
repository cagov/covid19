import alerts from './alerts/rollup.config';
import es5 from './rollup.config.es5';
import esm from './rollup.config';
import plasma from './plasma/rollup.config';
import reopening from './roadmap/rollup.config';
import telehealth from './telehealth/rollup.config';
import video from './video/rollup.config';
import dashboard from './dashboard/rollup.config';
import dashboard2 from './dashboard-v2/rollup.config';
import equitydash from './equity-dash/rollup.config';
import vaccines from './vaccines/rollup.config';
import chartssandbox from './charts-sandbox/rollup.config';

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
function shouldIRebuild(directory,generatedFile) {
  if(process.env.NODE_ENV === 'development') {
    if(!fs.existsSync(path.join(__dirname, generatedFile)) || getLastUpdatedFile(__dirname + directory) > getFileUpdatedDate(path.join(__dirname, generatedFile))) {
      return true;
    } else {
      return false;
    }
  }
  return true;
}

// Combines all the Rollup files into one.
export default [
  ...(shouldIRebuild('/alerts/', '../../docs/js/alerts.js') ? [alerts] : []),
  ...(shouldIRebuild('/plasma/', '../../docs/js/plasma.js') ? [plasma] : []),
  ...(shouldIRebuild('/roadmap/', '../../docs/js/roadmap.js') ? [reopening] : []),
  ...(shouldIRebuild('/telehealth/', '../../docs/js/telehealth.js') ? [telehealth] : []),
  ...(shouldIRebuild('/video/', '../../docs/js/video.js') ? [video] : []),
  ...(shouldIRebuild('/dashboard/', '../../docs/js/dashboard.js') ? [dashboard] : []),
  ...(shouldIRebuild('/dashboard-v2/', '../../docs/js/dashboard-v2.js') ? [dashboard2] : []),
  ...(shouldIRebuild('/equity-dash/', '../../docs/js/equitydash.js') ? [equitydash] : [equitydash]),
  ...(shouldIRebuild('/charts-sandbox/', '../../docs/js/chartssandbox.js') ? [chartssandbox] : [chartssandbox]),
  ...(shouldIRebuild('/vaccines/', '../../docs/js/vaccines.js') ? [chartssandbox] : [chartssandbox]),
  esm,
  // Don't include ES5 file in dev mode.
  ...((process.env.NODE_ENV === 'development') ? [] : [es5])
];
