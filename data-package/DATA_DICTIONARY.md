# Data Dictionary for *covid19.ca.gov Data Documentation* Airtable

Updated: 2/24/2021, 5:25:43 PM

Version: v1.0.4

## Tables

List of *Tables* in covid19.ca.gov Data Documentation

* Metadata

* Datasets

* Fields

* Contacts

* Field Descriptions

* Counties

* Notifications

### 1. Metadata *Table*

**Table Description**

Metadata information about a data resource.    
This is the top level listing for data sets used in a code project.

It can be aggregated as dataDependency in npm package.json.

For different UI elements, you can link datasets.

For specific fields that require additional documentation, you can link to additional information about them and how they are used.

This can be a dataset pulled from an open data portal, data service, or an internal document that gets published to a "working" API, a dataset that's getting ready to ship to a data portal or service, or just for tracking inputs used in a project. It's intended that this is used from the beginning of a project, and that product leads, designers, developers and data providers all have an organized place to track data from the outset.

A template version of this data documentation kit lives at: https://github.com/cagov/data-documentation-tracking-kit (Internal Github repo until vetted & fully published) 

We are comparing this template to a variety of data package and resource descriptions.

#### Views

*List of *Views* in (Metadata)*

#### Views

* 1. Set up initial record

* 2. Essential Fields

* 3. Connect datasets

* 4. Editing data

* 5. Collaborators

* Hannah Review (Data properties)

* 6. Data package API

* 6. Data package API v2

* SYNC: Google Sheets - Metadata

* Project Management (PM)

* Fields under consideration

* All Fields | Metadata

---

#### *View*: 1. Set up initial record

More details about views in this table, *Metadata*

* https://airtable.com/tblItSYLZdZvruHoQ/viwknHRcBk3UF9lYr

#### *View*: 2. Essential Fields

More details about views in this table, *Metadata*

* https://airtable.com/tblItSYLZdZvruHoQ/viwmBHtoFWXqn2uK2

#### *View*: 3. Connect datasets

More details about views in this table, *Metadata*

* https://airtable.com/tblItSYLZdZvruHoQ/viw5gCeeylTkxGNNm

#### *View*: 4. Editing data

More details about views in this table, *Metadata*

* https://airtable.com/tblItSYLZdZvruHoQ/viwoi7jovqjODCnPZ

#### *View*: 5. Collaborators

More details about views in this table, *Metadata*

* https://airtable.com/tblItSYLZdZvruHoQ/viw0m5fJbY71AxIwL

#### *View*: Hannah Review (Data properties)

More details about views in this table, *Metadata*

* https://airtable.com/tblItSYLZdZvruHoQ/viw3Ob6y9hI3bO8or

#### *View*: 6. Data package API

More details about views in this table, *Metadata*

* https://airtable.com/tblItSYLZdZvruHoQ/viwxLaEdjZBi2z8pR

#### *View*: 6. Data package API v2

More details about views in this table, *Metadata*

* https://airtable.com/tblItSYLZdZvruHoQ/viwNTsmAINsNgaODw

#### *View*: SYNC: Google Sheets - Metadata

More details about views in this table, *Metadata*

*  Backend view, Locked

* https://airtable.com/tblItSYLZdZvruHoQ/viwLnx8sobkqNqnwJ

#### *View*: Project Management (PM)

More details about views in this table, *Metadata*

* https://airtable.com/tblItSYLZdZvruHoQ/viwLatbOmQz39kEhS

#### *View*: Fields under consideration

More details about views in this table, *Metadata*

* https://airtable.com/tblItSYLZdZvruHoQ/viwou6UNabiFDiFF2

#### *View*: All Fields | Metadata

More details about views in this table, *Metadata*

* https://airtable.com/tblItSYLZdZvruHoQ/viwTAQNxdgkfhIQcX

---

### Fields

List of *Fields* in table *Metadata*

Note any edits in document with comments or track changes enabled, and we can make adjustments to this Airtable configuration.

