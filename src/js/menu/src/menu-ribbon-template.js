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
          <a class="" href="#">${section.title}</a>
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
