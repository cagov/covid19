const pt = require('promise-timeout');
const requestMatchRegex = require('./analytics.js');

/**
 * Waits for an attribute to match a regex in an array of objects
 * @constructor
 * @param {object} requestsObject - The array of objects created from the post bodies of intercepted requests
 * @param {string} testKey - The key to look for like ea for event action
 * @param {string} testValue - regex to match the key value against
 * @param {number} timeout - milliseconds to wait before ending repeated queries
 */
module.exports = function waitForThisEvent(requestsObject, testKey, testValue, timeout) {
  return pt.timeout(waitForevents(), timeout)
  .then(val => {
    return val;
  }).catch(err => {
    if (err instanceof pt.TimeoutError) {
      console.error('Timeout :-(');
      return 'failure';
    }
  });

  function waitForevents() {
    return new Promise((resolve, reject) => {
      function resultReview() {
        result = requestMatchRegex(requestsObject, testKey, testValue);
        if(result === 'PASS') {
          resolve(result)
        } else {
          setTimeout(() => resultReview, 100)
        }
      }
      resultReview();
    });
  }
}