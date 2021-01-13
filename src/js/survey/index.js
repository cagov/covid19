import surveyTemplate from './template.js'
function randomString(length) {
  let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

class CWDSSurvey extends window.HTMLElement {
  connectedCallback () {
    let shouldDisplayNPI = somePercent();
    let seenSurvey = seenSurveyPrompt();
    let surveyUrl = this.dataset.pulseSurveyUrl;
    let surveyPrompt = this.dataset.pulseSurveyPrompt;
    if(!seenSurvey) {
      if(shouldDisplayNPI) {
        surveyUrl = this.dataset.npiSurveyUrl
        surveyPrompt = this.dataset.surveyPrompt
      }
      if(surveyUrl) { // We disable the pulse survey by removing the url from the langData config file
        if(surveyUrl.indexOf('surveymonkey.com') > -1 && surveyUrl.indexOf('?source=') > -1) {
          surveyUrl += `&src=${randomString(32)}`
        }
        reportEvent('surveyDisplay');
        let html = surveyTemplate(surveyUrl, surveyPrompt);
        const header = document.querySelector('.header');
        header.classList.add('relative-position');
        header.classList.remove('fixed-position');
        const hero = document.querySelector('.hero');
        hero.classList.remove('hero-padding-top');
        this.innerHTML = html;
        applyListeners(this);
      }
    }
  }
}
window.customElements.define('cwds-survey', CWDSSurvey);

function seenSurveyPrompt() {
  let lastSurveyInteraction = localStorage.getItem("surveyInteraction9");
  if(!lastSurveyInteraction) { 
    return false; 
  }
  return true;
}
function somePercent() { 
  if(Math.random() < 0.2) { 
    return true; 
  }
  return false;
}

function applyListeners(target) {
  target.querySelector('.js-goto-survey').addEventListener('click',function() {
    reportEvent('openSurvey');
  });
  target.querySelector('.js-dismiss-survey').addEventListener('click',function(event) {
    event.preventDefault();
    reportEvent('dismissSurvey');
    const header = document.querySelector('.header');
    header.classList.remove('relative-position');
    header.classList.add('fixed-position');
    const hero = document.querySelector('.hero');
    hero.classList.add('hero-padding-top');
    target.style.display = 'none';
  });
}

function reportEvent(eventString) {
  localStorage.setItem("surveyInteraction9", new Date().getTime());
  reportGA(eventString);
  // report to new API: { site, event }
}

function reportGA(eventString) {
  if(typeof(ga) !== 'undefined') {
    ga('send', 'event', 'click', 'survey', eventString);
  } else {
    setTimeout(function() {
      reportGA(eventString)
    }, 500);
  }
}