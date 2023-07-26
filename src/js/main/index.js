import { reformatReadableDate } from "../common/readable-date.js";

function getSVG(file, selector) {
    fetch(config.svg_path + file).then(function(response) {
      return response.text().then(function(svgtext) {
          let targetEl = document.querySelector(selector);
          if(targetEl) {
                targetEl.innerHTML = svgtext;
                let svg_meta = JSON.parse(targetEl.querySelector('svg').getAttribute('meta'));
                // supply caption...
                let capEl = targetEl.parentElement.querySelector('.date-caption-span');
                const dateFormat = { month: "long", day: 'numeric' };
                if (capEl && 'FIRST_DATE' in svg_meta && 'LAST_DATE' in svg_meta) {
                        capEl.innerHTML = reformatReadableDate(svg_meta.FIRST_DATE, dateFormat) +
                                          ' &ndash; ' + 
                                          reformatReadableDate(svg_meta.LAST_DATE, dateFormat);
              }
          }
      });
    });
  }
  getSVG('sparkline-hospitalizations.svg','.sparkline-hospitalizations');
  getSVG('sparkline-tests.svg','.sparkline-tests');
  getSVG('sparkline-deaths.svg','.sparkline-deaths');
