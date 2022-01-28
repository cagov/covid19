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
    this.menuClass = '.menu-ribbon--primary';
    this.buttonClass = '.menu-ribbon--button';
    document.body.addEventListener('click', this.closeOnBodyClick.bind(this));
  }

  /**
   * Isolate each menu and run the toggle function when clicked.
   */
  targetEachMenu() {
    const menus = this.querySelectorAll(this.menuClass);

    menus.forEach((menu) => {
      const elements = {
        button: menu.querySelector(this.buttonClass),
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
   * Check whether menus are open.
   *
   * returns NodeList or false
   */
  menusAreOpen() {
    const anyMenuHasOpenClass = this.querySelectorAll(`.${this.openClass}`);

    return (anyMenuHasOpenClass.length > 0) ? anyMenuHasOpenClass : false;
  }

  /**
   * Close the menu if user clicks somewhere other than the menu.
   */
  closeOnBodyClick(event) {
    if (!event.target.closest(this.menuClass) && (this.menusAreOpen() instanceof NodeList)) {
      const elements = {
        button: this.querySelector(`${this.buttonClass}[aria-expanded="true"]`),
        parent: this.querySelector(`${this.menuClass}.${this.openClass}`),
      };

      this.closeMenu(elements);
    }
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
    // Close any menus that are open.
    if (this.menusAreOpen() instanceof NodeList) {
      this.menusAreOpen().forEach((item) => {
        item.classList.remove(this.openClass);
      });
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
