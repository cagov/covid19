/**
 * This script formats version 1 of the reopening roadmap activity data into Wordpress code
 * We can paste a snippet of code generated from Airtable to Wordpress as a way to skip needing a new pipeline.
 * Versioned copy of this code lives in covid19 repo, src/js/roadmap-airtable-v1/airtable-to-wordpress-table-data-v1.js (staging branch).
 */
const CONFIG = {
  table: "reopening-roadmap-activity-data-v1", // Airtable table name
};

let table = base.getTable(CONFIG.table);

/**
 * Airtable field definitions can include new line spaces, which Markdown editors can have a diffcult time parse.
 * Let's escape those values.
 * @param {*} value
 */
const escapeNewLines = (value) => {
  if (value !== undefined && value !== null) {
    return value.replace("\n", "   ");
  }
};

// Build an HTML table from Airtable records.
const htmlTable = (fieldNames, fields) => {
  // @TODO test valid fieldNames
  if (fields !== undefined && fields !== null && fields.length > 0) {
    // Outputs this basic HTML table structure:
    let tableData = [];

    Object.keys(fields).map((field) => {
      tableData.push(fields[field]);
    });

    // Get table header
    let header = tableData[0];
    // Get the data for the table rows.
    let tableRows = tableData.slice(1, tableData.length);
    let thValues = Object.keys(header).map((key) => {
      return `<th>${fieldNames[key]}</th>`;
    });

    let rows = tableRows.map((row) => {
      let tdValues = Object.keys(row).map((rowValue) => {
        return `<td>${row[rowValue]}</td>`;
      });
      return `<tr>${tdValues.join("")}</tr>`;
    });

    // Generate structure that Wordpress wants to align with table-data feature.
    let tableMarkup = `
        <figure class="wp-block-table">
        <table>
           <thead>
              ${thValues.join("")}
           </thead>
           <tbody>
              ${rows.join("")}
            </tbody>
        </table>
        </figure>
        `;
    return output.text(tableMarkup);
  }
};

let fieldNames = [];
table.fields.map((field) => {
  fieldNames.push(field.name);
});

let query = await table.selectRecordsAsync({
  sorts: [
    { field: "activity_search_autocomplete" },
  ],
});
let records = query.records;

let fieldData = [];
// print ID & "activity_reference_key" from each record:
for (let record of records) {
  let row = [];
  for (let column of fieldNames) {
    let value = record.getCellValue(column);
    if (value !== null) {
      row.push(value);
    } else {
      row.push(" ");
    }
  }
  fieldData.push(row);
}

let htmlTableOutput = htmlTable(fieldNames, fieldData);
