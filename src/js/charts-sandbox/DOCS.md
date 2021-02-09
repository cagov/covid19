# Cheat sheet and notes

# Test page
https://staging.covid19.ca.gov/charts-sandbox

## Editing page
https://as-go-covid19-d-001.azurewebsites.net/wp-admin/post.php?post=8906&action=edit

## Data sources & URLs
Percentage by race with at least 1 dose (one person counts, not counts by dose)

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
https://files.covid19.ca.gov/data/vaccine-equity/age/vaccines_by_age_california.json
https://files.covid19.ca.gov/data/vaccine-equity/gender/vaccines_by_gender_california.json
https://files.covid19.ca.gov/data/vaccine-equity/race-ethnicity/vaccines_by_race_california.json

equityChartsSampleDataLoc
: https://files.covid19.ca.gov/data/chart-sandbox/

equityChartsVEDataLoc
: https://files.covid19.ca.gov/data/vaccine-equity/

### Review data & process
Not yet

### Data suppression policy
TBD

### Data Methodology &  Processing Notes
* Q: Where does the data come from?

* Pull data from Snowflake using SQL queries
* Cron job to get the data and put it into JSON format
* Nunjucks/11ty is ready 
* NEED TO add Javscript
* Read data in web component charts `/src/js/charts-sandbox/charts/`
* Merging details into Vaccine page
    
### Branch pattern

Later in the day or early tomorrow make a branch (@CHACH)
`vaccines` - Should contain any dynamic Javascript for Vaccines page, including the vaccines equity charts

Subfolder - structure should match charts-sandbox
Charts folder
shared JS

### Web components

County search widget like the one on the Equity page

Tab 1. `ve-race-ethnicity` - Race and ethnicity
Tab 2. `ve-age` - Vaccine Equity by Age
Tab 3. `ve-gender` - Vaccine Equity by Gender

For later:
`ve-race-ethnicity-age` - Custom chart that has more complex data (2 criteria Race and Age together)
* Responsive to two columns 

### Design file
Figma links
Most recent ones
* https://cadotgov.slack.com/archives/C01HTTNKHBM/p1612824999495300 (has extra data points) 
*   separating line bar is commented out

https://www.figma.com/file/LrzsOu8U5KcMAjJTQ1O3BG/covid19.ca.gov-screens?node-id=5631%3A149


### Content
Category names pulled from Word press from sample charts 

### Translations
Not yet scheduled

Code supports extra data points on each bar

### Which chart is which

Mapping

Pass data to simple chart
Draw indivdual ones
All drawn right away & toggle divs when switching tabs


Race and ethnicity

3 tabs


### Test cases 


## Vaccine Snowflake Warehouse

CA_VACCINE.VW_TAB_INT_ALL
USE CA_VACCINE;
USE warehouse VWH_CA_VACCINE;

* Is there a map of that pipeline that's clear for general transparency
* ISSUE: Tons of misspelled dates, January
* We don't know where the data comes from

### Data Dictionary

#### Table
Warehouse: `VWH_CA_VACCINE`

`CA_VACCINE.VW_TAB_INT_ALL`

Field names
`ADMIN_DATE` - Date vaccine was administered
`VAX_LABEL` - Pfizer or Moderna in camelCase
`DOSE_NUM` - 1 or 2 (int) - Which dose they are receiving
`RECIP_ID` - Number for 
`VAX_EVENT_ID` - Number 
`RECIP_DOB` - Date of Birth YYYY-MM-DD
`RECIP_SEX` - Recipient Sex

| Value | Label |
| 1 | Male |
| 2 | Unknown/undifferentiated |
| 3 | NULL |
| 4 | Female |


`RACE_ETH` - Race Ethnicity  - 10 values
| Value | Label |
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

`RECIP_ADDRESS_COUNTY` - Recipient Address (County)
65 exist

Extras
Clark
Cleveland (nv?)
Hamilton (nv?)
Maricopa (az)
Outside California
Unknown 
San Juan

`RECIP_ADDRESS_STATE`
`RESPONSIBLE_ORG` - 
`ADMIN_NAME`
`ADMIN_ADDRESS_COUNTY` -

`ADMIN_ADDRESS_COUNTY`
Unknown & Null

`RESPONSIBLE_ORG` - Free form text field,  2837 distinct values - some uppercase some note - Clinics, Pharmacies, individual doctors, organizations, unrecgonizable acronyms, drug stores

Worksheet: https://cdtcdph.west-us-2.azure.snowflakecomputing.com/console/login#/?returnUrl=internal%2Fworksheet

`ADMIN_NAME` - Administred by one org but another org probably responsible - similar to `RESPONSIBLE_ORG`
3213 distinct values



### Databases

### Queries


### Data pipeline

```
<!-- charts -->
<cagov-chart-sandbox-filter-buttons class="js-re-smalls">
    <div class="d-flex justify-content-center">
      <button class="small-tab active" data-key="race-ethnicity">Race and ethnicity</button>
      <button class="small-tab" data-key="age">Age</button>
      <button class="small-tab" data-key="gender">Gender</button>
    </div>
</cagov-chart-filter-buttons>
  
<div class="container">
    <div class="row">
        <cagov-chart-ve-race-ethnicity class="chart"></cagov-chart-ve-race-ethnicity>
        <cagov-chart-ve-age class="chart d-hide"></cagov-chart-ve-age>
        <cagov-chart-ve-gender class="chart d-hide"></cagov-chart-ve-gender>
    </div>
    <div class="row">
       <cagov-chart-ve-race-ethnicity-age class="chart"></cagov-chart-ve-race-ethnicity-age>
    </div>
</div>
```