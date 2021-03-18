import css from './index.scss';

export default function template(translationsObj) {
  return /*html*/`<div class="py-2">
    <div class="bg-white pt-4 pb-0">
      <div class="mx-auto">
      <div class="chart-title">${translationsObj["title"]}</div>
        <p class="small-text chart-description">${translationsObj["description"]}</p>
        <div class="svg-holder"></div>
        <div class="svg-holder-second"></div>
      </div>
    </div>
  </div><!--END BG lightblue-->`;
}