export default function (data, dataset) {
  return `<nav class="expanded-menu" role="navigation" aria-label="Site Navigation" aria-hidden="true" id="main-menu" tabindex="-1">

    <div class="expanded-menu-grid">

      <div class="expanded-menu-search" role="search">
        <form class="expanded-menu-search-form" action="${dataset.search}">
          <label class="expanded-menu-search-label" for="search-site">${dataset.labelSearch}</label>
          <input name="q" id="search-site" class="expanded-menu-search-field" type="search" placeholder="${dataset.labelPlaceholder}">
          <button class="expanded-menu-search-button" aria-label="Search the Website">
            <svg class="expanded-menu-search-button-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13.8,8.5c0-3-2.4-5.4-5.4-5.4c-3,0-5.4,2.4-5.4,5.4s2.4,5.4,5.4,5.4C11.4,13.8,13.8,11.4,13.8,8.5z M20,18.5 c0,0.8-0.7,1.5-1.5,1.5c-0.4,0-0.8-0.2-1.1-0.5l-4.1-4.1c-1.4,1-3.1,1.5-4.8,1.5C3.8,16.9,0,13.1,0,8.5S3.8,0,8.5,0
              c4.7,0,8.5,3.8,8.5,8.5c0,1.7-0.5,3.4-1.5,4.8l4.1,4.1C19.8,17.7,20,18.1,20,18.5z"/></svg>
          </button>
        </form>
      </div>

      <div class="expanded-menu-section mobile-only">
        <strong class="expanded-menu-section-header">
          <a class="expanded-menu-section-header-link expanded-menu-close-mobile" href="#">
            <svg class="expanded-menu-close-mobile-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 18"><path d="M7.7,0.4L0.4,7.9c-0.6,0.6-0.6,1.5,0,2.1l7.3,7.5c0.6,0.6,1.5,0.6,2.1,0c0.6-0.6,0.6-1.5,0-2.1L5,10.5h10.6 c0.8,0,1.5-0.7,1.5-1.5c0-0.8-0.7-1.5-1.5-1.5H5l4.8-4.9c0.3-0.3,0.4-0.7,0.4-1.1c0-0.4-0.1-0.8-0.4-1.1C9.2-0.1,8.3-0.1,7.7,0.4z"></path></svg>
          </a>
        </strong>
      </div>

      <div class="expanded-menu-section mobile-only">
        <strong class="expanded-menu-section-header">
          <a class="expanded-menu-section-header-link white" href="/">${dataset.labelHome}</a>
        </strong>
      </div>
      ${data.sections.map(section => {
        return `<div class="expanded-menu-col section-${section.title.toLowerCase().replace(/ /g,'-')}">
          <div class="expanded-menu-section">
            <strong class="expanded-menu-section-header">
              <a class="expanded-menu-section-header-link js-expandable-mobile" href="#">${section.title}</a>
              <span class="expanded-menu-section-header-arrow js-expandable-mobile"><svg class="expanded-menu-section-header-arrow-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M16,5.1c0,0.4-0.1,0.7-0.4,0.9l-6.7,6.7C8.7,13,8.4,13.1,8,13.1c-0.4,0-0.7-0.1-0.9-0.4L0.4,6C0.1,5.8,0,5.5,0,5.1	c0-0.4,0.1-0.7,0.4-0.9l0.8-0.8C1.4,3.1,1.7,3,2.1,3C2.4,3,2.8,3.1,3,3.4l5,5l5-5C13.2,3.1,13.6,3,13.9,3c0.4,0,0.7,0.1,0.9,0.4
    l0.8,0.8C15.9,4.4,16,4.7,16,5.1z"></path></svg></span>
            </strong>
            <div class="expanded-menu-dropdown">
              ${section.links.map(link => {
                return `<a class="expanded-menu-dropdown-link" href="${link.url}">${link.name}</a>`;
              }).join(' ')}
            </div>
          </div>
        </div>
        `;
      }).join(' ')}
    </div>
  </nav>
  <div class="mobile-menu-close"></div>

  <div>
    <button class="menu-trigger open-menu" aria-label="Open Menu" aria-haspopup="true" aria-expanded="false" aria-owns="mainMenu" aria-controls="mainMenu">
      <div class="hamburger">
        <div class="hamburger-box">
          <div class="hamburger-inner"></div>
        </div>
      </div>
      <div class="menu-trigger-label menu-label">${dataset.labelMenu}</div>
    </button>
  </div>`;
}
