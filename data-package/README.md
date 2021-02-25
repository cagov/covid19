
# Data Package Building Tool

Our covid19.ca.gov website uses many data sources, this script builds a data-package from an Airtable base. 

Utility function is meant to be manually run & checked in after a review of content.

## Endpoints
We have two Airtable endpoints currently supported by this import script

* Metadata
* Datasets

Other sources not yet included: Fields, Notifications.

### Editable data
"covid19.ca.gov Data Documentation" Airtable base

* Contains an array of fields commonly needed for documenting content publishing systems that use a variety of datasets (charts, UI components).
* Has views that can be filtered by team role
* API is read, converted to CSV files (for redundant backups), and also formatted as `data-package.json` to put at the root directory of your code repository.

### About Data packages
[Data packages](https://datahub.io/docs/data-packages)
[Full frictionless data specification](https://specs.frictionlessdata.io//data-package/)
[Data protocols format](http://dataprotocols.org/data-packages/)
[Tabular data packages](http://dataatwork.org/guides/tabular-data-package/)
[Sample data package](https://specs.frictionlessdata.io/schemas/data-package.json)
[W3C spec]()
[GOV UK spec]()
[US Federal Government spec]()

#### Validating fields
This tool focuses on gathering information about datasets to be used in documentation.

* Adding & type checking imported fields is another layer to improve and increase quality of UI component development.
* The JavaScript development world is moving towards more type checks (usually with Typescript) on components, and one huge step in moving to that is getting your data organized and having tooling set up so that developers can easily help fill in missing data documentation, which can help everyone keep up to date with evolving schemas and APIs that do happen in real-life, and usually quite quickly as teams ingest data sets from new partners but tend to focus on publishing that information quickly. 

[Frictionless data validator](https://framework.frictionlessdata.io/docs/guides/quick-start/)
[CKAN data validation](https://github.com/frictionlessdata/ckanext-validation)

#### Examples of data packages
* [World bank GDP dataset](https://github.com/datasets/gdp/blob/master/datapackage.json)
* [18f Data Act Pilot (2015)](https://github.com/18F/data-act-pilot/blob/master/schema/json/README.md)
* [S & P 500 companies](https://github.com/datasets/s-and-p-500-companies/blob/master/datapackage.json)

* [Emojis]()

### Blank template
For collecting data about new data sources.
(@TODO - Add)

### Data Dictionary
(@TODO update notes & export markdown)
