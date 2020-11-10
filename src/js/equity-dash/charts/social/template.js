export default function template(inputval) {
  return /*html*/`<div class="bg-lightblue py-2 full-bleed">
    <div class="container">
    <h2 class="text-center">Factors that increase risk of infection and severe illness</h2>
    <p>Californians in crowded housing or transportation, and with less access to paid leave and other worker protections have a higher risk of infection of COVID-19. Social determinants of health, such as food insecurity, lack of health insurance, and housing instability can increase the risk of poor outcomes. These social determinants of health are often the result of structural racism.</p>
    <div class="col-lg-12 bg-white px-3 py-4">
        <div class="row d-flex justify-content-md-center">

            <div class="inline-toggle-link-container">
                <div class="toggle-links bg-darkblue bd-darkblue">
                  <a href="#" class="toggle-active js-toggle-group income">Income</a><a href="#" class="js-toggle-group  housing">Crowded housing</a><a href="#" class="js-toggle-group healthcare">Access to health insurance</a>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-10 mx-auto">
              <div class="chart-title">Case rate by median annual household income bracket</div>
              <div class="svg-holder">
                <div class="bar-overlay">an empty tooltip</div>
              </div>
            </div>
        </div>
    </div><!--END col-12-->
  </div><!--END CONTAINER-->
</div><!--END BG lightblue-->`;
}