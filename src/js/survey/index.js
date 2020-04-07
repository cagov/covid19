import surveyTemplate from './template.js'

export default function () {
  let shouldDisplay = tenPercent();
  if(shouldDisplay) {
    reportEvent('surveyDisplay');
    let html = surveyTemplate();
    let target = document.querySelector('.js-survey-display');
    target.innerHTML = html;
  }
};

function tenPercent() { 
  if(Math.random() < 0.1) { 
    return true; 
  }
  return false;
}

function applyListeners(target) {
  target.querySelector('.js-goto-survey').addEventListener('click',reportEvent('openSurvey'));
  target.querySelector('.js-dismiss-survey').addEventListener('click',function() {
    reportEvent('dismissSurvey');
    target.remove();
  });
}

function reportEvent(event) {
  // ga('send', 'event', [eventCategory], [eventAction], [eventLabel], [eventValue], [fieldsObject]);
  // event is a string
  // report to GA if available
  // report to new API: { site, event }
}