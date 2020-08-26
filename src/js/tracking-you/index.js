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
    if(typeof(ga) !== 'undefined') {
      ga('send', 'event', 'click', elementType, eventString);
      ga('tracker2.send', 'event', 'click', elementType, eventString);
      ga('tracker3.send', 'event', 'click', elementType, eventString);
      // gtag('event','click',{'event_category':elementType,'event_label':eventString});
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


  function toggleBoolean(el,attr) {
    if(el.getAttribute(attr) === "false") {
      el.setAttribute(attr,"true");
    } else {
      el.setAttribute(attr,"false");
    }
  }

  // navbar toggles
  document.querySelectorAll('.navbar-toggler').forEach(function(nav) {
    nav.addEventListener('click',function(event) {
      let target = document.querySelector('#'+nav.getAttribute('aria-controls'));
      target.classList.toggle('show')
      toggleBoolean(this,'aria-expanded')
    })
  })

  document.querySelectorAll('.dropdown-toggle').forEach(function(drop) {
    drop.addEventListener('click',function(event) {
      event.preventDefault();
      let target = document.querySelector('[aria-labelledby="'+this.id+'"]');
      target.classList.toggle('show')
      toggleBoolean(this,'aria-expanded')  
    })
  })
  
  document.body.addEventListener('click',function(event) {
    // close all dropdowns
    let openDropDowns = document.querySelectorAll('.dropdown-menu.show');
    openDropDowns.forEach(d => {
      if(d.parentNode !== event.target.parentNode) {
        let openParent = d.closest('.dropdown');
        if(openParent && openParent.querySelector('.dropdown-toggle[aria-expanded="true"]')) {
          openParent.querySelector('.dropdown-toggle[aria-expanded="true"]').setAttribute('aria-expanded','false')
        }
        d.classList.remove('show');
      }
    })
  })

  if(document.querySelector("cwds-pagerating")) {
    document.querySelector("cwds-pagerating").addEventListener("ratedPage", (evt) => {
      ga('send', 'event', 'rating', 'helpful', evt.detail);
    });  
  }
}