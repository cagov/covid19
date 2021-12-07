//const fs = require('fs')
//const AWS = require('aws-sdk')
//const s3 = new AWS.S3();

const Bucket = 'staging.cannabis.ca.gov';

const redirectJson = require('../../pages/wordpress-posts/page-redirect-table.json');


const s3Input = redirectJson.Table1.map(redirect => ({
    Key: (redirect.original_url.indexOf('/') === 0) ? redirect.original_url.substring(1) : redirect.original_url,
    WebsiteRedirectLocation: redirect.replacement_url,
    StatusCode: redirect.replacement_url ? 301 : 410
}));

console.log(JSON.stringify(s3Input, null, 2));

if (false) {
    s3Input.forEach(redirect => {
        console.log('Uploading ', redirect)
        s3.putObject({
            Body: '',
            Bucket,
            Key: redirect.Key,
            WebsiteRedirectLocation: redirect.WebsiteRedirectLocation,
            StatusCode: redirect.StatusCode
        }, (err, data) => {
            if (err) return console.log(err)
            console.log(data)
        })
    })
}