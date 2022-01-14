import css from './index.scss';

export default function template(translationsObj) {
  return /*html*/`<div class="py-2">
    <div class="bg-white py-4">
      <div class="svg-holder">
      </div>
    </div>

    <p class="chart-data-label small-text mt-2 mb-2">${translationsObj.footerText}</p>

  </div>`;
}
