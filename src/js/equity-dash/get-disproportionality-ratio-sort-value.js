/* 
Calculate disproportionality sort value.
For notes on the sorting function, please refer to the README.md in this component folder.
*/
export default function getDisproportionateRatioSortValue(d, data, self) {
  // data is all data without Other or Unknown values.
  let notKnownData = self.alldata.filter(
    (item) =>
      item.METRIC === self.selectedMetric &&
      (item.DEMOGRAPHIC_SET_CATEGORY === "Other" ||
        item.DEMOGRAPHIC_SET_CATEGORY === "Unknown")
  );

  let type = d.METRIC;

  // Add up the totals for the demographic sets (i.e. not "Unknown" or "Other")
  let totalPercentage = data
    .map((d) => {
      // Check if total percentage isn't null, if it is, return zero
      return d.METRIC_TOTAL_PERCENTAGE !== null ? d.METRIC_TOTAL_PERCENTAGE : 0;
    })
    .reduce(function (acc, val) {
      return acc + val;
    }, 0);

  let totalNotKnownPercentage = notKnownData
    .map((d) => {
      // Check if total percentage isn't null, if it is, return zero
      return d.METRIC_TOTAL_PERCENTAGE !== null ? d.METRIC_TOTAL_PERCENTAGE : 0;
    })
    .reduce(function (acc, val) {
      return acc + val;
    }, 0);

  // @TODO Check isNan or Infinity.
  // @TODO And Math.round or decimal point fixing for display.
  let totalKnownPercentage = 100 - totalNotKnownPercentage;

  // @TODO a conditional based on the metric may be necessary, but we need to review this data with the rendered result.

  let ratio = null;
  if (d.POPULATION_PERCENTAGE !== null && d.METRIC_TOTAL_PERCENTAGE) {
    // ratio = d.POPULATION_PERCENTAGE / d.METRIC_TOTAL_PERCENTAGE;

    // Total percentage = Cases / (Total cases - Unknown/Other cases) * 100

    // ratio = d.POPULATION_PERCENTAGE / totalNotKnownPercentage;
    // if (d.DEMOGRAPHIC_SET_CATEGORY === 'Unknown' ||
    //     d.DEMOGRAPHIC_SET_CATEGORY === 'Other') {
    //   ratio = d.POPULATION_PERCENTAGE / totalPercentage;
    // } else {
    ratio = d.POPULATION_PERCENTAGE / totalKnownPercentage;
    // }

    // @TODO Check isNan
    // @TODO Check Infinity

    console.log("DISPROPORTIONALITY_RATIO:", ratio, d.DEMOGRAPHIC_SET_CATEGORY);
  }
  return ratio;
}
