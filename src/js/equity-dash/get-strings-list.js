export default function getTranslations(container) {
  let translationsObj = {};
  let translateEls = container.querySelectorAll('[data-label]');
  translateEls.forEach(item => {
    translationsObj[item.dataset.label] = item.innerHTML;
  })
  return translationsObj;
}
