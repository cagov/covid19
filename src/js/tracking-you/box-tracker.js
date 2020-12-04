/******************** 
Generates a one-time trigger event when the vertical center of an element has been within view for
3 seconds (adjustable)

(the midpoint implies that > 50% of the element is in view)

generates a custom event which can be tracked
********************/

let boxState = {};
let bt_debugging = false;

function isScrolledIntoView(elem)
{
    const viewportHeight = document.documentElement.clientHeight;
    var docViewTop = window.pageYOffset;
    var docViewBottom = docViewTop + viewportHeight;

    var elemRect = elem.getBoundingClientRect();
    var elemHeight = elemRect.bottom - elemRect.top;
    var elemTop = elemRect.top + window.scrollY;
    var elemBottom = elemTop + elemHeight;

    var elemMiddle = (elemTop + elemBottom) / 2;

    // console.log("se",docViewTop, docViewBottom, elemTop, elemBottom);

    // use this for entire element
    // return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));

    return elemMiddle > docViewTop && elemMiddle < docViewBottom;
}

export default function boxTracker(elementSelector,   // class of element we are tracking 
                           labelOverride=null,        // unique name to use, if different than element selector
                           minimumViewMS=3000,        // minimum time in view needed to trigger the event
                           eventName='chart-in-view') // event to trigger
{
    if (bt_debugging)
        console.log("Setting up box tracker",elementSelector, minimumViewMS)
    let label = labelOverride != null? labelOverride : elementSelector;
    let tKey = elementSelector;
    let elem = document.querySelector(elementSelector);
    if (elem == null || elem == undefined) {
        console.log("Element not found",elementSelector);
        return;
    }

    boxState[tKey] = {triggered:false, inView:false, lh:null};

    const throttle = (fn, delay) => (event) => {
        let wait = false;
        if (!wait) {
        fn(event);
        wait = true;
        setTimeout(() => { wait = false; }, delay);
        }
    };

    let scrollHandler = function() {
        if (!boxState[tKey].triggered) {
            if (isScrolledIntoView(elem)) {
                if (!boxState[tKey].inView) {
                    if (bt_debugging)
                        console.log(label + " is in view");
                    boxState[tKey].inView = true;
                    // start timing
                    boxState[tKey].lh = setTimeout(function() {
                        if (bt_debugging)
                            console.log(label + " chart-in-view triggered");
                        boxState[tKey].triggered = true;
                        const tevent = new window.CustomEvent(eventName,{detail:{label: label, elem:elementSelector}});
                        window.dispatchEvent(tevent);    
                    }, minimumViewMS);
                }
            } else {
                if (boxState[tKey].inView) {
                    if (bt_debugging)
                        console.log(label + " is out of view");
                    clearTimeout(boxState[tKey].lh);
                    boxState[tKey].inView = false;
                }
            }
        }

    };
    window.addEventListener('scroll',throttle(scrollHandler,1000));
}