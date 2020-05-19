class t{constructor(t){let e={label:"Unknown data",value:"Unknown data"};"string"==typeof t?e={label:t,value:t}:Array.isArray(t)?e={label:t[0],value:t[1]}:"object"==typeof t&&("label"in t||"value"in t)&&(e=t),this.label=e.label||e.value,this.value=e.value,"userData"in e&&(this.userData=e.userData)}get length(){return this.label.length}toString(){return`${this.label}`}valueOf(){return this.toString()}}class e{constructor(t,i){e.all=[];const s=this;e.count=(e.count||0)+1,this.count=e.count,this.isOpened=!1,this.input=e.query(t),this.input.setAttribute("autocomplete","off"),this.input.setAttribute("aria-owns",`awesomplete_list_${this.count}`),this.input.setAttribute("role","combobox"),this.options=i||{},this.configure({minChars:2,maxItems:10,autoFirst:!1,data:e.DATA,filter:e.FILTER_CONTAINS,sort:!1!==i.sort&&e.SORT_BYLENGTH,container:e.CONTAINER,item:e.ITEM,replace:e.REPLACE,tabSelect:!1},i),this.index=-1,this.container=this.container(t),this.ul=e.create("ul",{hidden:"hidden",role:"listbox",id:`awesomplete_list_${this.count}`,inside:this.container}),this.status=e.create("span",{className:"visually-hidden",role:"status","aria-live":"assertive","aria-atomic":!0,inside:this.container,textContent:0!==this.minChars?`Type ${this.minChars} or more characters for results.`:"Begin typing for results."}),this.events={input:{input:this.evaluate.bind(this),blur:this.close.bind(this,{reason:"blur"}),keydown(t){const e=t.keyCode;s.opened&&(13===e&&s.selected?(t.preventDefault(),t.stopImmediatePropagation(),s.select()):9===e&&s.selected&&s.tabSelect?s.select():27===e?s.close({reason:"esc"}):38!==e&&40!==e||(t.preventDefault(),s[38===e?"previous":"next"]()))}},form:{submit:this.close.bind(this,{reason:"submit"})},ul:{mousedown(t){t.preventDefault()},click(t){let e=t.target;if(e!==this){for(;e&&!/li/i.test(e.nodeName);)e=e.parentNode;e&&0===t.button&&(t.preventDefault(),s.select(e,t.target))}}}},e.bind(this.input,this.events.input),e.bind(this.input.form,this.events.form),e.bind(this.ul,this.events.ul),this.input.hasAttribute("list")?(this.list=`#${this.input.getAttribute("list")}`,this.input.removeAttribute("list")):this.list=this.input.getAttribute("data-list")||i.list||[],e.all.push(this)}configure(t,e){Object.keys(t).forEach(i=>{const s=t[i],n=this.input.getAttribute(`data-${i.toLowerCase()}`);this[i]="number"==typeof s?parseInt(n,10):!1===s?null!==n:s instanceof Function?null:n,this[i]||0===this[i]||(this[i]=i in e?e[i]:s)})}set list(t){if(Array.isArray(t))this.dataList=t;else if("string"==typeof t&&t.indexOf(",")>-1)this.dataList=t.split(/\s*,\s*/);else{const i=e.query(t);if(i&&i.children){const t=[],e=e=>{if(!e.disabled){const i=e.textContent.trim(),s=e.value||i,n=e.label||i;""!==s&&t.push({label:n,value:s})}};Array.prototype.slice.apply(i.children).forEach(e),this.dataList=t}}document.activeElement===this.input&&this.evaluate()}get list(){return this.dataList}get selected(){return this.index>-1}get opened(){return this.isOpened}close(t){this.opened&&(this.ul.setAttribute("hidden",""),this.isOpened=!1,this.index=-1,this.status.setAttribute("hidden",""),e.fire(this.input,"awesomplete-close",t||{}))}open(){this.ul.removeAttribute("hidden"),this.isOpened=!0,this.status.removeAttribute("hidden"),this.autoFirst&&-1===this.index&&this.goto(0),e.fire(this.input,"awesomplete-open")}destroy(){if(e.unbind(this.input,this.events.input),e.unbind(this.input.form,this.events.form),!this.options.container){const{parentNode:t}=this.container;t.insertBefore(this.input,this.container),t.removeChild(this.container)}this.input.removeAttribute("autocomplete"),this.input.removeAttribute("aria-autocomplete");const t=e.all.indexOf(this);-1!==t&&e.all.splice(t,1)}next(){const t=this.ul.children.length;let e=0;e=this.index<t-1?this.index+1:t?0:-1,this.goto(e)}previous(){const t=this.ul.children.length,e=this.index-1;this.goto(this.selected&&-1!==e?e:t-1)}goto(t){const i=this.ul.children;if(this.selected&&i[this.index].setAttribute("aria-selected","false"),this.index=t,t>-1&&i.length>0){i[t].setAttribute("aria-selected","true"),this.status.textContent=`${i[t].textContent}, list item ${t+1} of ${i.length}`,this.input.setAttribute("aria-activedescendant",`${this.ul.id}_item_${this.index}`),this.ul.scrollTop=i[t].offsetTop-this.ul.clientHeight+i[t].clientHeight;const s=this.suggestions[this.index];e.fire(this.input,"awesomplete-highlight",{selectedIndex:this.index,selectedText:`${s}`,selectedSuggestion:s})}}select(t,i){let s=t;if(t?this.index=e.siblingIndex(t):s=this.ul.children[this.index],s){const t=this.index,n=this.suggestions[t];e.fire(this.input,"awesomplete-select",{selectedIndex:t,selectedText:`${n}`,selectedSuggestion:n,origin:i||s})&&(this.replace(n),this.close({reason:"select"}),e.fire(this.input,"awesomplete-selectcomplete",{selectedIndex:t,selectedText:`${n}`,selectedSuggestion:n}))}}evaluate(){const e=this,{value:i}=this.input;if(i.length>=this.minChars&&this.dataList&&this.dataList.length>0){this.index=-1,this.ul.innerHTML="";const s=s=>new t(e.data(s,i)),n=t=>e.filter(t,i);this.suggestions=this.dataList.map(s).filter(n),!1!==this.sort&&(this.suggestions=this.suggestions.sort(this.sort)),this.suggestions=this.suggestions.slice(0,this.maxItems);const a=(t,s)=>{e.ul.appendChild(e.item(t,i,s))};this.suggestions.forEach(a),0===this.ul.children.length?(this.status.textContent="No results found",this.close({reason:"nomatches"})):(this.open(),this.status.textContent=`${this.ul.children.length} results found`)}else this.close({reason:"nomatches"}),this.status.textContent="No results found"}static FILTER_CONTAINS(t,i){return RegExp(e.regExpEscape(i.trim()),"i").test(t)}static FILTER_STARTSWITH(t,i){return RegExp(`^${e.regExpEscape(i.trim())}`,"i").test(t)}static SORT_BYLENGTH(t,e){return t.length!==e.length?t.length-e.length:t<e?-1:1}static CONTAINER(t){return e.create("div",{className:"awesomplete",around:t})}static ITEM(t,i,s){const n=""===i.trim()?t:`${t}`.replace(RegExp(e.regExpEscape(i.trim()),"gi"),"<mark>$&</mark>");return e.create("li",{innerHTML:n,"aria-selected":"false",id:`awesomplete_list_${this.count}_item_${s}`})}static REPLACE(t){this.input.value=t.value||t.label}static DATA(t){return t}static query(t,e){return"string"==typeof t?(e||document).querySelector(t):t||null}static queryAll(t,e){return Array.prototype.slice.call((e||document).querySelectorAll(t))}static create(t,i){const s=document.createElement(t);return Object.keys(i).forEach(t=>{const n=i[t];if("inside"===t)e.query(n).appendChild(s);else if("around"===t){const t=e.query(n);t.parentNode.insertBefore(s,t),s.appendChild(t),null!=t.getAttribute("autofocus")&&t.focus()}else t in s?s[t]=n:s.setAttribute(t,n)}),s}static bind(t,e){if(t){const i=i=>{const s=e[i];i.split(/\s+/).forEach(e=>{t.addEventListener(e,s)})};Object.keys(e).forEach(i)}}static unbind(t,e){if(t){const i=i=>{const s=e[i];i.split(/\s+/).forEach(e=>{t.removeEventListener(e,s)})};Object.keys(e).forEach(i)}}static fire(t,e,i){const s=document.createEvent("HTMLEvents"),n=t=>{s[t]=i[t]};return s.initEvent(e,!0,!0),"object"==typeof i&&Object.keys(i).forEach(n),t.dispatchEvent(s)}static regExpEscape(t){return t.replace(/[-\\^$*+?.()|[\]{}]/g,"\\$&")}static siblingIndex(t){let e=0,i=t;for(;i;)i=i.previousElementSibling,i&&(e+=1);return e}}class i extends window.HTMLElement{connectedCallback(){const t=this.dataset.searchApi;let i=`<form class="form-inline form-inline-left js-cagov-lookup">\n  <div class="form-group">\n    <label for="location-query"\n      >${"Please enter your county or zip code"}:</label\n    >\n    <div class="awesomplete">\n      <div class="awesomplete">\n        <input\n          aria-expanded="false"\n          aria-owns="awesomplete_list_1"\n          autocomplete="off"\n          class="city-search form-control"\n          data-list=""\n          data-multiple=""\n          id="location-query"\n          role="combobox"\n          type="text"\n        />\n        <ul hidden="" role="listbox" id="awesomplete_list_1"></ul>\n        <span\n          class="visually-hidden"\n          role="status"\n          aria-live="assertive"\n          aria-atomic="true"\n          >Type 2 or more characters for results.</span\n        >\n      </div>\n      <ul hidden="" id="awesomplete-list-1" role="listbox"></ul>\n      <span\n        class="visually-hidden"\n        aria-atomic="true"\n        aria-live="assertive"\n        role="status"\n        >Type 2 or more characters for results.</span\n      >\n    </div>\n    <button class="btn btn-primary" type="submit">${"Find health plan"}</button>\n    <div class="invalid-feedback">\n      Please enter a county or zip code in California.\n    </div>\n  </div>\n  </form>`;this.innerHTML=i;let s=this;const n={autoFirst:!0,filter:function(t,i){return e.FILTER_CONTAINS(t,i.match(/[^,]*$/)[0])},item:function(t,i){return document.querySelector(".invalid-feedback").style.display="none",document.querySelector(".city-search").classList.remove("is-invalid"),e.ITEM(t,i.match(/[^,]*$/)[0])},replace:function(t){let e=this.input.value.match(/^.+,\s*|/)[0]+t;this.input.value=e,s.dispatchEvent(new CustomEvent("showResults",{detail:e}))}},a=new e("input[data-multiple]",n);document.querySelector("input[data-multiple]").addEventListener("keyup",e=>{const i=[13,9,27,38,40];if(e.target.value.length>=2&&-1===i.indexOf(e.keyCode)){let i=e.target.value;window.lookup=i;const s=`${t}${i}`;window.fetch(s).then(t=>t.json()).then(t=>{a.list=t.match.map(t=>t)}).catch(()=>{})}}),document.querySelector(".js-cagov-lookup").addEventListener("submit",t=>{t.preventDefault(),document.querySelector(".invalid-feedback").style.display="none",document.querySelector(".city-search").classList.remove("is-invalid");let e=this.querySelector("input").value;this.dispatchEvent(new CustomEvent("showResults",{detail:e}))})}}function s(t,e,i){-1===t.toLowerCase().indexOf("county")&&(t+=" County");let s=`Showing plasma donation locations in ${t}.`;i&&(s=`${e} is in ${t}, showing plasma donation locations in ${t}.`),window.fetch("https://api.alpha.ca.gov/PlasmaDonate/"+t.replace(" County","")).then(t=>t.json()).then(t=>{let e='There does not appear to be a donation center in this county. You could either type in a neighboring county into the search or view more current listings at <a href="http://www.aabb.org/tm/donation/Pages/Blood-Bank-Locator.aspx">http://www.aabb.org/tm/donation/Pages/Blood-Bank-Locator.aspx</a>.';t.length>0&&t[0].Name&&(e=`\n        <h3>${s}</h3>\n        <div class="pt-5 js-provider-list">\n          ${t.map(t=>`\n              <div class="card">\n                <div class="card-header card-header-multi">\n                  <span class="bold">${t.Name}</span>\n                </div>\n                <div class="card-body">\n                  <div class="card-text">\n\n                    <p>\n                      ${""!=t.Address1?`${t.Address1}<br>`:""}\n                      ${t.Address2?`${t.Address2}<br>`:""}\n                      ${""!=t.CityStateZip?`${t.CityStateZip}`:""}\n                    </p>\n                    ${t.Contact?`<p><a href="tel:${t.Contact}">${t.Contact}</a></p>`:""}                   \n                    ${t.Website?`<p><a href="${t.Website}" class="action-link mr-3">Visit website</a></p>`:""}\n                  </div>\n                </div>\n              </div>\n            `).join(" ")}\n        </div>\n      `),document.querySelector(".js-plasma-providers").innerHTML=e}).catch(t=>{n()})}function n(){document.querySelector(".invalid-feedback").style.display="block"}window.customElements.define("cwds-lookup",i),document.querySelector("cwds-lookup")&&document.querySelector("cwds-lookup").addEventListener("showResults",t=>{!function(t){let e=!1;if(t.match(/^\d+$/)){e=!0;let i=`https://api.alpha.ca.gov/countyfromzip/${t}`;window.fetch(i).then(t=>t.json()).then(i=>{s(i[0].county,t,e)}).catch(()=>{n()})}else s(t,t,e)}(t.detail)});
