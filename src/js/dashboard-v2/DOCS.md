# Vaccination by groups, Development Cheat Sheet

## Links & Urls

1. [v2-state-dashboard](https://covid19.ca.gov/v2-state-dashboard)
: https://covid19.ca.gov/v2-state-dashboard

[Staging, v2-state-dashboard](https://staging.covid19.ca.gov/v2-state-dashboard)
: https://staging.covid19.ca.gov/v2-state-dashboard


---

## Development

### Working Branch

(jbum_statedash2)

---

## Content
Will migrate snippet to staging when ready to launch.

## Edit markup

[State Dashboard 2.0](https://as-go-covid19-d-001.azurewebsites.net/wp-admin/post.php?post=8386&action=edit)

### Translations
Underway


### Code snippet examples


```
<!--
{# {%-set data = tableauCovidMetrics[0] -%} #}
{%-set data2 = dailyStatsV2.data -%}

{%-set _varStatDate_ = data2.cases.DATE | formatDate2(false, tags, 1)-%}
{%-set _varStatDateNoYear_ = _varStatDate_ | replace(", 2021", "")-%}
{%-set _varStatTotalCases_ = data2.cases.LATEST_TOTAL_CONFIRMED_CASES | formatNumber(tags)-%}
{%-set _varStatTotalCasesToday_ = data2.cases.NEWLY_REPORTED_CASES | formatNumber(tags)-%}
{%-set _varStatNewCasesPer100k_ = (data2.cases.LATEST_CONFIDENT_AVG_CASE_RATE_PER_100K_7_DAYS) | formatNumber(tags,1)-%}

{%-set _varStatTotalDeaths_ = data2.deaths.LATEST_TOTAL_CONFIRMED_DEATHS | formatNumber(tags)-%}
{%-set _varStatTotalDeathsToday_ = data2.deaths.NEWLY_REPORTED_DEATHS | formatNumber(tags)-%}
{%-set _varStatNewDeathsPer100k_ = (data2.deaths.LATEST_CONFIDENT_AVG_DEATH_RATE_PER_100K_7_DAYS) |
formatNumber(tags,1)-%}

{%-set _varStatTested_ = data2.tests.LATEST_TOTAL_TESTS_PERFORMED | formatNumber(tags)-%}
{%-set _varStatTestedDaily_ = data2.tests.NEWLY_REPORTED_TESTS | formatNumber(tags)-%}
{%-set _varStatLatestPositivityPct_ = (100*data2.tests.LATEST_CONFIDENT_POSITIVITY_RATE_7_DAYS) |
formatNumber(tags,1)-%}

{%-set _varStatVaccines_ = data2.vaccinations.CUMMULATIVE_DAILY_DOSES_ADMINISTERED | formatNumber(tags)-%}

{%-set _varStatPos_7DayAvgPct_ = (100*data2.tests.LATEST_CONFIDENT_POSITIVITY_RATE_7_DAYS) | formatNumber(tags,1) -%}
{%-set _varStatYesterdayDate_ = data2.cases.DATE | formatDate2(false, tags)-%}
{%-set _varStatHospitalTotal_ = (data2.hospitalizations.HOSPITALIZED_COVID_CONFIRMED_PATIENTS +
data2.hospitalizations.HOSPITALIZED_SUSPECTED_COVID_PATIENTS) | formatNumber(tags)-%}
{%-set _varStatIcuTotal_ = (data2.icu.ICU_COVID_CONFIRMED_PATIENTS + data2.icu.ICU_SUSPECTED_COVID_PATIENTS) |
formatNumber(tags)-%}
{%-set _varStatHospitalChange_ = (data2.hospitalizations.HOSPITALIZED_COVID_CONFIRMED_PATIENTS_DAILY +
data2.hospitalizations.HOSPITALIZED_SUSPECTED_COVID_PATIENTS_DAILY) | formatNumber(tags)-%}
{%-set _varStatIcuChange_ = (data2.icu.ICU_COVID_CONFIRMED_PATIENTS_DAILY +
data2.icu.ICU_SUSPECTED_COVID_PATIENTS_DAILY) | formatNumber(tags)-%}
{%-set _varStatHospitalChangeText_ = 'an increase of' if _varStatHospitalChange_ >= 0 else 'a decrease of' -%}
{%-set _varStatIcuChangeText_ = 'an increase of' if _varStatIcuChange_ >= 0 else 'a decrease of' -%}
{%-set _varTierDate_ = tierData.TIER_DATE | formatDate2(false, tags) -%}
{%-set _varTierEndDate_ = tierData.TIER_ENDDATE | formatDate2(false, tags) -%}

{%-set _varCasesTrend_ = data2.cases.LATEST_CONFIDENT_INCREASE_CASE_RATE_PER_100K_7_DAYS %}
{%-set _varDeathsTrend_ = data2.deaths.LATEST_CONFIDENT_INCREASE_DEATH_RATE_PER_100K_7_DAYS %}
{%-set _varPositivityTrend_ = data2.tests.LATEST_CONFIDENT_INCREASE_POSITIVITY_RATE_7_DAYS %}
{%-set _varCasesTrendClassU_ = '' if _varCasesTrend_ >= 0 else "d-none" %}
{%-set _varDeathsTrendClassU_ = '' if _varDeathsTrend_ >= 0 else "d-none" %}
{%-set _varPositivityTrendClassU_ = '' if _varPositivityTrend_ >= 0 else "d-none" %}
{%-set _varCasesTrendClassD_ = '' if _varCasesTrend_ < 0 else "d-none" %} {%-set _varDeathsTrendClassD_='' if
  _varDeathsTrend_ < 0 else "d-none" %} {%-set _varPositivityTrendClassD_='' if _varPositivityTrend_ < 0 else "d-none"
  %} 
-->

```
```
<div class="bg-lightblue full-bleed mt-minus-4">
  <div class="container py-2">
    <div class="row pb-4">
      <div class="col-lg-10 mx-auto">
        <h2 class="text-center color-purple">Update for {{_varStatDate_}}</h2>
        <p>As of {{_varStatDateNoYear_}}, California has {{_varStatTotalCases_}} confirmed cases of COVID-19,
          resulting in {{_varStatTotalDeaths_}} deaths.</p>
      </div>
    </div>

    <div class="row d-flex justify-content-md-center summary-boxes">
      <div class="col-md-3 px-10px">
        <div class="bg-purple bd-rounded-10 px-6px py-2 text-center mt-3 summary-box">
          <div class="h5 text-uppercase color-orange line-height-1-2 mt-1">Cases</div>

          <div id="total-cases-number" class="text-white font-size-1-2em my-2">
            <strong>{{_varStatTotalCases_}}</strong> <span class="text-300">total</span>
          </div>
          <div id="total-cases-today" class="text-white font-size-1-2em mt-2">
            <strong>{{_varStatTotalCasesToday_}}</strong> <span class="text-300">today</span>
          </div>
          <div id="total-cases-increase" class="text-white text-xs line-height-1-5 my-2">

            <span class="chart-arrow" arria-hidden="true">
              <svg class="{{ _varCasesTrendClassU_ }}" version="1.1" id="arrow-up3" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 29 29" style="enable-background:new 0 0 29 29;" xml:space="preserve">
                <path class="chart-arrow-path" d="M28.11,7.27c0-0.62-0.5-1.13-1.13-1.13h-7.64c-0.62,0-1.13,0.5-1.13,1.13s0.5,1.13,1.13,1.13h5.05l-8.16,8.25
                            l-4.89-4.89c-0.44-0.44-1.15-0.44-1.59,0L0.9,20.6c-0.44,0.44-0.44,1.15,0,1.59c0.22,0.22,0.51,0.33,0.8,0.33s0.58-0.11,0.8-0.33
                            l8.05-8.05l4.89,4.89c0.21,0.21,0.5,0.33,0.8,0.33c0,0,0,0,0,0c0.3,0,0.59-0.12,0.8-0.33l8.82-8.91v4.68c0,0.62,0.5,1.13,1.13,1.13
                            s1.13-0.5,1.13-1.13V7.38c0-0.02,0-0.04,0-0.06C28.11,7.3,28.11,7.28,28.11,7.27z"></path>
              </svg>

              <!--negative arrow-->
              <svg class="{{ _varCasesTrendClassD_ }}" version="1.1" id="arrow-down3" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 29 29" style="enable-background:new 0 0 29 29;" xml:space="preserve">
                <path class="chart-arrow-path" d="M28.11,21.4c0,0.62-0.5,1.13-1.13,1.13h-7.64c-0.62,0-1.13-0.5-1.13-1.13s0.5-1.13,1.13-1.13h5.05l-8.16-8.25
                            l-4.89,4.89c-0.44,0.44-1.15,0.44-1.59,0L0.9,8.07c-0.44-0.44-0.44-1.15,0-1.59c0.22-0.22,0.51-0.33,0.8-0.33s0.58,0.11,0.8,0.33
                            l8.05,8.05l4.89-4.89c0.21-0.21,0.5-0.33,0.8-0.33c0,0,0,0,0,0c0.3,0,0.59,0.12,0.8,0.33l8.82,8.91v-4.68c0-0.62,0.5-1.13,1.13-1.13
                            s1.13,0.5,1.13,1.13v7.42c0,0.02,0,0.04,0,0.06C28.11,21.36,28.11,21.38,28.11,21.4z"></path>
              </svg>
            </span>
            {{_varStatNewCasesPer100k_}} <span class="text-300">new cases per 100K</span>

          </div>
        </div>
      </div>
      <div class="col-md-3 px-10px">
        <div class="bg-purple bd-rounded-10 px-6px py-2 text-center mt-3 summary-box">
          <div class="h5 text-uppercase color-orange line-height-1-2 mt-1">Deaths</div>

          <div id="total-deaths-number" class="text-white font-size-1-2em my-2">
            <strong>{{_varStatTotalDeaths_}}</strong> <span class="text-300">total</span>
          </div>
          <div id="total-deaths-today" class="text-white font-size-1-2em mt-2">
            <strong>{{_varStatTotalDeathsToday_}}</strong> <span class="text-300">today</span>
          </div>
          <div id="total-deaths-increase" class="text-white text-xs line-height-1-5 my-2">

            <span class="chart-arrow" arria-hidden="true">
              <svg class="{{ _varDeathsTrendClassU_ }}" version="1.1" id="arrow-up3" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 29 29" style="enable-background:new 0 0 29 29;" xml:space="preserve">
                <path class="chart-arrow-path" d="M28.11,7.27c0-0.62-0.5-1.13-1.13-1.13h-7.64c-0.62,0-1.13,0.5-1.13,1.13s0.5,1.13,1.13,1.13h5.05l-8.16,8.25
                                l-4.89-4.89c-0.44-0.44-1.15-0.44-1.59,0L0.9,20.6c-0.44,0.44-0.44,1.15,0,1.59c0.22,0.22,0.51,0.33,0.8,0.33s0.58-0.11,0.8-0.33
                                l8.05-8.05l4.89,4.89c0.21,0.21,0.5,0.33,0.8,0.33c0,0,0,0,0,0c0.3,0,0.59-0.12,0.8-0.33l8.82-8.91v4.68c0,0.62,0.5,1.13,1.13,1.13
                                s1.13-0.5,1.13-1.13V7.38c0-0.02,0-0.04,0-0.06C28.11,7.3,28.11,7.28,28.11,7.27z"></path>
              </svg>

              <!--negative arrow-->
              <svg class="{{ _varDeathsTrendClassD_ }}" version="1.1" id="arrow-down3" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 29 29" style="enable-background:new 0 0 29 29;" xml:space="preserve">
                <path class="chart-arrow-path" d="M28.11,21.4c0,0.62-0.5,1.13-1.13,1.13h-7.64c-0.62,0-1.13-0.5-1.13-1.13s0.5-1.13,1.13-1.13h5.05l-8.16-8.25
	    						l-4.89,4.89c-0.44,0.44-1.15,0.44-1.59,0L0.9,8.07c-0.44-0.44-0.44-1.15,0-1.59c0.22-0.22,0.51-0.33,0.8-0.33s0.58,0.11,0.8,0.33
		    					l8.05,8.05l4.89-4.89c0.21-0.21,0.5-0.33,0.8-0.33c0,0,0,0,0,0c0.3,0,0.59,0.12,0.8,0.33l8.82,8.91v-4.68c0-0.62,0.5-1.13,1.13-1.13
			    				s1.13,0.5,1.13,1.13v7.42c0,0.02,0,0.04,0,0.06C28.11,21.36,28.11,21.38,28.11,21.4z"></path>
              </svg>
            </span>
            {{_varStatNewDeathsPer100k_}} <span class="text-300">new deaths per 100K</span>

          </div>
        </div>
      </div>
      <div class="col-md-3 px-10px">
        <div class="bg-purple bd-rounded-10 px-6px py-2 text-center mt-3 summary-box">
          <div class="h5 text-uppercase color-orange line-height-1-2 mt-1">Tests</div>

          <div id="total-tested-number" class="text-white font-size-1-2em my-2"><strong>{{_varStatTested_}}</strong>
            <span class="text-300">total</span>
          </div>
          <div id="total-tested-today" class="text-white font-size-1-2em mt-2">
            <strong>{{_varStatTestedDaily_}}</strong> <span class="text-300">today</span>
          </div>
          <div id="total-tested-increase" class="text-white text-xs line-height-1-5 my-2">

            <span class="chart-arrow" arria-hidden="true">
              <svg class="{{ _varPositivityTrendClassU_ }}" version="1.1" id="arrow-up3" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 29 29" style="enable-background:new 0 0 29 29;" xml:space="preserve">
                <path class="chart-arrow-path" d="M28.11,7.27c0-0.62-0.5-1.13-1.13-1.13h-7.64c-0.62,0-1.13,0.5-1.13,1.13s0.5,1.13,1.13,1.13h5.05l-8.16,8.25
                                l-4.89-4.89c-0.44-0.44-1.15-0.44-1.59,0L0.9,20.6c-0.44,0.44-0.44,1.15,0,1.59c0.22,0.22,0.51,0.33,0.8,0.33s0.58-0.11,0.8-0.33
                                l8.05-8.05l4.89,4.89c0.21,0.21,0.5,0.33,0.8,0.33c0,0,0,0,0,0c0.3,0,0.59-0.12,0.8-0.33l8.82-8.91v4.68c0,0.62,0.5,1.13,1.13,1.13
                                s1.13-0.5,1.13-1.13V7.38c0-0.02,0-0.04,0-0.06C28.11,7.3,28.11,7.28,28.11,7.27z"></path>
              </svg>

              <!--negative arrow-->
              <svg class="{{ _varPositivityTrendClassD_ }}" version="1.1" id="arrow-down3" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 29 29" style="enable-background:new 0 0 29 29;" xml:space="preserve">
                <path class="chart-arrow-path" d="M28.11,21.4c0,0.62-0.5,1.13-1.13,1.13h-7.64c-0.62,0-1.13-0.5-1.13-1.13s0.5-1.13,1.13-1.13h5.05l-8.16-8.25
							l-4.89,4.89c-0.44,0.44-1.15,0.44-1.59,0L0.9,8.07c-0.44-0.44-0.44-1.15,0-1.59c0.22-0.22,0.51-0.33,0.8-0.33s0.58,0.11,0.8,0.33
							l8.05,8.05l4.89-4.89c0.21-0.21,0.5-0.33,0.8-0.33c0,0,0,0,0,0c0.3,0,0.59,0.12,0.8,0.33l8.82,8.91v-4.68c0-0.62,0.5-1.13,1.13-1.13
							s1.13,0.5,1.13,1.13v7.42c0,0.02,0,0.04,0,0.06C28.11,21.36,28.11,21.38,28.11,21.4z"></path>
              </svg>
            </span>
            {{_varStatLatestPositivityPct_}}% <span class="text-300">test positivity</span>

          </div>
        </div>
      </div>
      <div class="col-md-3 px-10px">
        <div class="bg-purple bd-rounded-10 px-6px py-2 text-center mt-3 summary-box">
          <div class="h5 text-uppercase color-orange line-height-1-2 mt-1">Vaccines Administered</div>

          <div id="total-tested-number" class="text-white font-size-1-2em my-4"><strong>{{_varStatVaccines_}}</strong>
            <span class="text-300">total</span>
          </div>
          {# <div id="total-tested-today" class="text-white font-size-1-2em mt-2">
            <strong>{{_varStatVaccinesDaily_}}</strong> <span class="text-300">today</span>
          </div>
          <div id="total-tested-increase" class="text-white text-xs line-height-1-5 my-2">

            <span class="chart-arrow" arria-hidden="true">
              <svg version="1.1" id="arrow-up3" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 29 29" style="enable-background:new 0 0 29 29;" xml:space="preserve">
                <path class="chart-arrow-path" d="M28.11,7.27c0-0.62-0.5-1.13-1.13-1.13h-7.64c-0.62,0-1.13,0.5-1.13,1.13s0.5,1.13,1.13,1.13h5.05l-8.16,8.25
							l-4.89-4.89c-0.44-0.44-1.15-0.44-1.59,0L0.9,20.6c-0.44,0.44-0.44,1.15,0,1.59c0.22,0.22,0.51,0.33,0.8,0.33s0.58-0.11,0.8-0.33
							l8.05-8.05l4.89,4.89c0.21,0.21,0.5,0.33,0.8,0.33c0,0,0,0,0,0c0.3,0,0.59-0.12,0.8-0.33l8.82-8.91v4.68c0,0.62,0.5,1.13,1.13,1.13
							s1.13-0.5,1.13-1.13V7.38c0-0.02,0-0.04,0-0.06C28.11,7.3,28.11,7.28,28.11,7.27z"></path>
              </svg>

              <!--negative arrow-->
              <svg class="d-none" version="1.1" id="arrow-down3" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 29 29" style="enable-background:new 0 0 29 29;" xml:space="preserve">
                <path class="chart-arrow-path" d="M28.11,21.4c0,0.62-0.5,1.13-1.13,1.13h-7.64c-0.62,0-1.13-0.5-1.13-1.13s0.5-1.13,1.13-1.13h5.05l-8.16-8.25
							l-4.89,4.89c-0.44,0.44-1.15,0.44-1.59,0L0.9,8.07c-0.44-0.44-0.44-1.15,0-1.59c0.22-0.22,0.51-0.33,0.8-0.33s0.58,0.11,0.8,0.33
							l8.05,8.05l4.89-4.89c0.21-0.21,0.5-0.33,0.8-0.33c0,0,0,0,0,0c0.3,0,0.59,0.12,0.8,0.33l8.82,8.91v-4.68c0-0.62,0.5-1.13,1.13-1.13
							s1.13,0.5,1.13,1.13v7.42c0,0.02,0,0.04,0,0.06C28.11,21.36,28.11,21.38,28.11,21.4z"></path>
              </svg>
            </span>
            {{_varStatVaccinesDailyPct_}}% <span class="text-300">increase</span>

          </div> #}
        </div>
      </div>
    </div>

    <div class="row pb-4 py-5">
      <div class="col-lg-10 mx-auto">
        <p class="small-text">Updated {{_varStatDate_}}, with data from {{_varStatYesterdayDate_}}.</p>

        <p class="small-text">Note: Case rate and test positivity are based on a 7-day average with a 7-day lag. Rates
          of deaths are based on a 7-day average with a 21-day lag due to delays in reporting. Directional change is
          compared to the prior 7-day period. Data is provided by the California Department of Public Health.</p>
      </div>
    </div>

  </div>
  <!--END container-->
</div>
<!--END LIGHT BLUE BG-->
```

---

## Data


### Web component configuration

`Wordpress page > Web component HTML markup with data labels and attributes > published via Wordpress API to covid19 11ty pages`

---

## Design

### Figma Files

???

---

## Data 

### Cases box, Deaths Box, Testing Box, Vaccines box, and various paragraph text throughout the page

https://files.covid19.ca.gov/data/daily-stats-v2.json

Which is a copy of

https://github.com/covid-static/tree/master/data/daily-stats-v2.json

This file is produced by the following Cron job (Azure timertask)
https://github.com/cagov/Cron/tree/master/CovidStateDashboardV2




### `meta`
TBD

### Review data & process
Not yet

### Data suppression policy
TBD

### Data Methodology & Processing Notes
TBD (if any)

### Data pipeline

High level overview of the data pipeline.

`CAIRS > CDPH > Snowflake Marketplace > SQL queries > Cron repo > Azure FaaS trigger requests > Write to covid-static > published to /data folder > Synced to files.covid19.ca.gov files server after 10 minutes  > JSON file > covid19 > Web component fetch request > /src/js/charts-sandbox/chart/*`


### Data Dictionary
(@TODO Is there one?)

#### Snowflake Queries

### CASES,DEATHS,TESTTING SQL (summary boxes)
```
select top 1
    MAX(DATE),
    SUM(LATEST_TOTAL_CONFIRMED_CASES),
    SUM(NEWLY_REPORTED_CASES),
    SUM(LATEST_PCT_CH_CASES_REPORTED_1_DAY),
    SUM(LATEST_CONFIDENT_AVG_CASE_RATE_PER_100K_7_DAYS),
    SUM(NEWLY_REPORTED_CASES_LAST_7_DAYS),
    SUM(LATEST_TOTAL_CONFIRMED_DEATHS),
    SUM(NEWLY_REPORTED_DEATHS),
    SUM(LATEST_CONFIDENT_AVG_DEATH_RATE_PER_100K_7_DAYS),      
    SUM(LATEST_PCT_CH_DEATHS_REPORTED_1_DAY),
    SUM(LATEST_TOTAL_TESTS_PERFORMED),
    SUM(NEWLY_REPORTED_TESTS),
    SUM(LATEST_PCT_CH_TOTAL_TESTS_REPORTED_1_DAY),
    SUM(LATEST_CONFIDENT_AVG_TOTAL_TESTS_7_DAYS),
    SUM(NEWLY_REPORTED_TESTS_LAST_7_DAYS),
    SUM(LATEST_CONFIDENT_POSITIVITY_RATE_7_DAYS),
    SUM(LATEST_CONFIDENT_INCREASE_CASE_RATE_PER_100K_7_DAYS),
    SUM(LATEST_CONFIDENT_INCREASE_DEATH_RATE_PER_100K_7_DAYS),
    SUM(LATEST_CONFIDENT_INCREASE_POSITIVITY_RATE_7_DAYS)
from
COVID.PRODUCTION.VW_CDPH_COUNTY_AND_STATE_TIMESERIES_METRICS  
where area='California';
```

### Hospitalization SQL
```
WITH HOSPITALIZATIONS as (
    select TO_DATE(SF_LOAD_TIMESTAMP) as SF_LOAD_TIMESTAMP
      , SUM(HOSPITALIZED_COVID_CONFIRMED_PATIENTS) AS HOSPITALIZED_COVID_CONFIRMED_PATIENTS
      , SUM(HOSPITALIZED_SUSPECTED_COVID_PATIENTS) AS HOSPITALIZED_SUSPECTED_COVID_PATIENTS
      , SUM(ICU_COVID_CONFIRMED_PATIENTS) AS ICU_COVID_CONFIRMED_PATIENTS
      , SUM(ICU_SUSPECTED_COVID_PATIENTS) AS ICU_SUSPECTED_COVID_PATIENTS
      , SUM(HOSPITALIZED_COVID_CONFIRMED_PATIENTS) + SUM(HOSPITALIZED_SUSPECTED_COVID_PATIENTS) AS TOTAL_PATIENTS
    FROM COVID.PRODUCTION.VW_CHA_HOSPITALDATA_OLD
    group by TO_DATE(SF_LOAD_TIMESTAMP)
)
, CHANGES as (
    select SF_LOAD_TIMESTAMP
        , HOSPITALIZED_COVID_CONFIRMED_PATIENTS
            , ZEROIFNULL(HOSPITALIZED_COVID_CONFIRMED_PATIENTS - LAG(HOSPITALIZED_COVID_CONFIRMED_PATIENTS,1,0) OVER (ORDER BY SF_LOAD_TIMESTAMP)) AS HOSPITALIZED_COVID_CONFIRMED_PATIENTS_DAILY
            , HOSPITALIZED_COVID_CONFIRMED_PATIENTS - LAG(HOSPITALIZED_COVID_CONFIRMED_PATIENTS,14,0) OVER (ORDER BY SF_LOAD_TIMESTAMP) AS HOSPITALIZED_COVID_CONFIRMED_PATIENTS_LAST14DAYS
        , HOSPITALIZED_SUSPECTED_COVID_PATIENTS
            , ZEROIFNULL(HOSPITALIZED_SUSPECTED_COVID_PATIENTS - LAG(HOSPITALIZED_SUSPECTED_COVID_PATIENTS,1,0) OVER (ORDER BY SF_LOAD_TIMESTAMP)) AS HOSPITALIZED_SUSPECTED_COVID_PATIENTS_DAILY
            , HOSPITALIZED_SUSPECTED_COVID_PATIENTS - LAG(HOSPITALIZED_SUSPECTED_COVID_PATIENTS,14,0) OVER (ORDER BY SF_LOAD_TIMESTAMP) AS HOSPITALIZED_SUSPECTED_COVID_PATIENTS_LAST14DAYS
        , ICU_COVID_CONFIRMED_PATIENTS
            , ZEROIFNULL(ICU_COVID_CONFIRMED_PATIENTS - LAG(ICU_COVID_CONFIRMED_PATIENTS,1,0) OVER (ORDER BY SF_LOAD_TIMESTAMP)) AS ICU_COVID_CONFIRMED_PATIENTS_DAILY
            , ICU_COVID_CONFIRMED_PATIENTS - LAG(ICU_COVID_CONFIRMED_PATIENTS,14,0) OVER (ORDER BY SF_LOAD_TIMESTAMP) AS ICU_COVID_CONFIRMED_PATIENTS_LAST14DAYS
        , ICU_SUSPECTED_COVID_PATIENTS
            , ZEROIFNULL(ICU_SUSPECTED_COVID_PATIENTS - LAG(ICU_SUSPECTED_COVID_PATIENTS,1,0) OVER (ORDER BY SF_LOAD_TIMESTAMP)) AS ICU_SUSPECTED_COVID_PATIENTS_DAILY
            , ICU_SUSPECTED_COVID_PATIENTS - LAG(ICU_SUSPECTED_COVID_PATIENTS,14,0) OVER (ORDER BY SF_LOAD_TIMESTAMP) AS ICU_SUSPECTED_COVID_PATIENTS_LAST14DAYS
        , TOTAL_PATIENTS
    FROM HOSPITALIZATIONS
)
select TOP 1 SF_LOAD_TIMESTAMP
    , HOSPITALIZED_COVID_CONFIRMED_PATIENTS
        , HOSPITALIZED_COVID_CONFIRMED_PATIENTS_DAILY
        , CASE HOSPITALIZED_COVID_CONFIRMED_PATIENTS
            WHEN 0 THEN 0
            WHEN HOSPITALIZED_COVID_CONFIRMED_PATIENTS_DAILY THEN 1
            ELSE HOSPITALIZED_COVID_CONFIRMED_PATIENTS_DAILY / (HOSPITALIZED_COVID_CONFIRMED_PATIENTS-HOSPITALIZED_COVID_CONFIRMED_PATIENTS_DAILY)
        END AS HOSPITALIZED_COVID_CONFIRMED_PATIENTS_DAILYPCTCHG
        , HOSPITALIZED_COVID_CONFIRMED_PATIENTS_LAST14DAYS
    , HOSPITALIZED_SUSPECTED_COVID_PATIENTS
        , HOSPITALIZED_SUSPECTED_COVID_PATIENTS_DAILY
        , CASE HOSPITALIZED_SUSPECTED_COVID_PATIENTS
            WHEN 0 THEN 0
            WHEN HOSPITALIZED_SUSPECTED_COVID_PATIENTS_DAILY THEN 1
            ELSE HOSPITALIZED_SUSPECTED_COVID_PATIENTS_DAILY / (HOSPITALIZED_SUSPECTED_COVID_PATIENTS-HOSPITALIZED_SUSPECTED_COVID_PATIENTS_DAILY)
        END AS HOSPITALIZED_SUSPECTED_COVID_PATIENTS_DAILYPCTCHG
        , HOSPITALIZED_SUSPECTED_COVID_PATIENTS_LAST14DAYS
    , ICU_COVID_CONFIRMED_PATIENTS
        , ICU_COVID_CONFIRMED_PATIENTS_DAILY
        , CASE ICU_COVID_CONFIRMED_PATIENTS
            WHEN 0 THEN 0
            WHEN ICU_COVID_CONFIRMED_PATIENTS_DAILY THEN 1
            ELSE ICU_COVID_CONFIRMED_PATIENTS_DAILY / (ICU_COVID_CONFIRMED_PATIENTS-ICU_COVID_CONFIRMED_PATIENTS_DAILY)
        END AS ICU_COVID_CONFIRMED_PATIENTS_DAILYPCTCHG
        , ICU_COVID_CONFIRMED_PATIENTS_LAST14DAYS
    , ICU_SUSPECTED_COVID_PATIENTS
        , ICU_SUSPECTED_COVID_PATIENTS_DAILY
        , CASE ICU_SUSPECTED_COVID_PATIENTS
            WHEN 0 THEN 0
            WHEN ICU_SUSPECTED_COVID_PATIENTS_DAILY THEN 1
            ELSE ICU_SUSPECTED_COVID_PATIENTS_DAILY / (ICU_SUSPECTED_COVID_PATIENTS-ICU_SUSPECTED_COVID_PATIENTS_DAILY)
        END AS ICU_SUSPECTED_COVID_PATIENTS_DAILYPCTCHG
        , ICU_SUSPECTED_COVID_PATIENTS_LAST14DAYS
    , TOTAL_PATIENTS
FROM CHANGES
ORDER BY SF_LOAD_TIMESTAMP DESC
```


### Vaccines SQL
```
select
    VACCINE_KPI_JSON
  from
    CA_VACCINE.CA_VACCINE.Vw_Website_kpi_Vaccines
```
Warehouse: `VWH_CA_VACCINE`

YOU ARE HERE (docs below this point cut & pasted)

##### Field names

`ADMIN_DATE` 
: Date vaccine was administered

`VAX_LABEL` {string}
: e.g. Pfizer or Moderna in camelCase

`DOSE_NUM` {int}
: 1 or 2  - Which dose they are receiving

`RECIP_ID`
: Number for recipient

`VAX_EVENT_ID`
: Number 

`RECIP_DOB` {string}
: Date of Birth YYYY-MM-DD

`RECIP_SEX` {string}
: Recipient Sex


| Value | Label |
| ----- | ----- |
| 1 | Male |
| 2 | Unknown/undifferentiated |
| 3 | NULL |
| 4 | Female |


`RACE_ETH`: Race Ethnicity  - 10 values

| Value | Label |
| ----- | ----- |
| 1 | Other Race |
| 2 | White |
| 3 | Latino |
| 4 | NULL |
| 5 | Unknown | 
| 6 | Asian |
| 7 | American Indian or Alaska Native |
| 8 | Native Hawaiian or Other Pacific Islander |
| 9 | Multiracial | 
| 10 | Black or African American | 

* Note we may string replace the labels if needed for display purposes that may differ from database systems where information is entered & the label can't easily be updated.

`RECIP_ADDRESS_COUNTY`: Recipient Address (County), 65 exist

`RECIP_ADDRESS_STATE`

`ADMIN_NAME`

`ADMIN_ADDRESS_COUNTY`
Unknown & Null

`RESPONSIBLE_ORG` - Free form text field,  2837 distinct values - some uppercase some note - Clinics, Pharmacies, individual doctors, organizations, unrecgonizable acronyms, drug stores

`ADMIN_NAME` - Administred by one org but another org probably responsible - similar to `RESPONSIBLE_ORG`
3213 distinct values

### General Notes
e.g. Percentage of people, by race, with at least 1 dose (one person counts, NOT counts by dose.)

### Queries
(@TODO Find in Cron Repo)

### Data source
CDPH team from the CAIRS system (where providers provide data).

### Update frequency
Page updated weekly.
(Numbers run daily.)

### Who to contact if the data breaks?
@TODO 
