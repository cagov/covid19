// Generic Formatters

let intFormatter = new Intl.NumberFormat(
    "us", // forcing US to avoid mixed styles on translated pages
    { style: "decimal", minimumFractionDigits: 0, maximumFractionDigits: 0 }
);
let float1Formatter = new Intl.NumberFormat(
    "us", // forcing US to avoid mixed styles on translated pages
    { style: "decimal", minimumFractionDigits: 1, maximumFractionDigits: 1 }
);
let float2Formatter = new Intl.NumberFormat(
    "us", // forcing US to avoid mixed styles on translated pages
    { style: "decimal", minimumFractionDigits: 2, maximumFractionDigits: 2 }
);
let float3Formatter = new Intl.NumberFormat(
    "us", // forcing US to avoid mixed styles on translated pages
    { style: "decimal", minimumFractionDigits: 3, maximumFractionDigits: 3 }
);

let pct0Formatter = new Intl.NumberFormat(
    "us", // forcing US to avoid mixed styles on translated pages
    { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 }
);
let pct1Formatter = new Intl.NumberFormat(
    "us", // forcing US to avoid mixed styles on translated pages
    { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 }
);
let pct2Formatter = new Intl.NumberFormat(
    "us", // forcing US to avoid mixed styles on translated pages
    { style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2 }
);
let pct3Formatter = new Intl.NumberFormat(
    "us", // forcing US to avoid mixed styles on translated pages
    { style: "percent", minimumFractionDigits: 3, maximumFractionDigits: 3 }
);


export default function formatValue(v, {format='number',min_decimals=1})
{
    // console.log("formatValue",v,format);
    if (format == 'integer') {
        return intFormatter.format(v);
    } else if (format == 'percent') {
        if (v < .00005) {
            return pct3Formatter.format(v)
        } else if (v < .0005) {
            return pct2Formatter.format(v)
        } else if (min_decimals == 0) {
            return pct0Formatter.format(v)
        } else {
            return pct1Formatter.format(v)
        }
    } else { // number or float
        if (v < .005) {
            return float3Formatter.format(v)
        } else if (v < .05) {
            return float2Formatter.format(v)
        } else if (min_decimals == 0) {
            return intFormatter.format(v)
        } else {
            return float1Formatter.format(v)
        }
    }
}
