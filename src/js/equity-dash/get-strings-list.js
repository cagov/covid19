export default function getTranslations(container) {
  let translationsObj = {};
  let translateEls = container.querySelectorAll('li');
  translateEls.forEach(item => {
    translationsObj[item.classList] = item.innerHTML;
  })
  return translationsObj;
}