function surveyTemplate () {
  return `<div role="alert">
    <div class="container">
      <div class="row">
        <div class="col-md-12 alert-left js-disclaimer">
          <p class="lead">
            <span class="bold h4">COVID-19 survey</span>
          </p>
          <a href="https://www.surveymonkey.com/r/covid19cafeedback" target="_new" class="js-goto-survey"><button class="btn btn-primary" type="button" aria-label="Open survey" data-dismiss="alert"><span aria-hidden="true">OK</span></button></a>
          <button class="btn btn-secondary js-dismiss-survey" type="button" aria-label="Close" data-dismiss="alert"><span aria-hidden="true">dismiss</span></button>
        </div>
      </div>
    </div>
  </div>`;
}

function survey () {
  let shouldDisplay = somePercent();
  if(shouldDisplay) {
    reportEvent('surveyDisplay');
    let html = surveyTemplate();
    let target = document.querySelector('.js-survey-display');
    target.innerHTML = html;
    applyListeners(target);
  }
}
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
      reportGA(eventString);
    }, 500);
  }
}

survey();
