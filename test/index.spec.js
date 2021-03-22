/**
 * @name get review basic page interactivity
 *
 * @desc Basic smoke tests for covid19.ca.gov site
 */
const puppeteer = require('puppeteer');
const queryString = require('query-string');
const pt = require('promise-timeout');
const requestMatchRegex = require('./tools/analytics.js');
function waitForThisEvent(testKey, testValue, timeout) {
  return pt.timeout(waitForEvents(), timeout)
  .then(val => {
    return val;
  }).catch(err => {
    if (err instanceof pt.TimeoutError) {
      console.error('Timeout :-(');
      return 'failure';
    }
  });

  function waitForEvents() {
    return new Promise((resolve, reject) => {
      function resultReview() {
        result = requestMatchRegex(GARequests, testKey, testValue);
        if(result === 'PASS') {
          resolve(result)
        } else {
          setTimeout(resultReview, 100)
        }
      }
      resultReview();
    });
  }
}

const port = 8000;
const timeout = 60000; // from from 16000, also used for individual tests
jest.setTimeout(timeout);
let server;

/*

More info for writing tests:

Ways to use expect with jest: https://jestjs.io/docs/en/expect

All the stuff you can do with puppeteer: https://github.com/puppeteer/puppeteer/blob/master/docs/api.md
*/

let page;
let browser;
// let hostname = 'https://staging.alpha.technology.ca.gov'
const hostname = `http://localhost:${port}`;
const width = 1200;
const height = 800;
let devserver;
const { spawn } = require('child_process');

let GARequests = [];

beforeAll(async () => {
  devserver = spawn('npm', ['run', 'devserver']);

  browser = await puppeteer.launch({
    headless: true,
    slowMo: 80,
    args: [`--window-size=${width},${height}`]
  });
  page = await browser.newPage();
  page.setDefaultNavigationTimeout(timeout);   // change timeout
  await page.setViewport({ width, height });
  await page.setRequestInterception(true);
  
  page.on('request', req => {
    const requestURL = req.url();
    let parsedData;
    if (requestURL.indexOf("google-analytics.com/collect") > -1) { // want to let the initial /analytics.js request through but get all the subsequent event reqeusts
      if(req._method === 'POST') {
        parsedData = queryString.parse(req._postData);
      } else {
        parsedData = queryString.parse(requestURL.split('?'));
      }
      GARequests.push(parsedData);
      req.abort();
    } else {
      req.continue()
    }
  });
});

describe('homepage', () => {
  test('feedback events are firing', async () => {
    await page.goto(hostname, {
      waitUntil: ['domcontentloaded', 'networkidle0']
    });

    // wait for the feedback buttons to be rendered, scroll down and click them
    const feedbackButtons = await page.waitForSelector('cagov-pagefeedback .js-feedback-yes');
    await page.evaluate(() => {
      document.querySelector('.js-feedback-yes').scrollIntoView(false); // scroll pegged at bottom so header row doesn't obscure it
    });
    await page.evaluate(() => {
      document.querySelector('.js-feedback-yes').click();
    });

    // make sure the GA event action is sent
    let ratingResult = await waitForThisEvent('ea', '^helpful', 5000)
    expect(ratingResult).toStrictEqual('PASS');
  }, timeout);
});

describe('homepage', () => {
  test('menu events are firing', async () => {
    await page.goto(hostname, {
      waitUntil: ['domcontentloaded', 'networkidle0']
    });

    // wait for the feedback buttons to be rendered, scroll down and click them
    const menuButton = await page.waitForSelector('cagov-navoverlay .hamburger');
    await page.evaluate(() => {
      document.querySelector('.hamburger').scrollIntoView();
    });
    await page.evaluate(() => {
      document.querySelector('.open-menu').click();
    });
    await page.evaluate(() => {
      document.querySelector('.js-event-hm-menu').click();
    });

    let homeClickResult = await waitForThisEvent('ea', '^homepage-menu', 5000)
    expect(homeClickResult).toStrictEqual('PASS');    
    
  }, timeout);
});

afterAll(() => {
  console.log('killing')
  // Send SIGTERM to process.
  devserver.stdin.pause();
  devserver.kill();

  console.log('killed')

  browser.close();
  // server.close();

  
});