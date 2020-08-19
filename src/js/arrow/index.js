/*
  The classList supplied to the component should include at least the following four utility classes.
  1. A size class. (ex: cpt-icon-size-sm)
  2. An idle-state class. (example: cpt-icon-idle-orange)
  3. An on-hover class. (example: cpt-icon-hover-darkblue)
  4. An on-focus class. (example: cpt-icon-focus-darkblue)
  Maybe consider providing a default set via Javascript here.
*/
class CWDSArrow extends window.HTMLElement {
  connectedCallback () {
    const { classPrefix, classList } = this.dataset;
    this.innerHTML = `<figure class="cpt-icon ${classPrefix}-cpt-icon ${classList}" aria-hidden="true">
      <span class="cpt-icon-circle"></span>
      <span class="cpt-icon-arrow-wrapper">
        <span class="cpt-icon-arrow">
          <span class="cpt-icon-arrow-svg">
            <svg class="cpt-icon-arrow-svg-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 15"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="2"><path d="M13.1506849 1.02215525l6.5753425 6.57534247-6.5753425 6.57534248M0 7.59749772h19.7260274"></path></g></svg>
          </span>
        </span>
        <span class="cpt-icon-arrow">
          <span class="cpt-icon-arrow-svg">
            <svg class="cpt-icon-arrow-svg-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 15"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="2"><path d="M13.1506849 1.02215525l6.5753425 6.57534247-6.5753425 6.57534248M0 7.59749772h19.7260274"></path></g></svg>
          </span>
        </span>
      </span>
    </figure>`;
  }

}
window.customElements.define('cwds-arrow', CWDSArrow);