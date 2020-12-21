/*
// This is the desired term set from GO:
  American Indian or Alaska Native (AI/AN)
  Asian American
  Black
  Latino
  Multi-Race
  Native Hawaiian and other Pacific Islander (NHPI)
  Other
  Unknown
  White
*/

export default function termCheck() {
  // The following mapping uses terms we've seen in the database to terms we want to display in that case
  let desiredTermMappings = new Map();
  desiredTermMappings.set("African American", "Black")
  desiredTermMappings.set("Native Hawaiian and other Pacific Islander", "Native Hawaiian and other Pacific Islander (NHPI)")
  desiredTermMappings.set("American Indian", "American Indian or Alaska Native (AI/AN)") 

  return desiredTermMappings;
}
