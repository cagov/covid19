const AWS = require('aws-sdk')

const s3 = new AWS.S3();

const Bucket = 'covid19.ca.gov';
const redirectJson = require('../../pages/wordpress-posts/page-redirect-table.json');

if (!s3.config.credentials) {
    //Use this for local dev with a awe_config.json file
    s3.config.loadFromPath('../../aws_config.json');
    //AWS config file in root should look like this...
    //
    //{
    //    "credentials": {
    //        "accessKeyId": "<YOUR_ACCESS_KEY_ID>",
    //        "secretAccessKey": "<YOUR_SECRET_ACCESS_KEY>"
    //    },
    //    "region": "us-west-1"
    //}
}

//Remove leading slashes, and anything that ends in slash will get a /index.html added

const s3Input = redirectJson.Table1.map(redirect => ({
    Key: redirect.original_url.replace(/^\//, '').replace(/\/$/, '/index.html'),
    WebsiteRedirectLocation: redirect.replacement_url || '/410'
}));

/*
//Use this code if you want to dynamically change the website redirect rules
//https://docs.aws.amazon.com/sdkfornet1/latest/apidocs/html/T_Amazon_S3_Model_PutBucketWebsiteRequest.htm
s3.putBucketWebsite({
    Bucket,
    WebsiteConfiguration: {
        IndexDocument: {
            Suffix: "index.html"
        }
        ,
        ErrorDocument: {
            Key: "404/index.html"
        },
        RoutingRules: [{
            Condition: {
                KeyPrefixEquals: "nothing/"
            },
            Redirect: {
                ReplaceKeyPrefixWith: "something/"
            }
        }]
    }
}, (err, data) => {
    if (err) return console.log(err)
    console.log(data)
});
*/


//console.log(JSON.stringify(s3Input, null, 2));

//Explanation of setting object redirects...
//https://docs.aws.amazon.com/AmazonS3/latest/userguide/how-to-page-redirect.html#advanced-conditional-redirects

//API Method docs...
//https://docs.aws.amazon.com/sdkfornet1/latest/apidocs/html/T_Amazon_S3_Model_PutObjectRequest.htm
s3Input.forEach(redirect => {
    //console.log('Uploading ', redirect)
    s3.putObject({
        Bucket,
        Key: redirect.Key,
        Body: '', //Creates an empty file placeholder
        WebsiteRedirectLocation: redirect.WebsiteRedirectLocation
    }, (err, data) => {
        if (err) return console.log(err)
        console.log(data)
    })
})
