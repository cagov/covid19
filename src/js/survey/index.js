import surveyTemplate from './template.js'

class CWDSSurvey extends window.HTMLElement {
  connectedCallback () {
    let shouldDisplayNPI = somePercent();
    let seenSurvey = seenSurveyPrompt();
    let surveyUrl = this.dataset.pulseSurveyUrl;
    if(!seenSurvey) {
      if(shouldDisplayNPI) {
        surveyUrl = this.dataset.npiSurveyUrl
      }
      reportEvent('surveyDisplay');
      let html = surveyTemplate(surveyUrl, this.dataset.surveyPrompt);
      this.innerHTML = html;
      applyListeners(this);
    }
  }
}
window.customElements.define('cwds-survey', CWDSSurvey);

function seenSurveyPrompt() {
  let lastSurveyInteraction = localStorage.getItem("surveyInteraction8");
  if(!lastSurveyInteraction) { 
    return false; 
  }
  return true;
}
function somePercent() { 
  if(Math.random() < 0.1) { 
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
    target.style.display = 'none';
  });
}

function reportEvent(eventString) {
  localStorage.setItem("surveyInteraction8", new Date().getTime());
  reportGA(eventString);
  // report to new API: { site, event }
}

function reportGA(eventString) {
  if(typeof(gtag) !== 'undefined') {
    ga('send', 'event', 'click', 'survey', eventString);
  } else {
    setTimeout(function() {
      reportGA(eventString)
    }, 500);
  }
}