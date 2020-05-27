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

  document.body.addEventListener('click',function(event) {
    // close all dropdowns
    if(!event.target.classList.contains('dropdown-toggle')) {
      let openDropDowns = document.querySelectorAll('.dropdown-menu.show');
      openDropDowns.forEach(d => {
        d.classList.remove('show');
      })  
    }
  })
}