export default function () {
  return `<div role="alert">
    <div class="container">
      <div class="row">
        <div class="col-md-12 alert-left js-disclaimer">
          <p class="lead bold">Please take 2 minutes to complete our COVID-19 survey</p>
          <button class="btn btn-secondary js-dismiss-survey" type="button" aria-label="Close" data-dismiss="alert"><span aria-hidden="true">Dismiss</span></button>
          <a href="https://www.surveymonkey.com/r/covid19california" target="_new" class="js-goto-survey"><button class="btn btn-primary" type="button" aria-label="Open survey" data-dismiss="alert"><span aria-hidden="true">OK</span></button></a>
        </div>
      </div>
    </div>
  </div>`;
}