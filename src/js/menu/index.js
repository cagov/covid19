import navTemplate from './template.js'

class CAGOVOverlayNav extends window.HTMLElement {
  connectedCallback () {
    this.menuContentFile = this.dataset.json;
    fetch(this.menuContentFile)
      .then(response => response.json())
      .then(data => {
        this.innerHTML = navTemplate(data);
        this.querySelector(".open-menu").addEventListener('click', toggleMainMenu);
        this.querySelector(".expanded-menu-close-mobile").addEventListener('click', toggleMainMenu);
      });
  }
}
window.customElements.define('cagov-navoverlay', CAGOVOverlayNav);

function toggleMainMenu(){
  if(document.querySelector(".hamburger").classList.contains("is-active")){
    document.querySelector("body").classList.remove("display-menu");
    document.querySelector("body").classList.remove("reveal-items");
    document.querySelector(".hamburger").classList.remove("is-active");
    // what should we apply aria-expanded to?
    document.querySelector("#main-menu").setAttribute("aria-hidden", "true");
  } else {
    document.querySelector("body").classList.add("display-menu");
    document.querySelector(".hamburger").classList.add("is-active");
    document.querySelector("#main-menu").setAttribute("aria-hidden", "false");
    setTimeout(
      function(){
        document.querySelector("body").classList.add("reveal-items");
        document.querySelector("#search-site").focus();
      },
      300
    );
  }
};