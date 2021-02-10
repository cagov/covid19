# Vaccinations by groups, Development Cheat Sheet

## Links & Urls

[Staging, Charts Sandbox](https://staging.covid19.ca.gov/charts-sandbox)
: https://staging.covid19.ca.gov/charts-sandbox

[Sandbox, Charts Sandbox](https://kind-dune-0ef66d01e.azurestaticapps.net/charts-sandbox)
: https://kind-dune-0ef66d01e.azurestaticapps.net/charts-sandbox

[Sandbox, Vaccines](https://kind-dune-0ef66d01e.azurestaticapps.net/vaccines)
: https://kind-dune-0ef66d01e.azurestaticapps.net/vaccines

---

## Development

### Branch

Later in the day or early tomorrow make a branch (@CHACH)
`vaccinations_groups` - Should contain any dynamic Javascript for Vaccines page, including the vaccines equity charts


Subfolder - structure should match charts-sandbox
Charts folder
shared JS

### Web components

County search widget like the one on the Equity page

Tab 1. `cagov-chart-vaccination-groups-race-ethnicity` - Race and ethnicity
Tab 2. `cagov-chart-vaccination-groups-age` - Vaccine Equity by Age
Tab 3. `cagov-chart-vaccination-groups-gender` - Vaccine Equity by Gender

#### Commented out
`cagov-chart-vaccination-groups-race-ethnicity-age` - Custom chart that has more complex data (2 criteria Race and Age together)
* Responsive to two columns 

---

## Content
Will migrate snippet to staging when ready to launch.

## Edit markup

[Charts Sandbox](https://as-go-covid19-d-001.azurewebsites.net/wp-admin/post.php?post=8906&action=edit)

### Content
Category names pulled from Word press from sample charts 

### Translations
Not yet scheduled

Code supports extra data points on each bar

### Vaccine page
Editing .html until ready to move code snippet to Wordpress & staging.
`/pages/wordpress_posts/vaccine.html`

In progress here as a reference / reminder.

```
<cagov-county-search></cagov-county-search>

<cagov-county-toggle-buttons></cagov-county-toggle-buttons>

<cagov-chart-sandbox-filter-buttons class="js-re-smalls">
    <div class="d-flex justify-content-center">
      <button class="small-tab active" data-key="race-ethnicity">Race and ethnicity</button>
      <button class="small-tab" data-key="age">Age</button>
      <button class="small-tab" data-key="gender">Gender</button>
    </div>
</cagov-chart-filter-buttons>
  
<div class="container">
    <div class="row">
        <cagov-chart-vaccination-groups-race-ethnicity class="chart"></cagov-chart-vaccination-groups-race-ethnicity>
        <cagov-chart-vaccination-groups-age class="chart d-hide"></cagov-chart-vaccination-groups-age>
        <cagov-chart-vaccination-groups-gender class="chart d-hide"></cagov-chart-vaccination-groups-gender>
    </div>
    <!-- <div class="row">
       <cagov-chart-vaccination-groups-race-ethnicity-age class="chart"></cagov-chart-vaccination-groups-race-ethnicity-age>
    </div> -->
</div>

<div class="row pb-4">
  <div class="col-lg-10 mx-auto">
      <p class="chart-data-label">Note: Data shown is a cumulative total, updated daily.</p>
  </div>
</div>

<a href="/equity">See more about how COVID affects groups throughout California</a>
```

---

## Data

### Vaccines by Race, Ethnicity and Age in California
(SAMPLE DATA for initial development before we have the real data)
https://github.com/cagov/covid-static/blob/master/data/chart-sandbox/vaccines_by_race_ethnicity_and_age_california.json

JSON Data Source Git code
https://github.com/cagov/covid-static/tree/master/data/vaccine-equity

#### Age dataset
https://github.com/cagov/covid-static/blob/master/data/vaccine-equity/age/vaccines_by_age_california.json

#### Gender dataset
https://github.com/cagov/covid-static/blob/master/data/vaccine-equity/gender/vaccines_by_gender_california.json

#### Race dataset
https://github.com/cagov/covid-static/blob/master/data/vaccine-equity/race-ethnicity/vaccines_by_race_ethnicity_california.json

### File URLS dataset

#### For California
https://files.covid19.ca.gov/data/vaccine-equity/age/vaccines_by_age_california.json
https://files.covid19.ca.gov/data/vaccine-equity/gender/vaccines_by_gender_california.json
https://files.covid19.ca.gov/data/vaccine-equity/race-ethnicity/vaccines_by_race_california.json

#### Static file server location

`equityChartsSampleDataLoc`
: https://files.covid19.ca.gov/data/chart-sandbox/

`equityChartsVEDataLoc`
: https://files.covid19.ca.gov/data/vaccine-equity/

### `meta` (or `docs`)
The meta property in the data set can be updated with a structured version of the info from this file.
We do this to help version these light static file APIs.

### Review data & process
Not yet

### Data suppression policy
TBD

### Data Methodology &  Processing Notes

### Data pipeline

High level overview:

`CAIRS > CDPH > Snowflake Marketplace > SQL queries > Cron repo > Azure FaaS trigger requests > Write to covid-static > published to /data folder > Synced to files.covid19.ca.gov files server after 10 minutes  > JSON file > covid19 > Web component fetch request > /src/js/charts-sandbox/chart/*`


### Web component configuration

Quick reminder / Overview: 
`Wordpress page > Web component HTML markup with data labels and attributes > published via Wordpress API to covid19 11ty pages > registered web component > javascript > fetches data and data labels > loads into d3 draw function > d3 renders responsive SVG graphics`

---

## Design

### Figma Files

https://www.figma.com/file/LrzsOu8U5KcMAjJTQ1O3BG/covid19.ca.gov-screens?node-id=5631%3A149

Most recent ones
* https://cadotgov.slack.com/archives/C01HTTNKHBM/p1612824999495300 (has extra data points) 
*   separating line bar is commented out

### Which chart is which web component?

Mapping

Race and ethnicity

3 tabs

### Notes on how the chart works
Pass data to simple chart
Draw indivdual ones
All drawn right away & toggle divs when switching tabs

## Vaccine Snowflake Warehouse

CA_VACCINE.VW_TAB_INT_ALL
USE CA_VACCINE;
USE warehouse VWH_CA_VACCINE;

* Is there a map of that pipeline that's clear for general transparency
* ISSUE: Tons of misspelled dates, January
* We don't know where the data comes from

### Data Dictionary
(Is there one?)

#### Snowflake Queries

Worksheet: https://cdtcdph.west-us-2.azure.snowflakecomputing.com/console/login#/?returnUrl=internal%2Fworksheet

Warehouse: `VWH_CA_VACCINE`

### Databases
`CA_VACCINE.VW_TAB_INT_ALL`

##### Field names

`ADMIN_DATE` - Date vaccine was administered
`VAX_LABEL` - Pfizer or Moderna in camelCase
`DOSE_NUM` - 1 or 2 (int) - Which dose they are receiving
`RECIP_ID` - Number for 
`VAX_EVENT_ID` - Number 
`RECIP_DOB` - Date of Birth YYYY-MM-DD
`RECIP_SEX` - Recipient Sex


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
@TODO How often is this updated?

### Who to contact if the data breaks?
@TODO 
