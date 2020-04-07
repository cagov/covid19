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
  let lastSurveyInteraction = localStorage.getItem("surveyInteraction");
  if(!lastSurveyInteraction && Math.random() < 0.99) { 
    return true; 
  }
  return false;
}

function applyListeners(target) {
  target.querySelector('.js-goto-survey').addEventListener('click',reportEvent('openSurvey'));
  target.querySelector('.js-dismiss-survey').addEventListener('click',function(event) {
    event.preventDefault();
    reportEvent('dismissSurvey');
    target.remove();
  });
}

function reportEvent(eventString) {
  localStorage.setItem("surveyInteraction", new Date().getTime());
  reportGA(eventString);
  // report to new API: { site, event }
}

function reportGA(eventString) {
  if(typeof(ga) !== 'undefined') {
    ga('send', 'event', 'banner', 'click', 'survey', eventString);
  } else {
    setTimeout(function() {
      reportGA(eventString)
    }, 500);
  }
}