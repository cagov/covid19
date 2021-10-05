import CAGOVOverlayNav from './src/overlay.js';
import CAGOVMenuRibbon from './src/menu-ribbon.js';

window.customElements.define('cagov-navoverlay', CAGOVOverlayNav);
window.customElements.define('cagov-menu-ribbon', CAGOVMenuRibbon);

// Add shadow on scroll.
// Don't bother in older browsers that don't support IntersectionObserver. It's just a shadow!
if (
  'IntersectionObserver' in window
  && 'isIntersecting' in window.IntersectionObserverEntry.prototype
) {
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
