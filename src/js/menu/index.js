import CAGOVOverlayNav from "./src/overlay.js";

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
