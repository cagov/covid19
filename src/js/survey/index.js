import surveyTemplate from './template.js'

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
        reportEvent('surveyDisplay');
        let html = surveyTemplate(surveyUrl, surveyPrompt);
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
  localStorage.setItem("surveyInteraction9", new Date().getTime());
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