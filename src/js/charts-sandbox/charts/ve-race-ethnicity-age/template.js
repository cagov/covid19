import css from './index.scss';

export default function template(translationsObj) {
    return /*html*/`<div class="py-2">
    <div class="container">
      <div class="col-lg-12 bg-white py-4">

        <div class="row">
          <div class="col-lg-12 col-md-12 col-sm-12 mx-auto px-0">
            <div class="chart-title">Vaccinations by Race / Ethnicity and Age</div>
            <div class="svg-legend-holder"></div>
          </div>
        </div>

        <div class="row">
        <div class="col-lg-6 col-md-6 col-sm-12 mx-auto px-0">
          <div class="chart-subtitle">American Indian or Alaska Native (AI/AN)</div>
          <div class="svg-holder-0">
          </div>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-12 mx-auto px-0">
          <div class="chart-subtitle">Asian American</div>
          <div class="svg-holder-1">
          </div>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-12 mx-auto px-0">
          <div class="chart-subtitle">Black</div>
          <div class="svg-holder-2">
          </div>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-12 mx-auto px-0">
          <div class="chart-subtitle">Multi-race</div>
          <div class="svg-holder-3">
          </div>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-12 mx-auto px-0">
          <div class="chart-subtitle">Latino</div>
          <div class="svg-holder-4">
          </div>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-12 mx-auto px-0">
          <div class="chart-subtitle">Native Hawaiian or Other Pacific Islander (NHPI)</div>
          <div class="svg-holder-5">
          </div>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-12 mx-auto px-0">
          <div class="chart-subtitle">White</div>
          <div class="svg-holder-6">
          </div>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-12 mx-auto px-0">
          <div class="chart-subtitle">Other</div>
          <div class="svg-holder-7">
          </div>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-12 mx-auto px-0">
          <div class="chart-subtitle">Unknown</div>
          <div class="svg-holder-8">
          </div>
        </div>
      </div>
  

        <div class="row">
          <div class="col-lg-9 col-md-9 col-sm-12 mx-auto px-0">
            <p class="chart-data-label col-lg-10 mx-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
          </div>
        </div>
      </div><!--END col-12-->
    </div><!--END CONTAINER-->
  </div>`;
}
