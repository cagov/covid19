

console.log('put one-off code here');

//const fs = require('fs');
//const original = JSON.parse(fs.readFileSync('../../pages/_data/pageNames.json','utf8'));
//const langData = JSON.parse(fs.readFileSync('../../pages/_data/langData.json','utf8'));


//langData.languages.filter(lang => lang.id!=='en').forEach(lang => {
//  const filename = `../../pages${lang.includepath.replace(/\./g,'')}menu-links${lang.filepostfix}.json`;
//  const menuLinksJson = JSON.parse(fs.readFileSync(filename, 'utf8'));


//menuLinksJson.Table2.forEach(link=>{
//  const altSlug = original.find(o=>o.slug===link._slug_or_url||o.href===link._slug_or_url);

//  if(altSlug&&altSlug[lang.wptag])
//    link.label=altSlug[lang.wptag];
//});


//fs.writeFileSync(filename,JSON.stringify(menuLinksJson,null,2),'utf8')
//});


