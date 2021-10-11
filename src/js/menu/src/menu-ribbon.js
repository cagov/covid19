import menuRibbonTemplate from './menu-ribbon-template.js';

class CAGOVMenuRibbon extends window.HTMLElement {
  connectedCallback() {
    this.menuContentFile = this.dataset.json;
    window
      .fetch(this.menuContentFile)
      .then(response => response.json())
      .then((data) => {
        this.innerHTML = menuRibbonTemplate(data, this.dataset);
        this.targetEachMenu();
      });
    this.openClass = 'js-open';
  }

  /**
   * Isolate each menu and run the toggle function when clicked.
   */
  targetEachMenu() {
    const menus = this.querySelectorAll('.menu-ribbon--primary');

    menus.forEach((menu) => {
      const elements = {
        button: menu.querySelector('.menu-ribbon--button'),
        parent: menu,
      };

      elements.button.addEventListener('click', () => {
        this.toggleMenu(elements);
      });

      elements.button.addEventListener('keydown', (event) => {
        if (event.keyCode === 27) {
          this.closeMenu(elements);
        }
      });
    });
  }

  /**
   * Toggle between open and closed.
   *
   * @param {Array}  elements  An array of elements.
   *
   */
  toggleMenu(elements) {
    const menuHasOpenClass = elements.parent.classList.contains('js-open');

    if (menuHasOpenClass) {
      this.closeMenu(elements);
    } else {
      this.openMenu(elements);
    }
  }

  /**
   * @see this.toggleMenu().
   */
  openMenu(elements) {
    const anyMenuHasOpenClass = this.querySelectorAll(`.${this.openClass}`);

    // Close any menus that are open.
    if (anyMenuHasOpenClass.length > 0) {
      anyMenuHasOpenClass.forEach((item) => { item.classList.remove(this.openClass); });
    }
    elements.parent.classList.add(this.openClass);
    elements.button.setAttribute('aria-expanded', 'true');
  }

  /**
   * @see this.toggleMenu().
   */
  closeMenu(elements) {
    elements.parent.classList.remove(this.openClass);
    elements.button.setAttribute('aria-expanded', 'false');
  }
}

export default CAGOVMenuRibbon;
