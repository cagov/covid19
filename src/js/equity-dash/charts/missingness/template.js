import css from './index.scss';
// https://stackoverflow.com/questions/50404970/web-components-pass-data-to-and-from
export default function template(title) {
  return /*html*/`<div class="py-2">
    <div class="container">
      <div class="col-lg-12 bg-white py-4">
        <div class="row">
          <div class="col-lg-9 col-md-9 col-sm-12 mx-auto">
            <div class="chart-title">${title}</div>
            <div class="svg-holder">
              <!--Translatable values for charts. -->
              <div class="d-none">
                <ul data-label-array="displayOrderValues">
                  <li data-label-array="tests">Tests</li>
                  <li data-label-array="cases">Cases</li>
                  <li data-label-array="deaths">Deaths</li>
                </ul>

                <ul>
                  <li data-label="data-missing">Data missing</li>
                  <li data-label="data-reported">Data reported</li>
                  <li data-label="reported">reported</li>
                  <li data-label="missing">missing</li>
                  <li data-label="empty-tooltip">an empty tooltip</li>
                  <li data-label="percent-change-previous-month">change in cases since previous month</li>
                  <li data-label="chart-tooltip">
                    <div>
                    In California, race and ethnicity data for
                    <span data-replace="metric"></span> is
                    <span class="highlight-data">
                      <span data-replace="highlight-data"></span>
                    </span>
                    complete
                    </div>
                  </li>
                  <li data-label="tab-label">Reporting by <span data-replace="metricFilter"></span> in <span data-replace="location"></span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div><!--END col-12-->
    </div><!--END CONTAINER-->
  </div><!--END BG lightblue-->`;
}
