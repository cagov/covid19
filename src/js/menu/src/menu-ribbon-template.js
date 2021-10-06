export default function menuRibbonTemplate(data, dataset) {
  const classesPrimary = 'menu-ribbon--primary d-flex align-items-center';
  const classesSecondary = 'menu-ribbon--secondary';
  return `
  <div class="menu-ribbon--wrapper">
    <nav role="navigation" class="d-flex" aria-label="Site Navigation" aria-hidden="true" id="main-menu" tabindex="-1">
      
      <div class="sr-only">
        <a class="" href="/">${dataset.labelHome}</a>
      </div>

      <!--begin links -->
      ${data.sections.map(section => `
        <div class="${classesPrimary} section-${section.title.toLowerCase().replace(/ /g, '-')}">
          <label>${section.title}</label>
          <div class="menu-ribbon--toggle">
            <svg width="11" height="7"
                    class="expanded-menu-section-header-arrow-svg" viewBox="0 0 11 7" fill="#FF8000"
                    xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M1.15596 0.204797L5.49336 5.06317L9.8545 0.204797C10.4293 -0.452129 11.4124 0.625368 10.813 1.28143L5.90083 6.82273C5.68519 7.05909 5.32606 7.05909 5.1342 6.82273L0.174341 1.28143C-0.400433 0.6245 0.581838 -0.452151 1.15661 0.204797H1.15596Z"
                        /></svg>
          </div>
          <div class="${classesSecondary}">
            ${section.links.map(link => `<a href="${link.url}">${link.name}</a>`).join(' ')}
          </div>
        </div>
      `)
    .join(' ')}
    </nav>
  </div>
`;
}
