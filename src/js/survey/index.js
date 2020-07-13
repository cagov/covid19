import surveyTemplate from './template.js'

class CWDSSurvey extends window.HTMLElement {
  connectedCallback () {
    let shouldDisplay = somePercent();
    if(shouldDisplay) {
      reportEvent('surveyDisplay');
      let html = surveyTemplate(this.dataset.surveyUrl, this.dataset.surveyPrompt);
      this.innerHTML = html;
      applyListeners(this);
    }
  }
}
window.customElements.define('cwds-survey', CWDSSurvey);


function somePercent() { 
  let lastSurveyInteraction = localStorage.getItem("surveyInteraction7");
  if(!lastSurveyInteraction && Math.random() < 0.1) { 
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
  localStorage.setItem("surveyInteraction7", new Date().getTime());
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