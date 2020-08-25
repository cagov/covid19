const fs = require('fs');

let menuData = JSON.parse(fs.readFileSync('../../../pages/_data/menuData.json', 'utf8'));
let pageNames = JSON.parse(fs.readFileSync('../../../pages/_data/pageNames.json', 'utf8'));

let singleLangMenu = { "sections": [] };



menuData.sections.forEach(section => {
  if(section.links) {
    section.links.forEach(link => {
      let linkData = getLinkInfo(link, 'lang-en');
      link.url = linkData.url;
      link.name = linkData.name;
    })
    singleLangMenu.sections.push(section)
  }
});
fs.writeFileSync('./dist/menu.json',JSON.stringify(singleLangMenu),'utf8')

function getLinkInfo(link, lang) {
  let linkData = {};
  if(link.slug) {
    pageNames.forEach(page => {
      if(page.slug === link.slug) {
        linkData.url = `/${page.slug}/`;
        linkData.name = page[lang];
      }
    })
  }
  if(link.href) {
    pageNames.forEach(page => {
      if(page.href === link.href) {
        linkData.url = page.href;
        linkData.name = page[lang];
      }
    })
  }
  return linkData;
}