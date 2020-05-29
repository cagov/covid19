export default function applyAccordionListeners() {
  document.querySelectorAll('cwds-accordion').forEach((acc) => {
    acc.addEventListener('click',function() {
      if(this.querySelector('.accordion-title')) {
        reportGA('accordion', this.querySelector('.accordion-title').textContent.trim())
      }
    });
  });

  function reportGA(elementType,eventString) {
    if(typeof(gtag) !== 'undefined') {
      gtag('event','click',{'event_category':elementType,'event_label':eventString});
    } else {
      setTimeout(function() {
        reportGA(elementType,eventString)
      }, 500);
    }
  }

  document.querySelectorAll('.show-all').forEach(btn => {
    const isCloseButton = btn.classList.contains('d-none');
    btn.addEventListener('click', () => {
      let wait = 0;
      document
        .querySelectorAll(
          `cwds-step-list .list-group-item-action${
            isCloseButton ? '.list-open' : ':not(.list-open)'
          }`
        )
        .forEach(lstitem => setTimeout(() => lstitem.click(), 50 * wait++));
      document
        .querySelectorAll('.show-all')
        .forEach(y => y.classList.toggle('d-none'));
    });
  });


  // navbar toggles
  document.querySelectorAll('.navbar-toggler')
  listener on .navbar-toggler
  finds # of aria-controls
  toggles show on that
  and toggles aria-expanded on self

  listener on dropdown-toggle
  does preventDefault
  finds sibling with aria-labelledby which matches its id
  toggles show on ^
  toggles aria-expanded on self
*/
}