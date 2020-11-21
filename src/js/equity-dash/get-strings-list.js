export default function getTranslations(container) {
  let translationsObj = {};
  let translateEls = container.querySelectorAll('[data-label]');
  translateEls.forEach(item => {
    translationsObj[item.dataset.label] = item.innerHTML;
  })

  let translateElArrays = container.querySelectorAll('[data-group]');
  translateElArrays.forEach(group => {
    let groupKey = group.getAttribute('data-group');
    let arrayItems = group.querySelectorAll('[data-item]');
    if (groupKey !== null && arrayItems !== null) {
      let groupItems = {};
      arrayItems.forEach(item => {
        let key = item.getAttribute('data-item');
        groupItems[key] = item.innerHTML;
      });
      translationsObj[groupKey] = groupItems;
    }

  })

  console.log('trans', translationsObj);
  return translationsObj;
}