| Field Name | Description | Data Type | Comments |
| -------- | -------- | -------- | -------- |
| Title | Title or name of the dataset. | singleLineText |  |
| Pages where the data is used | Any web pages that use this data. | multipleSelects |  |
| Presentation (User Interface Element) | Component (Web, React, Nunjucks template, etc) used to render the UI element. | multipleSelects |  |
| Name | Computer-friendly name of this data set.  | singleLineText |  |
| Version | Version of the API or dataset. | singleSelect |  |
| Description | Required         - This is a plain English description that will display below the name of the data table.<br>       - Write a summary paragraph telling us what the data table contains. The first few sentences are key.<br>       - Include related legislation info if applicable.<br>       - Include acronyms that people might look for here, but avoid acronyms in your first few sentences.<br><br>Format should be markdown. https://specs.frictionlessdata.io/data-package/#description | multilineText |  |
| Tags | Required           - Descriptive keywords or phrases that users will search for to find your data resources.<br>       - Separate each keyword by commas.<br>       - Try to include at least five descriptive tags.<br>       - Both general and specific terms are useful.<br>       - Programs and acronyms, e.g. California State Library (CSL), can make finding your data resource easier. | multipleSelects |  |
| Groups | Required          - Also known as the publisher<br>       - The agency, group, department, board, or commission that publishes the data resource.<br>       - Choose from the drop down list. | multipleSelects |  |
| Topics | Required       *  - Also known as Category.<br>       - Choose the most appropriate topic from the current list at https://data.ca.gov. | multipleSelects |  |
| Licenses | If-Applicable       *  - Most often Public Domain.<br>    *  - Any restrictions on copying, sharing, using, etc. your data must be disclosed.<br><br>Frictionless data schema notes: https://specs.frictionlessdata.io/data-package/#metadata | multipleSelects |  |
| Author | Optional          - The agency, group, department, board, or commission that authors the data resource and has ultimate responsibility for<br>       the creation of the data.<br>       - Will often but not always be the publisher of the data. | multipleSelects |  |
| Data Dictionary Type | Required          - If the link below is not an HTML file, the file type for the data dictionary (most often a PDF). | singleLineText |  |
| Data Dictionary | Required          - HTML link to the data dictionary itse<br>. | singleLineText |  |
| Program Contact Email | Required          - Enter a generic e-mail address for the program referenced above. (e.g. answers@library.ca.gov ) | email |  |
| Public Access Level | Required       - Whether this info could ever be made public. (Public, Restricted, Non-Public, Not-Yet-Public) | singleSelect |  |
| Rights | Required          - If you entered anything but Public above, you must explain any use restriction on the data.<br>       - Additionally, you can also include usage/research/collaboration instructions: Short text or link to a document that<br>       describes how the data can be used, research Ideas and/or possible collaborations based on this information that may<br>       interest external researchers.<br>       - If not applicable, please enter “No restrictions on public use”. | singleLineText |  |
| Homepage | Homepage URL   <br>If-Applicable<br>       - URL for the page on your website that has useful information about the data resource or the group that updates it. It's a webpage where the user can download this and additional pertinent information. | url |  |
| Data Standard | If-Applicable          - This is used to identify a standardized specification the dataset conforms to. It’s recommended that this be a URI that serves as a unique identifier for the standard. The URI may or may not also be a URL that provides documentation of the<br>       specification.<br>       - A technical description of the data.<br>       - E.g. CSV, XML standards, SHP, or JSON. | singleLineText |  |
| Language | If-Applicable          - Most often English. | multipleSelects |  |
| Data Methodology | Explain the approach of using and uniting the data sets to tell a story. | richText |  |
| Related Content | Optional   - Enter secondary source(s) info: If your data resource is partially made from other data sources, please give descriptive<br>name(s), and/or URLs, of resource(s) from which the data table is derived. | singleLineText |  |
| PM: Internal Notes | Notes about documenting this dataset. | richText |  |
| Documentation Template | Optional               - Additional information is a field that allows you to enter free form metadata in key-value pairs: a key, which is a unique identifier for some item of data, and the value, which is the data that is identified.<br>            - You must include at least two keys-value pairs: one with the “Limitations” key and one with the “Data_Methodology” key.<br>            - Limitations/Exclusions: Must include the following required text: “Use of this data is subject to the CA.gov Conditions of Use and any copyright and proprietary notices incorporated in or accompanying the individual files.”<br>            - This may be followed by a brief description of any limitations on these data or of exclusions to their use not<br>            otherwise covered above in "Rights".<br>            - Data Methodology: Short text or link to a document with explanation of the data collection methodology, which may<br>include survey tools, post-collection methods for control and cleaning and notes on sampling response and errors. This is<br>where you should document any known issues in using the data. May also be uploaded as an additional PDF. | richText |  |
| PM: Internal Status | Tracking status | singleSelect |  |
| Intent | The purpose and intention behind the dataset. | multilineText |  |
| PM: Label | Documentation Project Tracking Label | singleSelect |  |
| Data publishing system | Service providing the data. Used for tracking granular data for building automated data services. | singleSelect |  |
| PM: Priority |  | singleSelect |  |
| References (files) | If there is a document used to track this data already, link to it here. | url |  |
| Editorial: Edit Data Source URL | If applicable    - Where on the internet does this data source live, (if different from the homepage URL)? | url |  |
| PM: TODO LIST | Next Steps |  | multipleSelects |  |
| PM: Additional description of use of data |  | richText |  |
| PM: Assignee |  | singleSelect |  |
| Contributors | https://specs.frictionlessdata.io/data-package/#contributors   <br>Eg.<br>Title<br>Email<br>Path<br>Role<br>Maintainer, Wrangler, Contribute<br>Organization | multilineText |  |
| Created |  | createdTime |  |
| Updated |  | lastModifiedTime |  |
| Update by |  | lastModifiedBy |  |
| Metric | If this dataset has a methodology used to generate it & measures something, add notes here.   <br>Note: some metrics may be field level metrics.<br><br>@TODO confirm with Hannah | richText |  |
| Data Attributes / Options | If applicable to the entire dataset, what attributes or options apply. | richText |  |
| Calculations or User Interface Manipulation | Description of changes to the data through calculations or other user interface changes. | singleLineText |  |
| Datasets |  | multipleRecordLinks |  |
| Data Service (from Datasets) |  | multipleLookupValues |  |
| Data Source (from Datasets) |  | multipleLookupValues |  |
| Data Query (from Datasets) |  | multipleLookupValues |  |
| Data Location Review (from Datasets) |  | multipleLookupValues |  |
| Data Location (from Datasets) |  | multipleLookupValues |  |
| UI code in Github |  | url |  |
| UI tags |  | multipleSelects |  |
| Contact (from Datasets) |  | multipleLookupValues |  |
| Data Methodology (from Datasets) |  | multipleLookupValues |  |
| Spatial | Geographic Coverage (from Datasets) |  | multipleLookupValues |  |
| Change (from Datasets) |  | multipleLookupValues |  |
| Granularity (from Datasets) |  | multipleLookupValues |  |
| Update Frequency (from Datasets) |  | multipleLookupValues |  |
| Publish to data package? |  | checkbox |  |

