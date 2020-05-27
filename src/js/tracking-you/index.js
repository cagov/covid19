export default function applyAccordionListeners() {
  document.querySelectorAll('cwds-accordion').forEach((acc) => {
    acc.addEventListener('click',function() {
      if(this.querySelector('.accordion-title')) {
        reportGA('accordion', this.querySelector('.accordion-title').textContent.trim())
      }
    });
  });

  document.querySelectorAll('a').forEach((a) => {
    // look for and track offsite and pdf links
    if(a.href.indexOf(window.location.hostname) > -1) {
      if(a.href.indexOf('.pdf') > -1) {
        a.addEventListener('click',function() {
          reportGA('pdf', this.href.split(window.location.hostname)[1])
        });    
      }
    } else {
      a.addEventListener('click',function() {
        reportGA('offsite', this.href)
      })
    }
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
    let openDropDowns = document.querySelectorAll('.dropdown-menu.show');
    openDropDowns.forEach(d => {
      if(d.parentNode !== event.target.parentNode) {
        d.classList.remove('show');
      }
    })
  })
}