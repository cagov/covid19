import menuRibbonTemplate from './menu-ribbon-template.js';

class CAGOVMenuRibbon extends window.HTMLElement {
  connectedCallback() {
    this.menuContentFile = this.dataset.json;
    window
      .fetch(this.menuContentFile)
      .then(response => response.json())
      .then((data) => {
        this.innerHTML = menuRibbonTemplate(data, this.dataset);
      });
  }
}

export default CAGOVMenuRibbon;
