import boxTracker from "./box-tracker.js";

export default function setupAnalytics() {

  ga('set', 'transport', 'beacon'); // jbum: use beacon by default if it's available, so we don't have to request it explicitly

  document.querySelectorAll('cwds-accordion').forEach((acc) => {
    acc.addEventListener('click',function() {
      if(this.querySelector('.accordion-title')) {
        reportGA('accordion', this.querySelector('.accordion-title').textContent.trim())
      }
    });
  });

  document.querySelectorAll('a').forEach((a) => {
    // look for and track offsite and pdf links
    if(a.href.indexOf(window.location.hostname) > -1 || a.href.indexOf('covid19.ca.gov') > -1) {
      if(a.href.indexOf('.pdf') > -1) {
        a.addEventListener('click',function() {
          reportGA('pdf', this.href.split(window.location.hostname)[1])
        });    
      }
    } else {
      // console.log("Adding offsite link handler:",window.location.hostname,a.href);
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
    console.log("ReportGA", eventCategory, eventAction, eventLabel);
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
  */

  // Create a throttled event listener.
  const throttle = (fn, delay) => (event) => {
    let wait = false;
    if (!wait) {
      fn(event);
      wait = true;
      setTimeout(() => { wait = false; }, delay);
    }
  };

  // Check for percentageScrolled at the following percentages.
  const scrollTriggers = [25, 50, 75, 90];
  // Record percentageScrolled upon hitting triggers, so we don't record these events again.
  const scrollHits = [];

  // Generates an event listener to track scroll percentage.
  // Run this within the 'throttle' function (above) to ease performance.
  const scrollHandler = (pagename) => () => {
    const viewportHeight = document.documentElement.clientHeight;
    const pageHeight = document.documentElement.scrollHeight;
    const trackableHeight = pageHeight - viewportHeight;
    const pixelsScrolled = window.pageYOffset;
    const percentageScrolled = Math.floor((pixelsScrolled / trackableHeight) * 100);

    scrollTriggers.forEach(trigger => {
      if ((scrollHits.indexOf(trigger) === -1) && (percentageScrolled >= trigger)) {
        scrollHits.push(trigger);
        const eventAction = `scroll-${trigger}`;
        const eventLabel = `scroll-${trigger}-${pagename}`;
        // console.log("Triggered scroll ",trigger,eventLabel);
        reportGA(eventAction, eventLabel, 'scroll');
        // window.ga('send', 'event', 'scroll', eventAction, eventLabel);
        // window.ga('tracker2.send', 'event', 'scroll', eventAction, eventLabel);
        // window.ga('tracker3.send', 'event', 'scroll', eventAction, eventLabel);
      }
    });
  };

  // Give all analytics calls a chance to finish before following the link.
  // Note this generates a function for use by an event listener.
  const linkHandler = (href, eventAction, eventLabel, follow = true) => (event) => {
    // Fire off reports to Google Analytics.
    console.log("linkhandler",eventAction,eventLabel);
    reportGA(eventAction, eventLabel);
    // we are using beacon by default, if it's available
    // window.ga('send', 'event', 'click', eventAction, eventLabel, { transport: 'beacon' });
    // window.ga('tracker2.send', 'event', 'click', eventAction, eventLabel, { transport: 'beacon' });
    // window.ga('tracker3.send', 'event', 'click', eventAction, eventLabel, { transport: 'beacon' });
  };

  // Add 'external' to front of any supplied links, when relevant.
  const annotateExternalLinks = (link) => {
    return (link.hostname === document.location.hostname) ? link.href : `external-${link.href}`;
  };

  // Report a single error to GA.
  const trackError = (error, fieldsObj = {}) => {
    window.ga('tracker3.send', 'event', Object.assign({
      eventCategory: 'javascript',
      eventAction: 'error',
      eventLabel: (error && error.stack) || '(not set)',
      nonInteraction: true
    }, fieldsObj));
  };

  // Tracks and reports errors to GA.
  const trackErrors = () => {
    // Fetch and report errors that we catch before GA is ready.
    const loadErrorEvents = (window.__e && window.__e.q) || [];
    const fieldsObj = { eventAction: 'uncaught error' };
    loadErrorEvents.forEach((event) => trackError(event.error, fieldsObj));
    // Add a new listener to track events in real-time, after we get through the backlog.
    window.addEventListener('error', (event) => trackError(event.error, fieldsObj));
  };

  // Check to see if we're on any of the available homepages.
  const homepages = ['/', '/tl', '/es', '/ar', '/ko', '/vi', '/zh-hans', '/zh-hant'];
  const onHomePage = (pathname) => {
    return homepages.some((homepage) => pathname.match(new RegExp(`^${homepage}[/]?$`, 'g')));
  };

  // Don't load up these event listeners unless we've got Google Analytics on the page.
  if (window.ga && window.ga.create) {
    // Track searches from all pages.
    document.querySelectorAll('.header-search-form, .expanded-menu-search-form').forEach(form => {
      form.addEventListener('submit', event => {
        const eventAction = window.location.pathname; // Originating page of the search.
        const eventLabel = form.querySelector('input[name="q"]').value; // User's search query.

        // Send info to Google Analytics.
        reportGA(eventAction, eventLabel, 'search');
        // window.ga('send', 'event', 'search', eventAction, eventLabel, { transport: 'beacon' });
        // window.ga('tracker2.send', 'event', 'search', eventAction, eventLabel, { transport: 'beacon' });
        // window.ga('tracker3.send', 'event', 'search', eventAction, eventLabel, { transport: 'beacon' });
      });
    });

    // Add these events if we're public, not in local development scenarios.
    if (window.location.hostname !== 'localhost') {
      trackErrors();
    }

    // Add these events if we're on the homepage.
    if (onHomePage(window.location.pathname)) {
      // Track how far the user has scrolled the homepage.
      window.addEventListener('scroll', throttle(scrollHandler('homepage'), 1000));
      // Report video clicks.
      const videoUrl = document.querySelector('a.video-modal-open').href;
      document.querySelectorAll('.video-modal-open').forEach(link => {
        link.addEventListener('click', linkHandler(link.href, 'homepage-video', videoUrl, false));
      });
      // Report clicks on links in the menu.
      document.querySelectorAll('a.expanded-menu-dropdown-link, a.expanded-menu-section-header-link').forEach(link => {
        link.addEventListener('click', linkHandler(link.href, 'homepage-menu', link.href));
      });
      // Report clicks on Want to Know section.
      document.querySelectorAll('a.faq-item-link').forEach(link => {
        link.addEventListener('click', linkHandler(link.href, 'homepage-want to know', link.href));
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
    if (window.location.pathname.match(/\/roadmap[/]?$/g)) {
      // Report clicks on roadmap links.
      document.querySelectorAll('main a').forEach(link => {
        link.addEventListener('click', linkHandler(link.href, 'roadmap', annotateExternalLinks(link)));
      });
      // Report clicks on footer links.
      document.querySelectorAll('footer a').forEach(link => {
        link.addEventListener('click', linkHandler(link.href, 'roadmap-footer', annotateExternalLinks(link)));
      });
    }

    // Add these events if we're on the Safer Economy page.
    if (window.location.pathname.match(/\/safer-economy[/]?$/g)) {
      // Track submissions to the safer-economy page form.
      // Note that 'safer-economy-page-submission' is a CustomEvent, fired from the form's JS.
      window.addEventListener('safer-economy-page-submission', event => {
        const eventAction = event.detail.county;
        const eventLabel = event.detail.activity ? event.detail.activity : 'None';
        reportGA(eventAction, eventLabel, 'activity-status');
        // window.ga('send', 'event', 'activity-status', eventAction, eventLabel);
        // window.ga('tracker2.send', 'event', 'activity-status', eventAction, eventLabel);
        // window.ga('tracker3.send', 'event', 'activity-status', eventAction, eventLabel);
      });
    }
    if (window.location.pathname.match(/\/equity[/]?$/g)) {
      window.addEventListener('scroll', throttle(scrollHandler('equity'), 1000));
      
      let searchElement = document.querySelector('cagov-county-search');
      searchElement.addEventListener('county-selected', function(e) {
        // console.log("county selected! ",e.detail);
        if (e.detail.how == 'tab') {
          reportGA('tab-select',e.detail.county, 'click');
        } else {
          reportGA('county-select', e.detail.county, 'activity-status');
        }
      }.bind(this), false);

      /* searchElement.addEventListener('county-search-typo', function(e) {
        // console.log("got county thpo! ",e.detail);
        reportGA('county-select-typo', e.detail.county, 'activity-status');
      }.bind(this), false); */
      
      // Setting up trackers for big blue bar chart
      document.addEventListener('setup-sd-tab-tracking', function() {
        for (let tlabel of ['income','housing','healthcare']) {
          const btn = document.querySelector("button.large-tab." + tlabel);
          if (btn != null) {
            btn.addEventListener('click', (e) => reportGA('tab-select', tlabel) );
          }
        }
      });

      document.querySelectorAll('.small-tab').forEach(btn => {
        btn.addEventListener('click', function (e) {
          let tabName = this.getAttribute('data-key');
          // console.log("Got tab click",tabName);
          reportGA('tab-select', tabName); // equity-tab-select?  or tabName+":equity"?

        });
      });
      // this event generated by box-tracker
      window.addEventListener('chart-in-view', function(e) {
        reportGA('chart-in-view', e.detail.label, 'scroll');
      });
      boxTracker('cagov-chart-re-pop', 're-pop');
      boxTracker('cagov-chart-re-100k', 're-100k');
      boxTracker('cagov-chart-d3-lines', 'health-equity');
      boxTracker('cagov-chart-equity-data-completeness', 'data-completeness');
      boxTracker('cagov-chart-d3-bar', 'social-bar');

      // window.addEventListener('tab-select', function(e) {
      //   console.log("Tracking got tab-select",e.detail);
      //   reportGA('tab-select',e.detail.tab_selected);
      // });
    }
  }
}
