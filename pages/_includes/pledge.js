/*!
 * Serialize all form data into a query string
 * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Node}   form The form to serialize
 * @return {String}      The serialized form data
 */
document.querySelector(".js-submit-pledge")&&document.querySelector(".js-submit-pledge").addEventListener("submit",(function(e){e.preventDefault();let t=function(e){for(var t=[],n=0;n<e.elements.length;n++){var o=e.elements[n];if(o.name&&!o.disabled&&"file"!==o.type&&"reset"!==o.type&&"submit"!==o.type&&"button"!==o.type)if("select-multiple"===o.type)for(var s=0;s<o.options.length;s++)o.options[s].selected&&t.push(encodeURIComponent(o.name)+"="+encodeURIComponent(o.options[s].value));else"checkbox"!==o.type&&"radio"!==o.type||o.checked?t.push(encodeURIComponent(o.name)+"="+encodeURIComponent(o.value)):"checkbox"!==o.type||o.checked||t.push(encodeURIComponent(o.name)+"=false")}return t.join("&")}(this);document.querySelector(".js-submit-button").innerHTML="Thank you",setTimeout((function(){document.querySelector(".js-submit-pledge").classList.add("d-none"),document.querySelector(".submit-response").classList.remove("d-none")}),300),fetch("https://api.alpha.ca.gov/Pledge?"+t,{method:"GET",redirect:"follow"})}));
