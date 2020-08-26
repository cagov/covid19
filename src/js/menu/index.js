import navTemplate from './template.js'

class CAGOVOverlayNav extends window.HTMLElement {
  connectedCallback () {
    this.menuContentFile = this.dataset.json;
    const searchEndpoint = this.dataset.search;
    fetch(this.menuContentFile)
      .then(response => response.json())
      .then(data => {
        this.innerHTML = navTemplate(data, searchEndpoint);
        this.querySelector(".open-menu").addEventListener('click', this.toggleMainMenu.bind(this));
        this.querySelector(".expanded-menu-close-mobile").addEventListener('click', this.toggleMainMenu.bind(this));
        this.expansionListeners();
      });
  }
  toggleMainMenu(){
    if(this.querySelector(".hamburger").classList.contains("is-active")){
      this.classList.remove("display-menu");
      this.classList.remove("reveal-items");
      this.querySelector(".hamburger").classList.remove("is-active");
      // what should we apply aria-expanded to?
      this.querySelector("#main-menu").setAttribute("aria-hidden", "true");
    } else {
      this.classList.add("display-menu");
      this.querySelector(".hamburger").classList.add("is-active");
      this.querySelector("#main-menu").setAttribute("aria-hidden", "false");
      setTimeout(
        function(){
          this.classList.add("reveal-items");
          this.querySelector("#search-site").focus();
        }.bind(this),
        300
      );
    }
  }
  expansionListeners() {
    let allMenus = [...this.querySelectorAll('.expanded-menu-section-header-link'), ...this.querySelectorAll('.expanded-menu-section-header-arrow')]
    allMenus.forEach(menu => {
      if(window.innerWidth < 1024){
        let nearestMenu = menu.closest('.expanded-menu-section');
        if(nearestMenu) {
          let nearestMenuDropDown = nearestMenu.querySelector('.expanded-menu-dropdown');
          if(nearestMenuDropDown) {
            nearestMenuDropDown.setAttribute('aria-hidden','true')
            menu.closest('.expanded-menu-col').setAttribute('aria-expanded','false')   
          }
        }
      }
      menu.addEventListener('click', function(event) {
        if(window.innerWidth < 1024){
          event.preventDefault();
          this.closest('.expanded-menu-section').classList.toggle('expanded');
          this.closest('.expanded-menu-col').setAttribute('aria-expanded','true')
          let closestDropDown = this.closest('.expanded-menu-section').querySelector('.expanded-menu-dropdown');
          if(closestDropDown) {
            closestDropDown.setAttribute('aria-hidden','false')
          }
        }
      })
    })
   
  }
}
window.customElements.define('cagov-navoverlay', CAGOVOverlayNav);

// Add shadow on scroll.
// Don't bother in older browsers that don't support IntersectionObserver. It's just a shadow!
if (('IntersectionObserver' in window) && ('isIntersecting' in window.IntersectionObserverEntry.prototype)) {
  const mainNav = document.querySelector('.header');
  const scrollSpy = document.querySelector('.nav-scroll-spy');

  // Remove the box-shadow if the scrollSpy element is "visible". Otherwise add it.
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
