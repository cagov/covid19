const fs = require('fs');
var proxyquire = require('proxyquire');
var test = require('tape');
const sinon = require("sinon");

test('equity dashboard top boxes data is processed as expected', async function (t) {
  // given this canned dataset
  let cacheBody = JSON.parse(fs.readFileSync('./test/mocks/equitytopboxdatav2.json','utf8')) 
  const fetchStub = sinon.stub();
  const validResponse = { json: () => { return cacheBody } };
  fetchStub.resolves(validResponse);

  const info = proxyquire('../pages/_data/equityTopBoxes.js', {
    "node-fetch": fetchStub
  });

  // act
  let result = await info();

  // the following results are expected
  t.equal(result[0].cases_per_100K_statewide,3470)
  t.equal(result[0].death_rate_per_100K_statewide,49.6)
  t.equal(result[0].cases_per_100K_latino,3778.7)
  t.equal(result[0].cases_per_100K_pacific_islanders,4102.5)
  t.equal(result[0].case_rate_vs_statewide_percent_latino,9)
  t.equal(result[0].case_rate_vs_statewide_percent_pacific_islanders,18)
  t.equal(result[0].case_rate_vs_statewide_percent_low_income,16)
  t.equal(result[0].case_rate_per_100K_low_income,4014)
  t.equal(result[0].death_rate_vs_statewide_percent_black,22)
  t.equal(result[0].death_rate_per_100K_black,60.5)

  t.end();
});