export default function menuRibbonTemplate(data, dataset) {
  const classesPrimary = 'menu-ribbon--primary d-flex align-items-center';
  const classesSecondary = 'menu-ribbon--secondary';
  const classesNav = 'menu-ribbon--nav d-flex';
  return `
    <div class="menu-ribbon--wrapper">
    <nav role="navigation" class="${classesNav}" aria-label="Site Navigation">
      
      <div class="sr-only">
        <a class="" href="/">${dataset.labelHome}</a>
      </div>

      <!-- Primary -->
      ${data.sections.map(section => `
        <div class="${classesPrimary}">
          <button class="menu-ribbon--button" >${section.title}
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 19"><path d="M0.7,2.2l1.5-1.4C2.7,0.2,3.2,0,3.9,0s1.2,0.2,1.7,0.7L15,10l9.4-9.3c0.5-0.5,1-0.7,1.8-0.7
          c0.7,0,1.3,0.2,1.8,0.7l1.4,1.4C29.8,2.7,30,3.2,30,3.9s-0.2,1.3-0.7,1.8L16.7,18.2c-0.5,0.5-1.1,0.7-1.8,0.7s-1.3-0.2-1.8-0.7
          L0.7,5.7C0.2,5.2,0,4.6,0,3.9S0.2,2.7,0.7,2.2z"></path></svg>
          </button>
    
            <!-- Secondary -->
            <ul class="${classesSecondary}" role="listbox" id="secondary-links-${section.idx}">
              ${section.links.map(link => `<li role="option"><a href="${link.url}">${link.name}</a></li>`).join(' ')}
            </ul>
        </div>
      `)
    .join(' ')}
    </nav>
  </div>
`;
}
