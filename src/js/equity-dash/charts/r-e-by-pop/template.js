import css from './index.scss';

export default function template(title, description) {
  return /*html*/`<div class="py-2">
    <div class="bg-white py-4">
      <div class="mx-auto">
        <div class="chart-title">${title}</div>
        <p class="small-text">${description}</p>
        <div class="svg-holder"></div>
      </div>
    </div>
  </div><!--END BG lightblue-->`;
}