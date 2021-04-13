// Adding pdf span to the links with class pdf
var pdf = '<span class="pdf-link-icon no-underline-icon" aria-hidden="true">PDF</span><span class="sr-only"> (this is a pdf file)</span>';

// selector is looking for links with pdf extension in the href
var pdfLink = document.querySelectorAll("a[href*='.pdf']");
for (var i=0; i < pdfLink.length; i++) {
  pdfLink[i].innerHTML+=pdf; // += concatenates to pdf links
  // Fixing search results PDF links
  if (pdfLink[i].innerHTML.indexOf('*PDF (this is a pdf file)*') != -1) {
    pdfLink[i].innerHTML+=pdf.replace(/PDF (this is a pdf file)]/g,''); // += concatenates to pdf links
  }
}


// Adding external link icon to the links with class external
var ext = '<span class="ca-gov-icon-external-link link-icon" aria-hidden="true"></span>';
var localurl = 'https://covid19.ca.gov';
// Check if link is external function
function link_is_external(link_element) {
  return (link_element.host !== window.location.host || ocument.location.href.indexOf('https://covid19.ca.gov') === -1);
}

// Looping thru all link inside of the internal pages main content body
var externalLink = document.querySelectorAll(".container .row .col-lg-10 a");
for (var i=0; i < externalLink.length; i++) {
  if (link_is_external(externalLink[i])) {
  externalLink[i].innerHTML += ext; // += cconcatenates to external links
}
}
