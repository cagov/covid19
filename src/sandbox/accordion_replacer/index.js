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
   [...searchArea.matchAll(new RegExp('<(?<closeslash>/?)'+tag+'\\b[^>]*>','m'))]
    .map(r=> ({
      index: r.index,
      isCloseTag: r.groups.closeslash.length>0,
      fulltag: r[0] }))[0];


const getEndTag = (tag, html, startIndex) => {
  let resultIndex = startIndex;
  let startTagsActive = 0;
  let loopsafe = 100;
  let searchArea = html.substring(startIndex);

  while(--loopsafe>0) {
    const nextTag = getNextTag(searchArea,tag);
    if(!nextTag) throw `Can't find matching end tag - ${tag}`;
    const resultOffset = nextTag.index+nextTag.fulltag.length;
    resultIndex += resultOffset;
    if(nextTag.isCloseTag) {
      if(startTagsActive===0) {
        nextTag.index = resultIndex;
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

//Create a string list of all accordion content in order
const accordionContent = getAccordionStartTags(html)
  .map(nextTag=> ({
    nextTag,
    endTag:getEndTag(nextTag.tag,html,nextTag.index+nextTag.fulltag.length)
  }))
  .map(tags=> ({
      html: html.substring(tags.nextTag.index,tags.endTag.index),
      header: tags.nextTag.class==='wp-accordion'
  }));


let result = html;
//loop and build content
for (let resultIndex=0;resultIndex<accordionContent.length;resultIndex++) {
  const row = accordionContent[resultIndex];
  if(row.header) {
    let headerHTML = row.html;
    headerHTML = headerHTML.replace(/wp-accordion/,'').replace(/ class=""/,'');

    let bodyHTML = '';
    //fill the body
    let bodyIndex = resultIndex+1;
    while (bodyIndex<accordionContent.length&&!accordionContent[bodyIndex].header) {
      const bodyRow = accordionContent[bodyIndex];
      let bodyRowHTML = bodyRow.html;
      bodyRowHTML = bodyRowHTML.replace(/wp-accordion-content/,'').replace(/ class=""/,'');
      
      bodyHTML += bodyRowHTML;

      bodyIndex++;

      //remove this tag from html
      result = result.replace(bodyRow.html,'');
    }

    let finalHTML = `
<cwds-accordion>
  <div class="card">
    <button class="card-header accordion-alpha" type="button" aria-expanded="false">
      <div class="accordion-title">
        ${headerHTML}
      </div>
    </button>
    <div class="card-container" aria-hidden="true" style="height: 0px;">
      ${bodyHTML}
    </div>
  </div>
</cwds-accordion>
`;

    result = result.replace(row.html,finalHTML);
  } 
}
console.log(result);


//console.log(accordionContent);
