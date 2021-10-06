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
  }

  /**
   * Isolate each menu and run the toggle function when clicked.
   */
  targetEachMenu() {
    const menus = this.querySelectorAll('.menu-ribbon--primary');

    menus.forEach((menu) => {
      const elements = {
        trigger: menu.querySelector('.menu-ribbon--toggle'),
        content: menu.querySelector('.menu-ribbon--secondary'),
        button: menu.querySelector('button'),
      };

      elements.trigger.addEventListener('click', () => {
        this.toggleMenu(elements);
      });

      menu.addEventListener('mouseenter', () => {
        this.openMenu(elements);
      });

      menu.addEventListener('mouseleave', () => {
        this.closeMenu(elements);
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
    if (elements.content.classList.contains('open')) {
      this.closeMenu(elements);
    } else {
      this.openMenu(elements);
    }
  }

  /**
   * @see this.toggleMenu().
   */
  openMenu(elements) {
    elements.content.classList.add('js-open');
    elements.trigger.classList.add('js-open');
    elements.button.setAttribute('aria-expanded', 'true');
  }

  /**
   * @see this.toggleMenu().
   */
  closeMenu(elements) {
    elements.content.classList.remove('js-open');
    elements.trigger.classList.remove('js-open');
    elements.button.setAttribute('aria-expanded', 'false');
  }
}

export default CAGOVMenuRibbon;
