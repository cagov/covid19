import surveyTemplate from './template.js'

export default function () {
  let shouldDisplay = somePercent();
  if(shouldDisplay) {
    reportEvent('surveyDisplay');
    let html = surveyTemplate();
    let target = document.querySelector('.js-survey-display');
    target.innerHTML = html;
    applyListeners(target);
  }
};

function somePercent() { 
  let lastSurveyInteraction = localStorage.getItem("surveyInteraction2");
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
    target.remove();
  });
}

function reportEvent(eventString) {
  localStorage.setItem("surveyInteraction2", new Date().getTime());
  reportGA(eventString);
  // report to new API: { site, event }
}

function reportGA(eventString) {
  if(typeof(gtag) !== 'undefined') {
    gtag('event','click',{'event_category':'survey','event_label':eventString});
  } else {
    setTimeout(function() {
      reportGA(eventString)
    }, 500);
  }
}