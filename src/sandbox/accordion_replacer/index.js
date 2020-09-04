const fs = require('fs');
const html = fs.readFileSync('accordion_replacer/sample_input.html','utf8');

const classsearchexp = /<(?<tag>\w+)\s+[^>]*(?<class>wp-accordion(?:-content)?)[^"]*"[^>]*>/m;
const getNextAccordionStartTag = searchArea => [...searchArea.matchAll(classsearchexp)]
  .map(r=> ({
    tag: r.groups.tag,
    class: r.groups.class,
    index: r.index,
    fulltag: r[0] }))[0];


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
let nextTag = getNextAccordionStartTag(html);
let endTag = getEndTag(nextTag.tag,html,nextTag.index+nextTag.fulltag.length);

console.log(endTag);


const fullResult = html.substring(nextTag.index,endTag.index);
console.log(fullResult);

/*
for (let i=0;i<accordionTagIndexes.length-1;i++) {
  accordionTagIndexes[i].endindex = accordionTagIndexes[i+1].index-1;
}
accordionTagIndexes[accordionTagIndexes.length-1].endindex = html.length;

const htmlsections = 
  accordionTagIndexes.map(r=> 
      [...html.substring(r.index,r.endindex).matchAll(new RegExp('<\/?'+r.tag+'\b','gm'))]
  );
  
let tagcount=0;
//figure out the actual end tag by comparing finding pairs of tags.
*/

//console.log('here-----'+htmlsections[htmlsections.length-1].length+'-----there\n\n\n');


//console.log('final html - \n' + html);