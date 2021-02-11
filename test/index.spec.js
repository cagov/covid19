/**
 * @name get review basic page interactivity
 *
 * @desc Basic smoke tests for alpha site
 */
const puppeteer = require('puppeteer');
const queryString = require('query-string');
const pt = require('promise-timeout');
const requestMatchRegex = require('./tools/analytics.js');
function waitForThisEvent(testKey, testValue, timeout) {
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

const express = require('express');
const app = express();
const port = 1338;
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
let GARequests = [];

beforeAll(async () => {
  app.use('/', express.static('docs', {}));
  server = app.listen(port, () => console.log(`Example app listening on...\n${hostname}`));

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
    const feedbackButtons = await page.$$eval('cagov-pagefeedback .js-feedback-yes', feedbuttons => feedbuttons);
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
    const menuButton = await page.$$eval('cagov-navoverlay .hamburger', menubutton => menubutton);
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

describe('what is open', () => {
  test('select county and industry works', async () => {
    await page.goto(hostname + '/safer-economy/');
    await page.waitForSelector('#location-query');
    await page.type('#location-query', 'san');

    await page.waitForSelector('#awesomplete_list_1 li');
    const listitems = await page.$$eval('#awesomplete_list_1 li', listitems => listitems);
    expect(listitems.length).toBeGreaterThan(1);
  }, timeout);
});

afterAll(() => {
  browser.close();
  server.close();
});