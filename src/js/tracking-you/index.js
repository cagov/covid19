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

  /*
    Changed the parameter names here to better match GA docs and new requirements.
    Old-to-new mappings:
      elementType ==> eventAction
      eventString ==> eventLabel
  */
  function reportGA(eventAction, eventLabel, eventCategory = 'click') {
    if(typeof(ga) !== 'undefined') {
      ga('send', 'event', eventCategory, eventAction, eventLabel);
      ga('tracker2.send', 'event', eventCategory, eventAction, eventLabel);
      ga('tracker3.send', 'event', eventCategory, eventAction, eventLabel);
      // gtag('event','click',{'event_category':elementType,'event_label':eventString});
    } else {
      setTimeout(function() {
        reportGA(eventAction, eventLabel, eventCategory);
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


  /*
    Kennedy Project tracking stuff starts here.

  // Give all analytics calls a chance to finish before following the link.
  // Note this generates a function for use by an event handler.
  const linkHandler = (href, eventAction, eventLabel) => (event) => {
    // Use event.returnValue in IE, otherwise event.preventDefault.
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);

    // Fire off reports to Google Analytics.
    window.ga('send', 'event', 'click', eventAction, eventLabel);
    window.ga('tracker2.send', 'event', 'click', eventAction, eventLabel);
    window.ga('tracker3.send', 'event', 'click', eventAction, eventLabel, {
      // When this third call finishes, follow the link via hitCallback.
      hitCallback: () => { document.location.href = href; }
    });
  };

  // Add 'external' to front of any supplied links, when relevant.
  const annotateExternalLinks = (link) => {
    return (link.hostname === document.location.hostname) ? link.href : `external-${link.href}`;
  };

  // Add these events if we're on the homepage.
  const homepages = ['/', '/tl/', '/es', '/ar/', '/ko/', '/vi/', '/zh-hans/', '/zh-hant/'];
  if (homepages.indexOf(window.location.pathname) > -1) {
    // Report video clicks.
    const videoTitle = document.querySelector('.video-text h4').textContent;
    document.querySelectorAll('.video-modal-open').forEach(link => {
      link.addEventListener('click', linkHandler(link.href, 'homepage-video', videoTitle));
    });
    // Report clicks on links in the menu.
    document.querySelectorAll('a.expanded-menu-dropdown-link, a.expanded-menu-section-header-link').forEach(link => {
      link.addEventListener('click', linkHandler(link.href, 'homepage-menu', link.href));
    });
    // Report clicks on Want to Know section.
    document.querySelectorAll('a.faq-item-link').forEach(link => {
      link.addEventListener('click', linkHandler(link.href, 'homepage-want to know', link.href));
    });
    // Report clicks on Latest News section.
    document.querySelectorAll('a.news-item-link').forEach(link => {
      link.addEventListener('click', linkHandler(link.href, 'homepage-latest news', annotateExternalLinks(link)));
    });
    // Report clicks on View More News link.
    document.querySelectorAll('.news-wrap a.button').forEach(link => {
      link.addEventListener('click', linkHandler(link.href, 'homepage-latest news', 'view more news'));
    });
    // Report clicks on footer links.
    document.querySelectorAll('footer a').forEach(link => {
      link.addEventListener('click', linkHandler(link.href, 'homepage-footer', annotateExternalLinks(link)));
    });
    // Report clicks on Tracking Covid section.
    document.querySelectorAll('.hero-stats a').forEach(link => {
      link.addEventListener('click', linkHandler(link.href, 'homepage-tracking covid', link.href));
    });
    // Report clicks on Hero Text section.
    document.querySelectorAll('.hero-text a').forEach(link => {
      link.addEventListener('click', linkHandler(link.href, 'homepage-hero text', link.href));
    });
    // Report clicks on Alerts section.
    document.querySelectorAll('.hero-alert a').forEach(link => {
      link.addEventListener('click', linkHandler(link.href, 'homepage-alerts section', annotateExternalLinks(link)));
    });
  }

  // Add these events if we're on the Roadmap page.
  if (window.location.pathname.indexOf('roadmap/') > -1) {
    // Report clicks on roadmap links.
    document.querySelectorAll('main a').forEach(link => {
      link.addEventListener('click', linkHandler(link.href, 'roadmap', annotateExternalLinks(link)));
    });
    // Report clicks on footer links.
    document.querySelectorAll('footer a').forEach(link => {
      link.addEventListener('click', linkHandler(link.href, 'roadmap-footer', annotateExternalLinks(link)));
    });
  }

  */
}
