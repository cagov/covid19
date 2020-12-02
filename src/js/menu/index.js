import navTemplate from './template.js';

class CAGOVOverlayNav extends window.HTMLElement {
  connectedCallback () {
    this.menuContentFile = this.dataset.json;
    window.fetch(this.menuContentFile)
      .then(response => response.json())
      .then(data => {
        this.innerHTML = navTemplate(data, this.dataset);
        this.querySelector('.open-menu').addEventListener('click', this.toggleMainMenu.bind(this));
        // this.querySelector('.expanded-menu-close-mobile').addEventListener('click', this.toggleMainMenu.bind(this));
        if (window.innerWidth < 1024) {
          this.expansionListeners(); // everything is expanded by default on big screens
        }
      });
  }

  toggleMainMenu () {
    if (this.querySelector('.hamburger').classList.contains('is-active')) {
      this.closeMainMenu();
    } else {
      this.openMainMenu();
    }
  }

  openMainMenu () {
    this.classList.add('display-menu');
    this.querySelector('.hamburger').classList.add('is-active');
    this.querySelector('.menu-trigger').classList.add('is-fixed');
    var menLabel = this.querySelector('.menu-trigger-label');
    menLabel.innerHTML = menLabel.getAttribute('data-closelabel');
    this.querySelector('#main-menu').setAttribute('aria-hidden', 'false');
    document.addEventListener('keydown', this.escapeMainMenu.bind(this));
    setTimeout(
      function () {
        this.classList.add('reveal-items');
        this.querySelector('#search-site').focus();
      }.bind(this),
      300
    );
  }

  closeMainMenu () {
    this.classList.remove('display-menu');
    this.classList.remove('reveal-items');
    this.querySelector('.hamburger').classList.remove('is-active');
    this.querySelector('.menu-trigger').classList.remove('is-fixed');
    var menLabel = this.querySelector('.menu-trigger-label');
    menLabel.innerHTML =  menLabel.getAttribute('data-openlabel');
    // what should we apply aria-expanded to?
    this.querySelector('#main-menu').setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', this.escapeMainMenu.bind(this));
  }

  escapeMainMenu (event) {
    // Close the menu if user presses escape key.
    if (event.keyCode === 27) { this.closeMainMenu(); }
  }

  expansionListeners () {
    const allMenus = this.querySelectorAll('.js-expandable-mobile');
    allMenus.forEach(menu => {
      const nearestMenu = menu.closest('.expanded-menu-section');
      if (nearestMenu) {
        const nearestMenuDropDown = nearestMenu.querySelector('.expanded-menu-dropdown');
        if (nearestMenuDropDown) {
          nearestMenuDropDown.setAttribute('aria-hidden', 'true');
          menu.closest('.expanded-menu-col').setAttribute('aria-expanded', 'false');
        }
      }
      menu.addEventListener('click', function (event) {
        event.preventDefault();
        this.closest('.expanded-menu-section').classList.toggle('expanded');
        this.closest('.expanded-menu-col').setAttribute('aria-expanded', 'true');
        const closestDropDown = this.closest('.expanded-menu-section').querySelector('.expanded-menu-dropdown');
        if (closestDropDown) {
          closestDropDown.setAttribute('aria-hidden', 'false');
        }
      });
    });
  }
}
window.customElements.define('cagov-navoverlay', CAGOVOverlayNav);

// Add shadow on scroll.
// Don't bother in older browsers that don't support IntersectionObserver. It's just a shadow!
if (('IntersectionObserver' in window) && ('isIntersecting' in window.IntersectionObserverEntry.prototype)) {
  const mainNav = document.querySelector('.header');
  const scrollSpy = document.querySelector('.nav-scroll-spy');

  // Remove the box-shadow if the scrollSpy element is 'visible'. Otherwise add it.
  const observer = new window.IntersectionObserver((entries) => {
    // entries[0] will just be the passed-in scrollSpy element.
    if (entries[0].isIntersecting) {
      mainNav.classList.remove('box-shadow');
    } else {
      mainNav.classList.add('box-shadow');
    }
  });

  observer.observe(scrollSpy);
}
