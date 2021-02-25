const fetch = require("node-fetch");
const fs = require("fs");
const { Parser } = require("json2csv");
const Airtable = require("airtable");

// Local Script for Node.JS
// To run: `npm run build:data-package`

/** Requires Airtable API Key to run from local repo
 * Set up .env file like this
 * .env/.env.local or .env/.env.production
 * e.g.
AIRTABLE_API_KEY=airtable_api_key
AIRTABLE_BASE_ID="appwpIGqyvG6bl73j"
AIRTABLE_VIEW_NAME="API"
**/
Airtable.configure({
  apiKey: process.env["AIRTABLE_API_KEY"],
});

const base = Airtable.base(process.env["AIRTABLE_BASE_ID"]); // Check Airtable API documention when logged into Airtable under "Account" and go to "Airtable API" & look up more information about your base.
const VIEW_NAME = process.env["AIRTABLE_VIEW_NAME"]; // Manually set in the base to match this config. The default is

// Path to metadata insert (for when this script runs, any generic template content we want to insert into the API)
const metaPath = "./data-package/meta";

// Location for storing CSV files
const csvPath = "./data-package/csv";

// Write folder for JSON output
const dataPath = "./data-package/json";

const dataPackagePath = "./";

// Settings for exported JSON & CSV data.
let endpoints = {
  "covid19-data-package-metadata": {
    meta: `${metaPath}/covid19-data-package-metadata.api.json`,
    endpoint:
      "https://api.airtable.com/v0/appwpIGqyvG6bl73j/covid19-data-package-metadata",
    fields: {
      Title: "",
      Name: "",
      Version: "",
      Intent: "",
      Description: "",
      Tags: [],
      Groups: [],
      Licenses: [],
      Author: "",
      "Data Dictionary Type": "",
      "Data Dictionary": "",
      "Program Contact": "",
      "Public Access Level": "",
      Topics: [],
      Language: [],
      Rights: "",
      Homepage: "",
      "Data Standard": "",
      "Documentation Template": "",
      "Related Content": "",
      "Data Methodology": "",
      Updated: "",
      // "Reference Files": "",
      "Edit Data Source URL": "",
      "Pages where the data is used": "",
      Contributors: "",
      Metric: "",
      "Data Attributes": "",
      "Calculations or User Interface Manipulation": "",
      Datasets: "",
    },
    viewName: "API",
  },
  "covid19-data-package-datasets": {
    meta: `${metaPath}/covid19-data-package-datasets.api.json`,
    endpoint:
      "https://api.airtable.com/v0/appwpIGqyvG6bl73j/covid19-data-package-datasets",
    fields: {
      Name: "",
      Label: "",
      "Data Service": "",
      "Data pipeline": "",
      "Spatial Coverage": "",
      "Temporal Coverage": "",
      "Data Warehouse": "",
      Database: "",
      Table: "",
      "Data Query": "",
      "Data Location": "",
      "Review Data Location": "",
      Version: "",
      Metadata: "",
    },
    viewName: "API",
  },
};

/**
 * Read data for each Airtable table endpoint & build JSON & CSV data.
 */
const buildData = async () => {
  await Object.keys(endpoints).map((endpoint) => {
    // Endpoint is table, but not called table here so as to not conflict with Airtable's API interface namespace.
    // Set table
    const table = base(endpoint);

    // Get all records.
    const records = table
      .select({
        view: VIEW_NAME,
      })
      .all();

    // Format the response.
    records.then((response) => {
      let fieldsData = formatResponse({
        data: response,
        endpoint: endpoint,
        saveCSV: true,
      });

      // Aggregate response with meta & data to be a simple static "API" file for utility datasets & aggregates of multiple data sources.
      let formattedApiResponse = formatApi({
        meta: endpoints[endpoint].meta, // We have meta templates that need to be kept up to date. Templates can be edited in github in `metaPath` folder.
        data: fieldsData,
      });

      // Write file as JSON
      if (formattedApiResponse !== null) {
        fs.writeFile(
          `${dataPath}/data-${endpoint}.json`,
          formattedApiResponse,
          function (err) {
            if (err) return console.log(err);
            console.log(`saved: ${endpoint}.json`);
          }
        );
      }
    });
  });
  buildJSON();
};

