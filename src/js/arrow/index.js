class CWDSArrow extends window.HTMLElement {
  connectedCallback () {
    let classPrefix = this.dataset.classPrefix;
    this.innerHTML = `<figure class="${classPrefix}-icon" aria-hidden="true">
      <span class="${classPrefix}-icon-circle"></span>
      <span class="${classPrefix}-icon-arrow-wrapper">
        <span class="${classPrefix}-icon-arrow">
          <span class="${classPrefix}-icon-arrow-svg">
            <svg class="${classPrefix}-icon-arrow-svg-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 15"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="2"><path d="M13.1506849 1.02215525l6.5753425 6.57534247-6.5753425 6.57534248M0 7.59749772h19.7260274"></path></g></svg>
          </span>
        </span>
        <span class="${classPrefix}-icon-arrow">
          <span class="${classPrefix}-icon-arrow-svg">
            <svg class="${classPrefix}-icon-arrow-svg-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 15"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="2"><path d="M13.1506849 1.02215525l6.5753425 6.57534247-6.5753425 6.57534248M0 7.59749772h19.7260274"></path></g></svg>
          </span>
        </span>
      </span>
    </figure>`;
  }

}
window.customElements.define('cwds-arrow', CWDSArrow);