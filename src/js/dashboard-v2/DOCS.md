# State Dashboard 2.0 Data Documentation

## Links & Urls

1. [Production v2-state-dashboard](https://covid19.ca.gov/v2-state-dashboard)
: https://covid19.ca.gov/v2-state-dashboard

2. [Staging, v2-state-dashboard](https://staging.covid19.ca.gov/v2-state-dashboard)
: https://staging.covid19.ca.gov/v2-state-dashboard


---

## Edit markup

[State Dashboard 2.0](https://as-go-covid19-d-001.azurewebsites.net/wp-admin/post.php?post=8386&action=edit)

### Translations
Underway


### Code snippet examples
[Post in github](https://github.com/cagov/covid19/blob/master/pages/wordpress-posts/v2-state-dashboard.html)
Note: This will change names when the site goes public (from v2-state-dashboard to state-dashboard)

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

https://data.covid19.ca.gov/data/daily-stats-v2.json

Which is a copy of

https://github.com/covid-static/tree/master/data/daily-stats-v2.json

This file is produced by the following Cron job (Azure timertask)
https://github.com/cagov/Cron/tree/master/CovidStateDashboardV2



### `meta`
No meta records added yet.

### Review data & process
Not yet

### Data suppression policy
TBD

### Data Methodology & Processing Notes
TBD (if any)

### Data pipeline

High level overview of the data pipeline.

`CAIRS > CDPH > Snowflake Marketplace > SQL queries > Cron repo > Azure FaaS trigger requests > Write to covid-static > published to /data folder > Synced to files.covid19.ca.gov files server after 10 minutes  > JSON file > covid19 > Web component fetch request > /src/js/state-dashboard/chart/*`


### Data Dictionary
(@TODO Is there one?)

#### Snowflake Queries

[Metrics](https://github.com/cagov/Cron/blob/master/common/SQL/CDT_COVID/Metrics.sql)

[Vaccines SQL](https://github.com/cagov/Cron/blob/master/common/SQL/CDTCDPH_VACCINE/Vaccines.sql)

[Hospitalizations](https://github.com/cagov/Cron/blob/master/common/SQL/CDT_COVID/Hospitalizations.sql)

##### Field names

`EXAMPLE_FIELD` 
: example description


### General Notes

### Data source
?

### Update frequency
Page/numbers updated daily at approximately 11am.

### Who to contact if the data breaks?
Jim Bumgardner, Carter Medlin, Daniel Molitor