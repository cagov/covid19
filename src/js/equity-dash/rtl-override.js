/* temporary fix for charts that don't render well in RTL languages, 
   such as arabic
*/

export default function rtlOverride(elem, divSelector='.svg-holder', desired_dir='ltr') {
    let contDiv = elem.querySelector(divSelector);
    if (contDiv != null) {
      // temporary override for rtl languages (arabic)
      // console.log("containing div found", contDiv);
      contDiv.setAttribute('dir', desired_dir);
    } else {
      // console.log("containing div not found");
    }
}
