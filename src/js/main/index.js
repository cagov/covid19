import { reformatReadableDate } from "../common/readable-date.js";

let svg_path = 'https://files.covid19.ca.gov/img/generated/sparklines/';

function getSVG(file, selector) {
    fetch(svg_path + file).then(function(response) {
      return response.text().then(function(text) {
          let targetEl = document.querySelector(selector);
          if(targetEl) {
              targetEl.innerHTML = text;
              let svg_about = targetEl.querySelector('svg').getAttribute('about');
  
              let svgvars = {};
              svg_about.split(',').forEach(elemStr => {
                  let pieces = elemStr.split(':');
                  svgvars[pieces[0]] = pieces[1];
              });
              let capEl = targetEl.parentElement.querySelector('.date-caption-span');
              const dateFormat = { month: "long", day: 'numeric' };
              if (capEl) {
                  capEl.innerHTML = reformatReadableDate(svgvars.FIRST_DATE, dateFormat) +
                                  ' &ndash; ' + 
                                  reformatReadableDate(svgvars.LAST_DATE, dateFormat);
              }
          }
      });
    });
  }
  getSVG('sparkline-cases.svg','.sparkline-cases');
  getSVG('sparkline-tests.svg','.sparkline-tests');
  getSVG('sparkline-deaths.svg','.sparkline-deaths');
  getSVG('sparkline-vaccines.svg','.sparkline-vax');