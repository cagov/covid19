export default function (incomingUrl, incomingPrompt) {
  let surveyUrl = 'https://www.surveymonkey.com/r/T2V3FMJ?source=covid';
  if(incomingUrl) {
    surveyUrl = incomingUrl;
  }
  let surveyPrompt = 'Please take 2 minutes to complete our COVID-19 survey';
  if(incomingPrompt) {
    surveyPrompt = incomingPrompt;
  }
  return `<div role="alert">
    <div class="survey">
      <div class="survey-content">
        <p class="survey-content-prompt">${surveyPrompt}</p>
        <a href="${surveyUrl}" target="_new" class="btn-link pt-2 pb-2 px-4 js-goto-survey"><span class="sr-only">Open survey </span><span aria-hidden="true">OK</span></a> 
        <button class="btn-link pt-2 pb-2 px-4 js-dismiss-survey" type="button" aria-label="Close" data-dismiss="alert"><span aria-hidden="true">Dismiss</span></button>
      </div>
    </div>
  </div>`;
}