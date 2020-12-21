# Relative Percentage by 100k chart

## Data Definitions

* COUNTY — County of counts/rates.  "California" value for statewide (race/ethnicity demog_cat only currently)
* DEMOGRAPHIC_SET — Demographic category associated with counts/rates.  Race/ethnicity, age group, or gender
* DEMOGRAPHIC_SET_CATEGORY — Value for demographic category, dependent on demog_cat value
* METRIC — Type of count/rate.  Deaths, cases, or tests
* METRIC_VALUE — Total over the previous 30 days
* METRIC_VALUE_PER_100K — Rate per 100,000 persons, based on total and associated demographic population for a given county
* APPLIED_SUPPRESSION — Indicates if the numeric values (counts/rates) are missing due to suppression, and what type.
* POPULATION_PERCENTAGE — Percent of population for a given demographic in specified region
* POPULATION_PERCENTAGE_DELTA Difference from POPULATION_PERCENTAGE
* METRIC_TOTAL_PERCENTAGE — Percent of total cases, deaths, or tests for a specified region
* METRIC_TOTAL_DELTA — Difference from METRIC_TOTAL_PERCENTAGE
* METRIC_VALUE_30_DAYS_AGO  Total over previous 30 day period (31-60 days from present)
* METRIC_VALUE_PER_100K_30_DAYS_AGO   Rate per 100,000 persons, for previous 30 day period
* METRIC_VALUE_PER_100K_DELTA_FROM_30_DAYS_AGO  Raw difference between rate_per_100k and rate_per_100k_30_day_previous
* METRIC_TOTAL_PERCENTAGE_30_DAYS_AGO — Percent of total cases, deaths, or tests for a specified region, over previous 30 day period (31-60 days)
* METRIC_VALUE_PER_100K_DELTA_FROM_30_DAYS_AGO  Raw difference between per_total and perc_total_30_day_prev
* METRIC_VALUE_PERCENTAGE_DELTA_FROM_30_DAYS_AGO — % change between perc_total and perc_total_30_day_prev


#### Still need to document:
##### We use
"WORST_VALUE_DELTA": 0,

##### Not currently using
"WORST_VALUE": 4.433715055087
"SORT_METRIC": 1.5566117738057237,
"METRIC_TOTAL_DELTA": 48.958333333333,
"POPULATION_PERCENTAGE_DELTA": 67.20976448618501,
"LOWEST_VALUE": 1.9892500925,
"PCT_FROM_LOWEST_VALUE": 2.22883742562249

### Data examples
#### None type suppression

```
{
    COUNTY": "San Diego",
    "DEMOGRAPHIC_SET": "race_ethnicity",
    "DEMOGRAPHIC_SET_CATEGORY": "Latino",
    "METRIC": "deaths",
    "METRIC_VALUE": 49, // This is.... ?
    "METRIC_VALUE_PER_100K": 4.433715055087, // This is.... ?
    "APPLIED_SUPPRESSION": "None",
    "POPULATION_PERCENTAGE": 32.790235513815, // This is.... ?
    "METRIC_TOTAL_PERCENTAGE": 51.041666666667,
    "METRIC_VALUE_30_DAYS_AGO": 48,
    "METRIC_VALUE_PER_100K_30_DAYS_AGO": 4.343231074371,
    "METRIC_VALUE_PER_100K_DELTA_FROM_30_DAYS_AGO": 0.090483980716,
    "METRIC_TOTAL_PERCENTAGE_30_DAYS_AGO": 54.545454545455,
    "METRIC_VALUE_PERCENTAGE_DELTA_FROM_30_DAYS_AGO": -3.503787878788,
    "SORT_METRIC": 1.5566117738057237,
    "METRIC_TOTAL_DELTA": 48.958333333333,
    "POPULATION_PERCENTAGE_DELTA": 67.20976448618501,
    "WORST_VALUE": 4.433715055087,
    "WORST_VALUE_DELTA": 0,
    "LOWEST_VALUE": 1.9892500925,
    "PCT_FROM_LOWEST_VALUE": 2.22883742562249
}
```

#### Total type suppression
```
{
    "COUNTY": "Nevada",
    "DEMOGRAPHIC_SET": "race_ethnicity",
    "DEMOGRAPHIC_SET_CATEGORY": "African American",
    "METRIC": "deaths",
    "METRIC_VALUE": null,
    "METRIC_VALUE_PER_100K": null,
    "APPLIED_SUPPRESSION": "Total",
    "POPULATION_PERCENTAGE": 1.718164319724,
    "METRIC_TOTAL_PERCENTAGE": null,
    "METRIC_VALUE_30_DAYS_AGO": null,
    "METRIC_VALUE_PER_100K_30_DAYS_AGO": null,
    "METRIC_VALUE_PER_100K_DELTA_FROM_30_DAYS_AGO": null,
    "METRIC_TOTAL_PERCENTAGE_30_DAYS_AGO": null,
    "METRIC_VALUE_PERCENTAGE_DELTA_FROM_30_DAYS_AGO": null,
    "SORT_METRIC": 0,
    "METRIC_TOTAL_DELTA": 100,
    "POPULATION_PERCENTAGE_DELTA": 98.281835680276,
    "WORST_VALUE": null,
    "WORST_VALUE_DELTA": 0,
    "LOWEST_VALUE": null,
    "PCT_FROM_LOWEST_VALUE": null
}
```

### Disproportionality Ratio Calculation

Sort based on ratio of rates to % of population.

* Ratio is % of known populations divided by % of cases. 
* The list will be ordered from lowest to highest (or vice versa).
* This should disregard R&Es that have missing or null data.

There's a little nuance to using the METRIC_TOTAL_PERCENTAGE.

It's a % percent total among known race/ethnicity for non-unknown ones, 
and then % total for all cases/deaths/tests for the Unknown category. 

We did that to better align with the population references.
% of non-unknown & non-other.

### EXAMPLE
820 cases per 100k NHPI
0.6% of state population
0.3% of cases

% of state population
Latino 49.9%
White 24.1%
Asian American 6.4%
Black 3.9%
Multi-Race 1.4%
NHPI 0.6%
AI/AN 0.4%


100% - (Total cases - Unknown/Other cases) = Known Percentage
100% - (28.8 + 13.4) = 57.8

Disproportionality Ratio = Cases Percentage / Known Percentage

0.6% / 57.8 = 0.01038062283737 NHPI
49.9% / 57.8 = 0.863321799307958  LATINO

Note: For 100k chart, we do not use the Unknown category.
    