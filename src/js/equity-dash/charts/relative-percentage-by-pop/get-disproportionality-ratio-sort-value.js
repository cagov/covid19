/* 
  Calculate disproportionality sort value.
  For notes on the sorting function, please refer to the README.md.
*/
export default function getDisproportionateRatioSortValue(d, data, self) {
  let type = d.METRIC;

  let ratio = null;
  // console.log(d);
  
  if (d.POPULATION_PERCENTAGE !== null && d.METRIC_TOTAL_PERCENTAGE !== null) {
    ratio = d.METRIC_TOTAL_PERCENTAGE / d.POPULATION_PERCENTAGE;

    // @TODO Check isNan or Infinity.
    // @TODO And Math.round or decimal point fixing for display.
    // console.log("DISPROPORTIONALITY_RATIO:", ratio, d.DEMOGRAPHIC_SET_CATEGORY);
  }
  return ratio;
}
