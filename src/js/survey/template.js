export default function () {
  return `<div role="alert">
    <div class="container">
      <div class="row">
        <div class="col-md-12 alert-left js-disclaimer">
          <p class="lead">
            <span class="bold h4">Please take 2 minutes to complete our COVID19 survey</span>
          </p>
          <a href="https://www.surveymonkey.com/r/covid19cafeedback" target="_new" class="js-goto-survey"><button class="btn btn-primary" type="button" aria-label="Open survey" data-dismiss="alert"><span aria-hidden="true">OK</span></button></a>
          <button class="btn btn-secondary js-dismiss-survey" type="button" aria-label="Close" data-dismiss="alert"><span aria-hidden="true">Dismiss</span></button>
        </div>
      </div>
    </div>
  </div>`;
}