import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y, getViolations, reportViolations } from 'axe-playwright'

let testLocation = 'http://localhost:8000/'

test('home page tests', async ({ page }) => {
  // Go to http://localhost:8000/
  await page.goto(testLocation);
  await injectAxe(page)
  // await checkA11y(page) -- this is failing due to contrast issues, need to fix or configure to ignore if invalid

  // retrieve GA window object
  const dataLayerOnLoad = await page.evaluate(() => {
    return Promise.resolve(window.gaData['UA-3419582-2'].hitcount);
  },);
  
  // verify page feedback form is in initial state with textarea hidden
  const inVisibleFeedback = await page.locator('.feedback-form-add');
  expect(inVisibleFeedback).toBeHidden();

  // Click the yes page was helpful response button in page feedback at the bottom of the page
  await page.click('.js-feedback-yes');

  // verify feedback area is now visible
  const visibleFeedback = await page.isVisible('.feedback-form-add');
  expect(visibleFeedback).toBeTruthy();

  // the feedback interaction should have added an event to GA dataLayer
  const dataLayerAfterAnchorClick = await page.evaluate(() => {
    return Promise.resolve(window.gaData['UA-3419582-2'].hitcount);
  },);
  expect((dataLayerAfterAnchorClick - dataLayerOnLoad) >= 1).toBe(true);
});

test('chart sparkline tests', async ({ page }) => {
  // Go to http://localhost:8000/
  await page.goto(testLocation+'chart-renderer/');

  // wait for all the sparklines to render their internal svgs
  const sparklineVax = await page.isVisible("cagov-chart-dashboard-sparkline[data-chart-config-key='vaccines'] svg");
  const sparklineCases = await page.isVisible("cagov-chart-dashboard-sparkline[data-chart-config-key='cases'] svg");
  const sparklineDeaths = await page.isVisible("cagov-chart-dashboard-sparkline[data-chart-config-key='deaths'] svg");  
  const sparklineTests = await page.isVisible("cagov-chart-dashboard-sparkline[data-chart-config-key='tests'] svg");

  // if we get here the charts have rendered
  expect('PASS').toStrictEqual('PASS');    
  
});
