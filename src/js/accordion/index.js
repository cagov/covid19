export class CaGovAccordion extends window.HTMLElement {
    connectedCallback () {
      this.classList.add('prog-enhanced');
      this.expandTarget = this.querySelector('.card-container');
      this.expandButton = this.querySelector('.card-header');
      this.expandButton.addEventListener('click', this.listen.bind(this));
      this.activateButton = this.querySelector('.card-header');
      this.eventType = this.dataset.eventType ? this.dataset.eventType : 'click';
      // Detect if accordion should open by default.
      let expanded = this.activateButton.getAttribute('aria-expanded');
      if (expanded === "true") {
        this.triggerAccordionClick(); // Open the accordion.
      } else {
        // this.closeAccordion(); // Update tabindex for automatically unopened accordions.
      }
    }
  
    listen () {
      if (!this.cardBodyHeight) {
        this.cardBodyHeight = this.querySelector('.card-body').clientHeight;
      }
      if (this.expandTarget.clientHeight > 0) {
        this.expandAccordion();
      } else {
        this.closeAccordion();
      }
    }
  
    triggerAccordionClick() {
      const event = new MouseEvent(this.eventType, {
        view: window,
        bubbles: true,
        cancelable: true
      });
      this.expandButton.dispatchEvent(event);
    }
  
    expandAccordion() {
      // console.log("expanding accordion");
      // this.expandTarget.setAttribute('tabindex', '-1');
      this.expandTarget.style.height = '0px';
      this.expandTarget.setAttribute('aria-hidden', 'true');
      this.querySelector('.card-header').classList.remove('accordion-alpha-open');
      this.activateButton.setAttribute('aria-expanded', 'false');
      var allLinks = document.querySelectorAll(".card-container a");
      var allbuttons = document.querySelectorAll(".card-container button");
      for (var i=0; i < allLinks.length; i++) {
        allLinks[i].setAttribute('tabindex', '-1'); // tabindex to all links
      }
      for (var i=0; i < allbuttons.length; i++) {
        allbuttons[i].setAttribute('tabindex', '-1'); // tabindex to all links
      }
    }
    
    closeAccordion() {
    // console.log("close accordion");
     // this.expandTarget.removeAttribute("tabindex");
      this.expandTarget.style.height = this.cardBodyHeight + 'px';
      this.expandTarget.setAttribute('aria-hidden', 'false');
      this.querySelector('.card-header').classList.add('accordion-alpha-open');
      this.querySelector('.card-container').classList.remove('collapsed');
      this.activateButton.setAttribute('aria-expanded', 'true');
      var allLinks = document.querySelectorAll(".card-container a");
      var allbuttons = document.querySelectorAll(".card-container button");
      for (var i=0; i < allLinks.length; i++) {
        allLinks[i].removeAttribute("tabindex"); // remove tabindex from all the links
      }
      for (var i=0; i < allbuttons.length; i++) {
        allbuttons[i].removeAttribute("tabindex"); // remove tabindex from all the links
      }
    }
  }
  window.customElements.define('cagov-accordion', CaGovAccordion);



// making sure that all links inside of the accordion container are having tabindex -1
var allLinks = document.querySelectorAll(".card-container a");
var allbuttons = document.querySelectorAll(".card-container button");
for (var i=0; i < allLinks.length; i++) {
  allLinks[i].setAttribute('tabindex', '-1'); // tabindex to all links
}

for (var i=0; i < allbuttons.length; i++) {
  allbuttons[i].setAttribute('tabindex', '-1'); // tabindex to all links
}
  