// This is just the arrow icons
class CWDSArrowIcon extends window.HTMLElement {
  connectedCallback () {
    const { classPrefix, classList } = this.dataset;
    this.innerHTML = `<div class="link-arrow-icon" aria-hidden="true"><svg class="link-arrow-icon-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
       viewBox="0 0 60.3 16.1" style="enable-background:new 0 0 60.3 16.1;" xml:space="preserve">
    <path class="arrow1" d="M51.5,2.3L56.1,7H38.6C38,7,37.5,7.4,37.5,8s0.5,1.1,1.1,1.1h17.5l-4.6,4.6c-0.4,0.4-0.4,1.1,0,1.5
      s1.1,0.4,1.5,0l6.5-6.5c0,0,0,0,0,0c0.1-0.1,0.2-0.2,0.2-0.3c0.1-0.3,0.1-0.6,0-0.8c-0.1-0.1-0.1-0.2-0.2-0.4L53,0.8
      c-0.4-0.4-1.1-0.4-1.5,0C51.1,1.2,51.1,1.9,51.5,2.3z"/>
    <path class="arrow2" d="M13.9,2.3L18.6,7H1.1C0.5,7,0,7.4,0,8s0.5,1.1,1.1,1.1h17.5l-4.6,4.6c-0.4,0.4-0.4,1.1,0,1.5s1.1,0.4,1.5,0
      l6.5-6.5c0,0,0,0,0,0c0.1-0.1,0.2-0.2,0.2-0.3c0.1-0.3,0.1-0.6,0-0.8c-0.1-0.1-0.1-0.2-0.2-0.4l-6.5-6.5c-0.4-0.4-1.1-0.4-1.5,0
      S13.5,1.9,13.9,2.3z"/>
    </svg></div>`;
  }

}
window.customElements.define('cagov-arrow', CWDSArrowIcon);