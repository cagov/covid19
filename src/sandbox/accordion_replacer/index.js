const fs = require('fs');
const html = fs.readFileSync('accordion_replacer/sample_input.html','utf8');

const classsearchexp = /<(?<tag>\w+)\s+[^>]*(?<class>wp-accordion(?:-content)?)[^"]*"[^>]*>/gm;
const getAccordionStartTags = searchArea => [...searchArea.matchAll(classsearchexp)]
  .map(r=> ({
    tag: r.groups.tag,
    class: r.groups.class,
    index: r.index,
    fulltag: r[0] }));


const getNextTag = (searchArea, tag) => 
  // ...like /<\/?h3\b[^>]*>/m
   [...searchArea.matchAll(new RegExp('<(?<closer>/?)'+tag+'\\b[^>]*>','m'))]
    .map(r=> ({
      index: r.index,
      isCloseTag: r.groups.closer.length>0,
      fulltag: r[0] }))[0];


const getEndTag = (tag, html, startIndex) => {
  let resultindex = startIndex;
  let startTagsActive = 0;
  let loopsafe = 100;
  let searchArea = html.substring(startIndex);

  while(--loopsafe>0) {
    const nextTag = getNextTag(searchArea,tag);
    if(!nextTag) throw `Can't find matching end tag - ${tag}`;
    const resultOffset = nextTag.index+nextTag.fulltag.length;
    resultindex += resultOffset;
    if(nextTag.isCloseTag) {
      if(startTagsActive===0) {
        nextTag.index = resultindex;
        return nextTag;
      } else {
        startTagsActive--;
      }
    } else {
      //new open tag
      startTagsActive++;
    }
    searchArea = searchArea.substring(resultOffset);
  }
}

//grab the location of the next accordian tag in the html
const accordionTags = getAccordionStartTags(html)
  .map(nextTag=> ({
    nextTag,
    endTag:getEndTag(nextTag.tag,html,nextTag.index+nextTag.fulltag.length)
  }))
  .map(tags=> html.substring(tags.nextTag.index,tags.endTag.index));




console.log(accordionTags)

//let endTag = 




//const fullResult = html.substring(nextTag.index,endTag.index);
//console.log(fullResult);
