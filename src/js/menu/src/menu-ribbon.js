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
      const trigger = menu.querySelector('.menu-ribbon--toggle');
      const content = menu.querySelector('.menu-ribbon--secondary');
      trigger.addEventListener('click', () => {
        this.toggleMenu(trigger, content);
      });

      menu.addEventListener('mouseover', () => {
        this.openMenu(trigger, content);
      });

      menu.addEventListener('mouseout', () => {
        this.closeMenu(trigger, content);
      });
    });
  }

  /**
   * Toggle between open and closed.
   *
   * @param   {Element}  trigger  The arrow up/down.
   * @param   {Element}  content  The menu body.
   *
   */
  toggleMenu(trigger, content) {
    if (content.classList.contains('open')) {
      this.closeMenu(trigger, content);
    } else {
      this.openMenu(trigger, content);
    }
  }

  /**
   * @see this.toggleMenu().
   */
  openMenu(trigger, content) {
    content.classList.add('js-open');
    trigger.classList.add('js-open');
  }

  /**
   * @see this.toggleMenu().
   */
  closeMenu(trigger, content) {
    content.classList.remove('js-open');
    trigger.classList.remove('js-open');
  }
}

export default CAGOVMenuRibbon;
