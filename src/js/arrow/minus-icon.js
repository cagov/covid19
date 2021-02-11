// This is accordion minus icon
class MinusIcon extends window.HTMLElement {
  connectedCallback () {
    const { classPrefix, classList } = this.dataset;
    this.innerHTML = `<div class="accordion-icon" aria-hidden="true"><?xml version="1.0" encoding="utf-8"?>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve">
    <path class="fill-orange" d="M5.7,12.8h12.7c0.4,0,0.8-0.4,0.8-0.8s-0.4-0.8-0.8-0.8H5.7c-0.4,0-0.8,0.4-0.8,0.8S5.2,12.8,5.7,12.8z"/>
    </svg></div>`;
  }
}
window.customElements.define('cagov-minus', MinusIcon);