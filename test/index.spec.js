/**
 * @name get review basic page interactivity
 *
 * @desc Basic smoke tests for alpha site
 */
const puppeteer = require('puppeteer');

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

beforeAll(async () => {
  app.use('/', express.static('docs', {}));
  server = app.listen(port, () => console.log(`Example app listening on...\n${hostname}`));

  browser = await puppeteer.launch({
    headless: true,
    slowMo: 80,
    args: [`--window-size=${width},${height}`]
  });
  page = await browser.newPage();
  await page.setViewport({ width, height });
});

describe('homepage', () => {
  test('page has some links on it', async () => {
    await page.goto(hostname);
    await page.waitForSelector('.hero-headline');

    const links = await page.$$eval('a', anchors => anchors);
    expect(links.length).toBeGreaterThan(4);
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
    await page.click('#awesomplete_list_1 li');

    await page.type('#activity-query', 'Schools');
    await page.waitForSelector('#awesomplete_list_2 li');
    await page.click('#awesomplete_list_2 li');
    await page.click("#reopening-submit");
    await page.waitForSelector('.card-county');

    const counties = await page.$$eval('.card-county', counties => counties);
    expect(counties.length).toBeGreaterThan(0);
  }, timeout);
});

afterAll(() => {
  browser.close();
  server.close();
});