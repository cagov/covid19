export default function (incomingUrl, incomingPrompt) {
  let surveyUrl = 'https://www.surveymonkey.com/r/T2V3FMJ?source=covid';
  if(incomingUrl) {
    surveyUrl = incomingUrl;
  }
  let surveyPrompt = 'Please take 5 minutes to complete our COVID-19 survey';
  if(incomingPrompt) {
    surveyPrompt = incomingPrompt;
  }
  return `<div role="alert">
    <div class="survey">
      <div class="survey-content">
        <p class="survey-content-prompt" role="region" aria-label="${surveyPrompt}, choose below">${surveyPrompt}</p>
        <a href="${surveyUrl}" target="_new" class="btn-link pt-2 pb-2 px-4 js-goto-survey" role="region" aria-label="Ok, go to survey">OK</a> 
        <button class="btn-link pt-2 pb-2 px-4 js-dismiss-survey" role="region" aria-label="Close, dismiss" data-dismiss="alert">Dismiss</button>
      </div>
    </div>
  </div>`;
}