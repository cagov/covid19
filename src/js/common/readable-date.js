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

// Return local date string in form YYYY-MM-DD adjusted for dayDelta (0 for today -1 for yesterday)
//
function getSnowflakeStyleDate(dayDelta) {
    let date = new Date();
    date.setDate(date.getDate() + dayDelta);
    // return date.toLocaleString( 'us', { year: "numeric", month: '2-digit', year:'2-digit' });
    let month = '' + (date.getMonth() + 1),
    day = '' + date.getDate(),
    year = date.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function reformatJSDate(theDate, // expects javascript date
    fmt={ month: "long", day: 'numeric', year:'numeric' }) 
{
    const readableDate = 
    theDate.toLocaleString( document.documentElement.lang, fmt);
    // console.log(dateStr + " --> " + readableDate);
    return readableDate;
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
                              fmt={ month: "long", day: 'numeric', year:'numeric' }, dayDelta=0) {

    const theDate = parseSnowflakeDate(dateStr);
    if (dayDelta != 0) {
        theDate.setDate(theDate.getDate() + dayDelta);
    }
    return reformatJSDate(theDate, fmt);
}


export {reformatReadableDate, getSnowflakeStyleDate, parseSnowflakeDate, reformatJSDate};