/**
 * Return only the field data from Airtable
 * If record ids are desired for tracing data back, that the data formatter can be updated.
 * This api has meta from a meta template & updated data sources.
 */
const formatResponse = ({ data = null, endpoint = null, saveCSV = true }) => {
  if (data !== undefined && data !== null && endpoint !== null) {
    let formattedData = data.map((item) => {
      // Get the map of fields that we want to return.
      let returnedFields = endpoints[endpoint].fields;

      // Build new fields data object.
      let fields = {};
      Object.keys(returnedFields).map((fieldName) => {
        let convertedFieldName = convertToSnakeCase(fieldName);

        fields[fieldName.toLowerCase().replace(/ /g, "_")] =
          item.fields[fieldName] !== undefined ? item.fields[fieldName] : "";
      });
      return fields;
    });

    // Save this raw data as CSV.
    if (saveCSV === true) {
      saveAsCsv(formattedData, endpoint);
    }
    return formattedData;
  }
  return null;
};

const convertToSnakeCase = (string) => {
  return string.toLowerCase().replace(/ /g, "_");
};

const getDate = () => {
  // Get date updated.
  var date = new Date();
  var now_utc = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
  return new Date(now_utc);
};

/**
 * Format simple API from each Airtable dataset, only retrieving the fields.
 */
const formatApi = ({ data, meta }) => {
  try {
    // Get date updated.
    var date = new Date();
    var now_utc = Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    );
    const utcDate = getDate();

    // Load meta template.
    let metaData = fs.readFileSync(meta, "utf8");
    return JSON.stringify({
      meta: JSON.parse(metaData),
      data: data,
      total: data.length,
      date_updated: utcDate,
    });
  } catch (error) {
    console.error(error);
  }
};
/**
 * Write parsed CSV data (from fields value returned from Airtable) to CSV file.
 * @param {*} fieldData
 * @param {*} endpoint
 */
const saveAsCsv = (fieldData, endpoint) => {
  try {
    let opts = Object.keys(endpoints[endpoint].fields);
    const parser = new Parser(opts);
    const csv = parser.parse(fieldData);
    fs.writeFile(`${csvPath}/data-${endpoint}.csv`, csv, function (err) {
      if (err) return console.log(err);
      console.log(`Saved CSV file: ${endpoint}.csv`);
    });
  } catch (err) {
    console.error("ERROR writing CSV file", err);
  }
};

const buildJSON = () => {
  try {
    let apiDocMetadata = JSON.parse(
      fs.readFileSync(`${metaPath}/covid19-data-package-metadata.api.json`)
    );
    let apiDocDatasets = JSON.parse(
      fs.readFileSync(`${metaPath}/covid19-data-package-datasets.api.json`)
    );
    let metadata = JSON.parse(
      fs.readFileSync(
        `${dataPath}/data-covid19-data-package-metadata.json`,
        "utf8"
      )
    );

    let datasets = JSON.parse(
      fs.readFileSync(
        `${dataPath}/data-covid19-data-package-datasets.json`,
        "utf8"
      )
    );

    let dataSetsData = datasets.data;

    metadata.data.map((meta) => {
      let currentDatasets = meta.datasets.split(",");
      //   console.log("currentDatasets", currentDatasets);

      if (
        currentDatasets !== undefined &&
        currentDatasets !== null &&
        currentDatasets !== "" &&
        currentDatasets.length > 0
      ) {
        let datasetJSON = currentDatasets.map((dataset) => {
          // Look up category data
          let filteredDatasets = dataSetsData.filter((item) => {
            return item.name === dataset.trim();
          });

          return filteredDatasets;
        });
        // Override datasets.
        if (
          datasetJSON !== undefined &&
          datasetJSON !== null &&
          datasetJSON.length > 0
        ) {
          meta.datasets = datasetJSON[0];
        }
      }
    });

    let data = {};
    data.metadata = metadata;

    const utcDate = getDate();

    let apiData = {
      meta: apiDocMetadata,
      data: data,
      total: Object.keys(data).length,
    };

    apiData.meta.date_updated = utcDate;

    fs.writeFile(
      `${dataPackagePath}/data-package.json`,
      JSON.stringify(apiData),
      function (err) {
        if (err) return console.log(err);
        console.log(`Updated: data-package.json`);
      }
    );
  } catch (error) {
    console.error("Error building data package", error);
  }
};

/**
 * Run the script
 */
buildData();
