const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8000/state-dashboard-sparklines/', {
    waitUntil: 'networkidle2',
  });  
  
  const sparklineVax = await page.$eval("cagov-chart-dashboard-sparkline[data-chart-config-key='vaccines'] svg", el => el.outerHTML);
  fs.writeFileSync('./src/img/generated/sparklines/sparkline-vaccines.svg',sparklineVax,'utf8');

  const sparklineCases = await page.$eval("cagov-chart-dashboard-sparkline[data-chart-config-key='cases'] svg", el => el.outerHTML);
  fs.writeFileSync('./src/img/generated/sparklines/sparkline-cases.svg',sparklineCases,'utf8');

  const sparklineDeaths = await page.$eval("cagov-chart-dashboard-sparkline[data-chart-config-key='deaths'] svg", el => el.outerHTML);
  fs.writeFileSync('./src/img/generated/sparklines/sparkline-deaths.svg',sparklineDeaths,'utf8');

  const sparklineTests = await page.$eval("cagov-chart-dashboard-sparkline[data-chart-config-key='tests'] svg", el => el.outerHTML);
  fs.writeFileSync('./src/img/generated/sparklines/sparkline-tests.svg',sparklineTests,'utf8');

  await browser.close();
})();