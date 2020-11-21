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
                <ul data-group="displayOrder">
                  <li data-item="tests">TEST TEST TEST Tests</li>
                  <li data-item="cases">TEST TEST TEST Cases</li>
                  <li data-item="deaths">TEST TEST TEST Deaths</li>
                </ul>

                <ul>
                  <li data-label="data-missing">TEST TEST TEST Data missing</li>
                  <li data-label="data-reported">TEST TEST TEST Data reported</li>
                  <li data-label="reported">TEST TEST TEST reported</li>
                  <li data-label="missing">TEST TEST TEST missing</li>
                  <li data-label="empty-tooltip">TEST TEST TEST an empty tooltip</li>
                  <li data-label="percent-change-previous-month">TEST TEST TEST change in cases since previous month</li>
                  <li data-label="chart-tooltip">
                    <div>
                    TEST TEST TEST In California, race and ethnicity data for
                    <span data-replace="metric"></span> is
                    <span class="highlight-data">
                      <span data-replace="highlight-data"></span>
                    </span>
                    complete
                    </div>
                  </li>
                  <li data-label="tab-label">TEST TEST TEST Reporting by <span data-replace="metric-filter"></span> in <span data-replace="location"></span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div><!--END col-12-->
    </div><!--END CONTAINER-->
  </div><!--END BG lightblue-->`;
}
