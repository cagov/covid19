const request = require('request');
const csv=require('csvtojson')

module.exports = () => {
  return new Promise((resolve, reject) => {
    let outputObj = {};
    outputObj.telehealthList = [];
    request({ 
        uri: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQWhNGTFQp52frHM68ZXJfnthkw4Q7m9oL219eA00fq8yS9wtxSbK2-eYeVKxJTu09wtp7T9iqOj5E0/pub?gid=173807658&single=true&output=csv&extra=' + new Date().getTime().toString()
      }, function (error, response, body) {
        csv({})
        .fromString(body)
        .then((csvRow)=>{ 
          csvRow.forEach((row, i) => {
            outputObj.telehealthList.push(row)
          })
          resolve(outputObj);
        })
      })
    }
  )
}

/*
  Plan Type,
  County,
  Health Plan Name,
  Health Plan Offered Telehealth,
  Telehealth Website Website ,
  Telehealth Services Phone Number,
  Health Plan Nurse Advice Line,
  Special Note,
  Internal Note
*/