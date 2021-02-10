// DATE UTILITIES for charts
//
// Use parseSnowflakeDate('YYYY-MM-DD') instead of new Date('YYYY-MM-DD') 
// as the latter assumes GMT, which you probably don't want.
// This function produces a local (Pacific) date.
//
function parseSnowflakeDate(dateStr) {
    const tokens = dateStr.split('-')
    const yyyy = +tokens[0];
    const mm = +tokens[1];
    const dd = +tokens[2];
    return new Date(yyyy,mm-1,dd);
}

// Date converter for use on chart footnotes.
// Converts a string (typically from Snowflake) 
// in the form YYYY-MM-DD
//
// into a readable localized date, such as 
//    December 12, 2020
// or 
//    12 de diciembre de 2020
function reformatReadableDate(dateStr, // expects YYYY-MM-DD
                              fmt={ month: "long", day: 'numeric', year:'numeric' }) {
    const theDate = parseSnowflakeDate(dateStr);
    const readableDate = 
         theDate.toLocaleString( document.documentElement.lang, fmt);
    // console.log(dateStr + " --> " + readableDate);
    return readableDate;
}


export {reformatReadableDate, parseSnowflakeDate};