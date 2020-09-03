console.log('hello world');



console.log('breakpoint');
/*
const classsearchexp = /<(?<tag>\w+)\s+[^>]*(?<class>wp-accordion(?:-content)?)[^"]*"[^>]*>/gm;

      //grab the location of al the accordian tags in the html
      const accordionTagIndexes = [...html.matchAll(classsearchexp)]
        .map(r=> ({
          tag: r.groups.tag,
          class: r.groups.class,
          index: r.index,
          fulltag: r[0] }));

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


      console.log('here-----'+htmlsections[htmlsections.length-1].length+'-----there\n\n\n');
      */