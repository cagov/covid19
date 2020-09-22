# Reopening roadmap activity by county search

This folder temporarily contains the latest exported Risk status for each county

Latest version is ``tiers.csv``` which uses 1 as the worst status and 4 as the best. The site logic has this scale reversed in the code because earlier versions of this dataset used 1 as the best. The flipit script referenced below translates the data to the version the site code expects.

### ToDo

- Automate the retrieval of this dataset from snowflake.
The following snowflake query can return this dataset:
```
select * from PRODUCTION.CDPH_COUNTY_TIER_DATA_STAGE where date = (select max(DATE) from PRODUCTION.CDPH_COUNTY_TIER_DATA_STAGE Where DATE <= Current_DATE() + iff(Timestampdiff('hours',to_Timestamp(LAST_DAY(current_date(),'WEEK')-7), Current_Timestamp()) >=59,0,-10))
```
Once we automate this process we can skip all the manual data update steps below.
If an API is created it should not publish new data before 11am Tuesdays. The snowflake view is supposed to help protect us from that by not being populated with latest data until the evening before it should be released.

- Change the site code so that the new scale using 1 as the best is used everywhere. We will have to change the following:
  - Javascript in index.js and template.js that references tier numbers
  - The columns referenced in the activity matrix data-table post from WordPress also use the old 1 as best reference. So if we want to change those column names we should coordinate with editorial

## Steps to perform each time data is updated

- Recreate the tiers.csv file with the latest dataset either from a received csv file or from a snowflake export. This file has a simple structure with two columns: ```county,status```. 

- Ran this script to get it from csv to json:

```
npx csvtojson tiers.csv > tiers.json
```

- Run this script to translate the 1-4 statuses to the 1 best, 4 worst status levels we built everything on:

```
node flipit.js
```


A temporary script was created to compare new tiers data. If we get new set of tiers csv and want to see if there is any change run:

```
npx csvtojson new-tiers-file.csv > newtiers.json
node compare.js
```

And it will show how many counties changed tiers
