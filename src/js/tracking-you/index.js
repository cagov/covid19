import boxTracker from "./box-tracker.js";

export default function setupAnalytics() {

  function reportGA(eventName, eventParams) {
    eventParams['send_to'] = 'custom_events'; // Group also mentioned in pages/_includes/footer.njk
    gtag('event', eventName, eventParams);
  }

  document.querySelectorAll('cagov-accordion').forEach((acc) => {
    acc.addEventListener('click',function() {
      if(this.querySelector('summary')) {
        reportGA('accordion_click', {'accordion_summary': this.querySelector('summary').textContent.trim()});
      }
    });
  });

  document.querySelectorAll('a').forEach((a) => {
    const site_url_default = 'covid19.ca.gov/';

    // look for and track anchor and pdf links
    if(a.href.indexOf(window.location.hostname) > -1 || a.href.indexOf(site_url_default) > -1) { // do this because pdfs are on linked subdomains

      let splitter = a.href.indexOf(window.location.hostname) > -1 ? window.location.hostname : site_url_default;

      if(a.href.indexOf('.pdf') > -1) {
        a.addEventListener('click',function() {
          reportGA('pdf_click', {'pdf_path': this.href.split(splitter)[1]});
        });    
      }
      if(a.href.indexOf('#') > -1) {
        a.addEventListener('click',function() {
          reportGA('anchor_click', {'anchor_path': this.href.split(splitter)[1]});
        });    
      }
    }

    // look for offsite links
    if(a.href.indexOf(window.location.origin) === -1 && a.href.indexOf('http') > -1) { // we are looking at a different protocol + hostname, ignoring tel: links
      if(a.href.indexOf('.pdf') === -1) {
        // we want to track links to subdomains like toolkit.covid19.ca.gov
        // but we don't want to record clicks to files.covid19.ca.gov/my.pdf as offsite links because we record those as pdf clicks above
        /*
        a.addEventListener('click',function() {
          reportGA('offsite_click', {'url': this.href});
        })          
        */
      }
    }
  });

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

  if(document.querySelector("cagov-pagefeedback")) {
    document.querySelector("cagov-pagefeedback").addEventListener("ratedPage", (evt) => {
      reportGA('rating', {'was_helpful': evt.detail});
    });
  }

  /*
    Kennedy Project tracking stuff starts here.
  */

/*
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

  // Report a single error to GA.
  const trackError = (error, errorMsg = {}) => {
    // console.log("Tracking error");
    const fieldsObj = { eventAction: 'uncaught error: ' + errorMsg };
    window.ga('send', 'event', 'javascript', 'error', (error && error.stack) || '(not set)', fieldsObj);
  };

  // Tracks and reports errors to GA.
  const trackErrors = () => {
    // Fetch and report errors that we catch before GA is ready.
    // console.log("Tracking Errors Setup")
    // // this is not currently being set up at loadtime
    // const loadErrorEvents = (window.__e && window.__e.q) || [];
    // const fieldsObj = { eventAction: 'uncaught error' };
    // loadErrorEvents.forEach((event) => trackError(event.error, fieldsObj));
    // Add a new listener to track events in real-time, after we get through the backlog.
    window.addEventListener('error', (event) => trackError(event.error, event.message + " filename:" + event.filename + " lineno:" + event.lineno));
  };

  // Add these events if we're public, not in local development scenarios.
  if (window.location.hostname !== 'localhost') {
    trackErrors();
  }
*/

  // Give all analytics calls a chance to finish before following the link.
  // Note this generates a function for use by an event listener.
  const linkHandler = (eventName, url) => (event) => {
    const params = {'url': url};
    reportGA(eventName, params);
  };

  // Track searches from all pages.
  document.querySelectorAll('.header-search-form, .expanded-menu-search-form').forEach(form => {
    form.addEventListener('submit', event => {
      const query = form.querySelector('input[name="q"]').value; // User's search query.
      reportGA('search', {'search_term': query});
    });
  });

  // Check to see if we're on any of the available homepages.
  const homepages = ['/', '/tl/', '/es/', '/ar/', '/ko/', '/vi/', '/zh-hans/', '/zh-hant/'];

  // Homepage-only events
  if (homepages.indexOf(window.location.pathname) > -1) {
    // Report video clicks.
    document.querySelectorAll('.video-modal-open').forEach(link => {
      link.addEventListener('click', linkHandler('homepage_video_play', link.href));
    });

    // Report clicks on footer links.
    document.querySelectorAll('footer a').forEach(link => {
      link.addEventListener('click', linkHandler('homepage_footer_click', link.href));
    });

    // Report clicks on Tracking Covid section.
    document.querySelectorAll('.hero-stats a').forEach(link => {
      link.addEventListener('click', linkHandler('homepage_tracking_covid_click', link.href));
    });

    // Report clicks on main headline link
    document.querySelectorAll('.hero-alert .action-link').forEach(link => {
      link.addEventListener('click', linkHandler('homepage_headline_click', link.href));
    });

    // Report clicks on headline social links.
    document.querySelectorAll('.hero-alert .social-link').forEach(link => {
      link.addEventListener('click', linkHandler('homepage_headline_social_click', link.href));
    });

    // Report clicks on featured links
    document.querySelectorAll('.featured-content a').forEach(link => {
      link.addEventListener('click', linkHandler('homepage_featured_click', link.href));
    });

    // Report clicks on myturn links
    document.querySelectorAll('a').forEach(link => {
      if (link.href.indexOf('myturn.ca.gov') >= 0) {
        link.addEventListener('click', linkHandler('homepage_myturn_click', link.href));
      }
    });
  }

  if (window.location.pathname.indexOf('/vaccines') >= 0) {
    document.querySelectorAll('a').forEach(link => {
      if (link.href.indexOf('myturn.ca.gov') >= 0) {
        link.addEventListener('click', linkHandler('vaccines_myturn_click', link.href));
      }
    });
  }



/*
  if (window.location.pathname.match(/\/equity[/]?$/g)) {
      
    let searchElement = document.querySelector('cagov-county-search');
    searchElement.addEventListener('county-selected', function(e) {
      // console.log("county selected! ",e.detail);
      if (e.detail.how == 'tab') {
        reportGA('tab-select',e.detail.county, 'click');
      } else {
        reportGA('county-select', e.detail.county, 'activity-status');
      }
    }.bind(this), false);
      
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
  }
*/
}
