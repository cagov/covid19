// jsdoc format is following: https://github.com/runem/web-component-analyzer
/**
 * A component that looks for ids within selectors and fires events if a link to those ids is executed either via click on an in page anchor or on new page load
 * 
 * @element cagov-anchor-events
 * 
 * @fires click - The event fired is configurable via data-event-type, click is the default
 * 
 * @attr {String} data-selector - The query selector to use to look for elements we are interested in
 * @attr {String} data-event-type - The event to fire, default is click
 * @attr {String} data-event-target-selector - The query selector to use to identify element event should target
 * @attr {String} data-cancel-selector - The query selector to check for before firing event, if present cancel event
 */
class CAGOVAnchorsToEvents extends window.HTMLElement {
  connectedCallback() {
    this.selector = this.dataset.selector ? this.dataset.selector : 'cagov-accordion';
    this.cancelSelector = this.dataset.cancelSelector ? this.dataset.cancelSelector : 'cagov-accordion details[open] summary';
    this.eventTargetSelector = this.dataset.eventTargetSelector ? this.dataset.eventTargetSelector  : 'cagov-accordion details summary';
    this.eventType = this.dataset.eventType ? this.dataset.eventType : 'click';
    this.runConditions();
    this.reviewPageLinks()
  }

  runConditions() {
    // are there any selectors on the page    
    if(document.querySelectorAll(this.selector).length === 0) {
      return;
    }
    // is there an anchor in the url
    if(window.location.hash !== '') {
      // is it inside an accordion
      let targetId = window.location.hash.replace('#','')
      this.runInteract(targetId);
    }
  }

  reviewPageLinks() {
    document.body.addEventListener('click',function(event) {
      let linkUrl = null;
      // if they clicked a link get target
      if(event.target.nodeName === "A") {
        linkUrl = event.target.href;
      } else {
        if(event.target.closest("a")) {
          linkUrl = event.target.closest("a").href;
        }  
      }
      // see if it is an anchor on this page
      if(linkUrl && linkUrl.indexOf('#') > -1 && linkUrl.indexOf(window.location.origin + window.location.pathname) === 0) {
        let linkId = linkUrl.split('#')[1];
        this.runInteract(linkId);
      }
    }.bind(this))
  }

  runInteract(targetId) {
    // to something inside an accordion
    let el = document.getElementById(targetId);
    if(el && el.closest(this.selector)) {
      // is the accordion closed
      if(!el.querySelector(this.cancelSelector)) {
        // if so send click event to open it
        const event = new MouseEvent(this.eventType, {
          view: window,
          bubbles: true,
          cancelable: true
        });
        el.closest(this.selector).querySelector(this.eventTargetSelector).dispatchEvent(event);
      }
    }
  }

}
window.customElements.define("cagov-anchor-events", CAGOVAnchorsToEvents);