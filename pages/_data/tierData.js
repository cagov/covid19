const jsonFile = require('../wordpress-posts/schools-may-reopen-in-these-counties.json');

module.exports = jsonFile.Table2[0];


//11ty usage
//{%-set _varTierEndDate_ = tierData.TIER_ENDDATE | formatDate2(false, tags) -%}