/**
 * Matches an attribute value in an array of objects
 * @constructor
 * @param {object} requestsObject - The array of objects created from the post bodies of intercepted requests
 * @param {string} testKey - The key to look for like ea for event action
 * @param {string} testValue - regex to match the key value against
 */
module.exports = function requestMatchRegex(requestsObject, testKey, testValue) {
  try {
    const matchRegex = requestsObject.map(item => {
      
      // If the parameter exists, test for a matching value
      if (item[testKey]) {
        const regex = new RegExp(testValue);

        if (item[testKey].match(regex) != null) {
          return true
        }
      } else {
        return false
      }
    });

    return matchRegex.indexOf(true) > -1 ? "PASS" : "FAIL"

  } catch (e) {
    console.error(e);
  }
}