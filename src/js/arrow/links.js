// Adding pdf span to the links with class pdf
var pdf = '<span class="pdf-link-icon no-underline-icon" aria-hidden="true">PDF</span><span class="sr-only"> (this is a pdf file)</span>';

var pdflLink = document.querySelectorAll(".pdf");
for (var i=0; i < pdflLink.length; i++) {
  pdflLink[i].innerHTML+=pdf; // += concatenates to pdf links
}


// Adding external link icon to the links with class external
var ext = '<span class="ca-gov-icon-external-link link-icon" aria-hidden="true"></span>';

var externallLink = document.querySelectorAll(".external");
for (var i=0; i < externallLink.length; i++) {
  externallLink[i].innerHTML += ext; // += cconcatenates to external links
}
