import templatize from './template.js';

class LearnMoreLinks extends window.HTMLElement {
    connectedCallback() {
        // process the list...
        // todo: data-kind tags contain hints about link treatment (pdf, external, internal)
        let innerHTML = '';
        this.querySelectorAll('a').forEach(function(a,i) {
            innerHTML += templatize(a.getAttribute('href'), a.innerText);
        });
        this.innerHTML = innerHTML;
    }
}
window.customElements.define('learn-more-links', LearnMoreLinks);