### 2. Datasets *Table*

**Table Description**

*No table description found.*

#### Views

*List of *Views* in (Datasets)*

#### Views

* Sync to Google Sheets - Datasets

* Data Package API

* Hannah Review

---

#### *View*: Sync to Google Sheets - Datasets

More details about views in this table, *Datasets*

*  Backend view, Locked

* https://airtable.com/tbl5wurMk6BMrVvgx/viwAdQ4jol5JCxa1g

#### *View*: Data Package API

More details about views in this table, *Datasets*

* https://airtable.com/tbl5wurMk6BMrVvgx/viwf2wASZKBoIW00L

#### *View*: Hannah Review

More details about views in this table, *Datasets*

* https://airtable.com/tbl5wurMk6BMrVvgx/viwx8BWghOL1RHWtg

---

### Fields

List of *Fields* in table *Datasets*

Note any edits in document with comments or track changes enabled, and we can make adjustments to this Airtable configuration.

| Field Name | Description | Data Type | Comments |
| -------- | -------- | -------- | -------- |
| Name |  | singleLineText |  |
| Data Query |  | singleLineText |  |
| PM: Label |  | singleSelect |  |
| Table | Table name | singleLineText |  |
| Data Service |  | singleSelect |  |
| Label |  | singleLineText |  |
| Metadata |  | multipleRecordLinks |  |
| Update Frequency | Required           - How often do you intend to publish or update the data resource on Data.ca.gov?<br>       - E.g. Annually, quarterly, monthly. | singleLineText |  |
| Data Location | https://specs.frictionlessdata.io/data-resource/#data-location   <br>Reviewing this option for some our aggregated data sources | singleLineText |  |
| Data Location (Review-Staging) |  | url |  |
| Granularity | Optional          - Tell us the most specific that data the in your resource gets.<br>       - Often measured in geography (state, county, census track) or time (monthly or daily data). | singleLineText |  |
| Temporal Coverage | If-Applicable          - Start date and End date for the data in your data resource. | singleLineText |  |
| Change |  | singleLineText |  |
| UI code in Github (from Metadata) |  | multipleLookupValues |  |
| Presentation (User Interface Element) (from Metadata) |  | multipleLookupValues |  |
| Spatial | Geographic Coverage | If-Applicable - The geographical area the data table covers (e.g. statewide versus a sub-state region like the Bay Area). - Specification should include a named area and may include geographic coordinates. | singleLineText |  |
| Data Methodology | Notes from the data scientist or agency about how the data is collected. | multilineText |  |
| Version |  | singleLineText |  |
| Contact |  | multipleRecordLinks |  |
| Data suppression policy |  | singleLineText |  |
| Source | Data source. (Ideally this is what would be added to metadata to data sources & so it should be written in a way that makes sense to the general public & that we are comfortable with publishing.) | singleLineText |  |
| Foreign Key | A foreign key is a reference where values in a field (or fields) on the   table (‘resource’ in data package terminology) described by this Table Schema<br>connect to values a field (or fields) on this or a separate table (resource).<br>They are directly modelled on the concept of foreign keys in SQL.<br><br>The foreignKeys property, if present, MUST be an Array. Each entry in the<br>array must be a foreignKey. A foreignKey MUST be a object and MUST have the following properties:<br><br>fields - fields is a string or array specifying the<br>field or fields on this resource that form the source part of the foreign<br>key. The structure of the string or array is as per primaryKey above.<br>reference - reference MUST be a object. The object<br>MUST have a property resource which is the name of the resource within<br>the current data package (i.e. the data package within which this Table<br>Schema is located). For se<br>-referencing foreign keys, i.e. references<br>between fields in this Table Schema, the value of resource MUST be ""<br>(i.e. the empty string).<br>MUST have a property fields which is a string if the outer fields is a<br>string, else an array of the same length as the outer fields, describing the<br>field (or fields) references on the destination resource. The structure of<br>the string or array is as per primaryKey above.<br> | singleLineText |  |
| Primary Key |  | singleLineText |  |
| Update process |  | multilineText |  |
| Review process |  | singleLineText |  |
| Fields |  | multipleRecordLinks |  |
| Data pipeline |  | multilineText |  |
| Data Warehouse |  | singleLineText |  |
| Database |  | singleLineText |  |
| Notifications |  | multipleRecordLinks |  |
| Data Location (development) |  | singleLineText |  |
| Data Schema | Experimental: We are talking about pointing to a file with expected data schema, or something else (TBD) | singleLineText |  |
| Tests | Experimental: What kind of test coverage, or location of tests, test reports etc. | multilineText |  |
| Editorial: Edit Data Source URL (from Metadata) |  | multipleLookupValues |  |
| Build script |  | url |  |
| Table URL | If the table is a collaborative spreadsheet (such as a Google Sheet, Airtable or other web-based dataset), share the URL (make sure it's privacy settings are correctly restricted to "read-only" & you only show fields you want to show if publishing this information.    | url |  |
| Publish to data package? |  | checkbox |  |
| PM: Assignee |  | singleSelect |  |

### 3. Fields *Table*

**Table Description**

Additional information about important fields used in project. This can extend available data dictionary information, as well as organize internal notes about who manages a particular value. This can be useful for tracking fields that are pulled into aggregated datasets.

#### Views

*List of *Views* in (Fields)*

#### Views

* 1. Set up initial record

* 2. Essential Fields | Fields

* 3. Developer Documentation | Fields

* 4. Publishing | Fields

* Project Management (PM)

* API | Fields

* All Fields | Fields

* SYNC: Google Sheets - Fields

* Add Field Documentation

---

#### *View*: 1. Set up initial record

More details about views in this table, *Fields*

* https://airtable.com/tblm1zy3tywaDYwro/viwIV0LlK1EJ3MQXe

#### *View*: 2. Essential Fields | Fields

More details about views in this table, *Fields*

* https://airtable.com/tblm1zy3tywaDYwro/viwPSLzhhm7UxqNVj

#### *View*: 3. Developer Documentation | Fields

More details about views in this table, *Fields*

* https://airtable.com/tblm1zy3tywaDYwro/viw0YH24aCrJ9Dgd3

#### *View*: 4. Publishing | Fields

More details about views in this table, *Fields*

* https://airtable.com/tblm1zy3tywaDYwro/viwui8h3aSWnphw5D

#### *View*: Project Management (PM)

More details about views in this table, *Fields*

* https://airtable.com/tblm1zy3tywaDYwro/viwFSA2SDRB86nsoS

#### *View*: API | Fields

More details about views in this table, *Fields*

* https://airtable.com/tblm1zy3tywaDYwro/viwbanFee8yssi8Tf

#### *View*: All Fields | Fields

More details about views in this table, *Fields*

* https://airtable.com/tblm1zy3tywaDYwro/viwpgwAZeM0LF9ehX

#### *View*: SYNC: Google Sheets - Fields

More details about views in this table, *Fields*

*  Backend view, Locked

* https://airtable.com/tblm1zy3tywaDYwro/viwNy6KI7VnphxOv2

#### *View*: Add Field Documentation

More details about views in this table, *Fields*

* https://airtable.com/tblm1zy3tywaDYwro/viwAlb1sBftlKr8Gu

---

### Fields

List of *Fields* in table *Fields*

Note any edits in document with comments or track changes enabled, and we can make adjustments to this Airtable configuration.

| Field Name | Description | Data Type | Comments |
| -------- | -------- | -------- | -------- |
| Field Name | The name of the field from the data table. | singleLineText |  |
| Field Title | Common English title for the data contained in this column. Please avoid abbreviations if possible. | singleLineText |  |
| Data type | Choose one for each named column:   Plain Text<br>Formatted Text (allows bold, italics, etc.)<br>Number (only use “number” if your data is meant to be added, otherwise use “plain text”)<br>Money<br>Percent<br>Dates/Time<br>Location<br> | singleSelect |  |
| Description | Full description of the values included in the column. If the value is a date, document the time zone of recording, e.g. PDT (Pacific Daylight Time). If the column is a category, such as age group, then all categories or levels should be listed. If the values are calculated, the source of raw data and calculation method should be included.    | singleLineText |  |
| Data Source Contact Name |  | multipleSelects |  |
| Owner |  | multipleSelects |  |
| Subject Matter Expert |  | multipleSelects |  |
| PM: Internal Status |  | singleSelect |  |
| PM: Priority |  | singleSelect |  |
| PM: Internal Notes | If we share an Airtable, we can also use comments | richText |  |
| Data Source Contact Email |  | email |  |
| PM: Working Document |  | url |  |
| PM: Assignee |  | singleSelect |  |
| Constraints | The constraints property on Table Schema Fields can be used by consumers to list constraints for validating field values. For example, validating the data in a Tabular Data Resource (opens new window)against its Table Schema; or as a means to validate data being collected or updated via a data entry interface. https://specs.frictionlessdata.io/table-schema/#rich-types | singleSelect |  |
| Missing Values | Many datasets arrive with missing data values, either because a value was not collected or it never existed. Missing values may be indicated simply by the value being empty in other cases a special value may have been used e.g. -, NaN, 0, -9999 etc.   <br>https://specs.frictionlessdata.io/table-schema/#missing-values | singleLineText |  |
| Metric | @TODO Get a better description for field level metric / unit values. This value is generally missing from metadata documentation & may be important to help make datasets more clear & usable. | richText |  |
| Data Usage Notes | Notes about the use of this data. | richText |  |
| Created |  | createdTime |  |
| Updated |  | lastModifiedTime |  |
| Updated by |  | lastModifiedBy |  |
| Update Frequency (Refresh) |  | singleLineText |  |
| Calculations or User Interface Manipulation |  | singleLineText |  |
| Datasets |  | multipleRecordLinks |  |

### 4. Contacts *Table*

**Table Description**

*No table description found.*

#### Views

*List of *Views* in (Contacts)*

#### Views

* SYNC: Google Sheets - Contacts

---

#### *View*: SYNC: Google Sheets - Contacts

More details about views in this table, *Contacts*

*  Backend view, Locked

* https://airtable.com/tblbzRHyICf3KDfih/viwk5z47Dz4rXHpKu

---

### Fields

List of *Fields* in table *Contacts*

Note any edits in document with comments or track changes enabled, and we can make adjustments to this Airtable configuration.

| Field Name | Description | Data Type | Comments |
| -------- | -------- | -------- | -------- |
| Name |  | singleLineText |  |
| Organization |  | multipleSelects |  |
| Email |  | email |  |
| On Slack? |  | checkbox |  |
| Role |  | multipleSelects |  |
| Opt-in list on Github |  | checkbox |  |
| Team contact |  | multipleRecordLinks |  |
| Datasets |  | multipleRecordLinks |  |
| Use Team Contact for External exports |  | checkbox |  |

### 5. Field Descriptions *Table*

**Table Description**

https://docs.google.com/spreadsheets/d/1MyLetlb7WQAJ1-cxUJ6SBTqpXP4pEXETV8MMP00hxgA/edit#gid=1212089917

#### Views

*List of *Views* in (Field Descriptions)*

#### Views

* Grid view

* Field Definitions for Data Documentation Projects

---

#### *View*: Grid view

More details about views in this table, *Field Descriptions*

* https://airtable.com/tblUAah3BWbO9dxrN/viwBB4a5uenfFQT5J

#### *View*: Field Definitions for Data Documentation Projects

More details about views in this table, *Field Descriptions*

* https://airtable.com/tblUAah3BWbO9dxrN/viwmfQA1Cr4Tik4a8

---

### Fields

List of *Fields* in table *Field Descriptions*

Note any edits in document with comments or track changes enabled, and we can make adjustments to this Airtable configuration.

| Field Name | Description | Data Type | Comments |
| -------- | -------- | -------- | -------- |
| Field name |  | singleLineText |  |
| Standardized name |  | singleLineText |  |
| Description |  | singleLineText |  |
| Data type |  | multipleSelects |  |
| Audience |  | multipleSelects |  |
| Required |  | multipleSelects |  |
| Questions & Notes |  | singleLineText |  |
| Documentation level |  | singleSelect |  |
| Reference |  | multipleSelects |  |
| Priority |  | singleSelect |  |
| Needs something |  | singleSelect |  |

### 6. Counties *Table*

**Table Description**

*No table description found.*

#### Views

*List of *Views* in (Counties)*

#### Views

* Grid view

---

#### *View*: Grid view

More details about views in this table, *Counties*

* https://airtable.com/tbl2QIuztOcZGGpL9/viwGSpeLDTD6hiUXB

---

### Fields

List of *Fields* in table *Counties*

Note any edits in document with comments or track changes enabled, and we can make adjustments to this Airtable configuration.

| Field Name | Description | Data Type | Comments |
| -------- | -------- | -------- | -------- |
| id |  | multilineText |  |
| County Label |  | singleLineText |  |
| county |  | singleLineText |  |

### 7. Notifications *Table*

**Table Description**

Which notifications get triggered for which dataset

#### Views

*List of *Views* in (Notifications)*

#### Views

* SYNC to Google Sheet

---

#### *View*: SYNC to Google Sheet

More details about views in this table, *Notifications*

*  Backend view, Locked

* https://airtable.com/tblq6wuUBzGWNRJkr/viwz9ejwq10UOf3dj

---

### Fields

List of *Fields* in table *Notifications*

Note any edits in document with comments or track changes enabled, and we can make adjustments to this Airtable configuration.

| Field Name | Description | Data Type | Comments |
| -------- | -------- | -------- | -------- |
| Name |  | singleLineText |  |
| Datasets |  | multipleRecordLinks |  |
| Name (from Dataset) |  | multipleLookupValues |  |
| Slackbot |  | multipleSelects |  |
| Description |  | singleLineText |  |
| Schedule |  | singleLineText |  |
| Source Code |  | url |  |
| Updated |  | lastModifiedTime |  |
| Has README |  | checkbox |  |
| Internal Notes |  | singleLineText |  |

### Field Statuses

List of field Statuses in (Metadata)

#### Field: Pages where the data is used

| Status |
| -------- |
|  |
| /safer-economy |  |
| / |  |
| /equity |  |
| /vaccines |  |

### Field Statuses

List of field Statuses in (Metadata)

#### Field: Presentation (User Interface Element)

| Status |
| -------- |
|  |
| cagov-reopening |  |
| Data inline in HTML |  |
| D3 chart |  |
| Tableau chart |  |
| State Dashboard |  |
| cagov-chart-re-100k |  |
| cagov-chart-d3-lines |  |
| cagov-chart-equity-data-completeness |  |
| cagov-chart-re-pop |  |
| cagov-chart-re-pop |  |
| cagov-chart-d3-bar |  |
| cagov-equity-highlight-stats |  |
| ? |  |
| Code - string translation |  |
| cagov-chart-vaccination-groups-age |  |

### Field Statuses

List of field Statuses in (Metadata)

#### Field: Tags

| Status |
| -------- |
|  |
| Age |  |
| Blueprint for a Safer Economy Tiers |  |
| Closures |  |
| COVID-19 |  |
| Crowded housing |  |
| Data completeness |  |
| Equity |  |
| Gender |  |
| Health insurance |  |
| Health quartile positivity |  |
| Income |  |
| Industry guidance |  |
| Web UI Labels |  |
| Race and ethnicity |  |
| Regional Stay at Home Order |  |
| Reopening Roadmap  |  |
| Schools |  |
| Sexual orientation and gender identity |  |
| State industry guidance |  |
| Vaccinations |  |
| Vaccines |  |
| What's open search |  |
| State Dashboard |  |

### Field Statuses

List of field Statuses in (Metadata)

#### Field: Groups

| Status |
| -------- |
|  |
| CDPH |  |
| ODI |  |
| CAIRS |  |

### Field Statuses

List of field Statuses in (Metadata)

#### Field: Topics

| Status |
| -------- |
|  |
| COVID-19 |  |

### Field Statuses

List of field Statuses in (Metadata)

#### Field: Licenses

### Field Statuses

List of field Statuses in (Metadata)

#### Field: Author

### Field Statuses

List of field Statuses in (Metadata)

#### Field: Language

| Status |
| -------- |
|  |
| English |  |

### Field Statuses

List of field Statuses in (Metadata)

#### Field: PM: TODO LIST | Next Steps

| Status |
| -------- |
|  |
| Add basic documentation |  |
| Look up editing source |  |
|  |  |
| Look up dataset title |  |
| Confirm where this dataset is used |  |
| Document database fields used in automation |  |
| Look up web component |  |
| Update frequency |  |
| Confirm we built this |  |
| Where is the code? |  |
| JSON data object seems off |  |
| Add / find instructions on how to update the data |  |

### Field Statuses

List of field Statuses in (Metadata)

#### Field: UI tags

| Status |
| -------- |
|  |
| Web component |  |
| d3 chart |  |

---

---

### Field Statuses

List of field Statuses in (Fields)

#### Field: Data Source Contact Name

### Field Statuses

List of field Statuses in (Fields)

#### Field: Owner

### Field Statuses

List of field Statuses in (Fields)

#### Field: Subject Matter Expert

---

### Field Statuses

List of field Statuses in (Contacts)

#### Field: Organization

| Status |
| -------- |
|  |
| ODI |  |

### Field Statuses

List of field Statuses in (Contacts)

#### Field: Role

| Status |
| -------- |
|  |
| Developer |  |
| Product Manager |  |
| Program Officer |  |
| Content Captain |  |
| Data Scientist |  |

---

### Field Statuses

List of field Statuses in (Field Descriptions)

#### Field: Data type

| Status |
| -------- |
|  |
| singleLineText |  |
| singleSelect |  |
| url |  |
| multipleSelects |  |
| multilineText |  |
| richText |  |
| email |  |
| multipleRecordLinks |  |
| createdTime |  |
| lastModifiedTime |  |
| lastModifiedBy |  |

### Field Statuses

List of field Statuses in (Field Descriptions)

#### Field: Audience

| Status |
| -------- |
|  |
| Everyone |  |
| Developers |  |
| Automations |  |
| PMs |  |
| Public |  |
| Editors |  |
| Documentors |  |
| Open data managers |  |
| ca.gov |  |

### Field Statuses

List of field Statuses in (Field Descriptions)

#### Field: Required

| Status |
| -------- |
|  |
| 01 - Required |  |
| 02 - Required but potentially sensitive |  |
| 03 - Possibly Required |  |
| 04 - If-Applicable |  |
| 05 - Optional |  |
| 06 - Not necessary right now |  |
| 07 - Researching best field name |  |

### Field Statuses

List of field Statuses in (Field Descriptions)

#### Field: Reference

| Status |
| -------- |
|  |
| 01 - Hannah's MVP documentation fields |  |
| 02 - Documentation Workflow |  |
| 03 - Documentation Research |  |
| 04 - Open data handbook |  |
| 05 - Frictionlessdata.io (govuk/18f) |  |

---

---

### Field Statuses

List of field Statuses in (Notifications)

#### Field: Slackbot

| Status |
| -------- |
|  |
| testingbot |  |

---