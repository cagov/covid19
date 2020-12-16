// Date converter for use on chart footnotes.
// Converts a string (typically from Snowflake) 
// in the form YYYY-MM-DD
// into a readable localized date, such as 
//    December 12, 2020
// or 
//    12 de diciembre de 2020

export default function reformatReadableDate(dateStr) {
    // convert YYYY-MM-DD string to Date object
    const tokens = dateStr.split('-')
    if (tokens.length != 3) {
        console.log("reformatReadableDate expecting YYYY-MM-DD, got " + dateStr);
        return dateStr; // unknown format, use existing string
    }
    const yyyy = +tokens[0];
    const mm = +tokens[1];
    const dd = +tokens[2];
    const theDate = new Date(yyyy,mm-1,dd);
    const readableDate = 
         theDate.toLocaleString( document.documentElement.lang, 
         { month: "long", day: 'numeric', year:'numeric' });
    // console.log(dateStr + " --> " + readableDate);
    return readableDate;
}
